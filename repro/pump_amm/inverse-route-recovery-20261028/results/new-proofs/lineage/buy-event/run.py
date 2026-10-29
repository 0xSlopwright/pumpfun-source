#!/usr/bin/env python3
from pathlib import Path
import argparse,concurrent.futures,hashlib,json,os,subprocess,sys
W=Path(__file__).resolve().parent;ROOT=next(p for p in W.parents if(p/'evidence/original/pump_amm/deployed.so').is_file())
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,default=W/'build/artifacts/pump_amm_recovered.so');p.add_argument('--output',type=Path,default=W/'runtime');a=p.parse_args();out=a.output.resolve();out.mkdir(parents=True,exist_ok=False);inputs=json.loads((W/'runtime-inputs.json').read_bytes())
 for name,row in inputs.items():assert hashlib.sha256((W/'inputs'/(name+'.py')).read_bytes()).hexdigest()==row['sha256'],name
 for name,digest in json.loads((W/'harness-inputs.json').read_bytes()).items():assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==digest,name
 def run(name):
  cmd=[sys.executable,'-B',str(W/'inputs/observer.py'),str(out/(name+'-transactions.json.gz')),str(W/'inputs'/(name+'.py')),'--candidate',str(a.candidate.resolve()),'--output',str(out/(name+'.json'))]
  with(out/(name+'.log')).open('w')as f:r=subprocess.run(cmd,cwd=ROOT,stdout=f,stderr=subprocess.STDOUT,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'})
  return {'name':name,'command':cmd,'returncode':r.returncode}
 with concurrent.futures.ThreadPoolExecutor(max_workers=3)as pool:rows=list(pool.map(run,['events','orders','curves']))
 (out/'commands.json').write_text(json.dumps(rows,indent=2)+'\n');assert all(r['returncode']==0 for r in rows),rows
 ns={'__name__':'runtime_verifier','__file__':str(W/'verify_runtime.py')};exec(compile((W/'verify_runtime.py').read_bytes(),str(W/'verify_runtime.py'),'exec'),ns);result=ns['verify'](ROOT,a.candidate,out);(out/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':main()
