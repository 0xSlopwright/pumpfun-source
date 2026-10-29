#!/usr/bin/env python3
"""Observe curve source arithmetic at input-token balance boundaries."""
import argparse,base64,hashlib,importlib.util,json,struct
from pathlib import Path
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
spec=importlib.util.spec_from_file_location('curve_probe_base',ROOT/'repro/pump_amm/return-data-diagnostics-20261026/probe_curve_balances.py');base=importlib.util.module_from_spec(spec);spec.loader.exec_module(base)
VALUES=[(10**15,0),(10**15,1),(10**15+1,0),(10**15+1,1),(2**64-1,0),(2**64-1,1)]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser()
 for name in ['candidate','candidate_record','oracle','oracle_record','output']:p.add_argument('--'+name.replace('_','-'),type=Path,required=True)
 a=p.parse_args();assert not a.output.exists();rows=[]
 for amount,output in VALUES:
  control=base.MAGIC+b'\1'+struct.pack('<HQQ',16,output,0);pair=[]
  for elf in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
   def override(h,m):
    base.multi.curve_route(True)(h,m);key=m[14].pubkey;old=h.vm.get_account(key);h.vm.set_account(key,base.Account(old.lamports,bytes(old.data)+control,old.owner,old.executable,old.rent_epoch));h.vm.add_program_from_file(base.multi.PUMP,a.oracle)
   r=base.multi.run(amount=amount,limit=1,sell=True,overrides=override,candidate=elf);tx=base.Transaction.from_bytes(base64.b64decode(r['transaction_base64']));assert all(tx.verify_with_results());r['signature_verification']=tx.verify_with_results();assert any('SYNTHETIC_RETURN_ORACLE'in x for x in r['logs']);pair.append(r)
  x,y=pair;assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];rows.append({'amount':amount,'amount_out':output,'control_hex':control.hex(),'original':x,'candidate':y})
 result={'candidate_sha256':sha(a.candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_record_sha256':sha(a.candidate_record),'oracle_sha256':sha(a.oracle),'oracle_record_sha256':sha(a.oracle_record),'producer_sha256':sha(Path(__file__)),'cases':rows,'scope':__doc__};a.output.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'cases':len(rows)}))
if __name__=='__main__':main()
