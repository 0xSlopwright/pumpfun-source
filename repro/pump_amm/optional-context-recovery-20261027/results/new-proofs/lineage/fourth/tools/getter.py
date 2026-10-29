#!/usr/bin/env python3
from pathlib import Path
import argparse, hashlib, json, struct, sys
W=Path(__file__).resolve().parent

def verify(root,candidate=None,symbols=None):
 root=Path(root).resolve();sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 c=Elf(Path(candidate)if candidate else W/'build/artifacts/pump_amm_recovered.so');s=Elf(Path(symbols)if symbols else W/'build/artifacts/unstripped.so');o=Elf(root/'evidence/original/pump_amm/deployed.so')
 assert hashlib.sha256(o.b).hexdigest()=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 matches=[f for f in s.funcs if '4pump3cpi15Return' in f['name']and f['size']==344];assert len(matches)==1;g=matches[0]
 assert c.normalized[g['start']:g['start']+344]==o.normalized[0xd84b0:0xd84b0+344];assert c.pattern(g['start'],344)==o.pattern(0xd84b0,344)
 assert not any('read_cpi_return'in f['name']for f in s.funcs)
 calls=[{'address':hex(at),'containing':[f for f in s.funcs if f['start']<=at<f['start']+f['size']]}for at,t in c.calls.items()if t==g['start']];assert len(calls)==2
 origins=[]
 for offset in [64,320]:
  row={}
  for name,e,start in [('original',o,0xd84b0),('candidate',c,g['start'])]:
   at=start+offset;p=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32;assert e.relocations[p]['type']==8
   fp=struct.unpack_from('<Q',e.b,p)[0]>>32;n=struct.unpack_from('<Q',e.b,p+8)[0];line,col=struct.unpack_from('<II',e.b,p+16);row[name]={'path':e.b[fp:fp+n].decode(),'line':line,'column':col}
  assert row['candidate']==row['original']=={'path':'programs/pump-amm/src/lib.rs','line':22,'column':1};origins.append({'offset':offset,**row})
 return {'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'helper':g,'normalized_body_equal':True,'relocation_pattern_equal':True,'callers':calls,'source_descriptors':origins,'raw_body_equal':c.b[g['start']:g['start']+344]==o.b[0xd84b0:0xd84b0+344]}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
