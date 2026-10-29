"""Decoder block bisimulation after collapsing explicit branch trampolines.

The proof checks bit-vector register effects and ordered memory effects for every
paired cutpoint, with equal normalized branch predicates and destination nodes.
It does not execute Solana or treat this quotient as instruction/ELF identity.
"""
from pathlib import Path
import hashlib,json,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));sys.dont_write_bytecode=True
from elf_reader import Elf
MASK=(1<<64)-1
POINTS={
 'entry':(0,0),'size':(3,5),'padding_init':(4,6),'padding_test':(7,9),
 'padding_read':(8,10),'error':(13,15),'none':(15,3),'exit':(16,16),
 'account_type':(17,17),'setup':(19,19),'carry':(26,26),'next_view':(28,28),
 'tail':(34,34),'fee_return':(35,38),'kind':(49,36),'header':(52,52),
 'length':(54,54),'dispatch':(59,59),'duplicate':(66,60),'fee_length':(68,61),
 'payload':(69,63),'advance':(60,76)}
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dec(code):return [struct.unpack('<BBhi',code[k:k+8])for k in range(0,len(code),8)]
def constant(n):return ('const',n&MASK)
def arithmetic(op,a,b):
 if a[0]=='const'and b[0]=='const':
  return constant({'add':lambda:a[1]+b[1],'sub':lambda:a[1]-b[1],'and':lambda:a[1]&b[1]}[op]())
 if op in ('add','and') and str(a)>str(b):a,b=b,a
 return(op,a,b)
def negate(g):return(g[0],g[1],g[2],not g[3])
def predicate(op,a,b):
 if op==0x15:return('eq',a,b,True)
 if op==0x55:return('eq',a,b,False)
 if op in(0x25,0xb5)and b[0]=='const':return('lt',a,constant(b[1]+1),op==0xb5)
 if op==0xa5:return('lt',a,b,True)
 if op==0xad:return('lt',a,b,True)
 if op==0xbd:return('lt',b,a,False)
 raise AssertionError(('unknown predicate',hex(op)))
def summarize(code,side,node):
 ins=dec(code);cuts={v[side]:k for k,v in POINTS.items()};out=[]
 def walk(pc,regs,events,guards,steps,started=False):
  assert steps<100,('uncut loop',node,pc)
  if started and pc in cuts:
   out.append({'to':cuts[pc],'guards':guards,'registers':regs,'memory':events});return
  op,packed,off,imm=ins[pc];dst=packed&15;src=packed>>4;regs=list(regs);events=list(events)
  if op==0x95:
   out.append({'to':'return','guards':guards,'registers':regs,'memory':events});return
  if op==0x05:return walk(pc+1+off,regs,events,guards,steps+1,True)
  if op in(0x15,0x55,0x25,0xa5,0xb5,0xad,0xbd):
   rhs=regs[src]if op&8 else constant(imm)
   g=predicate(op,regs[dst],rhs)
   walk(pc+1+off,regs,events,guards+[g],steps+1,True)
   walk(pc+1,regs,events,guards+[negate(g)],steps+1,True);return
  if op==0xbf:regs[dst]=regs[src]
  elif op==0xb7:regs[dst]=constant(imm)
  elif op in(0x07,0x0f):regs[dst]=arithmetic('add',regs[dst],regs[src]if op==0x0f else constant(imm))
  elif op==0x1f:regs[dst]=arithmetic('sub',regs[dst],regs[src])
  elif op==0x57:regs[dst]=arithmetic('and',regs[dst],constant(imm))
  elif op in(0x71,0x69,0x79):
   width={0x71:8,0x69:16,0x79:64}[op];address=arithmetic('add',regs[src],constant(off));value=('load',width,address)
   events.append(('read',width,address));regs[dst]=value
  elif op in(0x7a,0x7b,0x6b):
   width=16 if op==0x6b else 64;address=arithmetic('add',regs[dst],constant(off));value=constant(imm)if op==0x7a else regs[src]
   events.append(('write',width,address,value))
  else:raise AssertionError(('unknown opcode',hex(op),pc))
  walk(pc+1,regs,events,guards,steps+1,True)
 walk(POINTS[node][side],[('r',i)for i in range(11)],[],[],0)
 return sorted(out,key=lambda v:json.dumps(v,sort_keys=True))
def analyze():
 o=Elf(W/'original.so');c=Elf(W/'candidate.so');s=Elf(W/'symbols.so')
 assert h(W/'original.so')=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 assert h(W/'candidate.so')=='e33e6aace7d53008b3300364c07540f0cd7d1764196cd601554b08838b06e615'
 f=[f for f in s.funcs if 'decode_transfer_fees' in f['name']];assert len(f)==1 and f[0]['size']==656
 first=0xf31d8;ob=o.b[first:first+664];cb=c.b[f[0]['start']:f[0]['start']+656]
 assert not o.pattern(first,664)and not c.pattern(f[0]['start'],656)
 assert not o.callsites(first,664)and not c.callsites(f[0]['start'],656)
 results={}
 for n in POINTS:
  a=summarize(ob,0,n);b=summarize(cb,1,n);assert a==b,('block effects differ',n,a,b);results[n]=a
 oi=dec(ob);ci=dec(cb);uncond=lambda ins:[8*i for i,v in enumerate(ins)if v[0]==0x05]
 assert len(oi)==83 and len(ci)==82 and len(uncond(oi))==9 and len(uncond(ci))==8
 # Original payload ends in a back edge; current payload falls into advance.
 assert oi[82]==(5,0,-23,0)and POINTS['advance']==(60,76)
 assert ci[75][0]==0x7b and 76==POINTS['advance'][1]
 return {'passed':True,'original_sha256':h(W/'original.so'),'candidate_sha256':h(W/'candidate.so'),
  'original_decoder':hex(first),'candidate_decoder':hex(f[0]['start']),
  'original_bytes':664,'candidate_bytes':656,'original_instructions':83,'candidate_instructions':82,
  'original_unconditional_branch_offsets':uncond(oi),'candidate_unconditional_branch_offsets':uncond(ci),
  'paired_cutpoints':len(POINTS),'cutpoints':POINTS,'block_summaries':results,
  'extra_original_instruction':{'offset':656,'opcode':'ja','target_offset':480,'role':'payload-to-cursor-advance back edge'},
  'memory_effects_equal':True,'register_effects_equal_at_every_cutpoint':True,
  'branch_predicates_equal_after_inversion':True,'calls':0,'data_relocations':0,
  'scope':'Structural block bisimulation over the decoded instruction subset, valid memory reads, shared initial machine state, and explicit cutpoint pairing. This does not establish byte identity, historical source spelling, or absence of undefined behavior for forged ABI inputs.'}
if __name__=='__main__':print(json.dumps(analyze(),indent=2))
