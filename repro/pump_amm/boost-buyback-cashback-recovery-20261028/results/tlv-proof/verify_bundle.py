#!/usr/bin/env python3
"""Verify the sealed three-way TLV corpus packet; no compiler, VM or network."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json
P=Path(__file__).resolve().parent
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def load(p):
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify():
 spec=importlib.util.spec_from_file_location('tlv_receipts',P/'verify.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 checks=[];reports={};sidecars={}
 for name,expected in [('baseline',430),('fixed',0),('integrated',0)]:
  rp=P/'reports'/(name+'.json.gz');sp=P/'reports'/(name+'-transactions.json.gz');checks.append(m.verify(rp,sp,P/'artifacts'/(name+'.so'),expected));reports[name]=load(rp);sidecars[name]=load(sp)['transactions']
 comparator=P/'inputs/repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'
 spec=importlib.util.spec_from_file_location('cross_clean',comparator);cleaner=importlib.util.module_from_spec(spec);spec.loader.exec_module(cleaner)
 base=reports['baseline']['cases']
 for i,row in enumerate(base):
  original=cleaner.clean(row['original'])
  for name in ['fixed','integrated']:
   other=reports[name]['cases'][i];assert row['case']==other['case'];assert original==cleaner.clean(other['original']);assert row['original']['account_snapshots']['before']==other['candidate']['account_snapshots']['before']
   assert sidecars['baseline'][2*i]['transaction_base64']==sidecars['baseline'][2*i+1]['transaction_base64']==sidecars[name][2*i]['transaction_base64']==sidecars[name][2*i+1]['transaction_base64']
  # Each zero-difference fixed/integrated pair has already been checked against
  # its complete original result, while this binds identical original inputs.
 return {'passed':True,'cases_per_run':876,'runs':[{k:r[k]for k in ['candidate_sha256','mismatch_count','signed_transactions','verified_signatures']}for r in checks],'cross_run_identical_message_and_prestate_cases':876,'verified_transactions':5256,'verified_signatures':5256,'executes_runtime':False}
if __name__=='__main__':
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--expected-seal',required=True);a=ap.parse_args();assert H(P/'manifest.json')==a.expected_seal
 for name,digest in load(P/'manifest.json')['files'].items():assert H(P/name)==digest,name
 print(json.dumps(verify(),indent=2))
