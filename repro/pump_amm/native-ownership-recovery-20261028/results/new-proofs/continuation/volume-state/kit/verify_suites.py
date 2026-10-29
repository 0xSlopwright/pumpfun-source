#!/usr/bin/env python3
from pathlib import Path,PurePosixPath
import argparse,base64,gzip,hashlib,json,re
from solders.transaction import Transaction

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def clean(logs):return [re.sub(r'(?<=panicked at )[^\s:]+:[0-9]+(?::[0-9]+)?','<source>',re.sub(r'(?<=thrown in )[^\s:]+:[0-9]+','<source>',v))for v in logs if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)]
def verify(proof,candidate=None,root=None):
 proof=Path(proof);record=json.loads((proof/'run.json').read_bytes());assert all(r['returncode']==0 for r in record['groups']);assert {str(p.relative_to(proof))for p in proof.rglob('*')if p.is_file()}==set(record['files'])|{'run.json'}|({'verification.json'}if(proof/'verification.json').exists()else set())
 for name,digest in record['files'].items():
  q=PurePosixPath(name);assert not q.is_absolute()and'..'not in q.parts;assert sha(proof/name)==digest,name
 if candidate is not None:assert sha(candidate)==record['candidate_sha256']
 if root is not None:
  for name,digest in record['inputs'].items():assert sha(Path(root)/name)==digest,name
 counts={};total=signatures=0
 for group in ['admin','sync','claim','accumulator','edges']:
  r=json.loads((proof/(group+'.json')).read_bytes());obs=json.loads(gzip.decompress((proof/(group+'-transactions.json.gz')).read_bytes()));rows=obs['transactions'];n=r['case_count'];assert len(r['cases'])==n and len(rows)==n*2 and not r['mismatches'];source='incentives.py'if group in ['admin','sync','claim']else group+'.py';assert r['script_sha256']==obs['script_sha256']==sha(proof/'kit'/source)and obs['observer_sha256']==sha(proof/'kit/observer.py');assert r['candidate_sha256']==record['candidate_sha256']and r['original_sha256']==record['inputs']['evidence/original/pump_amm/deployed.so']
  for i,case in enumerate(r['cases']):
   left,right=case['original'],case['candidate'];assert all(left[k]==right[k]for k in left if k not in ['logs']);assert clean(left['logs'])==clean(right['logs']);txs=[]
   for j,row in enumerate(rows[2*i:2*i+2]):
    side=left if j==0 else right;raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count'];signatures+=len(checks);total+=1;txs.append(tx);assert row['amm_program_sha256']==r['original_sha256'if j==0 else'candidate_sha256'];assert row['error']==side['error'];assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest();assert all(v['sha256']in set(record['inputs'].values())|{record['candidate_sha256']}for v in row['loaded_programs'].values())
   assert bytes(txs[0].message)==bytes(txs[1].message)
  counts[group]=n
 return {'passed':True,'candidate_sha256':record['candidate_sha256'],'counts':counts,'cases':sum(counts.values()),'transactions_verified':total,'signatures_verified':signatures,'raw_log_hashes_verified':total,'normalized_log_cases':sum(counts.values()),'scope':'Signed local synthetic incentive/accumulator fixtures; no whole-program or live reachability claim. Source coordinate labels and compute-unit lines are the only log normalization.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--proof',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--root',type=Path);a=p.parse_args();print(json.dumps(verify(a.proof,a.candidate,a.root),indent=2))
