"""Compose the independently reviewed pool-balance and V3 reload changes."""
from pathlib import Path
import difflib,hashlib,json,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;S=W/'source01'
BASE=R/'work/parallel-main-integration/round44-source-retry/programs/pump';POOL=R/'work/parallel-main-route-pool-balances/source01';RELOAD=R/'work/parallel-main-v3-reload-sync/source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
inv=lambda p:{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
proofs={'work/parallel-main-route-pool-balances/STAGED01.json':'22813ed0eddfa4135f09cf72eded695a7d7542d0646b59cd83715dc1a568cd2d','work/parallel-main-verification-resume/POOL-BALANCE-REVIEW01.json':'535add6367f2888ec75482ffa4daf647b62421249041d4e9bb32b7cdcaa7c586','work/parallel-main-verification-resume/V3-RELOAD-SYNC-REVIEW01.json':'022f7f3b3767784999eb9b100fa53a8e2c217a96d4658ad73bdc7f09508a0424'}
# The exact independently reviewed reload digest is checked below and retained.
reload_review=R/'work/parallel-main-verification-resume/V3-RELOAD-SYNC-REVIEW01.json'
assert sha(reload_review)=='022f7f3b3767784999eb9b100fa53a8e2c217a96d4658ad73bdc7f09508a0424'
proofs[str(reload_review.relative_to(R))]=sha(reload_review)
for n,h in proofs.items():assert sha(R/n)==h,(n,sha(R/n),h)
pool=read(R/'work/parallel-main-route-pool-balances/STAGED01.json');reload=read(R/'work/parallel-main-v3-reload-sync/STAGED01.json');before=inv(BASE)
assert len(before)==65 and before==pool['source_before']==reload['source_before']
assert inv(POOL)==pool['source_after'] and inv(RELOAD)==reload['source_after'];assert not S.exists()
shutil.copytree(POOL,S)
p=S/'src/trade_v3.rs';combined=p.read_text();old=BASE/'src/trade_v3.rs';new=RELOAD/'src/trade_v3.rs'
start='    let _=curve.accrue_fees(&a.global,protocol_fee,creator_fee)?;\n';end='    let event_mint=a.base_mint.key();'
assert old.read_text().count(start+end)==1
nt=new.read_text();at=nt.index(start+ '    a.associated_base_bonding_curve.reload()?;');stop=nt.index(end,at);insertion=nt[at:stop]
assert combined.count(start+end)==1;p.write_text(combined.replace(start+end,insertion+end,1))
q=S/'src/mayhem_virtual_params.rs';q.write_bytes((RELOAD/'src/mayhem_virtual_params.rs').read_bytes())
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)=={'src/trade_v3.rs','src/multi_hop_curve_swap.rs','src/mayhem_virtual_params.rs'}
assert len(after)==65 and inv(BASE)==before and inv(POOL)==pool['source_after'] and inv(RELOAD)==reload['source_after']
# Reversing either nonoverlapping transform recovers the other exact trade file.
assert p.read_text().replace(insertion+end,start+end,1)==(POOL/'src/trade_v3.rs').read_text()
pool_original=old.read_text();pool_updated=(POOL/'src/trade_v3.rs').read_text()
assert p.read_text()==pool_updated.replace(start+end,insertion+end,1)
assert (S/'src/multi_hop_curve_swap.rs').read_bytes()==(POOL/'src/multi_hop_curve_swap.rs').read_bytes()
assert q.read_bytes()==(RELOAD/'src/mayhem_virtual_params.rs').read_bytes()
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'r45-combined01.patch').write_text(patch)
for n in ['work/parallel-main-route-pool-balances/ORIGINAL01.json','work/parallel-main-v3-reload-sync/STAGED01.json','work/parallel-main-v3-reload-sync/ROLE-ADDENDUM02.json','work/parallel-main-v3-reload-sync/EVIDENCE01.json']:proofs[n]=sha(R/n)
r={'status':'composed_source_only_pending_root_build_approval','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'primary_input_count':65,'new_cases':0,'expected_pool_origin_fixes':30,'preserved_mixed_sub_origins':13,'patch_sha256':sha(W/'r45-combined01.patch'),'proof_sha256':proofs,'merge_checks':['Same corrected R44 base for both independent lanes.','Only overlap is trade_v3.rs; pool helper/import and sell reload insertion are disjoint.','Reversing reload insertion recovers exact pool lane trade file.','Reload amount arguments retain independently proven vault/user pointer roles.','No input definition, constant, dependency or other program changed.'],'limits':['No R45 compiler or runtime run.','Current sync parameter names originate in its other caller; argument identity rests on typed original transfer caller evidence.','All prior matched bodies and full retained state/log corpus still require qualification.']}
(W/'STAGED01.json').write_text(json.dumps(r,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['compose01.py','r45-combined01.patch','STAGED01.json']},indent=2)+'\n');print({'staged_sha256':sha(W/'STAGED01.json'),'manifest_sha256':sha(W/'MANIFEST01.json'),'patch_sha256':sha(W/'r45-combined01.patch'),'changed':changed})
