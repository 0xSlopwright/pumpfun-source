"""Byte-level checks for concatenated instruction-log names."""
import json
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
import recover

ROOT = recover.ROOT


class InstructionLogNameTests(unittest.TestCase):
    def test_archived_helper_is_bound(self):
        digest = recover.require_archived_helper()
        self.assertIn(digest, recover.HELPER_SHA256)

    def test_glued_names_split_at_idl_boundaries(self):
        published = json.loads((ROOT / 'evidence/binary-analysis.json').read_text())
        expected_removed = {
            'pump': {
                'BuyCreateV2Disabled',
                'IdlResizeAccountdata',
                'UpdateBuybackConfigAn',
                'AddQuoteControlMintBuybackFeeRecipientNotAuthorizedA',
            },
            'pump_amm': {
                'ClaimCashbacksol',
                'IdlCreateAccountanchor',
                'IdlResizeAccountdata',
                'UpdateBuybackConfigAn',
            },
            'pump_fees': {
                'Withdrawaccountsol',
                'ClaimSocialFeePdaV2ProgramError',
                'CrankDonationFeePdaFee',
                'IdlCreateAccountanchor',
                'IdlResizeAccountdata',
            },
        }
        expected_added = {
            'pump': {'Buy', 'IdlResizeAccount', 'UpdateBuybackConfig', 'AddQuoteControlMint', 'SetQuoteControlMintReserves'},
            'pump_amm': {'ClaimCashback', 'IdlCreateAccount', 'IdlResizeAccount', 'UpdateBuybackConfig'},
            'pump_fees': {'Withdraw', 'ClaimSocialFeePdaV2', 'CrankDonationFeePda', 'IdlCreateAccount', 'IdlResizeAccount'},
        }
        for program in recover.PROGRAMS:
            blob = recover.program_blob(program)
            allowed = recover.allowed_names(program)
            archived = recover.archived_names(blob)
            corrected = recover.corrected_names(blob, allowed)
            self.assertEqual(archived, published[program]['instruction_log_names'])
            self.assertTrue(expected_removed[program] <= set(archived) - set(corrected))
            self.assertTrue(expected_added[program] <= set(corrected))
            self.assertTrue(expected_removed[program].isdisjoint(corrected))
            if program == 'pump':
                self.assertTrue(any(len(name) > 200 for name in archived))
                self.assertLessEqual(max(len(name) for name in corrected), 40)
            for row in recover.instruction_sites(blob, allowed):
                prefix = b'Instruction: ' + row['name'].encode()
                self.assertEqual(blob[row['offset']:row['offset'] + len(prefix)], prefix)
                # A longer allowed name must not also be a prefix here.
                longer = [name for name in allowed if name.startswith(row['name']) and name != row['name']]
                for name in longer:
                    self.assertFalse(blob.startswith(b'Instruction: ' + name.encode(), row['offset']))

    def test_witness_bytes(self):
        witnesses = {
            'pump': (
                b'Instruction: BuyCreateV2Disabled',
                'Buy',
            ),
            'pump_amm': (
                b'Instruction: ClaimCashbacksol_destination',
                'ClaimCashback',
            ),
            'pump_fees': (
                b'Instruction: Withdrawaccountsol_destinat',
                'Withdraw',
            ),
        }
        for program, (raw, name) in witnesses.items():
            blob = recover.program_blob(program)
            offset = blob.find(raw)
            self.assertGreaterEqual(offset, 0)
            allowed = recover.allowed_names(program)
            sites = [row for row in recover.instruction_sites(blob, allowed) if row['offset'] == offset]
            self.assertEqual([row['name'] for row in sites], [name])
            archived = recover.ARCHIVED_PATTERN.search(blob, offset).group(1).decode()
            self.assertNotEqual(archived, name)
            self.assertTrue(archived.startswith(name))

    def test_longer_idl_name_wins(self):
        blob = recover.program_blob('pump')
        offset = blob.find(b'Instruction: BuyV2')
        self.assertGreaterEqual(offset, 0)
        # Do not accept a site that is actually BuyCreate...
        self.assertFalse(blob.startswith(b'Instruction: BuyCreate', offset))
        sites = recover.instruction_sites(blob, recover.allowed_names('pump'))
        self.assertEqual(next(row['name'] for row in sites if row['offset'] == offset), 'BuyV2')

    def test_mayhem_archived_names_are_already_bounded(self):
        blob = recover.program_blob('mayhem')
        for match in recover.ARCHIVED_PATTERN.finditer(blob):
            nxt = blob[match.end():match.end() + 12]
            bounded = nxt.startswith(b'Instruction:') or not nxt[:1].isalnum()
            self.assertTrue(bounded, match.group(1))

    def test_validation_json_matches_recover(self):
        """validation.json is hand-written; every recorded value must be recomputable here."""
        validation = json.loads((Path(__file__).resolve().parent / 'validation.json').read_text())
        self.assertIn(recover.require_archived_helper(), set(validation['archivedHelperSha256'].values()))
        self.assertEqual(set(validation['archivedHelperSha256'].values()), recover.HELPER_SHA256)
        for witness in validation['witnesses']:
            blob = recover.program_blob(witness['program'])
            offset = int(witness['fileOffset'], 16)
            raw = witness['bytes'].encode()
            self.assertEqual(blob[offset:offset + len(raw)], raw)
            archived = recover.ARCHIVED_PATTERN.match(blob, offset).group(1).decode()
            self.assertEqual(archived, witness['before'])
            sites = recover.instruction_sites(blob, recover.allowed_names(witness['program']))
            self.assertEqual([row['name'] for row in sites if row['offset'] == offset], [witness['after']])
        blob = recover.program_blob('pump')
        allowed = recover.allowed_names('pump')
        long_name = validation['pumpLongName']
        archived = [name for name in recover.archived_names(blob) if name.startswith(long_name['beforePrefix'])]
        self.assertIn(long_name['beforeLength'], [len(name) for name in archived])
        self.assertIn(long_name['after'], recover.corrected_names(blob, allowed))
        for program in recover.PROGRAMS:
            blob = recover.program_blob(program)
            allowed = recover.allowed_names(program)
            archived = recover.archived_names(blob)
            corrected = recover.corrected_names(blob, allowed)
            counts = validation['counts'][program]
            self.assertEqual(counts['sites'], len(recover.instruction_sites(blob, allowed)))
            self.assertEqual(counts['archivedNames'], len(archived))
            self.assertEqual(counts['correctedNames'], len(corrected))
            self.assertEqual(counts['replacedNames'], len(set(archived) - set(corrected)))
        mayhem = recover.program_blob('mayhem')
        self.assertEqual(validation['counts']['mayhem']['sites'], mayhem.count(b'Instruction: '))
        self.assertEqual(validation['counts']['mayhem']['sites'], len(recover.archived_names(mayhem)))


if __name__ == '__main__':
    unittest.main()
