#!/usr/bin/env python3
"""Verify sealed incentive-domain observations, explicit baseline, and signatures."""
from pathlib import Path,PurePosixPath
import argparse,base64,gzip,hashlib,json,re
from solders.transaction import Transaction
D=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
BASELINE='eb13c88d0d4c12868fa579b8b9f3b6e428652ea86d42274979570868e2a74688'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def normalize(logs):
 return [re.sub(r'(?<=panicked at )[^\s:]+:[0-9]+(?::[0-9]+)?','<source>',re.sub(r'(?<=thrown in )[^\s:]+:[0-9]+','<source>',v))for v in logs if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)]
def verify(proof=D,candidate=None,baseline=None,repository_root=None,expected_seal=None):
 proof=Path(proof).resolve();manifest=json.loads((proof/'manifest.json').read_bytes())
 if expected_seal is not None:assert sha(proof/'manifest.json')==expected_seal
 assert {str(p.relative_to(proof))for p in proof.rglob('*')if p.is_file()}==set(manifest['files'])|{'manifest.json'}
 for name,digest in manifest['files'].items():
  part=PurePosixPath(name);assert not part.is_absolute()and '..'not in part.parts
  path=proof/name;assert not path.is_symlink()and sha(path)==digest,name
 root=Path(repository_root).resolve()if repository_root is not None else next(p for p in proof.parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
 inputs=json.loads((proof/'inputs.json').read_bytes())
 for name,digest in inputs.items():assert sha(root/name)==digest,name
 assert sha(root/'evidence/original/pump_amm/deployed.so')==ORIGINAL
 if candidate is not None:assert sha(candidate)==manifest['candidate_sha256']
 assert sha(Path(baseline)if baseline is not None else proof/'baseline/candidate.so')==BASELINE
 count=0;runs=[];baseline_rows=None
 for group,num,expected,expected_mismatches in [('admin',668,manifest['candidate_sha256'],0),('edges',32,manifest['candidate_sha256'],0),('baseline/edges',32,BASELINE,20)]:
  report=json.loads((proof/(group+'.json')).read_bytes());observed=json.loads(gzip.decompress((proof/(group+'-transactions.json.gz')).read_bytes()));rows=observed['transactions'];folder=proof/Path(group).parent;producer=folder/(Path(group).name+'.py')
  assert report['candidate_sha256']==expected and report['original_sha256']==ORIGINAL
  assert report['case_count']==len(report['cases'])==num and observed['transaction_count']==len(rows)==num*2
  assert report['script_sha256']==observed['script_sha256']==sha(producer)
  assert observed['observer_sha256']==sha(proof/'observer.py')
  actual=[]
  for i,case in enumerate(report['cases']):
   left,right=case['original'],case['candidate'];diff=[k for k in left if k!='logs'and left[k]!=right[k]];assert case['diff']==diff
   if diff:actual.append(i)
   if group=='admin':
    for side in [left,right]:assert side['diagnostics']==normalize(side['logs'])
   txs=[]
   for j,row in enumerate(rows[2*i:2*i+2]):
    side=left if j==0 else right;assert row['error']==side['error'];assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest()
    raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count'];txs.append(tx)
    assert row['amm_program_sha256']==(ORIGINAL if j==0 else expected)
    for program in row['loaded_programs'].values():assert program['sha256']in set(inputs.values())|{manifest['candidate_sha256'],BASELINE}
   assert bytes(txs[0].message)==bytes(txs[1].message)
  assert actual==report['mismatches']and len(actual)==expected_mismatches
  if group.startswith('baseline/'):
   baseline_rows=report['cases'];assert sum(report['cases'][i]['candidate']['error']is None for i in actual)==17
   assert sum(report['cases'][i]['candidate']['error']is not None for i in actual)==3
   assert all('ProgramFailedToComplete'in report['cases'][i]['original']['error']for i in actual)
  count+=num*2;runs.append({'group':group,'cases':num,'differences':len(actual),'signed_transactions':num*2})
 selected=json.loads((proof/'edges.json').read_bytes())['cases'];assert [c['input']for c in selected]==[c['input']for c in baseline_rows]
 return {'passed':True,'candidate_sha256':manifest['candidate_sha256'],'selected_cases':700,'baseline_cases':32,'signed_transactions_verified':count,'raw_log_hashes_verified':count,'candidate_file_verified':candidate is not None,'explicit_baseline_verified':True,'inputs_verified':len(inputs),'baseline_wrong_successes':17,'baseline_wrong_custom_errors':3,'runs':runs,'scope':'Bounded synthetic incentive-domain replay; admin compares all diagnostics except source coordinates and compute usage. No live-state reachability or whole-program-equivalence claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path);p.add_argument('--baseline',type=Path);p.add_argument('--repository-root',type=Path);p.add_argument('--expected-seal');a=p.parse_args();print(json.dumps(verify(candidate=a.candidate,baseline=a.baseline,repository_root=a.repository_root,expected_seal=a.expected_seal),indent=2))
