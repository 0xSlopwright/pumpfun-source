#!/usr/bin/env python3
"""Signed synthetic context-constraint negatives; no chain actions.

Existing ATAs are supplied so init_if_needed CPIs do not mask the late mint
program constraints. All signed input pairs and all result/state/log fields are
retained; comparison excludes only exact source coordinates and compute lines.
"""
from pathlib import Path
import argparse,base64,hashlib,importlib.util,json,struct,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_create_differential as create_h
import pump_amm_trade_v2_differential as trade_h
from solders.litesvm import LiteSVM
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
receipts=[];underlying_send=LiteSVM.send_transaction

def snapshot(vm,keys):
 result={}
 for k in sorted(set(keys),key=str):
  a=vm.get_account(k)
  if a is not None and a.executable:continue
  result[str(k)]=None if a is None else {'data_hex':bytes(a.data).hex(),'lamports':a.lamports,'owner':str(a.owner)}
 return result

def capture(vm,tx):
 assert all(tx.verify_with_results());raw=bytes(tx);before=snapshot(vm,tx.message.account_keys);out=underlying_send(vm,tx);assert bytes(tx)==raw
 receipts.append({'transaction_sha256':hashlib.sha256(raw).hexdigest(),'before':before,'after':snapshot(vm,tx.message.account_keys)});return out
LiteSVM.send_transaction=capture

def mint_program_mismatch(role,mint_owner_is_2022,disabled):
 def mutate(h,metas):
  mint=create_h.base if role=='base'else create_h.quote;program_index,vault_index=(13,9)if role=='base'else(14,10)
  owner=create_h.TOKEN22 if mint_owner_is_2022 else create_h.TOKEN;passed=create_h.TOKEN if mint_owner_is_2022 else create_h.TOKEN22
  old=h.vm.get_account(mint);h.vm.set_account(mint,create_h.Account(old.lamports,old.data[:82],owner));metas[program_index]=create_h.AccountMeta(passed,False,False)
  vault=create_h.Pubkey.find_program_address([bytes(metas[0].pubkey),bytes(passed),bytes(mint)],create_h.ATA)[0];metas[vault_index]=create_h.AccountMeta(vault,False,True)
  raw=create_h.token(mint,metas[0].pubkey,0,role=='quote');h.vm.set_account(vault,create_h.Account(10**9,raw,passed))
  if disabled:create_h.mutate(create_h.CONFIG_KEY,56,b'\x01')(h,metas)
 return mutate

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 def run(label,call,params):
  values=[];captures=[]
  for binary in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
   before=len(receipts);values.append(call(candidate=binary,**params));assert len(receipts)==before+1;captures.append(receipts[-1])
  x,y=values;cx,cy=direct.clean(x),direct.clean(y);diff=[k for k in cx if cx[k]!=cy.get(k)]
  assert captures[0]['transaction_sha256']==captures[1]['transaction_sha256']and captures[0]['before']==captures[1]['before']
  if captures[0]['after']!=captures[1]['after']:diff.append('full_account_snapshot')
  rows.append({'case':label,'original':x,'candidate':y,'original_state_receipt':captures[0],'candidate_state_receipt':captures[1],'mismatched_fields':diff})
 for role in ['base','quote']:
  for owner2022 in [False,True]:
   for gate in ['normal','zero-amount','disabled']:
    run({'kind':'mint-program','role':role,'mint_owner':'Token2022'if owner2022 else'Token','passed_program':'Token'if owner2022 else'Token2022','gate':gate},create_h.create,{'base_amount':0 if gate=='zero-amount'else 10**9,'quote_amount':0 if gate=='zero-amount'else 10**9,'overrides':mint_program_mismatch(role,owner2022,gate=='disabled')})
 # Identify one off-curve wrong bump and one invalid-seed (on-curve) wrong bump.
 canonical,bump=trade_h.Pubkey.find_program_address([b'fee_config',bytes(trade_h.PROGRAM)],trade_h.FEES)
 assert canonical==trade_h.feeconfig
 wrong_valid=wrong_invalid=None
 for candidate_bump in range(256):
  if candidate_bump==bump:continue
  try:trade_h.Pubkey.create_program_address([b'fee_config',bytes(trade_h.PROGRAM),bytes([candidate_bump])],trade_h.FEES)
  except Exception:
   if wrong_invalid is None:wrong_invalid=candidate_bump
  else:
   if wrong_valid is None:wrong_valid=candidate_bump
  if wrong_valid is not None and wrong_invalid is not None:break
 for name in ['buy_v2','buy_exact_quote_in_v2','sell_v2']:
  for label,value in [('canonical',bump),('wrong-valid-PDA',wrong_valid),('invalid-PDA-seeds',wrong_invalid)]:
   run({'kind':'fee-config-bump','instruction':name,'bump_kind':label,'bump':value},trade_h.trade,{'name':name,'amount':10**7 if name=='buy_exact_quote_in_v2'else 10**10,'limit':10**12 if name=='buy_v2'else 1,'overrides':trade_h.mutate(trade_h.feeconfig,8,bytes([value]))})
 report={'scope':__doc__,'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'cases':rows}
 a.output.write_text(json.dumps(report,separators=(',',':'))+'\n')
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'results':[{'case':r['case'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error'],'fields':r['mismatched_fields']}for r in rows]},indent=2))
if __name__=='__main__':main()
