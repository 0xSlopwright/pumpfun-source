"""Conservative same-basic-block interval proof for indexed byte-table reads."""
from pathlib import Path
import collections, hashlib, json, struct, sys
R=Path(__file__).resolve().parents[2]; W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf

def insns(e,start,end):
 p=start
 while p<end:
  op,rr,off,imm=struct.unpack_from('<BBhi',e.b,p)
  yield p,op,rr&15,rr>>4,off,imm
  p+=16 if op==0x18 else 8

def block_start(e,start,end,ref):
 boundaries={start}
 for p,op,d,s,off,imm in insns(e,start,end):
  if op&7 in (5,6):
   boundaries.add(p+8)
   if op not in (0x85,0x95):boundaries.add(p+8+off*8)
 return max(p for p in boundaries if start<=p<=ref)

def indexed_read(e,start,end,ref):
 regs={};seen=False
 for p,op,d,s,off,imm in insns(e,block_start(e,start,end,ref),end):
  if op==0x18:
   v=struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32
   regs[d]=('ptr',v,p)if e.relocations.get(p,{}).get('type')==8 else('range',v,v)
   if p==ref:seen=True
  elif op==0xbf:regs[d]=regs.get(s)
  elif op==0xb7:regs[d]=('range',imm,imm)
  elif op==0x57 and imm>=0:regs[d]=('range',0,imm)
  elif op==0x77:
   x=regs.get(d);regs[d]=('range',x[1]>>imm,x[2]>>imm)if x and x[0]=='range'else None
  elif op==0x0f:
   x,y=regs.get(d),regs.get(s)
   if x and y and x[0]=='ptr'and y[0]=='range':regs[d]=('indexed',x[1],x[2],y[1],y[2])
   elif x and y and x[0]=='range'and y[0]=='range':regs[d]=('range',x[1]+y[1],x[2]+y[2])
   else:regs[d]=None
  elif op==0x71:
   x=regs.get(s)
   if seen and x and x[0]=='indexed'and x[2]==ref:
    return {'load_offset':p-start,'index_min':x[3]+off,'index_max':x[4]+off,'load_bytes':1,'reference_offset':ref-start,'base':x[1]}
   regs[d]=None
  elif op&7 in(5,6):break
  elif op&7 in(1,4,7):regs[d]=None
 return None

def analyze(original,candidate,symbols,observations):
 o,c,s=Elf(Path(original)),Elf(Path(candidate)),Elf(Path(symbols));fs={f['start']:f for f in s.funcs};rows=json.loads(Path(observations).read_bytes());out=[]
 for row in rows:
  f=fs[row['candidate']];a=indexed_read(o,row['original'],row['original']+f['size'],row['original']+row['offset']);b=indexed_read(c,row['candidate'],row['candidate']+f['size'],row['candidate']+row['offset'])
  if a is None or b is None:continue
  assert {k:v for k,v in a.items()if k!='base'}=={k:v for k,v in b.items()if k!='base'}
  assert a['base']==row['original_pointer']and b['base']==row['candidate_pointer']
  assert o.normalized[row['original']:row['original']+f['size']]==c.normalized[row['candidate']:row['candidate']+f['size']]and o.pattern(row['original'],f['size'])==c.pattern(row['candidate'],f['size'])
  lo,hi=a['index_min'],a['index_max']+a['load_bytes'];assert 0<=lo<hi<=4096
  x=o.b[a['base']+lo:a['base']+hi];y=c.b[b['base']+lo:b['base']+hi]
  out.append({k:row[k]for k in['original','candidate','offset','original_pointer','candidate_pointer']}|a|{'bytes':hi-lo,'original_hex':x.hex(),'candidate_hex':y.hex(),'equal':x==y,'consumer':f})
 return {'observations':len(out),'unique_ranges':len({(r['original_pointer'],r['candidate_pointer'],r['index_min'],r['bytes'])for r in out}),'mismatches':sum(not r['equal']for r in out),'rows':out,'scope':'Same-basic-block masked index plus observed byte load; full enclosing original allocation boundaries are not inferred.'}
if __name__=='__main__':
 raise SystemExit('Use verify.py --root REPOSITORY to run the sealed audit.')
