from pathlib import Path
import argparse,hashlib,json,os,shutil,subprocess,sys,types
W=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 assert json.loads((W/'manifest.json').read_bytes())['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 p=argparse.ArgumentParser();p.add_argument('--repo-root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();root=a.repo_root.resolve();out=a.output.resolve();out.mkdir(parents=True,exist_ok=False);stage=out/'runtime-inputs';inputs=json.loads((W/'runtime-inputs.json').read_bytes())
 for name,digest in inputs.items():
  src=root/name if name.endswith('.so')else W/'runtime-sources'/name;assert sha(src)==digest;dst=stage/name;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(src,dst)
 scripts=stage/'probes/flags';scripts.mkdir(parents=True)
 for name in ['probe.py','observer.py']:shutil.copy2(W/name,scripts/name)
 command=[sys.executable,'-B',str(scripts/'observer.py'),str(out/'transactions.json.gz'),str(scripts/'probe.py'),'--candidate',str(a.candidate.resolve()),'--output',str(out/'report.json.gz')];(out/'command.json').write_text(json.dumps(command,indent=2)+'\n');subprocess.run(command,cwd=stage,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'},check=True)
 vp=W/'verify.py';m=types.ModuleType('verify');m.__file__=str(vp);exec(compile(vp.read_bytes(),str(vp),'exec'),m.__dict__);result=m.verify(a.candidate.resolve(),out);(out/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':main()
