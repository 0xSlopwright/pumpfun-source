"""Portable signature, full-state and recipient-branch verification for17 sweeps."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys,types
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
PROFILES=['normal_sorted','normal_reverse','normal_rotate','normal_absent','normal_duplicates_present','normal_duplicates_absent','mayhem_primary']+[f'mayhem_secondary_{i}'for i in range(7)]+['mayhem_absent','creator_empty','creator_positive']
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def digest(b):return hashlib.sha256(b).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 p=Path(p);m=types.ModuleType('checked_sweep');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def check_inventory(d):
 files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'};assert files==load(d/'manifest.json')['files'];assert not any(p.is_symlink()for p in d.rglob('*'))

def verify_output(directory,candidate,output,expected_bad=0):
 assert expected_bad==0;d=Path(directory);candidate=Path(candidate);output=Path(output);check_inventory(d);cleaner=module(d/'cleaner.py');r=load(output/'report.json.gz');o=load(output/'transactions.json.gz');cd=sha(candidate);assert r['candidate_sha256']==cd and r['original_sha256']==ORIGINAL;assert r['producer_sha256']==o['script_sha256']==sha(d/'probe.py')and o['observer_sha256']==sha(d/'observer.py');assert len(r['cases'])==r['case_count']==17 and len(o['transactions'])==o['transaction_count']==34
 dep=load(d/'runtime-inputs.json');prog={AMM:ORIGINAL,'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':dep['runtime_binary_inputs']['evidence/dependencies/spl_token/deployed.so'],'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':dep['runtime_binary_inputs']['evidence/dependencies/spl_token_2022/deployed.so'],'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':dep['runtime_binary_inputs']['evidence/dependencies/associated_token/deployed.so']};sigs=0;success=0;messages=[];originals=[]
 for i,profile in enumerate(PROFILES):
  row=r['cases'][i];assert row['case']=={'profile':profile};a,b=row['original'],row['candidate'];assert a['before']==b['before']and a['transaction_base64']==b['transaction_base64'];x,y=map(cleaner.clean,[a,b]);assert x==y and row['mismatched_fields']==[];creator=profile.startswith('creator_');passes=creator or profile in ['normal_sorted','normal_duplicates_present','mayhem_primary']or profile.startswith('mayhem_secondary_')
  if passes:assert a['error']is None;success+=1
  else:assert 'InstructionErrorCustom(6013)'in a['error']
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified']and len(checks)==t['signature_count']==1;sigs+=1;assert digest(raw)==t['transaction_sha256']and t['transaction_base64']==q['transaction_base64'];pd=ORIGINAL if side=='original'else cd;assert t['amm_program_sha256']==pd and t['loaded_programs'][AMM]['sha256']==pd;assert t['error']==q['error']and t['logs_sha256']==digest(json.dumps(q['logs'],separators=(',',':')).encode());assert set(q['before'])==set(q['after']);keys=set(map(str,tx.message.account_keys));assert not set(q['before'])-keys and keys-set(q['before'])<=set(t['loaded_programs'])|{'11111111111111111111111111111111'}
   for state in ['before','after']:
    for account in q[state].values():assert account is None or set(account)=={'data_hex','lamports','owner'}
   assert set(prog)==set(t['loaded_programs'])
   for program,record in t['loaded_programs'].items():assert record['sha256']==(pd if program==AMM else prog[program])
   assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert str(tx.message.account_keys[ix.program_id_index])==AMM;name='sweep_creator_fee'if creator else'sweep_protocol_fee';assert bytes(ix.data)==hashlib.sha256(('global:'+name).encode()).digest()[:8];config=str(tx.message.account_keys[ix.accounts[1]]);pool=str(tx.message.account_keys[ix.accounts[2]]);recipient=bytes(tx.message.account_keys[ix.accounts[6]]);data=bytes.fromhex(q['before'][config]['data_hex']);pooldata=bytes.fromhex(q['before'][pool]['data_hex']);assert bool(pooldata[243])==profile.startswith('mayhem_')and pooldata[244]==0
   if creator:
    assert int.from_bytes(pooldata[279:287],'little')==(0 if profile=='creator_empty'else 1000);continue
   array=[data[k:k+32]for k in range(57,313,32)]
   if profile.startswith('mayhem_'):
    primary=data[385:417];secondary=[data[k:k+32]for k in range(418,642,32)]
    if profile=='mayhem_primary':assert primary==recipient and recipient not in secondary
    elif profile=='mayhem_absent':assert primary!=recipient and recipient not in secondary
    else:assert primary!=recipient and secondary.count(recipient)==1 and secondary[int(profile.rsplit('_',1)[1])]==recipient
   elif profile=='normal_duplicates_present':assert array==[recipient]*8
   elif profile=='normal_duplicates_absent':assert len(set(array))==1 and recipient not in array
   elif profile=='normal_absent':assert recipient not in array and array==sorted(array)
   else:
    ordered=sorted(array);assert len(set(array))==8 and recipient in array;assert array==(ordered if profile=='normal_sorted'else list(reversed(ordered))if profile=='normal_reverse'else ordered[1:]+ordered[:1])
  messages.append(o['transactions'][i*2]['transaction_sha256']);originals.append(a)
 assert r['mismatch_count']==0 and sigs==o['signature_count']==34 and success==12
 record=load(output/'run.json');inputs={**dep['repository_inputs'],**dep['runtime_binary_inputs']};assert record['candidate_sha256']==record['candidate_after_sha256']==cd and record['inputs_before']==record['inputs_after']==inputs and record['bytecode_cache_initially_absent_and_not_written']is True and record['packet_manifest_sha256']==sha(d/'manifest.json')
 return {'verified':True,'candidate_sha256':cd,'cases':17,'verified_signatures':34,'mismatches':0,'original_successes':12,'messages':messages,'originals':originals,'executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=HERE);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--reports',type=Path,required=True);a=p.parse_args();r=verify_output(a.directory,a.candidate,a.reports);print(json.dumps({k:v for k,v in r.items()if k not in ['messages','originals']},indent=2))
