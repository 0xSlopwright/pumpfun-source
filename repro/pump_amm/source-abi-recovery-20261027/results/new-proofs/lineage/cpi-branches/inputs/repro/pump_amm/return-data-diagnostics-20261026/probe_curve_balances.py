#!/usr/bin/env python3
"""Observe source/destination diagnostics using explicit synthetic nonzero curve returns."""
import argparse,base64,hashlib,json,os,struct,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3];sys.path.insert(0,str(ROOT/'scripts'));sys.dont_write_bytecode=True;os.environ['PUMP_AMM_FRESH_VM']='1'
import pump_amm_multi_hop_differential as multi
from solders.account import Account
from solders.transaction import Transaction
MAGIC=b'AMM_RETURN_ORACLE_V1'
VALUES=[(0,0),(1,0),(0,1),(1,1),(1000,0),(0,1000),(1000,1000),(2**64-1,0),(0,2**64-1),(2**64-1,2**64-1)]
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__)
 for n in ['candidate','candidate_record','oracle','oracle_record','output']:p.add_argument('--'+n.replace('_','-'),type=Path,required=True)
 a=p.parse_args();assert not a.output.exists()
 for record,elf in [(a.candidate_record,a.candidate),(a.oracle_record,a.oracle)]:
  b=json.loads(record.read_text());assert b['source_unchanged']and b['returncode']==0 and b['comparison']['candidate_sha256']==sha(elf)
  for path,digest in b['source_sha256'].items():assert sha(ROOT/path)==digest
 rows=[]
 for sell in [False,True]:
  for output,buyback in VALUES:
   payload=struct.pack('<QQ',output,buyback);control=MAGIC+b'\1'+struct.pack('<H',len(payload))+payload;pair=[]
   for elf in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
    def override(h,m):
     multi.curve_route(sell)(h,m);key=m[14].pubkey;old=h.vm.get_account(key);h.vm.set_account(key,Account(old.lamports,bytes(old.data)+control,old.owner,old.executable,old.rent_epoch));h.vm.add_program_from_file(multi.PUMP,a.oracle)
    r=multi.run(amount=1000,limit=1,sell=sell,overrides=override,candidate=elf)
    tx=Transaction.from_bytes(base64.b64decode(r['transaction_base64']));assert all(tx.verify_with_results());r['signature_verification']=tx.verify_with_results()
    assert [x for x in r['logs']if'SYNTHETIC_RETURN_ORACLE'in x]==['Program log: SYNTHETIC_RETURN_ORACLE mode=1 length=16'];pair.append(r)
   x,y=pair;assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64']
   rows.append({'suite':'curve_sell'if sell else'curve_buy','amount_out':output,'buyback':buyback,'control_hex':control.hex(),'original':x,'candidate':y,'differences':[k for k in x if x[k]!=y[k]]})
 result={'scope':__doc__,'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(a.candidate),'candidate_record_sha256':sha(a.candidate_record),'synthetic_oracle_sha256':sha(a.oracle),'oracle_record_sha256':sha(a.oracle_record),'producer_sha256':sha(__file__),'case_count':len(rows),'signed_executions':2*len(rows),'cases':rows}
 a.output.write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({'cases':len(rows),'signed_executions':2*len(rows)}))
if __name__=='__main__':main()
