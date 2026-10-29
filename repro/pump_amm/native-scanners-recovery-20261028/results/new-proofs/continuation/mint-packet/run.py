#!/usr/bin/env python3
"""Replay the mint/order suites against any candidate ELF using packet-local inputs."""
import sys
sys.dont_write_bytecode=True
from pathlib import Path
import argparse,json,subprocess
import verify
HERE=Path(__file__).resolve().parent

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--baseline',action='store_true');a=p.parse_args();candidate=a.candidate.resolve();out=a.output.resolve();assert HERE!=out and HERE not in out.parents;out.mkdir(parents=True,exist_ok=False);verify.verify_inventory()
 for label,producer,_,_ in verify.SUITES:
  cmd=[sys.executable,'-B',str(HERE/'runtime/observe_suite.py'),str(out/(label+'-transactions.json.gz')),str(HERE/'runtime/probes/mint-order'/producer),'--candidate',str(candidate),'--output',str(out/(label+'.json'))]
  with (out/(label+'.log')).open('w')as log:subprocess.run(cmd,cwd=HERE/'runtime',stdout=log,stderr=subprocess.STDOUT,check=True)
 result=verify.verify_output(candidate,out,a.baseline);result={k:v for k,v in result.items()if k not in ['originals','messages']};result['executes_sbf']=True;(out/'summary.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':main()
