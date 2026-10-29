import collections
import copy
import importlib.util
import json
import pathlib
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    'verify_bindings', ROOT / 'scripts/verify-bindings.py'
)
verify_bindings = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verify_bindings)


def load(name):
    return json.loads((ROOT / 'contracts' / name).read_text(encoding='utf-8'))


class BindingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.bindings = load('developer-bindings.json')
        cls.coverage = load('coverage.json')

    def mutated(self):
        return copy.deepcopy(self.bindings), copy.deepcopy(self.coverage)

    def entry(self, bindings, operation):
        return next(
            entry for entry in bindings['bindings']
            if entry['operation'] == operation
        )

    def assertRejects(self, bindings, coverage, message):
        with self.assertRaisesRegex(ValueError, message):
            verify_bindings.verify(bindings=bindings, coverage=coverage)

    def test_checked_in_ledger_verifies_complete_inventory(self):
        self.assertEqual(verify_bindings.verify(), (67, 67, 1))
        self.assertEqual(len({entry['operation'] for entry in self.bindings['bindings']}), 67)

    def test_scope_inventory_matches_documented_denominator(self):
        counts = collections.Counter(
            entry['scope'] for entry in self.bindings['bindings']
        )
        self.assertEqual(
            counts,
            {
                'content.read': 18,
                'graph.read': 17,
                'leaderboards.read': 11,
                'moderation.read': 1,
                'positions.read': 7,
                'profiles.read': 13,
            },
        )

    def test_leaderboards_only_schema_remains_backward_compatible(self):
        bindings, coverage = self.mutated()
        bindings['boundScopes'] = ['leaderboards.read']
        bindings['bindings'] = [
            entry for entry in bindings['bindings']
            if entry['scope'] == 'leaderboards.read'
        ]
        coverage['developerApi']['contractBound'] = 11
        self.assertEqual(
            verify_bindings.verify(bindings=bindings, coverage=coverage),
            (11, 67, 1),
        )

    def test_reordered_complete_bindings_remain_valid(self):
        bindings, coverage = self.mutated()
        bindings['bindings'].reverse()
        self.assertEqual(
            verify_bindings.verify(bindings=bindings, coverage=coverage),
            (67, 67, 1),
        )

    def test_every_binding_stays_unimplemented_and_unqualified(self):
        for entry in self.bindings['bindings'] + self.bindings['observedNotDeclared']:
            self.assertIs(entry['implemented'], False)
            self.assertIs(entry['qualified'], False)
        for entry in self.bindings['bindings']:
            self.assertEqual(entry['origin']['websiteCallOrigin'], 'unresolved')
        self.assertEqual(self.coverage['developerApi']['implementedNatively'], 0)
        self.assertEqual(self.coverage['developerApi']['qualified'], 0)

    def test_captured_contract_has_exact_complete_inventory(self):
        source = (
            ROOT / 'evidence/web/objects/2b47dd0b38a1608f.js'
        ).read_text(encoding='utf-8')
        routes = verify_bindings.captured_routes(source)
        self.assertEqual(len(routes), 68)
        self.assertEqual(
            set(routes) - {entry['operation'] for entry in self.bindings['bindings']},
            {'GET /competitions/{id}/entries/{entryId}/positions'},
        )
        self.assertIn(
            'REPLY_NOT_FOUND',
            routes['GET /callout/replies/{replyId}/chain']['errorCodes'],
        )

    def test_utf16_offsets_count_non_ascii_as_code_units(self):
        source = 'a😀b'
        self.assertEqual(verify_bindings.utf16_length(source), 4)
        self.assertEqual(verify_bindings.utf16_slice(source, 1, 3), '😀')

    def test_rejects_wrong_scope(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /pnl-leaderboard')['scope'] = 'positions.read'
        self.assertRejects(bindings, coverage, 'scope differs from spec')

    def test_rejects_wrong_method_or_path(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /home-feed')['operation'] = 'POST /home-feed'
        self.assertRejects(bindings, coverage, 'not a documented developer operation')

    def test_rejects_wrong_operation_id(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /users/{id}')['operationId'] = 'get_wrong_user'
        self.assertRejects(bindings, coverage, 'operationId differs from spec')

    def test_rejects_wrong_auth(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /posts')['auth']['declared'] = 'cookie'
        self.assertRejects(bindings, coverage, 'auth evidence pointer differs')

    def test_rejects_wrong_error_code_contract(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /callout/{calloutId}')['auth'][
            'keyedErrorCodesMatchCapturedContract'
        ] = False
        self.assertRejects(bindings, coverage, 'error-code list differs')

    def test_rejects_missing_operation(self):
        bindings, coverage = self.mutated()
        bindings['bindings'] = [
            entry for entry in bindings['bindings']
            if entry['operation'] != 'GET /payouts/leaderboard'
        ]
        coverage['developerApi']['contractBound'] = len(bindings['bindings'])
        self.assertRejects(bindings, coverage, 'missing bindings')

    def test_rejects_duplicate_binding(self):
        bindings, coverage = self.mutated()
        bindings['bindings'].append(copy.deepcopy(bindings['bindings'][0]))
        self.assertRejects(bindings, coverage, 'duplicate binding')

    def test_rejects_wrong_captured_source(self):
        bindings, coverage = self.mutated()
        contract = self.entry(bindings, 'GET /posts')['evidence']['contract']
        contract['source'] = 'evidence/web/objects/not-captured.js'
        self.assertRejects(bindings, coverage, 'not a captured manifest object')

    def test_rejects_tampered_hash(self):
        bindings, coverage = self.mutated()
        contract = self.entry(bindings, 'GET /competitions')['evidence']['contract']
        contract['sha256'] = '0' * 64
        self.assertRejects(bindings, coverage, 'contract sha256')

    def test_rejects_contract_offset_drift(self):
        bindings, coverage = self.mutated()
        contract = self.entry(bindings, 'GET /competitions')['evidence']['contract']
        contract['start'] += 1
        contract['end'] += 1
        self.assertRejects(bindings, coverage, 'UTF-16 range differs')

    def test_rejects_call_site_offset_drift(self):
        bindings, coverage = self.mutated()
        site = self.entry(bindings, 'GET /pnl-leaderboard')['evidence'][
            'clientCallSites'
        ][0]
        site['start'] += 1
        self.assertRejects(bindings, coverage, 'call-site range')

    def test_rejects_missing_client_call_site(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /pnl-leaderboard/groups')['evidence'][
            'clientCallSites'
        ].pop()
        self.assertRejects(bindings, coverage, 'differ from internal-operations')

    def test_rejects_incorrect_call_site_attribution(self):
        bindings, coverage = self.mutated()
        source = self.entry(bindings, 'GET /pnl-leaderboard')['evidence'][
            'clientCallSites'
        ][0]
        self.entry(bindings, 'GET /posts')['evidence']['clientCallSites'].append(
            copy.deepcopy(source)
        )
        self.assertRejects(bindings, coverage, 'operation literal')

    def test_rejects_qualified_claim(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /competitions')['qualified'] = True
        self.assertRejects(bindings, coverage, 'qualification')

    def test_rejects_implemented_claim(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /competitions')['implemented'] = True
        self.assertRejects(bindings, coverage, 'implementation')

    def test_rejects_coverage_implementation_claims(self):
        bindings, coverage = self.mutated()
        coverage['developerApi']['implementedNatively'] = 1
        self.assertRejects(bindings, coverage, 'must not claim native')
        bindings, coverage = self.mutated()
        coverage['developerApi']['qualified'] = 1
        self.assertRejects(bindings, coverage, 'must not claim qualified')

    def test_rejects_unrecorded_undeclared_route(self):
        bindings, coverage = self.mutated()
        bindings['observedNotDeclared'] = []
        self.assertRejects(bindings, coverage, 'neither bound nor recorded')

    def test_rejects_undeclared_route_in_denominator(self):
        bindings, coverage = self.mutated()
        bindings['observedNotDeclared'][0]['countedInDeveloperDenominator'] = True
        self.assertRejects(bindings, coverage, 'outside the documented denominator')

    def test_rejects_resolved_website_origin_claim(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /competitions')['origin'][
            'websiteCallOrigin'
        ] = 'https://api.pump.fun/v1'
        self.assertRejects(bindings, coverage, 'website call origin')

    def test_rejects_stale_bound_scopes(self):
        bindings, coverage = self.mutated()
        bindings['boundScopes'].remove('profiles.read')
        self.assertRejects(bindings, coverage, 'not declared in boundScopes')

    def test_rejects_stale_coverage_count(self):
        bindings, coverage = self.mutated()
        coverage['developerApi']['contractBound'] = 66
        self.assertRejects(bindings, coverage, 'contractBound')

    def test_rejects_falsely_reviewed_internal_denominator(self):
        bindings, coverage = self.mutated()
        coverage['internalApi']['candidateDenominatorReviewed'] = True
        self.assertRejects(bindings, coverage, 'outside this binding ledger')

    def test_rejects_wrong_feature_or_product_scope(self):
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /posts')['feature'] = 'profile'
        self.assertRejects(bindings, coverage, 'feature category')
        bindings, coverage = self.mutated()
        self.entry(bindings, 'GET /posts')['productScope'] = 'excluded'
        self.assertRejects(bindings, coverage, 'product scope')


if __name__ == '__main__':
    unittest.main()
