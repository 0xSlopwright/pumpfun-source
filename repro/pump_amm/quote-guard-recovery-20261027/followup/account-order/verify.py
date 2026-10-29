"""Read-only verification of saved signed account-validation order probes."""
from pathlib import Path
import argparse,ast,base64,gzip,hashlib,json,sys,types,struct
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';TOKEN='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';TOKEN22='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';ATA='ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';SYS='11111111111111111111111111111111'
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
PROGRAMS={AMM:'evidence/original/pump_amm/deployed.so',TOKEN:'evidence/dependencies/spl_token/deployed.so',TOKEN22:'evidence/dependencies/spl_token_2022/deployed.so',ATA:'evidence/dependencies/associated_token/deployed.so'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 m=types.ModuleType('checked');m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def inventory(d):return {str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'}
def check_manifest(d):assert inventory(d)==load(d/'manifest.json')['files']
def verify(directory=HERE,candidate=None):
 d=Path(directory);check_manifest(d);r=load(d/'report.json.gz');o=load(d/'transactions.json.gz');inputs=load(d/'runtime-inputs.json');clean=module(d/'cleaner.py').clean;digest=sha(candidate or d/'candidate.so')
 assert r['candidate_sha256']==digest and r['original_sha256']==ORIGINAL and r['producer_sha256']==o['script_sha256']==sha(d/'probe.py')and o['observer_sha256']==sha(d/'observer.py');assert r['runtime_reads_before']==r['runtime_reads_after']==inputs
 for rel,h in inputs.items():
  if not rel.endswith('.so'):assert sha(d/'runtime-sources'/rel)==h
 assert sha(d/'cleaner.py')==inputs['repro/pump_amm/diagnostic-parity-20261027/compare_direct.py']
 tree=ast.parse((d/'probe.py').read_text());f=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');scope={};exec(compile(ast.fix_missing_locations(ast.Module(body=[f],type_ignores=[])),'<cases>','exec'),scope);expected=json.loads(json.dumps(scope['cases']()));assert len(r['cases'])==r['case_count']==255 and len(o['transactions'])==o['transaction_count']==510
 specs={x['name']:x for x in load(d/'runtime-sources/evidence/upstream/pump_amm.json')['instructions']};signatures=successes=entries=0;counts={};outcomes={}
 for i,row in enumerate(r['cases']):
  c=row['case'];assert c==expected[i];a,b=row['original'],row['candidate'];assert a['before']==b['before']and a['transaction_base64']==b['transaction_base64']and clean(a)==clean(b)and row['mismatched_fields']==[];successes+=a['error']is None;entries+=any('Instruction: '+''.join(x.title()for x in c['instruction'].split('_'))in l for l in a['logs']);counts[c['instruction']]=counts.get(c['instruction'],0)+1;outcomes[a['error'] or 'success']=outcomes.get(a['error'] or 'success',0)+1
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified']and len(v)==t['signature_count']==1;signatures+=1;assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and q['transaction_base64']==t['transaction_base64'];ph=ORIGINAL if side=='original'else digest
   expected_programs={AMM,TOKEN,TOKEN22}|({ATA}if c['instruction']=='create_pool'else set());assert t['amm_program_sha256']==ph and set(t['loaded_programs'])==expected_programs
   for pid,p in t['loaded_programs'].items():assert p['sha256']==(ph if pid==AMM else inputs[PROGRAMS[pid]])
   assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest();keys=list(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after'])and not set(q['before'])-set(keys)and set(keys)-set(q['before'])<=expected_programs|{SYS};assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM and bytes(ix.data)[:8]==bytes(specs[c['instruction']]['discriminator']);metas=[keys[n]for n in ix.accounts]
   if c['instruction']=='create_pool':assert struct.unpack_from('<HQQ',bytes(ix.data),8)==(0,c.get('base_amount',10**9),c.get('quote_amount',10**9))
   else:assert struct.unpack_from('<QQQ',bytes(ix.data),8)==(c.get('amount',1000000),c.get('maxbase',0 if c['instruction']=='withdraw'else 2**64-1),c.get('maxquote',0 if c['instruction']=='withdraw'else 2**64-1))
   for change in c['changes']:
    acc=q['before'][metas[change['index']]]
    if'owner'in change:assert acc['owner']==change['owner']
    if'at'in change:b=bytes.fromhex(change['hex']);assert bytes.fromhex(acc['data_hex'])[change['at']:change['at']+len(b)]==b
   for phase in['before','after']:
    for account in q[phase].values():assert account is None or set(account)=={'data_hex','owner','lamports'}
 assert signatures==o['signature_count']==510 and successes==23 and entries==255 and r['mismatch_count']==0
 return {'verified':True,'candidate_sha256':digest,'cases':255,'signatures':510,'mismatches':0,'original_successes':23,'original_amm_invocations':entries,'instruction_counts':counts,'outcomes':outcomes,'executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path,nargs='?',default=HERE);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
