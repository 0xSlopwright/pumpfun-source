#!/usr/bin/env python3
"""Synthetic signed payout-order collisions for AMM collect, sweep and creator transfer."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,struct,sys
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_collect_differential as collect
import pump_amm_sweep_differential as sweep
import pump_amm_transfer_creator_differential as transfer
from solders.litesvm import LiteSVM
spec=importlib.util.spec_from_file_location('direct',ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');direct=importlib.util.module_from_spec(spec);spec.loader.exec_module(direct)
U64=(1<<64)-1;I128=(1<<127)-1;FEE=collect.Pubkey.from_string('pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ')
records=[];send=LiteSVM.send_transaction

def snap(vm,keys):
 out={}
 for k in sorted(set(keys),key=str):
  a=vm.get_account(k)
  if a is not None and a.executable:continue
  out[str(k)]=None if a is None else {'owner':str(a.owner),'lamports':a.lamports,'data':bytes(a.data).hex()}
 return out

def capture(vm,tx):
 raw=bytes(tx);assert all(tx.verify_with_results());before=snap(vm,tx.message.account_keys);r=send(vm,tx);assert raw==bytes(tx)
 records.append({'tx_sha256':hashlib.sha256(raw).hexdigest(),'before':before,'after':snap(vm,tx.message.account_keys)});return r
LiteSVM.send_transaction=capture

def account(vm,key,data=None,owner=None,lamports=None):
 a=vm.vm.get_account(key);vm.vm.set_account(key,collect.Account(a.lamports if lamports is None else lamports,bytes(a.data)if data is None else bytes(data),a.owner if owner is None else owner))

def sweep_setup(protocol,creator,risk):
 def setup(vm,m):
  a=vm.vm.get_account(sweep.pool);d=bytearray(a.data);d[245:261]=(I128 if risk=='virtual-overflow'else 0).to_bytes(16,'little',signed=True);d[271:279]=struct.pack('<Q',protocol);d[279:287]=struct.pack('<Q',creator);account(vm,sweep.pool,d)
  balance=0 if risk=='insufficient'else min(U64,protocol+creator)
  a=vm.vm.get_account(sweep.vaultquote);d=bytearray(a.data);d[64:72]=struct.pack('<Q',balance)
  if risk=='frozen-source':d[108]=2
  if risk=='authority-mismatch':d[32:64]=bytes(sweep.OUTSIDER.pubkey())
  account(vm,sweep.vaultquote,d,lamports=min(U64,balance+2039280))
  if risk!='missing-destination':
   data=bytearray(sweep.token(sweep.quote,m[6].pubkey,0,True));owner=sweep.PROGRAM if risk=='wrong-destination-owner'else sweep.TOKEN
   if risk=='frozen-destination':data[108]=2
   vm.vm.set_account(m[7].pubkey,sweep.Account(2039280,bytes(data),owner))
 return setup

def mint_data(raw,mode):
 conf=bytes(72)+struct.pack('<QQH',0,U64,100)*2
 if mode=='invalid-bps':conf=bytes(72)+struct.pack('<QQH',0,0,10001)*2
 tlv=struct.pack('<HH',1,len(conf))+conf
 if mode=='short-tlv':tlv=struct.pack('<HH',1,len(conf))+conf[:2]
 elif mode=='duplicate':tlv+=tlv
 elif mode=='unknown':tlv+=struct.pack('<HH',27,0)
 return raw[:82]+bytes(83)+b'\1'+tlv

def collect_tf(mode,migrated,frozen):
 def setup(vm,m):
  a=vm.vm.get_account(collect.quote);account(vm,collect.quote,mint_data(a.data,mode),collect.TOKEN22);m[1]=collect.AccountMeta(collect.TOKEN22,False,False)
  old=vm.vm.get_account(m[4].pubkey);src=collect.Pubkey.find_program_address([bytes(collect.AUTH),bytes(collect.TOKEN22),bytes(collect.quote)],collect.ATA)[0];d=bytearray(old.data[:165]+b'\2'+struct.pack('<HHQ',2,8,0));d[108]=2 if frozen else 1;vm.vm.set_account(src,collect.Account(old.lamports,bytes(d),collect.TOKEN22));m[4]=collect.AccountMeta(src,False,True)
  a=vm.vm.get_account(collect.DEST);account(vm,collect.DEST,a.data[:165]+b'\2'+struct.pack('<HHQ',2,8,0),collect.TOKEN22)
  if migrated:vm.vm.set_account(collect.CREATOR,collect.Account(10**9,b'',FEE))
 return setup

def sweep_tf(mode,dest):
 def setup(vm,m):
  a=vm.vm.get_account(sweep.quote);account(vm,sweep.quote,mint_data(a.data,mode),sweep.TOKEN22);m[4]=sweep.AccountMeta(sweep.TOKEN22,False,False)
  a=vm.vm.get_account(sweep.vaultquote);account(vm,sweep.vaultquote,a.data[:165]+b'\2'+struct.pack('<HHQ',2,8,0),sweep.TOKEN22)
  target=sweep.Pubkey.find_program_address([bytes(m[6].pubkey),bytes(sweep.TOKEN22),bytes(sweep.quote)],sweep.ATA)[0];m[7]=sweep.AccountMeta(target,False,True)
  if dest!='missing':
   d=bytearray(sweep.token(sweep.quote,m[6].pubkey,0,True)+b'\2'+struct.pack('<HHQ',2,8,0));d[108]=2 if dest=='frozen'else 1;vm.vm.set_account(target,sweep.Account(2039280,bytes(d),sweep.TOKEN22))
 return setup

def transfer_tf(mode,dest,wrong_auth):
 def setup(vm,m):
  row=transfer.f['accounts']['base_mint'];raw=base64.b64decode(row['data_base64']);vm.vm.set_account(transfer.base,transfer.Account(row['lamports'],mint_data(raw,mode),transfer.TOKEN22));m[1]=transfer.AccountMeta(transfer.base,False,False);m[2]=transfer.AccountMeta(transfer.TOKEN22,False,False)
  old=vm.vm.get_account(transfer.VAULT);amount=int.from_bytes(old.data[64:72],'little');src=transfer.Pubkey.find_program_address([bytes(transfer.AUTH),bytes(transfer.TOKEN22),bytes(transfer.base)],transfer.ATA)[0];d=bytearray(transfer.token(transfer.base,transfer.AUTH,amount)+b'\2'+struct.pack('<HHQ',2,8,0))
  if wrong_auth:d[32:64]=bytes(transfer.OUTSIDER.pubkey())
  vm.vm.set_account(src,transfer.Account(10**9,bytes(d),transfer.TOKEN22));m[7]=transfer.AccountMeta(src,False,True)
  target=transfer.Pubkey.find_program_address([bytes(transfer.PUMPVAULT),bytes(transfer.TOKEN22),bytes(transfer.base)],transfer.ATA)[0];m[9]=transfer.AccountMeta(target,False,True)
  if dest!='missing':
   d=bytearray(transfer.token(transfer.base,transfer.PUMPVAULT,0)+b'\2'+struct.pack('<HHQ',2,8,0));d[108]=2 if dest=='frozen'else 1;owner=transfer.PROGRAM if dest=='wrong-owner'else transfer.TOKEN22;vm.vm.set_account(target,transfer.Account(10**9,bytes(d),owner))
 return setup

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 def run(case,call,kwargs):
  vals=[];caps=[]
  for binary in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
   n=len(records);vals.append(call(candidate=binary,**kwargs));assert len(records)==n+1;caps.append(records[-1])
  assert caps[0]['tx_sha256']==caps[1]['tx_sha256']and caps[0]['before']==caps[1]['before'];x,y=map(direct.clean,vals);diff=[k for k in x if x[k]!=y.get(k)]
  if caps[0]['after']!=caps[1]['after']:diff.append('full_account_snapshot')
  rows.append({'case':dict(case,synthetic=True),'original':vals[0],'candidate':vals[1],'original_receipt':caps[0],'candidate_receipt':caps[1],'mismatched_fields':diff})
 for name in ['sweep_protocol_fee','sweep_creator_fee']:
  for protocol,creator in [(0,0),(0,U64),(1,U64),(1,1),(U64,0),(1000,2000)]:
   for risk in ['valid','missing-destination','insufficient','frozen-source','frozen-destination','wrong-destination-owner','virtual-overflow','authority-mismatch']:
    run({'group':'sweep-collision','instruction':name,'protocol':protocol,'creator':creator,'risk':risk},sweep.sweep,{'name':name,'overrides':sweep_setup(protocol,creator,risk)})
 modes=['normal','invalid-bps','short-tlv','duplicate','unknown']
 for amount in [0,1,1000]:
  for mode in modes:
   for migrated in [False,True]:
    for frozen in [False,True]:run({'group':'collect-tf','amount':amount,'mode':mode,'migrated':migrated,'frozen':frozen},collect.collect,{'amount':amount,'overrides':collect_tf(mode,migrated,frozen)})
   for name in ['sweep_protocol_fee','sweep_creator_fee']:
    for dest in ['missing','valid','frozen']:run({'group':'sweep-tf','instruction':name,'amount':amount,'mode':mode,'destination':dest},sweep.sweep,{'name':name,'amount':amount,'overrides':sweep_tf(mode,dest)})
   for dest in ['missing','frozen','wrong-owner']:
    for wrong in [False,True]:run({'group':'transfer-v2-tf','amount':amount,'mode':mode,'destination':dest,'wrong_authority':wrong},transfer.transfer,{'name':'transfer_creator_fees_to_pump_v2','amount':amount,'overrides':transfer_tf(mode,dest,wrong)})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((ROOT/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'cases':rows}
 with gzip.GzipFile(filename='',fileobj=a.output.open('wb'),mode='wb',mtime=0)as f:f.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
