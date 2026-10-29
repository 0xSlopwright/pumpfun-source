#!/usr/bin/env python3
"""Verify the immutable saved transfer-fee proof; this command does not execute SBF."""
import sys
sys.dont_write_bytecode = True
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction
HERE=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
CANDIDATES={
 'published':('elf/published-5cd.so','5cd7879af0d9733d1f7d3847be46aa4c5ff214fca2250d1c69d03c49cbc85d1a',20),
 'first-fix':('elf/first-fix-7673.so','767345f7b302549281a6564d90a33fd3d3e95950b06442c6e15dcb47cd15b093',0),
 'integrated':('elf/integrated-5c1e.so','5c1e8b18ead27d0b3c1840f37b24ef5044adb65e2a3a566d5be7694ff8737c05',0),
}
NEGATIVE_INDICES=[12,13,14,15,16,17,28,29,30,31,32,33,34,35,36,37,38,39,56,57]
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
PROGRAMS={AMM:None,
 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'runtime/evidence/dependencies/spl_token/deployed.so',
 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'runtime/evidence/dependencies/spl_token_2022/deployed.so',
 'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'runtime/evidence/original/pump_fees/deployed.so'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 p=Path(p);b=p.read_bytes();return json.loads(gzip.decompress(b)if p.suffix=='.gz'else b)
def cleaner():
 p=HERE/'runtime/repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';s=importlib.util.spec_from_file_location('packet_cleaner',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m.clean

def verify_run(label, report_path, receipt_path):
 clean=cleaner();report=load(report_path);observed=load(receipt_path);elf,digest,expected=CANDIDATES[label]
 assert sha(HERE/elf)==digest==report['candidate_sha256']
 assert report['original_sha256']==ORIGINAL
 producer=HERE/'runtime/probes/transfer-fee/probe_decoder.py';observer=HERE/'runtime/observe_suite.py'
 assert report['producer_sha256']==sha(producer)==observed['script_sha256']
 assert observed['observer_sha256']==sha(observer)
 assert report['comparator_sha256']==sha(HERE/'runtime/repro/pump_amm/diagnostic-parity-20261027/compare_direct.py')
 assert report['case_count']==len(report['cases'])==58
 receipts=observed['transactions'];assert observed['transaction_count']==len(receipts)==116
 signatures=0;failures=[];originals=[];wire=[]
 expected_file_hashes={ORIGINAL,digest,*[sha(HERE/p)for p in PROGRAMS.values()if p]}
 assert {v['sha256']for v in observed['program_file_sha256'].values()}==expected_file_hashes
 for index,row in enumerate(report['cases']):
  left,right=clean(row['original']),clean(row['candidate']);assert set(left)==set(right)
  diff=[k for k in left if left[k]!=right[k]];assert diff==row['mismatched_fields']
  if diff:failures.append(index)
  assert row['original']['account_snapshots']['before']==row['candidate']['account_snapshots']['before']
  pair=receipts[2*index:2*index+2];assert pair[0]['transaction_sha256']==pair[1]['transaction_sha256'];wire.append(pair[0]['transaction_sha256'])
  for side,receipt in zip(['original','candidate'],pair):
   assert receipt['sequence']==2*index+(side=='candidate')
   raw=base64.b64decode(receipt['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results()
   assert checks and all(checks) and receipt['all_signatures_verified'] is True
   assert receipt['signature_count']==len(checks)==len(tx.signatures)
   assert hashlib.sha256(raw).hexdigest()==receipt['transaction_sha256']
   assert receipt['amm_program_sha256']==(ORIGINAL if side=='original'else digest)
   assert receipt['error']==row[side]['error']
   assert receipt['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
   assert set(receipt['loaded_programs'])==set(PROGRAMS)
   for pid,path in PROGRAMS.items():
    expected_hash=receipt['amm_program_sha256'] if pid==AMM else sha(HERE/path)
    assert receipt['loaded_programs'][pid]['sha256']==expected_hash
   snapshot=row[side]['account_snapshots'];assert snapshot['before'].keys()==snapshot['after'].keys() and snapshot['before']
   for phase in ['before','after']:
    for account in snapshot[phase].values():
     assert account is None or (set(account)=={'lamports','data','owner','executable','rentEpoch'} and account['executable'] is False)
   for key,state in row[side]['states'].items():
    account=snapshot['after'][key]
    if account is None:assert state['data_hex'] is None and state['owner'] is None and state['lamports']==0
    else:assert bytes(account['data']).hex()==state['data_hex'] and account['lamports']==state['lamports'] and account['owner']==state['owner']
   signatures+=len(checks)
  originals.append({'case':row['case'],'minimum':row['minimum'],'result':row['original']})
 assert len(failures)==report['mismatch_count']==expected
 assert failures==(NEGATIVE_INDICES if label=='published'else[])
 assert observed['signature_count']==signatures==116
 return {'label':label,'candidate_sha256':digest,'cases':58,'mismatches':expected,'signatures_verified':signatures,'originals':originals,'wire':wire}

def verify_inventory():
 manifest=load(HERE/'manifest.json');files=manifest['files']
 actual={str(p.relative_to(HERE))for p in HERE.rglob('*')if p.is_file()}
 assert actual==set(files)|{'manifest.json'},'Packet file inventory differs from manifest'
 for name,metadata in files.items():
  rel=Path(name);assert not rel.is_absolute() and '..'not in rel.parts
  p=HERE/rel;assert p.is_file() and not p.is_symlink()
  assert p.stat().st_size==metadata['bytes'] and sha(p)==metadata['sha256'],name
 assert sha(HERE/'runtime/evidence/original/pump_amm/deployed.so')==ORIGINAL
 for path,digest,_ in CANDIDATES.values():assert sha(HERE/path)==digest
 return manifest

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--output',type=Path);a=p.parse_args();verify_inventory();runs=[];reference=None;wire=None
 for label in CANDIDATES:
  run=verify_run(label,HERE/'observations'/(label+'.json.gz'),HERE/'observations'/(label+'-transactions.json.gz'))
  if reference is None:reference,wire=run['originals'],run['wire']
  else:assert run['originals']==reference and run['wire']==wire,'Original results or transaction messages drifted across runs'
  runs.append({k:v for k,v in run.items()if k not in ['originals','wire']})
 report={'manifest_sha256':sha(HERE/'manifest.json'),'runs':runs,'signatures_verified':sum(r['signatures_verified']for r in runs),'original_results_identical_across_runs':True,'transaction_messages_identical_across_runs':True,'all_nonexecutable_message_account_fields_checked':True,'executes_sbf':False,'claim':'Bounded saved execution evidence; no whole-program or byte-identity claim.'}
 encoded=json.dumps(report,indent=2)+'\n'
 if a.output:
  assert HERE not in a.output.resolve().parents,'Write the report outside the immutable packet'
  a.output.write_text(encoded)
 print(encoded,end='')
if __name__=='__main__':main()
