from pathlib import Path
import hashlib,base64,gzip,json,re
from solders.transaction import Transaction
W=Path(__file__).parent
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def verify(w=W):
 r=json.loads((w/'order60.json').read_text());obs=json.loads(gzip.decompress((w/'order60-transactions.json.gz').read_bytes()));assert r['candidate_sha256']==H(w/'build/artifacts/pump_amm_recovered.so')and r['producer_sha256']==obs['script_sha256']==H(w/'probe_order.py')and r['case_count']==60 and not r['mismatches'];signatures=0;prefunded=[];rejected=[]
 for i,row in enumerate(r['cases']):
  a,b=row['original'],row['candidate'];assert all(a[k]==b[k]for k in a if k!='logs')
  clean=lambda logs:[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',x)for x in logs if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',x)]
  assert clean(a['logs'])==clean(b['logs']);pair=obs['transactions'][i*2:i*2+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']
  for side,t in zip(['original','candidate'],pair):
   raw=base64.b64decode(t['transaction_base64']);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified']and len(checks)==t['signature_count'];signatures+=len(checks);assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and t['amm_program_sha256']==r[side+'_sha256']and t['error']==row[side]['error']
   assert t['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
  if row['case'].startswith('existing-pool:'):(prefunded if a['error']is None else rejected).append(row['case'])
 assert len(prefunded)==2 and all(':11111111111111111111111111111111:0:'in name for name in prefunded)and len(rejected)==10 and signatures==120
 return {'passed':True,'candidate_sha256':r['candidate_sha256'],'cases':60,'signature_fields':120,'prefunded_system_zero_length_accepted':2,'initialized_nonzero_or_wrong_owner_rejected':10,'mismatches':0,'scope':'Comment in producer saying pre-existing pool rejects is imprecise; actual accepted System zero-length cases allocate fresh zero data. All observed cases and signatures above are preserved.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
