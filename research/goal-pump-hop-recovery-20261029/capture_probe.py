#!/usr/bin/env python3
"""Passive, root-filtered compiler snapshots. No input IR/object editing."""
from pathlib import Path
import hashlib,json,os,shutil,subprocess,sys
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,win
probe=R/'probes'/sys.argv[1];out=probe/'passive';out.mkdir(exist_ok=False)
manifest=json.loads((probe/'SOURCE-MANIFEST.json').read_text());before={n:(R/'src'/n).read_bytes()for n in manifest['files']};pins=json.loads((R/'source-inputs.json').read_text());assert all(hashlib.sha256(v).hexdigest()==pins[n]for n,v in before.items())
try:
 for n,digest in manifest['files'].items():
  data=(probe/n).read_bytes();assert hashlib.sha256(data).hexdigest()==digest;(R/'src'/n).write_bytes(data)
 fastbuild.stage(R/'src',R/'build/ws');sdk=fastbuild.SDK;recipe=fastbuild.RECIPES['identity'];target=R/'build/target-identity';triple=recipe['triple'];reg=Path.home()/'.cargo'
 c=win.Cand(probe/'unstripped.so');symbol=next(f[2]for f in c.funcs if win.demangle(f[2])=='pump_recovered::multi_hop_curve::swap_hop')
 env=os.environ.copy();env.pop('CARGO_BUILD_TARGET_DIR',None);env.pop('RUSTFLAGS',None);env.pop('CARGO_ENCODED_RUSTFLAGS',None)
 env.update(RUSTC_WRAPPER=str(H/'pump_physical_source_wrapper.py'),PUMP_LOGICAL_REGISTRY_SRC=str(reg/'registry/src'),CARGO_HOME=str(reg),CARGO_TARGET_DIR=str(target),CARGO_BUILD_JOBS='2',RUSTC=str(recipe['rustc']),CC=str(sdk/'llvm/bin/clang'),AR=str(sdk/'llvm/bin/llvm-ar'),OBJDUMP=str(sdk/'llvm/bin/llvm-objdump'),OBJCOPY=str(sdk/'llvm/bin/llvm-objcopy'),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS='-Zremap-cwd-prefix=')
 cmd=[str(sdk/'rust/bin/cargo'),'rustc','--manifest-path',str(R/'build/ws/programs/pump/Cargo.toml'),'--release','--target',triple,'--locked','--offline','--lib','-p','pump-recovered','--','-Cllvm-args=-print-before=codegenprepare','-Cllvm-args=-print-before=block-placement','-Cllvm-args=-print-after=block-placement','-Cllvm-args=-filter-print-funcs='+symbol]
 (out/'launch.json').write_text(json.dumps({'command':cmd,'cwd':str(R/'build/ws'),'environment_delta':{k:env[k]for k in ['RUSTC_WRAPPER','PUMP_LOGICAL_REGISTRY_SRC','CARGO_HOME','CARGO_TARGET_DIR','CARGO_BUILD_JOBS','RUSTC','CC','AR','OBJDUMP','OBJCOPY','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']}},indent=2)+'\n')
 slot=fastbuild.acquire_slot()
 try:
  with(out/'compiler.log').open('wb')as log:run=subprocess.run(cmd,cwd=R/'build/ws',env=env,stdout=log,stderr=subprocess.STDOUT)
 finally:slot.close()
 assert run.returncode==0,run.returncode
 shutil.copyfile(target/triple/'release/pump_recovered.so',out/'unstripped.so');digest=hashlib.sha256((out/'unstripped.so').read_bytes()).hexdigest();assert digest==hashlib.sha256((probe/'unstripped.so').read_bytes()).hexdigest()
 result={'scope':__doc__,'identical_probe_image':True,'unstripped_sha256':digest,'compiler_log_bytes':(out/'compiler.log').stat().st_size,'filter_symbol':symbol,'new_runtime_executions':0};(out/'RESULT.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
finally:
 for n,data in before.items():(R/'src'/n).write_bytes(data)
 fastbuild.stage(R/'src',R/'build/ws')
