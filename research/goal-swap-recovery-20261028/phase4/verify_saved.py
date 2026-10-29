#!/usr/bin/env python3
"""Verify the narrow whole-function tail-try controls without recompiling."""
from pathlib import Path
import hashlib,importlib.util,json
R=Path(__file__).resolve().parent;P=R.parent;REPO=P.parents[1]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def frozen(manifest,expected):
 assert sha(manifest)==expected
 pins=json.loads(manifest.read_text())
 for name,digest in pins.items():assert sha(manifest.parent/name)==digest,name
 return len(pins)
def run():
 old=frozen(P/'retained-inputs.sha256.json','1e82847f38237e865712df6413feee3da070d2e484da48c153286f825d61cb78')
 phase3=frozen(P/'phase3/manifest.json','52d17ab870becb72cd7c2387534b523a61bf33f6d28b7585d3ae123a0ecbfc3e')
 rows=json.loads((R/'summary.json').read_text());assert rows['attempts']==rows['successful_builds']==2 and rows['new_windows']==0
 a,b=rows['results'];assert a['name']=='whole-tail-try' and b['name']=='whole-tail-try-local-guards'
 assert a['normalized']==b['normalized']==779 and a['raw']==b['raw']==225
 assert a['canonical_nodes']==76 and not a['graph_verified']
 assert a['topology_failure']['at_original']=='0x960' and a['topology_failure']['at_candidate']=='0x8e8'
 assert a['actual_calls']==80 and a['actual_callee_multiset_equal_through_depth2']
 assert b['canonical_nodes']==77 and b['graph_verified'] and b['paired_nonbranch_slots']==1049
 assert b['paired_calls']==b['paired_calls_equal_through_depth2']==80 and b['register_differences']==b['branch_polarity_differences']==0
 assert b['nonbranch_values_equal']
 image=R/'whole-tail-try-local-guards/symbols.so';assert sha(image)==sha(P/'phase2/ownerwrite-trace/symbols.so')=='16d67698a423e6e5cfeb5d9c2906a708b9ee983b997b0395b14ad84f7db77163'
 source=(P/'graph-partial-sell.rs').read_text().splitlines()
 source_checks=[]
 for name in ['whole-tail-try','whole-tail-try-local-guards']:
  d=R/name;s=(d/'sell.rs').read_text().splitlines();assert len(s)==len(source)==567
  changed=[i+1 for i,(x,y)in enumerate(zip(source,s))if x!=y]
  assert changed==([375,505]if name=='whole-tail-try'else[375,392,395,444,448,464,467,505]),changed
  lib=(d/'lib.rs').read_text().splitlines();baseline=(P/'src/programs/pump-amm/src/lib.rs').read_text().splitlines();assert lib[1:]==baseline[1:] and lib[0].startswith('#![feature(try_blocks)] //')
  census=json.loads((d/'rows.json').read_text());assert len(census)==785
  assert not next(r for r in census if r['original']=='0x4c750')['match']
  snap=json.loads((d/'placement-analysis.json').read_text());assert [x['stage']for x in snap]==['Before','After']
  before,after=snap
  if name=='whole-tail-try':
   assert len(before['blocks_data'])==84 and len(after['blocks_data'])==82
   assert [n['machine_id']for n in before['pure_reload_stubs_any_offset']]==[62,71,82]
   reload=next(n for n in after['blocks_data']if n['machine_id']==16);assert reload['ir_id']==104 and reload['instructions']==['$r6 = LDD_V1 $r10, -1304']
   ex=next(n for n in after['blocks_data']if n['machine_id']==17);assert ex['ir_id']==104 and ex['instructions'][-1]=='EXIT'
   graph=json.loads((d/'graph-analysis.json').read_text())['candidate'];gn={n['offset']:n for n in graph['nodes']}
   assert gn['0x8e8']['edges']==[['next','0x8f0']] and gn['0x8f0']['term']['kind']=='exit'
  source_checks.append({'name':name,'source_lines':len(s),'changed_lines':changed,'rows':len(census)})
 recipe=REPO/'work/latest-main/research/amm-layout-closure-20261028/workspace_recipe.py'
 spec=importlib.util.spec_from_file_location('recipe',recipe);module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
 workspaces=[]
 for w in [P/'src',P/'trylane/src']:
  v=module.verify_workspace(P/'canonical',w);assert v['verified'];workspaces.append({'path':str(w.relative_to(REPO)),'verified':True,'workspace_inputs':v['workspace_inputs']})
 result={'frozen_inputs_verified':old,'phase3_inputs_verified':phase3,'source_checks':source_checks,'workspaces':workspaces,'whole_tail_try_changes_exit_topology':True,'all_local_guards_restore_complete_prior_elf':True,'original_windows_checked_per_image':785,'new_matched_windows':0,'new_linux_builds':0,'new_runtime_executions':0}
 (R/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':run()
