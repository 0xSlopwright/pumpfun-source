"""Verify saved user-volume edge receipts and exact loaded binary bindings; no VM."""
from pathlib import Path
import ast,base64,gzip,hashlib,json,struct,types
from solders.transaction import Transaction

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def function_cases(p):
 t=ast.parse(p.read_text());f=next(x for x in t.body if isinstance(x,ast.FunctionDef)and x.name=='cases');n={};exec(compile(ast.Module(body=[f],type_ignores=[]),'<saved cases>','exec'),n);return n['cases']()
def state(row):
 v=next(v for v in row['after'].values()if v and len(bytes.fromhex(v['data']))==137)
 return list(struct.unpack_from('<BQQQqBQQ',bytes.fromhex(v['data']),40))
def verify(directory=None):
 P=Path(directory)if directory is not None else Path(__file__).resolve().parent
 M=read(P/'manifest.json');assert M['files']=={str(p.relative_to(P)):sha(p)for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
 r=read(P/'report.json.gz');obs=read(P/'transactions.json.gz');cases=function_cases(P/'producer.py');assert len(cases)==r['case_count']==16
 assert r['producer_sha256']==obs['script_sha256']==sha(P/'producer.py');assert r['fixture_sha256']==sha(P/'admin_fixture.py');assert obs['observer_sha256']==sha(P/'observer.py')
 original=sha(P/'inputs/evidence/original/pump_amm/deployed.so');candidate=sha(P/'candidate.so');assert original==r['original_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';assert candidate==r['candidate_sha256']=='c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544'
 p=P/'cleaner.py';m=types.ModuleType('cleaner');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__)
 assert obs['transaction_count']==len(obs['transactions'])==32;signatures=success=0
 deps={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'};amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
 outcomes=read(P/'outcomes.json')
 for i,row in enumerate(r['cases']):
  assert {k:row[k]for k in ['name','input']}==cases[i];a,b=row['original'],row['candidate'];assert m.clean(a)==m.clean(b)and row['different_fields']==[]
  assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];success+=a['error']is None
  assert outcomes[i]['name']==row['name']and outcomes[i]['error']==a['error']and outcomes[i]['user_state']==state(a)
  assert outcomes[i]['token_cpi_invoked']==any(f'Program {pid} invoke [2]'in a['logs']for pid in deps if pid.startswith('Token'))
  for j,side in enumerate(['original','candidate']):
   t=obs['transactions'][2*i+j];v=row[side];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks);signatures+=len(checks);assert t['signature_count']==len(checks)and t['all_signatures_verified']
   assert t['transaction_sha256']==hashlib.sha256(raw).hexdigest()and v['transaction_base64']==t['transaction_base64'];assert t['error']==v['error'];assert t['logs_sha256']==hashlib.sha256(json.dumps(v['logs'],separators=(',',':')).encode()).hexdigest();expected=original if side=='original'else candidate
   assert t['amm_program_sha256']==t['loaded_programs'][amm]['sha256']==expected;assert v['signature_verification']and v['sigverify_runtime_enabled']
   for pid,pv in t['loaded_programs'].items():assert pv['sha256']==(expected if pid==amm else sha(P/'inputs'/deps[pid]))
 assert r['mismatch_count']==0 and signatures==obs['signature_count']==32 and success==r['original_successes']==10
 coverage=read(P/'coverage.json');prior=read(P/'prior-coverage/claim-cases.json.gz');assert len(prior)==coverage['prior_claim_cases']==807
 assert coverage['prior_fixture_sha256']==sha(P/'prior-coverage/admin_fixture.py')
 canonical=lambda c:json.dumps({**coverage['defaults'],**c},sort_keys=True,separators=(',',':'))
 prior_inputs={canonical(c)for c in prior};assert not [x['name']for x in cases if canonical(x['input'])in prior_inputs]
 assert coverage['duplicate_named_cases']==[]and coverage['new_named_cases']==[x['name']for x in cases]
 maxu=2**64-1
 assert state(r['cases'][0]['original'])[:6]==[0,0,maxu,0,21,1]
 assert 'Unexpected overflow' in '\n'.join(r['cases'][2]['original']['logs'])
 assert 'Truncation' in '\n'.join(r['cases'][3]['original']['logs'])
 assert not outcomes[2]['token_cpi_invoked'] and outcomes[1]['token_cpi_invoked']
 assert state(r['cases'][4]['original'])[:6]==[1,0,maxu,maxu,21,1]
 assert state(r['cases'][5]['original'])[:6]==[0,0,maxu,0,21,1]
 assert state(r['cases'][8]['original'])[:6]==[1,0,maxu,maxu,21,1]
 assert state(r['cases'][15]['original'])[:6]==[0,0,maxu,0,21,0]
 for row in r['cases']:
  if row['original']['error']:
   for key,before in row['original']['before'].items():
    if before and before['owner'] in [amm,*deps]:assert row['original']['after'][key]==before
 # The original's period/last and reward guards are authenticated as instruction bytes.
 blob=(P/'inputs/evidence/original/pump_amm/deployed.so').read_bytes();e=struct.unpack_from('<16sHHIQQQIHHHHHH',blob);shoff=e[6];entsize=e[11];num=e[12]
 secs=[struct.unpack_from('<IIQQQQIIQQ',blob,shoff+i*entsize)for i in range(num)]
 for x in read(P/'original-instructions.json'):
  addr=int(x['address'],16);sec=next(s for s in secs if s[3]<=addr<s[3]+s[5]and s[1]==1);off=sec[4]+addr-sec[3];assert blob[off:off+8].hex()==x['bytes']
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':candidate,'cases':16,'transactions':32,'signature_fields':32,'mismatches':0,'original_successes':10,'scope':'Named synthetic claim crossproducts; external CPI and malformed state/clock results only within saved fixture runtime. No network reachability or whole-program identity claim.','vm_executed_by_verifier':False}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
