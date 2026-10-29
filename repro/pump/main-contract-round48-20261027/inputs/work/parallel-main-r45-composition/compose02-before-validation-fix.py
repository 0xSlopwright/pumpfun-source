"""Compose corrected conditional reload, pool balances, and quote-control inlining."""
from pathlib import Path
import difflib,hashlib,json,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;S=W/'source02'
BASE=R/'work/parallel-main-integration/round44-source-retry/programs/pump';POOL=R/'work/parallel-main-route-pool-balances/source01';RELOAD=R/'work/parallel-main-v3-reload-sync/source02';QUOTE=R/'work/parallel-main-quote-mint-inlining/source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
inv=lambda p:{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
proof_paths=['work/parallel-main-route-pool-balances/STAGED01.json','work/parallel-main-verification-resume/POOL-BALANCE-REVIEW01.json','work/parallel-main-v3-reload-sync/STAGED02.json','work/parallel-main-v3-reload-sync/EVIDENCE02.json','work/parallel-main-verification-resume/V3-RELOAD-SYNC-REVIEW02.json','work/parallel-main-quote-mint-inlining/STAGED01.json','work/parallel-main-quote-mint-inlining/MANIFEST01.json']
proofs={n:sha(R/n)for n in proof_paths};assert proofs['work/parallel-main-verification-resume/V3-RELOAD-SYNC-REVIEW02.json']=='c34cd7e517ce8a03f83918d00ddb02186281c5f61f06605511d1f0a984f68a0d'
old_source=inv(W/'source01');old_stage=sha(W/'STAGED01.json')
pool=read(R/proof_paths[0]);reload=read(R/proof_paths[2]);quote=read(R/proof_paths[5]);before=inv(BASE)
assert len(before)==65 and before==pool['source_before']==reload['source_before']==quote['source_before']
assert inv(POOL)==pool['source_after']and inv(RELOAD)==reload['source_after']and inv(QUOTE)==quote['source_after']and not S.exists()
shutil.copytree(POOL,S)
reload_trade=(RELOAD/'src/trade_v3.rs').read_text();pool_trade=(POOL/'src/trade_v3.rs').read_text()
marker='// Reconstruct the shared completed-curve pool-balance boundary; the original name is unknown.\n'
start=pool_trade.index(marker);assert pool_trade.endswith('}\n');helper=pool_trade[start:-2]
assert 'completion_pool_balances' in helper and 'completion_pool_balances' not in reload_trade
old_import='use crate::multi_hop_curve::{n,sub};';new_import='use crate::multi_hop_curve::{add,n,sub};';assert reload_trade.count(old_import)==1
trade=reload_trade.replace(old_import,new_import,1);assert trade.endswith('}\n');trade=trade[:-2]+helper+'}\n'
(S/'src/trade_v3.rs').write_text(trade)
(S/'src/mayhem_virtual_params.rs').write_bytes((RELOAD/'src/mayhem_virtual_params.rs').read_bytes())
(S/'src/quote_control/state.rs').write_bytes((QUOTE/'src/quote_control/state.rs').read_bytes())
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert len(after)==65 and set(changed)=={'src/trade_v3.rs','src/multi_hop_curve_swap.rs','src/mayhem_virtual_params.rs','src/quote_control/state.rs'}
assert trade.replace(helper,'',1).replace(new_import,old_import,1)==reload_trade
assert inv(BASE)==before and inv(W/'source01')==old_source and sha(W/'STAGED01.json')==old_stage
sell=trade[trade.index('pub fn sell('):trade.index('\nfn read_config(')]
assert sell.count('apply_sell(amount,quote)?')==1 and sell.count('.reload()?')==2
assert sell.index('apply_sell(amount,quote)?')<sell.index('transfer_user_tokens(')<sell.index('if a.user.key()==a.global.whitelist_pda {')<sell.index('quote_payments::transfer_to_user(')
assert sell.index('sync_virtual_quote_reserves(')<sell.index('curve.accrue_fees(')
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'r45-combined02.patch').write_text(patch)
r={'status':'composed_source_only_pending_root_and_quote_inline_review','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'primary_input_count':65,'new_cases':0,'expected_pool_origin_fixes':30,'preserved_mixed_sub_origins':13,'proof_sha256':proofs,'patch_sha256':sha(W/'r45-combined02.patch'),'supersedes_unselected_stage_sha256':old_stage,'old_source_preserved':True,'merge_checks':['Pool and corrected reload share only trade_v3; reversing pool helper/import yields exact corrected reload file.','Exactly one apply_sell precedes user-token transfer.','Reload and sync are conditional on actual user key equality with whitelist PDA.','Conditional reload/sync precedes quote transfer and fee accrual.','Only four declared files differ, including single quote-control inlining file.'],'limits':['No R45 build, runtime, or freeze executed.','Quote-control one-file inlining still awaits separate review before build approval.','Full retained corpus must validate source behavior and all prior matched bodies.']}
(W/'STAGED02.json').write_text(json.dumps(r,indent=2)+'\n');(W/'MANIFEST02.json').write_text(json.dumps({n:sha(W/n)for n in ['compose02.py','r45-combined02.patch','STAGED02.json']},indent=2)+'\n');print({'staged_sha256':sha(W/'STAGED02.json'),'manifest_sha256':sha(W/'MANIFEST02.json'),'patch_sha256':sha(W/'r45-combined02.patch'),'changed':changed})
