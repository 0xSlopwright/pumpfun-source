#!/usr/bin/env python3
"""Replay the 58 offline signed cases using only this packet's snapshots."""
import sys
sys.dont_write_bytecode = True
from pathlib import Path
import argparse,json,subprocess,sys
import verify_packet as proof
HERE=Path(__file__).resolve().parent

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',choices=[*proof.CANDIDATES,'all'],default='integrated');p.add_argument('--output',type=Path,required=True);a=p.parse_args();proof.verify_inventory();out=a.output.resolve();assert HERE!=out and HERE not in out.parents,'Use an output directory outside the immutable packet';out.mkdir(parents=True,exist_ok=False)
 labels=list(proof.CANDIDATES)if a.candidate=='all'else[a.candidate];runs=[]
 for label in labels:
  report=out/(label+'.json');receipts=out/(label+'-transactions.json.gz');log=out/(label+'.log')
  cmd=[sys.executable,'-B',str(HERE/'runtime/observe_suite.py'),str(receipts),str(HERE/'runtime/probes/transfer-fee/probe_decoder.py'),'--candidate',str(HERE/proof.CANDIDATES[label][0]),'--output',str(report)]
  with log.open('w')as f:subprocess.run(cmd,cwd=HERE/'runtime',stdout=f,stderr=subprocess.STDOUT,check=True)
  run=proof.verify_run(label,report,receipts);saved=proof.load(HERE/'observations'/(label+'.json.gz'));fresh=proof.load(report);assert fresh['cases']==saved['cases'],'Fresh results differ from saved results'
  runs.append({k:v for k,v in run.items()if k not in ['originals','wire']})
 result={'manifest_sha256':proof.sha(HERE/'manifest.json'),'fresh_runs':runs,'fresh_results_equal_saved':True,'uses_only_packet_harness_fixtures_and_elfs':True,'executes_sbf':True};(out/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':main()
