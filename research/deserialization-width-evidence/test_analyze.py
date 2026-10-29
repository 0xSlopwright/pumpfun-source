import hashlib
import json
from pathlib import Path
import struct
import sys
import unittest
from unittest.mock import patch
import analyze


def compare():
    base=analyze.baseline()
    from window_elf_reader import Elf
    receipts=[]
    for path in sorted((analyze.ROOT/'evidence').glob('**/deployed.so')):
        elf=Elf(path);old=base.recover_anchor_idl(elf);new=analyze.analyze(elf);ambiguous=0;witness=None
        for a,b in zip(old['deserialization_patterns'],new['deserialization_patterns'],strict=True):
            start=int(b['window'],16);end=(elf.entries+[elf.hi])[elf.entries.index(start)+1]
            for offset,size,widths,sites in zip(b['field_offsets'],b['field_sizes'],b['observed_load_widths'],b['load_width_evidence'],strict=True):
                expected=[]
                for at in range(start,end,8):
                    op,regs,off,_=struct.unpack_from('<BBhi',elf.b,at)
                    if op in (0x61,0x69,0x71,0x79) and regs>>4==b['base_reg'] and off==offset:
                        expected.append(dict(address=hex(at),width={0x61:4,0x69:2,0x71:1,0x79:8}[op]))
                assert sites==expected and widths==sorted({s['width'] for s in expected})
                assert size==(widths[0] if len(widths)==1 else None)
                if size is None:
                    ambiguous+=1
                    witness=witness or dict(window=b['window'],base_register=b['base_reg'],offset=offset,before=a['field_sizes'][a['field_offsets'].index(offset)],after=None,widths=widths,sites=sites)
            a['field_sizes']=b['field_sizes']
            for field in ('observed_load_widths','ambiguous_field_offsets','load_width_evidence'):
                a[field]=b[field]
        assert old==new
        receipts.append(dict(input=path.relative_to(analyze.ROOT).as_posix(),sha256=hashlib.sha256(elf.b).hexdigest(),ambiguous_offsets=ambiguous,witness=witness))
    assert len(receipts)==9
    return receipts


class Tests(unittest.TestCase):
    def test_all_real_reported_patterns(self):
        self.assertEqual(sum(r['ambiguous_offsets'] for r in compare()),93)

    def test_reviewed_base_drift(self):
        with patch.object(Path,'read_bytes',return_value=b'changed'):
            with self.assertRaisesRegex(ValueError,'adapter changed'):
                analyze.baseline()


if __name__=='__main__':
    if len(sys.argv)==3 and sys.argv[1]=='--receipt':
        Path(sys.argv[2]).write_text(json.dumps(compare(),indent=2)+'\n',encoding='utf-8',newline='\n')
    else:unittest.main()
