from pathlib import Path
import argparse,hashlib,json,sys,struct

def verify(root,candidate,symbols):
 root=Path(root).resolve();sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(Path(candidate));s=Elf(Path(symbols));fs=[f for f in s.funcs if 'transfer_checked_with_ata' in f['name']];assert len(fs)==1;f=fs[0];assert f['size']==2536 and o.normalized[0x6f898:0x6f898+2536]==c.normalized[f['start']:f['start']+2536]and o.pattern(0x6f898,2536)==c.pattern(f['start'],2536)
 a=o.callsites(0x6f898,2536);b=c.callsites(f['start'],2536);assert[x['offset']for x in a]==[x['offset']for x in b];edges=[]
 for x,y in zip(a,b):
  old=x['target'];new=y['target'];n=o.entries[o.entries.index(old)+1]-old;found=[z for z in s.funcs if z['start']==new and z['size']==n];assert found and o.normalized[old:old+n]==c.normalized[new:new+n]and o.pattern(old,n)==c.pattern(new,n);edges.append({'offset':x['offset'],'original':old,'candidate':found[0]})
 guard=next(f for f in s.funcs if 'validate_boost_authority' in f['name']);n=1464;diffs=[]
 if guard['size']==n:
  for k in range(0,n,8):
   x=o.normalized[0x62688+k:0x62688+k+8];y=c.normalized[guard['start']+k:guard['start']+k+8]
   if x!=y:diffs.append({'offset':k,'original':x.hex(),'candidate':y.hex()})
 return {'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'payout_helper':f,'payout_normalized_bytes':2536,'payout_actual_callees':edges,'boost_guard':guard,'boost_guard_normalized_differences':diffs,'boost_guard_relocation_pattern_equal':guard['size']==n and o.pattern(0x62688,n)==c.pattern(guard['start'],n),'scope':'Payout full normalized body and direct targets verified; boost differences are reported without masking or an equality claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
