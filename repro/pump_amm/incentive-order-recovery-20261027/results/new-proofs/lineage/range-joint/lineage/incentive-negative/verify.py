"""Recheck saved signed cross-domain incentive counterexamples; no VM."""
from pathlib import Path
import ast,base64,gzip,hashlib,itertools,json,types
from solders.transaction import Transaction

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify(directory):
 P=Path(directory);M=read(P/'manifest.json')['files'];assert M=={str(p.relative_to(P)):sha(p)for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
 r=read(P/'report.json.gz');obs=read(P/'transactions.json.gz');tree=ast.parse((P/'producer.py').read_text());f=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');ns={'itertools':itertools};exec(compile(ast.Module(body=[f],type_ignores=[]),'<cases>','exec'),ns);cases=ns['cases']();assert len(cases)==r['case_count']==1730
 assert r['producer_sha256']==obs['script_sha256']==sha(P/'producer.py');assert r['fixture_sha256']==sha(P/'admin_fixture.py');assert obs['observer_sha256']==sha(P/'observer.py')
 original=sha(P/'inputs/evidence/original/pump_amm/deployed.so');candidate=sha(P/'candidate.so');assert original==r['original_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';assert candidate==r['candidate_sha256']=='58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b'
 p=P/'cleaner.py';m=types.ModuleType('cleaner');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__)
 assert obs['transaction_count']==len(obs['transactions'])==3460;bad=[];signatures=success=0
 deps={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'};amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
 for i,row in enumerate(r['cases']):
  assert row['input']==cases[i];a,b=row['original'],row['candidate'];x,y=m.clean(a),m.clean(b);diff=sorted(k for k in set(x)|set(y)if x.get(k)!=y.get(k));assert diff==sorted(row['different_fields']);assert a['transaction_base64']==b['transaction_base64']and a['before']==b['before'];success+=a['error']is None
  if diff:
   bad.append(i);assert diff==['error','logs'];assert a['error']=='TransactionErrorInstructionError((0, Fieldless(ProgramFailedToComplete)))';assert b['error']=='TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom(6035))))';assert a['after']==b['after']
  for j,side in enumerate(['original','candidate']):
   t=obs['transactions'][2*i+j];v=row[side];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks);signatures+=len(checks);assert t['signature_count']==len(checks);assert t['transaction_sha256']==hashlib.sha256(raw).hexdigest();assert v['transaction_base64']==t['transaction_base64'];assert t['error']==v['error'];assert t['logs_sha256']==hashlib.sha256(json.dumps(v['logs'],separators=(',',':')).encode()).hexdigest();expected=original if side=='original'else candidate;assert t['amm_program_sha256']==t['loaded_programs'][amm]['sha256']==expected
   for pid,pv in t['loaded_programs'].items():assert pv['sha256']==(expected if pid==amm else sha(P/'inputs'/deps[pid]))
 assert len(bad)==r['mismatch_count']==128 and signatures==obs['signature_count']==3462 and success==r['original_successes']==275
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':candidate,'cases':1730,'transactions':3460,'signature_fields':signatures,'mismatches':128,'original_successes':275,'different_final_states':0,'scope':'Synthetic signed offline admin-state boundary counterexamples; no network reachability or whole-program claim.','vm_executed_by_verifier':False}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
