#!/usr/bin/env python3
from pathlib import Path
import argparse,collections,hashlib,json,sys
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def module(name):
 p=W/name;ns={'__name__':'sealed_'+p.stem,'__file__':str(p)};exec(compile(p.read_bytes(),str(p),'exec'),ns);return ns

def verify(root):
 root=Path(root).resolve();m=json.loads((W/'manifest.json').read_bytes());assert set(m['files'])=={str(p.relative_to(W))for p in W.rglob('*')if p.is_file()and p.name!='manifest.json'}
 for n,d in m['files'].items():assert sha(W/n)==d,n
 assert sha(W/'build/artifacts/pump_amm_recovered.so')=='30d7e1fb2a21f5ca84c0e0545925a440913379f6307c984b9a3f3693d4e831ea'
 before=(W/'before/trade.rs').read_text();a=before.index('#[event]\n#[derive(Clone)]\npub struct BuyEvent');b=before.index('\n\n#[event]',a);block=before[a:b];after=W/'source/programs/pump-amm/src';assert (after/'instructions/swap/buy.rs').read_text()=='use anchor_lang::prelude::*;\n\n'+block+'\n';assert (after/'trade.rs').read_text()==before[:a]+'pub use crate::instructions::swap::buy::BuyEvent;'+before[b:]
 ev=module('verify_event.py')['verify'](root);runtime=module('verify_runtime.py')['verify'](root)
 sys.path.insert(0,str(root/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
 o=Elf(root/'evidence/original/pump_amm/deployed.so');c=Elf(W/'build/artifacts/pump_amm_recovered.so');s=Elf(W/'build/artifacts/unstripped.so');parent=json.loads((W/'parent-measurement.json').read_bytes());idx=collections.defaultdict(list)
 for f in s.funcs:idx[(f['size'],c.normalized[f['start']:f['start']+f['size']],json.dumps(c.pattern(f['start'],f['size']),sort_keys=True))].append(f)
 matched=set();raw=0
 for row in parent['rows']:
  a,b=row['start'],row['end'];fs=idx[(b-a,o.normalized[a:b],json.dumps(o.pattern(a,b-a),sort_keys=True))]
  if fs:matched.add(a)
  raw+=any(o.b[a:b]==c.b[f['start']:f['start']+b-a]for f in fs)
 assert len(parent['rows'])==785 and len(matched)==638 and raw==128 and matched=={r['start']for r in parent['rows']if r['matches']}
 d=json.loads((W/'descriptor-closure.json').read_bytes());assert d['counts']['unequal_text_without_equal_alternative']==0 and d['counts']['bounded_static_closed_windows']==583
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':ev['candidate_sha256'],'normalized_windows':638,'raw_windows':128,'source_declaration_identical':True,'event_origin':ev,'runtime':runtime}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
