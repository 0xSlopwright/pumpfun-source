import collections
from pathlib import Path
import struct
import tempfile
import unittest
from unittest.mock import patch

import generate


def independent_counts(elf):
    """Walk actual instructions, independent of display lists and report aggregation."""
    counters = {'.rodata': collections.Counter(), '.data.rel.ro': collections.Counter()}
    for start, end in zip(elf.entries, elf.entries[1:] + [elf.hi]):
        at = start
        while at + 8 <= end:
            if elf.b[at] == 0x18 and at + 16 <= end:
                value = struct.unpack_from('<I', elf.b, at + 4)[0] | (struct.unpack_from('<I', elf.b, at + 12)[0] << 32)
                for name, counter in counters.items():
                    section = elf.secs.get(name)
                    if section and section[4] <= value < section[4] + section[5]:
                        counter[hex(value)] += 1
                at += 16
            else:
                at += 8
    return counters


class ReferenceFrequencyTests(unittest.TestCase):
    def test_all_original_windows_match_complete_instruction_counts(self):
        module = generate.corrected_module()
        import deep_section_analysis as archived
        from window_elf_reader import Elf
        for program, changed in [('pump', (29, 1)), ('pump_amm', (27, 1)), ('mayhem', (17, 2))]:
            with self.subTest(program=program):
                elf = Elf(generate.ROOT / f'evidence/original/{program}/deployed.so')
                before = archived.analyze_cross_section(elf)
                after = module.analyze_cross_section(elf)
                independent = independent_counts(elf)
                for index, (section, key) in enumerate([('.rodata', 'hot_rodata_addresses'), ('.data.rel.ro', 'hot_data_rel_ro_addresses')]):
                    expected = [{'address': a, 'ref_count': c} for a, c in independent[section].most_common(50)]
                    self.assertEqual(after[key], expected)
                    self.assertEqual(sum(row['ref_count'] != independent[section][row['address']] for row in before[key]), changed[index])
                # Per-window display caps and totals retain exactly their earlier meaning.
                for key in before.keys() - {'hot_rodata_addresses', 'hot_data_rel_ro_addresses'}:
                    self.assertEqual(before[key], after[key])
                self.assertTrue(all(len(row['rodata_addresses']) <= 20 and len(row['data_rel_ro_addresses']) <= 20 for row in after['window_data_refs']))

    def test_reviewed_checkout_forms_and_source_drift(self):
        raw = generate.SOURCE.read_bytes().replace(b'\r\n', b'\n')
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'source.py'
            with patch.object(generate, 'SOURCE', path):
                for data in (raw, raw.replace(b'\n', b'\r\n')):
                    path.write_bytes(data)
                    self.assertTrue(callable(generate.corrected_module().analyze_cross_section))
                path.write_bytes(raw + b'\n# changed\n')
                with self.assertRaisesRegex(ValueError, 'reviewed section-analysis source'):
                    generate.corrected_module()


if __name__ == '__main__':
    unittest.main()
