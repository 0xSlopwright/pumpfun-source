import os,pathlib,subprocess,json,hashlib,sys,shutil
base=pathlib.Path(__file__).resolve().parent
name=sys.argv[1] if len(sys.argv)>1 else "baseline"
out=base/name
sdk=pathlib.Path("/workspace/toolchains/v1.44")
cargo_home=pathlib.Path("/workspace/pumpfun-source-current/work/pump-round37-linux-control/cargo-home")
env=os.environ.copy();env.update(CARGO_HOME=str(cargo_home),CARGO_TARGET_DIR=str(base/"target"),CARGO_BUILD_JOBS="2",RUSTC=str(sdk/"rust/bin/rustc"),RUSTC_WRAPPER="/workspace/pumpfun-source-latest/scripts/pump_physical_source_wrapper.py",PUMP_LOGICAL_REGISTRY_SRC=str(cargo_home/"registry/src"),PUMP_SOURCE_WRAPPER_LOG=str(out/"physical-source-calls.jsonl"),CC=str(sdk/"llvm/bin/clang"),AR=str(sdk/"llvm/bin/llvm-ar"),OBJDUMP=str(sdk/"llvm/bin/llvm-objdump"),OBJCOPY=str(sdk/"llvm/bin/llvm-objcopy"),CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS="-Zremap-cwd-prefix=")
cmd=[str(sdk/"rust/bin/cargo"),"build","--manifest-path",str(out/"source/programs/pump/Cargo.toml"),"--release","--target","sbpf-solana-solana","--locked","--offline","-v"]
record={"command":cmd,"environment":{k:env[k] for k in ["CARGO_HOME","CARGO_TARGET_DIR","CARGO_BUILD_JOBS","RUSTC","RUSTC_WRAPPER","PUMP_LOGICAL_REGISTRY_SRC","CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS"]},"cwd":str(out/"source")}
(out/"build-command.json").write_text(json.dumps(record,indent=2)+"\n")
clean=[str(sdk/"rust/bin/cargo"),"clean","--manifest-path",str(out/"source/Cargo.toml"),"--release","--target","sbpf-solana-solana","-p","pump-recovered","-p","pump-token-ext","--offline"]
subprocess.run(clean,cwd=out/"source",env=env,check=True)
with (out/"build.log").open("w") as log:r=subprocess.run(cmd,cwd=out/"source",env=env,stdout=log,stderr=subprocess.STDOUT)
if r.returncode == 0:
 shutil.copy2(base/"target/sbpf-solana-solana/release/pump_recovered.so",out/"unstripped.so")
 subprocess.run([str(sdk/"llvm/bin/llvm-objcopy"),"--strip-all",str(out/"unstripped.so"),str(out/"candidate.so")],check=True)
 print(json.dumps({x:hashlib.sha256((out/x).read_bytes()).hexdigest() for x in ["unstripped.so","candidate.so"]}))
print(r.returncode);sys.exit(r.returncode)
