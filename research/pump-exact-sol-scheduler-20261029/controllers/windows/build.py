"""Independent fresh Windows host compilation; never runs SBPF output."""
from pathlib import Path
import ctypes,hashlib,importlib.util,json,os,shutil,subprocess,sys,time
D=Path(__file__).resolve().parent;W=D.parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def inventory(p):return {f.relative_to(p).as_posix():sha(f) for f in sorted(p.rglob('*')) if f.is_file()}
def split(command):
 fn=ctypes.windll.shell32.CommandLineToArgvW;fn.argtypes=[ctypes.c_wchar_p,ctypes.POINTER(ctypes.c_int)];fn.restype=ctypes.POINTER(ctypes.c_wchar_p);n=ctypes.c_int();p=fn(command,ctypes.byref(n));assert p
 try:return [p[i] for i in range(n.value)]
 finally:ctypes.windll.kernel32.LocalFree(p)
def main(label,kind):
 O=D/label;O.mkdir();S=O/'source';shutil.copytree(D/('source-'+kind),S)
 binding=json.loads((D/'source-binding.json').read_bytes());before=inventory(S);assert before==binding['source'][kind]
 sdk=W/'amm-v144-probe/sdk';sysroot=W/'amm-fresh-v144/linux-sysroot/rust';vc=Path(r'C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\14.44.35207');kit=Path(r'C:\Program Files (x86)\Windows Kits\10');ver='10.0.26100.0'
 C=O/'cargo-home';C.mkdir();(C/'config.toml').write_bytes(('[source.crates-io]\nreplace-with="locked-vendor"\n[source.locked-vendor]\ndirectory='+json.dumps(str(D/'vendor'))+'\n[net]\noffline=true\n').encode())
 T=O/'temp';T.mkdir();system=Path(os.environ['SystemRoot'])
 env={k:os.environ[k] for k in ['SystemRoot','WINDIR','SystemDrive','COMSPEC','PROCESSOR_ARCHITECTURE'] if k in os.environ}
 env.update(PATH=os.pathsep.join(map(str,[sdk/'rust/bin',sdk/'llvm/bin',vc/'bin/Hostx64/x64',kit/'bin'/ver/'x64',system/'System32'])),LIB=os.pathsep.join(map(str,[vc/'lib/x64',kit/'Lib'/ver/'ucrt/x64',kit/'Lib'/ver/'um/x64'])),INCLUDE=os.pathsep.join(map(str,[vc/'include',*[kit/'Include'/ver/n for n in ['ucrt','shared','um','winrt']]])),RUSTC=str(sdk/'rust/bin/rustc.exe'),RUSTDOC=str(sdk/'rust/bin/rustdoc.exe'),CARGO_HOME=str(C),CARGO_TARGET_DIR=str(O/'target'),CARGO_NET_OFFLINE='true',CARGO_BUILD_JOBS='8',CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS='-Zremap-cwd-prefix= --sysroot='+str(sysroot),CC_sbpf_solana_solana=str(sdk/'llvm/bin/clang.exe'),AR_sbpf_solana_solana=str(sdk/'llvm/bin/llvm-ar.exe'),CARGO_TARGET_SBPF_SOLANA_SOLANA_LINKER=str(sdk/'rust/lib/rustlib/x86_64-pc-windows-msvc/bin/rust-lld.exe'),CARGO_TARGET_X86_64_PC_WINDOWS_MSVC_LINKER=str(vc/'bin/Hostx64/x64/link.exe'),TEMP=str(T),TMP=str(T))
 command=[str(sdk/'rust/bin/cargo.exe'),'build','--release','--target','sbpf-solana-solana','--manifest-path',str(S/'Cargo.toml'),'--locked','--offline','--verbose']
 toolpaths=[sdk/'rust/bin/cargo.exe',sdk/'rust/bin/rustc.exe',sdk/'rust/lib/rustlib/x86_64-pc-windows-msvc/bin/rust-lld.exe',vc/'bin/Hostx64/x64/link.exe']
 tool_before={str(f):sha(f) for f in toolpaths};libraries=inventory(sysroot);vendor=inventory(D/'vendor')
 launch=dict(command=command,cwd=str(S),environment=env,source_inputs=before,target_directory_initially_absent=not (O/'target').exists(),tools=tool_before,libraries=libraries,vendor=vendor,controller_sha256=sha(Path(__file__)),kind=kind,target_executions=0)
 save(O/'launch.json',launch);start=time.time()
 with (O/'stdout.log').open('wb') as out,(O/'stderr.log').open('wb') as err:r=subprocess.run(command,cwd=S,env=env,stdout=out,stderr=err,creationflags=subprocess.CREATE_NO_WINDOW)
 lines=(O/'stderr.log').read_text(errors='replace').splitlines();roots=[x.strip()[9:-1] for x in lines if x.strip().startswith('Running `') and '--crate-name pump_recovered ' in x]
 result=dict(returncode=r.returncode,seconds=time.time()-start,source_unchanged=before==inventory(S),tools_unchanged=tool_before=={str(f):sha(f) for f in toolpaths},libraries_unchanged=libraries==inventory(sysroot),vendor_unchanged=vendor==inventory(D/'vendor'),logs={n:sha(O/n) for n in ['stdout.log','stderr.log']},actual_root_compilations=len(roots),rustc_commands=sum(x.strip().startswith('Running `') and 'rustc.exe' in x for x in lines),target_executions=0)
 if len(roots)==1:save(O/'root-command.json',split(roots[0]))
 f=O/'target/sbpf-solana-solana/release/pump_recovered.so'
 if r.returncode==0:
  shutil.copyfile(f,O/'symbols.so');result['symbols_sha256']=sha(f)
 save(O/'result.json',result);print(json.dumps(result,indent=2),flush=True)
 if r.returncode:print('\n'.join(lines[-50:]));return
 assert len(roots)==1 and all(result[k] for k in ['source_unchanged','tools_unchanged','libraries_unchanged','vendor_unchanged'])
if __name__=='__main__':main(*sys.argv[1:])
