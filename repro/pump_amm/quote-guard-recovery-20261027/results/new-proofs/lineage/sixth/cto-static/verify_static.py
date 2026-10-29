"""Verify the exact quote predicate, actual three constants, and caller closure."""
from pathlib import Path
import argparse,hashlib,json,struct,types
HERE=Path(__file__).resolve().parent
def verify(candidate,symbols,original=None,directory=HERE):
 d=Path(directory);p=d/'elf_reader.py';m=types.ModuleType('elf');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);r=json.loads((d/'static-reference.json').read_text());c=m.Elf(Path(candidate));s=m.Elf(Path(symbols));assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 if original is not None:
  o=m.Elf(Path(original));assert hashlib.sha256(o.b).hexdigest()==r['original_sha256'];a=int(r['helper']['start'],16);n=r['helper']['size'];assert o.b[a:a+n].hex()==r['helper']['raw']and o.normalized[a:a+n].hex()==r['helper']['normalized'];assert [hex(x)for x,t in o.calls.items()if t==a]==r['original_callers']
 f=next(f for f in s.funcs if 'is_native_or_usdc17h'in f['name']);assert f['size']==r['helper']['size']==232 and c.normalized[f['start']:f['start']+f['size']].hex()==r['helper']['normalized']and c.pattern(f['start'],f['size'])==r['helper']['pattern']
 actual=[]
 for constant in r['constants']:
  at=f['start']+constant['offset'];assert c.b[at]==0x18;ptr=struct.unpack_from('<I',c.b,at+4)[0]|struct.unpack_from('<I',c.b,at+12)[0]<<32;assert c.b[ptr:ptr+32].hex()==constant['bytes'];actual.append({'offset':constant['offset'],'pointer':hex(ptr),'bytes':constant['bytes']})
 calls=c.callsites(f['start'],f['size']);assert [x['offset']for x in calls]==[x['offset']for x in r['helper']['calls']]==[32,104,168]
 for x in calls:
  a=x['target'];n=r['memcmp']['size'];assert c.normalized[a:a+n].hex()==r['memcmp']['normalized']and c.pattern(a,n)==r['memcmp']['pattern']
 callers=[a for a,t in c.calls.items()if t==f['start']];assert len(callers)==2;owner=next(x for x in s.funcs if '18pump_amm_recovered14admin_cto_pool17h'in x['name']);assert all(owner['start']<=a<owner['start']+owner['size']for a in callers)
 return {'verified':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'helper':f,'normalized_bytes':232,'masks':[],'actual_constants':actual,'actual_memcmp_calls':calls,'actual_cto_callers':[hex(a)for a in callers],'scope':'Exact predicate executable body, immediate callee bodies/relocations and complete32-byte mint constants. Full AdminCtoPool body remains separate.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--original',type=Path);p.add_argument('--directory',type=Path,default=HERE);a=p.parse_args();print(json.dumps(verify(a.candidate,a.symbols,a.original,a.directory),indent=2))
