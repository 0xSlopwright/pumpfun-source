#!/usr/bin/env python3
"""Observe unchanged real-loader transactions for the freshly compiled ELF."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,struct
from solders.litesvm import LiteSVM
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repo',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();repo=a.repo.resolve();out=a.output.resolve();out.mkdir(parents=True,exist_ok=False)
script=repo/'repro/donation-relay/offline-loader-allocation/verify.py';s=importlib.util.spec_from_file_location('repeat_loader_original',script);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
elf=a.candidate.resolve().read_bytes();original=(repo/'evidence/dependencies/donation_relay/deployed.so').read_bytes();require=lambda x,msg:None if x else (_ for _ in ()).throw(ValueError(msg))
require(hashlib.sha256(elf).hexdigest()=='56d81ec64a0ba070d3d23f3c1547b31d659e85716dfa2198ec4b0ce6cd355333','compiled ELF identity')
get=LiteSVM.get_account;send=LiteSVM.send_transaction;payloads=[];transactions=[]
def observed_get(self,key):
 account=get(self,key)
 if account is not None:
  data=bytes(account.data)
  if len(data)==830493 and struct.unpack_from('<I',data)[0]==3:payloads.append(data[45:])
 return account
def observed_send(self,tx):
 raw=bytes(tx);checks=tx.verify_with_results();require(checks and all(checks),'loader signature')
 result=send(self,tx);require(bytes(tx)==raw,'transaction mutated');transactions.append({'transaction_base64':base64.b64encode(raw).decode(),'sha256':hashlib.sha256(raw).hexdigest(),'signatures':len(checks)});return result
LiteSVM.get_account=observed_get;LiteSVM.send_transaction=observed_send
try:receipt=m.execute(elf,830448,original)
finally:LiteSVM.get_account=get;LiteSVM.send_transaction=send
require(len(payloads)==1 and payloads[0]==original and payloads[0][:len(elf)]==elf,'real loader payload')
require(receipt['transactions']==len(transactions)==912 and receipt['whole_original_payload_equal'],'loader receipt')
(out/'payload.bin').write_bytes(payloads[0]);(out/'receipt.json').write_text(json.dumps(receipt,indent=2)+'\n');(out/'transactions.json.gz').write_bytes(gzip.compress(json.dumps(transactions,separators=(',',':')).encode(),mtime=0));(out/'observation.json').write_text(json.dumps({'existing_controller_sha256':hashlib.sha256(script.read_bytes()).hexdigest(),'observer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'source_compiler_output_unmodified':True,'loader_generated_payload':True,'programdata_payload_copies_observed':len(payloads),'transactions':len(transactions),'signature_fields':sum(r['signatures']for r in transactions)},indent=2)+'\n');print('Real loader:',len(transactions),'transactions',sum(r['signatures']for r in transactions),'signature fields; literal payload equal')
