#!/usr/bin/env python3
"""Replay exact origin paths, rejected-source memberships and register-aware loads."""
from pathlib import Path
import hashlib,importlib.util,json,re
R=Path(__file__).resolve().parent;P=R.parent;REPO=P.parents[1]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def frozen(p,digest):
 assert sha(p)==digest
 pins=json.loads(p.read_text())
 for n,d in pins.items():assert sha(p.parent/n)==d,n
 return len(pins)
def module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def run():
 pins=[('retained-inputs.sha256.json','1e82847f38237e865712df6413feee3da070d2e484da48c153286f825d61cb78'),('phase3/manifest.json','52d17ab870becb72cd7c2387534b523a61bf33f6d28b7585d3ae123a0ecbfc3e'),('phase4/manifest.json','b6c1934db19c0af3638951987091bc3b9ca3698746a196a32f7f53d70b7b3495'),('phase5/manifest.json','f492e1553e0b97e2350316190de610d0919e1cfbb7d03c511fdaa5882020dd56')]
 counts=[frozen(P/n,d)for n,d in pins]
 summary=json.loads((R/'summary.json').read_text());assert summary['attempts']==summary['successful_builds']==3 and summary['new_windows']==0
 expected={'constructor-tail-match':(285,9016,78,80,[451,506]),'constructor-unit-match':(225,9032,78,80,[451,505]),'interface-unit-match':(225,8888,75,79,[481,505])}
 source=(P/'graph-partial-sell.rs').read_text().splitlines();assert len(source)==567
 for c in summary['results']:
  name=c['name'];raw,size,nodes,calls,changed=expected[name];assert c['normalized']==779 and c['raw']==raw and c['sell_bytes']==size and c['canonical_nodes']==nodes
  assert not c['graph_verified'] and c['actual_calls']==calls and not c['gains'] and not c['losses']and not c['sell_matched']and c['caller_bound']
  assert c['actual_callee_multiset_equal_through_depth2']==(calls==80)
  d=R/name;b=(d/'sell.rs').read_text().splitlines();assert len(b)==567 and [i+1 for i,(x,y)in enumerate(zip(source,b))if x!=y]==changed
  assert(d/'lib.rs').read_bytes()==(P/'src/programs/pump-amm/src/lib.rs').read_bytes()
  assert len(json.loads((d/'rows.json').read_text()))==785
 a=module('phase6_analysis',R/'analyze_saved.py');before=a.machine(P/'phase2/ownerwrite-trace/compiler.log')[0];ns={n['machine_id']:n for n in before['blocks_data']}
 origins=json.loads((R/'reload-origins.json').read_text());assert origins['snapshot_sha256']==sha(P/'phase2/ownerwrite-trace/compiler.log')
 for n in origins['relevant_nodes']:assert n==ns[n['machine_id']]
 paths=[]
 for stub in origins['stubs']:
  assert ns[stub['machine_id']]['ir_id']==stub['ir_id']
  if'paths'in stub:paths.extend(stub['paths'])
  for p in stub.get('predecessor_origins',[]):paths.extend(p['paths'])
 for path in paths:
  for x,y in zip(path,path[1:]):assert y in [int(v)for v in re.findall(r'%bb\.(\d+)\(',ns[x]['successors']or'')],(x,y)
 calls=lambda n:'\n'.join(ns[n]['instructions'])
 for n,text in[(27,'Account$LT$T$GT$8try_from'),(68,'InterfaceAccount$LT$T$GT$18try_from_unchecked'),(37,'system_program8transfer'),(32,'instruction8allocate'),(42,'instruction6assign'),(79,'validate_pool_v2'),(77,'exit_with_expected_owner')]:assert text in calls(n),(n,text)
 assert'ProgramError'in calls(43)and'ProgramError'in calls(52)
 assert ns[63]['instructions']==ns[72]['instructions']==ns[83]['instructions']==['$r6 = LDD_V1 $r10, -1304','JMP %bb.5']
 reg=module('register_aware',R/'register_aware_reload.py');report=json.loads((R/'register-aware-reloads.json').read_text());bylog={x['compiler_log']:x for x in report['analyses']}
 for x in report['analyses']:
  log=P/x['compiler_log'];assert sha(log)==x['compiler_log_sha256']and reg.derive(log)==x['stages']
 closure=bylog['phase5/whole-tail-closure/compiler.log']['stages'];assert len(closure)==2
 for x in closure:
  r=x['pure_output_pointer_reload_stubs'];assert len(r)==1 and(r[0]['machine_id'],r[0]['ir_id'],r[0]['output_register'],r[0]['stack_offset'],r[0]['physical_next_machine_block'])==(79,552,'$r7',-1304,80)and not r[0]['unconditional_branch_present']
 expected_stubs={'constructor-tail-match':([(71,489),(83,543)],[(71,489)]),'constructor-unit-match':([(72,492),(83,543)],[(70,492)]),'interface-unit-match':([(63,431),(80,536)],[(62,431)])}
 for name,expected_stage in expected_stubs.items():
  stages=bylog['phase6/'+name+'/compiler.log']['stages']
  for x,e in zip(stages,expected_stage):assert[(n['machine_id'],n['ir_id'])for n in x['pure_output_pointer_reload_stubs']]==e
 changes=json.loads((R/'callee-multiset-changes.json').read_text());assert len(changes)==3
 for c in changes:
  if c['name']=='interface-unit-match':
   assert len(c['changes'])==1 and c['changes'][0]['baseline_symbols']==['memcpy'] and(c['changes'][0]['original_count'],c['changes'][0]['candidate_count'])==(6,5)
  else:assert not c['changes']and c['callee_multiset_equal']
 recipe=module('recipe',REPO/'work/latest-main/research/amm-layout-closure-20261028/workspace_recipe.py');restored=[recipe.verify_workspace(P/'canonical',w)['verified']for w in[P/'src',P/'trylane/src']];assert all(restored)
 result={'frozen_file_counts':counts,'exact_original_reload_origins_verified':True,'origin_path_count':len(paths),'register_aware_snapshots_replayed':len(report['analyses']),'earlier_r6_only_absence_wording_corrected':True,'all785_original_windows_checked_per_image':True,'new_matched_windows':0,'source_controls':3,'all_prior_native779_memberships_preserved':True,'all_three_failed_original_graph_bijection':True,'both_workspaces_restored':True,'new_linux_builds':0,'new_runtime_executions':0}
 (R/'verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':run()
