#!/usr/bin/env python3
"""Authenticate every context-constraint case, signed message and state snapshot."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction
ROOT=Path(__file__).resolve().parents[3]
def load(p):
 p=Path(p);b=p.read_bytes();return json.loads(gzip.decompress(b)if p.suffix=='.gz'else b)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(report,sidecar,candidate,expected_bad=0,count=21,producer=None):
 r=load(report);observed=load(sidecar);assert r['candidate_sha256']==sha(candidate);original=sha(ROOT/'evidence/original/pump_amm/deployed.so');assert r['original_sha256']==original
 assert r['producer_sha256']==sha(producer or Path(__file__).with_name('probe_contexts.py'))
 assert r['case_count']==len(r['cases'])==count and len(observed['transactions'])==count*2
 s=importlib.util.spec_from_file_location('direct_context',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);bad=0
 for i,c in enumerate(r['cases']):
  x,y=m.clean(c['original']),m.clean(c['candidate']);different=x!=y
  a,b=c['original_state_receipt'],c['candidate_state_receipt'];assert a['before']==b['before'];different|=a['after']!=b['after'];assert different==bool(c['mismatched_fields']);bad+=different;messages=[]
  for label,t,digest,record in zip(['original','candidate'],observed['transactions'][i*2:i*2+2],[original,r['candidate_sha256']],[a,b]):
   raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results()) and t['all_signatures_verified'];assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']==record['transaction_sha256'];assert t['amm_program_sha256']==digest
   assert t['logs_sha256']==hashlib.sha256(json.dumps(c[label]['logs'],separators=(',',':')).encode()).hexdigest();messages.append(bytes(tx.message))
  assert messages[0]==messages[1]
 assert bad==r['mismatch_count']==expected_bad
 return {'cases':count,'signed_transactions':count*2,'mismatches':bad}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--report',type=Path,required=True);p.add_argument('--sidecar',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--expected-bad',type=int,default=0);a=p.parse_args();print(json.dumps(verify(a.report,a.sidecar,a.candidate,a.expected_bad)))
