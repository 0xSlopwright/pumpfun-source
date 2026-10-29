#!/usr/bin/env python3
"""Run the unchanged sweep suite and retain its previously omitted full logs."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,runpy,sys
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
ROOT=Path(__file__).resolve().parents[2];D=Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();rawpath=a.output.with_name('existing-raw.json');assert not a.output.exists()and not rawpath.exists()
actual=LiteSVM.send_transaction;captures=[]
def snap(vm,keys):
 out={}
 for key in sorted(set(keys),key=str):
  acc=vm.get_account(key)
  if acc is not None and acc.executable:continue
  out[str(key)]=None if acc is None else {'data':bytes(acc.data).hex(),'lamports':acc.lamports,'owner':str(acc.owner)}
 return out
def send(vm,tx):
 raw=bytes(tx);assert all(tx.verify_with_results());before=snap(vm,tx.message.account_keys);result=actual(vm,tx);assert raw==bytes(tx);meta=result.meta()if isinstance(result,FailedTransactionMetadata)else result
 captures.append({'logs':meta.logs(),'tx_sha256':hashlib.sha256(raw).hexdigest(),'before':before,'after':snap(vm,tx.message.account_keys)});return result
LiteSVM.send_transaction=send
script=ROOT/'scripts/pump_amm_sweep_differential.py';sys.argv=[str(script),'--candidate',str(a.candidate.resolve()),'--output',str(rawpath.resolve())];code=0
try:runpy.run_path(str(script),run_name='__main__')
except SystemExit as e:code=e.code or 0
report=json.loads(rawpath.read_text());assert len(captures)==2*report['case_count']
for i,row in enumerate(report['cases']):
 for j,side in enumerate(['original','candidate']):
  rec=captures[2*i+j];row[side]['logs']=rec['logs'];row[side+'_receipt']={k:v for k,v in rec.items()if k!='logs'}
report['full_diagnostic_adapter_sha256']=hashlib.sha256(Path(__file__).read_bytes()).hexdigest();report['original_suite_sha256']=hashlib.sha256(script.read_bytes()).hexdigest()
with gzip.GzipFile(filename='',fileobj=a.output.open('wb'),mode='wb',mtime=0)as f:f.write((json.dumps(report,separators=(',',':'))+'\n').encode())
raise SystemExit(code)
