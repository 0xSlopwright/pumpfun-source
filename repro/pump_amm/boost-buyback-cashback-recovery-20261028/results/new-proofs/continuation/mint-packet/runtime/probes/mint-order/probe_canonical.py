#!/usr/bin/env python3
"""Saved signed Pump migration into canonical AMM mode-gate collisions."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_migration_create_differential as h
s=importlib.util.spec_from_file_location('clean',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');d=importlib.util.module_from_spec(s);s.loader.exec_module(d)
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--candidate',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args();a.candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();rows=[]
 for mayhem in [False,True]:
  for cashback in [False,True]:
   for enabled in [False,True]:
    for disabled in [False,True]:
     def ov(vm,keys):
      for key,changes in [(keys['bonding_curve'],[(81,mayhem),(82,cashback)]),(keys['amm_global_config'],[(417,enabled),(642,enabled),(56,disabled)])]:
       acc=vm.get_account(key);data=bytearray(acc.data)
       for off,val in changes:data[off]=int(val)
       vm.set_account(key,h.Account(acc.lamports,bytes(data),acc.owner))
     x=h.run_migration(overrides=ov);y=h.run_migration(candidate=a.candidate,overrides=ov);cx,cy=d.clean(x),d.clean(y);rows.append({'mayhem':mayhem,'cashback':cashback,'enabled':enabled,'disabled':disabled,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 r={'scope':__doc__,'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'mayhem':x['mayhem'],'cashback':x['cashback'],'enabled':x['enabled'],'disabled':x['disabled'],'fields':x['mismatched_fields'],'original':x['original']['error'],'candidate':x['candidate']['error']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
