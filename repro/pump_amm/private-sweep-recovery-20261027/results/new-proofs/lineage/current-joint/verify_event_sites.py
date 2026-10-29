from pathlib import Path
import argparse,base64,collections,gzip,hashlib,json,types
from solders.transaction import Transaction
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def digest(b):return hashlib.sha256(b).hexdigest()
def verify(directory,candidate,inputs,producer,observer):
 D,C,I=Path(directory),Path(candidate),Path(inputs);r=json.loads((D/'report.json').read_bytes());o=json.loads(gzip.decompress((D/'transactions.json.gz').read_bytes()))
 assert r['case_count']==len(r['cases'])==21 and r['mismatch_count']==0 and o['transaction_count']==len(o['transactions'])==42
 assert r['candidate_sha256']==sha(C)and r['original_sha256']==sha(I/'evidence/original/pump_amm/deployed.so')
 assert r['producer_sha256']==o['script_sha256']==sha(producer)and o['observer_sha256']==sha(observer)
 assert json.loads((D/'inputs.json').read_bytes())=={str(p.relative_to(I)):sha(p)for p in I.rglob('*')if p.is_file()}
 p=I/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';clean=types.ModuleType('cleaner');clean.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),clean.__dict__)
 amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';deps={'6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':'evidence/original/pump/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
 wanted={'CreatePoolEvent':3,'BuyEvent':2,'BoostBuyAndBurnEvent':2,'InitBoostEvent':1,'AdminCtoPoolEvent':3,'ExtendAccountEvent':6,'SellEvent':2};lookup={digest(('event:'+n).encode())[:16]:n for n in wanted};counts=collections.Counter();sigs=success=0
 for i,row in enumerate(r['cases']):
  assert not row['different_fields']and clean.clean(row['original'])==clean.clean(row['candidate'])
  pair=o['transactions'][2*i:2*i+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']and pair[0]['before']==pair[1]['before']and pair[0]['after']==pair[1]['after']
  assert clean.clean({k:pair[0][k]for k in['logs','inner','error']})==clean.clean({k:pair[1][k]for k in['logs','inner','error']})
  for j,side in enumerate(['original','candidate']):
   t,v=pair[j],row[side];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks);sigs+=len(checks)
   assert t['sequence']==2*i+j and t['signature_count']==len(checks)and t['transaction_sha256']==digest(raw)
   assert t['logs']==v['logs']and t['error']==v['error']and t['inner']==v['inner'];assert t['logs_sha256']==digest(json.dumps(t['logs'],separators=(',',':')).encode())
   if 'transaction_base64'in v:assert v['transaction_base64']==t['transaction_base64']
   expected=r['original_sha256']if j==0 else r['candidate_sha256'];assert t['amm_program_sha256']==t['loaded_programs'][amm]['sha256']==expected
   for pid,loaded in t['loaded_programs'].items():assert loaded['sha256']==(expected if pid==amm else sha(I/deps[pid]))
  success+=pair[0]['error']is None
  for line in pair[0]['logs']:
   if line.startswith('Program data: '):
    raw=base64.b64decode(line[len('Program data: '):],validate=True);name=lookup.get(raw[:8].hex())
    if name:counts[name]+=1
 assert counts==wanted and sigs==o['signature_count']==48 and success==16
 return{'passed':True,'candidate_sha256':sha(C),'cases':21,'signatures':sigs,'success_cases':success,'selected_event_counts':dict(counts),'full_logs_and_message_account_snapshots_equal':True,'scope':'Bounded existing-fixture executions reaching every selected event site, including authenticated captured Pump migration and creator reassignment CPIs.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--inputs',type=Path,required=True);p.add_argument('--producer',type=Path,required=True);p.add_argument('--observer',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate,a.inputs,a.producer,a.observer),indent=2))
