#!/usr/bin/env python3
"""Authenticate canonical inputs, recount full memberships and replay static maps."""
from pathlib import Path
import collections,contextlib,gzip,hashlib,importlib.util,io,json,sys,tempfile
R=Path(__file__).resolve().parent;REPO=R.parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def load_module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def inventory(p):return {str(f.relative_to(p)):sha(f)for f in sorted(p.rglob('*'))if f.is_file()}
def run():
 inputs=json.loads((R/'INPUTS.json').read_text());assert inputs['canonical_source']=='git e38a8b97a:programs/pump'
 for name,digest in inputs['harness_hashes'].items():assert sha(H/name)==digest,name
 for name,digest in inputs['graph_tool_hashes'].items():assert sha(REPO/name)==digest,name
 assert sha(R/'canonical-e38.tar')==inputs['canonical_archive_sha256']
 pins=json.loads((R/'source-inputs.json').read_text());assert len(pins)==67 and inventory(R/'src')==inventory(R/'canonical-e38/programs/pump')==pins
 # Replay the existing workspace recipe's manifest/lock split without mutation.
 src=R/'src';ws=R/'build/ws';crate=ws/'programs/pump';text=(src/'Cargo.toml').read_text();ps=text.index('[profile.release]');wsi=text.index('[workspace]');expected_crate=text[:ps].rstrip()+'\n';expected_ws='[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n'+text[ps:wsi].strip()+'\n'
 assert(crate/'Cargo.toml').read_text()==expected_crate and(ws/'Cargo.toml').read_text()==expected_ws and(ws/'Cargo.lock').read_bytes()==(src/'Cargo.lock').read_bytes()
 expected=set(pins)-{'Cargo.lock'};assert set(inventory(crate))==expected
 for name in expected-{'Cargo.toml'}:assert sha(crate/name)==pins[name],name
 sys.path.insert(0,str(H));import score
 assert sha(score.BASE/'original.so')==inputs['original_sha256']=='7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
 assert sha(R/'native-baseline/unstripped.so')==sha(R/'passive-baseline/unstripped.so')==inputs['unstripped_sha256']=='0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6'
 assert sha(R/'native-baseline/candidate.so')==inputs['candidate_sha256']=='d0377d7cef5b7378063f8bfabac5dc9c08d29eeaaaaa14022d36909688ff5e1b'
 base=score.score(R/'native-baseline/unstripped.so');assert len(base)==1035 and sum(x['normalized']for x in base.values())==1019 and sum(x['raw']for x in base.values())==188
 assert json.loads((R/'baseline/score.json').read_text())==json.loads(json.dumps({'windows':base}))
 bg=json.loads((R/'baseline/graph.json').read_text());assert bg['callee_calls']==[10,10]and bg['physical_order_callees_depth2_equal']and bg['reduced_blocks']==[112,113]
 deltas=json.loads((R/'CALLEE-ROLE-DELTA.json').read_text());assert len(deltas)==4
 for delta in deltas:
  if delta['name']=='branch-tail-result':
   assert len(delta['changes'])==1 and'drop_in_place'in delta['changes'][0]['baseline_candidate_symbol'] and '$u20$6$'in delta['changes'][0]['baseline_candidate_symbol']and(delta['changes'][0]['original_count'],delta['changes'][0]['candidate_count'])==(2,1)
  else:assert not delta['changes']
 baseline_full=json.loads(gzip.decompress((R/'baseline/graph.json.gz').read_bytes()));callee_labels={c['identity_sha256']:c['symbol']for c in baseline_full['physical_order_callees']['candidate']};delta_by_name={x['name']:x for x in deltas}
 m=load_module('pump_structure',REPO/'research/goal-pump-swap-final-20261028/structure.py')
 cases={'explicit-token-program-clone':(8424,113,10,[416]),'branch-tail-result':(8280,111,9,[418,420,422]),'non-native-cpi-locals':(8424,113,10,[420]),'native-early-result':(8360,112,10,[418])}
 results=[];source=(src/'src/migrate_v2.rs').read_text().splitlines()
 for name,(size,nodes,calls,changed)in cases.items():
  d=R/'probes'/name;v=json.loads((d/'RESULT.json').read_text());assert v['ok']and not v['stack_warnings']and not v['target_matched']and not v['new_runtime_executions']
  assert sha(d/'unstripped.so')==v['unstripped_sha256']and sha(d/'candidate.so')==v['candidate_sha256']
  s=score.score(d/'unstripped.so');assert json.loads((d/'score.json').read_text())==json.loads(json.dumps({'windows':s}))
  assert len(s)==1035 and {k for k,x in s.items()if x['normalized']}=={k for k,x in base.items()if x['normalized']}
  raw_gains=[hex(k)for k,x in s.items()if x['raw']and not base[k]['raw']];raw_losses=[hex(k)for k,x in s.items()if base[k]['raw']and not x['raw']]
  assert not raw_gains and not raw_losses
  b=(d/'migrate_v2.rs').read_text().splitlines();assert len(b)==len(source)and[i+1 for i,(x,y)in enumerate(zip(source,b))if x!=y]==changed
  g=json.loads((d/'graph.json').read_text());assert g['candidate_bytes']==size and g['reduced_blocks']==[112,nodes]and g['callee_calls']==[10,calls]and not g['topology']['verified']
  full=json.loads(gzip.decompress((d/'graph.json.gz').read_bytes()));oc=collections.Counter(c['identity_sha256']for c in full['physical_order_callees']['original']);cc=collections.Counter(c['identity_sha256']for c in full['physical_order_callees']['candidate']);actual_delta=[{'callee_identity_sha256':k,'baseline_candidate_symbol':callee_labels.get(k),'original_count':oc[k],'candidate_count':cc[k]}for k in sorted(oc.keys()|cc.keys())if oc[k]!=cc[k]];assert actual_delta==delta_by_name[name]['changes']
  with tempfile.TemporaryDirectory(prefix='pump-migrate-token-graph-')as tmp:
   output=Path(tmp)/'graph'
   with contextlib.redirect_stdout(io.StringIO()):m.analyze(d/'unstripped.so',0x4c158,'migrate_v2::create_token_account_v2',output)
   assert output.with_suffix('.json').read_bytes()==(d/'graph.json').read_bytes()and output.with_suffix('.json.gz').read_bytes()==(d/'graph.json.gz').read_bytes()
  results.append({'name':name,'normalized':1019,'raw':188,'normalized_gains':[],'normalized_losses':[],'raw_gains':raw_gains,'raw_losses':raw_losses,'bytes':size,'canonical_nodes':nodes,'actual_calls':calls})
 assert sha(R/'probes/explicit-token-program-clone/unstripped.so')==inputs['unstripped_sha256']
 o=m.Inventory(score.BASE/'original.so',True);c=m.Inventory(R/'native-baseline/unstripped.so');helper=next(f for f in c.functions.values()if'create_token_account_v2'in f['name']);args=json.loads((R/'baseline/arguments.json').read_text());assert len(args['rooted_calls'])==4
 for record in args['rooted_calls']:
  oa=int(record['original_caller'],16);ca=int(record['candidate_caller'],16);offset=int(record['actual_call_offset'],16);assert oa==0x49888 and c.tag(ca,0)==o.tag(oa,0)
  assert any(x['offset']==offset and x['target']==0x4c158 for x in o.function(oa)['calls'])and any(x['offset']==offset and x['target']==helper['start']for x in c.function(ca)['calls'])
  old=o.elf.normalized[oa+offset-160:oa+offset];new=c.elf.normalized[ca+offset-160:ca+offset];assert old==new and[old[i:i+8].hex()for i in range(0,len(old),8)]==record['setup_official_normalized_slots']
 log=(R/'passive-baseline/compiler.log').read_text();assert args['observed_pre_CodeGenPrepare_signature']in log and len(args['logical_formals_correspond_to_source'])==7
 frozen=REPO/'research/goal-swap-recovery-20261028/phase6/manifest.json';assert sha(frozen)=='025f454b8a4e697e1e898d85bb5f02af462b4e1e24c41ad1c4c7e01297f02f14'
 for name,digest in json.loads(frozen.read_text()).items():assert sha(frozen.parent/name)==digest,name
 machine=load_module('register_aware',frozen.parent/'register_aware_reload.py');stages=machine.derive(R/'passive-baseline/compiler.log');assert stages==json.loads((R/'passive-baseline/placement.json').read_text())
 assert[len(s['exit_nodes'])for s in stages]==[1,1]and[s['machine_blocks']for s in stages]==[137,137]
 before,after=stages;stub=before['pure_output_pointer_reload_stubs'];assert len(stub)==1 and(stub[0]['machine_id'],stub[0]['ir_id'],stub[0]['output_register'],stub[0]['stack_offset'])==(133,587,'$r8',-744)
 assert before['exit_nodes'][0]['machine_id']==134 and after['exit_nodes'][0]['machine_id']==136
 correction=json.loads((R/'CANONICALIZATION.json').read_text());assert correction['changed_from_noncanonical_copy']==['src/buy.rs','src/creator/admin_cto.rs','src/multi_hop_curve_swap.rs','src/sweep_fees.rs']
 result={'status':'incomplete_no_new_window','canonical_source_inputs':67,'canonical_source_and_stage_restored':True,'exact_reference_and_passive_reproduction':True,'baseline_normalized':1019,'baseline_raw':188,'original_windows':1035,'four_rooted_argument_setups_replayed':True,'ten_baseline_ordered_depth2_callees_equal':True,'pre_placement_nonnative_shared_reload_verified':True,'failed_preflight_distinguished':True,'probes':results,'new_matched_windows':0,'new_runtime_executions':0,'new_maintained_source_changes':0,'swap_phase6_frozen_files_verified':40}
 (R/'VERIFICATION.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
if __name__=='__main__':run()
