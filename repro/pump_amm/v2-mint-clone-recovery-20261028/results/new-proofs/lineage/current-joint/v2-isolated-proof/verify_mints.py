from pathlib import Path
import base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction
def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def J(p):
 if not p.exists():p=p.with_suffix(p.suffix+'.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify(root=None):
 w=Path(root or Path(__file__).parent);r=J(w/'v2-mints.json');obs=J(w/'v2-mints-transactions.json.gz');i=w/'runtime-inputs';candidate=H(w/'build/artifacts/pump_amm_recovered.so');original=H(i/'evidence/original/pump_amm/deployed.so')
 assert r['candidate_sha256']==candidate and r['original_sha256']==original and r['case_count']==len(r['cases'])==174 and r['mismatch_count']==0
 assert r['producer_sha256']==obs['script_sha256']==H(w/'probe_v2_mints.py')
 p=i/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';assert H(p)==r['comparator_sha256'];s=importlib.util.spec_from_file_location('v2-mints_clean',p);clean=importlib.util.module_from_spec(s);s.loader.exec_module(clean)
 assert obs['observer_sha256']==H(i/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
 amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';deps={'6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':'evidence/original/pump/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'};hashes={k:H(i/p)for k,p in deps.items()};signatures=0
 assert len(obs['transactions'])==obs['transaction_count']==348
 for index,row in enumerate(r['cases']):
  assert not row['mismatched_fields'] and clean.clean(row['original'])==clean.clean(row['candidate'])
  pair=obs['transactions'][2*index:2*index+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']
  for side,t,expected in zip(['original','candidate'],pair,[original,candidate]):
   raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified'];signatures+=len(v)
   assert t['signature_count']==len(v)and t['transaction_sha256']==hashlib.sha256(raw).hexdigest();assert t['error']==row[side]['error']and t['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
   assert t['amm_program_sha256']==expected
   for pid,artifact in t['loaded_programs'].items():assert artifact['sha256']==(expected if pid==amm else hashes[pid])
 assert signatures==obs['signature_count']==348
 return {'passed':True,'candidate_sha256':candidate,'cases':174,'transactions':348,'signature_fields':348,'mismatches':0,'full_account_snapshots_compared':True,'executes_vm':False}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
