#!/usr/bin/env python3
"""Signed TLV errors paired with zero-input and slippage failures across legacy and MultiHop routes."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_legacy_buy_differential as h
import pump_amm_multi_hop_differential as mh
from probe_legacy_tlv_authorized import alter
s=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');d=importlib.util.module_from_spec(s);s.loader.exec_module(d)
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();rows=[]
 for route in ['buy','buy_exact_quote_in','sell','multi-buy','multi-sell']:
  for case in ['valid','duplicate','short']:
   for amount in [0,10**7]:
    for limit in [0,1,2**64-1]:
     def override(vm,metas):
      if route.startswith('multi-'):
       mh.transferfee(mh.quote,100,123)(vm,metas);old=vm.vm.get_account(mh.buyback);owner=mh.Pubkey.from_bytes(old.data[32:64]);key=mh.Pubkey.find_program_address([bytes(owner),bytes(mh.TOKEN22),bytes(mh.quote)],mh.ATA)[0];vm.vm.set_account(key,mh.Account(old.lamports,old.data[:165]+bytes([2])+struct.pack('<HHQ',2,8,0),mh.TOKEN22));metas[6]=mh.AccountMeta(key,False,True)
      else:
       setup=h.legacy_transferfee(h.quote,100,123)
       if route!='sell':setup=h.adapt_sell_helper(setup)
       setup(vm,metas)
      acc=vm.vm.get_account(h.quote);vm.vm.set_account(h.quote,h.Account(acc.lamports,alter(bytes(acc.data),case),acc.owner))
     kw=dict(amount=amount,limit=limit,overrides=override)
     if route.startswith('multi-'):call=mh.run;kw['sell']=route=='multi-sell'
     elif route=='sell':call=h.legacy
     else:call=h.legacy_buy;kw['name']=route
     x=call(**kw);y=call(candidate=candidate,**kw);cx,cy=d.clean(x),d.clean(y);rows.append({'route':route,'case':case,'amount':amount,'limit':limit,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'scope':__doc__,'producer_sha256':sha(Path(__file__)),'candidate_sha256':sha(candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'route':x['route'],'case':x['case'],'amount':x['amount'],'limit':x['limit'],'original':x['original']['error'],'candidate':x['candidate']['error'],'fields':x['mismatched_fields']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
