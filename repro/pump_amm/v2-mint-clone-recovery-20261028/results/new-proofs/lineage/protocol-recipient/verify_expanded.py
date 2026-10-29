"""Authenticate 45 signed normal/mayhem recipient cases without running a VM."""
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
PROFILES = ['normal_sorted', 'normal_reverse', 'normal_rotate', 'normal_absent', 'normal_duplicates_present', 'normal_duplicates_absent', 'mayhem_primary'] + [f'mayhem_secondary_{i}' for i in range(7)] + ['mayhem_absent']
def verify(report,transactions,candidate,producer,observer,cleaner_path,expected_bad):
 report=Path(report);candidate=Path(candidate);digest_candidate=sha(candidate)
 cleaner=types.ModuleType('cleaner');cleaner.__file__=str(cleaner_path);exec(compile(Path(cleaner_path).read_bytes(),str(cleaner_path),'exec'),cleaner.__dict__)
 report,observed=load(report),load(transactions);assert report['candidate_sha256']==digest_candidate and report['original_sha256']==ORIGINAL;assert report['producer_sha256']==observed['script_sha256']==sha(producer);assert observed['observer_sha256']==sha(observer);assert len(report['cases'])==report['case_count']==45 and len(observed['transactions'])==observed['transaction_count']==90
 expected=[(f,p)for f in ['buy','buy_exact_quote_in','sell']for p in PROFILES];bad=[];sigs=0;successes=0;messages=[];originals=[]
 for i,row in enumerate(report['cases']):
  family,profile=expected[i];assert row['case']=={'family':family,'profile':profile};a,b=row['original'],row['candidate'];assert a['before']==b['before']and a['transaction_base64']==b['transaction_base64'];aa,bb=cleaner.clean(a),cleaner.clean(b);diff=[k for k in aa if aa[k]!=bb.get(k)];assert diff==row['mismatched_fields']
  if diff:bad.append(i)
  passes=profile in ['normal_sorted','normal_duplicates_present','mayhem_primary']or profile.startswith('mayhem_secondary_')
  if passes:assert a['error']is None;successes+=1
  else:assert 'InstructionErrorCustom(6013)'in a['error']
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=observed['transactions'][i*2+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified'];assert len(checks)==t['signature_count']==1;sigs+=1;assert digest(raw)==t['transaction_sha256']and t['transaction_base64']==q['transaction_base64'];assert t['amm_program_sha256']==(ORIGINAL if side=='original'else digest_candidate);assert t['loaded_programs'][AMM]['sha256']==t['amm_program_sha256'];assert t['logs_sha256']==digest(json.dumps(q['logs'],separators=(',',':')).encode());assert t['error']==q['error']
   assert set(q['before'])==set(q['after']);keys=set(map(str,tx.message.account_keys));extra=set(q['before'])-keys;assert extra<= {'8NyBnxo9mS5MsqY4qoKmrt7MS89d7MNV6rh5fu2YsQPT'};assert all(q['before'][key]==q['after'][key]for key in extra);assert keys-set(q['before'])<=set(t['loaded_programs'])|{'11111111111111111111111111111111'}
   for phase in ['before','after']:
    for account in q[phase].values():assert account is None or set(account)=={'data_hex','lamports','owner'}
   assert set(list(DEPENDENCIES)[:3])<=set(t['loaded_programs'])
   for program,info in t['loaded_programs'].items():assert info['sha256']==(t['amm_program_sha256']if program==AMM else DEPENDENCIES[program])
   assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert str(tx.message.account_keys[ix.program_id_index])==AMM;global_key=str(tx.message.account_keys[ix.accounts[2]]);recipient=bytes(tx.message.account_keys[ix.accounts[9]]);data=bytes.fromhex(q['before'][global_key]['data_hex']);array=[data[k:k+32]for k in range(57,313,32)];pool_key=str(tx.message.account_keys[ix.accounts[0]]);pool=bytes.fromhex(q['before'][pool_key]['data_hex']);assert bool(pool[243])==profile.startswith('mayhem_')and pool[244]==0
   if profile.startswith('mayhem_'):
    primary=data[385:417];secondary=[data[k:k+32]for k in range(418,642,32)]
    if profile=='mayhem_primary':assert primary==recipient and recipient not in secondary
    elif profile=='mayhem_absent':assert primary!=recipient and recipient not in secondary
    else:assert primary!=recipient and secondary.count(recipient)==1 and secondary[int(profile.rsplit('_',1)[1])]==recipient
   elif profile=='normal_duplicates_present':assert array==[recipient]*8
   elif profile=='normal_duplicates_absent':assert len(set(array))==1 and recipient not in array
   elif profile=='normal_absent':assert recipient not in array and array==sorted(array)
   else:
    assert len(set(array))==8 and recipient in array;ordered=sorted(array);assert array==(ordered if profile=='normal_sorted'else list(reversed(ordered))if profile=='normal_reverse'else ordered[1:]+ordered[:1])
  messages.append(observed['transactions'][i*2]['transaction_sha256']);originals.append(a)
 assert len(bad)==report['mismatch_count']==expected_bad and sigs==observed['signature_count']==90 and successes==30
 if digest_candidate==CANDIDATE:assert bad==[1,2,16,17,31,32]
 return {'verified':True,'candidate_sha256':digest_candidate,'cases':45,'verified_signatures':90,'mismatch_indices':bad,'original_successes':successes,'messages':messages,'originals':originals,'executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--report',type=Path,required=True);p.add_argument('--transactions',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--producer',type=Path,required=True);p.add_argument('--observer',type=Path,required=True);p.add_argument('--cleaner',type=Path,required=True);p.add_argument('--expected-bad',type=int,default=0);p.add_argument('--output',type=Path,required=True);a=p.parse_args();r=verify(a.report,a.transactions,a.candidate,a.producer,a.observer,a.cleaner,a.expected_bad);r={k:v for k,v in r.items()if k not in ['messages','originals']};a.output.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
