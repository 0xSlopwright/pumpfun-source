from pathlib import Path
import argparse,base64,gzip,hashlib,json,types
from solders.transaction import Transaction

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):
 raw=Path(p).read_bytes();return json.loads(gzip.decompress(raw)if raw[:2]==b'\x1f\x8b'else raw)
def verify(inputs,candidate,reports):
 I,C,O=Path(inputs),Path(candidate),Path(reports);digest=sha(C);original=sha(I/'evidence/original/pump_amm/deployed.so');assert {str(p.relative_to(I)):sha(p)for p in I.rglob('*')if p.is_file()}==read(O/'input-manifest.json')
 p=I/'repro/pump_amm/transfer-abi-recovery-20261027/compare_direct_cached.py';direct=types.ModuleType('cleaner');direct.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),direct.__dict__)
 amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';deps={'6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':'evidence/original/pump/deployed.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'};summary=[]
 for name,script,count in [('buy','probe_buy_events.py',16),('sell','probe_sell_events.py',10),('contexts','probe_contexts.py',21),('buy_executors','probe_buy_executors.py',18)]:
  r=read(O/(name+'.json'));obs=read(O/(name+'-transactions.json.gz'));assert(r['candidate_sha256'],r['original_sha256'],r['case_count'],len(r['cases']),r['mismatch_count'])==(digest,original,count,count,0)
  assert r['producer_sha256'if name=='contexts'else'probe_sha256']==obs['script_sha256']==sha(I/'repro/pump_amm/transfer-abi-recovery-20261027'/script);assert obs['observer_sha256']==sha(I/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
  assert obs['transaction_count']==len(obs['transactions'])==2*count;signatures=0
  for i,row in enumerate(r['cases']):
   assert direct.clean(row['original'])==direct.clean(row['candidate'])and not row['mismatched_fields'];pairs=[]
   for j,side in enumerate(['original','candidate']):
    t=obs['transactions'][i*2+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results());signatures+=len(tx.signatures);assert t['signature_count']==len(tx.signatures)and sha_bytes(raw)==t['transaction_sha256'];assert row[side].get('transaction_base64',t['transaction_base64'])==t['transaction_base64'];assert t['error']==row[side]['error'];assert t['logs_sha256']==sha_bytes(json.dumps(row[side]['logs'],separators=(',',':')).encode());expected=original if side=='original'else digest;assert t['amm_program_sha256']==t['loaded_programs'][amm]['sha256']==expected
    for pid,v in t['loaded_programs'].items():assert v['sha256']==(expected if pid==amm else sha(I/deps[pid]))
    pairs.append(raw)
   assert pairs[0]==pairs[1]
   if name=='contexts':
    x,y=row['original_state_receipt'],row['candidate_state_receipt'];assert x['transaction_sha256']==y['transaction_sha256']==sha_bytes(pairs[0])and x['before']==y['before']and x['after']==y['after']
  assert signatures==obs['signature_count'];summary.append({'suite':name,'cases':count,'signatures':signatures})
 return {'passed':True,'candidate_sha256':digest,'cases':65,'signatures':sum(r['signatures']for r in summary),'suites':summary,'scope':'Signed captured-program replay with exact logs/errors and context snapshots; not full-corpus coverage.'}
def sha_bytes(x):return hashlib.sha256(x).hexdigest()
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--inputs',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--reports',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.inputs,a.candidate,a.reports),indent=2))
