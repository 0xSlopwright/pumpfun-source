#!/usr/bin/env python3
"""Signed create_pool extension-order probes using captured token dependency ELFs."""
import argparse,base64,hashlib,importlib.util,json,struct,sys
from pathlib import Path
import re
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_create_differential as h
from solders.litesvm import LiteSVM
spec=importlib.util.spec_from_file_location("mint_log_normalizer",ROOT/"repro/pump_amm/diagnostic-parity-20261027/compare_direct.py");normalizer=importlib.util.module_from_spec(spec);spec.loader.exec_module(normalizer)
BASE_FIXTURE=h.base
SPECIAL_MINT=h.Pubkey.from_string("pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn")
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
receipts=[];send=LiteSVM.send_transaction
def snapshot(vm,keys):
 out={}
 for k in sorted(set(keys),key=str):
  a=vm.get_account(k)
  if a is not None and a.executable:continue
  out[str(k)]=None if a is None else {'data_hex':bytes(a.data).hex(),'lamports':a.lamports,'owner':str(a.owner)}
 return out
def signed_send(vm,tx):
 checks=tx.verify_with_results();assert checks and all(checks);raw=bytes(tx);before=snapshot(vm,tx.message.account_keys);r=send(vm,tx);assert raw==bytes(tx)
 receipts.append({'transaction_base64':base64.b64encode(raw).decode(),'transaction_sha256':hashlib.sha256(raw).hexdigest(),'signature_verification':checks,'before':before,'after':snapshot(vm,tx.message.account_keys)});return r
LiteSVM.send_transaction=signed_send

def roster():
 return [
  ('plain',b'',82,None),
  ('metadata-pointer',[(18,bytes(64))],None,None),
  ('token-metadata',[(19,b'')],None,None),
  ('pointer-metadata',[(18,bytes(64)),(19,b'')],None,None),
  ('metadata-pointer-order',[(19,b''),(18,bytes(64))],None,None),
  ('duplicate-pointer',[(18,bytes(64)),(18,bytes(64))],None,None),
  ('duplicate-metadata',[(19,b''),(19,b'')],None,None),
  ('transfer-fee',[(1,bytes(108))],None,None),
  ('default-initialized',[(6,b'\1')],None,None),
  ('default-frozen',[(6,b'\2')],None,None),
  ('transfer-hook-disabled',[(14,bytes(64))],None,None),
  ('transfer-hook-enabled',[(14,bytes(32)+bytes([1])*32)],None,None),
  ('tag25-noncanonical',[(25,bytes(56))],None,None),
  ('tag26-noncanonical',[(26,bytes(33))],None,None),
  ('unknown-extension',[(27,b'')],None,None),
  ('trailing-terminator',[(18,bytes(64)),(0,b''),(27,b'')],None,None),
  ('incomplete-type',b'\x12',None,None),
  ('incomplete-length',b'\x12\0\x40',None,None),
  ('truncated-value',b'\x12\0\x40\0'+bytes(63),None,None),
  ('header-only',b'',166,None),
  ('one-byte-zero',b'\0',None,None),
  ('bad-padding',[(18,bytes(64))],None,82),
 ]
def mutate(role,case):
 def apply(vm,m):
  _,entries,length,badpad=case;mint=h.base if role=='base' else h.quote;pi,vi,ui=(13,9,6)if role=='base'else(14,10,7);a=vm.vm.get_account(mint)
  if a is None:a=vm.vm.get_account(BASE_FIXTURE)
  tlv=entries if isinstance(entries,bytes)else b''.join(struct.pack('<HH',k,len(v))+v for k,v in entries)
  data=bytearray(a.data[:82] if length==82 else a.data[:82]+bytes(83)+b'\1'+tlv)
  if length is not None:data=data[:length]
  if badpad is not None:data[badpad]=1
  vm.vm.set_account(mint,h.Account(a.lamports,bytes(data),h.TOKEN22));user=m[ui].pubkey;a=vm.vm.get_account(user);token_data=a.data
  if any(k==1 for k,_ in entries)if not isinstance(entries,bytes)else False:token_data=token_data[:165]+bytes([2])+struct.pack('<HHQ',2,8,0)
  vm.vm.set_account(user,h.Account(a.lamports,token_data,h.TOKEN22));m[pi]=h.AccountMeta(h.TOKEN22,False,False);vault=h.Pubkey.find_program_address([bytes(m[0].pubkey),bytes(h.TOKEN22),bytes(mint)],h.ATA)[0];m[vi]=h.AccountMeta(vault,False,True)
  vault_data=h.token(mint,m[0].pubkey,0,role=='quote')
  if any(k==1 for k,_ in entries)if not isinstance(entries,bytes)else False:vault_data+=bytes([2])+struct.pack('<HHQ',2,8,0)
  vm.vm.set_account(vault,h.Account(2039280 if role=='quote'else 10**9,vault_data,h.TOKEN22))
 return apply

def main():
 p=argparse.ArgumentParser()
 for key in ['candidate','build-record','output']:p.add_argument('--'+key,type=Path,required=True)
 a=p.parse_args();a.candidate=a.candidate.resolve();a.output=a.output.resolve();assert not a.output.exists();br=json.loads(a.build_record.read_text());assert br['returncode']==0 and br['source_unchanged']and br['comparison']['candidate_sha256']==sha(a.candidate);rows=[]
 for role in ['base','quote','special']:
  if role=='special':h.base=SPECIAL_MINT
  for case in roster() if role!='special' else [('special-duplicate-pointer',[(18,bytes(64)),(18,bytes(64))],None,None),('special-transfer-fee',[(1,bytes(108))],None,None)]:
   results=[];observed=[]
   for binary in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
    start=len(receipts);result=h.create(candidate=binary,overrides=mutate("base" if role=="special" else role,case));assert len(receipts)==start+1;results.append(result);observed.append(receipts[-1])
   x,y=results;rx,ry=observed;assert rx['transaction_base64']==ry['transaction_base64']and rx['before']==ry['before'];cx,cy=normalizer.clean(x),normalizer.clean(y);diff=[k for k in cx if cx[k]!=cy[k]]
   def logs(v):return [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',line) for line in v['logs'] if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',line)]
   if logs(x)!=logs(y):diff.append('logs_except_source_coordinates_and_compute')
   if rx['after']!=ry['after']:diff.append('full_account_snapshot')
   rows.append({'role':role,'case':case[0],'original':x,'candidate':y,'original_signed':rx,'candidate_signed':ry,'mismatched_fields':diff});print(json.dumps({'role':role,'case':case[0],'original_error':x['error'],'candidate_error':y['error'],'differences':diff}),flush=True)
  h.base=BASE_FIXTURE
 report={'scope':__doc__,'candidate_sha256':sha(a.candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'build_record_sha256':sha(a.build_record),'producer_sha256':sha(Path(__file__)),'log_normalizer_sha256':sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),'harness_sha256':{n:sha(ROOT/n)for n in ['scripts/pump_amm_create_differential.py','scripts/pump_amm_liquidity_differential.py','scripts/pump_amm_reusable_harness.py']},'case_count':len(rows),'transaction_count':len(receipts),'signature_count':sum(len(x['signature_verification'])for x in receipts),'mismatches':[i for i,r in enumerate(rows)if r['mismatched_fields']],'cases':rows};a.output.write_text(json.dumps(report,separators=(',',':'))+'\n');print(json.dumps({k:report[k]for k in ['case_count','transaction_count','signature_count','mismatches']}));raise SystemExit(bool(report['mismatches']))
if __name__=='__main__':main()
