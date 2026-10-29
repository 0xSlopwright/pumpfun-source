"""Negative controls drawn from actual canonical Sweep outcomes; no new VM runs."""
import base64
import copy
import gzip
import json
import re
import unittest
from pathlib import Path
import sys
import replay
from solders.transaction import Transaction

P = Path(__file__).resolve().parent
sys.path.insert(0, str(P.parents[3] / 'scripts'))
import pump_strict_ordered_logs as strict
REPORT = json.loads(gzip.decompress((P / 'baseline-maintained504/outcomes.json.gz').read_bytes()))
ROW = next(row for row in REPORT['suites']['fee_sweeps']
           if any('AnchorError thrown in ' in line and re.search(r':\d+\.', line)
                  for line in row['candidate']['logs']))


class ReplayControls(unittest.TestCase):
    def setUp(self):
        self.left = copy.deepcopy(ROW['original'])
        self.right = copy.deepcopy(ROW['candidate'])

    def diff(self):
        return replay.compare(self.left, self.right, strict)

    def test_actual_pair(self):
        self.assertEqual(self.diff(), [])

    def test_source_coordinate_change(self):
        i = next(i for i, s in enumerate(self.right['logs']) if 'AnchorError thrown in ' in s and re.search(r':\d+\.', s))
        self.right['logs'][i] = re.sub(r':(\d+)\.', lambda m: ':' + str(int(m[1]) + 1) + '.', self.right['logs'][i], count=1)
        self.assertIn('strict_ordered_logs', self.diff())

    def test_missing_or_added_log(self):
        self.right['logs'].append('Program log: extra')
        self.assertIn('strict_ordered_logs', self.diff())

    def test_log_order(self):
        lines = self.right['logs']
        i = next(i for i, s in enumerate(lines) if not strict.UNITS.fullmatch(s))
        j = next(j for j in range(i + 1, len(lines)) if not strict.UNITS.fullmatch(lines[j]) and lines[j] != lines[i])
        lines[i], lines[j] = lines[j], lines[i]
        self.assertIn('strict_ordered_logs', self.diff())

    def test_complete_compute_line_only(self):
        self.right['logs'].append('Program 11111111111111111111111111111111 consumed 17 of 99 compute units')
        self.assertEqual(self.diff(), [])

    def test_compute_lookalike_not_removed(self):
        self.right['logs'].append('Program log: Program 11111111111111111111111111111111 consumed 17 of 99 compute units')
        self.assertIn('strict_ordered_logs', self.diff())

    def test_actual_serialized_signature(self):
        replay.signcheck(self.right, Transaction)
        raw = bytearray(base64.b64decode(self.right['transaction_base64']))
        raw[1] ^= 1
        self.right['transaction_base64'] = base64.b64encode(raw).decode()
        with self.assertRaisesRegex(ValueError, 'signature verification failed'):
            replay.signcheck(self.right, Transaction)

    def test_state_and_return_data(self):
        self.right['after'] = {}
        self.right['metadata']['return_data'] = {'changed': True}
        self.assertIn('after', self.diff())
        self.assertIn('metadata.return_data', self.diff())


if __name__ == '__main__':
    unittest.main()
