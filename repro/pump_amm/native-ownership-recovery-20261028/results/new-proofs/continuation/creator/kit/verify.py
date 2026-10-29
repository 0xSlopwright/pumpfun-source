#!/usr/bin/env python3
"""Verify replay-kit output, candidate binding, dependency scopes, and signatures."""
from pathlib import Path,PurePosixPath
import argparse,base64,gzip,hashlib,json,re
from solders.transaction import Transaction
K=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
PUMP='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';FEES='pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ'
def clean(logs):return [re.sub(r'(?<=panicked at )[^\s:]+:[0-9]+(?::[0-9]+)?','<source>',re.sub(r'(?<=thrown in )[^\s:]+:[0-9]+','<source>',v))for v in logs if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)]
def verify(proof,candidate=None,root=None):
 proof=Path(proof).resolve();m=json.loads((proof/'run.json').read_bytes());assert m['passed']
 root=Path(root).resolve()if root is not None else next(p for p in proof.parents if(p/'evidence/original/pump_amm/deployed.so').is_file())
 assert {str(p.relative_to(proof))for p in proof.rglob('*')if p.is_file()}==set(m['files'])|{'run.json'}
 for name,digest in m['files'].items():
  q=PurePosixPath(name);assert not q.is_absolute()and '..'not in q.parts;assert sha(proof/name)==digest,name
 for name,digest in m['inputs'].items():assert sha(root/name)==digest,name
 if candidate is not None:assert sha(candidate)==m['candidate_sha256']
 kit=proof/'kit';assert sha(kit/'synthetic-cpi-caller.so')==m['oracle_sha256'];runs=[];transactions=signatures=0
 for name,n in [('cashback',146),('cto',159),('order',8)]:
  r=json.loads((proof/(name+'.json')).read_bytes());ob=json.loads(gzip.decompress((proof/(name+'-transactions.json.gz')).read_bytes()));rows=ob['transactions'];assert r['candidate_sha256']==m['candidate_sha256']and r['original_sha256']==m['original_sha256'];assert r['case_count']==len(r['cases'])==n and len(rows)==2*n;assert not r['mismatches'];assert r['script_sha256']==ob['script_sha256']==sha(kit/(name+'.py'));assert ob['observer_sha256']==sha(kit/'observer.py');reached=0
  if name=='order':assert r['oracle_sha256']==m['oracle_sha256']
  for i,case in enumerate(r['cases']):
   l,c=case['original'],case['candidate']
   if name=='cto':
    assert case['match']and not case['mismatched_fields'];assert all(l[x]==c[x]for x in ['error','before','after','events','inner','return']);reached+=any('Instruction: AdminCtoPool'in v for v in l['logs'])
   else:
    assert not case['diff'];assert all(l[x]==c[x]for x in l if x!='logs');assert l['diagnostics']==clean(l['logs'])and c['diagnostics']==clean(c['logs'])
    if name=='order':assert l['reached_amm']and c['reached_amm'];reached+=1
   txs=[]
   for j,row in enumerate(rows[2*i:2*i+2]):
    side=l if j==0 else c;raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count'];signatures+=len(checks);transactions+=1;txs.append(tx)
    assert row['amm_program_sha256']==(m['original_sha256']if j==0 else m['candidate_sha256']);assert row['error']==side['error'];assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest()
    allowed=set(m['inputs'].values())|{m['oracle_sha256'],m['candidate_sha256']}
    assert all(v['sha256']in allowed for v in row['loaded_programs'].values())
    if name=='cto':assert row['loaded_programs'][PUMP]['sha256']==m['inputs']['evidence/original/pump/deployed.so']and row['loaded_programs'][FEES]['sha256']==m['inputs']['evidence/original/pump_fees/deployed.so']
    if name=='order':assert row['loaded_programs'][PUMP]['sha256']==m['oracle_sha256']
   assert bytes(txs[0].message)==bytes(txs[1].message)
  if name=='cto':assert reached==r['cases_reaching_amm']==140
  if name=='order':assert reached==8
  runs.append({'group':name,'cases':n,'amm_entries':reached if name!='cashback'else None,'mismatches':0,'dependency_scope':'synthetic Pump CPI caller substitution'if name=='order'else'captured programs'})
 return {'passed':True,'candidate_sha256':m['candidate_sha256'],'cases':313,'transactions_verified':transactions,'signatures_verified':signatures,'raw_log_hashes_verified':transactions,'runs':runs,'scope':'Bounded mixed-scope tests; order group uses an explicitly synthetic substituted Pump caller with normal SVM signatures/PDA rules.'}
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--proof',type=Path,default=K.parent);p.add_argument('--candidate',type=Path);p.add_argument('--root',type=Path);a=p.parse_args();print(json.dumps(verify(a.proof,a.candidate,a.root),indent=2))
