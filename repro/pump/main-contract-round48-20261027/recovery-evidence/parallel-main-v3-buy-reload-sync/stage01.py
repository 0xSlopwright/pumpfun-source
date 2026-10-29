"""Stage the shared original V3 buy reload/sync sequence at its guarded call site."""
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
before=inv(BASE);assert len(before)==65 and not S.exists();shutil.copytree(BASE,S)
p=S/'src/trade_v3.rs';text=p.read_text();begin=text.index('pub fn buy(');end=text.index('pub fn sell(',begin);head=text[:begin];buy=text[begin:end];tail=text[end:]
transfer='''    token_interface::transfer_checked(CpiContext::new_with_signer(a.base_token_program.to_account_info(),TransferChecked{
        from:a.associated_base_bonding_curve.to_account_info(),mint:a.base_mint.to_account_info(),to:a.associated_base_user.to_account_info(),authority:a.bonding_curve.to_account_info()
    },&[seeds]),transfer_base,a.base_mint.decimals)?;'''
assert buy.count(transfer)==2
replacement='''    a.bonding_curve.apply_buy(amount,quote)?;
'''+transfer+'''
    if a.user.key()==a.global.whitelist_pda {
        a.associated_base_bonding_curve.reload()?;
        a.associated_base_user.reload()?;
        let quote_mint=a.bonding_curve.quote_mint;
        a.bonding_curve.sync_virtual_quote_reserves(
            a.associated_base_bonding_curve.amount,
            a.associated_base_user.amount,
            &quote_mint,
        )?;
    }'''
buy=buy.replace(transfer,replacement)
assert buy.count('    curve.apply_buy(amount,quote)?;\n')==2
buy=buy.replace('    curve.apply_buy(amount,quote)?;\n','')
# The original shared helper synchronizes the curve before either parent builds
# its event. Read the resulting curve value rather than the earlier estimate.
assert buy.count('virtual_sol_reserves:if is_sol{next_quote}else{0}')==2
assert buy.count('virtual_quote_reserves:next_quote')==2
buy=buy.replace('virtual_sol_reserves:if is_sol{next_quote}else{0}','virtual_sol_reserves:if is_sol{curve.virtual_quote_reserves}else{0}')
buy=buy.replace('virtual_quote_reserves:next_quote','virtual_quote_reserves:curve.virtual_quote_reserves')
p.write_text(head+buy+tail)
q=S/'src/mayhem_virtual_params.rs';t=q.read_text();assert t.count('    fn sync_virtual_quote_reserves(')==1
q.write_text(t.replace('    fn sync_virtual_quote_reserves(','    pub(crate) fn sync_virtual_quote_reserves(',1))
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)=={'src/trade_v3.rs','src/mayhem_virtual_params.rs'}and inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'v3-buy-reload-sync01.patch').write_text(patch)
original=R/'evidence/original/pump/deployed.so';raw=original.read_bytes();ss=sections(raw)
iv=json.loads((R/'work/parallel-main-integration/build-round43/normalized-inventory.json').read_text());by={r['start']:r for r in iv['windows']}
helper=by[0x83c00];assert helper['bytes']==3440
calls={0x83c00+v['offset']:v['target']for v in helper['original_operands']if v['kind']=='direct-call'}
assert calls[0x83c70]==0xa0bf0 and calls[0x83ed8]==0x8f5c8
assert calls[0x84490]==calls[0x844d0]==0x7890 and calls[0x84578]==0xa23f0
def ins(pc):return struct.unpack('<BBhi',body(raw,ss,pc,8))
assert ins(0x83fa0)==(0x15,0,0x98,0);assert 0x83fa0+8+ins(0x83fa0)[2]*8==0x84468
assert ins(0x83f78)==(0x07,2,0,0x288)
assert ins(0x83d60)==(0x79,0x68,0x30,0) and ins(0x83d68)==(0x79,0x67,0x48,0)
assert ins(0x83ec0)==(0xbf,0x83,0,0) and ins(0x83ed0)==(0xbf,0x74,0,0)
incoming=[]
code=body(raw,ss,0x83c00,3440)
for off in range(0,len(code),8):
 op,regs,delta,imm=struct.unpack('<BBhi',code[off:off+8]);pc=0x83c00+off
 if op&7==5 and op not in [0x85,0x95] and pc+8+delta*8==0x84468:incoming.append(hex(pc))
assert incoming==['0x83fa0']
callers=[]
for start in [0x147ba0,0x1489f8]:
 r=by[start];sites=[hex(start+x['offset'])for x in r['original_operands']if x['kind']=='direct-call'and x['target']==0x83c00];assert len(sites)==1;callers.append({'body':hex(start),'call':sites[0]})
transfer_source=BASE/'src/v2_token_transfers.rs';transfer=by[0x8f5c8];assert any('transfer_curve_tokens17h' in m['symbol']for m in transfer['normalized_matches'])
e={'scope':'V3 buy and exact-quote buy only; source hypothesis with original guarded shared-call evidence','original_sha256':sha(original),'shared_helper':{'start':'0x83c00','bytes':3440,'sha256':hashlib.sha256(code).hexdigest(),'parent_callers':callers},
 'typed_base_transfer':{'call':'0x83ed8','original_target':'0x8f5c8','normalized_matches':transfer['normalized_matches'],'current_typed_source':str(transfer_source.relative_to(R)),'source_sha256':sha(transfer_source),'role_mapping':'context+0x30 is loaded into r8 then passed as r3 source; context+0x48 is loaded into r7 then passed as r4 destination. Typed transfer_curve_tokens establishes base vault then base user.'},
 'guard':{'memcmp':'0x83f88','global_account_key_offset':'0x288','predicate':'user key equals global whitelist key','branch':'0x83fa0 result==0 goes to0x84468','only_direct_predecessor':incoming},
 'sequence':[{'call':hex(pc),'target':hex(calls[pc])}for pc in [0x83c70,0x83ed8,0x84490,0x844d0,0x84578]],
 'event_reason':'The original shared helper returns after synchronization before either parent emits its event. The two reconstructed events must use the resulting virtual quote reserve instead of the pre-sync estimate.',
 'preserved':['All existing validation and payment calls retain their relative order.','No changes to V3 sell or its pending recovery; the later merge must retain its accepted changes.','No separate external program is changed. Existing main helper visibility is widened only for the new callers.'],
 'limits':['No compile or transaction execution. Full existing V3 corpus and whole-candidate matched-set validation remain required.','Original shared helper also has fee/accrual and completion structure not fully reconstructed by this patch.','Whitelist-gated synchronization may change state/events for previously uncovered states; this is intentional original-backed behavior, not proven by current fixture success.']}
(W/'EVIDENCE01.json').write_text(json.dumps(e,indent=2)+'\n')
staged={'status':'staged_unbuilt_for_independent_review','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'primary_input_count':65,'new_cases':0,'patch_sha256':sha(W/'v3-buy-reload-sync01.patch'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'expected_original_calls_restored':{'reload':4,'sync':2},'limits':['Must merge after pending V3sell recovery; sell region is untouched here.','No code-body equality gain is claimed.']};(W/'STAGED01.json').write_text(json.dumps(staged,indent=2)+'\n')
(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['stage01.py','v3-buy-reload-sync01.patch','EVIDENCE01.json','STAGED01.json']},indent=2)+'\n');print({'staged':sha(W/'STAGED01.json'),'patch':sha(W/'v3-buy-reload-sync01.patch')})
