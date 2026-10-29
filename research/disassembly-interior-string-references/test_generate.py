from pathlib import Path
import struct
import tempfile
import unittest
from unittest.mock import patch

import generate


class InteriorStringTests(unittest.TestCase):
    def test_all_relocated_original_string_references_match_actual_byte_suffixes(self):
        module = generate.corrected_module()
        from window_elf_reader import Elf
        for program, expected_added in [('pump', 2331), ('pump_amm', 1611), ('mayhem', 859)]:
            with self.subTest(program=program):
                elf = Elf(generate.ROOT / f'evidence/original/{program}/deployed.so')
                strings = module.extract_rodata_strings(elf)
                starts = sorted(strings)
                section = elf.secs['.rodata']
                begin, end = section[4], section[4] + section[5]
                added = 0
                for site, relocation in elf.relocations.items():
                    if relocation['type'] != 8 or not elf.lo <= site < elf.hi or elf.b[site] != 0x18:
                        continue
                    address = struct.unpack_from('<I', elf.b, site+4)[0] | (struct.unpack_from('<I', elf.b, site+12)[0] << 32)
                    expected = None
                    if begin <= address < end:
                        stop = address
                        while stop < end and 32 <= elf.b[stop] < 127:
                            stop += 1
                        if stop - address >= 4:
                            expected = elf.b[address:stop].decode('ascii')
                    actual = generate.string_at(elf, strings, starts, address, site)
                    self.assertEqual(actual, expected)
                    added += actual is not None and address not in strings
                self.assertEqual(added, expected_added)

    def test_direct_starts_short_suffixes_and_unbound_interiors(self):
        from types import SimpleNamespace
        strings = {100: 'abcdefgh'}
        elf = SimpleNamespace(relocations={0: {'type': 8}, 8: {'type': 10}})
        self.assertEqual(generate.string_at(elf, strings, [100], 100, 99), 'abcdefgh')
        self.assertEqual(generate.string_at(elf, strings, [100], 104, 0), 'efgh')
        for address, site in [(99, 0), (105, 0), (200, 0), (104, 8), (104, 99)]:
            self.assertIsNone(generate.string_at(elf, strings, [100], address, site))

    def test_reviewed_checkout_forms_and_source_drift(self):
        raw = generate.SOURCE.read_bytes().replace(b'\r\n', b'\n')
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'source.py'
            with patch.object(generate, 'SOURCE', path):
                for data in (raw, raw.replace(b'\n', b'\r\n')):
                    path.write_bytes(data)
                    self.assertTrue(callable(generate.corrected_module().main))
                path.write_bytes(raw + b'\n# drift\n')
                with self.assertRaisesRegex(ValueError, 'reviewed disassembler source'):
                    generate.corrected_module()


if __name__ == '__main__':
    unittest.main()
