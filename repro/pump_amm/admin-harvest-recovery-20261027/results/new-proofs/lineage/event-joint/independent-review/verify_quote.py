from pathlib import Path
import hashlib,json,struct,types
from elf_reader import Elf
W=Path(__file__).resolve().parent
def verify(root,candidate,symbols):
 p=W/'quote-proof/verify_static.py';m=types.ModuleType('quoteobject');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__)
 o,c,s=Elf(Path(root)/'evidence/original/pump_amm/deployed.so'),Elf(Path(candidate)),Elf(Path(symbols));fs={f['start']:f for f in s.funcs};f=next(f for f in s.funcs if 'select_and_apply_v2' in f['name']);probe=m.selector(W/'quote-proof/borrow.o');assert f['size']==probe['size']==1632 and c.normalized[f['start']:f['start']+f['size']]==probe['code']
 linked=[(r['offset'],1 if r['type']==8 else r['type'])for r in c.pattern(f['start'],f['size'])]+[(r['offset'],10)for r in c.callsites(f['start'],f['size'])];assert sorted(linked)==sorted((r['offset'],r['type'])for r in probe['relocations'])
 calls=[]
 for r in probe['relocations']:
  if r['type']!=10:continue
  t=c.calls[f['start']+r['offset']];g=fs[t];assert m.role(g['name'])==m.role(r['symbol']);calls.append({'offset':r['offset'],'target':t,'function':g,'normalized_sha256':hashlib.sha256(c.normalized[t:t+g['size']]).hexdigest()})
 assert len(calls)==13
 def keys(e,start,size):
  out=[]
  for pc,t in sorted(e.calls.items()):
   if not start<=pc<start+size or t!=next((x['start']for x in s.funcs if x['name']=='memcmp'),-1) and e is c:continue
   if e is o and t!=0x1198e0:continue
   if pc-start<1000:continue
   ptrs=[p for p in range(pc-32,pc,8)if e.relocations.get(p,{}).get('type')==8 and e.b[p]==0x18]
   assert len(ptrs)==1;p=ptrs[0];ptr=struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32;out.append(e.b[ptr:ptr+32].hex())
  return out
 original_keys,current_keys=keys(o,0x14088,1656),keys(c,f['start'],f['size']);assert len(original_keys)==3 and original_keys==current_keys
 return{'passed':True,'selector':f,'original_size':1656,'direct_object_all_normalized_bytes_equal':True,'actual_calls':calls,'quote_pubkeys_equal':current_keys,'scope':'Borrowed quote selector equals its calibrated1632-byte object, with13actual callee roles and all3original quote keys. Original selector1656 remains unequal.'}
