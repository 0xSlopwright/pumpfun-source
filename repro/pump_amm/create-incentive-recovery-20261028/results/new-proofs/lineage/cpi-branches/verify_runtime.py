#!/usr/bin/env python3
from pathlib import Path
import argparse,base64,gzip,hashlib,json,re
from solders.transaction import Transaction
W=Path(__file__).resolve().parent

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def clean(logs,source=True):
 out=[v for v in logs if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)]
 if source:out=[re.sub(r'(?<=panicked at )[^\s:]+:[0-9]+(?::[0-9]+)?','<source>',re.sub(r'(?<=thrown in )[^\s:]+:[0-9]+','<source>',v))for v in out]
 return out

def verify(root, candidate=None, output=None):
 root=Path(root).resolve();candidate=Path(candidate).resolve()if candidate else W/'build/artifacts/pump_amm_recovered.so';ch=sha(candidate);oh=sha(root/'evidence/original/pump_amm/deployed.so');oracle=root/'repro/pump_amm/linux-v144-current-20261027/results/cpi/oracle/synthetic-oracle.so';oraclehash=sha(oracle);out=Path(output).resolve()if output else W/'replay';totals=signatures=strict=0;groups=[]
 allowed={ch,oh,oraclehash,sha(root/'evidence/original/pump/deployed.so'),sha(root/'evidence/original/pump_fees/deployed.so')}|{sha(root/'evidence/dependencies'/n/'deployed.so')for n in ['spl_token','spl_token_2022','associated_token']}
 for name,n in [('cpi',65),('curve-balances',20),('source-amounts',6),('curves',64)]:
  r=json.loads((out/(name+'.json')).read_bytes());obs=json.loads(gzip.decompress((out/(name+'-transactions.json.gz')).read_bytes()));rows=obs['transactions'];assert len(r['cases'])==n and len(rows)==n*2
  assert r.get('genuine_candidate_sha256',r.get('candidate_sha256'))==ch;assert r.get('genuine_original_sha256',r.get('original_sha256'))==oh
  for i,case in enumerate(r['cases']):
   x,y=case['original'],case['candidate'];assert all(x[k]==y[k]for k in x if k!='logs');assert clean(x['logs'])==clean(y['logs'])
   if name=='cpi'and case['suite'].startswith('curve_')and case['length']!=16:assert clean(x['logs'],False)==clean(y['logs'],False);strict+=1
   txs=[]
   for j,row in enumerate(rows[2*i:2*i+2]):
    side=x if j==0 else y;raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count'];signatures+=len(checks);totals+=1;txs.append(tx);assert row['amm_program_sha256']==(oh if j==0 else ch);assert row['error']==side['error'];assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest();assert all(v['sha256']in allowed for v in row['loaded_programs'].values())
    if name=='curves':assert row['loaded_programs']['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P']['sha256']==sha(root/'evidence/original/pump/deployed.so')
    if name!='curves':
     pid='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'if(name!='cpi'or case['suite'].startswith('curve_'))else'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ';assert row['loaded_programs'][pid]['sha256']==oraclehash;assert sum('SYNTHETIC_RETURN_ORACLE'in s for s in side['logs'])==1
   assert bytes(txs[0].message)==bytes(txs[1].message)
  groups.append({'group':name,'cases':n})
 assert strict==24
 return {'passed':True,'candidate_sha256':ch,'cases':155,'transactions_verified':totals,'signatures_verified':signatures,'raw_log_hashes_verified':totals,'malformed_curve_logs_equal_without_source_normalization':strict,'groups':groups,'scope':'91 explicitly synthetic CPI-dependency cases and64 captured-Pump route cases. Strict malformed-return behavior and source origin verified; no live transaction or whole-program identity claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--output',type=Path);a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.output),indent=2))
