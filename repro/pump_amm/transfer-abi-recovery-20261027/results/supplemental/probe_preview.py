#!/usr/bin/env python3
"""Signed precedence checks for buyback preview failures versus limits and token failures."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_trade_v2_differential as h
sp=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(sp);sp.loader.exec_module(direct)
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for name in ['buy_v2','buy_exact_quote_in_v2']:
  for bps in [10000,10001,2**64-1]:
   for tight in [False,True]:
    for condition in ['normal','frozen-base','empty-quote']:
     def override(vm,metas):
      h.mutate(h.CONFIG_KEY,899,struct.pack('<Q',bps))(vm,metas)
      if condition=='frozen-base':h.mutate(h.vaultbase,108,b'\x02')(vm,metas)
      if condition=='empty-quote':h.mutate(h.userquote,64,bytes(8))(vm,metas)
     kw={'amount':10**10 if name=='buy_v2'else 10**7,'limit':(1 if tight else 10**12)if name=='buy_v2'else(2**64-1 if tight else 1),'overrides':override}
     x=h.trade(name,**kw);y=h.trade(name,candidate=a.candidate,**kw);cx,cy=direct.clean(x),direct.clean(y);diff=[k for k in cx if cx[k]!=cy[k]]
     rows.append({'instruction':name,'buyback_bps':bps,'tight_limit':tight,'condition':condition,'original':x,'candidate':y,'mismatched_fields':diff})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
 r={'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(a.candidate),'probe_sha256':sha(Path(__file__)),'case_count':len(rows),'mismatch_count':sum(bool(c['mismatched_fields'])for c in rows),'cases':rows}
 a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({'cases':len(rows),'mismatches':r['mismatch_count']}))
if __name__=='__main__':main()
