#!/usr/bin/env python3
"""Offline source and direct-object verification; no compile or target execution."""
from pathlib import Path
import argparse,difflib,hashlib,json,sys
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent
sys.path.insert(0,str(W));from elf_reader import Elf
from object_reader import sections
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def verify(root=None):
 root=Path(root) if root else W.parents[1]
 for name,h in json.loads((W/'manifest.json').read_text())['files'].items():assert sha(W/name)==h,name
 o=Elf(root/'evidence/original/pump_amm/deployed.so');assert sha(o.path)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 helper=next(f for f in sections(W/'final-helper.o') if 'harvest_withheld_tokens_to_mint' in f['name']);assert helper['size']==1480 and helper['code']==o.normalized[0x74e30:0x753f8]
 library=json.loads((W/'provider-comparison.json').read_text());p=library['matches'][0];provider=next(f for f in sections(W/p['member']) if f['name']==p['name']);assert provider['size']==2664 and provider['code']==o.normalized[0xf6eb0:0xf6eb0+2664]
 assert [r['offset'] for r in helper['relocations'] if r['type']==10 and r['symbol']!='abort']==[r['offset'] for r in o.callsites(0x74e30,1480)]
 original_offsets=sorted([r['offset'] for r in o.callsites(0xf6eb0,2664)]+[r['offset'] for r in o.pattern(0xf6eb0,2664) if r['type']==10]);assert sorted(r['offset'] for r in provider['relocations'] if r['type']==10)==original_offsets
 before={str(p.relative_to(W/'base-source')):p for p in (W/'base-source').rglob('*') if p.is_file()};after={str(p.relative_to(W/'source')):p for p in (W/'source').rglob('*') if p.is_file()};assert before.keys()==after.keys();changed=sorted(k for k in before if before[k].read_bytes()!=after[k].read_bytes());assert changed==['programs/pump-amm/src/boost_burn.rs','programs/pump-amm/src/utils/token.rs']
 patch=''.join(''.join(difflib.unified_diff(before[k].read_text().splitlines(True),after[k].read_text().splitlines(True),fromfile='a/'+k,tofile='b/'+k)) for k in changed);assert patch==(W/'recovery.patch').read_text()
 source=after['programs/pump-amm/src/utils/token.rs'].read_text();actual=source[source.index("pub fn harvest_withheld_tokens_to_mint<'info>"):];diagnostic=(W/'final-helper.rs').read_text();assert diagnostic.endswith(actual)
 return {'passed':True,'patch_sha256':sha(W/'recovery.patch'),'source_files':len(before),'changed_files':changed,'original_helper_bytes':1480,'helper_direct_object_exact':True,'original_provider_bytes':2664,'provider_direct_object_exact':True,'provider_call_count':len(original_offsets),'candidate_full_build':False,'runtime_cases':0,'scope':'Source/extracted-object qualification only; full-candidate census and runtime await combined build.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
