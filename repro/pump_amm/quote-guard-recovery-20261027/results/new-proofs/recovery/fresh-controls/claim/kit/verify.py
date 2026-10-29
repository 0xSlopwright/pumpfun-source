"""Verify signed claim transfer controls, including complete logs and account states."""
from pathlib import Path
import argparse,ast,base64,gzip,hashlib,json,struct,sys,types
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';SYS='11111111111111111111111111111111'
TOKEN='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';TOKEN22='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
PROGRAMS={AMM:'evidence/original/pump_amm/deployed.so',TOKEN:'evidence/dependencies/spl_token/deployed.so',TOKEN22:'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 m=types.ModuleType('checked');m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def decode(v):
 assert v[0]==[len(v)-1];return bytes(v[1:])
def verify_output(directory,candidate,reports):
 d=Path(directory);reports=Path(reports);r=load(reports/'report.json.gz');o=load(reports/'transactions.json.gz');inputs=load(d/'runtime-inputs.json');clean=module(d/'cleaner.py').clean;digest=sha(candidate)
 assert r['candidate_sha256']==digest and r['original_sha256']==ORIGINAL
 assert r['producer_sha256']==o['script_sha256']==sha(d/'probe.py')and o['observer_sha256']==sha(d/'observer.py')
 assert r['runtime_reads_before']==r['runtime_reads_after']==inputs
 for path,digest_in in inputs.items():
  if not path.endswith('.so'):assert sha(d/'runtime-sources'/path)==digest_in
 assert sha(d/'cleaner.py')==inputs['repro/pump_amm/diagnostic-parity-20261027/compare_direct.py']
 tree=ast.parse((d/'probe.py').read_text());f=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');scope={};exec(compile(ast.fix_missing_locations(ast.Module(body=[f],type_ignores=[])),'<cases>','exec'),scope);expected=json.loads(json.dumps(scope['cases']()))
 assert len(r['cases'])==r['case_count']==22 and len(o['transactions'])==o['transaction_count']==44
 spec=next(x for x in load(d/'runtime-sources/evidence/upstream/pump_amm.json')['instructions']if x['name']=='claim_token_incentives')
 signatures=successes=attempts=0;errors={4:6024,5:None,6:None,7:1,8:1,11:17,12:17,13:None,14:None,19:None,20:1}
 for i,row in enumerate(r['cases']):
  c=row['case'];assert c==expected[i];a,b=row['original'],row['candidate'];assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];assert clean(a)==clean(b)and row['mismatched_fields']==[];successes+=a['error']is None
  err=None if i not in errors else 'TransactionErrorInstructionError((0, Fieldless(ProgramFailedToComplete)))'if errors[i]is None else 'TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom('+str(errors[i])+'))))';assert a['error']==err
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified']and len(v)==t['signature_count']==1;signatures+=1
   assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and q['transaction_base64']==t['transaction_base64'];program_hash=ORIGINAL if side=='original'else digest
   assert t['amm_program_sha256']==program_hash and t['loaded_programs'][AMM]['sha256']==program_hash
   assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest()
   keys=list(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after'])and not set(q['before'])-set(keys)and set(keys)-set(q['before'])<=set(t['loaded_programs'])|{SYS}
   assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM and bytes(ix.data)==bytes(spec['discriminator']);named={x['name']:keys[n]for x,n in zip(spec['accounts'],ix.accounts)}
   assert named['token_program']==(TOKEN22 if c.get('token22')else TOKEN)
   g=bytes.fromhex(q['before'][named['global_volume_accumulator']]['data_hex']);u=bytes.fromhex(q['before'][named['user_volume_accumulator']]['data_hex'])
   assert struct.unpack_from('<qqq',g,8)==(c.get('start',20),c.get('end',49),c.get('period',1))
   assert struct.unpack_from('<BQQQqBQQ',u,40)==(1,c.get('unclaimed',5),c.get('claimed',7),c.get('volume',20),c.get('last',0),1,11,13)
   for field in ['global_incentive_token_account','user_ata']:
    z=q['before'][named[field]]
    if field in c.get('missing',[]):assert z is None or z['data_hex']=='';continue
    data=bytes.fromhex(z['data_hex']);assert data[108]==(2 if c.get('mutate')==field else 1)
   for phase in ['before','after']:
    for account in q[phase].values():assert account is None or set(account)=={'data_hex','lamports','owner'}
   assert set(t['loaded_programs'])==set(PROGRAMS)
   for pid,p in t['loaded_programs'].items():assert p['sha256']==(program_hash if pid==AMM else inputs[PROGRAMS[pid]])
   if side=='original':
    for group in q['inner']:
     for inner in group:
      z=inner['instruction'];data=decode(z['data'])
      if keys[z['programIdIndex']]in[TOKEN,TOKEN22]and data[:1]==b'\x0c':assert len(data)==10 and data[9]==6;attempts+=1
 assert signatures==o['signature_count']==44 and successes==11 and r['mismatch_count']==0
 return {'verified':True,'candidate_sha256':digest,'cases':22,'mismatches':0,'signatures':signatures,'original_successes':successes,'original_transfer_checked_attempts':attempts,'executes_runtime':False}
def verify(directory=HERE,candidate=None):
 d=Path(directory);files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'};assert files==load(d/'manifest.json')['files'];return verify_output(d,Path(candidate)if candidate else d/'baseline-candidate.so',d/'baseline')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=HERE);p.add_argument('--candidate',type=Path);p.add_argument('--reports',type=Path);a=p.parse_args();print(json.dumps(verify_output(a.directory,a.candidate,a.reports)if a.reports else verify(a.directory,a.candidate),indent=2))
