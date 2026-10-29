"""Verify the retained267 signed creator-transfer cases without executing a VM."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys,types
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';TOKEN='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';TOKEN22='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';ATA='ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';SYS='11111111111111111111111111111111';ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
PROGRAMS={AMM:'evidence/original/pump_amm/deployed.so',TOKEN:'evidence/dependencies/spl_token/deployed.so',TOKEN22:'evidence/dependencies/spl_token_2022/deployed.so',ATA:'evidence/dependencies/associated_token/deployed.so'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 m=types.ModuleType('checked');m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def inventory(d):return {str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'}
def check_manifest(d):assert inventory(d)==load(d/'manifest.json')['files']
def verify_reports(kit,directory,candidate):
 k=Path(kit);d=Path(directory);check_manifest(k);r=load(d/'report.json.gz');o=load(d/'transactions.json.gz');inputs=load(k/'runtime-inputs.json');clean=module(k/'cleaner.py').clean;digest=sha(candidate)
 assert r['candidate_sha256']==digest and r['original_sha256']==ORIGINAL and r['producer_sha256']==o['script_sha256']==sha(k/'probe.py')and o['observer_sha256']==sha(k/'observer.py');assert r['runtime_reads_before']==r['runtime_reads_after']==inputs
 for rel,h in inputs.items():
  if not rel.endswith('.so'):assert sha(k/'runtime-sources'/rel)==h
 assert sha(k/'cleaner.py')==inputs['repro/pump_amm/diagnostic-parity-20261027/compare_direct.py'];expected=load(k/'roster.json');assert len(r['cases'])==r['case_count']==len(expected)==267 and len(o['transactions'])==o['transaction_count']==534
 specs={x['name']:x for x in load(k/'runtime-sources/evidence/upstream/pump_amm.json')['instructions']};execref=load(k/'executable-reference.json');sig=success=entries=0
 for i,row in enumerate(r['cases']):
  c=row['case'];assert c==expected[i];a,b=row['original'],row['candidate'];assert a['before']==b['before']and a['transaction_base64']==b['transaction_base64']and clean({k:v for k,v in a.items()if k not in ['executable_before','executable_after']})==clean({k:v for k,v in b.items()if k not in ['executable_before','executable_after']})and row['mismatched_fields']==[];success+=a['error']is None;entries+=any('Instruction: '+''.join(p.title()for p in c['instruction'].split('_'))in l for l in a['logs']);assert a['rent']==b['rent']==dict(lamports_per_byte_year=3480,exemption_threshold=2.0,burn_percent=50)
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified']and len(v)==t['signature_count']==1;sig+=1;assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and q['transaction_base64']==t['transaction_base64'];ph=ORIGINAL if side=='original'else digest
   assert t['amm_program_sha256']==ph and set(t['loaded_programs'])==set(PROGRAMS)
   for pid,p in t['loaded_programs'].items():assert p['sha256']==(ph if pid==AMM else inputs[PROGRAMS[pid]])
   assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest();keys=list(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after']) and q['executable_before']==q['executable_after'];assert set(q['before']).isdisjoint(q['executable_before']) and set(q['before'])|set(q['executable_before'])==set(keys);assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM and bytes(ix.data)==bytes(specs[c['instruction']]['discriminator'])
   alias_source=None
   if c['case'].startswith('substitute='):
    role=specs[c['instruction']]['accounts'][int(c['case'].split('=')[1])]['name'];alias_source={'token_program':TOKEN,'system_program':SYS,'associated_token_program':ATA,'program':AMM}.get(role)
   for address,account in q['executable_before'].items():
    key=address
    if key not in execref:
     assert key=='71nJjoSudYSAR4GApb2mtugtj8iuwf6yjKKQBpzKVehv'and alias_source;key=alias_source
    expected_account=dict(execref[key])
    if key==AMM and side=='candidate':
     expected_account.update(data_sha256=digest,data_len=Path(candidate).stat().st_size,lamports=(Path(candidate).stat().st_size+128)*6960)
    assert account==expected_account,(i,side,address,account,expected_account)
   for phase in['before','after']:
    for account in q[phase].values():assert account is None or set(account)=={'data_hex','owner','lamports'}
 assert sig==o['signature_count']==534 and success==196 and entries==267 and r['mismatch_count']==0
 return {'verified':True,'candidate_sha256':digest,'cases':267,'signatures':534,'mismatches':0,'original_successes':196,'original_amm_invocations':entries,'executes_runtime':False}
def verify(directory,candidate=None):
 d=Path(directory);check_manifest(d);return verify_reports(d/'kit',d,Path(candidate)if candidate else d/'candidate.so')
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path,nargs='?',default=HERE);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
