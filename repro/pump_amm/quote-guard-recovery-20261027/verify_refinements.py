from pathlib import Path
import base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def load(p):
 b=p.read_bytes();return json.loads(gzip.decompress(b)if p.suffix=='.gz'else b)
def verify(d,candidate,clean):
 base=d/'refinements';count=sigs=0
 for name,want in [('virtual',60),('predicate',16)]:
  p=base/(name+('.json.gz'if name=='virtual'else'.json'));r=load(p);o=load(base/(name+'-transactions.json.gz'));rows=o['transactions']
  assert r['candidate_sha256']==H(candidate)and r['original_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
  assert r['case_count']==len(r['cases'])==want and len(rows)==2*want
  assert o['script_sha256']==H(base/(name+'.py'))==r['producer_sha256'if name=='virtual'else'probe_sha256']
  for i,case in enumerate(r['cases']):
   assert clean(case['original'])==clean(case['candidate'])
   if name=='virtual':assert case['original_receipt']['before']==case['candidate_receipt']['before']and case['original_receipt']['after']==case['candidate_receipt']['after']
   messages=[]
   for j,side in enumerate(['original','candidate']):
    row=rows[i*2+j];raw=base64.b64decode(row['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results())and row['all_signatures_verified'];sigs+=len(tx.signatures);messages.append(bytes(tx.message))
    assert row['amm_program_sha256']==r[side+'_sha256']and row['transaction_sha256']==hashlib.sha256(raw).hexdigest()
    assert row['logs_sha256']==hashlib.sha256(json.dumps(case[side]['logs'],separators=(',',':')).encode()).hexdigest()
   assert messages[0]==messages[1];count+=1
 assert count==76 and sigs==152
 return {'cases':count,'signatures':sigs,'mismatches':0}
