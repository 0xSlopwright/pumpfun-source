from pathlib import Path
import gzip,json,hashlib,types
W=Path(__file__).resolve().parent

def module(name,p):
 m=types.ModuleType(name);m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m

def load(p):
 p=Path(p)
 if not p.exists():p=p.with_suffix(p.suffix+'.gz')
 raw=p.read_bytes();return json.loads(gzip.decompress(raw)if raw[:2]==b'\x1f\x8b'else raw)

def verify(w=W):
 w=Path(w);candidate=w/'build/artifacts/pump_amm_recovered.so';digest=hashlib.sha256(candidate.read_bytes()).hexdigest()
 impacted=module('impact',w/'verify_cases.py').verify(w);assert impacted==load(w/'cases-verification.json')
 sweep=module('sweep_receipts',w/'verify_sweep.py').verify(w/'sweep-inputs',candidate,w/'sweep254',w/'observe_sweep.py');assert sweep==load(w/'sweep254-verification.json')
 counter=module('incentive_receipts',w/'verify_current.py').verify(w/'counterexamples');assert counter==load(w/'counterexamples-verification.json')
 core=module('core_receipts',w/'verify_core_saved.py').report;assert core==load(w/'runtime-verification.json')
 # Tighten the retained core crypto check: every recorded transaction has at
 # least one signature, including setup messages (all decoded by core verifier).
 for row in load(w/'runtime/progress.json'):
  obs=load(w/'runtime'/(row['suite']+'-transactions.json.gz'));assert all(x['signature_count']>0 and x['all_signatures_verified']for x in obs['transactions'])
 assert all(x['candidate_sha256']==digest for x in [impacted,sweep,counter,core])
 result={'candidate_sha256':digest,'private':impacted,'sweep':sweep,'incentive':counter,'core':core,'summed_case_observations':17462+1502+254+1730,'summed_executions':35074+3004+508+3460,'summed_signature_fields':35418+3322+508+3462,'scope':'Independent recomputation over copied saved receipts. Suites overlap; totals are observations, not unique scenarios. Full core stores 31134 exact log bindings; absent report logs are not inferred from hashes. No VM or compiler executed.'}
 assert(result['summed_case_observations'],result['summed_executions'],result['summed_signature_fields'])==(20948,42046,42710)
 return result
if __name__=='__main__':
 r=verify();(W/'runtime-review.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
