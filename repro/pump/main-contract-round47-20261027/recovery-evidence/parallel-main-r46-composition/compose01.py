"""Compose reviewed buy reload/sync and migration pool helpers onto frozen R45."""
from pathlib import Path
import difflib,hashlib,json,shutil,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;S=W/'source01'
BASE=R/'work/parallel-main-integration/round45-source/programs/pump';BUY=R/'work/parallel-main-v3-buy-reload-sync/source01';MIG=R/'work/parallel-main-migration-pool-helpers/source01';OLD=R/'work/parallel-main-integration/round44-source-retry/programs/pump'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
inv=lambda p:{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
proofs={'work/parallel-main-verification-resume/V3-BUY-RELOAD-SYNC-REVIEW01.json':'cd5b2ea123f80b89d20122893b5ac9223373052aae0da57c55243c4a00ff9920','work/parallel-main-migration-pool-helpers/INDEPENDENT-REVIEW01.json':'c29805ed548caa90eec32d550cacc5f5441eae08cda2160bd5b7fcbb9359f9f2'}
for n,h in proofs.items():assert sha(R/n)==h
bs=read(R/'work/parallel-main-v3-buy-reload-sync/STAGED01.json');ms=read(R/'work/parallel-main-migration-pool-helpers/STAGED01.json');before=inv(BASE)
assert len(before)==65 and inv(BUY)==bs['source_after']and inv(MIG)==ms['source_after']and not S.exists()
assert inv(OLD)==bs['source_before']==ms['source_before']
for n in ['src/migrate.rs','src/migrate_v2.rs']:assert before[n]==ms['source_before'][n]
assert (BASE/'src/mayhem_virtual_params.rs').read_bytes()==(BUY/'src/mayhem_virtual_params.rs').read_bytes(),'ExistingR45 helper visibility/body must remain'
shutil.copytree(BASE,S)
t=(BASE/'src/trade_v3.rs').read_text();incoming=(BUY/'src/trade_v3.rs').read_text()
def boundaries(text):return(text.index('pub fn buy('),text.index('pub fn buy_exact_quote('),text.index('pub fn sell('))
a,b,c=boundaries(t);x,y,z=boundaries(incoming);combined=t[:a]+incoming[x:y]+incoming[y:z]+t[c:]
(S/'src/trade_v3.rs').write_text(combined)
for n in ['src/migrate.rs','src/migrate_v2.rs']:(S/n).write_bytes((MIG/n).read_bytes())
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)=={'src/trade_v3.rs','src/migrate.rs','src/migrate_v2.rs'}and len(after)==65
na,nb,nc=boundaries(combined);assert combined[:na]==t[:a]and combined[nc:]==t[c:],'All source outside two buy functions must remain R45'
for n in ['src/mayhem_virtual_params.rs','src/multi_hop_curve_swap.rs','src/quote_control/state.rs']:assert before[n]==after[n]
for block in [combined[na:nb],combined[nb:nc]]:
 assert block.count('apply_buy(amount,quote)?')==1 and block.count('.reload()?')==2
 assert block.index('apply_buy(amount,quote)?')<block.index('token_interface::transfer_checked(')<block.index('\n    if a.user.key()==a.global.whitelist_pda {')<block.index('user_quote_payments::transfer_from_user(')
assert inv(BASE)==before and inv(BUY)==bs['source_after']and inv(MIG)==ms['source_after']
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'r46-combined01.patch').write_text(patch)
for n in ['work/parallel-main-v3-buy-reload-sync/STAGED01.json','work/parallel-main-v3-buy-reload-sync/EVIDENCE01.json','work/parallel-main-migration-pool-helpers/STAGED01.json','work/parallel-main-migration-pool-helpers/MANIFEST01.json']:proofs[n]=sha(R/n)
r={'status':'composed_source_only_waiting_independent_review','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'primary_input_count':65,'new_cases':0,'proof_sha256':proofs,'patch_sha256':sha(W/'r46-combined01.patch'),'merge_checks':['Only buy and buy_exact_quote function bodies selected from the old-base trade patch.','Entire R45 sell function and later source, including pool helper, retained byte-for-byte.','R45 quote-control inlining and sync visibility/body retained byte-for-byte.','Migration source selected only after exact old-base files equal R45 files.','Both buy paths apply before base CPI, condition reload on whitelist, and sync before quote payments.'],'limits':['No compiler, runtime, freeze or publication performed.','Historical migrate_v2 stack-warning gate and full frozen corpus remain mandatory.','All prior body and origin repairs must be reverified on the composed build.']}
(W/'STAGED01.json').write_text(json.dumps(r,indent=2)+'\n');(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['compose01.py','r46-combined01.patch','STAGED01.json']},indent=2)+'\n');print({'stage_sha256':sha(W/'STAGED01.json'),'manifest_sha256':sha(W/'MANIFEST01.json'),'patch_sha256':sha(W/'r46-combined01.patch'),'changed':changed})
