"""Actual-input mutations test the new stage2 evidence checks; no ELF is emitted."""
import base64
import copy
import gzip
import json
from pathlib import Path
import re
import struct
import unittest
import verify as v

P = Path(__file__).resolve().parent
ORIGINAL = (v.ROOT / 'evidence/original/pump/deployed.so').read_bytes()
ACTUAL = (P / 'build/unstripped.so').read_bytes()
SECTIONS = v.base.sections(ACTUAL)
REPORT = json.loads(gzip.decompress((P / 'runtime/runtime-maintained504/outcomes.json.gz').read_bytes()))
ROW = next(row for row in REPORT['suites']['fee_sweeps'] if any('AnchorError thrown in ' in s and re.search(r':\d+\.', s) for s in row['candidate']['logs']))


def mutate(pc, offset, value, fmt):
    result = bytearray(ACTUAL)
    file_offset = SECTIONS['.text']['offset'] + pc - SECTIONS['.text']['addr']
    struct.pack_into(fmt, result, file_offset + offset, value)
    return bytes(result)


class Stage2Controls(unittest.TestCase):
    def test_actual_read_timing(self):
        v.check_read_order(ORIGINAL, ACTUAL)

    def test_zero_edge_cannot_be_inverted_into_read(self):
        with self.assertRaises(AssertionError):
            v.check_read_order(ORIGINAL, mutate(0x8dfb8, 0, 0x15, '<B'))

    def test_wrong_selected_clear_field(self):
        with self.assertRaises(AssertionError):
            v.check_read_order(ORIGINAL, mutate(0x8e198, 2, 0x80, '<h'))

    def test_wrong_quote_field_offset(self):
        with self.assertRaises(AssertionError):
            v.check_read_order(ORIGINAL, mutate(0x8e1e8, 4, 0x8, '<i'))

    def test_wrong_quote_compare_extent(self):
        with self.assertRaises(AssertionError):
            v.check_read_order(ORIGINAL, mutate(0x8e200, 4, 8, '<i'))

    def test_literal_source_coordinate_rejected(self):
        right = copy.deepcopy(ROW['candidate'])
        i = next(i for i, s in enumerate(right['logs']) if 'AnchorError thrown in ' in s and re.search(r':\d+\.', s))
        right['logs'][i] = re.sub(r':(\d+)\.', lambda m: ':' + str(int(m[1]) + 1) + '.', right['logs'][i], count=1)
        self.assertIn('strict_ordered_logs', v.producer.compare(ROW['original'], right, v.strict))

    def test_real_signature_mutation_rejected(self):
        right = copy.deepcopy(ROW['candidate'])
        raw = bytearray(base64.b64decode(right['transaction_base64'])); raw[1] ^= 1
        right['transaction_base64'] = base64.b64encode(raw).decode()
        with self.assertRaisesRegex(ValueError, 'signature verification failed'):
            v.producer.signcheck(right, v.Transaction)

    def test_only_complete_compute_line_ignored(self):
        right = copy.deepcopy(ROW['candidate'])
        right['logs'].append('Program 11111111111111111111111111111111 consumed 17 of 99 compute units')
        self.assertEqual(v.producer.compare(ROW['original'], right, v.strict), [])
        right['logs'].append('Program log: Program 11111111111111111111111111111111 consumed 17 of 99 compute units')
        self.assertIn('strict_ordered_logs', v.producer.compare(ROW['original'], right, v.strict))


if __name__ == '__main__':
    unittest.main()
