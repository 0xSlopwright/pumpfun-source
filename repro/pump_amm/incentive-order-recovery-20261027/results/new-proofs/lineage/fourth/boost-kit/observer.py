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
loads={};records=[]

def load(self,program_id,path):
 p=Path(path).resolve();assert not p.name.endswith('-keypair.json')
 key=str(p)
 if key not in loads:loads[key]={'path':key,'sha256':sha(p.read_bytes())}
 result=original_load(self,program_id,path)
 if not hasattr(self,'_observed_programs'):self._observed_programs={}
 self._observed_programs[str(program_id)]=loads[key]
 return result

def sigverify(self,enabled):
 assert enabled is True,'Existing suite attempted to disable signature verification'
 return original_sigverify(self,enabled)

def send(self,tx):
 checks=tx.verify_with_results();assert checks and all(checks)
 raw=bytes(tx);programs=dict(getattr(self,'_observed_programs',{}));assert AMM in programs
 result=original_send(self,tx)
 assert bytes(tx)==raw,'Transaction mutated during forwarding'
 failed=isinstance(result,FailedTransactionMetadata);meta=result.meta()if failed else result
 logs=meta.logs()
 records.append({'sequence':len(records),'transaction_base64':base64.b64encode(raw).decode(),'transaction_sha256':sha(raw),'signature_count':len(checks),'all_signatures_verified':True,'amm_program_sha256':programs[AMM]['sha256'],'loaded_programs':programs,'error':str(result.err())if failed else None,'logs_sha256':sha(json.dumps(logs,separators=(',',':')).encode())})
 return result

LiteSVM.add_program_from_file=load
LiteSVM.with_sigverify=sigverify
LiteSVM.send_transaction=send
sys.path.insert(0,str(script.parent));sys.argv=argv
try:
 runpy.run_path(str(script),run_name='__main__')
finally:
 sidecar.parent.mkdir(parents=True,exist_ok=True)
 document={'scope':'Observed unchanged existing suite transactions. Independent cryptographic verification before unchanged LiteSVM forwarding; no private keys retained. Synthetic accounts and signing identities belong to the existing fixtures.','script_sha256':sha(script.read_bytes()),'observer_sha256':sha(Path(__file__).read_bytes()),'transactions':records,'transaction_count':len(records),'signature_count':sum(x['signature_count']for x in records),'program_file_sha256':loads}
 with sidecar.open('wb')as f:
  with gzip.GzipFile(filename='',mode='wb',fileobj=f,mtime=0)as z:z.write((json.dumps(document,separators=(',',':'))+'\n').encode())
