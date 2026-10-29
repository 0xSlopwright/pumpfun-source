#!/usr/bin/env python3
"""Independent signed differential corpus for Token-2022 mint TLV fee parsing."""
from pathlib import Path
import argparse,hashlib,importlib.util,json,sys
from solders.litesvm import LiteSVM
from solders.clock import Clock
W=Path(__file__).resolve().parent;R=W.parents[1];sys.path.insert(0,str(R/'scripts'))
import pump_amm_trade_v2_differential as h
sp=importlib.util.spec_from_file_location('direct',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(sp);sp.loader.exec_module(direct)
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();saved_send=LiteSVM.send_transaction;captures=[]
def snap(vm,keys):
 data={};programs={}
 for key in sorted(set(keys),key=str):
  value=vm.get_account(key)
  if value and value.executable:
   programs[str(key)]={'lamports':value.lamports,'owner':str(value.owner),'executable':value.executable,'rentEpoch':value.rent_epoch}
  else:data[str(key)]=json.loads(value.to_json())if value else None
 return {'non_executable':data,'executable_metadata':programs}
def send(vm,tx):
 checks=tx.verify_with_results();assert checks and all(checks);raw=bytes(tx);before=snap(vm,tx.message.account_keys);result=saved_send(vm,tx);assert bytes(tx)==raw;after=snap(vm,tx.message.account_keys)
 assert before['executable_metadata']==after['executable_metadata']
 captures.append({'transaction_sha256':hashlib.sha256(raw).hexdigest(),'before':before['non_executable'],'after':after['non_executable'],'message_keys':list(map(str,tx.message.account_keys)),'executable_metadata':before['executable_metadata']});return result
LiteSVM.send_transaction=send

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();roster=json.loads((W/'roster.json').read_text());rows=[]
 for case in roster['cases']:
  raw=bytes.fromhex(case['mint_data_hex'])
  def mutation(vm,metas):
   h.trade_transferfee(h.quote,100,1000)(vm,metas)
   account=vm.vm.get_account(h.quote);vm.vm.set_account(h.quote,h.Account(account.lamports,raw,account.owner))
   h.mutate(h.CONFIG_KEY,353,bytes(h.PAYER.pubkey()))(vm,metas)
   vm.vm.set_clock(Clock(100,1234567890,0,case['epoch'],1234567890))
  args={'name':case['instruction'],'amount':case['amount'],'limit':case['limit'],'overrides':mutation}
  before=len(captures);x=h.trade(**args);assert len(captures)==before+1;xcap=captures[-1];x['account_snapshots']={k:v for k,v in xcap.items()if k!='executable_metadata'}
  y=h.trade(candidate=a.candidate,**args);assert len(captures)==before+2;ycap=captures[-1];y['account_snapshots']={k:v for k,v in ycap.items()if k!='executable_metadata'}
  assert x['account_snapshots']['before']==y['account_snapshots']['before'];assert x['account_snapshots']['transaction_sha256']==y['account_snapshots']['transaction_sha256']
  cx,cy=direct.clean(x),direct.clean(y);diff=[k for k in cx if cx[k]!=cy.get(k)];rows.append({'case':case['case'],'group':case['group'],'instruction':case['instruction'],'epoch':case['epoch'],'amount':case['amount'],'limit':case['limit'],'mint_bytes':len(raw),'mint_sha256':hashlib.sha256(raw).hexdigest(),'original':x,'candidate':y,'mismatched_fields':diff,'executable_metadata_original':xcap['executable_metadata'],'executable_metadata_candidate':ycap['executable_metadata']})
  if diff:print('MISMATCH',case['case'],diff,flush=True)
  if len(rows)%100==0:print('PROGRESS',len(rows),flush=True)
 result={'scope':__doc__,'candidate_sha256':H(a.candidate),'original_sha256':H(R/'evidence/original/pump_amm/deployed.so'),'producer_sha256':H(Path(__file__)),'roster_sha256':H(W/'roster.json'),'comparator_sha256':H(R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),'harness_sha256':{n:H(R/n)for n in ['scripts/pump_amm_trade_v2_differential.py','scripts/pump_amm_liquidity_differential.py','scripts/pump_amm_admin_differential.py','scripts/pump_amm_reusable_harness.py']},'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'snapshot_scope':'All transaction-message non-executable account bytes/metadata plus executable account metadata; actual program file identities are bound by the outer observer.','cases':rows}
 a.output.write_text(json.dumps(result,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in result.items()if k!='cases'},indent=2));print(json.dumps({'groups':{g:{'cases':sum(r['group']==g for r in rows),'mismatches':sum(r['group']==g and bool(r['mismatched_fields'])for r in rows),'original_successes':sum(r['group']==g and r['original']['error']is None for r in rows)}for g in sorted({r['group']for r in rows})}},indent=2))
if __name__=='__main__':main()
