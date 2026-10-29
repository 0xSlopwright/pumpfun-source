#!/usr/bin/env python3
"""Signed well-formed Token-2022 legacy exact-quote rounding and gross-budget cases."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_legacy_buy_differential as h
s=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');d=importlib.util.module_from_spec(s);s.loader.exec_module(d)
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();rows=[]
 for fees in [(25,5,5),(1000,500,500)]:
  for bps,cap in [(0,0),(1,2**64-1),(100,2**64-1),(2500,2**64-1),(9999,2**64-1),(10000,2**64-1),(100,1),(2500,123)]:
   for amount in [3,4,5,101,1000,10001,10**7]:
    def override(vm,metas):
     h.adapt_sell_helper(h.legacy_transferfee(h.quote,bps,cap))(vm,metas)
     h.custom_fee_table([(0,fees)])(vm,metas)
     h.mutate(h.feeconfig,41,struct.pack('<QQQ',*fees))(vm,metas)
    kw=dict(name='buy_exact_quote_in',amount=amount,limit=1,overrides=override)
    x=h.legacy_buy(**kw);y=h.legacy_buy(candidate=candidate,**kw);cx,cy=d.clean(x),d.clean(y)
    rows.append({'amount':amount,'transfer_fee_bps':bps,'maximum_fee':cap,'amm_fee_bps':list(fees),'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'scope':__doc__,'producer_sha256':sha(Path(__file__)),'candidate_sha256':sha(candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'amount':x['amount'],'tf':[x['transfer_fee_bps'],x['maximum_fee']],'fees':x['amm_fee_bps'],'original':x['original']['error'],'candidate':x['candidate']['error'],'fields':x['mismatched_fields']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
