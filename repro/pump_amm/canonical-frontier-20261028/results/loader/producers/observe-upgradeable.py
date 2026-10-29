#!/usr/bin/env python3
"""Observe existing signed transactions without changing fixture or runtime calls."""
import base64,gzip,hashlib,json,runpy,sys
from pathlib import Path
sys.dont_write_bytecode=True
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata

sidecar=Path(sys.argv[1]);script=Path(sys.argv[2]).resolve();argv=sys.argv[2:]
sha=lambda b:hashlib.sha256(b).hexdigest()
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
original_send=LiteSVM.send_transaction
original_load=LiteSVM.add_program_from_file
original_sigverify=LiteSVM.with_sigverify
original_set=LiteSVM.set_account
UPGRADE="BPFLoaderUpgradeab1e11111111111111111111111"
load_trace=[]
loads={};records=[]

def load(self,program_id,path):
 assert str(program_id)!=AMM,'Forbidden AMM legacy add_program load'
 p=Path(path).resolve();assert not p.name.endswith('-keypair.json')
 key=str(p)
 if key not in loads:loads[key]={'path':key,'sha256':sha(p.read_bytes())}
 result=original_load(self,program_id,path)
 if not hasattr(self,'_observed_programs'):self._observed_programs={}
 self._observed_programs[str(program_id)]=loads[key]
 return result

def set_account(self,key,account):
 if str(key)==AMM:
  assert self.get_account(key) is None, 'Policy VM already has AMM executable account'
  assert AMM not in getattr(self,'_observed_programs',{}), 'Policy VM already has AMM load record'
 result=original_set(self,key,account)
 if str(key)==AMM:
  from solders.pubkey import Pubkey
  assert str(account.owner)==UPGRADE and account.executable and len(account.data)==36
  assert int.from_bytes(bytes(account.data)[:4],'little')==2
  pd_key=Pubkey.from_bytes(bytes(account.data)[4:]);pd=self.get_account(pd_key)
  assert pd is not None and str(pd.owner)==UPGRADE and not pd.executable and int.from_bytes(bytes(pd.data)[:4],'little')==3
  entry={'fresh_amm_account_absent_before_load':True,'mode':'upgradeable-account-load','program_account_sha256':sha(bytes(account.data)),'programdata_key':str(pd_key),'programdata_bytes':len(pd.data),'programdata_sha256':sha(bytes(pd.data)),'sha256':sha(bytes(pd.data)[45:]),'owner':UPGRADE}
  if not hasattr(self,'_observed_programs'):self._observed_programs={}
  self._observed_programs[AMM]=entry;load_trace.append(entry)
 return result

def sigverify(self,enabled):
 assert enabled is True,'Existing suite attempted to disable signature verification'
 return original_sigverify(self,enabled)

def send(self,tx):
 checks=tx.verify_with_results();assert checks and all(checks)
 raw=bytes(tx);programs=dict(getattr(self,'_observed_programs',{}));assert AMM in programs
 from solders.pubkey import Pubkey
 account=self.get_account(Pubkey.from_string(AMM));pd_key=Pubkey.from_bytes(bytes(account.data)[4:]);pd=self.get_account(pd_key)
 program_before=bytes(account.data);programdata_before=bytes(pd.data)
 result=original_send(self,tx)
 assert bytes(self.get_account(Pubkey.from_string(AMM)).data)==program_before and bytes(self.get_account(pd_key).data)==programdata_before
 assert bytes(tx)==raw,'Transaction mutated during forwarding'
 failed=isinstance(result,FailedTransactionMetadata);meta=result.meta()if failed else result
 logs=meta.logs()
 records.append({'loader_accounts_unchanged':True,'sequence':len(records),'transaction_base64':base64.b64encode(raw).decode(),'transaction_sha256':sha(raw),'signature_count':len(checks),'all_signatures_verified':True,'amm_program_sha256':programs[AMM]['sha256'],'loaded_programs':programs,'error':str(result.err())if failed else None,'logs_sha256':sha(json.dumps(logs,separators=(',',':')).encode())})
 return result

LiteSVM.set_account=set_account
LiteSVM.add_program_from_file=load
LiteSVM.with_sigverify=sigverify
LiteSVM.send_transaction=send
sys.path.insert(0,str(script.parent));sys.argv=argv
try:
 runpy.run_path(str(script),run_name='__main__')
finally:
 sidecar.parent.mkdir(parents=True,exist_ok=True)
 document={'upgradeable_load_trace':load_trace,'amm_legacy_loads_forbidden':True,'scope':'Observed unchanged existing suite transactions. Independent cryptographic verification before unchanged LiteSVM forwarding; no private keys retained. Synthetic accounts and signing identities belong to the existing fixtures.','script_sha256':sha(script.read_bytes()),'observer_sha256':sha(Path(__file__).read_bytes()),'transactions':records,'transaction_count':len(records),'signature_count':sum(x['signature_count']for x in records),'program_file_sha256':loads}
 with sidecar.open('wb')as f:
  with gzip.GzipFile(filename='',mode='wb',fileobj=f,mtime=0)as z:z.write((json.dumps(document,separators=(',',':'))+'\n').encode())
