from pathlib import Path
import struct
from types import SimpleNamespace
import unittest

from generate import ROOT, corrected_module


class ControlFlowTests(unittest.TestCase):
    def test_jump_conditional_branch_and_exit_edges(self):
        module=corrected_module()
        data=b''.join([struct.pack('<BBhi',5,0,1,0),struct.pack('<BBhi',0x15,0,1,0),struct.pack('<BBhi',0x95,0,0,0)])
        instructions=[module.decode_instruction(data,at,SimpleNamespace())[0] for at in range(0,len(data),8)]
        self.assertEqual(module.build_cfg_edges(instructions,0,24),[
            {'from':'0x0','to':'0x10','type':'branch','conditional':False},
            {'from':'0x8','to':'0x18','type':'branch','conditional':True},
            {'from':'0x8','to':'0x10','type':'fallthrough','conditional':False},
            {'from':'0x10','to':'return','type':'exit','conditional':False}])

    def test_every_original_unconditional_jump_has_only_one_successor(self):
        module=corrected_module()
        from window_elf_reader import Elf
        for program,expected in [('pump',7187),('pump_amm',4976),('mayhem',2270)]:
            elf=Elf(ROOT/f'evidence/original/{program}/deployed.so')
            jumps=0
            at=elf.lo
            while at<elf.hi:
                instruction,step=module.decode_instruction(elf.b,at,elf)
                if instruction['opcode']=='0x05':
                    edges=module.build_cfg_edges([instruction],elf.lo,elf.hi)
                    self.assertEqual(len(edges),1)
                    self.assertEqual(edges[0]['type'],'branch')
                    self.assertFalse(edges[0]['conditional'])
                    self.assertEqual(edges[0]['to'],hex(instruction['branch_target']))
                    jumps+=1
                at+=step
            with self.subTest(program=program):self.assertEqual(jumps,expected)


if __name__=='__main__':unittest.main()
