from pathlib import Path
import base64,gzip,hashlib,json,re
from solders.transaction import Transaction
W=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
CANDIDATE='98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3'
def load(p):
 p=Path(p)
 if not p.exists()and p.suffix=='.json':p=p.with_suffix('.json.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def logs(v):
 return[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',re.sub(r'(?<=panicked at )[^ ]+:[0-9]+:[0-9]+','<source>',s))for s in v if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',s)]
def clean(x):
 if isinstance(x,dict):return{k:logs(v)if k=='logs'else clean(v)for k,v in x.items()}
 if isinstance(x,list):return[clean(y)for y in x]
 return x
H=lambda b:hashlib.sha256(b).hexdigest()
def verify(root=W):
 root=Path(root);summary=[];total=transactions=signatures=successes=0
 amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
 dependencies={'6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':'evidence/original/pump/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
 dependency_hashes={pid:H((root/'runtime-inputs'/path).read_bytes())for pid,path in dependencies.items()}
 assert H((root/'build/artifacts/pump_amm_recovered.so').read_bytes())==CANDIDATE
 for name,count in [('cashback',146),('creator_reassignment',327),('creator_reassignment_cto',159),('trade_v2',870)]:
  report=load(root/'targeted'/(name+'.json'));obs=load(root/'targeted'/(name+'-transactions.json.gz'))
  assert report['candidate_sha256']==CANDIDATE and report['original_sha256']==ORIGINAL and report['case_count']==count
  assert len(report['cases'])==count and len(obs['transactions'])==count*2 and obs['transaction_count']==count*2
  assert not report['mismatches'];assert obs['script_sha256']==report['script_sha256'];assert H((root/'runtime-source/scripts'/('pump_amm_'+name+'_differential.py')).read_bytes())==report['script_sha256'];assert H((root/'runtime-source/observe_suite.py').read_bytes())==obs['observer_sha256']
  ns=ng=0
  for i,row in enumerate(report['cases']):
   assert clean(row['original'])==clean(row['candidate']),(name,i,'full state/log mismatch')
   if row['original'].get('error')is None:ng+=1
   pair=obs['transactions'][2*i:2*i+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']
   for txrow,side,digest in zip(pair,['original','candidate'],[ORIGINAL,CANDIDATE]):
    raw=base64.b64decode(txrow['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and txrow['all_signatures_verified'];assert len(checks)==txrow['signature_count'];ns+=len(checks)
    assert H(raw)==txrow['transaction_sha256']and txrow['amm_program_sha256']==digest
    assert H(json.dumps(row[side]['logs'],separators=(',',':')).encode())==txrow['logs_sha256']
    assert row[side]['error']==txrow['error']
    for pid,artifact in txrow['loaded_programs'].items():
     assert obs['program_file_sha256'][artifact['path']]==artifact
     assert artifact['sha256']==(digest if pid==amm else dependency_hashes[pid])
   # Where a suite separately retains a transaction, bind it to observed bytes.
   for side,txrow in zip(['original','candidate'],pair):
    for key in ('tx','transaction_base64'):
     if key in row[side]:assert row[side][key]==txrow['transaction_base64']
  assert ns==obs['signature_count'];total+=count;transactions+=2*count;signatures+=ns;successes+=ng;summary.append({'suite':name,'cases':count,'executions':2*count,'signatures':ns,'original_successes':ng})
 assert(total,transactions,signatures)==(1502,3004,3322)
 return{'passed':True,'candidate_sha256':CANDIDATE,'cases':total,'executions':transactions,'verified_signatures':signatures,'mismatches':0,'original_successes':successes,'suites':summary,'scope':'Fresh saved full-state, inner-instruction, event, return, error, normalized-log and normal-signature audit. Only compute consumption and source coordinates are ignored in logs. No VM executions performed by this verifier.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
