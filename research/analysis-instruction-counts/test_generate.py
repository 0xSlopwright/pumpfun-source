import contextlib
import io
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

import generate


class InstructionCountTests(unittest.TestCase):
    def test_all_real_windows_and_readme_counts(self):
        module = generate.corrected_module()
        from window_elf_reader import Elf
        for program, slots, wide, instructions in [('pump', 224026, 8153, 215873), ('pump_amm', 145255, 5731, 139524), ('mayhem', 88343, 4396, 83947)]:
            with self.subTest(program=program), tempfile.TemporaryDirectory(dir=generate.ROOT.parent) as directory:
                elf = Elf(generate.ROOT / f'evidence/original/{program}/deployed.so')
                with contextlib.redirect_stdout(io.StringIO()):
                    module.analyze_program(program, directory)
                output = Path(directory)
                summary = json.loads((output / 'summary.json').read_text())
                self.assertEqual(summary['text_section']['instruction_count'], instructions)
                self.assertEqual(summary['text_section']['instruction_slots'], slots)
                rows = json.loads((output / 'window-inventory.json').read_text())
                for row in rows:
                    start, size = row['address_decimal'], row['size']
                    expected = size // 8 - sum(elf.b[at] == 0x18 for at in range(start, start + size, 8))
                    self.assertEqual(row['instruction_count'], expected)
                self.assertEqual(sum(row['instruction_count'] for row in rows), slots - wide)
                self.assertIn(f'{instructions:,} BPF instructions; {slots:,} eight-byte slots', (output / 'README.md').read_text())
                check = subprocess.run([sys.executable, str(output / 'verify.py')], capture_output=True)
                self.assertEqual(check.returncode, 0, check.stderr)

    def test_truncated_wide_and_invalid_windows_are_rejected(self):
        with self.assertRaisesRegex(ValueError, 'Truncated wide'):
            generate.count_instructions(b'\x18' + bytes(7), 0, 8)
        for start, end in [(-8, 8), (0, 9), (16, 8), (0, 24)]:
            with self.assertRaisesRegex(ValueError, 'Invalid instruction window'):
                generate.count_instructions(bytes(16), start, end)


if __name__ == '__main__':
    unittest.main()
