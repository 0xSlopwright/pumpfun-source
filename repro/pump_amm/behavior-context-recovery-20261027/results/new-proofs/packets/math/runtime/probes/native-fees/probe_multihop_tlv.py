#!/usr/bin/env python3
"""Signed single-pool MultiHop quote-TLV decoder and fee-path boundaries."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_multi_hop_differential as h
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
 for sell in [False,True]:
  for case in ['valid','long','unknown-before','duplicate','bad-tail','short','none']:
   for amount in [10**7,10**9]:
    def override(vm,metas):
     h.transferfee(h.quote,100,123)(vm,metas);acc=vm.vm.get_account(h.quote);vm.vm.set_account(h.quote,h.Account(acc.lamports,alter(bytes(acc.data),case),acc.owner))
     old=vm.vm.get_account(h.buyback);owner=h.Pubkey.from_bytes(old.data[32:64]);key=h.Pubkey.find_program_address([bytes(owner),bytes(h.TOKEN22),bytes(h.quote)],h.ATA)[0];data=old.data[:165]+bytes([2])+struct.pack('<HHQ',2,8,0);vm.vm.set_account(key,h.Account(old.lamports,data,h.TOKEN22));metas[6]=h.AccountMeta(key,False,True)
     h.mutate(h.CONFIG_KEY,353,bytes(h.PAYER.pubkey()))(vm,metas)
    kw=dict(amount=amount,sell=sell,limit=1,overrides=override)
    x=h.run(**kw);y=h.run(candidate=candidate,**kw);cx,cy=d.clean(x),d.clean(y);rows.append({'sell':sell,'amount':amount,'case':case,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'scope':__doc__,'producer_sha256':sha(Path(__file__)),'candidate_sha256':sha(candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'sell':x['sell'],'amount':x['amount'],'case':x['case'],'original':x['original']['error'],'candidate':x['candidate']['error'],'fields':x['mismatched_fields']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
