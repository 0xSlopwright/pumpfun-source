"""Portable authentication for the two CTO quote-guard suites."""
from pathlib import Path
import argparse,ast,base64,gzip,hashlib,json,struct,sys,types
from solders.pubkey import Pubkey
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';PUMP='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';FEES='pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ'
TOKEN='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';TOKEN22='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';ATA='ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';SYS='11111111111111111111111111111111';BUDGET='ComputeBudget111111111111111111111111111111'
NATIVE22='9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP';NATIVE='So11111111111111111111111111111111111111112';USDC='EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';FIFTH='7f501a865b83cf1dfbc4072191967162c700d3e7e487d2f6400e8d230f15ca62'
PROGRAMS={AMM:'evidence/original/pump_amm/deployed.so',PUMP:'evidence/original/pump/deployed.so',FEES:'evidence/original/pump_fees/deployed.so',TOKEN:'evidence/dependencies/spl_token/deployed.so',TOKEN22:'evidence/dependencies/spl_token_2022/deployed.so',ATA:'evidence/dependencies/associated_token/deployed.so'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 m=types.ModuleType('checked');m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def inventory(d):return {str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'}
def check_manifest(d):assert inventory(d)==load(d/'manifest.json')['files']
def cases(p):
 tree=ast.parse(p.read_text());f=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');scope={};exec(compile(ast.fix_missing_locations(ast.Module(body=[f],type_ignores=[])),'<cases>','exec'),scope);return json.loads(json.dumps(scope['cases']()))
def verify_reports(kit,directory,candidate,expected_bad=0):
 kit=Path(kit);d=Path(directory);digest=sha(candidate);check_manifest(kit);assert expected_bad in[0,6]
 if expected_bad:assert digest==FIFTH
 clean=module(kit/'cleaner.py').clean;profiles=load(kit/'runtime-inputs.json');total_sig=total_bad=total_success=total_reached=0;results={}
 spec=next(x for x in load(kit/'runtime-sources/evidence/upstream/pump.json')['instructions']if x['name']=='admin_cto')
 for suite,file,count,successes,reached,bad_expected in [('normal','probe.py',14,5,10,[5,12,13]),('native','probe_native.py',5,1,4,[2,3,4])]:
  r=load(d/suite/'report.json.gz');o=load(d/suite/'transactions.json.gz');inputs=profiles[suite];expected=cases(kit/file);assert r['candidate_sha256']==digest and r['original_sha256']==ORIGINAL
  assert r['producer_sha256']==o['script_sha256']==sha(kit/file)and o['observer_sha256']==sha(kit/'observer.py');assert r['runtime_reads_before']==r['runtime_reads_after']==inputs
  for path,h in inputs.items():
   if not path.endswith('.so'):assert sha(kit/'runtime-sources'/path)==h
  assert sha(kit/'cleaner.py')==inputs['repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'];assert len(r['cases'])==r['case_count']==count and len(o['transactions'])==o['transaction_count']==count*2
  bad=[];ss=rr=sig=0
  for i,row in enumerate(r['cases']):
   c=row['case'];assert c==expected[i];a,b=row['original'],row['candidate'];assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];x,y=clean(a),clean(b);diff=[k for k in x if x[k]!=y.get(k)];assert diff==row['mismatched_fields'];ss+=a['error']is None;rr+=any('Instruction: AdminCtoPool'in line for line in a['logs'])
   if diff:bad.append(i)
   qmint=NATIVE22 if suite=='native'else c['quote'];error=6078 if c['fee']==0 else 6077 if c['fee']is not None and qmint in[NATIVE,NATIVE22,USDC]else None
   assert a['error']==(None if error is None else 'TransactionErrorInstructionError((1, Tagged(InstructionErrorCustom('+str(error)+'))))')
   for j,side in enumerate(['original','candidate']):
    q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified']and len(v)==t['signature_count']==2;sig+=len(v)
    assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and q['transaction_base64']==t['transaction_base64'];ph=ORIGINAL if side=='original'else digest;assert t['amm_program_sha256']==ph and t['loaded_programs'][AMM]['sha256']==ph
    assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest();keys=list(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after'])and not set(q['before'])-set(keys)and set(keys)-set(q['before'])<=set(t['loaded_programs'])|{SYS,BUDGET}
    assert len(tx.message.instructions)==2;cb,ix=tx.message.instructions;assert keys[cb.program_id_index]==BUDGET and bytes(cb.data)==b'\x02\xc0\x5c\x15\0';assert keys[ix.program_id_index]==PUMP;data=bytes(ix.data);assert data[:8]==bytes(spec['discriminator'])and data[8]==0;pos=9
    if c['fee']is None:assert data[pos]==0;pos+=1
    else:assert data[pos]==1 and struct.unpack_from('<Q',data,pos+1)[0]==c['fee'];pos+=9
    assert len(data)==pos+33 and data[pos]==1;named={f['name']:keys[n]for f,n in zip(spec['accounts'],ix.accounts)};assert named['pool_authority']not in keys[:tx.message.header.num_required_signatures]
    pool=bytes.fromhex(q['before'][named['pool']]['data_hex']);assert pool[75:107]==bytes(Pubkey.from_string(qmint));cfg=bytes.fromhex(q['before'][named['amm_global_config']]['data_hex']);assert bool(cfg[940])==c['configurable'];assert bool(pool[244])==c['cashback']
    if suite=='native':
     assert named['quote_mint']==NATIVE22 and named['quote_token_program']==TOKEN22;assert q['before'][NATIVE22]['owner']==TOKEN22 and q['before'][named['mint']]['owner']==TOKEN22
     expected_pool,bump=Pubkey.find_program_address([b'pool',pool[9:11],pool[11:43],pool[43:75],pool[75:107]],Pubkey.from_string(AMM));assert str(expected_pool)==named['pool']and bump==pool[8]
     curve=bytes.fromhex(q['before'][named['bonding_curve']]['data_hex']);assert curve[83:115]==bytes(Pubkey.from_string(NATIVE22))and curve[123]==1
    pids={AMM,PUMP,FEES,ATA,TOKEN22 if suite=='native'else TOKEN};assert set(t['loaded_programs'])==pids
    for pid,p in t['loaded_programs'].items():assert p['sha256']==(ph if pid==AMM else inputs[PROGRAMS[pid]])
    for phase in['before','after']:
     for value in q[phase].values():assert value is None or set(value)=={'data_hex','owner','lamports'}
  assert ss==successes and rr==reached and sig==count*4 and o['signature_count']==sig and r['mismatch_count']==len(bad);assert bad==(bad_expected if expected_bad else [])
  results[suite]={'cases':count,'mismatches':len(bad),'signatures':sig,'original_successes':ss,'original_amm_invocations':rr};total_sig+=sig;total_bad+=len(bad);total_success+=ss;total_reached+=rr
 assert total_bad==expected_bad
 return {'verified':True,'candidate_sha256':digest,'cases':19,'mismatches':total_bad,'signatures':total_sig,'original_successes':total_success,'original_amm_invocations':total_reached,'suites':results,'executes_runtime':False}
def verify(directory,candidate=None,expected_bad=None):
 d=Path(directory);check_manifest(d);target=load(d/'verification-target.json');return verify_reports(d/'kit',d,Path(candidate)if candidate else d/'candidate.so',target['expected_bad']if expected_bad is None else expected_bad)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path,nargs='?',default=HERE);p.add_argument('--candidate',type=Path);p.add_argument('--expected-bad',type=int);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate,a.expected_bad),indent=2))
