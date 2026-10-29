"""Trace byte-slice pairs written into signer/PDA argument storage."""
from pathlib import Path
import json,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));from elf_reader import Elf

def trace(e,start,size,ref):
 r={10:('stack',0)};m={};p=ref;seen=set()
 while start<=p<start+size and len(seen)<512:
  if p in seen:break
  seen.add(p);op,rr,off,imm=struct.unpack_from('<BBhi',e.b,p);d,s=rr&15,rr>>4
  if op==0x18:
   value=struct.unpack_from('<I',e.b,p+4)[0]|struct.unpack_from('<I',e.b,p+12)[0]<<32;r[d]=('literal',value,p)if e.relocations.get(p,{}).get('type')==8 else('int',value);p+=16;continue
  if op==0xbf:r[d]=r.get(s)
  elif op==0xb7:r[d]=('int',imm)
  elif op==0x07:
   x=r.get(d);r[d]=(x[0],x[1]+imm)if x and x[0]in('stack','int')else None
  elif op in(0x7a,0x7b,0x72,0x73,0x6a,0x6b,0x62,0x63):
   base=r.get(d);width={0x7a:8,0x7b:8,0x72:1,0x73:1,0x6a:2,0x6b:2,0x62:4,0x63:4}[op]
   if base and base[0]=='stack':
    at=base[1]+off
    for k in list(m):
     if k<at+width and at<k+8:del m[k]
    if width==8:m[at]=(r.get(s)if op==0x7b else('int',imm),p)
  elif op==0x79:
   base=r.get(s);r[d]=m.get(base[1]+off,(None,None))[0]if base and base[0]=='stack'else None
  elif op==0x05:p+=8+off*8;continue
  elif op==0x85:
   pairs=[]
   for slot,(value,write)in m.items():
    length=m.get(slot+8)
    if value and value[0]=='literal'and value[2]==ref and length and length[0]and length[0][0]=='int':
     pairs.append({'slot':slot,'pointer_write':write-start,'length_write':length[1]-start,'length':length[0][1]})
   return {'call_offset':p-start,'target':e.calls.get(p),'pairs':pairs}
  elif op&7 in(5,6):return None
  elif op&7 in(1,4,7):r[d]=None
  p+=8
 return None

def analyze(original,candidate,symbols,rows):
 o,c,s=Elf(Path(original)),Elf(Path(candidate)),Elf(Path(symbols));fs={f['start']:f for f in s.funcs};out=[]
 for row in rows:
  if row['original_pointer']not in(0x11bf8c,0x11bdb0,0x11c5d6):continue
  a,b=row['original'],row['candidate'];f=fs[b];x=trace(o,a,f['size'],a+row['offset']);y=trace(c,b,f['size'],b+row['offset'])
  if x is None or y is None or not x['pairs']or len(x['pairs'])!=1:continue
  assert x['pairs']==y['pairs']and x['call_offset']==y['call_offset'];g=fs[y['target']]
  assert o.normalized[x['target']:x['target']+g['size']]==c.normalized[y['target']:y['target']+g['size']]and o.pattern(x['target'],g['size'])==c.pattern(y['target'],g['size'])
  length=x['pairs'][0]['length'];assert length in(4,8,32);av=o.b[row['original_pointer']:row['original_pointer']+length];cv=c.b[row['candidate_pointer']:row['candidate_pointer']+length]
  out.append(row|{'bytes':length,'original_hex':av.hex(),'candidate_hex':cv.hex(),'equal':av==cv,'construction':x['pairs'][0],'call_offset':x['call_offset'],'consumer':g})
 return {'resolved':len(out),'rows':out,'scope':'Actual pointer/length byte-slice construction survives to a matched next direct callee. This is an argument-construction extent, not a full original containing-allocation size.'}
if __name__=='__main__':
 raise SystemExit('Use verify.py --root REPOSITORY.')
