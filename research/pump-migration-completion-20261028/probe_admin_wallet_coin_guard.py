#!/usr/bin/env python3
"""Signed original-backed admin wallet validation/CPI ordering counterexamples."""
import argparse, base64, gzip, hashlib, json, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
import pump_admin_cto_differential as f
from solders.transaction import Transaction

def require(ok, message):
    if not ok:
        raise ValueError(message)
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def cases():
    result = []
    for family in ['token', 'token22', 'native']:
        program = f.TOKEN if family != 'token22' else f.Pubkey.from_string('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')
        quote = {} if family == 'native' else {'quote': str(f.Pubkey.from_bytes(bytes([88]) * 32))}
        base = {'current': str(f.OTHER.pubkey()), 'current_writable': True, 'token_program': str(program), **quote}
        malformed = {'data': '00', 'lamports': 2039280, 'owner': str(program)}
        for kind in ['coin-malformed', 'coin-and-destination-malformed', 'frozen-source-coin-malformed', 'source-and-coin-malformed', 'coin-empty', 'coin-valid-frozen']:
            accounts = {'creator_vault_quote_token_account': {'tokens': 1000}, 'coin_creator_vault_ata': dict(malformed)}
            if kind == 'coin-and-destination-malformed':
                accounts['current_creator_quote_token_account'] = {'tokens': 0, 'patches': [[0, bytes([99] * 32).hex()]]}
            if kind == 'frozen-source-coin-malformed':
                accounts['creator_vault_quote_token_account']['patches'] = [[108, '02']]
            if kind == 'source-and-coin-malformed':
                accounts['creator_vault_quote_token_account'] = dict(malformed)
            if kind == 'coin-empty':
                accounts['coin_creator_vault_ata'] = {'data': '', 'owner': str(f.Pubkey.default()), 'lamports': 0}
            if kind == 'coin-valid-frozen':
                accounts['coin_creator_vault_ata'] = {'tokens': 0, 'patches': [[108, '02']]}
            result.append({'name': family + '-' + kind, **base, 'accounts': accounts})
    return result
def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--baseline', type=Path, required=True)
    p.add_argument('--candidate', type=Path)
    p.add_argument('--output', type=Path, required=True)
    a = p.parse_args()
    baseline = a.baseline.resolve()
    original = ROOT / 'evidence/original/pump/deployed.so'
    paths = [Path(__file__), Path(f.__file__), baseline, original]
    if a.candidate:
        paths.append(a.candidate.resolve())
    inputs = {str(path): sha(path) for path in paths}
    rows, signatures = [], 0
    for case in cases():
        binaries = [('original', None), ('baseline', baseline)]
        if a.candidate:
            binaries.append(('candidate', a.candidate.resolve()))
        observations = {name: f.run(case, binary) for name, binary in binaries}
        for observed in observations.values():
            raw = base64.b64decode(observed['transaction_base64'])
            tx = Transaction.from_bytes(raw)
            checks = tx.verify_with_results()
            require(checks and all(checks) and observed['signatures_verified'] and not observed['pool_authority_top_level_signer'], 'ordinary signature or boundary signer control failed')
            signatures += len(checks)
        fields = ['error', 'before', 'after', 'events', 'inner', 'return']
        differences = {name: [key for key in fields if observations['original'][key] != observed[key]] for name, observed in observations.items() if name != 'original'}
        messages = {name: [line for line in observed['logs'] if line.startswith(('Program log: ', 'Program data: '))] for name, observed in observations.items()}
        matched = {name: messages[name] == messages['original'] for name in differences}
        rows.append({'case': case, 'different_structured_fields': differences, 'ordered_program_messages_equal': matched, **observations})
        print(json.dumps({'name': case['name'], 'differences': differences, 'messages_equal': matched,
            'errors': {name: observed['error'] for name, observed in observations.items()}}), flush=True)
    require(all(sha(Path(path)) == digest for path, digest in inputs.items()), 'runtime input changed')
    report = {'scope': __doc__, 'producer_sha256': sha(Path(__file__)), 'inputs': inputs, 'case_count': len(rows),
        'signature_fields_verified': signatures, 'candidate_mismatches': [row['case']['name'] for row in rows if a.candidate and (row['different_structured_fields']['candidate'] or not row['ordered_program_messages_equal']['candidate'])],
        'baseline_mismatches': [row['case']['name'] for row in rows if row['different_structured_fields']['baseline'] or not row['ordered_program_messages_equal']['baseline']], 'cases': rows}
    a.output.write_bytes(gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0))
    require(not report['candidate_mismatches'], 'candidate mismatch; retained')
if __name__ == '__main__':
    main()
