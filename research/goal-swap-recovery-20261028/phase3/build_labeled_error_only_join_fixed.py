from pathlib import Path
import subprocess,os,json,hashlib,shutil
R=Path(__file__).resolve().parents[1]; L=R; p=L/'src/programs/pump-amm/src/instructions/swap/sell.rs'; before=p.read_bytes(); lib=L/'src/programs/pump-amm/src/lib.rs'; lib_before=lib.read_bytes()
SDK=Path.home()/'.cache/solana/v1.44/platform-tools';cargo=SDK/'rust/bin/cargo'
ENV=dict(os.environ);ENV.pop('RUSTFLAGS',None);ENV.pop('CARGO_ENCODED_RUSTFLAGS',None);ENV.update(CARGO_HOME=str(Path.home()/'amm100-run/cargo-home'),CARGO_TARGET_DIR=str(L/'target'),RUSTC=str(SDK/'rust/bin/rustc'),CC=str(SDK/'llvm/bin/clang'),AR=str(SDK/'llvm/bin/llvm-ar'),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS=' -Zremap-cwd-prefix=')
symbol='_ZN18pump_amm_recovered12instructions4swap4sell8cashback17h6f538836b47fbaaeE'
cmd=[str(cargo),'rustc','--release','--target','sbpf-solana-solana','--locked','--offline','--lib','-p','pump-amm-recovered','--verbose','--','-Cllvm-args=-print-before=block-placement','-Cllvm-args=-print-after=block-placement','-Cllvm-args=-filter-print-funcs='+symbol]
source=(R/'phase3/labeled-error-only-join-fixed-sell.rs').read_bytes();out=R/'phase3/labeled-error-only-join-fixed';out.mkdir(exist_ok=False)
(out/'sell.rs').write_bytes(source)
(out/'launch.json').write_text(json.dumps({'command':cmd,'cwd':str(L/'src'),'environment_delta':{k:ENV[k] for k in ['CARGO_HOME','CARGO_TARGET_DIR','RUSTC','CC','AR','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']},'source_sha256':hashlib.sha256(source).hexdigest()},indent=2))
try:
 p.write_bytes(source); lib.write_bytes(b'#![feature(try_blocks)] //' + lib_before[3:]); (out/'lib.rs').write_bytes(lib.read_bytes())
 with (out/'compiler.log').open('wb') as log: run=subprocess.run(cmd,cwd=L/'src',env=ENV,stdout=log,stderr=subprocess.STDOUT)
 assert run.returncode==0,run.returncode
 shutil.copyfile(L/'target/sbpf-solana-solana/release/pump_amm_recovered.so',out/'symbols.so')
 print(json.dumps({'returncode':run.returncode,'symbols_sha256':hashlib.sha256((out/'symbols.so').read_bytes()).hexdigest(),'compiler_log_bytes':(out/'compiler.log').stat().st_size}))
finally:p.write_bytes(before); lib.write_bytes(lib_before)
