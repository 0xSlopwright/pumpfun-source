"""Offline verification of the signed OptionalU64 partial-tail counterexamples."""
from pathlib import Path
from functools import cache
import argparse,ast,base64,gzip,hashlib,json,struct,types,collections
from solders.transaction import Transaction
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify(directory,candidate=None,expected_bad=123):
 D=Path(directory);I=D/'input-root';C=Path(candidate)if candidate else D/'candidate.so';binding=load(D/'inputs.json')
 if(D/'manifest.json').exists():assert {str(p.relative_to(D)):sha(p)for p in D.rglob('*')if p.is_file()and p!=D/'manifest.json'}==load(D/'manifest.json')['files']
 assert{str(p.relative_to(I)):sha(p)for p in I.rglob('*')if p.is_file()}==binding['input_files'];assert sha(C)==binding['candidate_sha256']
 r=load(D/'report.json');o=load(D/'transactions.json.gz');assert r['candidate_sha256']==sha(C)and r['original_sha256']==sha(I/'evidence/original/pump_amm/deployed.so')
 producer=I/'work/probes/probe_optional_u64.py';assert r['producer_sha256']==o['script_sha256']==sha(producer);assert o['observer_sha256']==sha(I/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
 tree=ast.parse(producer.read_text());f=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');scope={'struct':struct};exec(compile(ast.Module(body=[f],type_ignores=[]),'<cases>','exec'),scope);cases=scope['cases']();assert len(cases)==r['case_count']==len(r['cases'])==264
 assert len(o['transactions'])==o['transaction_count']==528
 AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';programs={'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'spl_token','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'spl_token_2022','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'associated_token'};disc=bytes(next(x for x in load(I/'evidence/upstream/pump_amm.json')['instructions']if x['name']=='create_pool')['discriminator']);bad=[];sigs=0;categories=collections.Counter();state_differences=0
 for i,row in enumerate(r['cases']):
  assert row['case']==cases[i];x,y=row['original'],row['candidate'];diff=[k for k in x if k!='logs'and x[k]!=y[k]];assert diff==row['diff'];assert x['full_before']==y['full_before']
  if diff:
   bad.append(i);assert cases[i]['bytes_available_to_u64']<8;categories['original_success_candidate_error'if x['error']is None else'original_error_candidate_success'if y['error']is None else'different_errors']+=1;state_differences+=x['full_after']!=y['full_after']
  pair=[]
  for j,side in enumerate(['original','candidate']):
   t=o['transactions'][2*i+j];v=row[side];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results())and tx.signatures;assert t['signature_count']==len(tx.signatures);sigs+=len(tx.signatures);assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256'];assert t['sequence']==2*i+j and t['transaction_base64']==v['transaction_base64'];assert t['error']==v['error'];assert t['logs_sha256']==hashlib.sha256(json.dumps(v['logs'],separators=(',',':')).encode()).hexdigest();assert set(t['loaded_programs'])=={AMM,*programs};h=r['original_sha256']if side=='original'else r['candidate_sha256'];assert t['amm_program_sha256']==t['loaded_programs'][AMM]['sha256']==h
   for pid,name in programs.items():assert t['loaded_programs'][pid]['sha256']==sha(I/'evidence/dependencies'/name/'deployed.so')
   assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert str(tx.message.account_keys[ix.program_id_index])==AMM;data=bytes(ix.data);assert data[:8]==disc and data[59:]==bytes.fromhex(cases[i]['optional_hex']);assert any('Instruction: CreatePool'in line for line in v['logs'])
   for key,state in v['states'].items():
    recorded=v['full_after'][key];assert (state is None and recorded is None)or(state['data']==recorded['data_hex']and state['owner']==recorded['owner']and state['lamports']==recorded['lamports'])
   pair.append(raw)
  assert pair[0]==pair[1]
 assert bad==r['mismatches']and len(bad)==expected_bad;assert sigs==o['signature_count']==528
 return {'verified':True,'candidate_sha256':sha(C),'cases':264,'transactions':528,'signatures':sigs,'mismatches':len(bad),'classification':dict(categories),'different_final_snapshots':state_differences,'all_mismatches_have_fewer_than_8_u64_bytes':True,'scope':__doc__,'vm_executed':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--candidate',type=Path);p.add_argument('--expected-bad',type=int,default=123);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate,a.expected_bad),indent=2))
