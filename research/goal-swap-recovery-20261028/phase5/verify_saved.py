#!/usr/bin/env python3
from pathlib import Path
import hashlib,importlib.util,json
R=Path(__file__).resolve().parent;P=R.parent;REPO=P.parents[1]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def frozen(p,digest):
 assert sha(p)==digest
 pins=json.loads(p.read_text())
 for n,d in pins.items():assert sha(p.parent/n)==d,n
 return len(pins)
def run():
 counts=[frozen(P/'retained-inputs.sha256.json','1e82847f38237e865712df6413feee3da070d2e484da48c153286f825d61cb78'),frozen(P/'phase3/manifest.json','52d17ab870becb72cd7c2387534b523a61bf33f6d28b7585d3ae123a0ecbfc3e'),frozen(P/'phase4/manifest.json','b6c1934db19c0af3638951987091bc3b9ca3698746a196a32f7f53d70b7b3495')]
 s=json.loads((R/'summary.json').read_text());assert s['attempts']==s['successful_builds']==1 and s['new_windows']==0
 c=s['results'][0];assert c['normalized']==778 and c['raw']==226 and c['losses']==['0x49b50'] and not c['gains']
 assert c['sell_bytes']==8960 and c['canonical_nodes']==76 and not c['graph_verified'] and not c['caller_bound']
 assert c['actual_calls']==80 and c['actual_callee_multiset_equal_through_depth2']
 d=R/'whole-tail-closure';assert len(json.loads((d/'rows.json').read_text()))==785
 assert sha(d/'symbols.so')=='9b96797104f8c47816744f89fde1e465b7e8101f4ebe0cf37f3e16406de404da'
 a=(P/'graph-partial-sell.rs').read_text().splitlines();b=(d/'sell.rs').read_text().splitlines();assert len(a)==len(b)==567
 assert [i+1 for i,(x,y)in enumerate(zip(a,b))if x!=y]==[375,506]
 assert (d/'lib.rs').read_bytes()==(P/'src/programs/pump-amm/src/lib.rs').read_bytes()
 snaps=json.loads((d/'placement-analysis.json').read_text());assert [x['stage']for x in snaps]==['Before','After']
 for x in snaps:
  assert len(x['blocks_data'])==82 and not x['pure_reload_stubs_any_offset']
  exits=[n for n in x['blocks_data']if 'EXIT'in n['instructions']];assert len(exits)==1 and exits[0]['machine_id']==80 and exits[0]['ir_id']==556
 spec=importlib.util.spec_from_file_location('recipe',REPO/'work/latest-main/research/amm-layout-closure-20261028/workspace_recipe.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 restored=[m.verify_workspace(P/'canonical',w)['verified']for w in[P/'src',P/'trylane/src']];assert all(restored)
 v={'frozen_file_counts':counts,'all785_original_windows_checked':True,'prior_window_losses':['0x49b50'],'graph_and_caller_failure_retained':True,'optional_move_probe_skipped':True,'both_workspaces_restored':all(restored),'new_matched_windows':0,'new_linux_builds':0,'new_runtime_executions':0}
 (R/'verification.json').write_text(json.dumps(v,indent=2)+'\n');print(json.dumps(v,indent=2))
if __name__=='__main__':run()
