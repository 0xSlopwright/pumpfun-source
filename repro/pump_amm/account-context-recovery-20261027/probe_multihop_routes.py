#!/usr/bin/env python3
"""Signed two-AMM routes test preliminary fees before inactive endpoint masking."""
from pathlib import Path
import argparse,gzip,hashlib,json,struct
import probe_multihop_edges as core
h=core.h;U64=core.U64
PROFILES={'zero':((0,0,0),(0,0,0)),'inactive-exotic-protocol':((0,0,0),(0,U64,0)),'inactive-normal-creator':((0,0,U64),(0,0,0)),'inactive-normal-lp':((U64,0,0),(0,0,0))}

def setup(sell,profile,bps):
 def apply(vm,metas):
  h.route2(sell)(vm,metas)
  for start in [16,21]:
   key=metas[start+2].pubkey;a=vm.vm.get_account(key);data=bytearray(a.data);data[245:269]=bytes(24);data[271:287]=bytes(16);data[211:243]=bytes(h.OUTSIDER.pubkey());vm.vm.set_account(key,h.Account(a.lamports,bytes(data),a.owner))
   for offset in [3,4]:
    key=metas[start+offset].pubkey;a=vm.vm.get_account(key);data=bytearray(a.data);data[64:72]=struct.pack('<Q',10**9);vm.vm.set_account(key,h.Account(max(a.lamports,10**9+2039280),bytes(data),a.owner))
  normal,exotic=PROFILES[profile];h.custom_fee_table([(0,normal)])(vm,metas)
  a=vm.vm.get_account(h.feeconfig);data=bytearray(a.data);data[113:137]=struct.pack('<QQQ',*exotic);vm.vm.set_account(h.feeconfig,h.Account(a.lamports,bytes(data),a.owner))
  a=vm.vm.get_account(h.CONFIG_KEY);data=bytearray(a.data);data[899:907]=struct.pack('<Q',bps);data[940]=0;vm.vm.set_account(h.CONFIG_KEY,h.Account(a.lamports,bytes(data),a.owner))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',required=True,type=Path);p.add_argument('--output',required=True,type=Path);args=p.parse_args();assert not args.output.exists();rows=[]
 for sell in [False,True]:
  for amount in [1000,10**6]:
   for profile in PROFILES:
    for bps in [0,10000]:
     params={'sell':sell,'amount':amount,'overrides':setup(sell,profile,bps)};a=h.run(**params);b=h.run(candidate=args.candidate,**params);assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];aa,bb=map(core.direct.clean,[a,b]);diff=[k for k in aa if aa[k]!=bb.get(k)]
     rows.append({'case':{'kind':'inactive-endpoint-fee','sell':sell,'amount':amount,'profile':profile,'buyback_bps':bps,'synthetic':True},'original':a,'candidate':b,'mismatched_fields':diff})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'imported_core_sha256':hashlib.sha256(Path(core.__file__).read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(args.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((core.ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with gzip.GzipFile(filename='',mode='wb',fileobj=args.output.open('wb'),mtime=0)as f:f.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
