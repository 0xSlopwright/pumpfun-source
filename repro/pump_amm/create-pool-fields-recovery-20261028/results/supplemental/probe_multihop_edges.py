#!/usr/bin/env python3
"""Bounded signed synthetic MultiHop arithmetic/fee cross-edges, not live state."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_multi_hop_differential as h
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
U64=(1<<64)-1
PROFILES={'zero':(0,0,0),'ordinary':(10,20,30),'max-protocol':(0,U64,0),'max-creator':(0,0,U64),'max-all':(U64,U64,U64)}

def setup(effective_quote,fee_profile,buyback_bps,whitelist=False,raw_quote=10**9,base_reserve=10**9,route=None,which_leg=0,override_creator=None):
 def apply(vm,metas):
  if route=='two-amm':h.route2(False)(vm,metas)
  key=metas[18+which_leg*5].pubkey
  a=vm.vm.get_account(key);data=bytearray(a.data)
  data[245:261]=(effective_quote-raw_quote).to_bytes(16,'little',signed=True)
  data[261:269]=bytes(8);data[271:279]=bytes(8)
  data[211:243]=bytes(h.OUTSIDER.pubkey())
  vm.vm.set_account(key,h.Account(a.lamports,bytes(data),a.owner))
  for index,amount,native in [(19+which_leg*5,base_reserve,False),(20+which_leg*5,raw_quote,which_leg==0)]:
   key=metas[index].pubkey;a=vm.vm.get_account(key);data=bytearray(a.data);data[64:72]=struct.pack('<Q',amount)
   vm.vm.set_account(key,h.Account(max(a.lamports,amount+2039280)if native else a.lamports,bytes(data),a.owner))
  h.custom_fee_table([(0,PROFILES[fee_profile])])(vm,metas)
  a=vm.vm.get_account(h.CONFIG_KEY);data=bytearray(a.data);data[899:907]=struct.pack('<Q',buyback_bps);data[940]=0
  if whitelist:data[353:385]=bytes(h.PAYER.pubkey())
  if override_creator is not None:
   data[940]=1;key=metas[18+which_leg*5].pubkey;a2=vm.vm.get_account(key);d2=bytearray(a2.data);d2[279:287]=struct.pack('<Q',override_creator);vm.vm.set_account(key,h.Account(a2.lamports,bytes(d2),a2.owner))
  vm.vm.set_account(h.CONFIG_KEY,h.Account(a.lamports,bytes(data),a.owner))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',required=True,type=Path);p.add_argument('--output',required=True,type=Path);args=p.parse_args();assert not args.output.exists();rows=[]
 def run(case,params):
  original=h.run(**params);candidate=h.run(candidate=args.candidate,**params)
  assert original['transaction_base64']==candidate['transaction_base64'];assert original['before']==candidate['before']
  a,b=map(direct.clean,[original,candidate]);diff=[k for k in a if a[k]!=b.get(k)]
  rows.append({'case':case,'original':original,'candidate':candidate,'mismatched_fields':diff})
 for sell in [False,True]:
  for q in [0,1,2,10,10**9]:
   for amount in [1,2,1000]:
    for profile in PROFILES:
     for bps in [0,10000]:
      case={'kind':'single-hop-cross-edge','sell':sell,'effective_quote':q,'raw_quote':10**9,'amount':amount,'fees':profile,'buyback_bps':bps,'synthetic':True}
      run(case,{'sell':sell,'amount':amount,'overrides':setup(q,profile,bps)})
 # Whitelist and configurable creator policy collisions use normal reserves.
 for sell in [False,True]:
  for whitelist in [False,True]:
   for profile in ['ordinary','max-protocol','max-all']:
    for bps in [0,10000]:
     case={'kind':'whitelist-fee-edge','sell':sell,'fees':profile,'buyback_bps':bps,'whitelist_user':whitelist,'synthetic':True}
     run(case,{'sell':sell,'amount':1000,'overrides':setup(10**9,profile,bps,whitelist=whitelist)})
  for creator in [0,1,10000,10001,U64]:
   case={'kind':'creator-override-edge','sell':sell,'override_creator_bps':creator,'synthetic':True}
   run(case,{'sell':sell,'amount':1000,'overrides':setup(10**9,'zero',0,override_creator=creator)})
 # Multi-hop endpoint masking with a collapsed first/second AMM leg.
 for leg in [0,1]:
  for q in [0,1]:
   for profile in ['zero','ordinary','max-protocol','max-creator']:
    case={'kind':'two-hop-buy-edge','leg':leg,'effective_quote':q,'fees':profile,'synthetic':True}
    run(case,{'amount':1000,'overrides':setup(q,profile,10000,route='two-amm',which_leg=leg)})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(args.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with gzip.GzipFile(filename='',mode='wb',fileobj=args.output.open('wb'),mtime=0)as f:f.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':x['case'],'fields':x['mismatched_fields'],'original_error':x['original']['error'],'candidate_error':x['candidate']['error']}for x in rows if x['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
