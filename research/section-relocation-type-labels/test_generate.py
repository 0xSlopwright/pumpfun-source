from collections import Counter
from pathlib import Path
import struct
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

import generate


class RelocationLabelTests(unittest.TestCase):
    def test_all_original_records_retain_everything_except_type_labels(self):
        module = generate.corrected_module()
        import deep_section_analysis as archived
        from window_elf_reader import Elf
        for program, expected in [('pump', {8: 5877, 10: 270}), ('pump_amm', {8: 4225, 10: 174}), ('mayhem', {8: 2414, 10: 134})]:
            with self.subTest(program=program):
                elf = Elf(generate.ROOT / f'evidence/original/{program}/deployed.so')
                before = archived.analyze_relocations(elf)
                after = module.analyze_relocations(elf)
                section = elf.secs['.rel.dyn']
                raw_counts = Counter(struct.unpack_from('<Q', elf.b, at + 8)[0] & 0xffffffff for at in range(section[4], section[4] + section[5], 16))
                self.assertEqual(raw_counts, expected)
                self.assertEqual(after['type_distribution'], {generate.TYPE_NAMES[k]: v for k, v in expected.items()})
                for old, new in zip(before['entries'], after['entries']):
                    self.assertEqual(new['type'], generate.TYPE_NAMES[new['type_id']])
                    self.assertEqual({k: v for k, v in old.items() if k != 'type'}, {k: v for k, v in new.items() if k != 'type'})
                for key in before.keys() - {'entries', 'type_distribution'}:
                    self.assertEqual(before[key], after[key])

    def test_supported_types_unknowns_and_absent_table(self):
        module = generate.corrected_module()
        ids = (0, 1, 2, 8, 10, 999)
        data = b''.join(struct.pack('<QQ', 1000, typ) for typ in ids)
        elf = SimpleNamespace(b=data, secs={'.rel.dyn': (0, 0, 0, 0, 0, len(data))}, symbols={}, lo=0, hi=0)
        rows = module.analyze_relocations(elf)['entries']
        self.assertEqual([row['type'] for row in rows], ['R_BPF_NONE', 'R_BPF_64_64', 'UNKNOWN_2', 'R_BPF_64_RELATIVE', 'R_BPF_64_32', 'UNKNOWN_999'])
        elf.secs = {}
        self.assertEqual(module.analyze_relocations(elf)['count'], 0)

    def test_reviewed_checkout_forms_and_source_drift(self):
        raw = generate.SOURCE.read_bytes().replace(b'\r\n', b'\n')
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'source.py'
            with patch.object(generate, 'SOURCE', path):
                for data in (raw, raw.replace(b'\n', b'\r\n')):
                    path.write_bytes(data)
                    self.assertTrue(callable(generate.corrected_module().analyze_relocations))
                path.write_bytes(raw + b'\n# drift\n')
                with self.assertRaisesRegex(ValueError, 'reviewed section-analysis source'):
                    generate.corrected_module()


if __name__ == '__main__':
    unittest.main()
