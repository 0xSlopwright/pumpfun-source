"""Signed less-than branches that guard an immediate move must be retained."""
import hashlib
import struct
import sys
import unittest
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import generate

ROOT = generate.ROOT
EXPECTED = {
    'pump': {0xc5: 22, 0xcd: 1},
    'pump_amm': {0xc5: 16},
    'pump_fees': {0xc5: 13},
    'mayhem': {0xc5: 1, 0xd5: 4},
}


def elf_for(program):
    from window_elf_reader import Elf
    return Elf(ROOT / 'evidence/original' / program / 'deployed.so')


def added_opcodes(elf, before, after):
    old = {row['address'] for row in before}
    counts = Counter()
    for row in after:
        if row['address'] in old:
            continue
        counts[elf.b[row['address']]] += 1
    return counts


class SignedCompareErrorTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.archived = generate.archived_module()
        cls.corrected = generate.corrected_module()

    def test_archived_helper_is_bound(self):
        digest = hashlib.sha256(generate.HELPER.read_bytes()).hexdigest()
        self.assertEqual(digest, '8200e01f582be1a267d187e6340ac2d403c22cad26bfd65e2613e19ea8a55f76')
        text = generate.HELPER.read_bytes().replace(b'\r\n', b'\n').decode()
        self.assertEqual(text.count(generate.BEFORE), 1)
        self.assertNotIn('0xc5', generate.BEFORE)

    def test_originals_gain_only_signed_less_branches(self):
        for program, expected in EXPECTED.items():
            elf = elf_for(program)
            before = generate.collect(self.archived, elf)
            after = generate.collect(self.corrected, elf)
            with self.subTest(program=program):
                self.assertGreater(len(after), len(before))
                self.assertEqual(dict(added_opcodes(elf, before, after)), expected)
                old = {row['address'] for row in before}
                for row in after:
                    if row['address'] in old:
                        continue
                    target = row['address'] + 8 + struct.unpack_from('<h', elf.b, row['address'] + 2)[0] * 8
                    # branch_target_offset is relative to the window, not the file.
                    self.assertIn(elf.b[target], (0xb4, 0xb7))
                    self.assertEqual(struct.unpack_from('<i', elf.b, target + 4)[0], row['error_code'])

    def test_pump_jslt_witness(self):
        elf = elf_for('pump')
        address = 0x2af38
        self.assertEqual(elf.b[address:address + 8].hex(), 'c504a80000000000')
        before = generate.collect(self.archived, elf)
        after = generate.collect(self.corrected, elf)
        self.assertNotIn(address, {row['address'] for row in before})
        rows = [row for row in after if row['address'] == address]
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]['error_code'], 96)
        self.assertEqual(rows[0]['type'], 'conditional_error')


if __name__ == '__main__':
    unittest.main()
