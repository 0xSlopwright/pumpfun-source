#!/usr/bin/env python3
"""Observations with an explicitly synthetic local CPI dependency; no equivalence claim."""
import argparse,base64,hashlib,json,os,struct,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'scripts'));os.environ['PUMP_AMM_FRESH_VM']='1';sys.dont_write_bytecode=True
import pump_amm_legacy_buy_differential as buy
import pump_amm_legacy_sell_differential as sell
import pump_amm_multi_hop_differential as multi
from solders.transaction import Transaction
from solders.account import Account
MAGIC=b'AMM_RETURN_ORACLE_V1'
LENGTHS=[0,1,7,8,15,16,17,23,24,25,31,32]
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__)
 for key in ['candidate','candidate_build_record','oracle','oracle_build_record','output']:p.add_argument('--'+key.replace('_','-'),type=Path,required=True)
 a=p.parse_args();assert not a.output.exists()
 record=json.loads(a.oracle_build_record.read_text());assert record['source_unchanged'] and record['returncode']==0
 assert record['comparison']['candidate_sha256']==sha(a.oracle)
 assert record['selected_toolchain']=='v1.44'
 assert record['source_sha256'] and any(x.endswith('/src/lib.rs') for x in record['source_sha256'])
 for name,digest in record['source_sha256'].items():assert sha(ROOT/name)==digest
 candidate_record=json.loads(a.candidate_build_record.read_text());assert candidate_record['source_unchanged'] and candidate_record['returncode']==0
 assert candidate_record['comparison']['candidate_sha256']==sha(a.candidate)
 rows=[]
 for suite in ['buy','buy_exact_quote_in','sell','curve_buy','curve_sell']:
  curve=suite.startswith('curve_');valid=struct.pack('<QQ',0,0)if curve else struct.pack('<QQQ',20,5,0)
  for length in [None]+LENGTHS:
   payload=b'x' if length is None else (valid+bytes(max(0,length-len(valid))))[:length]
   control=MAGIC+bytes([0 if length is None else 1])+struct.pack('<H',len(payload))+payload
   observations=[]
   for elf in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
    def override(h,m):
     if curve:multi.curve_route(suite=='curve_sell')(h,m)
     key=m[14].pubkey if curve else sell.feeconfig
     acct=h.vm.get_account(key);assert acct is not None
     h.vm.set_account(key,Account(acct.lamports,bytes(acct.data)+control,acct.owner,acct.executable,acct.rent_epoch))
     h.vm.add_program_from_file(multi.PUMP if curve else sell.FEES,a.oracle)
    if curve:r=multi.run(amount=1000,limit=1,sell=suite=='curve_sell',overrides=override,candidate=elf)
    elif suite=='sell':r=sell.legacy(amount=10**7,limit=0,overrides=override,candidate=elf)
    else:r=buy.legacy_buy(name=suite,amount=10**7,limit=10**12 if suite=='buy' else 1,overrides=override,candidate=elf)
    tx=Transaction.from_bytes(base64.b64decode(r['transaction_base64']));assert all(tx.verify_with_results());r['signature_verification']=tx.verify_with_results()
    oracle_logs=[x for x in r['logs']if 'SYNTHETIC_RETURN_ORACLE' in x];assert len(oracle_logs)==1,(suite,length,elf,r['logs'])
    r['oracle_log']=oracle_logs[0];observations.append(r)
   x,y=observations;assert x['transaction_base64']==y['transaction_base64'];assert x['before']==y['before']
   row={'suite':suite,'length':length,'mode':'no_set_return_data' if length is None else 'set_return_data','control_hex':control.hex(),'original':x,'candidate':y,'differences':[k for k in x if x[k]!=y[k]]};rows.append(row)
   print(suite,length,x['error'],y['error'],flush=True)
 report={'scope':__doc__,'genuine_original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'genuine_candidate_sha256':sha(a.candidate),'candidate_build_record_sha256':sha(a.candidate_build_record),'synthetic_oracle_sha256':sha(a.oracle),'oracle_build_record_sha256':sha(a.oracle_build_record),'probe_sha256':sha(__file__),'case_count':len(rows),'signed_executions':2*len(rows),'cases':rows,'note':'Synthetic dependency substituted only in local LiteSVM at FEES/PUMP IDs. No RPC or deployed-program mutation. All AMM executable bytes unchanged. Differences are observations, not failed equivalence assertions.'}
 a.output.write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps({'case_count':len(rows),'signed_executions':2*len(rows),'output':str(a.output)}))
if __name__=='__main__':main()
