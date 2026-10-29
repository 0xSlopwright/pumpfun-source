from pathlib import Path
import argparse,ast,base64,collections,gzip,hashlib,json,struct,types
from solders.transaction import Transaction
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(directory,candidate,inputs,producer,observer):
 D,C,I=Path(directory),Path(candidate),Path(inputs);r=json.loads((D/'report.json').read_bytes());o=json.loads(gzip.decompress((D/'transactions.json.gz').read_bytes()))
 assert r['case_count']==len(r['cases'])==20 and r['mismatch_count']==0 and o['transaction_count']==len(o['transactions'])==40
 assert r['candidate_sha256']==sha(C)and r['original_sha256']==sha(I/'evidence/original/pump_amm/deployed.so')=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';assert r['producer_sha256']==o['script_sha256']==sha(producer)and o['observer_sha256']==sha(observer)
 assert json.loads((D/'inputs.json').read_bytes())=={str(p.relative_to(I)):sha(p)for p in I.rglob('*')if p.is_file()}
 tree=ast.parse(Path(producer).read_text());fn=next(n for n in tree.body if isinstance(n,ast.FunctionDef)and n.name=='cases');scope={'struct':struct};exec(compile(ast.fix_missing_locations(ast.Module(body=[fn],type_ignores=[])),'<cases>','exec'),scope);expected=scope['cases']()
 p=I/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';clean=types.ModuleType('cleaner');clean.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),clean.__dict__)
 amm='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';deps={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'spl_token','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'spl_token_2022','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'associated_token'};sigs=success=0;errors=collections.Counter()
 for i,row in enumerate(r['cases']):
  assert row['case']==expected[i]and not row['different_fields']and clean.clean(row['original'])==clean.clean(row['candidate']);pair=o['transactions'][2*i:2*i+2]
  assert pair[0]['transaction_base64']==pair[1]['transaction_base64']and pair[0]['before']==pair[1]['before']and pair[0]['after']==pair[1]['after']
  for j,side in enumerate(['original','candidate']):
   t,v=pair[j],row[side];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks);sigs+=len(checks);assert t['sequence']==2*i+j and t['signature_count']==len(checks)and t['transaction_sha256']==hashlib.sha256(raw).hexdigest()
   assert t['logs']==v['logs']and t['error']==v['error']and t['inner']==v['inner'];assert t['logs_sha256']==hashlib.sha256(json.dumps(t['logs'],separators=(',',':')).encode()).hexdigest();wanted=r['original_sha256']if j==0 else r['candidate_sha256'];assert t['amm_program_sha256']==t['loaded_programs'][amm]['sha256']==wanted
   for pid,p in t['loaded_programs'].items():assert p['sha256']==(wanted if pid==amm else sha(I/'evidence/dependencies'/deps[pid]/'deployed.so'))
  success+=pair[0]['error']is None;errors[str(pair[0]['error'])]+=1
 assert sigs==o['signature_count']==40 and success==6
 return{'passed':True,'candidate_sha256':sha(C),'cases':20,'signatures':sigs,'success_cases':success,'errors':dict(errors),'full_logs_and_states_equal':True,'scope':'Signed minimum-boundary and creator-fee precedence cases. Pool writes rolled back on failure are not directly observable; ordering is separately supported by original code.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--inputs',type=Path,required=True);p.add_argument('--producer',type=Path,required=True);p.add_argument('--observer',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate,a.inputs,a.producer,a.observer),indent=2))
