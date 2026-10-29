"""Verify the preserved9-case malformed-state counterexample without running a VM."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys,types
from solders.transaction import Transaction
sys.dont_write_bytecode=True
CANDIDATE='e97b3900800d4378486d9b1f7df040e6b7a57d34b31a9470a5f5eb3a9d2fb24b'
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
DEPENDENCIES={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'8190d3f7ceb6cb7a7a8d8924bff89f9f611e15ce1f806f2b6237f3311a98f697','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'15a2e615a42e20f31714bbaaee43002ae6f1cda2e8d7118243117ab3c1342e2d','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'4f2955d0f6b40cc9ff7daa18ccad7d19119ba1249759f4e7e3bb691beee6b35e','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'6804554e69fd3a58caa191dc4a58f4c67223d30ca28ab8987f39fc18d2f7374d'}
def digest(data):return hashlib.sha256(data).hexdigest()
def sha(path):return digest(Path(path).read_bytes())
def load(path):
 b=Path(path).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify(directory,candidate=None):
 d=Path(directory);candidate=Path(candidate)if candidate else d/'candidate.so';files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and'__pycache__'not in p.parts and p!=d/'manifest.json'};assert files==load(d/'manifest.json')['files'];assert sha(candidate)==CANDIDATE
 cleaner=types.ModuleType('cleaner');cleaner.__file__=str(d/'cleaner.py');exec(compile((d/'cleaner.py').read_bytes(),str(d/'cleaner.py'),'exec'),cleaner.__dict__)
 report,observed=load(d/'report.json.gz'),load(d/'transactions.json.gz');assert report['candidate_sha256']==CANDIDATE and report['original_sha256']==ORIGINAL;assert report['producer_sha256']==observed['script_sha256']==sha(d/'producer.py');assert observed['observer_sha256']==sha(d/'observer.py');assert len(report['cases'])==report['case_count']==9 and len(observed['transactions'])==observed['transaction_count']==18
 expected=[(f,o)for f in ['buy','buy_exact_quote_in','sell']for o in ['sorted','reverse','rotate']];bad=[];sigs=0
 for i,row in enumerate(report['cases']):
  family,order=expected[i];assert row['case']=={'family':family,'order':order};a,b=row['original'],row['candidate'];assert a['before']==b['before']and a['transaction_base64']==b['transaction_base64'];aa,bb=cleaner.clean(a),cleaner.clean(b);diff=[k for k in aa if aa[k]!=bb.get(k)];assert diff==row['mismatched_fields']
  if diff:bad.append(i)
  if order=='sorted':assert not diff and a['error']is b['error']is None
  else:assert 'InstructionErrorCustom(6013)'in a['error']and b['error']is None and a['after']!=b['after']
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=observed['transactions'][i*2+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified'];assert len(checks)==t['signature_count']==1;sigs+=1;assert digest(raw)==t['transaction_sha256']and t['transaction_base64']==q['transaction_base64'];assert t['amm_program_sha256']==(ORIGINAL if side=='original'else CANDIDATE);assert t['loaded_programs'][AMM]['sha256']==t['amm_program_sha256'];assert t['logs_sha256']==digest(json.dumps(q['logs'],separators=(',',':')).encode());assert t['error']==q['error']
   assert set(q['before'])==set(q['after']);keys=set(map(str,tx.message.account_keys));extra=set(q['before'])-keys;assert extra<= {'8NyBnxo9mS5MsqY4qoKmrt7MS89d7MNV6rh5fu2YsQPT'};assert all(q['before'][key]==q['after'][key]for key in extra);assert keys-set(q['before'])<=set(t['loaded_programs'])|{'11111111111111111111111111111111'}
   assert set(list(DEPENDENCIES)[:3])<=set(t['loaded_programs'])
   for program,info in t['loaded_programs'].items():assert info['sha256']==(t['amm_program_sha256']if program==AMM else DEPENDENCIES[program])
   assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert str(tx.message.account_keys[ix.program_id_index])==AMM;global_key=str(tx.message.account_keys[ix.accounts[2]]);recipient=bytes(tx.message.account_keys[ix.accounts[9]]);data=bytes.fromhex(q['before'][global_key]['data_hex']);array=[data[k:k+32]for k in range(57,313,32)];assert len(set(array))==8 and recipient in array;ordered=sorted(array);assert array==(ordered if order=='sorted'else list(reversed(ordered))if order=='reverse'else ordered[1:]+ordered[:1])
 assert bad==[1,2,4,5,7,8]and report['mismatch_count']==6 and sigs==observed['signature_count']==18
 return {'verified':True,'candidate_sha256':CANDIDATE,'cases':9,'verified_signatures':18,'mismatch_indices':bad,'sorted_success_controls':3,'scope':'Synthetic malformed normal-recipient ordering states; current setters enforce sorting. No reachable exploit or accepted chain state is asserted.','executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
