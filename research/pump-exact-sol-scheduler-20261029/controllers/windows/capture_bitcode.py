"""Retain optimized bitcode and relocatable object without changing source or target flags."""
from pathlib import Path
import hashlib,json,shutil,subprocess,time
D=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def inv(p):return {f.relative_to(p).as_posix():sha(f) for f in sorted(p.rglob('*')) if f.is_file()}
def main():
 base=D/'02-guard';out=D/'06-bitcode-object';out.mkdir();shutil.copytree(base/'source',out/'source');shutil.copytree(base/'target',out/'target');(out/'temp').mkdir()
 old=json.loads((base/'launch.json').read_bytes());before=inv(out/'source');assert before==old['source_inputs']
 command=[x.replace(str(base),str(out)) for x in json.loads((base/'root-command.json').read_bytes())];env={k:v.replace(str(base),str(out)) for k,v in old['environment'].items()}
 env.update(CARGO_MANIFEST_DIR=str(out/'source/programs/pump'),CARGO_PKG_NAME='pump-recovered',CARGO_PKG_VERSION='0.1.0',CARGO_CRATE_NAME='pump_recovered')
 assert command.count('--emit=dep-info,link')==1;command[command.index('--emit=dep-info,link')]='--emit=dep-info,link,llvm-bc,obj'
 save(out/'launch.json',dict(command=command,cwd=str(out/'source'),environment=env,source_inputs=before,parent='02-guard',changed_emit='dep-info,link,llvm-bc,obj',controller_sha256=sha(Path(__file__)),copied_dependencies=True,compiler_commands=1,target_executions=0))
 start=time.time()
 with (out/'stdout.log').open('wb') as stdout,(out/'stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=out/'source',env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 result=dict(returncode=r.returncode,seconds=time.time()-start,source_unchanged=before==inv(out/'source'),logs={n:sha(out/n) for n in ['stdout.log','stderr.log']},target_executions=0)
 if r.returncode==0:
  deps=out/'target/sbpf-solana-solana/release/deps';retained={}
  for suffix in ['bc','o','so']:
   matches=list(deps.glob('pump_recovered.'+suffix));assert len(matches)==1,(suffix,matches)
   f=matches[0];name='symbols.so' if suffix=='so' else 'root.'+suffix;shutil.copyfile(f,out/name);retained[name]={'sha256':sha(out/name),'bytes':(out/name).stat().st_size}
  result.update(outputs=retained,whole_output_equal=(out/'symbols.so').read_bytes()==(base/'symbols.so').read_bytes())
 save(out/'result.json',result);print(json.dumps(result,indent=2),flush=True)
 assert r.returncode==0 and result['source_unchanged'] and result['whole_output_equal']
if __name__=='__main__':main()
