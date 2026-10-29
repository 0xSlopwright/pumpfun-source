"""Check the actual claim transfer call and its immediate executable closure."""
from pathlib import Path
import argparse,hashlib,json,types
W=Path(__file__).resolve().parent
def verify(original,candidate,symbols,require_claim_call=True):
 reader=W/'elf_reader.py';m=types.ModuleType('elf');m.__file__=str(reader);exec(compile(reader.read_bytes(),str(reader),'exec'),m.__dict__)
 O=m.Elf(Path(original));C=m.Elf(Path(candidate));S=m.Elf(Path(symbols))
 assert hashlib.sha256(O.b).hexdigest()=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 assert C.b[C.lo:C.hi]==S.b[S.lo:S.hi]
 helper=next(f for f in S.funcs if '5utils5token16transfer_checked17h'in f['name']);a=0x727b8;n=2400
 assert helper['size']==n and O.normalized[a:a+n]==C.normalized[helper['start']:helper['start']+n]and O.pattern(a,n)==C.pattern(helper['start'],n)
 oc=O.callsites(a,n);cc=C.callsites(helper['start'],n);assert [x['offset']for x in oc]==[x['offset']for x in cc];closure=[]
 for x,y in zip(oc,cc):
  old,new=x['target'],y['target'];size=O.entries[O.entries.index(old)+1]-old;new_size=C.entries[C.entries.index(new)+1]-new
  assert size==new_size and O.normalized[old:old+size]==C.normalized[new:new+size]and O.pattern(old,size)==C.pattern(new,size)
  closure.append({'offset':x['offset'],'original':hex(old),'candidate':hex(new),'bytes':size})
 assert {'offset':0x3e0,'target':a}in O.callsites(0x5a570,4168)
 claim=next(f for f in S.funcs if '18pump_amm_recovered22claim_token_incentives17h'in f['name']);calls=[x for x in C.callsites(claim['start'],claim['size'])if x['target']==helper['start']]
 if require_claim_call:assert len(calls)==1,calls
 return {'verified':True,'candidate_sha256':hashlib.sha256(C.b).hexdigest(),'helper':helper,'actual_direct_callee_closure':closure,'claim_handler':claim,'claim_calls_helper':calls,'require_claim_call':require_claim_call,'scope':'Helper executable body and immediate callees; full claim handler and transitive readonly-data identity remain separate.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--original',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--reference-only',action='store_true');a=p.parse_args();print(json.dumps(verify(a.original,a.candidate,a.symbols,not a.reference_only),indent=2))
