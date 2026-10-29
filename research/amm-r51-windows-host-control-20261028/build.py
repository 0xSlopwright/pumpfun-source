"""Build exact checked r51 on native Windows; capture ordinary LLD side outputs.

Only host compiler tools/build scripts run. No SBPF program is executed.
"""
import argparse, gzip, hashlib, io, json, os, shutil, subprocess, tarfile, time
from pathlib import Path, PurePosixPath
HERE=Path(__file__).resolve().parent
def sha(p):
 with p.open('rb') as f:return hashlib.file_digest(f,'sha256').hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def read(p):return json.loads(gzip.decompress(p.read_bytes()) if p.suffix=='.gz' else p.read_bytes())
def require(ok,message):
 if not ok:raise ValueError(message)
def safe(n):
 p=PurePosixPath(n)
 require(n and not p.is_absolute() and '..' not in p.parts and ':' not in n and '\\' not in n and p.as_posix()==n,'unsafe path')
 return n
def pin(root,files):
 for name,digest in files.items():
  p=root/safe(name);require(p.is_file() and not p.is_symlink() and sha(p)==digest,'input differs: '+name)
def vendor_pin(root):
 files=read(HERE/'vendor-files.json.gz')
 require({p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}==set(files),'vendor membership differs')
 pin(root,files)
def materialize(output):
 binding=read(HERE/'source-binding.json');a=HERE/'source.tar.gz';require(sha(a)==binding['sha256'],'source archive differs')
 files={}
 with tarfile.open(a) as t:
  for m in t.getmembers():
   name=safe(m.name);require(m.isfile() and name not in files,'nonregular/duplicate source')
   b=t.extractfile(m).read();files[name]=hashlib.sha256(b).hexdigest();p=output/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
 require(files==binding['files'],'source members differ')
 return files
def build(args):
 require(os.name=='nt','Windows compiler host required')
 sdk,vendor,vc,kit,output=[getattr(args,n).resolve() for n in ['sdk','vendor','msvc','windows_sdk','output']]
 output.mkdir(parents=True,exist_ok=False);start=time.monotonic();result=dict(status='STARTED',target_executions=0)
 try:
  sdk_files={r['path']:r['sha256'] for r in read(HERE/'sdk-components.json.gz')['files']};pin(sdk,sdk_files);vendor_pin(vendor)
  linux=args.linux_sysroot.resolve() if args.linux_sysroot else None
  if linux:pin(linux,{r['path']:r['sha256'] for r in read(HERE/'linux-sysroot-inputs.json')['files']})
  host=read(HERE/'host-tools.json');pin(vc/'bin/Hostx64/x64',host)
  source=output/'source';inputs=materialize(source);cargo_home=output/'cargo-home';cargo_home.mkdir();temp=output/'temp';temp.mkdir()
  (cargo_home/'config.toml').write_bytes(('[source.crates-io]\nreplace-with="locked-vendor"\n[source.locked-vendor]\ndirectory='+json.dumps(str(vendor))+'\n[net]\noffline=true\n').encode())
  system=Path(os.environ['SystemRoot']);ver=args.kit_version
  env={k:os.environ[k] for k in ['SystemRoot','WINDIR','SystemDrive','COMSPEC','PROCESSOR_ARCHITECTURE'] if k in os.environ}
  env.update(PATH=os.pathsep.join(map(str,[sdk/'rust/bin',sdk/'llvm/bin',vc/'bin/Hostx64/x64',kit/'bin'/ver/'x64',system/'System32'])),LIB=os.pathsep.join(map(str,[vc/'lib/x64',kit/'Lib'/ver/'ucrt/x64',kit/'Lib'/ver/'um/x64'])),INCLUDE=os.pathsep.join(map(str,[vc/'include',*[kit/'Include'/ver/n for n in ['ucrt','shared','um','winrt']]])),RUSTC=str(sdk/'rust/bin/rustc.exe'),RUSTDOC=str(sdk/'rust/bin/rustdoc.exe'),CARGO_HOME=str(cargo_home),CARGO_TARGET_DIR=str(output/'target'),CARGO_NET_OFFLINE='true',CARGO_BUILD_JOBS='8',CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS='-Zremap-cwd-prefix=',CC_sbpf_solana_solana=str(sdk/'llvm/bin/clang.exe'),AR_sbpf_solana_solana=str(sdk/'llvm/bin/llvm-ar.exe'),CARGO_TARGET_X86_64_PC_WINDOWS_MSVC_LINKER=str(vc/'bin/Hostx64/x64/link.exe'),CARGO_TARGET_SBPF_SOLANA_SOLANA_LINKER=str(sdk/'rust/lib/rustlib/x86_64-pc-windows-msvc/bin/rust-lld.exe'),TEMP=str(temp),TMP=str(temp))
  if linux:env['CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS']+=' --sysroot='+str(linux/'rust')
  command=[str(sdk/'rust/bin/cargo.exe'),'rustc','--release','--target','sbpf-solana-solana','--manifest-path',str(source/'Cargo.toml'),'--locked','--offline','--verbose','-p','pump-amm-recovered','--lib','--','-C','link-arg=--Map='+str(output/'link.map'),'-C','link-arg=--reproduce='+str(output/'link.tar')]
  save(output/'launch.json',dict(command=command,cwd=str(source),environment=env,source_inputs=inputs,target_directory_initially_absent=not (output/'target').exists(),controller_sha256=sha(Path(__file__)),sdk_components=len(sdk_files),vendor_files=len(read(HERE/'vendor-files.json.gz')),target_executions=0))
  with (output/'stdout.log').open('wb') as out,(output/'stderr.log').open('wb') as err:r=subprocess.run(command,cwd=source,env=env,stdout=out,stderr=err,creationflags=subprocess.CREATE_NO_WINDOW)
  log=(output/'stderr.log').read_text(errors='replace');result['cargo_rustc_commands']=sum('Running `'in line and'--crate-name 'in line for line in log.splitlines());result['cargo_fresh_lines']=sum(line.strip().startswith('Fresh ')for line in log.splitlines());result['linker_mode']='official-windows-default-with-LLD-side-outputs';result['returncode']=r.returncode;require(r.returncode==0,'Cargo build failed; retained logs')
  pin(source,inputs);require({p.relative_to(source).as_posix() for p in source.rglob('*') if p.is_file()}==set(inputs),'source membership changed');result['source_unchanged']=True
  f=output/'target/sbpf-solana-solana/release/pump_amm_recovered.so';shutil.copyfile(f,output/'symbols.so');result['symbols_sha256']=sha(f)
  strip=[str(sdk/'llvm/bin/llvm-objcopy.exe'),'--strip-all',str(output/'symbols.so'),str(output/'stripped.so')]
  r=subprocess.run(strip,env=env,capture_output=True,creationflags=subprocess.CREATE_NO_WINDOW);(output/'strip.stdout.log').write_bytes(r.stdout);(output/'strip.stderr.log').write_bytes(r.stderr)
  result['strip']=dict(command=strip,returncode=r.returncode);require(r.returncode==0,'ordinary strip failed');result['stripped_sha256']=sha(output/'stripped.so')
  pin(sdk,sdk_files);vendor_pin(vendor);pin(vc/'bin/Hostx64/x64',host)
  if linux:pin(linux,{r['path']:r['sha256'] for r in read(HERE/'linux-sysroot-inputs.json')['files']})
  require((output/'link.map').is_file() and(output/'link.tar').is_file(),'actual linker side outputs missing')
  result['linker_map_sha256']=sha(output/'link.map');result['linker_reproduction_sha256']=sha(output/'link.tar');result['linker_reproduction_bytes']=(output/'link.tar').stat().st_size
  with tarfile.open(output/'link.tar')as archive:
   members=[dict(name=m.name,bytes=m.size,type=m.type.decode('ascii',errors='replace'))for m in archive.getmembers()]
  save(output/'linker-reproduction-inventory.json',dict(archive_sha256=result['linker_reproduction_sha256'],members=members,objects_or_archives_not_modified=True,role='actual linker input identity evidence, never patched or reused as candidate build inputs'))
  result['status']='SUCCEEDED'
 except Exception as e:
  result.update(status='FAILED',error=str(e));raise
 finally:
  result['seconds']=time.monotonic()-start;result['logs']={p.name:sha(p) for p in output.glob('*.log')};save(output/'result.json',result)
 return result
if __name__=='__main__':
 a=argparse.ArgumentParser(description=__doc__)
 for n in ['sdk','vendor','msvc','windows-sdk','output']:a.add_argument('--'+n,type=Path,required=True)
 a.add_argument('--linux-sysroot',type=Path,required=True);a.add_argument('--kit-version',default='10.0.26100.0');print(json.dumps(build(a.parse_args()),indent=2))
