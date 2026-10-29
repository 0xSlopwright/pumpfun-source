#!/usr/bin/env python3
"""Exercise canonical create quote policy through an unchanged saved signed Pump CPI.
Prefunded quote ATAs let malformed or extended classic-mint data reach AMM policy.
Allowed extended mints then fail inside the classic-token transfer, after policy.
"""
from pathlib import Path
import argparse,hashlib,importlib.util,json,struct,sys
ROOT=next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file());spec=importlib.util.spec_from_file_location('supported_mint_probe',Path(__file__).with_name('probe_mint_policy.py'));p=importlib.util.module_from_spec(spec);spec.loader.exec_module(p)
sys.path.insert(0,str(ROOT/'scripts'));import pump_amm_migration_create_differential as h
sha=lambda f:hashlib.sha256(Path(f).read_bytes()).hexdigest()
CASES=[('plain',[],True),('metadata',[(18,bytes(64))],True),('transfer-fee-minimum',[(1,bytes(108))],True),('transfer-fee-short',[(1,bytes(107))],False),('default-initialized',[(6,b'\1')],True),('default-frozen',[(6,b'\2')],False),('hook-disabled',[(14,bytes(64))],True),('hook-enabled',[(14,bytes(32)+bytes([1])*32)],False),('tag25',[(25,b'')],True),('tag26',[(26,b'')],True),('duplicate-metadata',[(18,bytes(64)),(18,bytes(64))],False),('unknown27',[(27,b'')],False)]
def override(entries):
 def apply(vm,keys):
  for account,owner in [('associated_quote_bonding_curve','bonding_curve'),('pool_authority_quote_account','pool_authority'),('pool_quote_token_account','pool')]:vm.set_account(keys[account],h.Account(2039280,h.token(keys['quote_mint'],keys[owner],0,True),h.TOKEN))
  if entries:
   key=keys['quote_mint'];old=vm.get_account(key);tlv=b''.join(struct.pack('<HH',kind,len(body))+body for kind,body in entries);vm.set_account(key,h.Account(old.lamports,bytes(old.data[:82])+bytes(83)+b'\1'+tlv,old.owner))
 return apply

def after_policy(result):
 logs=result['logs'];indices=[i for i,line in enumerate(logs)if 'Instruction: CreatePool' in line];assert len(indices)==1
 return any('Instruction: TransferChecked' in line for line in logs[indices[0]+1:])
def main():
 parser=argparse.ArgumentParser()
 for k in ['candidate','build-record','output']:parser.add_argument('--'+k,type=Path,required=True)
 a=parser.parse_args();a.candidate=a.candidate.resolve();a.output=a.output.resolve();assert not a.output.exists();br=json.loads(a.build_record.read_text());assert br['returncode']==0 and br['source_unchanged'] and br['comparison']['candidate_sha256']==sha(a.candidate);rows=[]
 for name,entries,allowed in CASES:
  results=[];signed=[]
  for binary in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
   start=len(p.receipts);results.append(h.run_migration(binary,overrides=override(entries)));assert len(p.receipts)==start+1;signed.append(p.receipts[-1])
  x,y=results;rx,ry=signed;assert rx['transaction_base64']==ry['transaction_base64']and rx['before']==ry['before'];assert after_policy(x)==allowed,(name,x['error'])
  cx,cy=p.normalizer.clean(x),p.normalizer.clean(y);diff=[k for k in cx if cx[k]!=cy[k]]
  if rx['after']!=ry['after']:diff.append('full_account_snapshot')
  rows.append({'case':name,'expected_policy_allows':allowed,'original_passed_policy':after_policy(x),'candidate_passed_policy':after_policy(y),'original':x,'candidate':y,'original_signed':rx,'candidate_signed':ry,'mismatched_fields':diff});print(json.dumps({'case':name,'allowed':allowed,'original_error':x['error'],'candidate_error':y['error'],'differences':diff}),flush=True)
 r={'scope':__doc__,'candidate_sha256':sha(a.candidate),'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'build_record_sha256':sha(a.build_record),'producer_sha256':sha(__file__),'signed_capture_producer_sha256':sha(Path(__file__).with_name('probe_mint_policy.py')),'harness_sha256':sha(h.__file__),'log_normalizer_sha256':sha(ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'),'case_count':len(rows),'transaction_count':len(p.receipts),'signature_count':sum(len(s['signature_verification'])for s in p.receipts),'mismatches':[i for i,row in enumerate(rows)if row['mismatched_fields']],'cases':rows};a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print(json.dumps({k:r[k]for k in ['case_count','transaction_count','signature_count','mismatches']}));raise SystemExit(bool(r['mismatches']))
if __name__=='__main__':main()
