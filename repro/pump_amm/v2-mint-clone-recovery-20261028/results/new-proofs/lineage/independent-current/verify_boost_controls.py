from pathlib import Path
import base64,gzip,hashlib,json,re
from solders.transaction import Transaction

def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def clean(r):
 q=dict(r);q['logs']=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',v)for v in r['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)];return q

def verify(root):
 w=Path(root);r=json.loads((w/'boost-helper14.json').read_bytes());o=json.loads(gzip.decompress((w/'boost-helper14-transactions.json.gz').read_bytes()));d=H(w/'build/artifacts/pump_amm_recovered.so');original=H(w/'runtime-inputs/evidence/original/pump_amm/deployed.so')
 assert r['candidate_sha256']==d and r['original_sha256']==original and r['case_count']==len(r['cases'])==14 and not r['mismatches'];assert r['producer_sha256']==o['script_sha256']==H(w/'probe_boost_controls.py')and o['observer_sha256']==H(w/'runtime-inputs/repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
 assert len(o['transactions'])==o['transaction_count']==28;sig=0
 for i,row in enumerate(r['cases']):
  assert not row['different_fields']and clean(row['original'])==clean(row['candidate'])
  p=o['transactions'][i*2:i*2+2];assert p[0]['transaction_base64']==p[1]['transaction_base64']
  for side,t,digest in zip(['original','candidate'],p,[original,d]):
   raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified'];sig+=len(checks)
   assert t['signature_count']==len(checks)and t['amm_program_sha256']==digest and t['transaction_sha256']==hashlib.sha256(raw).hexdigest()and t['error']==row[side]['error']and t['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
   for pid,x in t['loaded_programs'].items():
    if pid=='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA':assert x['sha256']==digest
    else:assert '/evidence/'in x['path']and H(w/'runtime-inputs'/'evidence'/x['path'].split('/evidence/',1)[1])==x['sha256']
 assert sig==o['signature_count']
 return {'passed':True,'candidate_sha256':d,'cases':14,'transactions':28,'signature_fields':sig,'mismatches':0,'scope':'Supplemental synthetic hook/self-alias/owner controls; current exact saved state,events,inner instructions and normalized diagnostics.'}
