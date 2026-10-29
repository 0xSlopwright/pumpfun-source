"""Verify the saved captured-Pump boundary and synthetic downstream CTO counterexamples."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify(directory=None,expected_bad=2):
 P=Path(directory)if directory is not None else Path(__file__).resolve().parent;m=read(P/'manifest.json');assert m['files']=={str(p.relative_to(P)):sha(p)for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
 spec=importlib.util.spec_from_file_location('cto_cleaner',P/'cleaner.py');c=importlib.util.module_from_spec(spec);spec.loader.exec_module(c)
 index=read(P/'program-index.json');assert all(sha(P/'programs'/f'{h}.so')==h for h in index)
 bad=[];sig=txcount=success=0
 for label,count in [('captured',12),('synthetic',10)]:
  r=read(P/(label+'.json.gz'));o=read(P/(label+'-transactions.json.gz'));assert r['case_count']==len(r['cases'])==count and o['transaction_count']==len(o['transactions'])==count*2
  assert r['producer_sha256']==o['script_sha256']==sha(P/(label+'-producer.py'))
  assert o['observer_sha256']==sha(P/'observer.py');assert r['candidate_sha256']==sha(P/'candidate.so')
  for i,row in enumerate(r['cases']):
   a,b=row['original'],row['candidate'];aa,bb=c.clean(a),c.clean(b);diff=sorted(k for k in aa if aa[k]!=bb.get(k));assert diff==row['different_fields'];assert a['before']==b['before']and a['transaction_base64']==b['transaction_base64'];success+=a['error']is None
   if diff:
    assert label=='synthetic'and row['input']['name']in ['existing-holder-wrong-creator','existing-holder-zero-creator'];assert a['error']=='TransactionErrorInstructionError((1, Tagged(InstructionErrorCustom(6074))))'and b['error']=='TransactionErrorInstructionError((1, Tagged(InstructionErrorCustom(6076))))';assert a['after']==b['after'];bad.append(row['input']['name'])
   for j,side in enumerate(['original','candidate']):
    v=row[side];t=o['transactions'][i*2+j];raw=base64.b64decode(v['transaction_base64']);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified'];sig+=len(checks);txcount+=1
    assert t['transaction_base64']==v['transaction_base64']and t['transaction_sha256']==hashlib.sha256(raw).hexdigest()and t['signature_count']==len(checks)
    assert t['error']==v['error']and t['logs_sha256']==hashlib.sha256(json.dumps(v['logs'],separators=(',',':')).encode()).hexdigest()
    for pid,record in t['loaded_programs'].items():assert record['sha256']in index
    assert t['amm_program_sha256']==(r['original_sha256']if j==0 else r['candidate_sha256'])
  if label=='captured':assert r['mismatch_count']==0
 assert len(bad)==expected_bad and txcount==44 and sig==68
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'captured_cases':12,'synthetic_cases':10,'transactions':txcount,'signature_fields':sig,'synthetic_mismatches':len(bad),'mismatch_names':bad,'original_successes':success,'scope':'Normal signatures throughout; synthetic tests substitute a retained local Pump CPI caller and do not establish network reachability. Captured Pump blocks the wrong-creator requests upstream.','executes_vm':False}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
