"""Bounded original/control SBPF micro-execution; no Solana transaction or CPI."""
from pathlib import Path
import sys,struct,json,hashlib
W=Path(__file__).resolve().parent
sys.path.insert(0,str(W));from elf_reader import Elf
from object_reader import sections
MASK=(1<<64)-1

def run(code,start,end,count,buy,heap=0):
 mem={};r=[0]*11;r[1]=0x10200;r[2]=0x10100;r[10]=0x20000
 def put(p,v,n=8):
  for i,b in enumerate((v&((1<<(n*8))-1)).to_bytes(n,'little')):mem[(p+i)&MASK]=b
 def get(p,n=8):
  return int.from_bytes(bytes(mem.get((p+i)&MASK,0)for i in range(n)),'little')
 put(0x10100,0x10000);put(0x10108,0x10008);put(0x10110,start);put(0x10118,end);put(0x10000,int(buy),1);put(0x10008,count);put(0x300000000,heap)
 pc=0;steps=0
 while True:
  steps+=1;assert steps<10000,(start,end,count)
  op,regs,off,imm=struct.unpack_from('<BBhi',code,pc);dst=regs&15;src=regs>>4;nextpc=pc+8
  if op==0x18:r[dst]=(imm&0xffffffff)|(struct.unpack_from('<i',code,pc+12)[0]&0xffffffff)<<32;nextpc+=8
  elif op==0xb7:r[dst]=imm&MASK
  elif op==0xbf:r[dst]=r[src]
  elif op==0x07:r[dst]=(r[dst]+imm)&MASK
  elif op==0x0f:r[dst]=(r[dst]+r[src])&MASK
  elif op==0x1f:r[dst]=(r[dst]-r[src])&MASK
  elif op==0x4f:r[dst]|=r[src]
  elif op==0x57:r[dst]&=imm&MASK
  elif op==0x67:r[dst]=(r[dst]<<imm)&MASK
  elif op==0x77:r[dst]>>=imm
  elif op==0x79:r[dst]=get((r[src]+off)&MASK)
  elif op==0x71:r[dst]=get((r[src]+off)&MASK,1)
  elif op==0x7b:put((r[dst]+off)&MASK,r[src])
  elif op==0x73:put((r[dst]+off)&MASK,r[src],1)
  elif op==0x05:nextpc+=off*8
  elif op in (0x15,0x55,0x2d,0xad,0xbd,0xc5,0x1d):
   signed=lambda x:x if x<(1<<63)else x-(1<<64)
   test={0x15:lambda:r[dst]==(imm&MASK),0x55:lambda:r[dst]!=(imm&MASK),0x2d:lambda:r[dst]>r[src],0xad:lambda:r[dst]<r[src],0xbd:lambda:r[dst]<=r[src],0xc5:lambda:signed(r[dst])<imm,0x1d:lambda:r[dst]==r[src]}[op]()
   if test:nextpc+=off*8
  elif op==0x85:return {'status':'allocation_error','alignment':r[1],'requested':r[2],'heap_after':get(0x300000000)}
  elif op==0x95:
   cap,ptr,n=(get(0x10200+i)for i in (0,8,16));assert n<=255
   return {'status':'ok','capacity':cap,'pointer':ptr,'length':n,'bytes':bytes(get(ptr+i,1)for i in range(n)).hex(),'heap_after':get(0x300000000)}
  else:raise AssertionError((hex(pc),hex(op)))
  pc=nextpc

def verify():
 O=Elf(W/'original.so');original=O.normalized[0xfb08:0xfdc8];C=next(s for s in sections(W/'flags.o')if 'tuple_buy17' in s['name']);rows=[]
 for count in (0,1,2,3,255,MASK):
  spans={(0,0),(0,min(count,255)),(count,count),(max(0,count-1),count),(max(0,count-2),count)}
  if count>2:spans.add((1,min(count,3)))
  for start,end in sorted(spans):
   for sell in (False,True):
    for heap in (0,0x300000008,0x300000009,0x300008000):
     buy=not sell;a=run(original,start,end,count,buy,heap);b=run(C['code'],start,end,count,buy,heap);assert a==b,(start,end,count,sell,heap,a,b)
     if a['status']=='ok':
      expected=bytes((int(j+1==count)if sell else int(j==0))|((int(j==0)if sell else int(j+1==count))<<1)for j in range(start,end));assert a['bytes']==expected.hex()
     rows.append({'count':count,'start':start,'end':end,'sell':sell,'heap':heap,'result':a})
 return {'passed':True,'cases':len(rows),'original_sha256':hashlib.sha256(O.b).hexdigest(),'original_window':'0xfb08/704','control_sha256':hashlib.sha256((W/'flags.o').read_bytes()).hexdigest(),'control_symbol':C['name'],'scope':__doc__,'rows':rows}
