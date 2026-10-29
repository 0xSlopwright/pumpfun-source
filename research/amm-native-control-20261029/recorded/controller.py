#!/usr/bin/env python3
"""One disclosed native control; one borrow-result candidate only after exact control."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,os,shutil,subprocess,sys,tarfile
sys.dont_write_bytecode=True
N=Path(__file__).resolve().parent;R=N.parents[2];D=N.parent;REF=N/'reference';SOURCE=N/'source';TARGET=N/'target'
SDK=Path('/workspace/toolchains/v1.44');CARGO=Path('/workspace/pumpfun-source-latest/work/amm-union3/native-baseline-retry/cargo-home');SEED=Path('/workspace/pumpfun-source-latest/work/amm-union3/target')
REV='1285b5e9e3a29c1e2cf32246d6046035e5d66fad';PACK='research/amm-layout-closure-20261028/'
EXPECTED={'candidate.so':'86dbc2c64e81988dead173039b61fa01ba5f68a00fbb6f6dd49f2cda0afec37f','symbols.so':'7271aaf8afe13b6c8f13a6cf0e9534896a66650dda13a2aa1b32e41edd46426d'}
sha=lambda b:hashlib.sha256(b).hexdigest()
def digest(p):return sha(Path(p).read_bytes())
def dump(p,x):Path(p).write_text(json.dumps(x,indent=2,sort_keys=True)+'\n')
def files(p):return {str(q.relative_to(p)):digest(q)for q in sorted(p.rglob('*'))if q.is_file()}
def module(p,name):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def archive(source,out):
 with tarfile.open(out,'w:gz')as a:
  for p in sorted(source.rglob('*')):
   if p.is_file():a.add(p,arcname=p.relative_to(source))
def git(relative):return subprocess.check_output(['git','show',REV+':'+relative],cwd=R)
def sdk_check():
 expected=json.loads(gzip.decompress((REF/'sdk-sha256.json.gz').read_bytes()));actual=files(SDK);assert actual==expected,'SDK input drift (including actual rust-lld/driver/libs)';return actual
def dependency_check():return module(REF/'build.py','native_original_builder').dependencies(SOURCE/'Cargo.lock',CARGO)
def prepare():
 assert not (N/'plan.json').exists(),'Already prepared'
 REF.mkdir();
 for name in ['build.py','workspace_recipe.py','rustc_wrapper.py','linker_wrapper.py','ordered.ld','default.ld']:(REF/name).write_bytes(git(PACK+name))
 (REF/'sdk-sha256.json.gz').write_bytes(git(PACK+'results/build-a/sdk-sha256.json.gz'))
 (REF/'root-rustc-invocation.json').write_bytes(git(PACK+'results/build-a/root-rustc-invocation.json'))
 physical=Path('/workspace/pumpfun-source-latest/scripts/pump_physical_source_wrapper.py');shutil.copy2(physical,REF/'physical_source_wrapper.py');(REF/'physical_source_wrapper.py').chmod(0o700)
 frozen=D/'canonical-checked-comparison/fixed-context-source';expected=json.loads((D/'layout-frontier-reconcile/build-record.json').read_text())['workspace_sha256'];assert files(frozen)==expected
 shutil.copytree(frozen,SOURCE,copy_function=shutil.copy2);assert files(SOURCE)==expected
 seed_before=files(SEED);assert SEED.is_dir()and not SEED.is_symlink()and TARGET!=SEED
 TARGET.mkdir();copy_cmd=['cp','-a','--reflink=auto',str(SEED)+'/.',str(TARGET)];subprocess.run(copy_cmd,check=True);assert files(TARGET)==seed_before
 for p in TARGET.rglob('*'):
  if p.is_file():assert p.stat().st_ino!=(SEED/p.relative_to(TARGET)).stat().st_ino or p.stat().st_dev!=(SEED/p.relative_to(TARGET)).stat().st_dev,'Target is hardlinked to protected seed'
 assert files(SEED)==seed_before
 adapted={}
 for mode in ['control','candidate']:
  out=N/mode;out.mkdir();adapted[mode]={}
  for name,count in [('rustc_wrapper.py',2),('linker_wrapper.py',5)]:
   original=(REF/name).read_text();assert original.count('/out/')==count
   new=original.replace('/out/',str(out)+'/');(out/name).write_text(new);(out/name).chmod(0o700)
   assert new.replace(str(out)+'/', '/out/')==original
   adapted[mode][name]={'reference_sha256':digest(REF/name),'adapted_sha256':digest(out/name),'literal_substitutions':count,'from':'/out/','to':str(out)+'/','other_logic_changes':False}
  shutil.copy2(REF/'ordered.ld',out/'ordered.ld')
 dispatcher='''#!/usr/bin/python3
# Native transport: original root wrapper; qualified registry argv canonicalizer for other crates.
import os,sys
from pathlib import Path
p=Path(__file__).resolve().parent
compiler,*args=sys.argv[1:]
root='--crate-name' in args and args[args.index('--crate-name')+1]=='pump_amm_recovered'
wrapper=Path(os.environ['AMM_NATIVE_ROOT_WRAPPER']) if root else p/'reference/physical_source_wrapper.py'
os.execv(str(wrapper),[str(wrapper),compiler,*args])
'''
 (N/'dispatcher.py').write_text(dispatcher);(N/'dispatcher.py').chmod(0o700)
 sdk=sdk_check();deps=dependency_check();(N/'dependency-inputs.json.gz').write_bytes(gzip.compress(json.dumps(deps,sort_keys=True).encode(),mtime=0));dump(N/'seed-before.json',seed_before)
 plan={'schema':'native-transport-only-v1','commit':REV,'controller_sha256':digest(__file__),'reference_sha256':files(REF),'workspace_sha256':expected,'protected_seed':str(SEED),'owned_target':str(TARGET),'seed_copy_command':copy_cmd,'seed_snapshot_sha256':digest(N/'seed-before.json'),'sdk_files':len(sdk),'sdk_manifest_sha256':digest(REF/'sdk-sha256.json.gz'),'registry_packages':len(deps),'archive_files':sum(len(p['archive_files'])for p in deps),'dependencies_sha256':digest(N/'dependency-inputs.json.gz'),'adapted_wrappers':adapted,'dispatcher_sha256':digest(N/'dispatcher.py'),'transport_changes':['Container process launch replaced by native SDK process launch; same authenticated input bytes.','Frozen wrapper logic unchanged except literal /out/ paths replaced with owned per-build output paths.','Dispatcher routes root to the original path-adapted linker-selection wrapper and other crates through the unchanged previously qualified registry-source symlink canonicalizer.','Cargo clean explicitly rebuilds BOTH local crates; external dependencies may be reused from an independent seed copy.','Cargo jobs=2 is scheduling only; no source/codegen/link-order flag change.'],'source_or_object_or_output_byte_patch':False,'section_order_script_sha256':digest(REF/'ordered.ld'),'expected_control':EXPECTED,'candidate_hypothesis_patch_sha256':digest(D/'layout-frontier-reconcile/single-hypothesis.patch')}
 dump(N/'plan.json',plan);print(json.dumps({'prepared':True,'controller':str(Path(__file__)),'controller_sha256':digest(__file__),'plan_sha256':digest(N/'plan.json'),'sdk_files':len(sdk),'workspace_inputs':len(expected),'registry_packages':len(deps),'target_copy_bytes':sum(p.stat().st_size for p in TARGET.rglob('*')if p.is_file())}),flush=True)
def run(mode):
 plan=json.loads((N/'plan.json').read_text());assert digest(__file__)==plan['controller_sha256']and files(REF)==plan['reference_sha256']and digest(N/'dispatcher.py')==plan['dispatcher_sha256'];out=N/mode
 assert not (out/'attempt-started.json').exists(),'Exactly one attempt per mode'
 assert files(SEED)==json.loads((N/'seed-before.json').read_text()),'Protected seed changed before attempt'
 assert sdk_check()and dependency_check()==json.loads(gzip.decompress((N/'dependency-inputs.json.gz').read_bytes()))
 expected=dict(plan['workspace_sha256']);assert files(SOURCE)==expected,'Control source drift'
 if mode=='candidate':
  control=json.loads((N/'control/record.json').read_text());assert control['control_exact']and control['hashes']==EXPECTED,'Candidate forbidden without both exact control ELFs'
  p=SOURCE/'programs/pump-amm/src/instructions/swap/sell.rs';s=p.read_text();old='    let data = user_volume_accumulator.try_borrow_data()?;';new='    let data = match user_volume_accumulator.try_borrow_data() { Ok(data) => data, Err(error) => return Err(error.into()) };';assert s.count(old)==1
  value=s.replace(old,new);assert value.count('\n')==s.count('\n');p.write_text(value);expected[str(p.relative_to(SOURCE))]=digest(p)
 assert files(SOURCE)==expected
 for name in ['rustc_wrapper.py','linker_wrapper.py']:assert digest(out/name)==plan['adapted_wrappers'][mode][name]['adapted_sha256']
 assert digest(out/'ordered.ld')==plan['section_order_script_sha256']
 archive(SOURCE,out/'source.tar.gz');dump(out/'source-before.json',expected)
 env=os.environ.copy()
 for name in ['RUSTFLAGS','CARGO_ENCODED_RUSTFLAGS','RUSTC_WORKSPACE_WRAPPER']:env.pop(name,None)
 env.update(CARGO_HOME=str(CARGO),CARGO_TARGET_DIR=str(TARGET),CARGO_BUILD_JOBS='2',RUSTC=str(SDK/'rust/bin/rustc'),RUSTDOC=str(SDK/'rust/bin/rustdoc'),RUSTC_WRAPPER=str(N/'dispatcher.py'),AMM_NATIVE_ROOT_WRAPPER=str(out/'rustc_wrapper.py'),PUMP_LOGICAL_REGISTRY_SRC=str(CARGO/'registry/src'),PUMP_SOURCE_WRAPPER_LOG=str(out/'physical-source-calls.jsonl'),CC=str(SDK/'llvm/bin/clang'),AR=str(SDK/'llvm/bin/llvm-ar'),LD_LIBRARY_PATH=str(SDK/'rust/lib')+':'+str(SDK/'llvm/lib'),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS=' -Zremap-cwd-prefix=')
 clean=[str(SDK/'rust/bin/cargo'),'clean','--manifest-path',str(SOURCE/'Cargo.toml'),'--release','--target','sbpf-solana-solana','-p','pump-amm-recovered','-p','native-transfer-fee','--offline']
 build=[str(SDK/'rust/bin/cargo'),'build','--release','--target','sbpf-solana-solana','--manifest-path',str(SOURCE/'Cargo.toml'),'--locked','--offline','--verbose']
 strip=[str(SDK/'llvm/bin/llvm-objcopy'),'--strip-all',str(TARGET/'sbpf-solana-solana/release/pump_amm_recovered.so'),str(out/'candidate.so')]
 commands=[clean,build,strip];record={'mode':mode,'plan_sha256':digest(N/'plan.json'),'controller_sha256':digest(__file__),'source_sha256':expected,'commands':commands,'environment':{k:env[k]for k in ['CARGO_HOME','CARGO_TARGET_DIR','CARGO_BUILD_JOBS','RUSTC','RUSTDOC','RUSTC_WRAPPER','AMM_NATIVE_ROOT_WRAPPER','PUMP_LOGICAL_REGISTRY_SRC','PUMP_SOURCE_WRAPPER_LOG','CC','AR','LD_LIBRARY_PATH','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']},'compiler_build_invocations':0,'candidate_authorized_only_after_exact_control':True}
 dump(out/'attempt-started.json',record)
 try:
  for command,log in [(clean,'clean.log'),(build,'build.log')]:
   with(out/log).open('wb')as stream:completed=subprocess.run(command,cwd=SOURCE,env=env,stdout=stream,stderr=subprocess.STDOUT)
   record[log+'_returncode']=completed.returncode
   if command==build:record['compiler_build_invocations']+=1
   if completed.returncode:raise RuntimeError('Command failed: '+log)
  text=(out/'build.log').read_text();assert 'Compiling native-transfer-fee' in text and 'Compiling pump-amm-recovered' in text,'Both locals must be freshly compiled'
  shutil.copy2(TARGET/'sbpf-solana-solana/release/pump_amm_recovered.so',out/'symbols.so')
  with(out/'strip.log').open('wb')as stream:subprocess.run(strip,cwd=SOURCE,env=env,stdout=stream,stderr=subprocess.STDOUT,check=True)
  record['hashes']={name:digest(out/name)for name in EXPECTED};record['control_exact']=record['hashes']==EXPECTED if mode=='control'else False
  # Actual root compiler args must differ from the frozen container args only in transport paths.
  actual=json.loads((out/'root-rustc-invocation.json').read_text());reference=json.loads((REF/'root-rustc-invocation.json').read_text())
  old='/Users/shawwalters/Documents/Codex/2026-10-24/pumpfun-source/work/'
  replacements={str(TARGET):old+'amm-workspace-current-20261027/target',str(SDK):old+'amm-linux-v144-20261027/sdk',str(out):'/out'}
  def mapped(s):
   for a,b in replacements.items():s=s.replace(a,b)
   return s
  record['root_original_args_equal_after_transport_paths']=[mapped(x)for x in actual['original_arguments']]==reference['original_arguments']
  record['root_effective_args_equal_after_transport_paths']=[mapped(x)for x in actual['effective_arguments']]==reference['effective_arguments']
  assert record['root_original_args_equal_after_transport_paths']and record['root_effective_args_equal_after_transport_paths'],'Unexpected root flags/metadata change'
  sys.path.insert(0,str(D/'layout-frontier-reconcile/tools'));from measure import measure
  rows=measure(R/'evidence/original/pump_amm/deployed.so',out/'symbols.so');dump(out/'census-785.json',rows);record['official']={'windows':len(rows),'normalized':sum(r['match']is not None for r in rows),'raw':sum(r['raw']for r in rows),'sell':next(r for r in rows if int(r['original'],16)==0x4c750)}
  if mode=='control':assert record['control_exact'],'CONTROL HASH GATE FAILED; candidate forbidden'
  else:
   base=json.loads((N/'control/census-785.json').read_text());record['membership_changes']={}
   for key in ['match','raw']:
    before={r['original']for r in base if r[key]};after={r['original']for r in rows if r[key]};record['membership_changes'][key]={'gains':sorted(after-before),'losses':sorted(before-after)}
   before=(N/'control/candidate.so').read_bytes();after=(out/'candidate.so').read_bytes();changes=[i for i,(a,b)in enumerate(zip(before,after))if a!=b];record['literal_control_candidate_changes']={'before_bytes':len(before),'after_bytes':len(after),'differing_common_extent_bytes':len(changes),'first_offsets':[hex(i)for i in changes[:64]]}
  record['returncode']=0
 except Exception as error:
  record['returncode']=1;record['failure']=str(error)
 finally:
  record['source_after_sha256']=files(SOURCE);record['source_unchanged_during_build']=record['source_after_sha256']==expected;record['seed_unchanged']=files(SEED)==json.loads((N/'seed-before.json').read_text());record['sdk_unchanged']=sdk_check()==json.loads(gzip.decompress((REF/'sdk-sha256.json.gz').read_bytes()));record['registry_unchanged']=dependency_check()==json.loads(gzip.decompress((N/'dependency-inputs.json.gz').read_bytes()));dump(out/'record.json',record)
 print(json.dumps({k:v for k,v in record.items()if k not in ['commands','environment','source_sha256','source_after_sha256']},indent=2),flush=True)
 if record['returncode']or not all(record[k]for k in ['source_unchanged_during_build','seed_unchanged','sdk_unchanged','registry_unchanged']):raise SystemExit(1)
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('mode',choices=['prepare','control','candidate']);a=p.parse_args();prepare()if a.mode=='prepare'else run(a.mode)
