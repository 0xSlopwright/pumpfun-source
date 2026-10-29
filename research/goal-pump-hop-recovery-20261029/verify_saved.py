#!/usr/bin/env python3
"""Recount all1035 windows, replay static maps and authenticate restored sources."""
from pathlib import Path
import collections,contextlib,gzip,hashlib,importlib.util,io,json,sys,tempfile
R=Path(__file__).resolve().parent;REPO=R.parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inventory(p):return {str(f.relative_to(p)):sha(f)for f in sorted(p.rglob('*'))if f.is_file()}
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def dom(g):
 ns={n['offset']:n for n in g['nodes']};pred={k:set()for k in ns}
 for n in ns.values():
  for _,to in n['edges']:pred[to].add(n['offset'])
 ds={k:({'0x0'}if k=='0x0'else set(ns))for k in ns};changed=True
 while changed:
  changed=False
  for k in ns:
   if k=='0x0':continue
   new={k}|set.intersection(*(ds[p]for p in pred[k]))
   if new!=ds[k]:ds[k]=new;changed=True
 return ds
def run():
 inputs=json.loads((R/'INPUTS.json').read_text());pins=json.loads((R/'source-inputs.json').read_text())
 assert len(pins)==67 and inventory(R/'src')==pins
 assert pins==json.loads((REPO/'research/goal-pump-migrate-token-recovery-20261029/source-inputs.json').read_text())
 assert inventory(REPO/'work/goal-final-windows-current/programs/pump')==pins
 for n,h in inputs['harness_hashes'].items():assert sha(H/n)==h,n
 for n,h in inputs['graph_tool_hashes'].items():assert sha(REPO/n)==h,n
 text=(R/'src/Cargo.toml').read_text();ps=text.index('[profile.release]');wi=text.index('[workspace]');ws=R/'build/ws';crate=ws/'programs/pump'
 assert(crate/'Cargo.toml').read_text()==text[:ps].rstrip()+'\n'
 assert(ws/'Cargo.toml').read_text()=='[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n'+text[ps:wi].strip()+'\n'
 assert(ws/'Cargo.lock').read_bytes()==(R/'src/Cargo.lock').read_bytes()
 assert set(inventory(crate))==set(pins)-{'Cargo.lock'}
 for n in set(pins)-{'Cargo.lock','Cargo.toml'}:assert sha(crate/n)==pins[n],n
 sys.path.insert(0,str(H));import score
 assert sha(score.BASE/'original.so')==inputs['original_sha256']=='7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
 assert sha(R/'native-baseline/unstripped.so')==sha(REPO/inputs['canonical_unstripped'])==inputs['canonical_sha256']=='0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6'
 assert sha(R/'native-baseline/candidate.so')=='d0377d7cef5b7378063f8bfabac5dc9c08d29eeaaaaa14022d36909688ff5e1b'
 assert sha(REPO/inputs['best_unstripped'])==inputs['best_sha256']
 base=score.score(R/'native-baseline/unstripped.so');norm={k for k,x in base.items()if x['normalized']};raw={k for k,x in base.items()if x['raw']}
 assert len(base)==1035 and len(norm)==1019 and len(raw)==188 and not base[0x5b3b0]['normalized']
 m=module('structure',REPO/'research/goal-pump-swap-final-20261028/structure.py');p=module('projection',R/'project_call_gates.py')
 original=m.Inventory(score.BASE/'original.so',True);canonical=m.Inventory(R/'native-baseline/unstripped.so')
 args=json.loads((R/'canonical/incoming-arguments.json').read_text());assert len(args['rows'])==1;setup=args['rows'][0];assert setup['original_caller']=='0x567d8'and setup['call_offset']=='0xc60'
 catalog=json.loads((R/'canonical/all-callee-bindings.json').read_text());actual=collections.Counter(q['target']for q in original.function(0x5b3b0)['calls']if q['target']in original.functions)
 assert sum(actual.values())==107 and sum(x['actual_calls']for x in catalog)==107
 for row in catalog:
  at=int(row['original_target'],16);assert actual[at]==row['actual_calls']and row['exact_depth2_bindings']
  for binding in row['exact_depth2_bindings']:assert original.describe_callee(at,2)['identity_sha256']==canonical.describe_callee(int(binding['candidate_start'],16),2)['identity_sha256']
 cases=[('canonical',R/'native-baseline/unstripped.so'),('best',REPO/inputs['best_unstripped'])];cases.extend((str(d.relative_to(R)),d/'unstripped.so')for d in sorted((R/'probes').iterdir())if(d/'RESULT.json').exists()and json.loads((d/'RESULT.json').read_text())['ok'])
 projections={x['name']:x for x in json.loads((R/'CALL-GATE-SUMMARY.json').read_text())};results=[];census=[]
 for name,image in cases:
  d=R/name;s=score.score(image);assert len(s)==1035 and {k for k,x in s.items()if x['normalized']}==norm and not s[0x5b3b0]['normalized']
  assert json.loads((d/'score.json').read_text())==json.loads(json.dumps({'windows':s}))
  rg=[hex(k)for k,x in s.items()if x['raw']and k not in raw];rl=[hex(k)for k in raw if not s[k]['raw']];assert not rg and set(rl)==({'0xd240'}if name.endswith('matched-business-inline-events')else set())
  summary=json.loads((d/'graph.json').read_text());full=json.loads(gzip.decompress((d/'graph.json.gz').read_bytes()));assert summary['original_bytes']==18584 and summary['machine_blocks'][0]==263 and not summary['topology']['verified']
  with tempfile.TemporaryDirectory(prefix='pump-hop-replay-')as tmp:
   q=Path(tmp)/'graph'
   with contextlib.redirect_stdout(io.StringIO()):m.analyze(image,0x5b3b0,'pump_recovered::multi_hop_curve::swap_hop',q)
   assert q.with_suffix('.json').read_bytes()==(d/'graph.json').read_bytes()and q.with_suffix('.json.gz').read_bytes()==(d/'graph.json.gz').read_bytes(),name
  inv=m.Inventory(image);caller=next(f for f in inv.functions.values()if m.win.demangle(f['name'])=='pump_recovered::multi_hop_curve::execute');root=next(f for f in inv.functions.values()if m.win.demangle(f['name'])=='pump_recovered::multi_hop_curve::swap_hop')
  assert original.tag(0x567d8,0)==inv.tag(caller['start'],0)
  assert any(q['offset']==0xc60 and q['target']==root['start']for q in inv.function(caller['start'])['calls'])
  prior=inv.elf.normalized[caller['start']+0xc60-256:caller['start']+0xc60];assert[prior[i:i+8].hex()for i in range(0,256,8)]==setup['precall_slots']
  v={'name':name,'normalized':1019,'raw':sum(x['raw']for x in s.values()),'normalized_gains':[],'normalized_losses':[],'raw_gains':rg,'raw_losses':rl,'bytes':root['size'],'machine_blocks':summary['machine_blocks'][1],'canonical_blocks':summary['reduced_blocks'][1],'direct_calls':summary['callee_calls'][1]}
  if name.startswith('probes/'):
   record=json.loads((d/'RESULT.json').read_text());assert sha(image)==record['unstripped_sha256']and sha(d/'candidate.so')==record['candidate_sha256']and not record['stack_warnings']and not record['target_matched']and record['new_runtime_executions']==0
   assert record['target_bytes']==root['size']and record['machine_blocks']==summary['machine_blocks']and record['canonical_blocks']==summary['reduced_blocks']and record['callee_calls']==summary['callee_calls']
   oc=collections.Counter(x['identity_sha256']for x in full['physical_order_callees']['original']);cc=collections.Counter(x['identity_sha256']for x in full['physical_order_callees']['candidate']);v['exact_depth2_callee_multiset_equal']=oc==cc;census.append({'name':d.name,'original_calls':sum(oc.values()),'candidate_calls':sum(cc.values()),'exact_depth2_callee_multiset_equal':oc==cc})
   if d.name in projections:
    saved=json.loads(gzip.decompress((d/'call-gate-projection.json.gz').read_bytes()));a=p.project(full['original']);b=p.project(full['candidate']);cmp=m.cfg.bijection(a,b,True);assert saved['original']==a and saved['candidate']==b and saved['comparison']==projections[d.name]and saved['comparison']['comparison']==cmp
    v['diagnostic_projection_nodes']=len(b['nodes']);v['diagnostic_projection_mapped']=cmp.get('mapped_blocks_before_failure');assert not cmp['verified']
  results.append(v);print(json.dumps(v),flush=True)
 for d in sorted((R/'probes').iterdir()):
  if not(d/'SOURCE-MANIFEST.json').exists():continue
  manifest=json.loads((d/'SOURCE-MANIFEST.json').read_text());assert set(manifest['files'])=={'src/multi_hop_curve_swap.rs','src/trade_v3.rs'}
  for n,h in manifest['files'].items():
   assert sha(d/n)==h;before=(R/'src'/n).read_text().splitlines();after=(d/n).read_text().splitlines();assert len(before)==len(after)and[i+1 for i,(a,b)in enumerate(zip(before,after))if a!=b]==manifest['changed_rows'][n]
 failed=R/'probes/matched-business-late-completion';assert not json.loads((failed/'RESULT.json').read_text())['ok']and'E0502'in(failed/'build.log').read_text()
 n=R/'probes/matched-business-branch-capped-output';o=R/'probes/matched-business-native-payout-guard';assert sha(n/'unstripped.so')==sha(o/'unstripped.so')=='36027e2167dabbbd66364a407d99a8185243640bd9978d6a92524aafd08b2245'
 passive=json.loads((n/'passive/RESULT.json').read_text());assert passive['identical_probe_image']and sha(n/'passive/unstripped.so')==sha(n/'unstripped.so')and passive['new_runtime_executions']==0
 log=(n/'passive/compiler.log').read_text();assert '%1036 = and i1 %160, %8'in log and'%1038 = or i1 %453, %1037'in log
 for token in ['IR Dump Before CodeGen Prepare','IR Dump Before Branch Probability Basic Block Placement','IR Dump After Branch Probability Basic Block Placement']:assert token in log
 full=json.loads(gzip.decompress((R/'canonical/graph.json.gz').read_bytes()));ds=dom(full['original']);assert '0x38b8'in ds['0x3df8']and'0x38b8'in ds['0x3e08']
 basis=json.loads((R/'probes/matched-business-snapshots/EMITTER-BASIS.json').read_text());assert sha(Path(basis['path']))==basis['sha256']==sha(Path(basis['resolved_event_attribute_path']))and basis['fragment157_194_equal']
 frozen={'research/goal-swap-recovery-20261028/phase6/manifest.json':'025f454b8a4e697e1e898d85bb5f02af462b4e1e24c41ad1c4c7e01297f02f14','research/goal-pump-migrate-token-recovery-20261029/manifest.json':'72b7320e9c0840c4cb68df9c7f88841a63ec151842a705028b1b42e1c8f639f4'}
 for n,h in frozen.items():assert sha(REPO/n)==h
 saved_census=json.loads((R/'CALLEE-CENSUS.json').read_text());assert[{k:v for k,v in x.items()if k!='differences'}for x in saved_census]==census
 result={'status':'incomplete_no_new_window','original_windows':1035,'canonical_source_files':67,'canonical_source_and_stage_restored':True,'canonical_native_normalized':1019,'canonical_native_raw':188,'original_target':'0x5b3b0','new_windows':0,'successful_source_probes':len(census),'failed_source_probes':1,'new_runtime_executions':0,'new_maintained_source_changes':0,'actual_107_callees_all_bound_in_canonical':True,'caller_32_argument_slots_replayed_for_all_images':True,'full_graphs_replayed':len(cases),'results':results}
 (R/'VERIFICATION.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items()if k!='results'},indent=2))
if __name__=='__main__':run()
