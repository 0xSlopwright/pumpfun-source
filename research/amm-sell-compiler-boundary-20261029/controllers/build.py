"""Fresh offline compiler control; never runs the SBPF output."""
from pathlib import Path
import hashlib,json,os,shutil,subprocess,sys,time
D=Path(__file__).resolve().parent;W=D.parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def build(label,linux=False,explicit=False):
 O=D/label;O.mkdir(exist_ok=False);S=O/'source';shutil.copytree(D/'source',S)
 sdk=W/'amm-v144-probe/sdk';vc=Path(r'C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\14.44.35207');kit=Path(r'C:\Program Files (x86)\Windows Kits\10');ver='10.0.26100.0'
 C=O/'cargo-home';C.mkdir();(C/'config.toml').write_bytes(('[source.crates-io]\nreplace-with="locked-vendor"\n[source.locked-vendor]\ndirectory='+json.dumps(str(W/'amm-fresh-v144/vendor'))+'\n[net]\noffline=true\n').encode())
 T=O/'temp';T.mkdir();system=Path(os.environ['SystemRoot'])
 env={k:os.environ[k] for k in ['SystemRoot','WINDIR','SystemDrive','COMSPEC','PROCESSOR_ARCHITECTURE'] if k in os.environ}
 env.update(PATH=os.pathsep.join(map(str,[sdk/'rust/bin',sdk/'llvm/bin',vc/'bin/Hostx64/x64',kit/'bin'/ver/'x64',system/'System32'])),LIB=os.pathsep.join(map(str,[vc/'lib/x64',kit/'Lib'/ver/'ucrt/x64',kit/'Lib'/ver/'um/x64'])),INCLUDE=os.pathsep.join(map(str,[vc/'include',*[kit/'Include'/ver/n for n in ['ucrt','shared','um','winrt']]])),RUSTC=str(sdk/'rust/bin/rustc.exe'),RUSTDOC=str(sdk/'rust/bin/rustdoc.exe'),CARGO_HOME=str(C),CARGO_TARGET_DIR=str(O/'target'),CARGO_NET_OFFLINE='true',CARGO_BUILD_JOBS='8',CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS='-Zremap-cwd-prefix=',CC_sbpf_solana_solana=str(sdk/'llvm/bin/clang.exe'),AR_sbpf_solana_solana=str(sdk/'llvm/bin/llvm-ar.exe'),CARGO_TARGET_X86_64_PC_WINDOWS_MSVC_LINKER=str(vc/'bin/Hostx64/x64/link.exe'),TEMP=str(T),TMP=str(T))
 if linux:env['CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']+=' --sysroot='+str(W/'amm-fresh-v144/linux-sysroot/rust')
 if linux or explicit:env['CARGO_TARGET_SBPF_SOLANA_SOLANA_LINKER']=str(sdk/'rust/lib/rustlib/x86_64-pc-windows-msvc/bin/rust-lld.exe')
 command=[str(sdk/'rust/bin/cargo.exe'),'build','--release','--target','sbpf-solana-solana','--manifest-path',str(S/'Cargo.toml'),'--locked','--offline','--verbose']
 before={p.relative_to(S).as_posix():sha(p) for p in S.rglob('*') if p.is_file()}
 launch=dict(command=command,cwd=str(S),environment=env,source_inputs=before,target_directory_initially_absent=not (O/'target').exists(),tools={str(p):sha(p) for p in [sdk/'rust/bin/cargo.exe',sdk/'rust/bin/rustc.exe',vc/'bin/Hostx64/x64/link.exe']},target_executions=0)
 save(O/'launch.json',launch);start=time.time()
 with (O/'stdout.log').open('wb') as out,(O/'stderr.log').open('wb') as err:r=subprocess.run(command,cwd=S,env=env,stdout=out,stderr=err,creationflags=subprocess.CREATE_NO_WINDOW)
 result=dict(returncode=r.returncode,seconds=time.time()-start,source_unchanged=before=={p.relative_to(S).as_posix():sha(p) for p in S.rglob('*') if p.is_file()},logs={n:sha(O/n) for n in ['stdout.log','stderr.log']},target_executions=0)
 f=O/'target/sbpf-solana-solana/release/pump_amm_recovered.so'
 if f.exists():shutil.copyfile(f,O/'symbols.so');result['symbols_sha256']=sha(f)
 save(O/'result.json',result);print(json.dumps(result));print((O/'stderr.log').read_text(errors='replace')[-8000:])
if __name__=='__main__':build(sys.argv[1],'--linux-sysroot' in sys.argv[2:],'--explicit-linker' in sys.argv[2:])
