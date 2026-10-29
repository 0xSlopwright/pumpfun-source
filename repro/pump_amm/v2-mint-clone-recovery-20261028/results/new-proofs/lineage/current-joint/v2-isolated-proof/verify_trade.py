from pathlib import Path
import base64,gzip,hashlib,importlib.util,json,re
from solders.transaction import Transaction
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def J(p):
 if not p.exists():p=p.with_suffix(p.suffix+'.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify(root=None):
 w=Path(root or Path(__file__).parent);i=w/'runtime-inputs';r=J(w/'trade870.json');obs=J(w/'trade870-transactions.json.gz');candidate=H(w/'build/artifacts/pump_amm_recovered.so');original=H(i/'evidence/original/pump_amm/deployed.so')
 assert r['candidate_sha256']==candidate and r['original_sha256']==original and r['case_count']==len(r['cases'])==870 and not r['mismatches']
 assert r['script_sha256']==obs['script_sha256']==H(i/'scripts/pump_amm_trade_v2_differential.py')and r['harness_sha256']==H(i/'scripts/pump_amm_reusable_harness.py')and obs['observer_sha256']==H(i/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
 p=i/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';sp=importlib.util.spec_from_file_location('trade_clean',p);m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m)
 deps={'6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':'evidence/original/pump/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
 hashes={k:H(i/v)for k,v in deps.items()};amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';signatures=0;by_mode={}
 assert len(obs['transactions'])==obs['transaction_count']==1740
 for index,row in enumerate(r['cases']):
  assert m.clean(row['original'])==m.clean(row['candidate'])
  pair=obs['transactions'][index*2:index*2+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64'];by_mode[row['instruction']]=by_mode.get(row['instruction'],0)+1
  for side,t,wanted in zip(['original','candidate'],pair,[original,candidate]):
   raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified']and t['signature_count']==len(checks);signatures+=len(checks)
   assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and t['amm_program_sha256']==wanted and t['error']==row[side]['error']and hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()==t['logs_sha256']
   for pid,v in t['loaded_programs'].items():assert v['sha256']==(wanted if pid==amm else hashes[pid])
 assert signatures==obs['signature_count']==1740
 return {'passed':True,'candidate_sha256':candidate,'cases':870,'transactions':1740,'signature_fields':1740,'mismatches':0,'by_mode':by_mode,'scope':'Full saved outcomes and logs under declared source/compute normalization; all signed messages, images and retained log digests bound. No new VM executed by verifier.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
