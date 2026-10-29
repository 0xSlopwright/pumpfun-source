from pathlib import Path
import hashlib,importlib.util,itertools,json,random,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));sys.dont_write_bytecode=True
from elf_reader import Elf
MASK=(1<<64)-1
def run(code,gates,fees,helper,error=False):
 mem={};r=[0]*11;r[1]=0x10000;r[2]=0x20000;r[3]=0x30000 if not helper else 123;r[10]=0x70000
 def put(a,v,n=8):
  for k,x in enumerate((v&((1<<(n*8))-1)).to_bytes(n,'little')):mem[a+k]=x
 def get(a,n=8):return int.from_bytes(bytes(mem.get(a+k,0)for k in range(n)),'little')
 put(0x20000+56,0x30000)
 for k,b in enumerate(gates):put(0x30000+k,int(b),1)
 if not helper:
  for k,v in enumerate(fees):put(0x20000+k*8,v)
 pc=calls=steps=0
 while True:
  steps+=1;assert steps<2000
  op,p,off,imm=struct.unpack_from('<BBhi',code,pc);dst=p&15;src=p>>4;n=pc+8
  if op==0xbf:r[dst]=r[src]
  elif op==0xb7:r[dst]=imm&MASK
  elif op==0x07:r[dst]=(r[dst]+imm)&MASK
  elif op==0x67:r[dst]=(r[dst]<<imm)&MASK
  elif op==0xc7:r[dst]=((r[dst]if r[dst]<(1<<63)else r[dst]-(1<<64))>>imm)&MASK
  elif op==0x57:r[dst]&=imm&MASK
  elif op==0x5f:r[dst]&=r[src]
  elif op==0x87:r[dst]=(-r[dst])&MASK
  elif op in[0x79,0x69,0x71]:r[dst]=get((r[src]+off)&MASK,{0x79:8,0x69:2,0x71:1}[op])
  elif op==0x7b:put((r[dst]+off)&MASK,r[src])
  elif op==0x05:n+=off*8
  elif op in[0x15,0x55]:
   if(r[dst]==(imm&MASK))==(op==0x15):n+=off*8
  elif op==0x85:
   assert helper and pc==208;calls+=1;put(r[1],1 if error else 0)
   for k,v in enumerate(fees):put(r[1]+8+8*k,v)
   for k in range(6):r[k]=0
  elif op==0x95:
   assert calls==int(helper);return [get(0x10000+8*k)for k in range(7 if helper else 6)]
  else:raise AssertionError((pc,hex(op)))
  pc=n
def verify(candidate=None,symbols=None):
 o=Elf(W/'original.so');c=Elf(Path(candidate)if candidate else W/'candidate.so');s=Elf(Path(symbols)if symbols else W/'symbols.so');f=next(x for x in s.funcs if'14apply_hop_fees'in x['name'])
 spec=importlib.util.spec_from_file_location('model_sections',W/'object_reader.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 models=m.sections(W/'model.o');mask=next(x for x in models if'11apply_masks'in x['name']);base=next(x for x in models if'17paired_conditions'in x['name'])
 opcodes=[mask['code'][k]for k in range(0,len(mask['code']),8)];assert opcodes.count(0x87)==3 and opcodes.count(0x5f)==6 and all(x not in[0x15,0x55,0x85]for x in opcodes)
 rng=random.Random(440536);inputs=[[0]*6,[MASK]*6,[0,1,1<<63,MASK,10000,9999]]+[[rng.getrandbits(64)for _ in range(6)]for _ in range(256)]
 cases=0
 for gates in itertools.product([False,True],repeat=3):
  select=[gates[2],gates[0],gates[1]]*2
  for fees in inputs:
   expected=[v if keep else 0 for v,keep in zip(fees,select)]
   a=run(o.b[0x44ab0:0x44ab0+536],gates,fees,True);b=run(c.b[f['start']:f['start']+f['size']],gates,fees,True)
   assert a==b==[0]+expected
   assert run(mask['code'],gates,fees,False)==run(base['code'],gates,fees,False)==expected;cases+=1
  err=[0x1122334455667788,0x8877665544332211,0,0,0,0]
  assert run(o.b[0x44ab0:0x44ab0+536],gates,err,True,True)[:3]==run(c.b[f['start']:f['start']+f['size']],gates,err,True,True)[:3]==[1]+err[:2]
 return {'passed':True,'success_cases':cases,'error_cases':8,'gate_combinations':8,'input_sets':len(inputs),'model_mask_bytes':mask['size'],'model_paired_bytes':base['size'],'original_bytes':536,'candidate_bytes':f['size'],'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'scope':'Bounded SBPF instruction interpretation; selector result is a supplied stub, no Solana VM or entire selector equivalence.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
