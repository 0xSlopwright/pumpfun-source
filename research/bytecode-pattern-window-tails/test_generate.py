from pathlib import Path
import struct
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch
import generate
from generate import ROOT,corrected_module


def instruction(opcode,regs=0,offset=0,immediate=0):
    return struct.pack('<BBhi',opcode,regs,offset,immediate)


class PatternTailTests(unittest.TestCase):
    def test_complete_tail_patterns_and_out_of_window_target(self):
        module=corrected_module()
        data=instruction(0x15)+instruction(0xb7,immediate=6000)
        elf=SimpleNamespace(b=data)
        self.assertEqual(module.detect_error_patterns(elf,0,16),[
            {'offset':0,'branch_target_offset':8,'error_code':6000,'type':'conditional_error'}])
        self.assertEqual(module.detect_error_patterns(elf,0,8),[])
        data=instruction(0x79)+instruction(0x15)
        self.assertEqual(module.detect_account_validation(SimpleNamespace(b=data),0,16)['discriminator_checks'],1)
        data=instruction(0x79,offset=32)
        self.assertEqual(module.detect_account_validation(SimpleNamespace(b=data),0,8)['owner_field_accesses'],1)
        data=instruction(0x7b)*4
        result=module.detect_serialization_patterns(SimpleNamespace(b=data),0,32)
        self.assertEqual(result['max_store_run'],4)
        self.assertTrue(result['likely_serialization'])

    def test_real_original_tail_error_witnesses(self):
        module=corrected_module()
        from window_elf_reader import Elf
        witnesses={'pump':[(0xef40,120),(0x197650,520)],'pump_amm':[(0xd038,120)],'mayhem':[(0x9028,640)]}
        for program,rows in witnesses.items():
            elf=Elf(ROOT/f'evidence/original/{program}/deployed.so')
            ends=dict(zip(elf.entries,elf.entries[1:]+[elf.hi]))
            for start,offset in rows:
                with self.subTest(program=program,start=hex(start)):
                    patterns=module.detect_error_patterns(elf,start,ends[start])
                    self.assertIn(offset,{row['offset'] for row in patterns})

    def test_reviewed_lf_crlf_and_source_drift(self):
        original=generate.SOURCE.read_bytes().replace(b'\r\n',b'\n')
        with tempfile.TemporaryDirectory() as folder:
            path=Path(folder)/'bytecode_signatures.py'
            with patch.object(generate,'SOURCE',path):
                for raw in (original,original.replace(b'\n',b'\r\n')):
                    path.write_bytes(raw)
                    self.assertTrue(callable(corrected_module().detect_error_patterns))
                path.write_bytes(original+b'\n# changed\n')
                with self.assertRaises(ValueError):corrected_module()


if __name__=='__main__':unittest.main()
