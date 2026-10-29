#!/usr/bin/env python3
"""Fresh two-local-crate ordinary Cargo build with explicitly reused dependency target."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,io,json,os,re,shutil,subprocess,sys,tarfile,time,tomllib
P=Path(__file__).resolve().parent;R=Path('/Users/shawwalters/.codex/worktrees/pump-swap-remaining-20261028/pumpfun-source')
if not __debug__:raise SystemExit('Run without -O; assertions are build integrity checks.')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--source-directory',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--workspace',type=Path);p.add_argument('--mode',choices=['stock','passive'],required=True);p.add_argument('--passive-symbol');a=p.parse_args()
crate=a.source_directory.resolve();out=a.output.resolve();assert not out.exists();out.mkdir(parents=True);shutil.copy2(Path(__file__),out/'executed-builder.py')
executed=out/'executed-tools';executed.mkdir();tool_sources={}
for name in ['build_source_manifest.py','compare.py','analyze.py','pump_target_library_profile.py','pump_dependency_cache.py','pump_physical_source_wrapper.py','pump_linux_v144_sbpf_libraries.json']:
 src=R/'work/pump-v3-final-native-trace-plan-20261028/tools'/name;dst=executed/name;raw=src.read_bytes();dst.write_bytes(raw);dst.chmod(0o755);tool_sources[name]={'source':str(src),'sha256':sha(dst)}
sys.path.insert(0,str(executed))
from build_source_manifest import source_manifest
from compare import compare
from pump_target_library_profile import inventory
# Read the measured recipe solely to locate existing unmodified host/tool paths.
h=R/'work/pump-v3-final-native-trace-plan-20261028/tools/tool-locator-reference.py';shutil.copy2(h,executed/'tool-locator-reference.py');tool_sources['tool-locator-reference.py']={'source':str(h),'sha256':sha(h)};spec=importlib.util.spec_from_file_location('measured_fastbuild',h);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
sdk=m.SDK;rustc=m.RECIPES['identity']['rustc'];target=Path(str(P)+'-target-'+a.mode);assert target.is_dir()
primary=crate;primary_workspace=crate if 'workspace'in tomllib.loads((crate/'Cargo.toml').read_text())else crate.parents[1]
primary_before=source_manifest(primary,primary_workspace,R,cwd=primary_workspace)
if 'workspace'in tomllib.loads((crate/'Cargo.toml').read_text()):
 workspace=out/'source';crate=m.stage(primary,workspace)
else:workspace=(a.workspace.resolve()if a.workspace else crate.parents[1])
workspace.relative_to(R);crate.relative_to(workspace)
assert tomllib.loads((workspace/'Cargo.toml').read_text())['workspace']['members']==['programs/pump']
wrapper=executed/'pump_physical_source_wrapper.py';tools={'rustc':rustc,'cargo':sdk/'rust/bin/cargo','objcopy':sdk/'llvm/bin/llvm-objcopy','clang':sdk/'llvm/bin/clang','ar':sdk/'llvm/bin/llvm-ar'}
toolhash={n:sha(f)for n,f in tools.items()};targetlibs=rustc.parents[1]/'lib/rustlib/sbpf-solana-solana/lib';libhash=inventory(targetlibs)
before=source_manifest(crate,workspace,R,cwd=workspace)
external={str(q):sha(q)for q in sorted((target/'sbpf-solana-solana/release/deps').glob('*'))if q.is_file()and q.suffix in{'.rlib','.rmeta','.so','.a'}and not q.name.startswith(('libpump_','pump_'))}
env=os.environ.copy()
for key in ['CARGO_BUILD_TARGET_DIR','RUSTFLAGS','CARGO_ENCODED_RUSTFLAGS','RUSTC_WORKSPACE_WRAPPER']:env.pop(key,None)
env.update(RUSTC_WRAPPER=str(wrapper),PUMP_LOGICAL_REGISTRY_SRC=str(Path.home()/'.cargo/registry/src'),PUMP_SOURCE_WRAPPER_LOG=str(out/'physical-source-calls.jsonl'),CARGO_HOME=str(Path.home()/'.cargo'),CARGO_TARGET_DIR=str(target),CARGO_BUILD_JOBS='2',RUSTC=str(rustc),CC=str(tools['clang']),AR=str(tools['ar']),OBJDUMP=str(sdk/'llvm/bin/llvm-objdump'),OBJCOPY=str(tools['objcopy']),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS='-Zremap-cwd-prefix=')
common=['--manifest-path',str(crate/'Cargo.toml'),'--release','--target','sbpf-solana-solana','--offline']
clean=[str(tools['cargo']),'clean',*common,'-p','pump-recovered','-p','pump-token-ext'];command=[str(tools['cargo']),'build',*common,'--locked','-vv']
if a.mode=='passive':
 assert a.passive_symbol and re.fullmatch(r'_ZN[0-9A-Za-z_]+17h[0-9a-f]{16}E',a.passive_symbol)
 command=[str(tools['cargo']),'rustc',*common,'--locked','-vv','--','-Cllvm-args=-filter-print-funcs='+a.passive_symbol,'-Cllvm-args=-print-before-all','-Cllvm-args=-print-after-all']
else:assert a.passive_symbol is None
assert sha(R/'work/pump-v3-final-native-trace-plan-20261028/PLAN.json')=='15660946baa2d6676d421c9fdba5edb20f2dc0ba210eadc03d0ca452e70265d6'
expected=json.loads((R/'work/pump-v3-final-native-trace-plan-20261028/SOURCE65.json').read_text())
assert {str((R/n).relative_to(primary)):h for n,h in primary_before.items()}==expected
attemptfile=P/'native-attempts.json';attempts=json.loads(attemptfile.read_text())if attemptfile.exists()else[]
assert len(attempts)<2 and a.mode==('stock'if not attempts else'passive')
attempts.append(dict(mode=a.mode,command=command,output=str(out),started_at=time.time()));attemptfile.write_text(json.dumps(attempts,indent=2)+'\n')
record={'executed_python_sources':tool_sources,'scope':__doc__,'cold_empty_target':False,'target_existed_before':True,'authorized_plan_sha256':'15660946baa2d6676d421c9fdba5edb20f2dc0ba210eadc03d0ca452e70265d6','mode':a.mode,'passive_symbol':a.passive_symbol,'source_binding_preflight_sha256':'0dc88f2ca2a4471ff5c59872dda815505ac852a5df91e074f65bb02128ee1043','builder_sha256':sha(Path(__file__)),'recipe_reference_sha256':sha(h),'source_directory':str(crate),'source_sha256':before,'primary_source_directory':str(primary),'primary_source_sha256':primary_before,'workspace_directory':str(workspace),'workspace_layout':True,'command':command,'clean_command':clean,'selected_toolchain':'v1.44 native Darwin with official Linux-v1.44 SBPF target libraries','target':'sbpf-solana-solana','tool_sha256':toolhash,'target_libraries_sha256':libhash,'source_wrapper_sha256':sha(wrapper),'reused_external_artifacts_sha256':external,'external_dependency_rebuild':False,'environment':{k:env[k]for k in ['RUSTC_WRAPPER','PUMP_LOGICAL_REGISTRY_SRC','PUMP_SOURCE_WRAPPER_LOG','CARGO_HOME','CARGO_TARGET_DIR','CARGO_BUILD_JOBS','RUSTC','CC','AR','OBJDUMP','OBJCOPY','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']}}
(out/'build-attempt.json').write_text(json.dumps(record,indent=2)+'\n')
with(out/'clean.log').open('w')as f:r=subprocess.run(clean,cwd=workspace,env=env,stdout=f,stderr=subprocess.STDOUT)
record['clean_returncode']=r.returncode;r.check_returncode()
slot=m.acquire_slot();start=time.time()
try:
 with(out/'build.log').open('w')as f:r=subprocess.run(command,cwd=workspace,env=env,stdout=f,stderr=subprocess.STDOUT)
finally:slot.close()
record.update(returncode=r.returncode,seconds=round(time.time()-start,3),source_after_sha256=source_manifest(crate,workspace,R,cwd=workspace))
record['primary_source_after_sha256']=source_manifest(primary,primary_workspace,R,cwd=primary_workspace)
record['source_unchanged']=before==record['source_after_sha256']and primary_before==record['primary_source_after_sha256'];record['tools_unchanged']=toolhash=={n:sha(f)for n,f in tools.items()};record['target_libraries_unchanged']=libhash==inventory(targetlibs)
record['reused_external_artifacts_unchanged']=all(Path(n).exists()and sha(Path(n))==h for n,h in external.items())
record['executed_python_sources_unchanged']=all(sha(Path(v['source']))==v['sha256']and sha(executed/n)==v['sha256']for n,v in tool_sources.items());assert record['executed_python_sources_unchanged']
log=(out/'build.log').read_text();record['compiled_packages']=re.findall(r'^\s*Compiling (\S+) ',log,re.M);record['external_dependency_rebuild']=any(n not in ['pump-recovered','pump-token-ext']for n in record['compiled_packages']);record['fresh_local_compilations']={n:('Compiling '+n+' ')in log for n in ['pump-recovered','pump-token-ext']};record['stack_warnings']=[x for x in log.splitlines()if'exceeded max offset'in x]
(out/'build-attempt.json').write_text(json.dumps(record,indent=2)+'\n');r.check_returncode()
assert record['source_unchanged']and record['tools_unchanged']and record['target_libraries_unchanged']and record['reused_external_artifacts_unchanged'];assert all(record['fresh_local_compilations'].values())and not record['stack_warnings']
built=target/'sbpf-solana-solana/release/pump_recovered.so';shutil.copy2(built,out/'unstripped.so');subprocess.run([str(tools['objcopy']),'--strip-all',str(built),str(out/'candidate.so')],check=True)
record.update(unstripped_sha256=sha(out/'unstripped.so'),build_log_sha256=sha(out/'build.log'),comparison=compare((R/'evidence/original/pump/deployed.so').read_bytes(),(out/'candidate.so').read_bytes()))
# Archive literal actual materialized compiler inputs, not a restaged proposal.
compiled={str((R/n).relative_to(workspace)):h for n,h in record['source_sha256'].items()};assert len(compiled)==66
buffer=io.BytesIO()
with tarfile.open(fileobj=buffer,mode='w')as archive:
 for name,digest in sorted(compiled.items()):
  f=workspace/name;assert sha(f)==digest;raw=f.read_bytes();member=tarfile.TarInfo(name);member.size=len(raw);member.mode=0o644;member.mtime=0;archive.addfile(member,io.BytesIO(raw))
(out/'compiled-workspace.tar.gz').write_bytes(gzip.compress(buffer.getvalue(),mtime=0));(out/'compiled66.json').write_text(json.dumps(compiled,indent=2)+'\n')
record.update(actual_compiled_workspace_inputs=66,compiled_workspace_archive_sha256=sha(out/'compiled-workspace.tar.gz'),compiled66_sha256=sha(out/'compiled66.json'))
# These are the actual attempt and result of this invocation, not imported historical receipts.
for name in ['build-attempt.json','build-comparison.json']:(out/name).write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({'returncode':r.returncode,'fresh_local_compilations':record['fresh_local_compilations'],'candidate_sha256':record['comparison']['candidate_sha256'],'unstripped_sha256':record['unstripped_sha256'],'seconds':record['seconds']},indent=2))
