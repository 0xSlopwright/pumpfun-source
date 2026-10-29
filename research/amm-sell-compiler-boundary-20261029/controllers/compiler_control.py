"""One root compiler option control. All source and dependency bytes are reused."""
from pathlib import Path
import hashlib,importlib.util,json,shutil,subprocess,sys,time
D=Path(__file__).resolve().parent;W=D.parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,v):p.write_bytes((json.dumps(v,indent=2)+'\n').encode())
def main(label,option):
 assert option in ['-branch-fold-placement=false','-tail-dup-placement=false','-disable-block-placement','-enable-tail-merge=false']
 base=D/'01-baseline';trace=D/'02-machine-trace';out=D/label;out.mkdir(exist_ok=False)
 shutil.copytree(base/'source',out/'source');shutil.copytree(base/'target',out/'target');(out/'temp').mkdir()
 launch=json.loads((trace/'launch.json').read_text());before=[a.replace(str(trace),str(out)) for a in launch['before']]
 env={k:v.replace(str(trace),str(out)) for k,v in launch['environment'].items()}
 command=before+['-C','llvm-args='+option]
 save(out/'launch.json',dict(command=command,before=before,cwd=str(out/'source'),environment=env,option=option,source_inputs={p.relative_to(out/'source').as_posix():sha(p) for p in (out/'source').rglob('*') if p.is_file()},copied_dependencies_from=str(base/'target'),compiler_commands=1,target_executions=0))
 start=time.time()
 with (out/'stdout.log').open('wb') as stdout,(out/'stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=out/'source',env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 result=dict(returncode=r.returncode,seconds=time.time()-start,target_executions=0)
 if r.returncode==0:
  shutil.copyfile(out/'target/sbpf-solana-solana/release/deps/pump_amm_recovered.so',out/'symbols.so');result['sha256']=sha(out/'symbols.so')
 save(out/'result.json',result);print(json.dumps(result),flush=True)
 if r.returncode:print((out/'stderr.log').read_text(errors='replace')[-3000:]);return
 s=importlib.util.spec_from_file_location('measure',W/'amm-fresh-v144/measure.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
 result=m.measure(out/'symbols.so');save(out/'measurement.json',result);print({k:v for k,v in result.items() if k!='rows'},flush=True)
if __name__=='__main__':main(*sys.argv[1:])
