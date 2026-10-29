#!/usr/bin/env python3
"""Replay the immutable13 InitBoost controls against an explicit candidate."""
from pathlib import Path
import argparse,hashlib,json,os,shutil,subprocess,sys,types
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser();p.add_argument('--repo-root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();root=a.repo_root.resolve();candidate=a.candidate.resolve();out=a.output.resolve();out.mkdir(parents=True,exist_ok=False)
 kit=Path(__file__).resolve().parent/'runtime-kit';inputs=json.loads((kit/'runtime-inputs.json').read_bytes());stage=out/'runtime-inputs'
 for name,digest in inputs.items():
  original=root/name if name.endswith('.so')else kit/'runtime-sources'/name;assert sha(original)==digest;dest=stage/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(original,dest)
 scripts=stage/'probes/initboost';scripts.mkdir(parents=True)
 for name in ['probe.py','observer.py']:shutil.copy2(kit/name,scripts/name)
 command=[sys.executable,'-B',str(scripts/'observer.py'),str(out/'transactions.json.gz'),str(scripts/'probe.py'),'--candidate',str(candidate),'--output',str(out/'report.json.gz')]
 (out/'command.json').write_text(json.dumps(command,indent=2)+'\n')
 subprocess.run(command,cwd=stage,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'},check=True)
 vp=kit/'verify.py';m=types.ModuleType('saved_verifier');m.__file__=str(vp);exec(compile(vp.read_bytes(),str(vp),'exec'),m.__dict__);result=m.verify_output(kit,candidate,out);(out/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':main()
