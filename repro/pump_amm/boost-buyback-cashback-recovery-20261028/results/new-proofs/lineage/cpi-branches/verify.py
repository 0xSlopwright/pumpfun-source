#!/usr/bin/env python3
from pathlib import Path
import argparse, collections, hashlib, json, sys
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def module(name):
 p=W/name;ns={'__name__':'sealed_'+p.stem,'__file__':str(p)};exec(compile(p.read_bytes(),str(p),'exec'),ns);return ns

def verify(root):
 root=Path(root).resolve();manifest=json.loads((W/'manifest.json').read_bytes());paths={str(p.relative_to(W))for p in W.rglob('*')if p.is_file()and p.name!='manifest.json'};assert paths==set(manifest['files'])
 for name,digest in manifest['files'].items():assert sha(W/name)==digest,name
 assert sha(W/'build/artifacts/pump_amm_recovered.so')=='6975715089a6dee2125e3157a4c579176aa893a386ffa748ed478f886d59f53b'
 original=module('verify_original.py')['verify'](root);getter=module('verify_getter.py')['verify'](root);runtime=module('verify_runtime.py')['verify'](root)
 sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(W/'build/artifacts/pump_amm_recovered.so');s=Elf(W/'build/artifacts/unstripped.so');parent=json.loads((W/'parent-measurement.json').read_bytes());idx=collections.defaultdict(list)
 for f in s.funcs:idx[(f['size'],c.normalized[f['start']:f['start']+f['size']],json.dumps(c.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 matched=set();raw=0
 for row in parent['rows']:
  a,b=row['start'],row['end'];fs=idx[(b-a,o.normalized[a:b],json.dumps(o.pattern(a,b-a),sort_keys=True))]
  if fs:matched.add(a)
  raw+=any(o.b[a:b]==c.b[f['start']:f['start']+b-a]for f in fs)
 prior={r['start']for r in parent['rows']if r['matches']};assert len(parent['rows'])==785 and len(matched)==638 and raw==128 and matched==prior
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':getter['candidate_sha256'],'normalized_windows':638,'raw_windows':128,'gains':0,'losses':0,'original_branch_verification':original['passed'],'generated_getter_verification':getter['passed'],'runtime':runtime}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
