#!/usr/bin/env python3
from pathlib import Path
import argparse,concurrent.futures,json,os,subprocess,sys
W=Path(__file__).resolve().parent;ROOT=next(p for p in W.parents if(p/'evidence/original/pump_amm/deployed.so').is_file())
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();out=a.output.resolve();out.mkdir(parents=True,exist_ok=False)
 def run(name):
  script=W/'probe_entrypoint.py'if name=='entrypoint'else W/'runtime-inputs'/(name+'.py');cmd=[sys.executable,'-B',str(W/'runtime-inputs/observer.py'),str(out/(name+'-transactions.json.gz')),str(script),'--candidate',str(a.candidate.resolve()),'--output',str(out/(name+'.json'))]
  with(out/(name+'.log')).open('w')as f:r=subprocess.run(cmd,cwd=ROOT,stdout=f,stderr=subprocess.STDOUT,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1','PYTHONPYCACHEPREFIX':str(out/('unused-pycache-'+name))})
  return {'name':name,'command':cmd,'returncode':r.returncode}
 with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:rows=list(pool.map(run,['events','orders','curves','entrypoint']))
 (out/'commands.json').write_text(json.dumps(rows,indent=2)+'\n');assert all(r['returncode']==0 for r in rows),rows
 ns={'__name__':'runtime_verifier','__file__':str(W/'verify_runtime.py')};exec(compile((W/'verify_runtime.py').read_bytes(),str(W/'verify_runtime.py'),'exec'),ns);v=ns['verify'](ROOT,a.candidate,out);(out/'verification.json').write_text(json.dumps(v,indent=2)+'\n');print(json.dumps(v,indent=2))
if __name__=='__main__':main()
