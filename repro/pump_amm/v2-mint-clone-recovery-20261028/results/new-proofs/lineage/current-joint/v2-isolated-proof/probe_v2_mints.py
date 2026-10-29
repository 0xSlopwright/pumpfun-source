#!/usr/bin/env python3
"""Synthetic Token-2022 mint-envelope and TLV decoder cases, with signed transactions and complete results."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_trade_v2_differential as h
s=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');d=importlib.util.module_from_spec(s);s.loader.exec_module(d)
# Preserve every account field for all transaction message keys, in addition
# to the existing harness result. The outer observer still authenticates the
# exact signed transaction and selected executable loaded by this harness.
from solders.litesvm import LiteSVM
send_without_snapshot = LiteSVM.send_transaction
snapshots = []
def send_with_snapshot(vm, tx):
    keys = list(tx.message.account_keys)
    def read():
        return {str(key): json.loads(account.to_json()) if account else None for key in keys if not (account := vm.get_account(key)) or not account.executable}
    before = read()
    result = send_without_snapshot(vm, tx)
    snapshots.append({'before': before, 'after': read()})
    return result
LiteSVM.send_transaction = send_with_snapshot

def config(old=(0,1000,100),new=(1,2000,200)):
 return bytes(72)+struct.pack('<QQH',*old)+struct.pack('<QQH',*new)
def tlv(kind,value):return struct.pack('<HH',kind,len(value))+value
CASES=[]
for n in [82,83,164,165,166,167,168,169,170]:CASES.append(('length-'+str(n),lambda raw,n=n:raw[:n].ljust(n,b'\0')))
for off in [82,120,164,165]:CASES.append(('bad-envelope-'+str(off),lambda raw,off=off:raw[:off]+b'\3'+raw[off+1:]))
for label,tail in [
 ('fee-valid',tlv(1,config())),('fee-short107',tlv(1,config()[:107])),('fee-long109',tlv(1,config()+b'\0')),
 ('fee-duplicate',tlv(1,config())+tlv(1,config())),('fee-malformed-trailing-header',tlv(1,config())+b'\x19\0\xff'),
 ('fee-malformed-trailing-payload',tlv(1,config())+struct.pack('<HH',25,20)+b'\0'),
 ('fee-unknown-before',tlv(65535,b'')+tlv(1,config())),('fee-unknown-after',tlv(1,config())+tlv(65535,b'')),
 ('fee-one-tail-byte',tlv(1,config())+b'\xff'),('fee-zero-kind-trailing',tlv(1,config())+bytes(2)+b'\xff'),
 ('fee-epoch-new',tlv(1,config(new=(0,2000,200)))),('fee-epoch-old',tlv(1,config(new=(1,2000,200)))),
 ('fee-extreme-forward',tlv(1,config(old=(0,2**64-1,65535)))),
 ('no-fee-unknown',tlv(65535,b'')),('no-fee-zero',bytes(2)),('no-fee-malformed',b'\x19\0\xff')]:
 CASES.append((label,lambda raw,tail=tail:raw[:166]+tail))
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for label,change in CASES:
  for name in ['buy_v2','buy_exact_quote_in_v2','sell_v2']:
   for minimum in [1,2**64-1]:
    def ov(vm,metas):
     h.trade_transferfee(h.quote,100,1000)(vm,metas)
     account=vm.vm.get_account(h.quote);vm.vm.set_account(h.quote,h.Account(account.lamports,change(bytes(account.data)),account.owner))
     h.mutate(h.CONFIG_KEY,353,bytes(h.PAYER.pubkey()))(vm,metas)
    args=dict(name=name,amount=10**7,limit=minimum,overrides=ov)
    x=h.trade(**args); x['account_snapshots'] = snapshots[-1]
    y=h.trade(candidate=a.candidate,**args); y['account_snapshots'] = snapshots[-1]
    cx,cy=d.clean(x),d.clean(y)
    rows.append({'case':label,'instruction':name,'minimum':minimum,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy.get(k)]})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'scope':__doc__,'candidate_sha256':sha(a.candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'producer_sha256':sha(Path(__file__)),'comparator_sha256':sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'cases':rows};a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'case':r['case'],'minimum':r['minimum'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error'],'fields':r['mismatched_fields']}for r in rows if r['mismatched_fields']],indent=2))
if __name__=='__main__':main()
