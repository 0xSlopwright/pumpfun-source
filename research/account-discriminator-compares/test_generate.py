"""Register jeq/jne after an account-byte load must count as a compare."""
import hashlib
import struct
import sys
import unittest
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import generate

ROOT = generate.ROOT
ADDED = {
    'pump': 23,
    'pump_amm': 16,
    'pump_fees': 4,
    'mayhem': 120,
}
NEWLY_LIKELY = {
    'pump': 10,
    'pump_amm': 5,
    'pump_fees': 4,
    'mayhem': 29,
}


def elf_for(program):
    sys.path.insert(0, str(ROOT / 'scripts'))
    from window_elf_reader import Elf
    return Elf(ROOT / 'evidence/original' / program / 'deployed.so')


def instruction(opcode, regs=0, offset=0, immediate=0):
    return struct.pack('<BBhi', opcode, regs, offset, immediate)


def register_sites(elf, start, end):
    """ldxdw from +0 whose next slot is register jeq/jne inside the archived window."""
    sites = []
    for offset in range(start, end - 16, 8):
        if elf.b[offset] != 0x79:
            continue
        if struct.unpack_from('<h', elf.b, offset + 2)[0] != 0:
            continue
        nxt = offset + 8
        if nxt < end and elf.b[nxt] in (0x1d, 0x5d):
            sites.append(offset)
    return sites


class DiscriminatorCompareTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.archived = generate.archived_module()
        cls.corrected = generate.corrected_module()

    def test_archived_helper_is_bound(self):
        digest = hashlib.sha256(generate.HELPER.read_bytes()).hexdigest()
        self.assertEqual(digest, '8200e01f582be1a267d187e6340ac2d403c22cad26bfd65e2613e19ea8a55f76')
        text = generate.HELPER.read_bytes().replace(b'\r\n', b'\n').decode()
        self.assertEqual(text.count(generate.BEFORE), 1)
        self.assertNotIn('0x1d', generate.BEFORE)

    def test_crlf_checkout_and_drift_are_rejected(self):
        original = generate.HELPER.read_bytes().replace(b'\r\n', b'\n')
        import tempfile
        from unittest.mock import patch
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'bytecode_signatures.py'
            with patch.object(generate, 'HELPER', path):
                path.write_bytes(original.replace(b'\n', b'\r\n'))
                self.assertTrue(callable(generate.corrected_module().detect_account_validation))
                path.write_bytes(original + b'\n# changed\n')
                with self.assertRaises(ValueError):
                    generate.corrected_module()

    def test_synthetic_register_compare_and_unchanged_cutoff(self):
        loaded = instruction(0x79, regs=0x61)  # ldxdw r1, [r6+0]
        data = loaded + instruction(0x5d, regs=0x71)
        archived = self.archived.detect_account_validation
        corrected = self.corrected.detect_account_validation
        self.assertEqual(archived(type('E', (), {'b': data})(), 0, 24)['discriminator_checks'], 0)
        self.assertEqual(corrected(type('E', (), {'b': data})(), 0, 24)['discriminator_checks'], 1)
        jeq = loaded + instruction(0x1d, regs=0x21)
        self.assertEqual(corrected(type('E', (), {'b': jeq})(), 0, 24)['discriminator_checks'], 1)
        kept = loaded + instruction(0x15)
        self.assertEqual(corrected(type('E', (), {'b': kept})(), 0, 24)['discriminator_checks'], 1)
        self.assertEqual(corrected(type('E', (), {'b': data})(), 0, 16)['discriminator_checks'], 0)
        shifted = instruction(0x79, regs=0x61, offset=8) + instruction(0x5d, regs=0x71)
        self.assertEqual(corrected(type('E', (), {'b': shifted})(), 0, 24)['discriminator_checks'], 0)

    def test_originals_gain_only_register_compares_of_the_loaded_register(self):
        for program, added in ADDED.items():
            elf = elf_for(program)
            gained = newly = 0
            opcodes = Counter()
            for start, end in zip(elf.entries, elf.entries[1:] + [elf.hi]):
                before = self.archived.detect_account_validation(elf, start, end)
                after = self.corrected.detect_account_validation(elf, start, end)
                sites = register_sites(elf, start, end)
                with self.subTest(program=program, window=hex(start)):
                    self.assertEqual(after['owner_field_accesses'], before['owner_field_accesses'])
                    self.assertEqual(after['discriminator_checks'], before['discriminator_checks'] + len(sites))
                    self.assertEqual(after['likely_account_validation'], after['discriminator_checks'] >= 1)
                    for offset in sites:
                        dst = elf.b[offset + 1] & 15
                        regs = elf.b[offset + 8 + 1]
                        self.assertIn(dst, (regs & 15, regs >> 4))
                        opcodes[elf.b[offset + 8]] += 1
                gained += len(sites)
                if before['discriminator_checks'] == 0 and sites:
                    newly += 1
            self.assertEqual(gained, added)
            self.assertEqual(dict(opcodes), {0x5d: added})
            self.assertEqual(newly, NEWLY_LIKELY[program])

    def test_pump_register_jne_witness(self):
        elf = elf_for('pump')
        address = 0xd6a8
        self.assertEqual(elf.b[address:address + 16].hex(), '79610000000000005d17040000000000')
        start = 0xd5d0
        end = start + 680
        self.assertLessEqual(start, address)
        self.assertLess(address + 16, end)
        before = self.archived.detect_account_validation(elf, start, end)
        after = self.corrected.detect_account_validation(elf, start, end)
        self.assertEqual(before['discriminator_checks'], 0)
        self.assertFalse(before['likely_account_validation'])
        self.assertEqual(after['discriminator_checks'], 1)
        self.assertTrue(after['likely_account_validation'])
        self.assertEqual(before['owner_field_accesses'], after['owner_field_accesses'])


if __name__ == '__main__':
    unittest.main()
