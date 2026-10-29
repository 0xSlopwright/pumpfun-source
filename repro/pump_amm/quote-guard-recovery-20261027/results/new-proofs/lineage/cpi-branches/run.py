#!/usr/bin/env python3
"""Replay the four focused groups against an explicit candidate in an intact evidence checkout."""
from pathlib import Path
import argparse, concurrent.futures, hashlib, json, os, subprocess, sys
W=Path(__file__).resolve().parent

def main():
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--candidate-build-record',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();root=a.root.resolve();out=a.output.resolve();candidate=a.candidate.resolve();record=a.candidate_build_record.resolve()
 hashes=json.loads((W/'runtime-inputs.json').read_bytes())
 for name,digest in hashes.items():assert hashlib.sha256((root/name).read_bytes()).hexdigest()==digest,name
 assert not out.exists();out.mkdir(parents=True)
 oracle=root/'repro/pump_amm/linux-v144-current-20261027/results/cpi/oracle';observer=root/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py'
 rows=[('cpi',root/'repro/pump_amm/return-data-diagnostics-20261026/probe.py',True),('curve-balances',root/'repro/pump_amm/return-data-diagnostics-20261026/probe_curve_balances.py',False),('source-amounts',root/'repro/pump_amm/legacy-transfer-constraint-20261027/probe_source_amounts.py',False),('curves',W/'probe_curves.py',None)]
 def run(row):
  name,script,long=row;cmd=[sys.executable,'-B',str(observer),str(out/(name+'-transactions.json.gz')),str(script),'--candidate',str(candidate),'--output',str(out/(name+'.json'))]
  if long is not None:cmd+=['--candidate-build-record'if long else'--candidate-record',str(record),'--oracle',str(oracle/'synthetic-oracle.so'),'--oracle-build-record'if long else'--oracle-record',str(oracle/'build-comparison.json')]
  with(out/(name+'.log')).open('w')as log:r=subprocess.run(cmd,cwd=root,stdout=log,stderr=subprocess.STDOUT,env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1'})
  return {'group':name,'returncode':r.returncode,'command':cmd}
 with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:results=list(pool.map(run,rows))
 (out/'commands.json').write_text(json.dumps(results,indent=2)+'\n');assert all(v['returncode']==0 for v in results),results
 src=(W/'verify_runtime.py').read_bytes();ns={'__file__':str(W/'verify_runtime.py'),'__name__':'focused_runtime_verifier'};exec(compile(src,str(W/'verify_runtime.py'),'exec'),ns)
 result=ns['verify'](root,candidate,out);(out/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':main()
