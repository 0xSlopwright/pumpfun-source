from pathlib import Path
import argparse,base64,gzip,hashlib,json,types
from solders.transaction import Transaction

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def digest(b):return hashlib.sha256(b).hexdigest()
def read(p):
 raw=Path(p).read_bytes();return json.loads(gzip.decompress(raw)if raw[:2]==b'\x1f\x8b'else raw)
def verify(inputs,candidate,reports,observer):
 I,C,O=Path(inputs),Path(candidate),Path(reports);candidate_sha=sha(C);original_sha=sha(I/'evidence/original/pump_amm/deployed.so')
 assert read(O/'input-manifest.json')=={str(p.relative_to(I)):sha(p)for p in I.rglob('*')if p.is_file()}
 r,t=read(O/'report.json'),read(O/'transactions.json.gz');rows=r['cases'];n=len(rows)
 assert n==r['case_count'] and not r['mismatches']
 assert r['candidate_sha256']==candidate_sha and r['original_sha256']==original_sha
 assert r['script_sha256']==t['script_sha256']==sha(I/'scripts/pump_amm_sweep_differential.py')
 assert t['observer_sha256']==sha(observer) and t['transaction_count']==len(t['transactions'])==n*2
 p=I/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';cleaner=types.ModuleType('cleaner');cleaner.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)
 amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
 deps={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
 sigs=0;success=0
 for i,row in enumerate(rows):
  assert not row['diff'] and row['original']==row['candidate']
  pair=t['transactions'][i*2:i*2+2]
  assert pair[0]['transaction_base64']==pair[1]['transaction_base64']
  assert pair[0]['before']==pair[1]['before'] and pair[0]['after']==pair[1]['after']
  assert cleaner.clean({'logs':pair[0]['logs'],'inner':pair[0]['inner'],'error':pair[0]['error']})==cleaner.clean({'logs':pair[1]['logs'],'inner':pair[1]['inner'],'error':pair[1]['error']})
  for j,side in enumerate(['original','candidate']):
   x=pair[j];raw=base64.b64decode(x['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)
   assert digest(raw)==x['transaction_sha256'] and len(checks)==x['signature_count'];sigs+=len(checks)
   assert x['sequence']==i*2+j and x['error']==row[side]['error']
   assert digest(json.dumps(x['logs'],separators=(',',':')).encode())==x['logs_sha256']
   assert x['inner']==row[side]['inner']
   assert [v for v in x['logs']if v.startswith('Program data: ')]==row[side]['events']
   expected=original_sha if j==0 else candidate_sha
   assert x['amm_program_sha256']==x['loaded_programs'][amm]['sha256']==expected
   for pid,loaded in x['loaded_programs'].items():assert loaded['sha256']==(expected if pid==amm else sha(I/deps[pid]))
   assert set(x['before'])==set(x['after'])
   for key,state in row[side]['states'].items():
    actual=x['after'][key]
    if state is None:assert actual is None
    else:assert bytes(actual['data']).hex()==state['data'] and actual['lamports']==state['lamports'] and actual['owner']==state['owner']
  success+=pair[0]['error']is None
 assert sigs==t['signature_count']
 return {'passed':True,'candidate_sha256':candidate_sha,'cases':n,'signatures':sigs,'original_success_cases':success,'full_logs_compared':True,'full_nonexecutable_message_accounts_compared':True,'scope':'Existing signed sweep matrix; captured original AMM and token/ATA dependencies, synthetic account variations. Only compute-consumption logs and source locations normalized.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--inputs',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--reports',type=Path,required=True);p.add_argument('--observer',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.inputs,a.candidate,a.reports,a.observer),indent=2))
