"""Verify signed creator payout/rent receipts; no VM execution."""
from pathlib import Path
import argparse,ast,base64,gzip,hashlib,json,sys,types,struct
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';TOKEN='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';TOKEN22='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';ATA='ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';SYS='11111111111111111111111111111111'
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';SIXTH='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6';NEG=[11,12,13,14,15,65,66,67,68,69]
PROGRAMS={AMM:'evidence/original/pump_amm/deployed.so',TOKEN:'evidence/dependencies/spl_token/deployed.so',TOKEN22:'evidence/dependencies/spl_token_2022/deployed.so',ATA:'evidence/dependencies/associated_token/deployed.so'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 m=types.ModuleType('checked');m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def inventory(d):return {str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'}
def check_manifest(d):assert inventory(d)==load(d/'manifest.json')['files']
def verify_reports(kit,directory,candidate):
 k=Path(kit);d=Path(directory);check_manifest(k);r=load(d/'report.json.gz');o=load(d/'transactions.json.gz');inputs=load(k/'runtime-inputs.json');clean=module(k/'cleaner.py').clean;digest=sha(candidate);negative=digest==SIXTH;expected_bad=NEG if negative else []
 assert r['candidate_sha256']==digest and r['original_sha256']==ORIGINAL and r['producer_sha256']==o['script_sha256']==sha(k/'probe.py')and o['observer_sha256']==sha(k/'observer.py');assert r['runtime_reads_before']==r['runtime_reads_after']==inputs
 for rel,h in inputs.items():
  if not rel.endswith('.so'):assert sha(k/'runtime-sources'/rel)==h
 assert sha(k/'cleaner.py')==inputs['repro/pump_amm/diagnostic-parity-20261027/compare_direct.py']
 tree=ast.parse((k/'probe.py').read_text());f=next(x for x in tree.body if isinstance(x,ast.FunctionDef)and x.name=='cases');scope={};exec(compile(ast.fix_missing_locations(ast.Module(body=[f],type_ignores=[])),'<cases>','exec'),scope);expected=json.loads(json.dumps(scope['cases']()));assert len(r['cases'])==r['case_count']==108 and len(o['transactions'])==o['transaction_count']==216
 specs={x['name']:x for x in load(k/'runtime-sources/evidence/upstream/pump_amm.json')['instructions']};sig=success=entries=0;bad=[]
 for i,row in enumerate(r['cases']):
  c=row['case'];assert c==expected[i];a,b=row['original'],row['candidate'];assert a['before']==b['before']and a['transaction_base64']==b['transaction_base64'];x,y=map(clean,[a,b]);diff=[key for key in x if x[key]!=y.get(key)];assert row['mismatched_fields']==diff
  if diff:bad.append(i)
  if i in expected_bad:
   assert diff==['logs']and a['error']==b['error']=='TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom(6023))))';assert x['logs']==[l.replace('AnchorError occurred.','AnchorError thrown in <source>.')for l in y['logs']]
  else:assert not diff
  success+=a['error']is None;entries+=any('Instruction: '+''.join(p.title()for p in c['instruction'].split('_'))in l for l in a['logs'])
  rent=c.get('rent',[3480,2.0,50]);expected_rent=dict(zip(['lamports_per_byte_year','exemption_threshold','burn_percent'],rent));assert a['rent']==b['rent']==expected_rent
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified']and len(v)==t['signature_count']==1;sig+=1;assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and q['transaction_base64']==t['transaction_base64'];ph=ORIGINAL if side=='original'else digest
   assert t['amm_program_sha256']==ph and set(t['loaded_programs'])==set(PROGRAMS)
   for pid,p in t['loaded_programs'].items():assert p['sha256']==(ph if pid==AMM else inputs[PROGRAMS[pid]])
   assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest();keys=list(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after'])and not set(q['before'])-set(keys)and set(keys)-set(q['before'])<=set(PROGRAMS)|{SYS};assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM and bytes(ix.data)==bytes(specs[c['instruction']]['discriminator']);named={spec['name']:keys[n]for spec,n in zip(specs[c['instruction']]['accounts'],ix.accounts)}
   vault=q['before'][named['coin_creator_vault_ata']];expected_lamports=c.get('vault_lamports',c.get('amount',1000)+2039280)
   if expected_lamports==0:assert vault is None
   else:assert vault['lamports']==expected_lamports and int.from_bytes(bytes.fromhex(vault['data_hex'])[64:72],'little')==c.get('amount',1000)
   dest=q['before'][named['pump_creator_vault']];assert(0 if dest is None else dest['lamports'])==c.get('dest_lamports',10**9)
   for phase in['before','after']:
    for account in q[phase].values():assert account is None or set(account)=={'data_hex','owner','lamports'}
 assert sig==o['signature_count']==216 and success==84 and entries==108 and bad==expected_bad and r['mismatch_count']==len(bad)
 return {'verified':True,'candidate_sha256':digest,'cases':108,'signatures':216,'mismatches':len(bad),'mismatch_indices':bad,'original_successes':84,'original_amm_invocations':108,'nondefault_rent_cases':28,'scope':'Synthetic offline rent values; observed log differences do not establish a default-network-Rent discrepancy.','executes_runtime':False}
def verify(directory,candidate=None):
 d=Path(directory);check_manifest(d);return verify_reports(d/'kit',d,Path(candidate)if candidate else d/'candidate.so')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path,nargs='?',default=HERE);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
