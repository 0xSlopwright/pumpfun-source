#!/usr/bin/env python3
"""Run the unchanged fixed create cases with the genuine captured Pump loader installed."""
from pathlib import Path
import argparse,hashlib,json,subprocess,sys
P=Path(__file__).resolve().parent;R=P.parents[1]
def require(ok,message):
 if not ok:raise ValueError(message)
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();out=a.output.resolve();require(not out.exists(),'Output already exists');out.mkdir(parents=True)
inputs=json.loads((P/'inputs.json').read_text());producer=R/inputs['producer'];wrapper=R/inputs['wrapper'];receipt=R/inputs['actual_build_receipt'];require(sha(candidate)==inputs['candidate_sha256'],'Wrong selected image');require(sha(producer)==inputs['producer_sha256']and sha(wrapper)==inputs['wrapper_sha256']and sha(receipt)==inputs['actual_build_receipt_sha256'],'Executed input bytes differ')
command=[sys.executable,'-B',str(wrapper),'--receipt',str(out/'loader.json'),str(producer),'--candidate',str(candidate),'--output',str(out/'cases.json.gz')]
with(out/'console.log').open('w')as f:r=subprocess.run(command,cwd=R,stdout=f,stderr=subprocess.STDOUT)
require(sha(candidate)==inputs['candidate_sha256']and sha(producer)==inputs['producer_sha256']and sha(wrapper)==inputs['wrapper_sha256'],'Inputs changed during replay')
record={'scope':__doc__,'controller_sha256':sha(Path(__file__)),'candidate_sha256':sha(candidate),'producer_sha256':sha(producer),'wrapper_sha256':sha(wrapper),'actual_build_receipt_sha256':sha(receipt),'command':command,'returncode':r.returncode,'report_sha256':sha(out/'cases.json.gz')if(out/'cases.json.gz').exists()else None,'loader_sha256':sha(out/'loader.json')};(out/'execution.json').write_text(json.dumps(record,indent=2)+'\n');r.check_returncode();print(json.dumps(record,indent=2))
