#!/usr/bin/env python3
"""Signed sell probes for pool-authorized raw-destination transfers and precedence."""
import argparse,base64,hashlib,json,re,struct,sys
from pathlib import Path
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_legacy_sell_differential as legacy
import pump_amm_trade_v2_differential as v2
from solders.litesvm import LiteSVM

sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
original_send=LiteSVM.send_transaction
receipts=[]
def snapshot(vm,keys):
 out={}
 for k in sorted(set(keys),key=str):
  a=vm.get_account(k)
  if a and a.executable:continue
  out[str(k)]=None if a is None else {'data_hex':bytes(a.data).hex(),'lamports':a.lamports,'owner':str(a.owner),'rent_epoch':a.rent_epoch}
 return out
def signed_send(vm,tx):
 checks=tx.verify_with_results();assert checks and all(checks)
 encoded=bytes(tx);before=snapshot(vm,tx.message.account_keys)
 result=original_send(vm,tx)
 assert bytes(tx)==encoded
 receipts.append({'transaction_base64':base64.b64encode(encoded).decode(),'transaction_sha256':hashlib.sha256(encoded).hexdigest(),'signature_verification':checks,'before':before,'after':snapshot(vm,tx.message.account_keys)})
 return result
LiteSVM.send_transaction=signed_send

def roster():
 rows=[]
 for bps in [0,10000]:
  for kind in ['valid','empty','length1','length64','length164','wrong-mint','wrong-program-owner','frozen']:
   rows.append({'kind':kind,'buyback_bps':bps,'self_transfer':False})
 rows += [{'kind':'self-pool-owned','buyback_bps':10000,'self_transfer':True},{'kind':'self-wrong-owner','buyback_bps':10000,'self_transfer':True}]
 return rows

def override(route,case):
 def apply(h,m):
  # All protocol fees flow to buyback; zero protocol output leaves the raw transfer isolated.
  v2.custom_fee_table([(0,(0,10000,0))])(h,m)
  v2.mutate(v2.feeconfig,41,struct.pack('<QQQ',0,10000,0))(h,m)
  v2.mutate(v2.CONFIG_KEY,40,struct.pack('<QQ',0,10000))(h,m)
  v2.mutate(v2.CONFIG_KEY,313,struct.pack('<Q',0))(h,m)
  v2.mutate(v2.CONFIG_KEY,899,struct.pack('<Q',case['buyback_bps']))(h,m)
  if route=='sell':del m[21]  # No creator fee means no pool-v2 remaining account.
  dest_index=22 if route=='sell' else 14
  dest=m[dest_index].pubkey
  kind=case['kind']
  if case['self_transfer']:
   owner=v2.pool if kind=='self-pool-owned' else v2.OUTSIDER.pubkey()
   dest=v2.Pubkey.find_program_address([bytes(owner),bytes(v2.TOKEN),bytes(v2.quote)],legacy.ATA)[0]
   old=h.vm.get_account(v2.vaultquote);d=bytearray(old.data);d[32:64]=bytes(owner)
   h.vm.set_account(dest,v2.Account(old.lamports,bytes(d),old.owner))
   pool=h.vm.get_account(m[0].pubkey);p=bytearray(pool.data);p[171:203]=bytes(dest);h.vm.set_account(m[0].pubkey,v2.Account(pool.lamports,bytes(p),pool.owner))
   m[8]=v2.AccountMeta(dest,False,True);m[dest_index]=v2.AccountMeta(dest,False,True)
   v2.mutate(v2.CONFIG_KEY,643,bytes(owner)*8)(h,m)
   if route=='sell':m[21]=v2.AccountMeta(owner,False,False)
   return
  old=h.vm.get_account(dest);d=bytearray(old.data);account_owner=old.owner
  if kind=='empty':d=bytearray()
  elif kind.startswith('length'):d=d[:int(kind[6:])]
  elif kind=='wrong-mint':d[:32]=bytes(v2.base)
  elif kind=='wrong-program-owner':account_owner=v2.Pubkey.default()
  elif kind=='frozen':d[108]=2
  h.vm.set_account(dest,v2.Account(old.lamports,bytes(d),account_owner))
 return apply

def main():
 p=argparse.ArgumentParser()
 for n in ['candidate','build-record','output']:p.add_argument('--'+n,type=Path,required=True)
 a=p.parse_args();a.candidate=a.candidate.resolve();a.build_record=a.build_record.resolve();a.output=a.output.resolve();assert not a.output.exists()
 br=json.loads(a.build_record.read_text());assert br['returncode']==0 and br['source_unchanged'] and br['comparison']['candidate_sha256']==sha(a.candidate)
 rows=[]
 for route in ['sell','sell_v2']:
  for case in roster():
   results=[];observed=[]
   for binary in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
    start=len(receipts)
    if route=='sell':r=legacy.legacy(amount=10**10,limit=0,overrides=override(route,case),candidate=binary)
    else:r=v2.trade('sell_v2',10**10,0,overrides=override(route,case),candidate=binary)
    assert len(receipts)==start+1;results.append(r);observed.append(receipts[-1])
   x,y=results;rx,ry=observed
   assert rx['transaction_base64']==ry['transaction_base64'] and rx['before']==ry['before']
   differences=[k for k in x if k!='logs' and x[k]!=y[k]]
   def logs(v):return [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',line) for line in v['logs'] if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',line)]
   if logs(x)!=logs(y):differences.append('logs_except_source_coordinates_and_compute')
   if rx['after']!=ry['after']:differences.append('full_account_snapshot')
   row={'instruction':route,'case':case,'original':x,'candidate':y,'signed_original':rx,'signed_candidate':ry,'mismatched_fields':differences,'match':not differences}
   rows.append(row);print(json.dumps({'instruction':route,'case':case,'original_error':x['error'],'candidate_error':y['error'],'differences':differences}),flush=True)
 inputs=['scripts/pump_amm_legacy_sell_differential.py','scripts/pump_amm_trade_v2_differential.py','scripts/pump_amm_liquidity_differential.py','scripts/pump_amm_reusable_harness.py','scripts/pump_amm_admin_differential.py']
 report={'scope':__doc__,'candidate_sha256':sha(a.candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'build_record_sha256':sha(a.build_record),'producer_sha256':sha(Path(__file__)),'harness_sha256':{p:sha(ROOT/p)for p in inputs},'case_count':len(rows),'transaction_count':len(receipts),'signature_count':sum(len(r['signature_verification'])for r in receipts),'mismatches':[i for i,r in enumerate(rows)if not r['match']],'cases':rows}
 a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(report,separators=(',',':'))+'\n');print(json.dumps({k:report[k]for k in ['case_count','transaction_count','signature_count','mismatches']}));raise SystemExit(bool(report['mismatches']))
if __name__=='__main__':main()
