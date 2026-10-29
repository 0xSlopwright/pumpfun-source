#!/usr/bin/env python3
"""Locate the retained backend diagnostic in matched original instruction structure."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json

def verify(root):
 root=Path(root).resolve();reader=root/'repro/pump_amm/canonical-frontier-20261028/tools/elf_reader.py';status=json.loads((root/'repro/status.json').read_text())['pump_amm'];base=(root/status['candidate_artifact']).parents[2]
 spec=importlib.util.spec_from_file_location('backend_elf_reader',reader);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
 original=module.Elf(root/'evidence/original/pump_amm/deployed.so');candidate=module.Elf(base/'results/build-a/symbols.so')
 def require(value,message):
  if not value:raise ValueError(message)
 start,size=0xe5ce8,1488;norm=original.normalized[start:start+size];pattern=original.pattern(start,size)
 hits=[f for f in candidate.funcs if f['size']==size and candidate.normalized[f['start']:f['start']+size]==norm and candidate.pattern(f['start'],size)==pattern];require(len(hits)==1,'unique original diagnostic wrapper');hit=hits[0]
 old=original.callsites(start,size);new=candidate.callsites(hit['start'],size);require(len(old)==len(new)==6,'actual outgoing call count');ends=dict(zip(original.entries,original.entries[1:]+[original.hi]));functions={f['start']:f for f in candidate.funcs};callees=[]
 for a,b in zip(old,new):
  require(a['offset']==b['offset'],'direct call offset');n=ends[a['target']]-a['target'];f=functions[b['target']];require(f['size']==n,'callee extent');left=original.normalized[a['target']:a['target']+n];right=candidate.normalized[b['target']:b['target']+n];require(left==right and original.pattern(a['target'],n)==candidate.pattern(b['target'],n),'callee normalized body and relocation pattern');callees.append({'offset':a['offset'],'original_target':hex(a['target']),'candidate_target':hex(b['target']),'bytes':n,'normalized_sha256':hashlib.sha256(left).hexdigest()})
 runtime=base/'results/runtime/incentives_admin.json.gz'
 if not runtime.exists():runtime=base/'results/runtime/corpus/incentives_admin.json.gz'
 suite=json.loads(gzip.decompress(runtime.read_bytes()));success=sum(row['original']['error']is None for row in suite['cases']);require(len(suite['cases'])==668 and success==296,'fresh original success coverage')
 return {'scope':'Retained backend call/frame diagnostics; complete matched instruction bodies under the unchanged official normalizer','candidate_sha256':hashlib.sha256((base/'results/build-a/candidate.so').read_bytes()).hexdigest(),'wrapper_original':'0xe5ce8','wrapper_bytes':size,'candidate_symbol':hit['name'],'wrapper_normalized_sha256':hashlib.sha256(norm).hexdigest(),'actual_outgoing_callees':callees,'fresh_incentives_admin_cases':668,'fresh_successful_pairs':296,'broad_frame_safety_claimed':False}
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repo',type=Path,default=Path(__file__).resolve().parents[2]);a=p.parse_args();print(json.dumps(verify(a.repo),indent=2))
