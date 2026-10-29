from pathlib import Path
import hashlib,base64,gzip,json,sys
from solders.transaction import Transaction
W=Path(__file__).parent
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def J(p):return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def verify(w=W):
 candidate=H(w/'build/artifacts/pump_amm_recovered.so');I=w/'runtime-inputs';original=H(I/'evidence/original/pump_amm/deployed.so');allrows=[]
 for label,script,count in [('create246','pump_amm_create_differential.py',246),('canonical37','pump_amm_migration_create_differential.py',37)]:
  r=J(w/(label+'.json'));obs=J(w/(label+'-transactions.json.gz'));assert r['candidate_sha256']==candidate and r['original_sha256']==original and r['case_count']==len(r['cases'])==count and not r['mismatches']
  assert r['script_sha256']==obs['script_sha256']==H(I/'scripts'/script);assert obs['observer_sha256']==H(I/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py');sig=0
  for i,row in enumerate(r['cases']):
   assert row['original']==row['candidate']
   pair=obs['transactions'][i*2:i*2+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']
   for side,t,expected in zip(['original','candidate'],pair,[original,candidate]):
    raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified']and len(checks)==t['signature_count'];sig+=len(checks)
    assert t['transaction_sha256']==hashlib.sha256(raw).hexdigest()and t['error']==row[side]['error']and t['amm_program_sha256']==expected
    for pid,program in t['loaded_programs'].items():
     if pid=='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA':assert program['sha256']==expected
     else:
      assert '/evidence/'in program['path'];name='evidence/'+program['path'].split('/evidence/',1)[1];assert H(I/name)==program['sha256']
  assert obs['transaction_count']==count*2 and obs['signature_count']==sig
  allrows.append({'suite':label,'cases':count,'transactions':count*2,'signature_fields':sig,'mismatches':0})
 return {'passed':True,'candidate_sha256':candidate,'suites':allrows,'scope':'Current signed messages, loaded images and errors independently bound; saved producer state/event/CPI fields compared exactly. Sidecars contain log digests only and do not independently reproduce event or full-state observations.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
