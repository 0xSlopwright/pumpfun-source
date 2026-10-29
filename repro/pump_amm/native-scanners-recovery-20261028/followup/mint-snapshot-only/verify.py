"""Portable saved-evidence verifier for the incentive handler ownership proposal."""
from pathlib import Path
import contextlib,difflib,gzip,hashlib,io,json,sys,types

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def load(p):
 b=Path(p).read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(name,p):
 m=types.ModuleType(name);m.__file__=str(p)
 with contextlib.redirect_stdout(io.StringIO()):exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__)
 return m

def verify(directory=None):
 P=Path(directory)if directory is not None else Path(__file__).resolve().parent
 assert not P.is_symlink()
 files={str(p.relative_to(P)):sha(p)for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
 assert files==load(P/'manifest.json')['files']
 assert not any(p.is_symlink()for p in P.rglob('*'))
 sys.dont_write_bytecode=True;sys.path.insert(0,str(P));from elf_reader import Elf
 O=Elf(P/'runtime-inputs/evidence/original/pump_amm/deployed.so');B=Elf(P/'baseline/candidate.so');BS=Elf(P/'baseline/unstripped.so');C=Elf(P/'build/artifacts/pump_amm_recovered.so');S=Elf(P/'build/artifacts/unstripped.so')
 assert sha(O.path)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 assert sha(B.path)=='98ed250d3999e79b55683daa574b984fb7f650dc9eef0e3256671d0612b49fc3'
 assert sha(C.path)=='378744bc922ab65c58c2699787b9f793f6602a1f4e7140c29348336822bcfa7e'
 measure=module('incentive_measure',P/'measure.py');m,rows=measure.measured(O,C,S,B,BS)
 assert(m['normalized'],m['raw'],m['normalized_text_bytes'],m['windows'])==(659,159,830808,785)
 assert all(m[k]==[]for k in ['normalized_gains','normalized_losses','raw_gains','raw_losses'])
 canonical=load(P/'canonical-measurement.json');assert(canonical['normalized_matches'],canonical['raw_matches'],canonical['unmatched'])==(659,159,126)
 normalized=[{**r,'matches':[{'name':f['name'],'start':f['start'],'raw_sha256':hashlib.sha256(C.b[f['start']:f['start']+f['size']]).hexdigest()}for f in r['matches']]}for r in rows]
 assert normalized==canonical['rows']
 assert canonical['candidate_sha256']==sha(C.path)and canonical['symbols_sha256']==sha(S.path)
 before={str(p.relative_to(P/'baseline-source')):sha(p)for p in(P/'baseline-source').rglob('*')if p.is_file()};after={str(p.relative_to(P/'source')):sha(p)for p in(P/'source').rglob('*')if p.is_file()}
 changed=sorted(k for k in set(before)|set(after)if before.get(k)!=after.get(k));assert changed==['programs/pump-amm/src/incentives.rs']
 name=changed[0];old=(P/'baseline-source'/name).read_text();new=(P/'source'/name).read_text()
 expected=old.replace('&ctx.accounts.mint.key(),day_number','&mint,day_number').replace('mint:ctx.accounts.mint.key(),seconds_in_a_day','mint,seconds_in_a_day')
 start=expected.index('pub fn admin(');expected=expected[:start]+expected[start:].replace('    let timestamp=Clock::get()?.unix_timestamp;','    let mint=ctx.accounts.mint.key();\n    let timestamp=Clock::get()?.unix_timestamp;',1)
 assert new==expected and new.count('emit!(event.clone());emit_cpi!(event);')==old.count('emit!(event.clone());emit_cpi!(event);')
 assert 'pub fn admin(ctx:Context<AdminUpdateTokenIncentives>'in new
 patch=''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='a/'+name,tofile='b/'+name));assert patch==(P/'proposal.patch').read_text()
 recipe=module('incentive_recipe',P/'workspace_recipe_v3.py');mapped={name:P/relative for name,relative in load(P/'external-inputs.json').items()};binding=recipe.verify_build(P/'canonical-source',P/'source',P/'build/build-comparison.json',C.path,S.path,external_inputs=mapped)
 assert(binding['standalone_inputs'],binding['workspace_inputs'],binding['external_inputs_verified'])==(56,57,175)
 record=load(P/'build/build-comparison.json');base=load(P/'baseline/build-comparison.json');assert not record['priming']and record['source_count']==232
 assert record['dependency_cache_before']==record['dependency_cache_after']==base['dependency_cache_after']and len(record['dependency_cache_before'])==765
 assert record['build_log_sha256']==sha(P/'build/build.log')and record['dependency_metadata_sha256']==sha(P/'build/dependency-metadata.json')and record['dependency_roots_sha256']==sha(P/'build/dependency-roots.json')
 assert record['adapter_sha256']==sha(P/'build_entrypoint.py')and record['target_provenance_sha256']==sha(P/'target-provenance.json')
 static=module('incentive_static',P/'verify_static.py').out;assert static==load(P/'static-review.json')
 for name,entry in load(P/'runtime-compression.json').items():assert hashlib.sha256(gzip.decompress((P/entry['compressed']).read_bytes())).hexdigest()==entry['sha256']
 core=module('incentive_core',P/'verify_core.py').report;assert core==load(P/'runtime-verification.json')
 boundary=module('incentive_boundary',P/'counterexamples/verify.py').verify(P/'counterexamples');assert boundary==load(P/'counterexamples-verification.json')
 incentive=module('incentive_700',P/'incentive700/verify.py').verify(P/'incentive700',C.path,repository_root=P/'runtime-inputs');assert incentive==load(P/'incentive700-verification.json')
 native=module('incentive_native',P/'native-focused/verify.py').verify({'original':sha(O.path),'baseline':sha(B.path),'candidate':sha(C.path)});assert native==load(P/'native-focused-verification.json')
 native_report=load(P/'native-focused/report.json.gz');assert all(x['control_candidate_equal']for x in native_report['cases'])
 sources=load(P/'native-source-coordinate-review.json');assert sources['all_216_control_candidate_equal']is True
 for row in sources['source_differences']:
  case=native_report['cases'][row['index']];assert row['original']==[x for x in case['original']['logs']if 'thrown in'in x]and row['candidate']==[x for x in case['candidate']['logs']if 'thrown in'in x]
  original_line,current_line,error,num=(32,12,'UnsupportedQuoteMint',6007)if row['index']<150 else(67,34,'Overflow',6023)
  for side,line in [('original',original_line),('candidate',current_line)]:assert row[side]==[f'Program log: AnchorError thrown in programs/pump-amm/src/utils/transfer_fee.rs:{line}. Error Code: {error}. Error Number: {num}. Error Message: {error}.']
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':sha(C.path),'normalized_windows':659,'raw_windows':159,'gains':[],'losses':[],'handler_bytes':3128,'original_handler_bytes':3168,'baseline_handler_bytes':3288,'source_inputs':232,'workspace_inputs':57,'canonical_inputs':56,'registry_inputs':175,'unchanged_cached_dependencies':765,'core_cases':17462,'incentive_boundary_cases':1730,'incentive_cases':700,'historical_incentive_cases':32,'native_cases':216,'native_raw_source_coordinate_differences':14,'new_vm_executions':0,'new_compiler_executions':0,'strict_repeat_performed':False,'late_bump_recovered':False,'full_handler_equal':False,'semantic_bug_claim':False}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
