import hashlib
import json
from pathlib import Path
import struct
import sys
import unittest
from unittest.mock import patch
import analyze


def compare():
    before=analyze.archived()
    from window_elf_reader import Elf
    receipts=[]
    for name,path in analyze.inputs().items():
        elf=Elf(path);old=before.recover_anchor_dispatch(elf);all_sites=analyze.recover(elf,True);new=analyze.recover(elf)
        # Project the complete inventory back to the exact former last-write schema.
        projected={key:dict(selector=key,target_address=sites[-1]['target_address'],target_name=sites[-1]['target_name']) for key,sites in all_sites.items()}
        assert projected==old
        for key,sites in new.items():
            assert sites==[s for s in all_sites[key] if not s['relocated_external']]
            for site in sites:
                load,call=int(site['load_address'],16),int(site['call_address'],16)
                assert elf.b[load]==0x18 and elf.b[call:call+2]==b'\x85\x10'
                assert site['load_raw']==elf.b[load:load+16].hex() and site['call_raw']==elf.b[call:call+8].hex()
                assert int(site['target_address'],16)==call+8+struct.unpack_from('<i',elf.b,call+4)[0]*8
                assert int(key,16)==struct.unpack_from('<I',elf.b,load+4)[0]+(struct.unpack_from('<I',elf.b,load+12)[0]<<32)
        repeated={key:sites for key,sites in new.items() if len(sites)>1}
        excluded=[s for sites in all_sites.values() for s in sites if s['relocated_external']]
        receipts.append(dict(input=path.relative_to(analyze.ROOT).as_posix(),sha256=hashlib.sha256(elf.b).hexdigest(),
            old_scalar_rows=len(old),retained_call_sites=sum(map(len,new.values())),previously_overwritten=sum(len(s)-1 for s in repeated.values()),
            excluded_external_calls=len(excluded),ambiguous_target_keys=sum(len({s['target_address'] for s in sites})>1 for sites in new.values()),
            repeated_witness=next(iter(repeated.values()),[]),excluded_witness=excluded[:1]))
    assert len(receipts)==9
    return receipts


class Tests(unittest.TestCase):
    def test_complete_original_candidates_and_physical_sites(self):
        rows=compare()
        self.assertGreater(sum(r['previously_overwritten'] for r in rows),0)
        self.assertEqual(sum(r['excluded_external_calls'] for r in rows),27)
        self.assertGreater(sum(r['ambiguous_target_keys'] for r in rows),0)

    def test_source_drift(self):
        with patch.object(Path,'read_bytes',return_value=b'changed'):
            with self.assertRaisesRegex(ValueError,'disassembler changed'):analyze.archived()


if __name__=='__main__':
    if len(sys.argv)==3 and sys.argv[1]=='--receipt':
        Path(sys.argv[2]).write_text(json.dumps(compare(),indent=2)+'\n',encoding='utf-8',newline='\n')
    else:unittest.main()
