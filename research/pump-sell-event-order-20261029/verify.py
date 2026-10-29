#!/usr/bin/env python3
"""Recompute bounded SellV2 instruction-CFG and used-event-key evidence.

Reads captured/compiler bytes as data. Never compiles, executes a program, alters an
ELF, changes an official comparator or claims a matching/runtime gain.
"""
from pathlib import Path
import argparse, gzip, hashlib, json, re, struct

REVISION = '1285b5e9e3a29c1e2cf32246d6046035e5d66fad'
PACKET = 'research/pump-final-composition-673-20261028'
EXPECTED = {
 'original': '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d',
 'candidate': '49df399b8a36a0a60de03e8d55f1417261dc451e44845ca9d17a94040968c680',
 'inventory': 'c66bb5ece1676933838403fa99c120b636eba9c3db4e543bb32d614bcac6451d',
 'source': '0a214cbd9077b5606c1c867e831d9ccc5cc2705262d568061c03925334783b4c',
 'overlay': 'f1f484c50a792c82fba414dff31b6bfc55f03cbec54d7115782c60ad5870b45d',
}
sha=lambda b:hashlib.sha256(b).hexdigest()

def elf_body(data,start,size):
 assert data[:6]==b'\x7fELF\x02\x01'
 table=struct.unpack_from('<Q',data,40)[0]
 width,count,names=struct.unpack_from('<HHH',data,58)
 sections=[struct.unpack_from('<IIQQQQIIQQ',data,table+i*width) for i in range(count)]
 strs=sections[names];s=data[strs[4]:strs[4]+strs[5]]
 text=next(x for x in sections if s[x[0]:s.find(b'\0',x[0])]==b'.text')
 assert text[3]<=start and start+size<=text[3]+text[5]
 p=text[4]+start-text[3]
 return data[p:p+size]

def instructions(raw):
 result={};p=0
 while p<len(raw):
  op,regs,off,imm=struct.unpack_from('<BBhi',raw,p)
  width=16 if op==0x18 else 8
  result[p]=dict(op=op,dst=regs&15,src=regs>>4,off=off,imm=imm,width=width,raw=raw[p:p+width].hex())
  p+=width
 assert p==len(raw)
 return result

def graph(ins):
 successors={}
 for pc,i in ins.items():
  nxt=pc+i['width'];op=i['op']
  if op==0x95:edges=[]
  elif op&7 in (5,6) and op&0xf0 not in (0x80,0x90):
   target=pc+8+i['off']*8
   edges=[target] if op&0xf0==0 else [nxt,target]
  else:edges=[nxt]
  assert all(e in ins for e in edges),(hex(pc),i,edges)
  successors[pc]=edges
 return successors

def reachable(g,entry=0,avoid=None):
 seen=set();pending=[entry]
 while pending:
  p=pending.pop()
  if p==avoid or p in seen:continue
  seen.add(p);pending.extend(g[p])
 return seen

def dominates(g,a,b):
 assert b in reachable(g)
 return b not in reachable(g,avoid=a)

def between_nodes(graph,first,last):
 # Nodes on any path after first and before last, without revisiting first.
 # Reversing the graph excludes error-only tails that cannot reach the consumer.
 reverse={p:[] for p in graph}
 for p,edges in graph.items():
  for q in edges:reverse[q].append(p)
 forward=set();pending=list(graph[first])
 while pending:
  p=pending.pop()
  if p in (first,last) or p in forward:continue
  forward.add(p);pending.extend(graph[p])
 return forward & reachable(reverse,entry=last,avoid=first)

def stack_writes_overlapping(ins,nodes,slot):
 result=[]
 for p in nodes:
  i=ins[p]
  if i['op'] not in (0x62,0x6a,0x72,0x7a,0x63,0x6b,0x73,0x7b) or i['dst']!=10:continue
  size={0:4,8:2,16:1,24:8}[i['op']&0x18]
  if i['off']<slot+8 and slot<i['off']+size:result.append(p)
 return sorted(result)

def expect(ins,pc,**fields):
 for k,v in fields.items():assert ins[pc][k]==v,(hex(pc),k,v,ins[pc])
 return dict(offset=pc,**ins[pc])

def copies(ins,pc,account_field,info_field,slots):
 # r3 points to the handler account bundle. Exact chain -> keyptr -> four u64s.
 first=pc;proof=[expect(ins,pc,op=0x79,dst=1,src=3,off=account_field)];pc+=8
 if info_field is not None:
  proof.append(expect(ins,pc,op=0x79,dst=1,src=1,off=info_field));pc+=8
 proof.append(expect(ins,pc,op=0x79,dst=1,src=1,off=0));pc+=8
 stores=[]
 for word in (3,2,1):
  proof.append(expect(ins,pc,op=0x79,dst=2,src=1,off=word*8));pc+=8
  proof.append(expect(ins,pc,op=0x7b,dst=10,src=2,off=slots[word]));stores.append(pc);pc+=8
 proof.append(expect(ins,pc,op=0x79,dst=1,src=1,off=0));pc+=8
 proof.append(expect(ins,pc,op=0x7b,dst=10,src=1,off=slots[0]));stores.append(pc);pc+=8
 return dict(first=first,end=pc,source_account_offset=account_field,account_info_offset=info_field,
             stack_word_offsets=slots,store_sites=stores,instructions=proof)

def transfer(ins,read,slot,eventslot,reg):
 a=expect(ins,read,op=0x79,dst=reg,src=10,off=slot)
 b=expect(ins,read+8,op=0x7b,dst=10,src=reg,off=eventslot)
 return dict(read=a,event_store=b)

def source_sites(source):
 # All macro invocations, including every Source-emitting require!/error! site.
 # Comments/strings cannot cause a false equality because exact overlay bytes and
 # the only two changed complete lines are independently checked.
 text=source.decode('utf-8')
 result=[]
 for match in re.finditer(r'\b([A-Za-z_][A-Za-z0-9_]*)\s*!\s*\(',text):
  line=text.count('\n',0,match.start())+1
  column=match.start()-text.rfind('\n',0,match.start())
  result.append([match.group(1),line,column])
 return result

def verify_overlay(source,overlay):
 assert sha(source)==EXPECTED['source']
 assert sha(overlay)==EXPECTED['overlay']
 old=source.decode('utf-8');new=overlay.decode('utf-8')
 before='let quote_mint=c.quote_mint;let timestamp=Clock::get()?.unix_timestamp;let is_sol=quote_mint==Pubkey::default();'
 after='let quote_mint=c.quote_mint;let is_sol=quote_mint==Pubkey::default();let user=a.user.key();let mint=a.base_mint.key();let timestamp=Clock::get()?.unix_timestamp;'
 assert old.count(before)==1
 expected=old.replace(before,after)
 before='let ev=TradeEvent{user:a.user.key(),mint:a.base_mint.key(),'
 after='let ev=TradeEvent{user,mint,'
 assert expected.count(before)==1
 expected=expected.replace(before,after)
 assert new==expected
 a=old.splitlines(keepends=True);b=new.splitlines(keepends=True)
 assert len(a)==len(b)
 changed=[i for i,(x,y) in enumerate(zip(a,b),1) if x!=y]
 assert changed==[402,403]
 assert source_sites(source)==source_sites(overlay)
 return dict(changed_physical_lines=changed,macro_sites_unchanged=source_sites(source),
             source_sha256=sha(source),overlay_sha256=sha(overlay))

def analyze(original,candidate):
 report=[]
 for side,start,size,memcmp,clock,user,mint,uslots,mslots,ur,mr,ureg,mreg,event in [
  ('original',0x144508,13976,0x29e8,0x2ab8,0x2a00,0x2a50,[-0x100,-0xf8,-0xf0,-0xe8],[-0x68,-0x60,-0x58,-0x50],[0x2fa8,0x2f98,0x2f88,0x2f78],[0x2f60,0x2f10,0x2f20,0x2f30],0,0,0x31e8),
  ('candidate',0x86170,14104,0x2a90,0x2a20,0x2aa0,0x2af0,[-0x28,-0x20,-0x18,-0x10],[-0x68,-0x60,-0x58,-0x50],[0x2fe0,0x2ff0,0x3000,0x3010],[0x2fc8,0x2fb8,0x2fa8,0x2f98],3,3,0x3260),
 ]:
  raw=elf_body(original if side=='original' else candidate,start,size)
  ins=instructions(raw);g=graph(ins)
  # Site offsets are bound below to original instructions, not inferred from disassembly labels.
  for call in (memcmp,clock,event):expect(ins,call,op=0x85,src=1)
  u=copies(ins,user,0x158,None,uslots)
  m=copies(ins,mint,0xf8,0x58,mslots)
  reads={
   'user':[transfer(ins,p,s,-0x2a8+8*k,ureg) for k,(p,s) in enumerate(zip(ur,uslots))],
   'mint':[transfer(ins,p,s,-0x2d8+8*k,mreg) for k,(p,s) in enumerate(zip(mr,mslots))],
  }
  for item,slc in [('user',u),('mint',m)]:
   for k,read in enumerate(reads[item]):
    store=next(p for p in slc['store_sites'] if ins[p]['off']==slc['stack_word_offsets'][k])
    assert dominates(g,store,read['read']['offset'])
    assert dominates(g,read['read']['offset']+8,event)
    # Direct stack writes are fully enumerated; opaque callee memory effects remain separately bounded.
    writes=stack_writes_overlapping(ins,between_nodes(g,store,read['read']['offset']),slc['stack_word_offsets'][k])
    assert not writes,(side,item,k,writes)
    event_store=read['event_store']['offset']
    assert not stack_writes_overlapping(ins,between_nodes(g,event_store,event),read['event_store']['off'])
  pairs=[('memcmp_before_clock',memcmp,clock),('user_before_clock',u['end']-8,clock),('mint_before_clock',m['end']-8,clock),('clock_before_memcmp',clock,memcmp)]
  dom={name:dominates(g,a,b) for name,a,b in pairs}
  assert dom==({'memcmp_before_clock':True,'user_before_clock':True,'mint_before_clock':True,'clock_before_memcmp':False} if side=='original' else {'memcmp_before_clock':False,'user_before_clock':False,'mint_before_clock':False,'clock_before_memcmp':True})
  # Every instruction in the original memcmp/key/Clock region has only the immediately prior instruction as predecessor.
  preds={p:[] for p in ins}
  for p,edges in g.items():
   for q in edges:preds[q].append(p)
  region=range(memcmp+8,clock+8,8) if side=='original' else range(memcmp+8,m['end'],8)
  assert all(preds[p]==[p-8] for p in region)
  report.append(dict(side=side,start=start,bytes=size,body_sha256=sha(raw),instruction_count=len(ins),
   reachable_instructions=len(reachable(g)),dominance=dom,memcmp_site=memcmp,clock_site=clock,
   key_copies={'user':u,'mint':m},key_to_event_copies=reads,event_data_call=event,
   event_pointer_stack_offset=-0x308,event_mint_offset=0x30,event_user_offset=0x60,
   straight_region_has_no_external_internal_CFG_entry=True))
 return report

def call_target(raw,start,offset):
 i=instructions(raw)[offset]
 assert i['op']==0x85 and i['src']==1
 return start+offset+8+i['imm']*8

def audit(original,candidate,inventory_bytes,source,overlay):
 for name,data in [('original',original),('candidate',candidate),('inventory',inventory_bytes)]:
  assert sha(data)==EXPECTED[name],name+' input SHA256 mismatch'
 source_proof=verify_overlay(source,overlay)
 inventory=json.loads(gzip.decompress(inventory_bytes))
 windows={w['start']:w for w in inventory['windows']}
 window=windows[0x144508]
 assert window['bytes']==13976 and not window['normalized_matches'] and not window['raw_match']
 reports=analyze(original,candidate)
 original_raw=elf_body(original,0x144508,13976)
 candidate_raw=elf_body(candidate,0x86170,14104)
 assert sha(original_raw)==window['raw_sha256']
 callee_pairs=[]
 for name,old,new in [('memcmp',0x29e8,0x2a90),('Clock::get',0x2ab8,0x2a20),('TradeEvent::data',0x31e8,0x3260),('TradeEvent::data CPI',0x3290,0x3308)]:
  old_target=call_target(original_raw,0x144508,old)
  new_target=call_target(candidate_raw,0x86170,new)
  assert any(m['start']==new_target for m in windows[old_target]['normalized_matches'])
  callee_pairs.append(dict(role=name,original_call=old,candidate_call=new,original_target=old_target,
   candidate_target=new_target,official_normalized_callee_body_member=True))
 return dict(schema=1,revision=REVISION,selection=PACKET,input_sha256=EXPECTED,
  official_counts=inventory['counts'],source_overlay=source_proof,callee_pairs=callee_pairs,reports=reports,
  qualification=dict(static_cfg_and_direct_stack_dataflow=True,source_overlay_compiled=False,
   sell_v2_vm_executed=False,canonical_source_changed=False,new_window_match=False,runtime_defect_claimed=False),
  limits=[
   'The intraprocedural CFG treats calls as ordinarily returning fallthrough; this is not an all-program semantic proof.',
   'Exact key chains and direct stack def-use are checked, not original Rust spelling or complete interprocedural aliasing.',
   'The user/mint key snapshots flow to the event input through eight exact local load/store pairs; no snapshot-slot direct write intervenes.',
   'Calls between snapshot and event have other explicit result destinations; arbitrary callee memory effects are not universally proved absent.',
   'The exact selected image is compared only; the proposed source overlay has no compiler or VM qualification.',
   'SellV2 corrective/transfer-fee and all SellV2 VM execution remain stopped. No arithmetic, minimum-output, fee, domain or validation change is proposed.',
   'Existing deliberate inherited Source positioning is retained; unchanged macro line/column positions are mechanical facts, not original-source authorship.'])

def main():
 parser=argparse.ArgumentParser(description=__doc__)
 root=Path(__file__).resolve().parents[2]
 parser.add_argument('--original',type=Path,default=root/'evidence/original/pump/deployed.so')
 parser.add_argument('--symbols',type=Path,default=root/PACKET/'artifacts/unstripped.so')
 parser.add_argument('--inventory',type=Path,default=root/PACKET/'analysis/inventory.json.gz')
 parser.add_argument('--source',type=Path,default=root/PACKET/'source/src/sell_v2.rs')
 parser.add_argument('--output',type=Path)
 args=parser.parse_args()
 overlay=Path(__file__).resolve().parent/'overlay/sell_v2.rs'
 report=audit(args.original.read_bytes(),args.symbols.read_bytes(),args.inventory.read_bytes(),args.source.read_bytes(),overlay.read_bytes())
 text=json.dumps(report,indent=2)+'\n'
 if args.output:args.output.write_text(text)
 else:print(text,end='')

if __name__=='__main__':main()
