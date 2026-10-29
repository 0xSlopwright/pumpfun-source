"""Stage the original-backed V3 sell reload/sync call sequence, without compiling."""
from pathlib import Path
import difflib,hashlib,json,shutil,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round44-source-retry/programs/pump';S=W/'source01'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sys.path.insert(0,str(R/'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body
def inv(p):return{str((R/n).relative_to(p)):v for n,v in source_manifest(p,p,R).items()}
before=inv(BASE);assert len(before)==65 and not S.exists()
shutil.copytree(BASE,S)
p=S/'src/trade_v3.rs';t=p.read_text();start=t.index('pub fn sell(');prefix=t[:start];sell=t[start:]
needle='''    let curve=&mut a.bonding_curve;
    curve.apply_sell(amount,quote)?;
    let _=curve.accrue_fees(&a.global,protocol_fee,creator_fee)?;
    let event_mint=a.base_mint.key();'''
replacement='''    let curve=&mut a.bonding_curve;
    curve.apply_sell(amount,quote)?;
    let _=curve.accrue_fees(&a.global,protocol_fee,creator_fee)?;
    a.associated_base_bonding_curve.reload()?;
    a.associated_base_user.reload()?;
    let quote_mint=curve.quote_mint;
    curve.sync_virtual_quote_reserves(
        a.associated_base_bonding_curve.amount,
        a.associated_base_user.amount,
        &quote_mint,
    )?;
    let event_mint=a.base_mint.key();'''
assert sell.count(needle)==1
sell=sell.replace(needle,replacement,1);p.write_text(prefix+sell)
q=S/'src/mayhem_virtual_params.rs';u=q.read_text();assert u.count('    fn sync_virtual_quote_reserves(')==1
q.write_text(u.replace('    fn sync_virtual_quote_reserves(','    pub(crate) fn sync_virtual_quote_reserves(',1))
after=inv(S);changed={k:v for k,v in after.items()if before.get(k)!=v};assert set(changed)=={'src/trade_v3.rs','src/mayhem_virtual_params.rs'}
assert inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'v3-sell-reload-sync01.patch').write_text(patch)
original=R/'evidence/original/pump/deployed.so';raw=original.read_bytes();ss=sections(raw)
iv=json.loads((R/'work/parallel-main-integration/build-round43/normalized-inventory.json').read_text());windows={r['start']:r for r in iv['windows']}
reload=windows[0x7890];sync=windows[0xa23f0];caller=windows[0x14a8a8]
assert reload['bytes']==688 and sync['bytes']==1168 and caller['bytes']==6032
reload_callees=[(hex(reload['start']+v['offset']),hex(v['target']))for v in reload['original_operands']if v['kind']=='direct-call']
assert reload_callees==[('0x78b8','0x1a2ca8'),('0x7930','0x185ed0'),('0x79b8','0x19bbb8'),('0x7a10','0x1b3610'),('0x7a98','0x1b3610')]
calls=[(caller['start']+v['offset'],v['target'])for v in caller['original_operands']if v['kind']=='direct-call']
sequence=[(0x14b8d8,0x7890),(0x14b918,0x7890),(0x14b9c8,0xa23f0),(0x14bb78,0x8bbd0)]
for x in sequence:assert x in calls
anchor=R/'work/parallel-main-r40-sbpf/cold-producer01/cargo-home/registry/src/index.crates.io-1949cf8c6b5b557f/anchor-lang-0.31.1/src/accounts/account.rs'
interface=anchor.with_name('interface_account.rs')
anchor_text=anchor.read_text();interface_text=interface.read_text()
assert 'let mut data: &[u8] = &self.info.try_borrow_data()?;\n        self.account = T::try_deserialize(&mut data)?;' in anchor_text
assert 'pub fn reload(&mut self) -> Result<()> {\n        self.account.reload()\n    }' in interface_text
evidence={'scope':'Original main-Pump V3 sell caller reload/sync sequence; not a new transaction or separate program change.',
 'original_sha256':sha(original),'original_reload':{'start':'0x7890','bytes':688,'sha256':hashlib.sha256(body(raw,ss,0x7890,688)).hexdigest(),'callees':reload_callees,'identity_inference':'Account<TokenAccount>::reload: mutates account payload after borrow, token decode and borrow release. InterfaceAccount::reload delegates to its inner Account.'},
 'original_sync':{'start':'0xa23f0','bytes':1168,'sha256':hashlib.sha256(body(raw,ss,0xa23f0,1168)).hexdigest(),'normalized_candidates':[m['symbol']for m in sync['normalized_matches']]},
 'original_sell':{'start':'0x14a8a8','bytes':6032,'sha256':hashlib.sha256(body(raw,ss,0x14a8a8,6032)).hexdigest(),'callee_sequence':[{'call':hex(pc),'target':hex(target)}for pc,target in sequence],
 'first_reload_argument':['0x14b8b8 load context+0x30','0x14b8c0 add0x20 to access inner Account'],
 'second_reload_argument':['0x14b8f8 load context+0x48','0x14b900 add0x20 to access inner Account'],
 'sync_arguments':['0x14b938 load curve Account pointer from context+0x28','0x14b940..0x14b978 copy four key words from Account+0x28..0x40','0x14b980..0x14b988 r3 loads first reloaded token amount from pointer+0x68','0x14b990..0x14b998 r4 loads second reloaded token amount from pointer+0x68','0x14b9a0 r2 points to curve payload at Account+8','0x14b9b8..0x14b9c0 r5 points to copied quote key']},
 'pinned_anchor':{'account_source':str(anchor.relative_to(R)),'account_sha256':sha(anchor),'interface_source':str(interface.relative_to(R)),'interface_sha256':sha(interface)},
 'source_changes':{'trade_v3':'Existing V3 sell validation, transfer, apply_sell, accrual and event order remain. Insert original-backed two reloads and sync immediately before event construction.','mayhem_virtual_params':'Only widen visibility of the existing main-Pump BondingCurve helper; body and admin caller unchanged.'},
 'limits':['Token-account role mapping is based on the two typed TokenAccount context fields, their declaration order, and original context offsets. Independently review before compilation.','No new witness or runtime claim. Existing retained V3 trade cases must pass before acceptance.','The method is housed in a main-Pump file named mayhem_virtual_params; no separate Mayhem program source is changed.','Current sync helper is normalized-exact but complete callee/data identity remains separately bounded.']}
(W/'EVIDENCE01.json').write_text(json.dumps(evidence,indent=2)+'\n')
s={'status':'staged_unbuilt_for_independent_review','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'primary_input_count':65,'new_cases':0,'patch_sha256':sha(W/'v3-sell-reload-sync01.patch'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'limits':['No compiler, runtime, live-chain or publication work performed.','Original reload identity and pointer-role inference require independent review.']};(W/'STAGED01.json').write_text(json.dumps(s,indent=2)+'\n')
(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['stage01.py','v3-sell-reload-sync01.patch','EVIDENCE01.json','STAGED01.json']},indent=2)+'\n')
print({'staged':sha(W/'STAGED01.json'),'patch':sha(W/'v3-sell-reload-sync01.patch'),'changed':changed})
