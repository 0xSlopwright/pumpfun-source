#!/usr/bin/env python3
"""Recheck all signed helper-order and payout observations without rerunning them."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction
ROOT=Path(__file__).resolve().parents[3]
def load(p):
 p=Path(p);b=p.read_bytes();return json.loads(gzip.decompress(b)if p.suffix=='.gz'else b)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(report,sidecar,candidate,producer,count,expected_bad=0):
 s=importlib.util.spec_from_file_location('helper_direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(s);s.loader.exec_module(direct)
 r=load(report);side=load(sidecar);original=sha(ROOT/'evidence/original/pump_amm/deployed.so');digest=sha(candidate)
 assert r['candidate_sha256']==digest and r['original_sha256']==original
 assert r.get('script_sha256',r.get('probe_sha256'))==sha(producer)
 assert r['case_count']==len(r['cases'])==count and len(side['transactions'])==count*2
 bad=0
 for i,c in enumerate(r['cases']):
  equal=direct.clean(c['original'])==direct.clean(c['candidate']);assert bool(c['mismatched_fields'])==(not equal);bad+=int(not equal);messages=[]
  for label,t,pid in zip(['original','candidate'],side['transactions'][2*i:2*i+2],[original,digest]):
   raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results()) and t['all_signatures_verified'];assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256'];assert t['amm_program_sha256']==pid
   assert t['logs_sha256']==hashlib.sha256(json.dumps(c[label]['logs'],separators=(',',':')).encode()).hexdigest();messages.append(bytes(tx.message))
  assert messages[0]==messages[1]
 assert bad==r['mismatch_count']==expected_bad
 return {'cases':count,'mismatches':bad}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--report',type=Path,required=True);p.add_argument('--sidecar',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--producer',type=Path,required=True);p.add_argument('--count',type=int,required=True);p.add_argument('--expected-bad',type=int,default=0);a=p.parse_args();print(json.dumps(verify(a.report,a.sidecar,a.candidate,a.producer,a.count,a.expected_bad)))
