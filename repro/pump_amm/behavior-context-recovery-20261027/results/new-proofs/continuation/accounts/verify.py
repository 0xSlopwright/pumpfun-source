#!/usr/bin/env python3
"""Verify the four sealed account-layout replay groups and their signed messages."""
from pathlib import Path,PurePosixPath
import argparse,base64,gzip,hashlib,json,re
from solders.transaction import Transaction
D=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(proof=D,candidate=None,repository_root=None,expected_seal=None):
 proof=Path(proof).resolve();m=json.loads((proof/'manifest.json').read_bytes())
 if expected_seal is not None:assert sha(proof/'manifest.json')==expected_seal
 actual={str(p.relative_to(proof))for p in proof.rglob('*')if p.is_file()};assert actual==set(m['files'])|{'manifest.json'}
 for name,digest in m['files'].items():
  part=PurePosixPath(name);assert not part.is_absolute()and '..'not in part.parts
  p=proof/name;assert not p.is_symlink()and sha(p)==digest,name
 root=Path(repository_root).resolve()if repository_root is not None else next(p for p in proof.parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
 inputs=json.loads((proof/'inputs.json').read_bytes())
 for name,digest in inputs.items():assert sha(root/name)==digest,name
 assert sha(root/'evidence/original/pump_amm/deployed.so')==ORIGINAL
 if candidate is not None:assert sha(candidate)==m['candidate_sha256']
 runs=[];total=0;raw_logs=0
 for name,count in [('boost',13),('resize',98),('admin',53),('collect',148)]:
  r=json.loads((proof/(name+'.json')).read_bytes());o=json.loads(gzip.decompress((proof/(name+'-transactions.json.gz')).read_bytes()));rows=o['transactions']
  assert r['case_count']==len(r['cases'])==count and len(rows)==o['transaction_count']==count*2
  assert r['original_sha256']==ORIGINAL and r['candidate_sha256']==m['candidate_sha256']
  assert r.get('script_sha256',r.get('probe_sha256'))==o['script_sha256']==sha(proof/(name+'.py'))
  assert o['observer_sha256']==sha(proof/'observer.py')
  assert not r.get('mismatches',[])and not r.get('mismatch_count',0)
  for i,case in enumerate(r['cases']):
   if name in ('boost','admin'):
    assert not case['differences'];assert case['original']==case['candidate']
   elif name=='resize':
    assert case['match']and all(case['original'][k]==case['candidate'][k]for k in ['error','state_hex','lamport_deltas','events'])
   else:assert not case['diff']and case['original']==case['candidate']
   txs=[]
   for j,row in enumerate(rows[2*i:2*i+2]):
    side=case['original']if j==0 else case['candidate'];assert row['error']==side['error']
    if name=='resize':
     assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest();raw_logs+=1
    raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count']
    assert row['amm_program_sha256']==(ORIGINAL if j==0 else m['candidate_sha256']);txs.append(tx)
    for loaded in row['loaded_programs'].values():
     digest=loaded['sha256'];assert digest in set(inputs.values())|{m['candidate_sha256']}
   assert bytes(txs[0].message)==bytes(txs[1].message)
  total+=count;runs.append({'group':name,'cases':count,'mismatches':0,'signed_transactions':count*2})
 assert total==312
 return {'passed':True,'candidate_sha256':m['candidate_sha256'],'cases':total,'signed_transactions_verified':total*2,'raw_log_hashes_recomputed':raw_logs,'candidate_file_verified':candidate is not None,'inputs_verified':len(inputs),'runs':runs,'scope':'Four bounded signed account-layout replays. Boost/admin compare normalized logs; resize compares error/state/lamports/events and retains raw logs; collect compares state/error/inner CPI/events. Other observer log hashes are retained as observation metadata, not recomputed from unavailable raw logs.'}
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path);p.add_argument('--repository-root',type=Path);p.add_argument('--expected-seal');a=p.parse_args();print(json.dumps(verify(candidate=a.candidate,repository_root=a.repository_root,expected_seal=a.expected_seal),indent=2))
