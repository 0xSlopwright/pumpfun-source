#!/usr/bin/env python3
"""Signed malformed/extended quote-TLV cases on all three legacy AMM trade routes."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_legacy_buy_differential as h
s=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');d=importlib.util.module_from_spec(s);s.loader.exec_module(d)
def alter(raw,case):
 fee=raw[166:]
 if case=='valid':return raw
 if case=='long':return raw[:168]+struct.pack('<H',109)+raw[170:]+b'\0'
 if case=='unknown-before':return raw[:166]+struct.pack('<HH',65535,0)+fee
 if case=='duplicate':return raw+fee
 if case=='bad-tail':return raw+b'\x19\0\xff'
 if case=='short':return raw[:-1]
 if case=='none':return raw[:166]+struct.pack('<HH',65535,0)
 raise AssertionError(case)
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();rows=[]
 for route in ['buy','buy_exact_quote_in','sell']:
  for case in ['valid','long','unknown-before','duplicate','bad-tail','short','none']:
   def override(vm,metas):
    setup=h.legacy_transferfee(h.quote,100,123)
    if route!='sell':setup=h.adapt_sell_helper(setup)
    setup(vm,metas);acc=vm.vm.get_account(h.quote);vm.vm.set_account(h.quote,h.Account(acc.lamports,alter(bytes(acc.data),case),acc.owner));h.mutate(h.CONFIG_KEY,353,bytes(h.PAYER.pubkey()))(vm,metas)
   call=h.legacy if route=='sell'else h.legacy_buy
   kw=dict(amount=10**7 if route=='buy_exact_quote_in'else 10**9,limit=2**64-1 if route=='buy'else(1 if route=='buy_exact_quote_in'else 0),overrides=override)
   if route!='sell':kw['name']=route
   x=call(**kw);y=call(candidate=candidate,**kw);cx,cy=d.clean(x),d.clean(y);rows.append({'route':route,'case':case,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'scope':__doc__,'producer_sha256':sha(Path(__file__)),'candidate_sha256':sha(candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'route':x['route'],'case':x['case'],'original':x['original']['error'],'candidate':x['candidate']['error'],'fields':x['mismatched_fields']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
