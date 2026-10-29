"""Authenticate the reserved-recipient negative control or a corrected replay."""
from pathlib import Path
import argparse,ast,base64,gzip,hashlib,json,sys,types
from solders.pubkey import Pubkey
from solders.rent import Rent
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
BASELINE='3fcae02128464717b29a0b3842fbba993d5d0befb4362c4094c8af8e32a8589d'
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';SYS='11111111111111111111111111111111'
EXPECTED_BAD=[2,6,7,8,10,12,13,14,16,17,18]
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 m=types.ModuleType('checked');m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def recipients(c):
 keys=[Pubkey.from_bytes(bytes([90+i])*32)for i in range(8)];mode=c['mode'];idx=c['index']
 if mode=='duplicate':keys[7]=keys[0]
 if mode=='short':keys=keys[:7]
 if mode=='extra-zero':keys.append(Pubkey.default())
 if mode=='zero':keys[idx]=Pubkey.default()
 if mode=='executable':keys[idx]=Pubkey.from_string(AMM)
 if mode in ['rent-first-zero-later','exec-first-zero-later','zero-first-rent-later','zero-first-exec-later']:
  if mode.startswith('zero-first'):keys[0]=Pubkey.default();target=7
  else:keys[7]=Pubkey.default();target=0
  if 'exec' in mode:keys[target]=Pubkey.from_string(AMM)
 return keys
def error_code(c):
 mode=c['mode']
 if mode=='short':return 6044
 if mode=='zero'or mode.startswith('zero-first'):return 6011
 if mode=='executable'or mode=='exec-first-zero-later':return 2007
 if mode in ['rent-empty','rent-data','rent-minus-one','rent-first-zero-later']:return 2005
 return None
def verify_output(directory,candidate,reports,expected_bad=0):
 d=Path(directory);reports=Path(reports);r=load(reports/'report.json.gz');o=load(reports/'transactions.json.gz');inputs=load(d/'runtime-inputs.json');clean=module(d/'cleaner.py').clean;digest=sha(candidate)
 assert expected_bad in[0,11]
 if expected_bad:assert digest==BASELINE
 assert r['candidate_sha256']==digest and r['original_sha256']==ORIGINAL
 assert r['producer_sha256']==o['script_sha256']==sha(d/'probe.py')and o['observer_sha256']==sha(d/'observer.py')
 assert r['runtime_reads_before']==r['runtime_reads_after']==inputs
 for path,digest_in in inputs.items():
  if not path.endswith('.so'):assert sha(d/'runtime-sources'/path)==digest_in
 assert sha(d/'cleaner.py')==inputs['repro/pump_amm/diagnostic-parity-20261027/compare_direct.py']
 tree=ast.parse((d/'probe.py').read_text());f=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');scope={};exec(compile(ast.fix_missing_locations(ast.Module(body=[f],type_ignores=[])),'<cases>','exec'),scope);expected=json.loads(json.dumps(scope['cases']()))
 assert len(r['cases'])==r['case_count']==21 and len(o['transactions'])==o['transaction_count']==42
 spec=next(x for x in load(d/'runtime-sources/evidence/upstream/pump_amm.json')['instructions']if x['name']=='set_reserved_fee_recipients')
 signatures=successes=0;bad=[]
 for i,row in enumerate(r['cases']):
  c=row['case'];assert c==expected[i];a,b=row['original'],row['candidate'];assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];x,y=clean(a),clean(b);diff=[k for k in x if x[k]!=y.get(k)];assert diff==row['mismatched_fields']
  if diff:bad.append(i)
  successes+=a['error']is None;code=error_code(c);assert a['error']==(None if code is None else 'TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom('+str(code)+'))))')
  if code in[2005,2007]:assert any('account: reserved_fee_recipients['+str(c['index'])+']'in line for line in a['logs'])
  if code==6044:assert 'Program log: Left: 7'in a['logs']and'Program log: Right: 8'in a['logs']
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified']and len(v)==t['signature_count']==1;signatures+=1
   assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and q['transaction_base64']==t['transaction_base64'];program_hash=ORIGINAL if side=='original'else digest
   assert t['amm_program_sha256']==program_hash and set(t['loaded_programs'])=={AMM}and t['loaded_programs'][AMM]['sha256']==program_hash
   assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest()
   keys=list(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after'])and not set(q['before'])-set(keys)and set(keys)-set(q['before'])<={AMM,SYS}
   assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM and bytes(ix.data)==bytes(spec['discriminator'])+bytes([199])*32;ordered=[keys[z]for z in ix.accounts];rs=recipients(c);assert ordered[4:]==list(map(str,rs));config=ordered[0];admin=ordered[1]
   before=bytes.fromhex(q['before'][config]['data_hex']);after=bytes.fromhex(q['after'][config]['data_hex']);assert before[8:40]==bytes(Pubkey.from_string(admin))
   if q['error']is None:
    assert after[353:385]==bytes([199])*32 and after[385:417]==bytes(rs[0])and after[418:642]==b''.join(bytes(k)for k in rs[1:8])
   else:assert before==after
   for field in ['before','after']:
    for account in q[field].values():assert account is None or set(account)=={'data_hex','lamports','owner'}
   for k in rs:
    if str(k)in[AMM,SYS]:continue
    state=q['before'][str(k)];assert state is not None
   if c['mode']in['rent-empty','rent-data','rent-exact','rent-minus-one']:
    st=q['before'][str(rs[c['index']])];size=0 if c['mode']=='rent-empty'else 1000;assert len(bytes.fromhex(st['data_hex']))==size;minimum=Rent.default().minimum_balance(size);assert st['lamports']==(1 if c['mode']in['rent-empty','rent-data']else minimum-(c['mode']=='rent-minus-one'))
 assert signatures==o['signature_count']==42 and successes==6 and r['mismatch_count']==len(bad)==expected_bad and bad==(EXPECTED_BAD if expected_bad else [])
 return {'verified':True,'candidate_sha256':digest,'cases':21,'mismatches':len(bad),'mismatch_indices':bad,'signatures':signatures,'original_successes':successes,'executes_runtime':False}
def verify(directory=HERE):
 d=Path(directory);files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'};assert files==load(d/'manifest.json')['files'];return verify_output(d,d/'baseline-candidate.so',d/'baseline',11)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=HERE);p.add_argument('--candidate',type=Path);p.add_argument('--reports',type=Path);p.add_argument('--expected-bad',type=int,default=0);a=p.parse_args();print(json.dumps(verify_output(a.directory,a.candidate,a.reports,a.expected_bad)if a.reports else verify(a.directory),indent=2))
