#!/usr/bin/env python3
"""Read-only verification of eight saved negative CTO observations; no runtime execution."""
from pathlib import Path,PurePosixPath
import argparse,base64,gzip,hashlib,json
from solders.pubkey import Pubkey
from solders.transaction import Transaction
D=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
BASELINE='f5ef6ebbb2c4139a4d6e785b51a692f40ba53dc79a66b6834b2830d57868fa33'
ORACLE='032501e4eeafa495610628d70748374a179b0eb32aceb991363c5811846d46fb'
PUMP='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(directory=D,expected_seal=None):
 d=Path(directory).resolve();manifest=json.loads((d/'manifest.json').read_bytes())
 if expected_seal is not None:assert sha(d/'manifest.json')==expected_seal
 actual={str(p.relative_to(d))for p in d.rglob('*')if p.is_file()};assert actual==set(manifest['files'])|{'manifest.json'}
 for name,digest in manifest['files'].items():
  rel=PurePosixPath(name);assert not rel.is_absolute()and '..'not in rel.parts;assert not(d/name).is_symlink()and sha(d/name)==digest,name
 assert sha(d/'baseline-candidate.so')==BASELINE and sha(d/'original-amm.so')==ORIGINAL and sha(d/'oracle.so')==ORACLE
 r=json.loads((d/'observations.json').read_bytes());obs=json.loads(gzip.decompress((d/'transactions.json.gz').read_bytes()));rows=obs['transactions'];assert r['case_count']==len(r['cases'])==8 and len(rows)==obs['transaction_count']==16
 assert r['original_sha256']==ORIGINAL and r['candidate_sha256']==BASELINE and r['oracle_sha256']==ORACLE;assert r['script_sha256']==obs['script_sha256']==sha(d/'producer.py');assert obs['observer_sha256']==sha(d/'observer.py')
 wrong=[];errors=0;after=0;signatures=0;pool_authority=Pubkey.find_program_address([b'pool-authority',bytes([61])*32],Pubkey.from_string(PUMP))[0]
 for i,case in enumerate(r['cases']):
  l,c=case['original'],case['candidate'];assert l['reached_amm']and c['reached_amm'];diff=[k for k in l if k!='logs'and l[k]!=c[k]];assert diff==case['diff'];errors+=l['error']!=c['error'];after+=l['after']!=c['after'];wrong.extend([i]if diff else[]);txs=[]
  for j,row in enumerate(rows[2*i:2*i+2]):
   side=l if j==0 else c;raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count']==1;signatures+=len(checks);txs.append(tx)
   assert pool_authority not in tx.message.account_keys[:tx.message.header.num_required_signatures]
   assert str(tx.message.account_keys[tx.message.instructions[1].program_id_index])==PUMP
   assert row['loaded_programs'][PUMP]['sha256']==ORACLE and row['loaded_programs'][AMM]['sha256']==(ORIGINAL if j==0 else BASELINE);assert set(row['loaded_programs'])=={PUMP,AMM}
   assert row['amm_program_sha256']==(ORIGINAL if j==0 else BASELINE)and row['error']==side['error'];assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest()
  assert bytes(txs[0].message)==bytes(txs[1].message)
 assert wrong==r['mismatches']==[3,4,5,6,7]and errors==2 and after==0
 provenance=json.loads((d/'oracle-provenance.json').read_bytes());assert provenance['source_sha256']==sha(d/'oracle.rs')and provenance['oracle_sha256']==ORACLE;assert 'historical' in provenance['snapshot_scope'].lower()
 inputs=json.loads((d/'input-snapshots.json').read_bytes())
 for name,digest in inputs.items():assert sha(d/'inputs'/name)==digest
 return {'verified':True,'cases':8,'amm_entries':8,'mismatches':5,'trace_only_differences':3,'wrong_errors':2,'after_state_differences':0,'transactions_verified':16,'signatures_verified':signatures,'raw_log_hashes_verified':16,'baseline_sha256':BASELINE,'oracle_sha256':ORACLE,'scope':'Synthetic Pump dependency substitution using normal signatures and invoke_signed PDA rules; no captured-Pump/live reachability or mutation claim. Oracle cache inventory is historical metadata, not current-cache validation.'}
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--directory',type=Path,default=D);p.add_argument('--expected-seal');a=p.parse_args();print(json.dumps(verify(a.directory,a.expected_seal),indent=2))
