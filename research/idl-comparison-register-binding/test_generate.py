import hashlib
import json
from pathlib import Path
import struct
import sys
import unittest
from unittest.mock import patch
import generate


def compare():
    old_module,new_module=generate.reviewed_module(False),generate.reviewed_module()
    from window_elf_reader import Elf
    records=[]
    for path in sorted((generate.ROOT/'evidence').glob('**/deployed.so')):
        elf=Elf(path);old=old_module.recover_anchor_idl(elf);new=new_module.recover_anchor_idl(elf)
        keep=[];removed=[]
        for row in old['discriminators']:
            at=int(row['found_at'],16);register=elf.b[at+1]&15
            opcode,regs,_,_=struct.unpack_from('<BBhi',elf.b,at+16)
            # Decode the read operands independently of the correction predicate.
            read={regs&15}
            if opcode in (0x1d,0x5d):read.add(regs>>4)
            if register in read:keep.append(row)
            else:removed.append(dict(address=hex(at),loaded_register=register,comparison_reads=sorted(read),raw=elf.b[at:at+24].hex()))
        assert new['discriminators']==keep
        old['discriminators']=keep;old['discriminator_count']=len(keep)
        assert old==new
        records.append(dict(input=path.relative_to(generate.ROOT).as_posix(),sha256=hashlib.sha256(elf.b).hexdigest(),removed_unrelated_comparisons=len(removed),witness=removed[:1]))
    assert len(records)==9
    return records


class Tests(unittest.TestCase):
    def test_all_real_inputs(self):
        self.assertEqual(sum(r['removed_unrelated_comparisons'] for r in compare()),99)

    def test_operand_forms(self):
        for opcode in (0x15,0x55,0x1d,0x5d):
            raw=struct.pack('<BBhi',opcode,0x43,0,1)
            self.assertTrue(generate.comparison_reads_register(raw,0,3))
            self.assertEqual(generate.comparison_reads_register(raw,0,4),opcode in (0x1d,0x5d))
            self.assertFalse(generate.comparison_reads_register(raw,0,5))
        self.assertFalse(generate.comparison_reads_register(bytes([0x85,0x43])+bytes(6),0,3))

    def test_source_drift(self):
        with patch.object(Path,'read_bytes',return_value=b'changed'):
            with self.assertRaisesRegex(ValueError,'analyzer changed'):generate.reviewed_module()


if __name__=='__main__':
    if len(sys.argv)==3 and sys.argv[1]=='--receipt':
        Path(sys.argv[2]).write_text(json.dumps(compare(),indent=2)+'\n',encoding='utf-8',newline='\n')
    else:unittest.main()
