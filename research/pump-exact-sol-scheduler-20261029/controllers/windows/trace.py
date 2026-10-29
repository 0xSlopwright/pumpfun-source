"""Passive LLVM pass capture of the qualified exact-SOL function; no target execution."""
from pathlib import Path
import hashlib,importlib.util,json,shutil,subprocess,time
D=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def inv(p):return {f.relative_to(p).as_posix():sha(f) for f in sorted(p.rglob('*')) if f.is_file()}
def main():
 base=D/'02-guard';out=D/'05-passive-stages';out.mkdir();shutil.copytree(base/'source',out/'source');shutil.copytree(base/'target',out/'target');(out/'temp').mkdir()
 old=json.loads((base/'launch.json').read_bytes());before=inv(out/'source');assert before==old['source_inputs']
 command=[x.replace(str(base),str(out)) for x in json.loads((base/'root-command.json').read_bytes())];env={k:v.replace(str(base),str(out)) for k,v in old['environment'].items()}
 env.update(CARGO_MANIFEST_DIR=str(out/'source/programs/pump'),CARGO_PKG_NAME='pump-recovered',CARGO_PKG_VERSION='0.1.0',CARGO_CRATE_NAME='pump_recovered')
 symbol=json.loads((base/'measurement.json').read_bytes())['target']['symbol']
 flags=['-C','llvm-args=-print-before-all','-C','llvm-args=-print-after-all','-C','llvm-args=-filter-print-funcs='+symbol]
 command+=flags
 save(out/'launch.json',dict(command=command,cwd=str(out/'source'),environment=env,source_inputs=before,parent='02-guard',extra_arguments=flags,controller_sha256=sha(Path(__file__)),copied_dependencies=True,compiler_commands=1,target_executions=0))
 start=time.time()
 with (out/'stdout.log').open('wb') as stdout,(out/'stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=out/'source',env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 result=dict(returncode=r.returncode,seconds=time.time()-start,source_unchanged=before==inv(out/'source'),logs={n:dict(sha256=sha(out/n),bytes=(out/n).stat().st_size) for n in ['stdout.log','stderr.log']},target_executions=0)
 if r.returncode==0:
  shutil.copyfile(out/'target/sbpf-solana-solana/release/deps/pump_recovered.so',out/'symbols.so');result.update(symbols_sha256=sha(out/'symbols.so'),whole_output_equal=(out/'symbols.so').read_bytes()==(base/'symbols.so').read_bytes())
 save(out/'result.json',result);print(json.dumps(result,indent=2),flush=True)
 assert r.returncode==0 and result['source_unchanged'] and result['whole_output_equal']
if __name__=='__main__':main()
