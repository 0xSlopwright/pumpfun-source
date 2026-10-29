#!/usr/bin/env python3
"""Verify a sealed 98-case resize replay, explicit baseline, and signed messages."""
from pathlib import Path,PurePosixPath
import argparse,base64,gzip,hashlib,json
from solders.transaction import Transaction
D=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
BASELINE='5c1e8b18ead27d0b3c1840f37b24ef5044adb65e2a3a566d5be7694ff8737c05'

def verify(proof=D,candidate=None,baseline=None,repository_root=None,expected_seal=None):
 proof=Path(proof).resolve();m=json.loads((proof/'manifest.json').read_bytes())
 if expected_seal is not None:assert sha(proof/'manifest.json')==expected_seal
 actual={str(p.relative_to(proof))for p in proof.rglob('*')if p.is_file()};assert actual==set(m['files'])|{'manifest.json'}
 for name,digest in m['files'].items():
  n=PurePosixPath(name);assert not n.is_absolute()and '..'not in n.parts
  p=proof/name;assert not p.is_symlink()and sha(p)==digest,name
 root=Path(repository_root).resolve()if repository_root is not None else next(p for p in proof.parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
 inputs=json.loads((proof/'inputs.json').read_bytes())
 for name,digest in inputs.items():assert sha(root/name)==digest,name
 baseline_file=Path(baseline)if baseline is not None else proof/'baseline/candidate.so';assert sha(baseline_file)==BASELINE
 if candidate is not None:assert sha(candidate)==m['candidate_sha256']
 runs=[]
 for dirname,expected in [('',m['candidate_sha256']),('baseline',BASELINE)]:
  folder=proof/dirname;r=json.loads((folder/'result.json').read_bytes());o=json.loads(gzip.decompress((folder/'transactions.json.gz').read_bytes()));rows=o['transactions']
  assert r['case_count']==len(r['cases'])==98 and not r['mismatches']and len(rows)==o['transaction_count']==196
  assert r['candidate_sha256']==expected and r['original_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
  assert r['script_sha256']==o['script_sha256']==sha(folder/'probe.py');assert o['observer_sha256']==inputs['repro/pump_amm/owner6048-v144/runtime/observe_suite.py']
  for i,case in enumerate(r['cases']):
   assert case['match']and all(case['original'][k]==case['candidate'][k]for k in ['error','state_hex','lamport_deltas','events'])
   txs=[]
   for j,row in enumerate(rows[2*i:2*i+2]):
    side=case['original']if j==0 else case['candidate'];assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest();assert row['error']==side['error']
    raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count']
    assert row['amm_program_sha256']==(r['original_sha256']if j==0 else expected);txs.append(tx)
   assert bytes(txs[0].message)==bytes(txs[1].message)
  runs.append({'role':'selected'if not dirname else'baseline','candidate_sha256':expected,'cases':98,'mismatches':0,'signed_transactions':196})
 return {'passed':True,'candidate_sha256':m['candidate_sha256'],'selected_cases':98,'baseline_cases':98,'signed_transactions_verified':392,'raw_log_hashes_verified':392,'candidate_file_verified':candidate is not None,'explicit_baseline_verified':True,'inputs_verified':len(inputs),'runs':runs,'scope':'Saved signed replay observations; raw logs are bound, while behavioral comparison uses errors, state, lamports and events as in the original suite.'}

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path);p.add_argument('--baseline',type=Path);p.add_argument('--repository-root',type=Path);p.add_argument('--expected-seal');a=p.parse_args();print(json.dumps(verify(candidate=a.candidate,baseline=a.baseline,repository_root=a.repository_root,expected_seal=a.expected_seal),indent=2))
