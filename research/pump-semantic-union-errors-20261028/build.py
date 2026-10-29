#!/usr/bin/env python3
"""Rebuild this source snapshot with an unmodified installed native v1.44 SDK."""
import argparse,hashlib,json,os,shutil,subprocess
from pathlib import Path

HERE=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def hashes(root):return {str(p.relative_to(root)):sha(p) for p in sorted(root.rglob('*')) if p.is_file()}

def main():
 p=argparse.ArgumentParser(description=__doc__)
 p.add_argument('--repo',type=Path,required=True)
 p.add_argument('--sdk',type=Path,required=True)
 p.add_argument('--cargo-home',type=Path,required=True)
 p.add_argument('--output',type=Path,required=True)
 p.add_argument('--target-dir',type=Path)
 p.add_argument('--dependency-seed',type=Path)
 a=p.parse_args()
 sdk=a.sdk.resolve();out=a.output.resolve();repo=a.repo.resolve();cargo_home=a.cargo_home.resolve()
 out.mkdir(parents=True,exist_ok=False)
 source=out/'source';shutil.copytree(HERE/'source',source)
 target=(a.target_dir or out/'target').resolve()
 if a.dependency_seed:
  assert not target.exists(),'copy a seed only into a new owned target'
  shutil.copytree(a.dependency_seed.resolve(),target)
 wrapper=repo/'scripts/pump_physical_source_wrapper.py'
 expected_wrapper='d959fe0074fafe7f310a8f40051ce87f795b1e81b104a38dfe57086efa6bae1b'
 assert sha(wrapper)==expected_wrapper
 tools={name:sdk/rel for name,rel in {'cargo':'rust/bin/cargo','rustc':'rust/bin/rustc','objcopy':'llvm/bin/llvm-objcopy'}.items()}
 expected_tools={'cargo':'d28444578306fe5a4f40524331411340123004e9e6556322fcabdbe351fe265d','rustc':'c8807b7ebede8578ac5a257ea333780f9d89bd356064fd8184af7e996cb71a97','objcopy':'f078d5b1f9df4190e67938a13e81e1dda1057e16228ff1a6f2f5d5540c9e6aaf'}
 assert {name:sha(path) for name,path in tools.items()}==expected_tools
 libraries=sdk/'rust/lib/rustlib/sbpf-solana-solana/lib'
 lib_before=hashes(libraries);assert lib_before
 before=hashes(source);assert before==hashes(HERE/'source')
 overrides={'CARGO_HOME':str(cargo_home),'CARGO_TARGET_DIR':str(target),'CARGO_BUILD_JOBS':'2',
  'RUSTC':str(tools['rustc']),'RUSTC_WRAPPER':str(wrapper),
  'PUMP_LOGICAL_REGISTRY_SRC':str(cargo_home/'registry/src'),'PUMP_SOURCE_WRAPPER_LOG':str(out/'physical-source-calls.jsonl'),
  'CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS':'-Zremap-cwd-prefix=',
  'CC':str(sdk/'llvm/bin/clang'),'AR':str(sdk/'llvm/bin/llvm-ar'),
  'OBJDUMP':str(sdk/'llvm/bin/llvm-objdump'),'OBJCOPY':str(tools['objcopy'])}
 env=os.environ.copy();env.update(overrides)
 command=[str(tools['cargo']),'build','--manifest-path',str(source/'programs/pump/Cargo.toml'),'--release','--target','sbpf-solana-solana','--locked','--offline','-v']
 with (out/'build.log').open('w') as log:
  subprocess.run([str(tools['cargo']),'clean','--manifest-path',str(source/'Cargo.toml'),'--offline','--release','--target','sbpf-solana-solana','-p','pump-recovered','-p','pump-token-ext'],cwd=source,env=env,stdout=log,stderr=subprocess.STDOUT,check=True)
  result=subprocess.run(command,cwd=source,env=env,stdout=log,stderr=subprocess.STDOUT)
 receipt={'command':command,'environment':overrides,'returncode':result.returncode,'source_before_sha256':before,'source_after_sha256':hashes(source),'tool_sha256':expected_tools,'target_libraries_sha256':lib_before,'source_wrapper_sha256':sha(wrapper)}
 assert before==receipt['source_after_sha256'] and before==hashes(HERE/'source')
 assert lib_before==hashes(libraries),'SDK libraries changed'
 if result.returncode==0:
  text=(out/'build.log').read_text()
  assert 'Compiling pump-recovered ' in text and 'Compiling pump-token-ext ' in text,'both local crates must freshly compile'
  shutil.copy2(target/'sbpf-solana-solana/release/pump_recovered.so',out/'unstripped.so')
  subprocess.run([str(tools['objcopy']),'--strip-all',str(out/'unstripped.so'),str(out/'candidate.so')],check=True)
  receipt.update(unstripped_sha256=sha(out/'unstripped.so'),candidate_sha256=sha(out/'candidate.so'))
 (out/'receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
 print(json.dumps({k:receipt[k] for k in ['returncode','unstripped_sha256','candidate_sha256'] if k in receipt}))
 raise SystemExit(result.returncode)

if __name__=='__main__':main()
