"""Build an assertion-enabled LLVM diagnostic toolchain from the pinned SDK source."""
from pathlib import Path
import datetime,hashlib,json,os,shutil,subprocess,time
D=Path(__file__).resolve().parent;W=D.parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def main():
 out=D/'attempt01';out.mkdir();build=D/'build01';assert not build.exists();shutil.copyfile(Path(__file__),out/'executed-builder.py')
 root=D/'source';inventory=json.loads((D/'source-inventory.json').read_bytes());assert all(sha(root/n)==h for n,h in inventory.items())
 env=json.loads((W/'pump-exact-sol-controls/02-guard/launch.json').read_bytes())['environment']
 env={k:v for k,v in env.items() if k in ['SystemRoot','WINDIR','SystemDrive','COMSPEC','PROCESSOR_ARCHITECTURE','PATH','LIB','INCLUDE']}
 temp=out/'temp';temp.mkdir();env.update(TEMP=str(temp),TMP=str(temp),NINJA_STATUS='[%f/%t %es] ')
 tools=Path(r'C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\Common7\IDE\CommonExtensions\Microsoft\CMake');cmake=tools/'CMake/bin/cmake.exe';ninja=tools/'Ninja/ninja.exe'
 vc=Path(r'C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\14.44.35207\bin\Hostx64\x64')
 python=Path(r'C:\Users\Wind\AppData\Local\Programs\Python\Python313\python.exe')
 command=[str(cmake),'-S',str(root/'llvm'),'-B',str(build),'-G','Ninja','-DCMAKE_MAKE_PROGRAM='+str(ninja),'-DCMAKE_C_COMPILER='+str(vc/'cl.exe'),'-DCMAKE_CXX_COMPILER='+str(vc/'cl.exe'),'-DCMAKE_BUILD_TYPE=Release','-DLLVM_TARGETS_TO_BUILD=SBF','-DLLVM_ENABLE_ASSERTIONS=ON','-DLLVM_ENABLE_PROJECTS=','-DLLVM_INCLUDE_TESTS=OFF','-DLLVM_INCLUDE_EXAMPLES=OFF','-DLLVM_INCLUDE_BENCHMARKS=OFF','-DLLVM_INCLUDE_DOCS=OFF','-DLLVM_ENABLE_BINDINGS=OFF','-DLLVM_ENABLE_ZLIB=OFF','-DLLVM_ENABLE_ZSTD=OFF','-DLLVM_ENABLE_LIBXML2=OFF','-DLLVM_ENABLE_TERMINFO=OFF','-DPython3_EXECUTABLE='+str(python),'-DPYTHON_EXECUTABLE='+str(python)]
 receipt={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Diagnostic LLVM build only; exact pinned source, assertions enabled, SBF-only, no target-program execution. Not a replacement production SDK.','source_revision':'08aedd64bf3abe4f163407b7bcf680403b84b32d','source_inventory_sha256':sha(D/'source-inventory.json'),'command':command,'environment':env,'tools':{str(p):sha(p) for p in [cmake,ninja,vc/'cl.exe',vc/'link.exe',python]},'controller_sha256':sha(Path(__file__))}
 save(out/'configure-launch.json',receipt);start=time.time()
 with(out/'configure.stdout.log').open('wb') as stdout,(out/'configure.stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=D,env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 save(out/'configure-result.json',{'returncode':r.returncode,'seconds':time.time()-start,'logs':{n:sha(out/n) for n in ['configure.stdout.log','configure.stderr.log']}})
 print('configure return code',r.returncode,flush=True)
 if r.returncode:print((out/'configure.stdout.log').read_text(errors='replace')[-6000:]);print((out/'configure.stderr.log').read_text(errors='replace')[-6000:]);return
 command=[str(cmake),'--build',str(build),'--target','llc','llvm-dis','llvm-extract','--parallel','12'];save(out/'build-launch.json',{'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'command':command,'cwd':str(D),'environment':env,'configure_launch_sha256':sha(out/'configure-launch.json'),'cmake_cache_sha256':sha(build/'CMakeCache.txt'),'build_ninja_sha256':sha(build/'build.ninja')});start=time.time()
 with(out/'build.stdout.log').open('wb') as stdout,(out/'build.stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=D,env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 result={'returncode':r.returncode,'seconds':time.time()-start,'source_unchanged':all(sha(root/n)==h for n,h in inventory.items()),'logs':{n:sha(out/n) for n in ['build.stdout.log','build.stderr.log']},'outputs':{n:sha(build/'bin'/n) for n in ['llc.exe','llvm-dis.exe','llvm-extract.exe'] if (build/'bin'/n).exists()}}
 save(out/'build-result.json',result);print(json.dumps(result,indent=2),flush=True)
 if r.returncode:print((out/'build.stdout.log').read_text(errors='replace')[-6000:]);print((out/'build.stderr.log').read_text(errors='replace')[-6000:])
if __name__=='__main__':main()
