"""Prove original quote/balance boundary and stage one source file; no build/VM."""
from pathlib import Path
import difflib,hashlib,json,shutil,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
BASE=R/'work/parallel-main-integration/round47-source/programs/pump';S=W/'source01'
sys.path.insert(0,str(R/'scripts'))
from build_source_manifest import source_manifest
from pump_quote_control_function_match import sections
from pump_compare_function_bytes import body
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
rawp=R/'evidence/original/pump/deployed.so';raw=rawp.read_bytes();sec=sections(raw)
ip=R/'work/parallel-main-integration/build-round47-identity/normalized-inventory.json'
iv=json.loads(ip.read_text());by={x['start']:x for x in iv['windows']}
def ins(pc):return struct.unpack('<BBhi',body(raw,sec,pc,8))
def cfg(start,size,forced=None):
 forced=forced or {};nodes={};pc=start
 while pc<start+size:nodes[pc]=ins(pc);pc+=16 if nodes[pc][0]==0x18 else 8
 edges={}
 for pc,(op,r,d,i)in nodes.items():
  nxt=pc+(16 if op==0x18 else 8)
  if pc in forced:succ=[forced[pc]]
  elif op==0x95:succ=[]
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
 return nodes,reach,lambda a,b:bool(dom[b]&(1<<index[a]))
def call(pc,target):
 op,r,d,i=ins(pc);assert(op,r,d)==(0x85,0x10,0)and pc+8+i*8==target
for st in[0x7f010,0x7e490,0x14a8a8,0x98af0]:
 assert hashlib.sha256(body(raw,sec,st,by[st]['bytes'])).hexdigest()==by[st]['raw_sha256']
nodes,reachable,dominates=cfg(0x14a8a8,by[0x14a8a8]['bytes'])
assert ins(0x14a988)==(0x79,0x81,0x48,0)
assert ins(0x14a990)==(0x79,0x11,0x68,0)
assert ins(0x14a998)==(0xad,0x91,1,0)
assert dominates(0x14a998,0x14acc8)
assert ins(0x14a9a0)==(5,0,97,0)and 0x14a9a0+8+97*8==0x14acb0
call(0x14acc8,0x7f010)
native={0x7f150:0x7f888,0x7f890:0x7f8a0,0x7f950:0x7fce8}
qn,qr,qd=cfg(0x7f010,by[0x7f010]['bytes'],native)
call(0x7f908,0x7e490);assert qd(0x7f908,0x7fd50)
call(0x7fc40,0x94908);assert 0x7fc40 not in qr
assert ins(0x7e4a0)==(0x55,4,46,0)and 0x7e4a0+8+46*8==0x7e618
bn,br,bd=cfg(0x7e490,by[0x7e490]['bytes'],{0x7e4a0:0x7e618})
call(0x7e680,0x98438)
exits=[pc for pc in br if bn[pc][0]==0x95]
assert exits and all(bd(0x7e680,pc)for pc in exits)
# 0x98af0 is a separate setter, not the quote preflight body.
call(0x725d0,0x98af0)
history=R/'work/parallel-main-r45-unmatched-queue/CLASSIFICATION01.json'
c=next(x for x in json.loads(history.read_text())['windows']if x['original_start']=='0x98af0')
assert c['classification']=='source_line_only_normalized_gap'
assert all('set_buyback_fee_recipients'in x['symbol']for x in c['nearest_candidates_at_minimum'])

def manifest(p):return{str((R/n).relative_to(p)):h for n,h in source_manifest(p,p,R).items()}
before=manifest(BASE);assert len(before)==65 and not S.exists();shutil.copytree(BASE,S)
p=S/'src/trade_v3.rs';text=p.read_text()
outside='    if is_sol{a.global.validate_buyback_fee_recipient(a.buyback_fee_recipient.key())?;}\n'
assert text.count(outside)==3
text=text.replace(outside,'')
sell_begin=text.index('pub fn sell(');sell_end=text.index('\nfn read_config(',sell_begin)
sell=text[sell_begin:sell_end]
check='    let (quote_decimals,quote_fee)=check_quote(a)?;\n    let is_sol=quote_decimals.is_none();\n'
balance='    require_gte!(a.associated_base_user.amount,amount,PumpError::NotEnoughTokensToSell);\n'
assert sell.count(check+balance)==1
sell=sell.replace(check+balance,balance+check)
text=text[:sell_begin]+sell+text[sell_end:]
native_old=' if a.bonding_curve.quote_mint==Pubkey::default(){return Ok((None,None))}'
native_new=''' if a.bonding_curve.quote_mint==Pubkey::default(){
  a.global.validate_buyback_fee_recipient(a.buyback_fee_recipient.key())?;
  return Ok((None,None))
 }'''
assert text.count(native_old)==1;text=text.replace(native_old,native_new);p.write_text(text)
after=manifest(S);changed={n:h for n,h in after.items()if before[n]!=h}
assert set(changed)=={'src/trade_v3.rs'}and manifest(BASE)==before
patch=''.join(difflib.unified_diff((BASE/'src/trade_v3.rs').read_text().splitlines(True),p.read_text().splitlines(True),'a/programs/pump/src/trade_v3.rs','b/programs/pump/src/trade_v3.rs'))
(W/'quote-preflight01.patch').write_text(patch)
proof={'status':'source-only proposal; unbuilt/unexecuted','original_program_sha256':sha(rawp),
 'target_correction':{'requested':'0x98af0 / 5464 bytes','actual':'Global::set_buyback_fee_recipients, 2 typed Source.line-only gaps; prior lane already recovered structure','quote_preflight':'0x7f010 / 3544 bytes','buyback_subhelper':'0x7e490 / 2944 bytes'},
 'sell_cfg':{'node_count':len(nodes),'balance_compare':'0x14a998','balance_source':'ctx+0x48 typed base-user Account; amount at+0x68','sufficient_balance_jump':'0x14a9a0 ->0x14acb0','quote_call':'0x14acc8 ->0x7f010','balance_dominates_quote_call':True},
 'native_quote_cfg':{'forced_branches':{hex(k):hex(v)for k,v in native.items()},'reachable_nodes':len(qr),'buyback_call':'0x7f908 ->0x7e490','buyback_dominates_return':True,'fee_snapshot_call_0x7fc40_unreachable':True},
 'native_buyback_cfg':{'forced_branch':'0x7e4a0 ->0x7e618','reachable_nodes':len(br),'global_validator_call':'0x7e680 ->0x98438','global_validator_dominates_all_returns':True},
 'instruction_bytes':{hex(pc):body(raw,sec,pc,8).hex()for pc in[0x14a988,0x14a990,0x14a998,0x14a9a0,0x14acc8,0x7f150,0x7f890,0x7f908,0x7f950,0x7e4a0,0x7e680]},
 'source_change':'Move sell base-balance guard before check_quote. Move existing native buyback validation into check_quote native branch and remove duplicate caller checks. Buy/exact retain existing relative validation order; token quote body and fee-snapshot implementation unchanged.',
 'excluded_work':['No parser/scanner/fee-tail alternatives from earlier negative controls are retried.','No compiler, new transaction or VM run.','This does not reconstruct the entire 7f010 body or its other helper ABI boundaries.'],
 'input_sha256':{str(x.relative_to(R)):sha(x)for x in[rawp,ip,history,R/'work/parallel-main-buyback-recipients/README.md',R/'work/parallel-main-v3-quote-validation-order/FINAL-RESULT.json',R/'work/parallel-main-v3-quote-scanner/CLOSED-RESULT.json']}}
(W/'EVIDENCE01.json').write_text(json.dumps(proof,indent=2)+'\n')
stage={'status':'staged source-only for independent review','source':str(S.relative_to(R)),'base_source':str(BASE.relative_to(R)),'source_before':before,'source_after':after,'changed':changed,'input_count':65,'patch_sha256':sha(W/'quote-preflight01.patch'),'evidence_sha256':sha(W/'EVIDENCE01.json'),'new_cases':0}
(W/'STAGED01.json').write_text(json.dumps(stage,indent=2)+'\n')
(W/'MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in['stage01.py','STAGED01.json','EVIDENCE01.json','quote-preflight01.patch','original-7f010.asm','original-7e490-start.asm','original-sell-prefix.asm']},indent=2)+'\n')
print({'staged_sha256':sha(W/'STAGED01.json'),'patch_sha256':sha(W/'quote-preflight01.patch')})
