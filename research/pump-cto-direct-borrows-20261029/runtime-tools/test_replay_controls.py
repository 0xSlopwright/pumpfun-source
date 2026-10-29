#!/usr/bin/env python3
"""Use retained actual signed outcomes to challenge the strict replay verifier."""
import base64
import argparse
import copy
from pathlib import Path
import unittest

from verify_results import read, verify

P = Path(__file__).resolve().parent
REFERENCE = read(P/'inputs/reference-admin-wallet.json.gz')
CONTROL = next(value for name, value in REFERENCE['inputs'].items()
               if 'pump-create-used-boundaries-20261028/artifacts/candidate.so' in name)
CANDIDATE = read(P/'INPUTS.json')['current_control_sha256']
PARSER = argparse.ArgumentParser()
PARSER.add_argument('--repo', type=Path, default=P.parents[2])
ARGS = PARSER.parse_args()


class Controls(unittest.TestCase):
    def check(self, report):
        return verify(report, None, CONTROL, CANDIDATE, reference=True, repo=ARGS.repo)

    def test_added_Source_record_rejected(self):
        report = copy.deepcopy(REFERENCE)
        lines = report['cases'][0]['candidate']['logs']
        # This is intentionally forged diagnostic input, not an original site.
        lines.append('Program log: altered Source record programs/pump/src/creator/admin_cto.rs:0.')
        with self.assertRaisesRegex(ValueError, 'ordered non-CU logs'):
            self.check(report)

    def test_CPI_invoke_order_change_rejected(self):
        report = copy.deepcopy(REFERENCE)
        lines = report['cases'][0]['candidate']['logs']
        index = next(index for index, line in enumerate(lines) if ' invoke [' in line)
        lines[index] += ' changed'
        with self.assertRaisesRegex(ValueError, 'ordered non-CU logs'):
            self.check(report)

    def test_invalid_actual_signature_rejected(self):
        report = copy.deepcopy(REFERENCE)
        raw = bytearray(base64.b64decode(report['cases'][0]['original']['transaction_base64']))
        raw[1] ^= 1
        forged = base64.b64encode(raw).decode()
        for label in ['original', 'baseline', 'candidate']:
            report['cases'][0][label]['transaction_base64'] = forged
        with self.assertRaisesRegex(ValueError, 'actual signatures'):
            self.check(report)

    def test_exact_compute_line_variation_allowed(self):
        report = copy.deepcopy(REFERENCE)
        lines = report['cases'][0]['candidate']['logs']
        index = next(index for index, line in enumerate(lines) if ' compute units' in line)
        lines[index] = 'Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P consumed 1 of 1400000 compute units'
        self.check(report)


if __name__ == '__main__':
    unittest.main(argv=[__file__])
