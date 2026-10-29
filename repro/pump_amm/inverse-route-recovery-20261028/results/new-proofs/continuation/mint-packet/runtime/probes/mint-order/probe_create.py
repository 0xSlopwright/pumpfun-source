#!/usr/bin/env python3
"""Signed create extension collisions with early argument and mode gates."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
s=importlib.util.spec_from_file_location('supported_setup',ROOT/'work/amm-supported-mint-worker-20261027/probe.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
h=p.h
def tlv(k,v):return struct.pack('<HH',k,len(v))+v
MODES=[('metadata',tlv(18,bytes(64))),('metadata-short',tlv(18,bytes(63))),('duplicate-metadata',tlv(18,bytes(64))*2),('unknown27',tlv(27,b'')),('unknown65535',tlv(65535,b'')),('large-unknown',tlv(65535,bytes(65535))),('terminator',tlv(18,bytes(64))+bytes(2)+tlv(27,b'')),('fee-long',tlv(1,bytes(109)))]
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--candidate',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args();a.candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();rows=[]
 for role in ['base','quote']:
  for mode,tail in MODES:
   for gate in ['normal','zero-base','zero-quote','disabled','mayhem']:
    def setup(vm,metas):
     p.mutate(role,(mode,tail,None,None))(vm,metas)
     if gate=='disabled':h.mutate(h.CONFIG_KEY,56,b'\1')(vm,metas)
     if gate=='mayhem':h.mutate(h.CONFIG_KEY,417,b'\1')(vm,metas)
    kw=dict(base_amount=0 if gate=='zero-base'else 10**9,quote_amount=0 if gate=='zero-quote'else 10**9,mayhem=gate=='mayhem',overrides=setup)
    x=h.create(**kw);y=h.create(candidate=a.candidate,**kw);cx,cy=p.normalizer.clean(x),p.normalizer.clean(y);rows.append({'role':role,'mode':mode,'gate':gate,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 r={'scope':__doc__,'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'shared_fixture_helper_sha256':hashlib.sha256((ROOT/'work/amm-supported-mint-worker-20261027/probe.py').read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'role':x['role'],'mode':x['mode'],'gate':x['gate'],'fields':x['mismatched_fields'],'original':x['original']['error'],'candidate':x['candidate']['error']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
