from pathlib import Path
import argparse,hashlib,json,os,shutil,subprocess,sys,types
sys.dont_write_bytecode=True
K=Path(__file__).resolve().parent

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--repo-root',type=Path,required=True);a=p.parse_args();m=types.ModuleType('v');m.__file__=str(K/'verify.py');exec(compile((K/'verify.py').read_bytes(),m.__file__,'exec'),m.__dict__);m.check_manifest(K);repo=a.repo_root.resolve();out=a.output.resolve();candidate=a.candidate.resolve();assert not out.exists()
 for rel,h in json.loads((K/'runtime-inputs.json').read_text()).items():assert hashlib.sha256((repo/rel).read_bytes()).hexdigest()==h
 out.mkdir(parents=True);shutil.copytree(K,out/'kit',copy_function=shutil.copy2);shutil.copy2(candidate,out/'candidate.so');shutil.copy2(K/'verify.py',out/'verify.py');env=os.environ.copy();env['PUMP_AMM_REPO_ROOT']=str(repo);env['PYTHONPYCACHEPREFIX']=str(out/'bytecode')
 with(out/'runtime.log').open('w')as log:subprocess.run([sys.executable,'-B',str(out/'kit/observer.py'),str(out/'transactions.json.gz'),str(out/'kit/probe.py'),'--candidate',str(candidate),'--output',str(out/'report.json.gz')],cwd=repo,env=env,stdout=log,stderr=subprocess.STDOUT,check=True)
 result=m.verify_reports(out/'kit',out,candidate);(out/'manifest.json').write_text(json.dumps({'files':m.inventory(out)},indent=2)+'\n');m.verify(out);print(json.dumps(result,indent=2))
if __name__=='__main__':main()
