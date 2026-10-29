"""Run the two signed CTO quote suites with authenticated local inputs."""
from pathlib import Path
import argparse,concurrent.futures,hashlib,json,os,shutil,subprocess,sys,types
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verifier():
 p=HERE/'verify.py';m=types.ModuleType('checked');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--repo-root',type=Path,required=True);p.add_argument('--expected-bad',type=int,default=0);a=p.parse_args();v=verifier();v.check_manifest(HERE);repo=a.repo_root.resolve();candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists()
 profiles=json.loads((HERE/'runtime-inputs.json').read_text())
 for inputs in profiles.values():
  for rel,digest in inputs.items():assert sha(repo/rel)==digest,rel
 out.mkdir(parents=True);shutil.copytree(HERE,out/'kit',copy_function=shutil.copy2);shutil.copy2(candidate,out/'candidate.so');shutil.copy2(HERE/'verify.py',out/'verify.py')
 def run(suite,file):
  d=out/suite;d.mkdir();env=os.environ.copy();env['PUMP_AMM_REPO_ROOT']=str(repo);env['PYTHONPYCACHEPREFIX']=str(out/('bytecode-'+suite))
  with(d/'runtime.log').open('w')as log:subprocess.run([sys.executable,'-B',str(out/'kit/observer.py'),str(d/'transactions.json.gz'),str(out/'kit'/file),'--candidate',str(candidate),'--output',str(d/'report.json.gz')],cwd=repo,env=env,stdout=log,stderr=subprocess.STDOUT,check=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=2)as pool:list(pool.map(lambda x:run(*x),[('normal','probe.py'),('native','probe_native.py')]))
 result=v.verify_reports(out/'kit',out,candidate,a.expected_bad);(out/'verification-target.json').write_text(json.dumps({'candidate_sha256':sha(candidate),'expected_bad':a.expected_bad},indent=2)+'\n');(out/'manifest.json').write_text(json.dumps({'files':v.inventory(out)},indent=2)+'\n');v.verify(out);print(json.dumps(result,indent=2))
if __name__=='__main__':main()
