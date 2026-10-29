from collections import Counter
from pathlib import Path
import struct
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

import generate
from generate import ROOT, corrected_module

WIDTHS = {0x00:'w',0x08:'h',0x10:'b',0x18:'dw'}
PREFIXES = {1:'ldx',2:'st',3:'stx'}


class MemoryWidthTests(unittest.TestCase):
    def test_all_twelve_memory_encodings_preserve_operands(self):
        decoder = corrected_module().decode_instruction
        for kind, prefix in PREFIXES.items():
            for bits, width in WIDTHS.items():
                opcode = 0x60 | kind | bits
                regs = 2 if kind == 2 else 0x12
                data = struct.pack('<BBhi',opcode,regs,-16,7)
                row,size = decoder(data,0,SimpleNamespace())
                with self.subTest(opcode=hex(opcode)):
                    self.assertEqual(size,8)
                    self.assertTrue(row['mnemonic'].startswith(prefix+width+' '))
                    self.assertEqual(row['dst'],2)
                    self.assertEqual(row['off'],-16)
                    self.assertEqual(row['imm'],7)

    def test_original_program_memory_instructions(self):
        decoder = corrected_module().decode_instruction
        from window_elf_reader import Elf
        for program, expected_changed in [('pump',108808),('pump_amm',66960),('mayhem',35601)]:
            elf = Elf(ROOT / f'evidence/original/{program}/deployed.so')
            changed=0
            at=elf.lo
            while at<elf.hi:
                opcode=elf.b[at]
                kind=opcode&7
                if opcode&0xe0==0x60 and kind in PREFIXES:
                    row,_=decoder(elf.b,at,elf)
                    self.assertTrue(row['mnemonic'].startswith(PREFIXES[kind]+WIDTHS[opcode&0x18]+' '))
                    changed += (opcode&0x18)!=0
                at += 16 if opcode==0x18 else 8
            with self.subTest(program=program):
                self.assertEqual(changed,expected_changed)

    def test_reviewed_checkout_forms_and_source_drift(self):
        original=generate.SOURCE.read_bytes().replace(b'\r\n',b'\n')
        with tempfile.TemporaryDirectory() as folder:
            source=Path(folder)/'deep_disassembly.py'
            with patch.object(generate,'SOURCE',source):
                for data in (original,original.replace(b'\n',b'\r\n')):
                    source.write_bytes(data)
                    self.assertTrue(callable(corrected_module().decode_instruction))
                source.write_bytes(original+b'\n# changed\n')
                with self.assertRaises(ValueError):corrected_module()


if __name__=='__main__':unittest.main()
