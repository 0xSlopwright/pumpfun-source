#!/usr/bin/env python3
"""Independently verify raw-destination payout signatures, snapshots and all logs."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction
ROOT=Path(__file__).resolve().parents[3]
def load(p):
 p=Path(p);b=p.read_bytes();return json.loads(gzip.decompress(b)if p.suffix=='.gz'else b)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(report,candidate,record,expected_bad=0):
 r=load(report);assert r['candidate_sha256']==sha(candidate) and r['original_sha256']==sha(ROOT/'evidence/original/pump_amm/deployed.so')
 assert r['build_record_sha256']==sha(record) and load(record)['comparison']['candidate_sha256']==sha(candidate)
 assert r['producer_sha256']==sha(Path(__file__).with_name('probe_mint_policy.py'))
 for p,h in r['harness_sha256'].items():assert sha(ROOT/p)==h
 s=importlib.util.spec_from_file_location('raw_direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(s);s.loader.exec_module(direct)
 assert r['case_count']==len(r['cases'])==46 and r['transaction_count']==r['signature_count']==92;bad=[]
 for i,c in enumerate(r['cases']):
  x,y=direct.clean(c['original']),direct.clean(c['candidate']);different=x!=y
  for name in ['original_signed','candidate_signed']:
   t=c[name];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results())and all(t['signature_verification']);assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']
  a,b=c['original_signed'],c['candidate_signed'];assert a['transaction_base64']==b['transaction_base64'] and a['before']==b['before'];different|=a['after']!=b['after']
  assert different==bool(c['mismatched_fields'])
  if different:bad.append(i)
 assert bad==r['mismatches'] and len(bad)==expected_bad
 return {'cases':46,'signed_transactions':92,'mismatches':len(bad)}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--report',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--record',type=Path,required=True);p.add_argument('--expected-bad',type=int,default=0);a=p.parse_args();print(json.dumps(verify(a.report,a.candidate,a.record,a.expected_bad)))
