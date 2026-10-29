"""Correct the reload gate and placement from full V3 sell control flow."""
from pathlib import Path
import difflib,hashlib,json,shutil,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round44-source-retry/programs/pump';S=W/'source02'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sys.path.insert(0,str(R/'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body
def inv(p):return{str((R/n).relative_to(p)):v for n,v in source_manifest(p,p,R).items()}
before=inv(BASE);assert len(before)==65 and not S.exists();shutil.copytree(BASE,S)
p=S/'src/trade_v3.rs';text=p.read_text();begin=text.index('pub fn sell(');end=text.index('\nfn read_config(',begin);prefix=text[:begin];sell=text[begin:end];tail=text[end:]
transfer='    crate::sell_v2::user_token_transfers::transfer_user_tokens(&a.base_token_program,&a.associated_base_user,&a.associated_base_bonding_curve,a.user.as_ref(),a.base_mint.decimals,a.base_mint.as_ref().as_ref(),amount)?;'
assert sell.count(transfer)==1
replacement='''    a.bonding_curve.apply_sell(amount,quote)?;
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
sell=sell.replace(transfer,replacement)
assert sell.count('    curve.apply_sell(amount,quote)?;\n')==1
sell=sell.replace('    curve.apply_sell(amount,quote)?;\n','',1)
assert sell.count('let next_protocol=add(curve.protocol_fees,retained)?;')==1
sell=sell.replace('let next_protocol=add(curve.protocol_fees,retained)?;','let next_protocol=add(a.bonding_curve.protocol_fees,retained)?;',1)
p.write_text(prefix+sell+tail)
q=S/'src/mayhem_virtual_params.rs';u=q.read_text();assert u.count('    fn sync_virtual_quote_reserves(')==1
q.write_text(u.replace('    fn sync_virtual_quote_reserves(','    pub(crate) fn sync_virtual_quote_reserves(',1))
after=inv(S);changed={n:h for n,h in after.items()if before.get(n)!=h};assert set(changed)=={'src/trade_v3.rs','src/mayhem_virtual_params.rs'}and inv(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'v3-sell-reload-sync02.patch').write_text(patch)
raw=(R/'evidence/original/pump/deployed.so').read_bytes();ss=sections(raw);st,size=0x14a8a8,6032;code=body(raw,ss,st,size)
def ins(pc):return struct.unpack('<BBhi',body(raw,ss,pc,8))
assert ins(0x14b318)==(0x15,0,0xb3,0)
assert 0x14b318+8+ins(0x14b318)[2]*8==0x14b8b8
assert ins(0x14b2e0)==(0x07,2,0,0x288)
assert ins(0x14b9f8)==(0x05,0,-0xdc,0)
assert 0x14b9f8+8+ins(0x14b9f8)[2]*8==0x14b320
incoming=[]
for off in range(0,len(code),8):
 op,regs,delta,imm=struct.unpack('<BBhi',code[off:off+8]);pc=st+off
 if op&7==5 and op not in [0x85,0x95] and pc+8+delta*8==0x14b8b8:incoming.append(hex(pc))
assert incoming==['0x14b318']
iv=json.loads((R/'work/parallel-main-integration/build-round43/normalized-inventory.json').read_text());by={r['start']:r for r in iv['windows']}
caller=by[st];calls={st+x['offset']:x['target']for x in caller['original_operands']if x['kind']=='direct-call'}
assert calls[0x14b1d0]==0xa13e0 and calls[0x14b260]==0x8fe18 and calls[0x14b300]==0x1b3678
assert calls[0x14b8d8]==calls[0x14b918]==0x7890 and calls[0x14b9c8]==0xa23f0
front=json.loads((R/'work/parallel-main-data-frontier/round43-frontier.json').read_text())
apply=next(r for r in front['nearest_equal_length']if r['original_start']=='0xa13e0' and 'apply_sell' in r['candidate_symbol'])
assert apply['different_slots']==4
candidate=(R/'work/parallel-main-integration/build-round43/unstripped.so').read_bytes();cs=sections(candidate)
assert struct.unpack('<BBhi',body(candidate,cs,0x12c3a0,8))==(0x07,2,0,0x288)
evidence={'status':'corrected source hypothesis from full caller branch flow','supersedes':'source01 unconditional placement; source01 remains rejected/unselected',
 'input_sha256':{str(z.relative_to(R)):sha(z)for z in [R/'evidence/original/pump/deployed.so',R/'work/parallel-main-integration/build-round43/unstripped.so',R/'work/parallel-main-integration/build-round43/normalized-inventory.json',R/'work/parallel-main-data-frontier/round43-frontier.json',W/'ROLE-ADDENDUM02.json']},
 'gate':{'comparison':'user key equals Global.whitelist_pda','original_memcmp_call':'0x14b300','original_global_account_key_offset':'0x288','candidate_same_typed_comparison':'0x12c3a0 uses same GlobalAccount+0x288 in the compiled source expression user.key()==global.whitelist_pda','conditional':'0x14b318 result==0 jumps to0x14b8b8','all_direct_branch_predecessors_of_reload_entry':incoming},
 'ordering':{'before_reload':['0x14b1d0 calls apply_sell-shaped0xa13e0','0x14b260 calls exact transfer_user_tokens0x8fe18','0x14b300 user/whitelist comparison'],
 'guarded_calls':['0x14b8d8 reload base vault','0x14b918 reload base user','0x14b9c8 sync quote reserves'],
 'after_sync':'Successful sync at0x14b9d8 branches to0x14b9e8;0x14b9f8 rejoins0x14b320 before fee/payment continuation.'},
 'apply_sell_evidence':{'original':'0xa13e0','candidate_symbol':apply['candidate_symbol'],'different_slots':apply['different_slots'],'classification':'Previously sealed Source.line-only normalized gap; this establishes body shape, not masked data identity.'},
 'preserved':['Every existing validation and payment call stays in its original source order.','Existing apply_sell invocation moves before base transfer to match original and provide updated curve reserves to sync.','All normal final-state arithmetic and existing event construction remain; only whitelist sync can change virtual quote reserves.','Fee accrual remains at the existing reconstruction location; further original caller ordering differences are outside this patch.'],
 'limits':['The previously approved source01 had an invalid unconditional placement. This source02 is unbuilt and needs full independent caller-CFG review.','Existing retained whitelist/nonwhitelist cases are required before selection; no new transactions were created.','No claim of complete V3 sell reconstruction or exact body match.']}
(W/'EVIDENCE02.json').write_text(json.dumps(evidence,indent=2)+'\n')
s={'status':'source-only corrected gate and placement; unbuilt','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'primary_input_count':65,'new_cases':0,'patch_sha256':sha(W/'v3-sell-reload-sync02.patch'),'evidence_sha256':sha(W/'EVIDENCE02.json'),'supersedes_source01':True};(W/'STAGED02.json').write_text(json.dumps(s,indent=2)+'\n');(W/'MANIFEST02.json').write_text(json.dumps({n:sha(W/n)for n in ['stage02.py','v3-sell-reload-sync02.patch','EVIDENCE02.json','STAGED02.json','ROLE-ADDENDUM02.json']},indent=2)+'\n');print({'staged':sha(W/'STAGED02.json'),'patch':sha(W/'v3-sell-reload-sync02.patch')})
