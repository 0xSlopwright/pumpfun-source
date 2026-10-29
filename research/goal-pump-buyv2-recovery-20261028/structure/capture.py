from pathlib import Path
import sys,os,json,subprocess,time,shutil,hashlib
R=Path(__file__).resolve().parents[1];D=R/'structure/passive';D.mkdir(parents=True,exist_ok=True);H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score
SDK=Path.home()/'.cache/solana/v1.44/platform-tools';SRC=R/'src';WS=D/'ws';fastbuild.stage(SRC,WS);target=D/'target'
if not target.exists():subprocess.run(['cp','-cRp',str(R/'build/target-identity'),str(target)],check=True)
env=dict(os.environ);env.update(RUSTC_WRAPPER=str(H/'pump_physical_source_wrapper.py'),PUMP_LOGICAL_REGISTRY_SRC=str(Path.home()/'.cargo/registry/src'),CARGO_HOME=str(Path.home()/'.cargo'),CARGO_TARGET_DIR=str(target),CARGO_BUILD_JOBS='2',RUSTC=str(fastbuild.RECIPES['identity']['rustc']),CC=str(SDK/'llvm/bin/clang'),AR=str(SDK/'llvm/bin/llvm-ar'),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS='-Zremap-cwd-prefix=');env.pop('RUSTFLAGS',None);env.pop('CARGO_ENCODED_RUSTFLAGS',None)
fn=next(nm for a,n,nm in score.candidate_functions(R/'separate-crate/unstripped.so')if '6buy_v211buy_handler17h' in nm)
cmd=[str(SDK/'rust/bin/cargo'),'rustc','--manifest-path',str(WS/'programs/pump/Cargo.toml'),'--release','--target','sbpf-solana-solana','--locked','--offline','--lib','--','--emit=llvm-ir','-C','llvm-args=-print-before=stack-coloring','-C','llvm-args=-print-after=stack-coloring','-C','llvm-args=-filter-print-funcs='+fn]
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();before={str(p.relative_to(SRC)):sha(p)for p in SRC.rglob('*')if p.is_file()};(D/'launch.json').write_text(json.dumps({'command':cmd,'cwd':str(WS),'environment':{k:env[k]for k in ['RUSTC_WRAPPER','PUMP_LOGICAL_REGISTRY_SRC','CARGO_HOME','CARGO_TARGET_DIR','CARGO_BUILD_JOBS','RUSTC','CC','AR','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']},'source_sha256':before,'function':fn},indent=2))
t=time.time()
with (D/'raw.log').open('w')as f:run=subprocess.run(cmd,cwd=WS,env=env,stdout=f,stderr=subprocess.STDOUT)
res={'exit':run.returncode,'seconds':time.time()-t,'source_unchanged':before=={str(p.relative_to(SRC)):sha(p)for p in SRC.rglob('*')if p.is_file()}}
if not run.returncode:
 so=target/'sbpf-solana-solana/release/pump_recovered.so';shutil.copy2(so,D/'symbols.so');res.update(sha256=sha(so),full_elf_equal_best=so.read_bytes()==(R/'separate-crate/unstripped.so').read_bytes())
 for p in target.glob('sbpf-solana-solana/release/deps/pump_recovered*.ll'):shutil.copy2(p,D/'root.ll')
(D/'result.json').write_text(json.dumps(res,indent=2)+'\n');print(json.dumps(res),flush=True)
