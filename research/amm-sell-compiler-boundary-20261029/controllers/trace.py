from pathlib import Path
import ctypes,hashlib,importlib.util,json,shutil,subprocess,sys,time
D=Path(__file__).resolve().parent;W=D.parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def split(command):
 fn=ctypes.windll.shell32.CommandLineToArgvW;fn.argtypes=[ctypes.c_wchar_p,ctypes.POINTER(ctypes.c_int)];fn.restype=ctypes.POINTER(ctypes.c_wchar_p);n=ctypes.c_int();p=fn(command,ctypes.byref(n));assert p
 try:return [p[i] for i in range(n.value)]
 finally:ctypes.windll.kernel32.LocalFree(p)
def trace(label,parent):
 src=D/parent;out=D/label;out.mkdir(exist_ok=False);shutil.copytree(src/'source',out/'source');shutil.copytree(src/'target',out/'target');(out/'temp').mkdir()
 launch=json.loads((src/'launch.json').read_text());cmdline=next(x.strip()[9:-1] for x in (src/'stderr.log').read_text().splitlines() if x.strip().startswith('Running `') and '--crate-name pump_amm_recovered ' in x);command=split(cmdline)
 assert command[1:3]==['--crate-name','pump_amm_recovered'],command[:4]
 command=[a.replace(str(src),str(out)) for a in command];env={k:v.replace(str(src),str(out)) for k,v in launch['environment'].items()};env.update(CARGO_MANIFEST_DIR=str(out/'source/programs/pump-amm'),CARGO_PKG_NAME='pump-amm-recovered',CARGO_PKG_VERSION='0.1.0',CARGO_CRATE_NAME='pump_amm_recovered')
 spec=importlib.util.spec_from_file_location('reader',W/'amm-call-frontier/reader.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);e=m.Elf(src/'symbols.so');f=next(x for x in e.funcs if 'sell8cashback' in x['name'])
 before=command[:];command+=['-C','llvm-args=-print-before=branch-folder,block-placement','-C','llvm-args=-print-after=branch-folder,block-placement','-C','llvm-args=-debug-pass=Structure','-C','llvm-args=-filter-print-funcs='+f['name']]
 save(out/'launch.json',dict(command=command,before=before,cwd=str(out/'source'),environment=env,parent=parent,filter_function=f['name'],copied_dependencies=True,target_executions=0));start=time.time()
 with (out/'stdout.log').open('wb') as stdout,(out/'stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=out/'source',env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 result=dict(returncode=r.returncode,seconds=time.time()-start,target_executions=0)
 if r.returncode==0:
  shutil.copyfile(out/'target/sbpf-solana-solana/release/deps/pump_amm_recovered.so',out/'symbols.so');result.update(sha256=sha(out/'symbols.so'),parent_sha256=sha(src/'symbols.so'),complete_compiler_output_equal=(out/'symbols.so').read_bytes()==(src/'symbols.so').read_bytes())
 save(out/'result.json',result);print(json.dumps(result),flush=True)
if __name__=='__main__':trace(*sys.argv[1:])
