#!/usr/bin/env python3
"""Signed create_pool mode-gate precedence across malformed mint and argument collisions."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
s=importlib.util.spec_from_file_location('supported_setup',ROOT/'work/amm-supported-mint-worker-20261027/probe.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p);h=p.h
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--candidate',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args();a.candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();rows=[]
 for mayhem,cashback in [(False,False),(True,False),(False,True),(True,True)]:
  for mayhem_enabled,cashback_enabled in [(False,False),(False,True),(True,False),(True,True)]:
   for mint in ['normal','unsupported-base','unsupported-quote']:
    for gate in ['normal','disabled','zero-base','zero-quote']:
     def setup(vm,m):
      if mint!='normal':p.mutate('base'if mint.endswith('base')else'quote',(mint,struct.pack('<HH',27,0),None,None))(vm,m)
      h.mutate(h.CONFIG_KEY,417,bytes([mayhem_enabled]))(vm,m);h.mutate(h.CONFIG_KEY,642,bytes([cashback_enabled]))(vm,m)
      if gate=='disabled':h.mutate(h.CONFIG_KEY,56,b'\1')(vm,m)
     kw=dict(mayhem=mayhem,optional=bytes([cashback]),base_amount=0 if gate=='zero-base'else 10**9,quote_amount=0 if gate=='zero-quote'else 10**9,overrides=setup)
     x=h.create(**kw);y=h.create(candidate=a.candidate,**kw);cx,cy=p.normalizer.clean(x),p.normalizer.clean(y);rows.append({'mayhem':mayhem,'cashback':cashback,'mayhem_enabled':mayhem_enabled,'cashback_enabled':cashback_enabled,'mint':mint,'gate':gate,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 r={'scope':__doc__,'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'mayhem':x['mayhem'],'cashback':x['cashback'],'enabled':[x['mayhem_enabled'],x['cashback_enabled']],'mint':x['mint'],'gate':x['gate'],'fields':x['mismatched_fields'],'original':x['original']['error'],'candidate':x['candidate']['error']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
