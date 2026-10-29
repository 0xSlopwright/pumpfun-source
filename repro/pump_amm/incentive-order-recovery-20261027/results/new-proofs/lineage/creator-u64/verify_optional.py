"""Independent recount of the fixed264 signed OptionalU64 cases; no VM."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,types
from solders.transaction import Transaction
HERE=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(p):
 m=types.ModuleType('audited');m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def verify(directory,candidate):
 d=Path(directory);man=load(d/'manifest.json');assert{str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'}==man['files'];r=load(d/'positive.json.gz');old=load(d/'negative.json.gz');obs=load(d/'transactions.json.gz');digest=sha(candidate);clean=module(d/'cleaner.py').clean;model=module(d/'reader-model.py').model
 assert r['candidate_sha256']==digest=='8e7ee19971082d7035f7cf356948ec50ed83fc91618905172c5b6871f6363a06'and r['original_sha256']==old['original_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';assert r['producer_sha256']==old['producer_sha256']==obs['script_sha256']==sha(d/'producer.py');assert len(r['cases'])==r['case_count']==len(old['cases'])==264 and len(obs['transactions'])==obs['transaction_count']==528
 ref=load(d/'reference.json');assert ref['reader_review_manifest']=='359e84e98bbfd673509a818787508d9cae0c2f542231409eb050a433f82ea4a7';assert sha(d/'negative.json.gz')==ref['negative_report_compressed_sha256'];sigs=0;old_bad=[]
 for i,(row,prior)in enumerate(zip(r['cases'],old['cases'])):
  assert row['case']==prior['case'];a,b=row['original'],row['candidate'];assert clean(a)==clean(b)and clean(a)==clean(prior['original'])and row['diff']==[];assert a['transaction_base64']==b['transaction_base64']==prior['original']['transaction_base64']and a['full_before']==b['full_before'];pred=model(bytes.fromhex(row['case']['optional_hex']),'slice_exact');error=pred['expected_error'];assert(a['error']is None)if error is None else f'InstructionErrorCustom({error})'in a['error']
  if clean(prior['original'])!=clean(prior['candidate']):old_bad.append(i)
  for j,side in enumerate(['original','candidate']):
   v=row[side];t=obs['transactions'][2*i+j];raw=base64.b64decode(t['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);assert len(tx.signatures)==1 and all(tx.verify_with_results())and t['all_signatures_verified'];sigs+=1;assert t['sequence']==2*i+j and t['signature_count']==1 and t['transaction_sha256']==hashlib.sha256(raw).hexdigest()and v['transaction_base64']==t['transaction_base64'];assert t['error']==v['error']and t['logs_sha256']==hashlib.sha256(json.dumps(v['logs'],separators=(',',':')).encode()).hexdigest();assert t['amm_program_sha256']==t['loaded_programs'][ref['amm']]['sha256']==(r['original_sha256']if j==0 else digest)
   assert set(t['loaded_programs'])=={ref['amm'],*ref['dependencies']}
   for pid,h in ref['dependencies'].items():assert t['loaded_programs'][pid]['sha256']==h
   keys=list(map(str,tx.message.account_keys));assert len(tx.message.instructions)==1;ix=tx.message.instructions[0];assert keys[ix.program_id_index]==ref['amm']and bytes(ix.data)[59:]==bytes.fromhex(row['case']['optional_hex']);assert set(v['full_before'])==set(v['full_after'])and set(v['full_before'])<=set(keys)
 assert sigs==obs['signature_count']==528 and old_bad==old['mismatches']and len(old_bad)==123 and r['mismatches']==[]
 return {'verified':True,'candidate_sha256':digest,'cases':264,'signatures':528,'full_field_and_log_mismatches':0,'unchanged_original_cases':264,'fixed_prior_cases':123,'reader_model_mismatches':0,'executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path);p.add_argument('--candidate',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
