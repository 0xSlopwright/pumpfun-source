"""Prove retained V2 caller CFG/roles, then stage main-contract source only."""
from pathlib import Path
import difflib, hashlib, json, shutil, struct, sys

R = Path(__file__).resolve().parents[2]
W = Path(__file__).resolve().parent
BASE = R / 'work/parallel-main-integration/round45-source/programs/pump'
S = W / 'source01'
sys.path.insert(0, str(R / 'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body, normalize
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
def manifest(p): return {str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}

original = R / 'evidence/original/pump/deployed.so'
inventory_file = R / 'work/parallel-main-integration/build-round43/normalized-inventory.json'
candidate = R / 'work/parallel-main-integration/build-round43/unstripped.so'
raw = original.read_bytes(); sec = sections(raw)
iv = json.loads(inventory_file.read_text()); by = {w['start']:w for w in iv['windows']}
assert sha(original) == iv['original_sha256']
def ins(pc): return struct.unpack('<BBhi', body(raw,sec,pc,8))
def call(pc, target):
    op,r,d,imm=ins(pc)
    assert (op,r,d)==(0x85,0x10,0) and pc+8+imm*8==target, hex(pc)
def ld(pc, dst, src, offset): assert ins(pc)==(0x79,src*16+dst,offset,0),hex(pc)
def add(pc, dst, immediate): assert ins(pc)==(7,dst,0,immediate),hex(pc)
def cfg(start, size):
    nodes={};pc=start
    while pc<start+size:
        nodes[pc]=ins(pc);pc+=16 if nodes[pc][0]==0x18 else 8
    edges={}
    for pc,(op,r,d,imm) in nodes.items():
        nxt=pc+(16 if op==0x18 else 8)
        if op==0x95: successors=[]
        elif op in (5,6): successors=[pc+8+d*8]
        elif op&7 in (5,6) and op!=0x85: successors=[nxt,pc+8+d*8]
        else: successors=[nxt]
        assert all(t in nodes for t in successors), (hex(pc),successors)
        edges[pc]=successors
    reachable={start};queue=[start]
    for pc in queue:
        for t in edges[pc]:
            if t not in reachable:reachable.add(t);queue.append(t)
    pred={pc:[] for pc in reachable}
    for pc in reachable:
        for t in edges[pc]:pred[t].append(pc)
    indexes={pc:n for n,pc in enumerate(sorted(reachable))};full=(1<<len(indexes))-1
    dom={pc:full for pc in reachable};dom[start]=1<<indexes[start]
    changed=True
    while changed:
        changed=False
        for pc in sorted(reachable):
            if pc==start:continue
            value=full
            for p in pred[pc]:value&=dom[p]
            value|=1<<indexes[pc]
            if value!=dom[pc]:dom[pc]=value;changed=True
    return nodes,edges,pred,lambda a,b:bool(dom[b]&(1<<indexes[a]))

handlers=[
 dict(name='buy',start=0x13b9b8,apply=0x13d430,transfer=0x13d5c8,guard=0x13d678,entry=0x13de60,reloads=[0x13de80,0x13dec0],sync=0x13df70,join=0x13d680,payment=0x13d888,event_quote=0x13db30,context_reg=9,roles=[0x13d468,0x13d460],user_load=0x13d5e8,global_load=0x13d638,reload_loads=[0x13de60,0x13dea0],sync_loads=[0x13df28,0x13df38],sync_amounts=[0x13df30,0x13df40]),
 dict(name='exact',start=0x13f630,apply=0x141fe0,transfer=0x142178,guard=0x142228,entry=0x142ce0,reloads=[0x142d00,0x142d40],sync=0x142df0,join=0x142230,payment=0x142438,event_quote=0x1426d8,context_reg=8,roles=[0x142018,0x142010],user_load=0x142198,global_load=0x1421e8,reload_loads=[0x142ce0,0x142d20],sync_loads=[0x142da8,0x142db8],sync_amounts=[0x142db0,0x142dc0]),
 dict(name='sell',start=0x144508,apply=0x146038,transfer=0x1460e0,guard=0x146198,entry=0x146a80,reloads=[0x146aa8,0x146af0],sync=0x146ba8,join=0x1461a0,payment=0x1463a0,event_quote=0x146688,context_reg=5,roles=[0x146070,0x146068],user_load=0x146108,global_load=0x146158,reload_loads=[0x146a88,0x146ad0],sync_loads=[0x146b60,0x146b70],sync_amounts=[0x146b68,0x146b78]),
]
evidence=[]
for h in handlers:
    start=h['start'];w=by[start]
    assert sha(original)==iv['original_sha256']
    assert hashlib.sha256(body(raw,sec,start,w['bytes'])).hexdigest()==w['raw_sha256']
    nodes,edges,pred,dominates=cfg(start,w['bytes'])
    op,r,d,imm=ins(h['guard'])
    assert (op,r,imm)==(0x15,0,0) and h['guard']+8+d*8==h['entry']
    assert pred[h['entry']]==[h['guard']]
    assert all(dominates(pc,h['entry']) for pc in [h['apply'],h['transfer'],h['guard']])
    assert dominates(h['apply'],h['transfer'])
    call(h['apply'],0xa13e0 if h['name']=='sell' else 0xa0bf0)
    call(h['transfer'],0x8fe18 if h['name']=='sell' else 0x8f5c8)
    for pc in h['reloads']:call(pc,0x7890)
    call(h['sync'],0xa23f0)
    call(h['guard']-24,0x1b3678)
    # Both buy handlers and sell identify the same two typed transfer arguments.
    # Sell uses source=user, destination=vault; buys use source=vault, destination=user.
    role_offsets=[0x160,0x148] if h['name']=='sell' else [0x148,0x160]
    for pc,dst,offset in zip(h['roles'],[3,4],role_offsets):ld(pc,dst,h['context_reg'],offset)
    # Later reloads and sync amounts are vault then user, independent of trade direction.
    reload_context=1 if h['name']=='sell' else h['context_reg']
    for pc,offset in zip(h['reload_loads'],[0x148,0x160]):ld(pc,2,reload_context,offset);add(pc+8,2,0x20)
    sync_context=4 if h['name']=='sell' else h['context_reg']
    for pc,offset in zip(h['sync_loads'],[0x148,0x160]):ld(pc,1,sync_context,offset)
    for pc,dst in zip(h['sync_amounts'],[3,4]):ld(pc,dst,1,0x68)
    user_context=3 if h['name']=='sell' else h['context_reg']
    ld(h['user_load'],1,user_context,0x158)
    ld(h['global_load'],2,user_context,0xf0);add(h['global_load']+8,2,0x288)
    # Reload errors exit through error paths; only a successful sync rejoins the guard fallthrough.
    success=h['sync']+16
    op,r,d,imm=ins(success)
    assert op==0x15 and imm==2 and success+8+d*8==h['join']
    seen={h['entry']};queue=[h['entry']]
    for pc in queue:
        for t in edges[pc]:
            if t!=h['join'] and t not in seen:seen.add(t);queue.append(t)
    assert h['payment'] not in seen and h['event_quote'] not in seen
    assert dominates(h['join'],h['payment']) and dominates(h['join'],h['event_quote'])
    assert ins(h['event_quote'])==(0x79,0x12,0x50,0)
    selected=[h['apply'],h['transfer'],h['guard']-24,h['guard'],*h['roles'],h['user_load'],h['global_load'],h['global_load']+8,*h['reload_loads'],*h['reloads'],*h['sync_loads'],*h['sync_amounts'],h['sync'],success,h['event_quote']]
    evidence.append({
      'handler':h['name'],'original_start':hex(start),'original_bytes':w['bytes'],'raw_sha256':w['raw_sha256'],
      'cfg_node_count':len(nodes),'reload_entry':hex(h['entry']),
      'sole_reload_predecessor':hex(h['guard']),
      'dominators_checked':{k:hex(h[k]) for k in ['apply','transfer','guard']},
      'success_branch':hex(success),'success_join':hex(h['join']),
      'first_following_quote_payment':hex(h['payment']),'post_join_virtual_quote_snapshot':hex(h['event_quote']),
      'no_payment_or_event_reachable_from_reload_without_join':True,
      'role_offsets':{'global':'0xf0','curve':'0x140','base_vault':'0x148','user':'0x158','base_user':'0x160'},
      'typed_transfer_order':role_offsets,
      'selected_instruction_bytes':{hex(pc):body(raw,sec,pc,8).hex() for pc in sorted(set(selected))}})

# Independently bind typed ABI names to the normalized original transfer and context constructors.
bindings=[]
candidate_bytes=candidate.read_bytes();candidate_sections=sections(candidate_bytes)
for start,symbol in [(0x8f5c8,'transfer_curve_tokens'),(0x8fe18,'transfer_user_tokens'),(0xa4378,'BuyV2'),(0xe62a8,'SellV2'),(0xa23f0,'sync_virtual_quote_reserves')]:
    w=by[start];m=next(m for m in w['normalized_matches'] if symbol in m['symbol'])
    assert normalize(body(raw,sec,start,w['bytes']),start,sec)[0]==normalize(body(candidate_bytes,candidate_sections,m['start'],w['bytes']),m['start'],candidate_sections)[0]
    bindings.append({'original_start':hex(start),'candidate_start':hex(m['start']),'symbol':m['symbol'],'bytes':w['bytes'],'normalized_equal_rechecked':True})

before=manifest(BASE);assert len(before)==65 and not S.exists()
shutil.copytree(BASE,S)
for filename,direction in [('buy_v2.rs','buy'),('sell_v2.rs','sell')]:
    p=S/'src'/filename;text=p.read_text();expected=2 if direction=='buy' else 1
    if direction=='buy':
        arithmetic=' let vb=sub(c.virtual_token_reserves,amount)?;let vq=add(c.virtual_quote_reserves,quote)?;let rb=sub(c.real_token_reserves,amount)?;let rq=add(c.real_quote_reserves,quote)?;'
        transfer=' token_transfers::transfer_curve_tokens(&a.base_token_program,&a.associated_base_bonding_curve,&a.associated_base_user,&a.bonding_curve,a.base_mint.decimals,a.base_mint.as_ref().as_ref(),amount,&[seeds])?;'
    else:
        arithmetic=' let vb=add(c.virtual_token_reserves,amount)?;let vq=sub(c.virtual_quote_reserves,quote)?;let rb=add(c.real_token_reserves,amount)?;let rq=sub(c.real_quote_reserves,quote)?;'
        transfer=' user_token_transfers::transfer_user_tokens(&a.base_token_program,&a.associated_base_user,&a.associated_base_bonding_curve,a.user.as_ref(),a.base_mint.decimals,a.base_mint.as_ref().as_ref(),amount)?;'
    assert text.count(arithmetic)==text.count(transfer)==expected
    text=text.replace(arithmetic,f' a.bonding_curve.apply_{direction}(amount,quote)?;')
    guard='''
 if a.user.key()==a.global.whitelist_pda {
  a.associated_base_bonding_curve.reload()?;
  a.associated_base_user.reload()?;
  let quote_mint=a.bonding_curve.quote_mint;
  a.bonding_curve.sync_virtual_quote_reserves(
   a.associated_base_bonding_curve.amount,
   a.associated_base_user.amount,
   &quote_mint,
  )?;
 }
 let c=&a.bonding_curve;
 let vb=c.virtual_token_reserves;let vq=c.virtual_quote_reserves;let rb=c.real_token_reserves;let rq=c.real_quote_reserves;'''
    text=text.replace(transfer,transfer+guard)
    late='let c=&mut a.bonding_curve;c.virtual_token_reserves=vb;c.virtual_quote_reserves=vq;c.real_token_reserves=rb;c.real_quote_reserves=rq;'
    assert text.count(late)==expected
    text=text.replace(late,'let c=&mut a.bonding_curve;' if direction=='buy' else '')
    p.write_text(text)
after=manifest(S);changed={n:h for n,h in after.items() if before[n]!=h}
assert set(changed)=={'src/buy_v2.rs','src/sell_v2.rs'} and manifest(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n)) for n in sorted(changed))
(W/'v2-reload-sync01.patch').write_text(patch)
inputs=[original,inventory_file,candidate,R/'work/parallel-main-v3-reload-sync/ALL-RELOAD-CALLERS03.json',R/'work/parallel-main-v3-reload-sync/EVIDENCE02.json',R/'work/parallel-main-data-frontier/round43-frontier.json',W/'original-buy.asm',W/'original-exact.asm',W/'original-sell.asm']
proof={'status':'source-only V2 guarded reload and sync recovery; independent review required',
 'input_sha256':{str(p.relative_to(R)):sha(p) for p in inputs},'handlers':evidence,'typed_abi_bindings':bindings,
 'predicate':'a.user.key()==a.global.whitelist_pda; original compares 32 user-key bytes with Global account+0x288 and enters reload only on equality.',
 'global_field_mapping':'Inherited from EVIDENCE02: an existing compiled typed Global.whitelist_pda comparison uses account+0x288. V2 contexts load Global at+0xf0 and user at+0x158; constructor normalized matches are independently rechecked here.',
 'reload_type':'Original 0x7890 is Account<TokenAccount>::reload; InterfaceAccount<TokenAccount>::reload delegates to its inner Account, adding no policy. Preserve source InterfaceAccount types.',
 'state_order':'Move existing reserve calculation into existing apply_buy/apply_sell before base CPI, then gated reload vault/user and sync, then existing payments. No validation or payment call is reordered relative to another.',
 'event_order':'Read reserve snapshot after gated sync. Original sync writes BondingCurve+0x48 (Account+0x50); all three original event snapshot sites read Account+0x50 after the success join. Remove old late reserve assignments so synced vq survives.',
 'limits':['No compiler or VM run. This does not establish whole-handler or whole-ELF identity.','Current V2 handlers have other unmatched structures and payment/fee-accrual gaps outside this narrow patch.','Sync affects whitelist trades in the existing main-contract state mode; ordinary trades gain reload only when their user key equals the whitelist.','No new cases/transactions, external chain calls, AMM implementation edits or separate Mayhem program changes.']}
(W/'EVIDENCE01.json').write_text(json.dumps(proof,indent=2)+'\n')
staged={'status':'staged source-only for independent whole-handler CFG review','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'input_count':65,'new_cases':0,'patch_sha256':sha(W/'v2-reload-sync01.patch'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'preservation':'Only buy_v2.rs and sell_v2.rs changed from R45. To apply on R46, require exact before hashes for those two files; retain every other R46 input.'}
(W/'STAGED01.json').write_text(json.dumps(staged,indent=2)+'\n')
(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n) for n in ['stage01.py','v2-reload-sync01.patch','EVIDENCE01.json','STAGED01.json','original-buy.asm','original-exact.asm','original-sell.asm']},indent=2)+'\n')
print({'stage_sha256':sha(W/'STAGED01.json'),'patch_sha256':sha(W/'v2-reload-sync01.patch'),'changed':changed})
