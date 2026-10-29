"""Static original CFG proof and private legacy source recovery; no build or VM."""
from pathlib import Path
import difflib, hashlib, json, shutil, struct, sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round46-source/programs/pump';S=W/'source01'
sys.path.insert(0,str(R/'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body,normalize
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def manifest(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
original=R/'evidence/original/pump/deployed.so';raw=original.read_bytes();sec=sections(raw)
ivp=R/'work/parallel-main-integration/build-round43/normalized-inventory.json'
iv=json.loads(ivp.read_text());by={w['start']:w for w in iv['windows']}
assert sha(original)==iv['original_sha256']
def ins(pc):return struct.unpack('<BBhi',body(raw,sec,pc,8))
def call(pc,target):
 op,r,d,i=ins(pc);assert(op,r,d)==(0x85,0x10,0)and pc+8+i*8==target,hex(pc)
def ld(pc,dst,src,off):assert ins(pc)==(0x79,src*16+dst,off,0),hex(pc)
def add(pc,dst,n):assert ins(pc)==(7,dst,0,n),hex(pc)
def cfg(start,size):
 nodes={};pc=start
 while pc<start+size:nodes[pc]=ins(pc);pc+=16 if nodes[pc][0]==0x18 else 8
 edges={}
 for pc,(op,r,d,i) in nodes.items():
  nxt=pc+(16 if op==0x18 else 8)
  if op==0x95:succ=[]
  elif op in(5,6):succ=[pc+8+d*8]
  elif op&7 in(5,6)and op!=0x85:succ=[nxt,pc+8+d*8]
  else:succ=[nxt]
  assert all(t in nodes for t in succ),(hex(pc),succ)
  edges[pc]=succ
 reach={start};queue=[start]
 for pc in queue:
  for t in edges[pc]:
   if t not in reach:reach.add(t);queue.append(t)
 pred={pc:[]for pc in reach}
 for pc in reach:
  for t in edges[pc]:pred[t].append(pc)
 index={pc:n for n,pc in enumerate(sorted(reach))};full=(1<<len(index))-1
 dom={pc:full for pc in reach};dom[start]=1<<index[start];changed=True
 while changed:
  changed=False
  for pc in sorted(reach):
   if pc==start:continue
   v=full
   for p in pred[pc]:v&=dom[p]
   v|=1<<index[pc]
   if v!=dom[pc]:dom[pc]=v;changed=True
 return nodes,edges,pred,lambda a,b:bool(dom[b]&(1<<index[a]))

handlers=[
 dict(name='buy',start=0x14c038,writes=[0x14cb78,0x14cbd8,0x14cc30,0x14cd20],write_offsets=[0x368,0x378,0x370,0x380],transfer=0x14ce80,guard=0x14cf40,entry=0x14d5d8,reloads=[0x14d5f8,0x14d640],sync=0x14d6e8,join=0x14cf48,payment=0x14d0d0,event_quote=0x14d208,roles=[0x14cd18,0x14cd08],reload_adds=[0x14d5e0,0x14d628],sync_loads=[0x14d6b0,0x14d6b8],user_load=0x14ceb0,global_load=0x14cf00),
 dict(name='exact',start=0x14f4e0,writes=[0x1508b0,0x150940,0x150948,0x1509d0],write_offsets=[0x368,0x370,0x378,0x380],transfer=0x150b28,guard=0x150be8,entry=0x151450,reloads=[0x151470,0x1514b8],sync=0x151560,join=0x150bf0,payment=0x150d70,event_quote=0x150e98,roles=[0x1509c8,0x1509b8],reload_adds=[0x151458,0x1514a0],sync_loads=[0x151528,0x151530],user_load=0x150b58,global_load=0x150ba8),
 dict(name='sell',start=0x152888,writes=[0x153498,0x153520,0x153580,0x153608],write_offsets=[0x368,0x378,0x370,0x380],transfer=0x153670,guard=0x153728,entry=0x153948,reloads=[0x153968,0x1539b0],sync=0x153a58,join=0x153730,payment=0x153900,event_quote=0x153d50,roles=[0x1535e8,0x1535f8],reload_adds=[0x153950,0x153998],sync_loads=[0x153a20,0x153a28],user_load=0x153698,global_load=0x1536e8),
]
proof=[]
for h in handlers:
 start=h['start'];w=by[start];nodes,edges,pred,dom=cfg(start,w['bytes'])
 assert hashlib.sha256(body(raw,sec,start,w['bytes'])).hexdigest()==w['raw_sha256']
 op,r,d,i=ins(h['guard']);assert(op,r,i)==(0x15,0,0)and h['guard']+8+d*8==h['entry']
 assert pred[h['entry']]==[h['guard']]
 for pc,offset in zip(h['writes'],h['write_offsets']):
  op,r,off,imm=ins(pc);assert op==0x7b and off==offset and imm==0
  assert dom(pc,h['transfer'])and dom(pc,h['entry'])
 assert dom(h['transfer'],h['guard'])and dom(h['guard'],h['entry'])
 call(h['transfer'],0x90e60 if h['name']=='sell'else 0x91690)
 role_offsets=[0x1e8,0x110]if h['name']=='sell'else[0x110,0x1e8]
 for pc,dst,offset in zip(h['roles'],[3,4],role_offsets):add(pc,dst,offset)
 for pc,offset in zip(h['reload_adds'],[0x130,0x208]):add(pc,2,offset)
 for pc in h['reloads']:call(pc,0x7890)
 for pc,dst,offset in zip(h['sync_loads'],[3,4],[0x178,0x250]):ld(pc,dst,2,offset)
 call(h['sync'],0xa23f0);call(h['guard']-24,0x1b3678)
 ld(h['user_load'],1,3,0x3d8);ld(h['global_load'],2,3,0x3c8);add(h['global_load']+8,2,0x288)
 success=h['sync']+24;op,r,d,i=ins(success)
 assert op==0x15 and i==2 and success+8+d*8==h['join']
 seen={h['entry']};queue=[h['entry']]
 for pc in queue:
  for t in edges[pc]:
   if t!=h['join']and t not in seen:seen.add(t);queue.append(t)
 assert h['payment']not in seen and h['event_quote']not in seen
 assert dom(h['join'],h['payment'])and dom(h['join'],h['event_quote'])
 assert ins(h['event_quote'])[0]==0x79 and ins(h['event_quote'])[2:]==(0x370,0)
 selected=[*h['writes'],h['transfer'],h['guard']-24,h['guard'],*h['roles'],*h['reload_adds'],*h['reloads'],*h['sync_loads'],h['sync'],success,h['user_load'],h['global_load'],h['global_load']+8,h['event_quote']]
 proof.append({'handler':h['name'],'original_start':hex(start),'original_bytes':w['bytes'],'raw_sha256':w['raw_sha256'],'cfg_node_count':len(nodes),
  'reserve_write_order':[{'pc':hex(pc),'context_offset':hex(off)}for pc,off in zip(h['writes'],h['write_offsets'])],
  'all_reserve_writes_dominate_transfer_and_reload':True,'transfer':hex(h['transfer']),'sole_reload_predecessor':hex(h['guard']),
  'reload_entry':hex(h['entry']),'success_branch':hex(success),'success_join':hex(h['join']),
  'following_quote_payment':hex(h['payment']),'post_join_virtual_quote_snapshot':hex(h['event_quote']),
  'no_payment_or_event_reachable_from_reload_without_join':True,
  'typed_transfer_offsets':role_offsets,'selected_instruction_bytes':{hex(pc):body(raw,sec,pc,8).hex()for pc in sorted(set(selected))}})

candidate=R/'work/parallel-main-integration/build-round43/unstripped.so';cb=candidate.read_bytes();cs=sections(cb);bindings=[]
for start,symbol in [(0x91690,'transfer_curve_tokens_ref'),(0x90e60,'transfer_user_tokens_ref'),(0x16e7f0,'LegacyBuy'),(0x174520,'LegacySell'),(0xa23f0,'sync_virtual_quote_reserves')]:
 w=by[start];m=next(m for m in w['normalized_matches']if symbol in m['symbol'])
 assert normalize(body(raw,sec,start,w['bytes']),start,sec)[0]==normalize(body(cb,cs,m['start'],w['bytes']),m['start'],cs)[0]
 bindings.append({'original_start':hex(start),'candidate_start':hex(m['start']),'symbol':m['symbol'],'bytes':w['bytes'],'normalized_equal_rechecked':True})

before=manifest(BASE);assert len(before)==65 and not S.exists();shutil.copytree(BASE,S)
guard='''
{i}if a.user.key()==a.global.whitelist_pda {{
{i} a.associated_bonding_curve.reload()?;
{i} a.associated_user.reload()?;
{i} let quote_mint=a.bonding_curve.quote_mint;
{i} a.bonding_curve.sync_virtual_quote_reserves(
{i}  a.associated_bonding_curve.amount,
{i}  a.associated_user.amount,
{i}  &quote_mint,
{i} )?;
{i}}}
{i}let c=&a.bonding_curve;
{i}let vb=c.virtual_token_reserves;let vq=c.virtual_quote_reserves;let rb=c.real_token_reserves;let rq=c.real_quote_reserves;'''
buy_transfer='crate::buy_v2::token_transfers::transfer_curve_tokens_ref(&a.token_program,&a.associated_bonding_curve,&a.associated_user,&&a.bonding_curve,a.mint.decimals,a.mint.as_ref(),amount,&[seeds])?;'
sell_transfer='crate::collect_v2::transfer_user_tokens_ref(&a.token_program,&a.associated_user,&a.associated_bonding_curve,&&a.user,a.mint.decimals,a.mint.as_ref(),amount)?;'
late='let c=&mut a.bonding_curve;c.virtual_token_reserves=vb;c.virtual_quote_reserves=vq;c.real_token_reserves=rb;c.real_quote_reserves=rq;'
def inline_handler(s,direction):
 op='checked_sub'if direction=='buy'else'checked_add';qop='checked_add'if direction=='buy'else'checked_sub'
 old='\n'.join(f'     let {v}=c.{field}.{operation}({arg}).ok_or_else(||error!(PumpError::Overflow))?;'for v,field,operation,arg in [('vb','virtual_token_reserves',op,'amount'),('rb','real_token_reserves',op,'amount'),('vq','virtual_quote_reserves',qop,'quote'),('rq','real_quote_reserves',qop,'quote')])
 new='\n'.join(f'     a.bonding_curve.{field}=a.bonding_curve.{field}.{operation}({arg}).ok_or_else(||error!(PumpError::Overflow))?;'for field,operation,arg in [('virtual_token_reserves',op,'amount'),('real_token_reserves',op,'amount'),('virtual_quote_reserves',qop,'quote'),('real_quote_reserves',qop,'quote')])
 assert s.count(old)==1;s=s.replace(old,new)
 transfer=buy_transfer if direction=='buy'else sell_transfer
 assert s.count(transfer)==1;s=s.replace(transfer,transfer+guard.format(i='     '))
 assert s.count(late)==1;s=s.replace(late,'let c=&mut a.bonding_curve;'if direction=='buy'else'')
 return s
p=S/'src/lib.rs';s=p.read_text();bs=s.index('    pub fn buy<');be=s.index('    pub fn buy_exact_sol_in',bs);ss=s.index('    pub fn sell(ctx',be);se=s.index('    pub fn migrate<',ss)
unchanged_parts=[s[:bs],s[be:ss],s[se:]]
s=s[:bs]+inline_handler(s[bs:be],'buy')+s[be:ss]+inline_handler(s[ss:se],'sell')+s[se:]
assert s.startswith(unchanged_parts[0])and unchanged_parts[1]in s and s.endswith(unchanged_parts[2]);p.write_text(s)
p=S/'src/buy.rs';s=p.read_text()
old=' let vb=sub(c.virtual_token_reserves,amount)?;let vq=add(c.virtual_quote_reserves,quote)?;let rb=sub(c.real_token_reserves,amount)?;let rq=add(c.real_quote_reserves,quote)?;'
new=''' a.bonding_curve.virtual_token_reserves=sub(a.bonding_curve.virtual_token_reserves,amount)?;
 a.bonding_curve.virtual_quote_reserves=add(a.bonding_curve.virtual_quote_reserves,quote)?;
 a.bonding_curve.real_token_reserves=sub(a.bonding_curve.real_token_reserves,amount)?;
 a.bonding_curve.real_quote_reserves=add(a.bonding_curve.real_quote_reserves,quote)?;'''
assert s.count(old)==s.count(buy_transfer)==s.count(late)==1
s=s.replace(old,new).replace(buy_transfer,buy_transfer+guard.format(i=' ')).replace(late,'let c=&mut a.bonding_curve;');p.write_text(s)
after=manifest(S);changed={n:h for n,h in after.items()if before[n]!=h};assert set(changed)=={'src/lib.rs','src/buy.rs'}and manifest(BASE)==before
patch=''.join(''.join(difflib.unified_diff((BASE/n).read_text().splitlines(True),(S/n).read_text().splitlines(True),'a/programs/pump/'+n,'b/programs/pump/'+n))for n in sorted(changed));(W/'legacy-reload-sync01.patch').write_text(patch)
inputs=[original,ivp,candidate,R/'work/parallel-main-v3-reload-sync/ALL-RELOAD-CALLERS03.json',R/'work/parallel-main-v3-reload-sync/EVIDENCE02.json',R/'work/parallel-main-v2-reload-sync/EVIDENCE01.json',*[W/f'original-{n}.asm'for n in['buy','exact','sell']]]
ev={'status':'source-only legacy reload/sync hypothesis, full CFG proof completed; independent review required',
 'input_sha256':{str(p.relative_to(R)):sha(p)for p in inputs},'handlers':proof,'typed_abi_bindings':bindings,
 'predicate':'user key at context+0x3d8 equals Global.whitelist_pda from Global at context+0x3c8, account+0x288; reload is entered only on memcmp equality.',
 'typed_accounts':'Original transfer argument positions identify inline InterfaceAccount base vault at context+0x110 and user at+0x1e8. reload receives inner Account at +0x20, and sync loads amount at +0x68. No source declaration-order inference.',
 'curve_layout':'The inline Account starts at context+0x320 and BondingCurve at+0x328. Original sync writes BondingCurve+0x48, which is context+0x370; all three post-join snapshots read context+0x370.',
 'source_changes':['Only src/lib.rs buy/sell handler slices and src/buy.rs exact handler are changed from R46.','Each existing inline arithmetic update now writes the curve before base transfer, matching original store order; no new apply helper call is introduced.','Insert user-whitelist-gated base vault and user reload then sync immediately after the existing base CPI.','Read event reserve values after sync and remove the late overwrite. All other validations, fees, payments, complete handling and event construction remain.'],
 'limits':['No build, new cases, signatures, VM transactions or live-chain calls.','Other original legacy mismatch windows and existing fee/validation ordering gaps remain outside this bounded patch.','The private patch requires independent review and a fresh coordinated build/runtime run.','No separate Mayhem or AMM program implementation is changed.']}
(W/'EVIDENCE01.json').write_text(json.dumps(ev,indent=2)+'\n')
stage={'status':'source-only staged after full original CFG and role proof; unbuilt','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'input_count':65,'patch_sha256':sha(W/'legacy-reload-sync01.patch'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'new_cases':0,'preservation':'R46 lib.rs preserved except exact legacy buy/sell slices. Future composition must apply those hunks against current lib.rs and verify every unrelated R46/R47 change remains.'}
(W/'STAGED01.json').write_text(json.dumps(stage,indent=2)+'\n')
(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in['stage01.py','legacy-reload-sync01.patch','STAGED01.json','EVIDENCE01.json','original-buy.asm','original-exact.asm','original-sell.asm']},indent=2)+'\n')
print({'stage_sha256':sha(W/'STAGED01.json'),'patch_sha256':sha(W/'legacy-reload-sync01.patch'),'changed':changed})
