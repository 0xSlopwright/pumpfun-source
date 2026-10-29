"""Verify saved or supplied boost-authority guard observations without a VM."""
from pathlib import Path
import argparse,ast,base64,gzip,hashlib,json,sys,types,struct
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';SYS='11111111111111111111111111111111'
PROGRAMS={AMM:'evidence/original/pump_amm/deployed.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 p=Path(p);m=types.ModuleType('checked');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify_output(directory,candidate,reports):
 d=Path(directory);reports=Path(reports);r=load(reports/'report.json.gz');o=load(reports/'transactions.json.gz');inputs=load(d/'runtime-inputs.json');clean=module(d/'cleaner.py').clean;digest=sha(candidate);assert r['candidate_sha256']==digest and r['original_sha256']==ORIGINAL;assert r['producer_sha256']==o['script_sha256']==sha(d/'probe.py')and o['observer_sha256']==sha(d/'observer.py');assert r['runtime_reads_before']==r['runtime_reads_after']==inputs
 for path,digest_in in inputs.items():
  if not path.endswith('.so'):assert sha(d/'runtime-sources'/path)==digest_in
 assert sha(d/'cleaner.py')==inputs['repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'];tree=ast.parse((d/'probe.py').read_text());f=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');scope={};exec(compile(ast.fix_missing_locations(ast.Module(body=[f],type_ignores=[])),'<cases>','exec'),scope);expected=json.loads(json.dumps(scope['cases']()));assert len(r['cases'])==r['case_count']==15 and len(o['transactions'])==o['transaction_count']==30;signatures=successes=0
 for i,row in enumerate(r['cases']):
  c=row['case'];assert c==expected[i];a,b=row['original'],row['candidate'];assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];assert clean(a)==clean(b)and row['mismatched_fields']==[];successes+=a['error']is None
  expected_error=6005 if c['authority']!='valid'else 6066 if not c['enabled']else 6020 if c['disabled_buy']else 6002 if c['amount']==0 else None
  assert a['error']==(None if expected_error is None else 'TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom('+str(expected_error)+'))))')
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified']and len(v)==t['signature_count']==1;signatures+=1;assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and q['transaction_base64']==t['transaction_base64'];program_hash=ORIGINAL if side=='original'else digest;assert t['amm_program_sha256']==program_hash and t['loaded_programs'][AMM]['sha256']==program_hash;assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest();keys=list(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after'])and not set(q['before'])-set(keys)and set(keys)-set(q['before'])<=set(t['loaded_programs'])|{SYS};assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM;assert bytes(ix.data)==hashlib.sha256(b'global:boost_buy_and_burn').digest()[:8]+struct.pack('<QQ',c['amount'],0);config=q['before'][keys[ix.accounts[2]]];data=bytes.fromhex(config['data_hex']);authority=bytes(tx.message.account_keys[ix.accounts[1]]);stored=data[907:939]
   if c['authority']=='valid':assert stored==authority
   elif c['authority']=='zero':assert stored==bytes(32)
   else:assert stored!=authority and stored!=bytes(32)
   assert bool(data[939])==c['enabled']and bool(data[56]&8)==c['disabled_buy']
   for phase in ['before','after']:
    for account in q[phase].values():assert account is None or set(account)=={'data_hex','lamports','owner'}
   for pid,p in t['loaded_programs'].items():assert pid in PROGRAMS and p['sha256']==(program_hash if pid==AMM else inputs[PROGRAMS[pid]])
 assert signatures==o['signature_count']==30 and successes==1 and r['mismatch_count']==0
 return {'verified':True,'candidate_sha256':digest,'cases':15,'mismatches':0,'signatures':signatures,'original_successes':successes,'executes_runtime':False}
def verify(directory=HERE,candidate=None):
 d=Path(directory);files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'};assert files==load(d/'manifest.json')['files'];return verify_output(d,Path(candidate)if candidate else d/'baseline-candidate.so',d/'baseline')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=HERE);p.add_argument('--candidate',type=Path);p.add_argument('--reports',type=Path);a=p.parse_args();print(json.dumps(verify_output(a.directory,a.candidate,a.reports)if a.reports else verify(a.directory,a.candidate),indent=2))
