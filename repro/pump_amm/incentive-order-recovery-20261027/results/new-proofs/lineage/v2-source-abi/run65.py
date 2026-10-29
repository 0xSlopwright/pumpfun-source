from pathlib import Path
import argparse,concurrent.futures,hashlib,json,os,subprocess,sys
W=Path(__file__).resolve().parent;p=argparse.ArgumentParser();p.add_argument('--inputs',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();I=a.inputs.resolve();C=a.candidate.resolve();O=a.output.resolve();O.mkdir(parents=True,exist_ok=False)
manifest={str(p.relative_to(I)):hashlib.sha256(p.read_bytes()).hexdigest()for p in I.rglob('*')if p.is_file()};(O/'input-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
cases=[('buy','probe_buy_events.py',16),('sell','probe_sell_events.py',10),('contexts','probe_contexts.py',21),('buy_executors','probe_buy_executors.py',18)];env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1')
def run(row):
 name,script,count=row;cmd=[sys.executable,'-B',str(I/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py'),str(O/(name+'-transactions.json.gz')),str(I/'repro/pump_amm/transfer-abi-recovery-20261027'/script),'--candidate',str(C),'--output',str(O/(name+'.json'))]
 with(O/(name+'.log')).open('w')as log:r=subprocess.run(cmd,cwd=I,env=env,stdout=log,stderr=subprocess.STDOUT)
 return {'name':name,'count':count,'returncode':r.returncode,'command':cmd}
with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:results=list(pool.map(run,cases))
(O/'execution.json').write_text(json.dumps({'candidate_sha256':hashlib.sha256(C.read_bytes()).hexdigest(),'runs':results},indent=2)+'\n');assert all(r['returncode']==0 for r in results),results
print(json.dumps({'completed':True,'candidate_sha256':hashlib.sha256(C.read_bytes()).hexdigest(),'cases':65}))
