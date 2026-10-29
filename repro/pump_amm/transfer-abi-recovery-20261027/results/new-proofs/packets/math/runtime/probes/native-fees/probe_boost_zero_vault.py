#!/usr/bin/env python3
"""Signed synthetic Boost mint-TLV cases for fee decoding and harvest/close ordering."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_boost_burn_differential as h
from solders.litesvm import LiteSVM
s=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');d=importlib.util.module_from_spec(s);s.loader.exec_module(d)
saved=LiteSVM.send_transaction;snapshots=[]
def send(vm,tx):
 keys=list(tx.message.account_keys)
 def snap():return {str(k):json.loads(a.to_json())if a else None for k in keys if not(a:=vm.get_account(k))or not a.executable}
 before=snap();r=saved(vm,tx);snapshots.append({'before':before,'after':snap()});return r
LiteSVM.send_transaction=send

def alter(data,kind):
 fee=data[166:]
 if kind=='valid':return data
 if kind=='long-fee':return data[:168]+struct.pack('<H',109)+data[170:]+b'\0'
 if kind=='unknown-before':return data[:166]+struct.pack('<HH',65535,0)+fee
 if kind=='duplicate':return data+fee
 if kind=='bad-tail':return data+b'\x19\0\xff'
 if kind=='bad-padding':return data[:82]+b'\x01'+data[83:]
 if kind=='truncated-fee':return data[:-1]
 if kind=='no-fee-unknown':return data[:166]+struct.pack('<HH',65535,0)
 raise AssertionError(kind)

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();output=a.output.resolve();assert not output.exists();rows=[]
 for kind in ['valid','duplicate','truncated-fee']:
  for amount in [1,1000]:
   for writable in [True]:
    def override(vm,metas):
     h.boost_transferfee(h.quote,100,123,1,writable)(vm,metas);acc=vm.vm.get_account(h.quote);vm.vm.set_account(h.quote,h.Account(acc.lamports,alter(bytes(acc.data),kind),acc.owner));h.mutate(metas[8].pubkey,64,bytes(8))(vm,metas)
    kw=dict(amount=amount,overrides=override)
    x=h.run(**kw);x['account_snapshots']=snapshots[-1];y=h.run(candidate=candidate,**kw);y['account_snapshots']=snapshots[-1];cx,cy=d.clean(x),d.clean(y)
    rows.append({'case':kind,'amount':amount,'mint_writable':writable,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'scope':__doc__,'candidate_sha256':sha(candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'producer_sha256':sha(Path(__file__)),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};output.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'case':x['case'],'amount':x['amount'],'writable':x['mint_writable'],'original_error':x['original']['error'],'candidate_error':x['candidate']['error'],'fields':x['mismatched_fields']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
