#!/usr/bin/env python3
"""Signed synthetic liquidity mint-envelope and fee/order collisions."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_liquidity_differential as h
s=importlib.util.spec_from_file_location('clean',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');d=importlib.util.module_from_spec(s);s.loader.exec_module(d)
U64=2**64-1
def tlv(k,v):return struct.pack('<HH',k,len(v))+v
def fee(bps=100,cap=123):return bytes(72)+struct.pack('<QQH',0,cap,bps)*2
MODES=['valid','long-fee','unknown-first','duplicate','short-fee','short-header','invalid-bps-zero-cap','invalid-bps','none-unknown','terminator','tail-byte','bad-padding']
def mint_change(raw,mode):
 prefix=raw[:166];v=tlv(1,fee())
 if mode=='valid':return prefix+v
 if mode=='long-fee':return prefix+tlv(1,fee()+b'\0')
 if mode=='unknown-first':return prefix+tlv(65535,b'')+v
 if mode=='duplicate':return prefix+v+v
 if mode=='short-fee':return prefix+tlv(1,fee()[:-1])
 if mode=='short-header':return prefix+v+b'\x19\0\xff'
 if mode=='invalid-bps-zero-cap':return prefix+tlv(1,fee(10001,0))
 if mode=='invalid-bps':return prefix+tlv(1,fee(65535,U64))
 if mode=='none-unknown':return prefix+tlv(65535,b'')
 if mode=='terminator':return prefix+bytes(2)+v+v
 if mode=='tail-byte':return prefix+v+b'\xff'
 if mode=='bad-padding':return prefix[:164]+b'\1'+prefix[165:]+v
 raise AssertionError(mode)
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();a.candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();rows=[]
 for route in ['deposit','withdraw']:
  for mode in MODES:
   for gate in ['normal','zero','base-slippage','quote-slippage','frozen-base','insufficient-base','zero-supply','zero-quote']:
    def override(vm,m):
     h.transferfee(h.quote,100,123)(vm,m);acc=vm.vm.get_account(h.quote);vm.vm.set_account(h.quote,h.Account(acc.lamports,mint_change(bytes(acc.data),mode),acc.owner))
     if gate=='frozen-base':h.mutate(h.userbase if route=='deposit'else h.vaultbase,108,b'\2')(vm,m)
     if gate=='insufficient-base'and route=='deposit':h.mutate(h.userbase,64,bytes(8))(vm,m)
     if gate=='zero-supply':h.mutate(h.pool,203,bytes(8))(vm,m);h.mutate(h.lp,36,bytes(8))(vm,m)
     if gate=='zero-quote':h.mutate(h.vaultquote,64,bytes(8))(vm,m)
    kw=dict(name=route,amount=0 if gate=='zero'else(h.supply+1 if gate=='insufficient-base'and route=='withdraw'else 10**6),maxbase=U64 if route=='deposit'else 0,maxquote=U64 if route=='deposit'else 0,overrides=override)
    if gate=='base-slippage':kw['maxbase']=0 if route=='deposit'else U64
    if gate=='quote-slippage':kw['maxquote']=0 if route=='deposit'else U64
    x=h.run(**kw);y=h.run(candidate=a.candidate,**kw);cx,cy=d.clean(x),d.clean(y);rows.append({'route':route,'mode':mode,'gate':gate,'original':x,'candidate':y,'mismatched_fields':[k for k in cx if cx[k]!=cy[k]]})
 r={'scope':__doc__,'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};out.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in r.items()if k!='cases'}));print(json.dumps([{'route':x['route'],'mode':x['mode'],'gate':x['gate'],'fields':x['mismatched_fields'],'original':x['original']['error'],'candidate':x['candidate']['error']}for x in rows if x['mismatched_fields']],indent=2))
if __name__=='__main__':main()
