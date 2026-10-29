#!/usr/bin/env python3
"""Verify the sealed 24-case buyback diagnostic replay and preserved baseline."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json
from solders.transaction import Transaction
D=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()

def verify(proof=D,candidate=None,repository_root=None,expected_seal=None,baseline=None):
 proof=Path(proof).resolve();manifest=json.loads((proof/'manifest.json').read_bytes())
 if expected_seal is not None:assert sha(proof/'manifest.json')==expected_seal
 files={str(p.relative_to(proof))for p in proof.rglob('*')if p.is_file()}
 assert files==set(manifest['files'])|{'manifest.json'},'Proof inventory differs'
 for name,digest in manifest['files'].items():
  path=proof/name;assert not path.is_symlink();assert sha(path)==digest,name
 root=Path(repository_root).resolve()if repository_root is not None else next(p for p in proof.parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
 inputs=json.loads((proof/'inputs.json').read_bytes())
 for name,digest in inputs.items():assert sha(root/name)==digest,name
 summaries=[]
 for dirname,expected_bad,expected_candidate in [('',0,manifest['candidate_sha256']),('baseline',12,'5c1e8b18ead27d0b3c1840f37b24ef5044adb65e2a3a566d5be7694ff8737c05')]:
  folder=proof/dirname;result=json.loads((folder/'result.json').read_bytes());observer=json.loads(gzip.decompress((folder/'transactions.json.gz').read_bytes()))
  assert result['candidate_sha256']==expected_candidate and result['case_count']==len(result['cases'])==24
  assert result['original_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
  assert result['probe_sha256']==observer['script_sha256']==sha(folder/'probe.py')
  assert observer['observer_sha256']==inputs['repro/pump_amm/owner6048-v144/runtime/observe_suite.py']
  rows=observer['transactions'];assert len(rows)==observer['transaction_count']==48
  bad=0
  for i,case in enumerate(result['cases']):
   actual=[k for k in case['original']if case['original'][k]!=case['candidate'][k]];assert actual==case['differences'];bad+=bool(actual)
   pair=rows[2*i:2*i+2];txs=[]
   for j,row in enumerate(pair):
    raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256']
    tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count'];assert row['all_signatures_verified']is True
    assert row['amm_program_sha256']==(result['original_sha256']if j==0 else result['candidate_sha256']);txs.append(tx)
   assert bytes(txs[0].message)==bytes(txs[1].message)
  assert bad==result['mismatch_count']==expected_bad
  summaries.append({'role':'selected'if not dirname else'preserved baseline','candidate_sha256':expected_candidate,'cases':24,'differences':bad,'signed_transactions':48})
 baseline_file=Path(baseline)if baseline is not None else proof/'baseline/candidate.so'
 assert sha(baseline_file)=='5c1e8b18ead27d0b3c1840f37b24ef5044adb65e2a3a566d5be7694ff8737c05'
 if candidate is not None:assert sha(candidate)==manifest['candidate_sha256']
 return {'passed':True,'candidate_sha256':manifest['candidate_sha256'],'cases':24,'selected_differences':0,'preserved_baseline_differences':12,'signed_transactions_verified':96,'candidate_file_verified':candidate is not None,'source_and_observer_inputs_verified':len(inputs),'runs':summaries,'scope':'Saved signed messages and sealed log-sensitive replay observations; does not execute transactions or claim whole-program equality.'}

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path);p.add_argument('--repository-root',type=Path);p.add_argument('--expected-seal');p.add_argument('--baseline',type=Path);a=p.parse_args();print(json.dumps(verify(candidate=a.candidate,repository_root=a.repository_root,expected_seal=a.expected_seal,baseline=a.baseline),indent=2))
