#!/usr/bin/env python3
"""Signed payout TLV edge collisions beyond the existing payout corpus."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
s=importlib.util.spec_from_file_location('prior_payout',ROOT/'work/amm-fee-payout-edge-audit-20261027/probe.py');p=importlib.util.module_from_spec(s);s.loader.exec_module(p)
s=importlib.util.spec_from_file_location('clean',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');d=importlib.util.module_from_spec(s);s.loader.exec_module(d)
U64=2**64-1
MODES=['long109','long120','unknown-first','large-unknown-first','terminator-first','one-tail-byte','duplicate-unknown','new-epoch']
def tlv(k,v):return struct.pack('<HH',k,len(v))+v
def mint_data(raw,mode):
 f=bytes(72)+struct.pack('<QQH',0,123,100)*2;tail=tlv(1,f)
 if mode=='long109':tail=tlv(1,f+b'\0')
 elif mode=='long120':tail=tlv(1,f+bytes(12))
 elif mode=='unknown-first':tail=tlv(65535,b'')+tail
 elif mode=='large-unknown-first':tail=tlv(65535,bytes(65535))+tail
 elif mode=='terminator-first':tail=bytes(2)+tail+tail
 elif mode=='one-tail-byte':tail+=b'\xff'
 elif mode=='duplicate-unknown':tail=tlv(65535,b'')+tail+tlv(65535,b'')
 elif mode=='new-epoch':tail=tlv(1,bytes(72)+struct.pack('<QQH',0,0,65535)+struct.pack('<QQH',0,123,100))
 else:raise AssertionError(mode)
 return raw[:82]+bytes(83)+b'\1'+tail
p.mint_data=mint_data
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--candidate',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args();a.candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();rows=[]
 def run(label,call,kw):
  x=call(**kw);y=call(candidate=a.candidate,**kw);cx,cy=d.clean(x),d.clean(y);rows.append({'case':label,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 for mode in MODES:
  for amount in [0,1,1000]:
   for migrated in [False,True]:run({'route':'collect','mode':mode,'amount':amount,'migrated':migrated},p.collect.collect,dict(amount=amount,overrides=p.collect_tf(mode,migrated,False)))
   for route in ['sweep_protocol_fee','sweep_creator_fee']:
    for dest in ['missing','valid']:run({'route':route,'mode':mode,'amount':amount,'destination':dest},p.sweep.sweep,dict(name=route,amount=amount,overrides=p.sweep_tf(mode,dest)))
  for amount in [0,1000]:
   for dest in ['missing','frozen']:run({'route':'transfer_creator_fees_to_pump_v2','mode':mode,'amount':amount,'destination':dest},p.transfer.transfer,dict(name='transfer_creator_fees_to_pump_v2',amount=amount,overrides=p.transfer_tf(mode,dest,False)))
 r={'scope':__doc__,'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'shared_fixture_helper_sha256':hashlib.sha256((ROOT/'work/amm-fee-payout-edge-audit-20261027/probe.py').read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'case':x['case'],'fields':x['mismatched_fields'],'original':x['original']['error'],'candidate':x['candidate']['error']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
