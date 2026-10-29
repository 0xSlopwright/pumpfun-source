from pathlib import Path
import ast,hashlib,json,re
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
tree=ast.parse((R/'work/parallel-main-r41-installed-preflight/review_r42.py').read_text());ns={'re':re};exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef)and n.name=='body'],type_ignores=[]),'body parser','exec'),ns);body=ns['body']
results={}
for label,folder in [('legacy','parallel-main-legacy-collection-origin'),('budget','parallel-main-route-budget-placement')]:
 P=R/'work'/folder;q=json.load(open(P/'STAGED01.json'));S=R/q['source'];assert len(q['source_before'])==len(q['source_after'])==65;assert all(h(S/f)==v for f,v in q['source_after'].items());assert all(q['source_before'][f]==q['source_after'][f]for f in q['source_before']if f not in q['changed'])
 if label=='legacy':
  B=R/q['base_source'];old=(B/'src/lib.rs').read_text();new=(S/'src/lib.rs').read_text();module=(S/'src/creator/collect_creator_fee.rs').read_text();prefix=(B/'src/creator/collect_creator_fee.rs').read_text();assert module.startswith(prefix+'\n')
  assert body(old,'collect_creator_fee')==body(module,'execute_legacy');assert body(new,'collect_creator_fee')=='collect_v2::execute_legacy(ctx)'
  # Replace only the one instruction body; all other public handlers remain exact.
  before=body(old,'collect_creator_fee');assert old.replace(before,'collect_v2::execute_legacy(ctx)',1)==new
  assert 'use crate::PumpError;'in module
  results[label]={'status':'passed_source_only','staged_sha256':h(P/'STAGED01.json'),'patch_sha256':q['patch_sha256'],'files':list(q['changed']),'checks':['Legacy instruction body verbatim; signature/account context and error/CPI/event order unchanged.','Only root instruction body replaced by thin wrapper. Existing V2 module prefix and every other65-input file retained.','Only needed PumpError import appended. No new data ownership/borrows or tests.'],'target_origin_cases':8}
 else:
  # The stage is based on the frozen R43 source map, not the old pre-util-fee snapshot.
  B=R/'work/parallel-main-integration/round43-source/programs/pump';assert all(h(B/f)==v for f,v in q['source_before'].items())
  om=(B/'src/multi_hop_curve_swap.rs').read_text();nm=(S/'src/multi_hop_curve_swap.rs').read_text();ot=(B/'src/trade_v3.rs').read_text();nt=(S/'src/trade_v3.rs').read_text();assert nt.startswith(ot+'\n')
  assert body(om,'buy_budget')==body(nt,'buy_budget')
  assert body(om,'n')==body(nm,'n')and body(om,'sub')==body(nm,'sub')
  assert 'use crate::legacy_sell::fee_math::fee;'in nt and 'use crate::multi_hop_curve_swap::{n,sub};'in nt
  assert 'use crate::trade::route_buy_budget::buy_budget;'in nm
  for name in re.findall(r'\bfn\s+(\w+)\s*(?:\(|<)',om):
   if name!='buy_budget':assert body(om,name)==body(nm,name),name
  assert re.search(r'#\[path\s*=\s*"trade_v3.rs"\]\s*pub mod trade;', (B/'src/lib.rs').read_text())
  assert '#[inline'not in nt[len(ot):]
  results[label]={'status':'passed_source_only','staged_sha256':h(P/'STAGED01.json'),'patch_sha256':q['patch_sha256'],'files':list(q['changed']),'checks':['Budget helper body exact in inline module physically trade_v3; caller uses import alias, not an added wrapper.','Same fee function and same physical n/sub functions; only n/sub visibility widened.','Every other multi-hop function body and entire existing trade_v3 prefix unchanged.','Corrected estimate remains checked but unused in returned fee pair, as before.','No retention attributes, extra account reads, arithmetic reorder or data mutation introduced.'],'target_origin_cases':96,'other_origin_cases_unselected':43}
assert not(set(results['legacy']['files'])&set(results['budget']['files']))
C=R/'work/parallel-main-r44-composition';q=json.load(open(C/'STAGED01.json'));CS=R/q['source'];assert len(q['source_after'])==65 and len(q['changed'])==4 and q['new_cases']==0
assert all(h(CS/f)==v for f,v in q['source_after'].items())
for f in q['source_after']:
 if f not in q['changed']:assert q['source_after'][f]==q['source_before'][f]
for label,folder in [('legacy','parallel-main-legacy-collection-origin'),('budget','parallel-main-route-budget-placement')]:
 lane=json.load(open(R/'work'/folder/'STAGED01.json'))
 for f in results[label]['files']:assert h(CS/f)==h(R/lane['source']/f)
results['composition']={'status':'passed_source_only','staged_sha256':h(C/'STAGED01.json'),'source':q['source'],'primary_inputs':65,'changed_files':4,'new_cases':0}
result={'status':'approved_source_lanes_for_one_mapped_identity_build','lanes':results,'authorization':'One mapped identity build only, with identity-order.ld, after exact disjoint4-file composition. No final build/runtime/publication authorized by this review.','limitations':['Source-only review does not establish new normalized matches or runtime equivalence.','Fresh combined full regression must retain all previously qualified results and source-file exceptions remain counted.']};(W/'REVIEW01.json').write_text(json.dumps(result,indent=2)+'\n');print(h(W/'REVIEW01.json'))
