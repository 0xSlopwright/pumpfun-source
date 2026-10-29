#!/usr/bin/env python3
from pathlib import Path
import argparse,hashlib,json,sys
ROOT=next(p for p in Path(__file__).resolve().parents if(p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'));import pump_amm_multi_hop_differential as base

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();rows=[]
 for name,setup in [('curve',base.curve_route),('curve-amm',base.curve_then_amm),('amm-curve',base.amm_then_curve),('two-curves',base.two_curves)]:
  for sell in [False,True]:
   for amount in [1,10**6,10**9,10**12]:
    for limit in [1,2**64-1]:
     x=base.run(amount=amount,limit=limit,sell=sell,overrides=setup(sell));y=base.run(amount=amount,limit=limit,sell=sell,overrides=setup(sell),candidate=a.candidate);diff=[k for k in x if k!='logs'and x[k]!=y[k]];rows.append({'input':{'route':name,'sell':sell,'amount':amount,'limit':limit},'original':x,'candidate':y,'diff':diff})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'candidate_sha256':sha(a.candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'producer_sha256':sha(Path(__file__)),'cases':rows,'mismatches':[i for i,r in enumerate(rows)if r['diff']]};a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print('cases',len(rows),'mismatches',r['mismatches']);assert not r['mismatches']
if __name__=='__main__':main()
