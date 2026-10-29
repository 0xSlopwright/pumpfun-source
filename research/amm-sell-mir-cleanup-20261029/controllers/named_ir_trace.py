"""Passive full-pass capture of the current sell function; never run target output."""
from pathlib import Path
import hashlib,importlib.util,json,shutil,subprocess,time
D=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def inputs(p):return {f.relative_to(p).as_posix():sha(f) for f in p.rglob('*') if f.is_file()}
def main():
 base=D/'01-baseline';prior=D/'02-machine-trace';out=D/'13-named-ir-trace';out.mkdir(exist_ok=False)
 shutil.copytree(base/'source',out/'source');shutil.copytree(base/'target',out/'target');(out/'temp').mkdir()
 launch=json.loads((prior/'launch.json').read_text());before=[x.replace(str(prior),str(out)) for x in launch['before']]
 env={k:v.replace(str(prior),str(out)) for k,v in launch['environment'].items()}
 command=before+['-Zfewer-names=no','-C','llvm-args=-print-before-all','-C','llvm-args=-print-after-all','-C','llvm-args=-filter-print-funcs='+launch['filter_function']]
 source=inputs(out/'source');controller=sha(Path(__file__))
 save(out/'launch.json',dict(command=command,before=before,environment=env,cwd=str(out/'source'),source_inputs=source,controller_sha256=controller,filter_function=launch['filter_function'],parent='01-baseline',copied_dependencies=True,target_executions=0))
 start=time.time()
 with (out/'stdout.log').open('wb') as stdout,(out/'stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=out/'source',env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 result=dict(returncode=r.returncode,seconds=time.time()-start,target_executions=0,source_unchanged=source==inputs(out/'source'),controller_unchanged=sha(Path(__file__))==controller)
 if r.returncode==0:
  shutil.copyfile(out/'target/sbpf-solana-solana/release/deps/pump_amm_recovered.so',out/'symbols.so');result.update(sha256=sha(out/'symbols.so'),parent_sha256=sha(base/'symbols.so'),complete_compiler_output_equal=(out/'symbols.so').read_bytes()==(base/'symbols.so').read_bytes())
 result['logs']={p.name:dict(bytes=p.stat().st_size,sha256=sha(p)) for p in [out/'stdout.log',out/'stderr.log']}
 save(out/'result.json',result);print(json.dumps(result,indent=2),flush=True)
if __name__=='__main__':main()
