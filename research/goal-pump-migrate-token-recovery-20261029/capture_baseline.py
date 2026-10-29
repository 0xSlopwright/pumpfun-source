#!/usr/bin/env python3
from pathlib import Path
import os,sys,subprocess,json,hashlib,shutil
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
out=R/'passive-baseline';out.mkdir(exist_ok=False);fastbuild.stage(R/'src',R/'build/ws');sdk=fastbuild.SDK;recipe=fastbuild.RECIPES['identity'];target=R/'build/target-identity';triple=recipe['triple'];reg=Path.home()/'.cargo'
c=win.Cand(R/'native-baseline/unstripped.so');symbol=next(f[2]for f in c.funcs if 'create_token_account_v2'in f[2])
env=os.environ.copy();env.pop('CARGO_BUILD_TARGET_DIR',None);env.pop('RUSTFLAGS',None);env.pop('CARGO_ENCODED_RUSTFLAGS',None);env.update(RUSTC_WRAPPER=str(H/'pump_physical_source_wrapper.py'),PUMP_LOGICAL_REGISTRY_SRC=str(reg/'registry/src'),CARGO_HOME=str(reg),CARGO_TARGET_DIR=str(target),CARGO_BUILD_JOBS='2',RUSTC=str(recipe['rustc']),CC=str(sdk/'llvm/bin/clang'),AR=str(sdk/'llvm/bin/llvm-ar'),OBJDUMP=str(sdk/'llvm/bin/llvm-objdump'),OBJCOPY=str(sdk/'llvm/bin/llvm-objcopy'),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS='-Zremap-cwd-prefix=')
cmd=[str(sdk/'rust/bin/cargo'),'rustc','--manifest-path',str(R/'build/ws/programs/pump/Cargo.toml'),'--release','--target',triple,'--locked','--offline','--lib','-p','pump-recovered','--','-Cllvm-args=-print-before=codegenprepare','-Cllvm-args=-print-before=block-placement','-Cllvm-args=-print-after=block-placement','-Cllvm-args=-filter-print-funcs='+symbol]
(out/'launch.json').write_text(json.dumps({'command':cmd,'cwd':str(R/'build/ws'),'environment_delta':{k:env[k]for k in ['RUSTC_WRAPPER','PUMP_LOGICAL_REGISTRY_SRC','CARGO_HOME','CARGO_TARGET_DIR','CARGO_BUILD_JOBS','RUSTC','CC','AR','OBJDUMP','OBJCOPY','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']}},indent=2)+'\n')
slot=fastbuild.acquire_slot()
try:
 with(out/'compiler.log').open('wb')as log:run=subprocess.run(cmd,cwd=R/'build/ws',env=env,stdout=log,stderr=subprocess.STDOUT)
finally:slot.close()
assert run.returncode==0,run.returncode
shutil.copyfile(target/triple/'release/pump_recovered.so',out/'unstripped.so');digest=hashlib.sha256((out/'unstripped.so').read_bytes()).hexdigest();assert digest=='0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6'
print(json.dumps({'symbols_sha256':digest,'compiler_log_bytes':(out/'compiler.log').stat().st_size,'filter_symbol':symbol},indent=2))
