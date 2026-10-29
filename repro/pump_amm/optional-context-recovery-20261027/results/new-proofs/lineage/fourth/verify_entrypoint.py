#!/usr/bin/env python3
from pathlib import Path
import argparse,hashlib,json,struct,sys

def verify(root,candidate,symbols):
 root=Path(root).resolve();sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(Path(candidate));s=Elf(Path(symbols));start,size=0x1075c0,3232
 fs=[f for f in s.funcs if 'solana_program_entrypoint11deserialize' in f['name']and f['size']==size and c.normalized[f['start']:f['start']+size]==o.normalized[start:start+size]and c.pattern(f['start'],size)==o.pattern(start,size)];assert len(fs)==1;f=fs[0];rows=[]
 def descriptor(e,at):
  if e.b[at]!=0x18 or e.relocations.get(at,{}).get('type')!=8:return None
  p=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32
  if e.relocations.get(p,{}).get('type')!=8 or p+24>len(e.b):return None
  fp=struct.unpack_from('<Q',e.b,p)[0]>>32;n=struct.unpack_from('<Q',e.b,p+8)[0]
  if n!=10 or e.b[fp:fp+n]!=b'src/lib.rs':return None
  line,col=struct.unpack_from('<II',e.b,p+16);return {'descriptor':p,'file':'src/lib.rs','line':line,'column':col}
 for offset in range(0,size,8):
  a=descriptor(o,start+offset)
  if a is None:continue
  b=descriptor(c,f['start']+offset);assert b is not None and {k:v for k,v in a.items()if k!='descriptor'}=={k:v for k,v in b.items()if k!='descriptor'};rows.append({'offset':offset,'original':a,'candidate':b})
 assert len(rows)==17
 return {'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'original_function':hex(start),'candidate_function':f,'normalized_body_equal':True,'relocation_pattern_equal':True,'source_descriptors_equal':17,'descriptors':rows,'scope':'Full normalized deserialize body plus17 actual source records; not whole-ELF identity or unique historical-version proof.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
