from pathlib import Path
import argparse,hashlib,json,struct,sys
from solders.pubkey import Pubkey

def verify(root,candidate,symbols):
 root=Path(root);sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(Path(candidate));s=Elf(Path(symbols));f=next(f for f in s.funcs if 'quote17is_native_or_usdc17'in f['name']);a,n=0x118e0,232;assert f['size']==n and o.normalized[a:a+n]==c.normalized[f['start']:f['start']+n]and o.pattern(a,n)==c.pattern(f['start'],n)
 by={f['start']:f for f in s.funcs};calls=[]
 for x,y in zip(o.callsites(a,n),c.callsites(f['start'],n)):
  assert x['offset']==y['offset'];p=by[y['target']];size=o.entries[o.entries.index(x['target'])+1]-x['target'];assert p['size']==size and o.normalized[x['target']:x['target']+size]==c.normalized[y['target']:y['target']+size]and o.pattern(x['target'],size)==c.pattern(y['target'],size);calls.append({'offset':x['offset'],'original':x['target'],'candidate':p})
 data=[]
 for r in o.pattern(a,n):
  if r['type']!=8:continue
  k=r['offset'];ptr=lambda e,p:struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
  ap,bp=ptr(o,a+k),ptr(c,f['start']+k);av,bv=o.b[ap:ap+32],c.b[bp:bp+32];assert av==bv;data.append({'offset':k,'original_pointer':ap,'candidate_pointer':bp,'pubkey':str(Pubkey.from_bytes(av)),'sha256':hashlib.sha256(av).hexdigest()})
 assert len(calls)==3 and len(data)==3 and {d['pubkey']for d in data}=={'So11111111111111111111111111111111111111112','EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v','9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP'}
 return{'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'original_start':hex(a),'helper':f,'normalized_bytes':232,'callees':calls,'data_objects':data,'scope':'Full helper normalized bytes, relocation pattern, actual call targets and all three32-byte Pubkey constants match.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
