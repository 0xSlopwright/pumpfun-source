from pathlib import Path
import re
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

import generate


class TrailingRunTests(unittest.TestCase):
    def test_every_section_in_all_nine_captures_matches_independent_byte_runs(self):
        module = generate.corrected_module()
        import deep_section_analysis as archived
        added = []
        for name, path in generate.CAPTURES.items():
            with self.subTest(capture=name):
                elf = module.Elf(path)
                before, after = archived.analyze_data_layout(elf), module.analyze_data_layout(elf)
                for section_name, result in after.items():
                    section = elf.secs[section_name]
                    start, length = section[4], section[5]
                    data = elf.b[start:start+length]
                    expected = [{'offset':match.start(), 'address':hex(start+match.start()),
                                 'length':len(match[0]), 'value':match[0].decode('ascii')[:200]}
                                for match in re.finditer(rb'[\x20-\x7e]{4,}', data)]
                    self.assertEqual(result['strings'], expected)
                    self.assertEqual(result['string_count'], len(expected))
                    self.assertEqual({k:v for k,v in before[section_name].items() if k not in ('strings', 'string_count')}, {k:v for k,v in result.items() if k not in ('strings', 'string_count')})
                    if before[section_name]['strings'] != expected:
                        self.assertEqual(before[section_name]['strings'], expected[:-1])
                        added.append((name, section_name, expected[-1]['address'], expected[-1]['length']))
        self.assertEqual(added, [('spl_token', '.rodata', '0x19b95', 34)])

    def test_short_tails_and_terminated_runs_keep_the_existing_threshold(self):
        module = generate.corrected_module()
        for data, expected in [(b'abc', []), (b'text', ['text']), (b'text\0abc', ['text']), (b'text\0tail', ['text', 'tail'])]:
            elf = SimpleNamespace(b=data, secs={'.rodata': (0, 0, 0, 0, 0, len(data))}, lo=10000, hi=20000)
            self.assertEqual([row['value'] for row in module.analyze_data_layout(elf)['.rodata']['strings']], expected)

    def test_reviewed_checkout_forms_and_source_drift(self):
        raw = generate.SOURCE.read_bytes().replace(b'\r\n', b'\n')
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'source.py'
            with patch.object(generate, 'SOURCE', path):
                for data in (raw, raw.replace(b'\n', b'\r\n')):
                    path.write_bytes(data)
                    self.assertTrue(callable(generate.corrected_module().analyze_data_layout))
                path.write_bytes(raw + b'\n# drift\n')
                with self.assertRaisesRegex(ValueError, 'reviewed section-analysis source'):
                    generate.corrected_module()


if __name__ == '__main__':
    unittest.main()
