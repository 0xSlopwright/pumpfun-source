#!/usr/bin/env python3
from pathlib import Path
import concurrent.futures,hashlib,json,os,subprocess,sys
ROOT=next(p for p in Path(__file__).resolve().parents if(p/'evidence/original/pump_amm/deployed.so').is_file());W=Path(__file__).resolve().parent
candidate=W/'build/artifacts/pump_amm_recovered.so';record=W/'build/build-comparison.json';oracle=ROOT/'repro/pump_amm/linux-v144-current-20261027/results/cpi/oracle';out=W/'replay';out.mkdir(exist_ok=False)
observer=ROOT/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py'

def run(row):
 name,script,long=row;cmd=[sys.executable,'-B',str(observer),str(out/(name+'-transactions.json.gz')),str(ROOT/script),'--candidate',str(candidate),'--candidate-build-record'if long else'--candidate-record',str(record),'--oracle',str(oracle/'synthetic-oracle.so'),'--oracle-build-record'if long else'--oracle-record',str(oracle/'build-comparison.json'),'--output',str(out/(name+'.json'))]
 with(out/(name+'.log')).open('w')as log:r=subprocess.run(cmd,cwd=ROOT,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1','PYTHONPYCACHEPREFIX':str(out/('unused-'+name))},stdout=log,stderr=subprocess.STDOUT)
 return {'name':name,'returncode':r.returncode,'command':cmd}
rows=[('cpi','repro/pump_amm/return-data-diagnostics-20261026/probe.py',True),('curve-balances','repro/pump_amm/return-data-diagnostics-20261026/probe_curve_balances.py',False),('source-amounts','repro/pump_amm/legacy-transfer-constraint-20261027/probe_source_amounts.py',False)]
with concurrent.futures.ThreadPoolExecutor(max_workers=3)as executor:results=list(executor.map(run,rows))
(out/'run.json').write_text(json.dumps({'results':results,'candidate_sha256':hashlib.sha256(candidate.read_bytes()).hexdigest(),'oracle_sha256':hashlib.sha256((oracle/'synthetic-oracle.so').read_bytes()).hexdigest()},indent=2)+'\n');print(results);assert all(x['returncode']==0 for x in results)
