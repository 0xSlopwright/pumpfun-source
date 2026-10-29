"""Portable saved-proof verifier for the 554-case signed AMM accrual suite."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def hb(b):return hashlib.sha256(b).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
DEPENDENCIES={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': '8190d3f7ceb6cb7a7a8d8924bff89f9f611e15ce1f806f2b6237f3311a98f697', 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb': '15a2e615a42e20f31714bbaaee43002ae6f1cda2e8d7118243117ab3c1342e2d', 'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ': '4f2955d0f6b40cc9ff7daa18ccad7d19119ba1249759f4e7e3bb691beee6b35e', 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': '6804554e69fd3a58caa191dc4a58f4c67223d30ca28ab8987f39fc18d2f7374d', '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P': '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'}
def verify(directory,candidate):
 d=Path(directory);candidate=Path(candidate);manifest=load(d/'manifest.json');assert set(manifest['files'])=={str(p.relative_to(d))for p in d.rglob('*')if p.is_file()and '__pycache__'not in p.parts and p.name!='manifest.json'}
 for rel,hash in manifest['files'].items():assert H(d/rel)==hash,rel
 spec=importlib.util.spec_from_file_location('portable_clean',d/'producers/cleaner.py');cleaner=importlib.util.module_from_spec(spec);spec.loader.exec_module(cleaner)
 total=sigs=success=0;summaries=[]
 for name,count in [('endpoint',100),('routes',32),('edges',350),('large',72)]:
  r=load(d/(name+'.json.gz'));o=load(d/(name+'-transactions.json.gz'));assert r['candidate_sha256']==H(candidate)and r['original_sha256']==ORIGINAL;assert r['producer_sha256']==H(d/'producers'/(name+'.py'))==o['script_sha256'];assert o['observer_sha256']==H(d/'producers/observer.py');assert len(r['cases'])==r['case_count']==count;assert len(o['transactions'])==o['transaction_count']==2*count
  if 'imported_core_sha256'in r:assert r['imported_core_sha256']==H(d/'producers/edges.py')
  for i,row in enumerate(r['cases']):
   a,b=row['original'],row['candidate'];assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];aa,bb=map(cleaner.clean,[a,b]);diff=[k for k in aa if aa[k]!=bb.get(k)];assert diff==row['mismatched_fields']==[];success+=a['error']is None
   for j,side in enumerate(['original','candidate']):
    t=o['transactions'][2*i+j];q=row[side];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified'];assert len(checks)==t['signature_count'];sigs+=len(checks);assert hb(raw)==t['transaction_sha256'];assert t['transaction_base64']==q['transaction_base64'];assert t['amm_program_sha256']==r[side+'_sha256'];assert t['logs_sha256']==hb(json.dumps(q['logs'],separators=(',',':')).encode());assert set(q['before'])==set(q['after']);keys=set(map(str,tx.message.account_keys));assert not set(q['before'])-keys;assert keys-set(q['before'])<=set(t['loaded_programs'])|{'11111111111111111111111111111111'}
    for pid,digest in DEPENDENCIES.items():assert t['loaded_programs'][pid]['sha256']==digest
  assert r['mismatch_count']==0;assert o['signature_count']==2*count;total+=count;summaries.append({'suite':name,'cases':count})
 assert total==554 and sigs==1108
 return {'verified':True,'candidate_sha256':H(candidate),'cases':total,'signed_transactions':1108,'verified_signatures':sigs,'original_successes':success,'mismatches':0,'suites':summaries,'executes_runtime':False,'scope':'Re-decodes saved signatures, binds loaded artifacts/logs, compares full recorded non-executable states and all normalized result fields.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--expected-seal');a=p.parse_args()
 if a.expected_seal:assert H(a.directory/'manifest.json')==a.expected_seal
 print(json.dumps(verify(a.directory,a.candidate),indent=2))
