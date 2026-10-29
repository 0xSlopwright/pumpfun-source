"""Verify24 signed cashback/optional-u64 precedence cases without a VM."""
from pathlib import Path
import argparse,ast,base64,gzip,hashlib,json,types
from solders.transaction import Transaction
HERE=Path(__file__).resolve().parent
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';SYS='11111111111111111111111111111111';ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
PROGRAMS={AMM:'evidence/original/pump_amm/deployed.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 m=types.ModuleType('checked');m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def inventory(d):return{str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'}
def check_manifest(d):assert inventory(d)==load(d/'manifest.json')['files']
def verify_reports(kit,directory,candidate):
 k=Path(kit);d=Path(directory);check_manifest(k);r=load(d/'report.json.gz');o=load(d/'transactions.json.gz');inp=load(k/'runtime-inputs.json');clean=module(k/'cleaner.py').clean;digest=sha(candidate);assert r['candidate_sha256']==digest and r['original_sha256']==ORIGINAL;assert r['producer_sha256']==o['script_sha256']==sha(k/'probe.py')and o['observer_sha256']==sha(k/'observer.py');assert r['runtime_reads_before']==r['runtime_reads_after']==inp
 for rel,h in inp.items():
  if not rel.endswith('.so'):assert sha(k/'runtime-sources'/rel)==h
 tree=ast.parse((k/'probe.py').read_text());fn=next(n for n in tree.body if isinstance(n,ast.FunctionDef)and n.name=='cases');scope={};exec(compile(ast.Module(body=[fn],type_ignores=[]),'<cases>','exec'),scope);expected=scope['cases']();assert len(expected)==r['case_count']==len(r['cases'])==24 and o['transaction_count']==len(o['transactions'])==48;sig=0;invalid=0;blocked=0
 for i,row in enumerate(r['cases']):
  case=row['case'];assert case==expected[i];a,b=row['original'],row['candidate'];assert a['before']==b['before']and a['transaction_base64']==b['transaction_base64']and clean(a)==clean(b)and row['mismatched_fields']==[]
  tail=bytes.fromhex(case['optional_hex'])[1:];rest=tail[8:]if len(tail)>=8 else tail;is_bad=any(v>1 for v in rest[:2]);code=102 if is_bad else 6050 if case['cashback_enabled']else 6049;invalid+=is_bad;blocked+=not is_bad;assert a['error']==f'TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom({code}))))'
  inner_count=sum(len(group)for group in a['inner'])
  if is_bad:assert inner_count==0
  else:assert inner_count>0
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64']);tx=Transaction.from_bytes(raw);assert len(tx.signatures)==t['signature_count']==1 and all(tx.verify_with_results())and t['all_signatures_verified'];sig+=1;assert q['transaction_base64']==t['transaction_base64']and hashlib.sha256(raw).hexdigest()==t['transaction_sha256'];assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest();ph=ORIGINAL if j==0 else digest;assert t['amm_program_sha256']==ph and set(t['loaded_programs'])==set(PROGRAMS)
   for pid,path in PROGRAMS.items():assert t['loaded_programs'][pid]['sha256']==(ph if pid==AMM else inp[path])
   keys=list(map(str,tx.message.account_keys));assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM and bytes(ix.data)[59:]==bytes.fromhex(case['optional_hex']);assert set(q['before'])==set(q['after'])and set(q['before'])<=set(keys)and set(keys)-set(q['before'])<=set(PROGRAMS)|{SYS};cfg=q['before'][keys[ix.accounts[1]]];assert bytes.fromhex(cfg['data_hex'])[642]==case['cashback_enabled']
 assert sig==o['signature_count']==48 and invalid==10 and blocked==14 and r['mismatch_count']==0
 return {'verified':True,'candidate_sha256':digest,'cases':24,'signatures':48,'mismatches':0,'invalid_bool_before_handler':10,'valid_parse_reaches_cashback_guards':14,'executes_runtime':False}
def verify(directory,candidate=None):
 d=Path(directory);check_manifest(d);return verify_reports(d/'kit',d,Path(candidate)if candidate else d/'candidate.so')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path,nargs='?',default=HERE);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
