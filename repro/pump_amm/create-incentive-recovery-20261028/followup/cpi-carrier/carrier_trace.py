"""Symbolic success-path carrier trace; callees use explicit bounded stubs."""
from pathlib import Path
import json,struct,sys,hashlib
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));sys.dont_write_bytecode=True
from elf_reader import Elf
def const(x):return('c',x&((1<<64)-1))
def add(a,b):
 if b[0]!='c':a,b=b,a
 if b[0]=='c':
  n=b[1]
  if n==0:return a
  if a[0]=='c':return const(a[1]+n)
  if a[0]=='add':return add(a[1],const(a[2]+n))
  return('add',a,n)
 return('sum',*sorted([a,b],key=str))
def address(a,k=0):return add(a,const(k))
def load(mem,a,n):
 values=[mem.get(address(a,k),('initial',address(a,k)))for k in range(n)]
 if all(x[0]=='byte'and x[1]==values[0][1]and x[2]==k for k,x in enumerate(values)):return values[0][1]
 if all(x[0]=='number'for x in values):return const(sum(x[1]<<(8*k)for k,x in enumerate(values)))
 return('load',n,a)
def store(mem,a,n,value):
 for k in range(n):mem[address(a,k)]=('number',(value[1]>>(8*k))&255)if value[0]=='c'else('byte',value,k)
def execute(e,start,size,callee_roles):
 code=e.b[start:start+size];todo=[(0,[('arg',i)for i in range(11)],{},[],[])];todo[0][1][10]=('sp',)
 results=[]
 while todo:
  pc,regs,mem,history,copies=todo.pop()
  for step in range(600):
   op,packed,off,imm=struct.unpack_from('<BBhi',code,pc);dst=packed&15;src=packed>>4;nextpc=pc+8
   if op==0x18:
    high=struct.unpack_from('<I',code,pc+12)[0];regs[dst]=const((imm&0xffffffff)|(high<<32));nextpc+=8
   elif op==0xbf:regs[dst]=regs[src]
   elif op==0xb7:regs[dst]=const(imm)
   elif op in(0x07,0x0f):regs[dst]=add(regs[dst],regs[src]if op==0x0f else const(imm))
   elif op==0x57:regs[dst]=('and',regs[dst],const(imm))
   elif op in(0x67,0x77):regs[dst]=(str(op),regs[dst],imm)
   elif op in(0x79,0x71,0x69,0x61):regs[dst]=load(mem,address(regs[src],off),{0x79:8,0x71:1,0x69:2,0x61:4}[op])
   elif op in(0x7b,0x73,0x6b,0x63,0x7a,0x72,0x62):store(mem,address(regs[dst],off),{0x7b:8,0x73:1,0x6b:2,0x63:4,0x7a:8,0x72:1,0x62:4}[op],regs[src]if op in(0x7b,0x73,0x6b,0x63)else const(imm))
   elif op==0x05:nextpc+=off*8
   elif op in(0x15,0x55,0x25,0xa5):
    lhs=regs[dst];rhs=const(imm)
    if lhs[0]=='c':
     take={0x15:lhs[1]==rhs[1],0x55:lhs[1]!=rhs[1],0x25:lhs[1]>rhs[1],0xa5:lhs[1]<rhs[1]}[op]
     if take:nextpc+=off*8
    else:
     todo.append((nextpc+off*8,list(regs),dict(mem),history+[(pc,True)],list(copies)));history=history+[(pc,False)]
   elif op==0x85:
    target=e.calls.get(start+pc);role=callee_roles.get(target)
    if role is None:break # External abort/error paths are outside this success trace.
    if role=='cpi':
     base=regs[2];values=[mem.get(address(base,k),('uninitialized',))for k in range(184)]
     results.append({'pc':pc,'context':base,'bytes':values,'copies':copies,'history':history});break
    if role=='pda':
     for k in range(4):store(mem,address(regs[1],8*k),8,('pda',k))
     store(mem,address(regs[1],32),1,const(7))
    elif role=='memcmp':regs[0]=const(0)
    elif role=='cap':
     store(mem,regs[1],8,const(0));store(mem,address(regs[1],8),8,('cap',0));store(mem,address(regs[1],16),8,('cap',1))
    elif role=='memcpy':
     assert regs[3][0]=='c';n=regs[3][1];source,dest=regs[2],regs[1]
     tmp=[mem.get(address(source,k),('uninitialized',))for k in range(n)]
     for k,value in enumerate(tmp):mem[address(dest,k)]=value
     copies.append({'pc':pc,'bytes':n,'source':source,'destination':dest})
    else:raise AssertionError(role)
    for r in range(1,6):regs[r]=('clobber',pc,r)
   else:raise AssertionError((pc,hex(op)))
   pc=nextpc
  else:raise AssertionError('trace step limit')
 assert results
 first=results[0]
 assert all({k:v for k,v in x.items()if k!='history'}=={k:v for k,v in first.items()if k!='history'}for x in results)
 first['equivalent_symbolic_paths']=len(results)
 return first
def analyze():
 o=Elf(W/'original.so');c=Elf(W/'candidate.so');s=Elf(W/'symbols.so');f=next(x for x in s.funcs if 'fees16select_and_apply' in x['name'])
 origin=execute(o,0x13458,2264,{0x10e068:'pda',0x1198e0:'memcmp',0x6b780:'cap',0xdade8:'cpi'})
 targetmap={name:next(x['start']for x in s.funcs if fragment in x['name'])for name,fragment in [('pda','Pubkey20find_program_address'),('cap','Pool$GT$10market_cap'),('cpi','cpi24get_fees_with_quote_mint')]}
 targetmap.update(memcmp=next(x['start']for x in s.funcs if x['name']=='memcmp'),memcpy=next(x['start']for x in s.funcs if x['name']=='memcpy'))
 current=execute(c,f['start'],f['size'],{v:k for k,v in targetmap.items()})
 equal=[i for i,(x,y)in enumerate(zip(origin['bytes'],current['bytes']))if x==y];assert len(equal)==184
 padding=[i for i,value in enumerate(origin['bytes'])if value==('uninitialized',)]
 assert padding==list(range(67,72))+list(range(115,120))+list(range(163,168))
 return {'passed':True,'original':origin,'candidate':current,'carrier_bytes':184,'equal_initialized_bytes':169,'uninitialized_padding_offsets':padding,'stubs':['PDA writes the same symbolic Pubkey','memcmp returns equality','market_cap writes Ok with same symbolic128bit value','memcpy copies exactly requested bytes'],'limits':'Only the success path to the generated CPI call, with non-overflowing AccountInfo reference counts and explicit callee stubs. Actual callee identities are checked separately. Uninitialized padding agrees as a category, not a chosen byte value.'}
if __name__=='__main__':print(json.dumps(analyze(),indent=2))
