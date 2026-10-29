"""Authenticate the e995 resize-order counterexamples without executing a VM."""
from pathlib import Path
import argparse,ast,base64,gzip,hashlib,json,re,sys,types
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
CANDIDATE='e995d6a8211dcd3d05c07cdcb1a7147ec4f4e2b2a81b56c268fd1a3d76a01ce1'
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';SYSTEM='11111111111111111111111111111111';CU='ComputeBudget111111111111111111111111111111'
BINS={AMM:('evidence/original/pump_amm/deployed.so',ORIGINAL),'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':('evidence/dependencies/spl_token/deployed.so','8190d3f7ceb6cb7a7a8d8924bff89f9f611e15ce1f806f2b6237f3311a98f697'),'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':('evidence/dependencies/spl_token_2022/deployed.so','15a2e615a42e20f31714bbaaee43002ae6f1cda2e8d7118243117ab3c1342e2d'),'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':('evidence/original/pump_fees/deployed.so','4f2955d0f6b40cc9ff7daa18ccad7d19119ba1249759f4e7e3bb691beee6b35e'),'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':('evidence/dependencies/associated_token/deployed.so','6804554e69fd3a58caa191dc4a58f4c67223d30ca28ab8987f39fc18d2f7374d'),'6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':('evidence/original/pump/deployed.so','7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d')}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def digest(b):return hashlib.sha256(b).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 p=Path(p);m=types.ModuleType('checked');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def roster(producer):
 tree=ast.parse(Path(producer).read_text());fn=next(n for n in tree.body if isinstance(n,ast.FunctionDef)and n.name=='cases');body=ast.Module(body=[fn],type_ignores=[]);scope={};exec(compile(ast.fix_missing_locations(body),str(producer),'exec'),scope);return json.loads(json.dumps(scope['cases']()))
def counts(logs):
 stack={};calls=amm=0
 for line in logs:
  m=re.fullmatch(r'Program (\w+) invoke \[(\d+)\]',line)
  if m:
   pid,level=m.group(1),int(m.group(2));stack={k:v for k,v in stack.items()if k<level};stack[level]=pid;amm+=pid==AMM;calls+=pid==SYSTEM and stack.get(level-1)==AMM
  else:
   m=re.match(r'Program (\w+) (?:success|failed:)',line)
   if m:
    for level in sorted(stack,reverse=True):
     if stack[level]==m.group(1):stack={k:v for k,v in stack.items()if k<level};break
 return calls,amm

def suite(d,label,count,bad_expected,candidate):
 x=d/label;r=load(x/'report.json.gz');o=load(x/'transactions.json.gz');clean=module(d/'cleaner.py').clean;expected=roster(x/'producer.py');assert len(expected)==count==r['case_count']==len(r['cases']);assert len(o['transactions'])==o['transaction_count']==count*2;assert r['candidate_sha256']==sha(candidate)==CANDIDATE and r['original_sha256']==ORIGINAL;assert r['producer_sha256']==o['script_sha256']==sha(x/'producer.py')and o['observer_sha256']==sha(d/'observer.py');assert r['runtime_reads_before']==r['runtime_reads_after']==load(d/'runtime-inputs.json');bad=[];sigs=0;success=0;syscalls=0;families={}
 for i,row in enumerate(r['cases']):
  c=row['case'];assert c==expected[i];a,b=row['original'],row['candidate'];assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];aa,bb=map(clean,[a,b]);diff=[k for k in aa if aa[k]!=bb.get(k)];assert diff==row['mismatched_fields'];success+=a['error']is None;syscalls+=a['direct_amm_system_calls'];families[c['family']]=families.get(c['family'],0)+1
  if diff:bad.append(i)
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified'];assert len(v)==t['signature_count']==(2 if c['family']=='admin_cto'else 1);sigs+=len(v);assert digest(raw)==t['transaction_sha256']and t['transaction_base64']==q['transaction_base64'];pd=ORIGINAL if side=='original'else CANDIDATE;assert t['amm_program_sha256']==pd and t['loaded_programs'][AMM]['sha256']==pd;assert t['error']==q['error']and t['logs_sha256']==digest(json.dumps(q['logs'],separators=(',',':')).encode());assert counts(q['logs'])==(q['direct_amm_system_calls'],q['amm_invocations'])
   keys=set(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after'])and not set(q['before'])-keys;assert keys-set(q['before'])<=set(t['loaded_programs'])|{SYSTEM,CU};assert q['pool_key']in keys and q['payer_key']==str(tx.message.account_keys[0]);pool=q['before'][q['pool_key']];assert len(bytes.fromhex(pool['data_hex']))==c['pool_length']and pool['lamports']==c['pool_lamports'];assert pool['owner']==AMM
   if c.get('payer_lamports')is not None:assert q['before'][q['payer_key']]['lamports']==c['payer_lamports']
   if q['error']:assert q['before'][q['pool_key']]==q['after'][q['pool_key']]
   for state in ['before','after']:
    for account in q[state].values():assert account is None or set(account)=={'data_hex','owner','lamports'}
   for pid,record in t['loaded_programs'].items():assert pid in BINS and record['sha256']==(pd if pid==AMM else BINS[pid][1])
   if c['family']=='admin_cto':assert len(tx.message.instructions)==2 and str(tx.message.account_keys[tx.message.instructions[0].program_id_index])==CU and bytes(tx.message.instructions[0].data)==bytes.fromhex('02c05c1500')
   else:assert len(tx.message.instructions)==1
  if diff:
   assert c['family']in ['sweep_protocol','sweep_creator'];assert a['direct_amm_system_calls']==1 and b['direct_amm_system_calls']==0
   if c['profile'].startswith('poor'):assert 'InstructionErrorCustom(1)'in a['error']and any(n in b['error']for n in ['InstructionErrorCustom(6013)','InstructionErrorCustom(2006)'])
 assert bad==bad_expected and r['mismatch_count']==len(bad)and sigs==o['signature_count'];assert len(families)==11
 return {'cases':count,'mismatches':len(bad),'mismatch_indices':bad,'verified_signatures':sigs,'original_successes':success,'original_direct_amm_system_cpis':syscalls,'families':families}
def verify(directory=HERE,candidate=None):
 d=Path(directory);candidate=Path(candidate)if candidate else d/'candidate.so';files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'};assert files==load(d/'manifest.json')['files'];inputs=load(d/'runtime-inputs.json')
 for rel,h in inputs.items():
  if rel.endswith('.so'):assert h==next(v[1]for v in BINS.values()if v[0]==rel)
  else:assert sha(d/'runtime-sources'/rel)==h
 first=suite(d,'initial154',154,[130,131,140,141],candidate);expanded=suite(d,'expanded160',160,[130,131,132,133,143,144,145,146],candidate)
 return {'verified':True,'candidate_sha256':CANDIDATE,'initial':first,'expanded':expanded,'signed_mismatch_scope':'Eight sweep order cases; four use user-controlled zero recipient and four deliberately mutate recipient-related state. No production transaction or reachable global-state exploit is asserted.','executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=HERE);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
