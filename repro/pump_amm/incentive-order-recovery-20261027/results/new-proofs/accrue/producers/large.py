#!/usr/bin/env python3
"""Large-received synthetic MultiHop buys distinguish saturating versus wide fee sums."""
from pathlib import Path
import argparse,gzip,hashlib,json,struct
import probe_multihop_edges as core
h=core.h;U64=core.U64
core.PROFILES['double-max']=(0,U64,U64)

def setup(q,profile,bps,amount):
 def apply(vm,metas):
  core.setup(q,profile,bps)(vm,metas)
  key=h.userquote;a=vm.vm.get_account(key);data=bytearray(a.data);data[64:72]=struct.pack('<Q',amount)
  vm.vm.set_account(key,h.Account(amount+2039280,bytes(data),a.owner))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',required=True,type=Path);p.add_argument('--output',required=True,type=Path);args=p.parse_args();assert not args.output.exists();rows=[]
 for q in [1,10**9,U64//2]:
  for amount in [U64//4,U64//2,U64-2*10**9]:
   for profile in ['zero','ordinary','double-max','max-all']:
    for bps in [0,10000]:
     params={'amount':amount,'overrides':setup(q,profile,bps,amount)}
     a=h.run(**params);b=h.run(candidate=args.candidate,**params);assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];aa,bb=map(core.direct.clean,[a,b]);diff=[k for k in aa if aa[k]!=bb.get(k)]
     rows.append({'case':{'kind':'large-received-saturation','effective_quote':q,'amount':amount,'fees':profile,'buyback_bps':bps,'synthetic':True},'original':a,'candidate':b,'mismatched_fields':diff})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'imported_core_sha256':hashlib.sha256(Path(core.__file__).read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(args.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((core.ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with gzip.GzipFile(filename='',mode='wb',fileobj=args.output.open('wb'),mtime=0)as f:f.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
