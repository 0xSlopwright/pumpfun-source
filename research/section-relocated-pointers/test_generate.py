"""Relative data pointers must be recovered from the high half of the addend."""
import hashlib
import struct
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parent))
import generate

ROOT = generate.ROOT
EXPECTED = {
    'pump': 591,
    'pump_amm': 496,
    'pump_fees': 379,
    'mayhem': 431,
}


def elf_for(program):
    sys.path.insert(0, str(ROOT / 'scripts'))
    from window_elf_reader import Elf
    return Elf(ROOT / 'evidence/original' / program / 'deployed.so')


def section(typ, addr, offset, size):
    return (0, typ, 0, addr, offset, size)


class RelocatedPointerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.archived = generate.archived_module()
        cls.corrected = generate.corrected_module()

    def test_archived_helper_is_bound(self):
        digest = hashlib.sha256(generate.HELPER.read_bytes()).hexdigest()
        self.assertEqual(digest, '805379ab5b529f77fd9207155f3bf0f19442a818749d3a55152f83007b861310')
        text = generate.HELPER.read_bytes().replace(b'\r\n', b'\n').decode()
        self.assertEqual(text.count(generate.BEFORE), 1)
        self.assertNotIn('stored >> 32', generate.BEFORE)

    def test_crlf_checkout_and_drift_are_rejected(self):
        import tempfile
        from unittest.mock import patch
        original = generate.HELPER.read_bytes().replace(b'\r\n', b'\n')
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / 'deep_section_analysis.py'
            with patch.object(generate, 'HELPER', path):
                path.write_bytes(original.replace(b'\n', b'\r\n'))
                self.assertTrue(callable(generate.corrected_module().analyze_data_layout))
                path.write_bytes(original + b'\n# changed\n')
                with self.assertRaises(ValueError):
                    generate.corrected_module()

    def test_high_half_pointer_and_lddw_are_distinct(self):
        ro = 0x500
        data = struct.pack('<Q', ro << 32) + struct.pack('<Q', 0x120)
        # high half would look like text if shifted; the lddw form must not shift
        lddw = struct.pack('<Q', (0x120 << 32) | 0x18)
        elf = SimpleNamespace(
            b=data,
            lo=0x100,
            hi=0x180,
            relocations={0: {'type': 8, 'symbol': ''}},
            secs={
                '.text': section(1, 0x100, 8, 8),
                '.rodata': section(1, ro, 0, 8),
                '.data.rel.ro': section(1, 0x300, 0, 16),
            },
        )
        before = self.archived.analyze_data_layout(elf)['.data.rel.ro']
        after = self.corrected.analyze_data_layout(elf)['.data.rel.ro']
        self.assertEqual(before['pointer_count'], 1)
        self.assertEqual(before['pointer_like_values'][0]['points_to'], '0x120')
        self.assertEqual(after['pointer_count'], 2)
        self.assertEqual(after['pointer_like_values'][0]['points_to'], hex(ro))
        self.assertEqual(after['pointer_like_values'][0]['target_section'], '.rodata')
        self.assertEqual(after['pointer_like_values'][1]['points_to'], '0x120')
        text_elf = SimpleNamespace(
            b=lddw,
            lo=0,
            hi=0x200,
            relocations={0: {'type': 8, 'symbol': ''}},
            secs={
                '.text': section(1, 0, 0, 8),
                '.rodata': section(1, 0, 0, 0),
                '.data.rel.ro': section(1, 0, 0, 8),
            },
        )
        # Scanning .data.rel.ro over the lddw bytes: slot 0 is inside text and opcode 0x18.
        self.assertEqual(
            self.corrected.analyze_data_layout(text_elf)['.data.rel.ro']['pointer_count'],
            0,
        )

    def test_original_pointer_counts_and_unchanged_neighbors(self):
        for program, expected in EXPECTED.items():
            elf = elf_for(program)
            before = self.archived.analyze_data_layout(elf)
            after = self.corrected.analyze_data_layout(elf)
            with self.subTest(program=program):
                old = before['.data.rel.ro']
                new = after['.data.rel.ro']
                self.assertEqual(old['pointer_count'] + self.relocated_landings(elf), expected)
                self.assertEqual(new['pointer_count'], expected)
                self.assertEqual(len(new['pointer_like_values']), min(expected, 200))
                self.assertEqual(before['.rodata']['pointer_count'], after['.rodata']['pointer_count'])
                for key, value in old.items():
                    if key in ('pointer_count', 'pointer_like_values'):
                        continue
                    self.assertEqual(new[key], value)
                for row in new['pointer_like_values']:
                    self.assert_lands(elf, int(row['points_to'], 16), row)

    def test_pump_rodata_pointer_witness(self):
        elf = elf_for('pump')
        address = 0x1bd710
        self.assertEqual(elf.b[address:address + 8].hex(), '00000000f0591b00')
        self.assertEqual(elf.relocations[address]['type'], 8)
        before = self.archived.analyze_data_layout(elf)['.data.rel.ro']
        after = self.corrected.analyze_data_layout(elf)['.data.rel.ro']
        self.assertNotIn(hex(address), {row['address'] for row in before['pointer_like_values']})
        witness = next(row for row in after['pointer_like_values'] if row['address'] == hex(address))
        self.assertEqual(witness['points_to'], '0x1b59f0')
        self.assertEqual(witness['target_section'], '.rodata')
        self.assertFalse(witness['in_text'])
        kept = next(row for row in after['pointer_like_values'] if row['address'] == '0x1bd740')
        self.assertEqual(kept['points_to'], '0x218')
        self.assertTrue(kept['in_text'])
        self.assertNotIn('target_section', kept)

    def test_validation_record_matches_computed_values(self):
        import json
        record = json.loads((Path(generate.__file__).parent / 'validation.json').read_text())
        self.assertEqual(set(record['archivedHelperSha256'].values()), generate.HELPER_SHA256)
        lf = generate.HELPER.read_bytes().replace(b'\r\n', b'\n')
        self.assertEqual(record['archivedHelperSha256']['lf'], hashlib.sha256(lf).hexdigest())
        for program, counts in record['pointerCounts'].items():
            elf = elf_for(program)
            with self.subTest(program=program):
                before = self.archived.analyze_data_layout(elf)['.data.rel.ro']['pointer_count']
                after = self.corrected.analyze_data_layout(elf)['.data.rel.ro']['pointer_count']
                self.assertEqual(counts, {'before': before, 'after': after})
                self.assertEqual(after, EXPECTED[program])
        witness = record['witness']
        elf = elf_for(witness['program'])
        address = int(witness['fileOffset'], 16)
        self.assertEqual(elf.b[address:address + 8].hex(), witness['bytes'])
        self.assertEqual(hex(struct.unpack_from('<Q', elf.b, address)[0]), witness['stored'])
        after = self.corrected.analyze_data_layout(elf)['.data.rel.ro']['pointer_like_values']
        row = next(row for row in after if row['address'] == witness['fileOffset'])
        self.assertEqual(row['points_to'], witness['pointsTo'])
        self.assertEqual(row['target_section'], witness['targetSection'])

    def relocated_landings(self, elf):
        sec = elf.secs['.data.rel.ro']
        start, size = sec[4], sec[5]
        count = 0
        for at, info in elf.relocations.items():
            if info['type'] != 8 or not (start <= at < start + size):
                continue
            ptr = struct.unpack_from('<Q', elf.b, at)[0] >> 32
            if self.section_name(elf, ptr):
                count += 1
        return count

    def section_name(self, elf, ptr):
        for name, row in elf.secs.items():
            if row[1] != 8 and row[5] and row[3] <= ptr < row[3] + row[5]:
                return name
        return None

    def assert_lands(self, elf, ptr, row):
        self.assertIsNotNone(self.section_name(elf, ptr))
        self.assertEqual(row['in_text'], self.section_name(elf, ptr) == '.text')


if __name__ == '__main__':
    unittest.main()
