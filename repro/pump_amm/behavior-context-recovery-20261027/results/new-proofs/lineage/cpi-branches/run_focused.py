#!/usr/bin/env python3
from pathlib import Path
import concurrent.futures, json, os, subprocess, sys
W=Path(__file__).resolve().parent
ROOT=next(p for p in W.parents if(p/'evidence/original/pump_amm/deployed.so').is_file())
def run_synthetic():
 cmd=[sys.executable,'-B',str(W/'run_probes.py')]
 with(W/'synthetic-driver.log').open('w')as f:
  x=subprocess.run(cmd,cwd=ROOT,stdout=f,stderr=subprocess.STDOUT,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'})
 return {'group':'synthetic91','returncode':x.returncode,'command':cmd}
def run_captured():
 cmd=[sys.executable,'-B',str(W/'observer.py'),str(W/'curves-transactions.json.gz'),str(W/'probe_curves.py'),'--candidate',str(W/'build/artifacts/pump_amm_recovered.so'),'--output',str(W/'curves.json')]
 with(W/'curves-driver.log').open('w')as f:
  x=subprocess.run(cmd,cwd=ROOT,stdout=f,stderr=subprocess.STDOUT,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'})
 return {'group':'captured64','returncode':x.returncode,'command':cmd}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as x:
 rows=list(x.map(lambda f:f(),[run_synthetic,run_captured]))
(W/'focused-commands.json').write_text(json.dumps(rows,indent=2)+'\n')
assert all(r['returncode']==0 for r in rows),rows
import shutil
for p in [W/'curves.json',W/'curves-transactions.json.gz']:shutil.copy2(p,W/'replay'/p.name)
verify=subprocess.run([sys.executable,'-B',str(W/'verify_runtime.py'),'--root',str(ROOT)],cwd=ROOT,capture_output=True,text=True)
(W/'runtime-verification.json').write_text(verify.stdout)
(W/'runtime-verification.stderr').write_text(verify.stderr)
verify.check_returncode()
print(verify.stdout)
