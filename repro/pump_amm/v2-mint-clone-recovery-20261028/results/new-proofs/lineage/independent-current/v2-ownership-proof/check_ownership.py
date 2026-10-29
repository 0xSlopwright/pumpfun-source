from pathlib import Path
import collections,hashlib,importlib.util,json,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W))
from elf_reader import Elf
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def op(e,p):return struct.unpack_from('<BBhi',e.b,p)
def releases(e,start,limit,temp,lower):
 # Symbolic traversal only from decoder return until both cloned Rc strong counts
 # are decremented, before any subsequent call/return. Unknown branches fork.
 initial_stack={temp+8:('rc','lamports'),temp+16:('rc','data')};initial=[None]*11;initial[10]=('sp',0)
 todo=[(start,initial,initial_stack,(),(),0)];done=[];seen=set()
 while todo:
  pc,regs,stack,counts,path,steps=todo.pop();assert steps<180,(hex(pc),counts)
  key=(pc,tuple(regs),tuple(sorted(stack.items())),counts)
  if key in seen:continue
  seen.add(key)
  if set(counts)=={'lamports','data'}:done.append({'branch_choices':[list(x)for x in path],'release_order':list(counts),'finished_at':hex(pc)});continue
  assert lower<=pc<limit,(hex(pc),counts)
  code,rs,off,imm=op(e,pc);dst,src=rs&15,rs>>4;nxt=pc+8;rr=list(regs);ss=dict(stack);cc=counts
  if code==0x79:
   ref=rr[src]
   rr[dst]=ss.get(ref[1]+off)if ref and ref[0]=='sp'else (('strong'if off==0 else'weak',ref[1])if ref and ref[0]=='rc'and off in(0,8)else None)
  elif code==0x7b:
   ref=rr[dst]
   if ref and ref[0]=='sp':ss[ref[1]+off]=rr[src]
   elif ref and ref[0]=='rc'and off==0 and rr[src]==('decremented',ref[1]):cc=counts+(ref[1],);assert cc.count(ref[1])==1
  elif code==0xbf:rr[dst]=rr[src]
  elif code==0xb7:rr[dst]=('constant',imm)
  elif code==0x07:
   x=rr[dst]
   rr[dst]=('sp',x[1]+imm)if x and x[0]=='sp'else(('decremented',x[1])if x and x[0]=='strong'and imm==-1 else None)
  elif code==0x18:rr[dst]=None;nxt+=8
  elif code in(0x85,0x95):raise AssertionError(('call/return before both Rc releases',hex(pc),counts))
  elif code==0x05:nxt=pc+8+off*8
  elif code&7 in(5,6):
   target=pc+8+off*8
   todo.append((target,list(rr),dict(ss),cc,path+((hex(pc),True),),steps+1));path=path+((hex(pc),False),)
  else:
   # Ignore stores/compares outside the two Rc values; conservatively kill ALU/load destinations.
   if code&7 in(1,4,7):rr[dst]=None
  todo.append((nxt,rr,ss,cc,path,steps+1))
 assert done and all(sorted(v['release_order'])==['data','lamports']for v in done)
 return done

def verify():
 o,c,s,b,bs=map(Elf,[W/'original.so',W/'candidate.so',W/'symbols.so',W/'baseline.so',W/'baseline-symbols.so'])
 clone=next(f for f in s.funcs if'AccountInfo$u20$as$u20$core..clone..Clone'in f['name']);decode=next(f for f in s.funcs if'9from_mint17'in f['name'])
 assert clone['size']==264 and o.normalized[0xe178:0xe178+264]==c.normalized[clone['start']:clone['start']+264]and o.pattern(0xe178,264)==c.pattern(clone['start'],264)
 rows=[]
 for mode,orig,n,needle,temp in [('buy',0x53350,5840,'11execute_buy17',-864),('exact',0x54a20,7112,'23execute_buy_exact_quote17',-864),('sell',0x56710,5904,'12execute_sell17',-800)]:
  f=next(f for f in s.funcs if needle in f['name']);base=next(f for f in bs.funcs if needle in f['name']);v={}
  for label,e,a,length,ct,dt in [('original',o,orig,n,0xe178,0x74128),('current',c,f['start'],f['size'],clone['start'],decode['start'])]:
   calls=e.callsites(a,length);ix=next(i for i,x in enumerate(calls)if x['target']==dt);cl,de=calls[ix-1:ix+1];assert cl['target']==ct and de['offset']-cl['offset']==32
   pc=a+cl['offset']
   # Prefix starts with two fixed loads; the preceding store differs by handler.
   assert op(e,pc-40)==(0x79,0x71,32,0)and op(e,pc-32)==(0x79,0x12,88,0)
   reg=op(e,pc-24)[1]&15;assert reg in(8,9)and op(e,pc-24)==(0xbf,0xa0|reg,0,0)and op(e,pc-16)==(0x07,reg,0,temp)and op(e,pc-8)==(0xbf,(reg<<4)|1,0,0)
   assert op(e,pc+8)==(0xbf,0xa1,0,0)and op(e,pc+24)==(0xbf,(reg<<4)|2,0,0)
   proof=releases(e,a+de['offset']+8,a+length,temp,a)
   v[label]={'clone_call':hex(pc),'decoder_call':hex(a+de['offset']),'input_pointer':'*(*(accounts+0x20)+0x58)','clone_stack_offset':temp,'result_stack_offset':op(e,pc+16)[3],'all_explored_release_paths':proof,'path_count':len(proof)}
  rows.append({'mode':mode,'original_bytes':n,'baseline_bytes':base['size'],'current_bytes':f['size'],**v})
 return {'passed':True,'candidate_sha256':H(W/'candidate.so'),'clone264_full_original_equal':True,'rows':rows,'scope':'Direct input/output pointer and symbolic post-decoder Rc strong-release traversal. Stops after both releases, not a proof of arbitrary later aliases or whole-handler equivalence.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
