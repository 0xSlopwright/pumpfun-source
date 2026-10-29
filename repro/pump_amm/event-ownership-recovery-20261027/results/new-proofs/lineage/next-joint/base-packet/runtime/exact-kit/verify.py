#!/usr/bin/env python3
"""Verify saved or supplied exact-quote regression results without private workspace paths."""
import sys
sys.dont_write_bytecode=True
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json
from functools import lru_cache
from solders.transaction import Transaction
HERE=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
BASELINE='dc6891e1c846396e551a9d92008bf9c82463d8299392471934cc6578920310db'
FIXED='c77180df3b40e6e9126f1ac7b2ebbcabf0649db6fa52de77557e432227ea0b29'
SUITES=[('rounding','probe_rounding.py',112,0),('caps','probe_caps.py',207,0)]
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'

@lru_cache(maxsize=None)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 p=Path(p)
 if not p.exists()and p.suffix=='.json':p=p.with_suffix('.json.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if p.suffix=='.gz'else b)
def clean_fn():
 s=importlib.util.spec_from_file_location('native_fee_clean',HERE/'runtime/repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m.clean

def verify_inventory():
 entries=load(HERE/'manifest.json')['files'];actual={str(p.relative_to(HERE))for p in HERE.rglob('*')if p.is_file()};assert actual==set(entries)|{'manifest.json'}
 for name,item in entries.items():
  p=HERE/name;assert not p.is_symlink()and not Path(name).is_absolute()and'..'not in Path(name).parts;assert p.stat().st_size==item['bytes']and sha(p)==item['sha256'],name
 assert sha(HERE/'runtime/evidence/original/pump_amm/deployed.so')==ORIGINAL

def verify_output(candidate, directory, baseline=False):
 candidate=Path(candidate);directory=Path(directory);digest=sha(candidate);clean=clean_fn();signatures=0;runs=[];originals=[];messages=[]
 if baseline:assert digest==BASELINE
 programs={AMM:None, 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so', 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so', 'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so', load(HERE/'runtime/evidence/upstream/pump.json')['address']:'evidence/original/pump/deployed.so'}
 for label,producer,count,negative in SUITES:
  report=load(directory/(label+'.json'));observed=load(directory/(label+'-transactions.json.gz'));rows=report['cases'];receipts=observed['transactions'];assert report['candidate_sha256']==digest and report['original_sha256']==ORIGINAL;assert len(rows)==report['case_count']==count and len(receipts)==count*2;assert observed['script_sha256']==sha(HERE/'runtime/probes/exact-quote'/producer)==report['producer_sha256'];assert observed['observer_sha256']==sha(HERE/'runtime/observe_suite.py');bad=[]
  for i,row in enumerate(rows):
   a,b=clean(row['original']),clean(row['candidate']);diff=[k for k in a if a[k]!=b.get(k)];assert diff==row['mismatched_fields']
   if diff:bad.append(i)
   pair=receipts[2*i:2*i+2];assert pair[0]['transaction_sha256']==pair[1]['transaction_sha256'];assert pair[0]['before']==pair[1]['before'];assert pair[0]['after']==pair[1]['after']
   for side,receipt in zip(['original','candidate'],pair):
    raw=base64.b64decode(receipt['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and receipt['all_signatures_verified'];assert len(checks)==receipt['signature_count']==len(tx.signatures);assert hashlib.sha256(raw).hexdigest()==receipt['transaction_sha256'];assert receipt['amm_program_sha256']==(ORIGINAL if side=='original'else digest);assert receipt['error']==row[side]['error'];assert receipt['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest();assert receipt['before'].keys()==receipt['after'].keys();assert receipt['before']
    for phase in ['before','after']:
     for account in receipt[phase].values():assert account is None or(set(account)=={'data','owner','lamports','executable','rentEpoch'}and account['executable']is False)
    for program_id,loaded in receipt['loaded_programs'].items():
     assert program_id in programs
     expected_hash=receipt['amm_program_sha256']if program_id==AMM else sha(HERE/'runtime'/programs[program_id]);assert loaded['sha256']==expected_hash
    assert receipt['loaded_programs'][AMM]['sha256']==receipt['amm_program_sha256']
    for phase in ['before','after']:
     snap=row[side].get('account_snapshots',{}).get(phase)
     if snap is not None:assert snap==receipt[phase]
     for key,account in row[side].get(phase,{}).items():
      if key not in receipt[phase]:continue
      captured=receipt[phase][key]
      if account is None:assert captured is None
      else:assert captured is not None and account['data_hex']==bytes(captured['data']).hex()and account['lamports']==captured['lamports']and account['owner']==captured['owner']
    signatures+=len(checks)
   originals.append(row['original']);messages.append(pair[0]['transaction_sha256'])
  assert len(bad)==report['mismatch_count']==(negative if baseline else 0),(label,bad)
  runs.append({'suite':label,'cases':count,'mismatches':len(bad)})
 return {'candidate_sha256':digest,'runs':runs,'signatures_verified':signatures,'originals':originals,'messages':messages}

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path);p.add_argument('--reports',type=Path);p.add_argument('--baseline',action='store_true');p.add_argument('--output',type=Path);a=p.parse_args();verify_inventory()
 if a.candidate or a.reports:
  assert a.candidate and a.reports;r=verify_output(a.candidate,a.reports,a.baseline);r={k:v for k,v in r.items()if k not in ['originals','messages']}
 else:
  x=verify_output(HERE/'elf/baseline.so',HERE/'observations/baseline',True);y=verify_output(HERE/'elf/fixed.so',HERE/'observations/fixed');assert x['originals']==y['originals']and x['messages']==y['messages']
  r={'profiles':[{k:v for k,v in q.items()if k not in ['originals','messages']}for q in [x,y]],'original_results_and_messages_identical':True}
 r['manifest_sha256']=sha(HERE/'manifest.json');r['full_nonexecutable_account_metadata_checked']=True;r['executes_sbf']=False;text=json.dumps(r,indent=2)+'\n'
 if a.output:
  assert HERE not in a.output.resolve().parents;a.output.write_text(text)
 print(text,end='')
if __name__=='__main__':main()
