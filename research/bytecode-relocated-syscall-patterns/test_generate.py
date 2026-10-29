from pathlib import Path
import struct
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch
import generate
from generate import ROOT,corrected_module


class RelocatedSyscallTests(unittest.TestCase):
    def test_source_drift_is_rejected_before_import(self):
        with tempfile.TemporaryDirectory() as folder:
            source=Path(folder)/'changed.py'
            source.write_bytes(generate.SOURCE.read_bytes()+b'\n# changed\n')
            with patch.object(generate,'SOURCE',source):
                with self.assertRaises(ValueError):corrected_module()

    def test_named_external_calls_and_negative_controls(self):
        module=corrected_module()
        data=struct.pack('<BBhi',0x85,0x10,0,-1)
        elf=SimpleNamespace(b=data,relocations={0:{'type':10,'symbol':'sol_invoke_signed_rust'}})
        self.assertEqual(module.detect_cpi_patterns(elf,0,8),[{'offset':0,'syscall':'sol_invoke_signed_rust','setup_stores':0}])
        for relocation in ({},{'type':8,'symbol':'sol_invoke_signed_rust'},{'type':10,'symbol':'unrelated'}):
            self.assertEqual(module.detect_cpi_patterns(SimpleNamespace(b=data,relocations={0:relocation}),0,8),[])
        not_call=struct.pack('<BBhi',0xb7,0,0,0)
        self.assertEqual(module.detect_cpi_patterns(SimpleNamespace(b=not_call,relocations=elf.relocations),0,8),[])

    def test_memcpy_threshold_and_legacy_direct_call_are_not_duplicated(self):
        module=corrected_module()
        data=struct.pack('<BBhi',0x85,0x10,0,-1)*2
        relocs={at:{'type':10,'symbol':'sol_memcpy_'} for at in (0,8)}
        result=module.detect_serialization_patterns(SimpleNamespace(b=data,relocations=relocs),0,16)
        self.assertEqual(result['memcpy_calls'],2)
        self.assertTrue(result['likely_serialization'])
        direct=struct.pack('<BBhI',0x85,0,0,0xa22b9c85)
        result=module.detect_serialization_patterns(SimpleNamespace(b=direct,relocations={0:relocs[0]}),0,8)
        self.assertEqual(result['memcpy_calls'],1)

    def test_all_original_named_call_sites_are_retained(self):
        module=corrected_module()
        from window_elf_reader import Elf
        for program in ('pump','pump_amm','mayhem'):
            elf=Elf(ROOT/f'evidence/original/{program}/deployed.so')
            cpi=memcpy=0
            for start,end in zip(elf.entries,elf.entries[1:]+[elf.hi]):
                cpi+=len(module.detect_cpi_patterns(elf,start,end))
                memcpy+=module.detect_serialization_patterns(elf,start,end)['memcpy_calls']
            with self.subTest(program=program):
                self.assertEqual(cpi,1)
                self.assertEqual(memcpy,2)


if __name__=='__main__':unittest.main()
