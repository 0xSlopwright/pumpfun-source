#!/usr/bin/env python3
"""Run three separate signed AMM replays against an explicit candidate ELF."""
from pathlib import Path
import argparse,concurrent.futures,hashlib,json,os,shutil,subprocess,sys
K=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--root',type=Path,default=next((v for v in K.parents if(v/'evidence/original/pump_amm/deployed.so').is_file()),Path.cwd()));a=p.parse_args();root=a.root.resolve();out=a.output.resolve();candidate=a.candidate.resolve();assert candidate.is_file()and(root/'evidence/original/pump_amm/deployed.so').is_file();assert not out.exists();assert K not in out.parents
 out.mkdir(parents=True);shutil.copytree(K,out/'kit');kit=out/'kit';env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'}
 inputs={n:sha(root/n)for n in json.loads((kit/'input-paths.json').read_bytes())}
 def run_group(name):
  cmd=[sys.executable,'-B',str(kit/'observer.py'),str(out/(name+'-transactions.json.gz')),str(kit/(name+'.py')),'--candidate',str(candidate),'--output',str(out/(name+'.json'))]
  with(out/(name+'.log')).open('w')as log:r=subprocess.run(cmd,cwd=root,env=env,stdout=log,stderr=subprocess.STDOUT)
  if r.returncode:return {'group':name,'returncode':r.returncode,'passed':False}
  d=json.loads((out/(name+'.json')).read_bytes());return {'group':name,'returncode':0,'cases':d['case_count'],'mismatches':d['mismatches'],'passed':not d['mismatches']}
 with concurrent.futures.ThreadPoolExecutor(max_workers=3)as executor:results=list(executor.map(run_group,['cashback','cto','order']))
 assert inputs=={n:sha(root/n)for n in inputs},'Repository test inputs changed during replay'
 manifest={'candidate_sha256':sha(candidate),'original_sha256':inputs['evidence/original/pump_amm/deployed.so'],'oracle_sha256':sha(kit/'synthetic-cpi-caller.so'),'scope':'cashback/cto use captured dependencies; order explicitly substitutes the synthetic local Pump CPI caller.','inputs':inputs,'groups':results,'passed':all(v['passed']for v in results),'files':{str(v.relative_to(out)):sha(v)for v in sorted(out.rglob('*'))if v.is_file()}};(out/'run.json').write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps({k:v for k,v in manifest.items()if k not in('files','inputs')},indent=2));raise SystemExit(0 if manifest['passed']else 1)
if __name__=='__main__':main()
