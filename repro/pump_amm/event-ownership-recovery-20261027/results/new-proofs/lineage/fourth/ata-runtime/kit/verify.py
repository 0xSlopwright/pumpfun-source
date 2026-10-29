"""Authenticate sixty focused ATA edge cases and their full signed state/results."""
from pathlib import Path
import argparse,ast,base64,gzip,hashlib,json,sys,types
from solders.transaction import Transaction
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';SYSTEM='11111111111111111111111111111111';ATA='ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
BINS={AMM:'evidence/original/pump_amm/deployed.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so',ATA:'evidence/dependencies/associated_token/deployed.so'}
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 p=Path(p);m=types.ModuleType('checked_ata');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def check_inventory(d):
 d=Path(d);files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'};assert files==load(d/'manifest.json')['files'];assert not any(p.is_symlink()for p in d.rglob('*'))
def verify_output(directory,candidate,output,expected_bad=0):
 assert expected_bad==0;d=Path(directory);out=Path(output);check_inventory(d);r=load(out/'report.json.gz');o=load(out/'transactions.json.gz');cd=sha(candidate);inputs=load(d/'runtime-inputs.json');clean=module(d/'cleaner.py').clean;assert r['candidate_sha256']==cd and r['original_sha256']==ORIGINAL;assert r['producer_sha256']==o['script_sha256']==sha(d/'probe.py')and o['observer_sha256']==sha(d/'observer.py');assert r['runtime_reads_before']==r['runtime_reads_after']==inputs;assert r['case_count']==len(r['cases'])==60 and o['transaction_count']==len(o['transactions'])==120
 tree=ast.parse((d/'probe.py').read_text());node=next(n for n in tree.body if isinstance(n,ast.Assign)and any(isinstance(t,ast.Name)and t.id=='PROFILES'for t in n.targets));profiles=ast.literal_eval(node.value);expected=[{'family':f,**p}for f in ['buy','exact','sell','sweep_protocol','sweep_creator']for p in profiles];sigs=success=atas=0;messages=[];originals=[]
 for i,row in enumerate(r['cases']):
  c=row['case'];assert c==expected[i];a,b=row['original'],row['candidate'];assert a['before']==b['before']and a['transaction_base64']==b['transaction_base64'];assert clean(a)==clean(b)and row['mismatched_fields']==[];success+=a['error']is None;atas+=a['ata_invocations']
  for j,side in enumerate(['original','candidate']):
   q=row[side];t=o['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);v=tx.verify_with_results();assert v and all(v)and t['all_signatures_verified']and len(v)==t['signature_count']==1;sigs+=1;assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256']and t['transaction_base64']==q['transaction_base64'];pd=ORIGINAL if side=='original'else cd;assert t['amm_program_sha256']==pd and t['loaded_programs'][AMM]['sha256']==pd;assert t['error']==q['error']and t['logs_sha256']==hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest();assert q['ata_invocations']==sum(line.startswith('Program '+ATA+' invoke [')for line in q['logs'])
   for pid,p in t['loaded_programs'].items():assert pid in BINS and t['loaded_programs'][pid]['sha256']==(pd if pid==AMM else inputs[BINS[pid]])
   keys=list(map(str,tx.message.account_keys));assert set(q['before'])==set(q['after'])and not set(q['before'])-set(keys)and set(keys)-set(q['before'])<=set(t['loaded_programs'])|{SYSTEM};assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM;di=ix.accounts[7]if c['family'].startswith('sweep')else ix.accounts[-1];dest=keys[di];before=q['before'][dest]
   if c.get('empty'):assert before is None or before['data_hex']==''
   if c.get('poor'):assert q['before'][keys[0]]['lamports']==5000
   if c.get('frozen'):assert bytes.fromhex(before['data_hex'])[108]==2
   if c.get('wrong_owner'):assert before['owner']==SYSTEM
   if c.get('wrong_mint'):
    qi=3 if c['family'].startswith('sweep')else 4;assert bytes.fromhex(before['data_hex'])[:32]!=bytes(tx.message.account_keys[ix.accounts[qi]])
   if c.get('token22'):
    ti=4 if c['family'].startswith('sweep')else 12;assert keys[ix.accounts[ti]]=='TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
   if c.get('token_owned'):assert before['owner'] in ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb']
   if c.get('zero'):
    if c['family'].startswith('sweep'):
     pool=q['before'][keys[ix.accounts[2]]];off=271 if c['family']=='sweep_protocol'else 279;assert int.from_bytes(bytes.fromhex(pool['data_hex'])[off:off+8],'little')==0
    else:assert int.from_bytes(bytes.fromhex(q['before'][keys[ix.accounts[2]]]['data_hex'])[899:907],'little')==0
   if c.get('readonly'):
    hd=tx.message.header;writable=di<(hd.num_required_signatures-hd.num_readonly_signed_accounts)if di<hd.num_required_signatures else di<len(keys)-hd.num_readonly_unsigned_accounts;assert not writable
   if c.get('zero'):assert q['ata_invocations']==0 and q['before'][dest]==q['after'][dest]
   for phase in ['before','after']:
    for account in q[phase].values():assert account is None or set(account)=={'data_hex','owner','lamports'}
  messages.append(o['transactions'][2*i]['transaction_sha256']);originals.append(a)
 assert r['mismatch_count']==0 and sigs==o['signature_count']==120 and success==33 and atas==20;record=load(out/'run.json');assert record['inputs_before']==record['inputs_after']==inputs and record['candidate_sha256']==record['candidate_after_sha256']==cd and record['bytecode_cache_initially_absent_and_not_written']is True and record['packet_manifest_sha256']==sha(d/'manifest.json')and record['expected_bad']==0
 return {'verified':True,'candidate_sha256':cd,'cases':60,'mismatches':0,'verified_signatures':sigs,'original_successes':success,'original_ata_invocations':atas,'messages':messages,'originals':originals,'executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=HERE);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--reports',type=Path,required=True);a=p.parse_args();r=verify_output(a.directory,a.candidate,a.reports);print(json.dumps({k:v for k,v in r.items()if k not in ['messages','originals']},indent=2))
