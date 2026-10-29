from pathlib import Path
import hashlib,json,gzip,base64,re
from solders.transaction import Transaction
W=Path(__file__).parent
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def verify(w=W):
 r=json.loads((w/'boost-helper14.json').read_bytes());o=json.loads(gzip.decompress((w/'boost-helper14-transactions.json.gz').read_bytes()));c=H(w/'build/artifacts/pump_amm_recovered.so');assert r['candidate_sha256']==c and r['original_sha256']==H(w/'runtime-inputs/evidence/original/pump_amm/deployed.so');assert r['producer_sha256']==o['script_sha256']==H(w/'probe_boost_controls.py');assert r['case_count']==len(r['cases'])==14 and not r['mismatches'];assert o['transaction_count']==len(o['transactions'])==28
 clean=lambda x:dict(x,logs=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',s)for s in x['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',s)])
 signatures=0
 for i,row in enumerate(r['cases']):
  assert clean(row['original'])==clean(row['candidate'])and not row['different_fields'];pair=o['transactions'][2*i:2*i+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']==row['original']['transaction_base64']==row['candidate']['transaction_base64']
  for side,t in zip(['original','candidate'],pair):
   raw=base64.b64decode(t['transaction_base64']);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified']and len(checks)==t['signature_count'];signatures+=len(checks);assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and t['amm_program_sha256']==r[side+'_sha256']and t['error']==row[side]['error'];assert t['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
 assert signatures==28
 return {'passed':True,'candidate_sha256':c,'cases':14,'signed_transactions':28,'signature_fields':signatures,'mismatches':0,'scope':'Eight synthetic Token2022 hook-metadata cases, three self-transfer cases and three wrong-source-owner cases; all other output/state/log fields equal after the declared compute/Source log normalization.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
