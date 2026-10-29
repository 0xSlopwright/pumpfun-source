from pathlib import Path
import argparse,hashlib,json,sys

def verify(root,candidate,symbols):
 root=Path(root).resolve();sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(Path(candidate));s=Elf(Path(symbols));assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 matches=[f for f in s.funcs if 'create_ata_if_empty' in f['name']];assert len(matches)==1;f=matches[0]
 assert f['size']==2904 and o.normalized[0x70b60:0x70b60+2904]==c.normalized[f['start']:f['start']+2904]and o.pattern(0x70b60,2904)==c.pattern(f['start'],2904)
 oc={x['offset']:x['target']for x in o.callsites(0x70b60,2904)};cc={x['offset']:x['target']for x in c.callsites(f['start'],2904)};assert set(oc)==set(cc)=={56,2824};edges=[]
 for offset,size in [(56,104),(2824,928)]:
  a,b=oc[offset],cc[offset];fs=[p for p in s.funcs if p['start']==b and p['size']==size];assert fs and o.normalized[a:a+size]==c.normalized[b:b+size]and o.pattern(a,size)==c.pattern(b,size);edges.append({'offset':offset,'original':a,'candidate':fs[0]})
 a,b=oc[2824],cc[2824];oa=o.callsites(a,928)[0];ca=c.callsites(b,928)[0];assert oa['offset']==ca['offset']==72;a,b=oa['target'],ca['target'];assert o.normalized[a:a+40]==c.normalized[b:b+40]and o.pattern(a,40)==c.pattern(b,40)
 raw=next(p for p in s.funcs if 'transfer_from_pool_to_raw' in p['name']);assert raw['size']==2672 and o.normalized[0x716b8:0x716b8+2672]==c.normalized[raw['start']:raw['start']+2672]and o.pattern(0x716b8,2672)==c.pattern(raw['start'],2672)
 return {'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'ata_helper':f,'original_ata_helper':'0x70b60','exact_normalized_bytes':2904,'callees':edges,'idempotent_constructor':{'offset':72,'original':a,'candidate':b,'bytes':40,'normalized_equal':True},'raw_signed_transfer':raw,'scope':'Full normalized helper and actual callee/constructor identity; no full-program identity claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.symbols),indent=2))
