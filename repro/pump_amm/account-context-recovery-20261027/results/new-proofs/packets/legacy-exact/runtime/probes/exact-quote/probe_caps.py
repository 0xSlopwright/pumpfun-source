#!/usr/bin/env python3
"""Signed valid Token-2022 cap-transition and extreme AMM-rate exact-quote cases."""
from pathlib import Path
import argparse,hashlib,json,struct
import probe_rounding as p
h,d=p.h,p.d
ROOT=p.ROOT
U64=2**64-1
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--candidate',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args();candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();rows=[]
 for fees in [(25,5,5),(1000,500,500),(1,U64,1)]:
  for bps,cap in [(1,1),(1,123),(100,1),(100,123),(2500,1),(2500,123),(9999,1),(9999,123),(10000,1),(10000,123),(9999,U64)]:
   pivot=min(cap*10000//bps,U64)
   amounts=sorted(set(max(1,min(U64,n))for n in [pivot-2,pivot-1,pivot,pivot+1,pivot+2,U64-1,U64]))
   for amount in amounts:
    def override(vm,metas):
     h.adapt_sell_helper(h.legacy_transferfee(h.quote,bps,cap))(vm,metas)
     h.custom_fee_table([(0,fees)])(vm,metas)
     h.mutate(h.feeconfig,41,struct.pack('<QQQ',*fees))(vm,metas)
    kw=dict(name='buy_exact_quote_in',amount=amount,limit=1,overrides=override)
    x=h.legacy_buy(**kw);y=h.legacy_buy(candidate=candidate,**kw);cx,cy=d.clean(x),d.clean(y)
    rows.append({'amount':amount,'transfer_fee_bps':bps,'maximum_fee':cap,'amm_fee_bps':list(fees),'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'scope':__doc__,'producer_sha256':sha(Path(__file__)),'candidate_sha256':sha(candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'amount':x['amount'],'tf':[x['transfer_fee_bps'],x['maximum_fee']],'fees':x['amm_fee_bps'],'original':x['original']['error'],'candidate':x['candidate']['error'],'fields':x['mismatched_fields']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
