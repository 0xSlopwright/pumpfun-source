"""Bound returned slices using an overapproximation of local scalar CFG paths."""
from pathlib import Path
import collections,json,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));from elf_reader import Elf

def key(base,off):
 if base and base[0]in('arg','stack'):return(base[0],base[1],base[2]+off)
 return None

def execute(e,start,size):
 todo=[(start,{i:('arg',i,0)for i in range(1,10)}|{10:('stack',10,0)}, {})];seen=set();outputs=[]
 while todo:
  pc,r,m=todo.pop()
  sig=(pc,tuple(sorted(r.items())),tuple(sorted(m.items())))
  if sig in seen:continue
  seen.add(sig);assert len(seen)<20000,'CFG bound exhausted'
  if not start<=pc<start+size:continue
  r=dict(r);m=dict(m);op,rr,off,imm=struct.unpack_from('<BBhi',e.b,pc);d,s=rr&15,rr>>4;nextpc=pc+8
  if op==0x18:
   v=struct.unpack_from('<I',e.b,pc+4)[0]|struct.unpack_from('<I',e.b,pc+12)[0]<<32;r[d]=('static',v,pc)if e.relocations.get(pc,{}).get('type')==8 else('int',v);nextpc=pc+16
  elif op==0xbf:r[d]=r.get(s)
  elif op==0xb7:r[d]=('int',imm)
  elif op==0x07:
   v=r.get(d)
   if v and v[0]=='int':r[d]=('int',v[1]+imm)
   elif v and v[0]in('arg','stack'):r[d]=(v[0],v[1],v[2]+imm)
   else:r[d]=None
  elif op==0x57:
   v=r.get(d);r[d]=('int',v[1]&imm)if v and v[0]=='int'else None
  elif op==0x7b:
   k=key(r.get(d),off)
   if k is not None:m[k]=r.get(s)
  elif op==0x7a:
   k=key(r.get(d),off)
   if k is not None:m[k]=('int',imm)
  elif op==0x79:r[d]=m.get(key(r.get(s),off))
  elif op==0x05:nextpc=pc+8+off*8
  elif op==0x95:
   outputs.append({'kind':'return','pc':pc,'pointer':m.get(('arg',1,0)),'length':m.get(('arg',1,8))});continue
  elif op==0x85:
   outputs.append({'kind':'call','pc':pc,'target':e.calls.get(pc),'pointer':r.get(2),'length':r.get(3)});continue
  elif op==0x8d:
   outputs.append({'kind':'indirect-call','pc':pc,'pointer':r.get(2),'length':r.get(3)});continue
  elif op&7 in(5,6):
   todo.append((pc+8+off*8,r,m))
  elif op&7 in(1,4,7):r[d]=None
  todo.append((nextpc,r,m))
 return {'states':len(seen),'outputs':outputs}

def analyze(original,candidate,symbols,rows):
 o,c,s=Elf(Path(original)),Elf(Path(candidate)),Elf(Path(symbols));fs={f['start']:f for f in s.funcs};out=[];cache={};skipped=[]
 for row in rows:
  f=fs[row['candidate']]
  if not('ErrorKind6as_str17h'in f['name']or'ErrorKind$u20$as$u20$core..fmt..Debug'in f['name']):skipped.append(row);continue
  a,b=row['original'],row['candidate'];n=f['size'];assert o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n)
  if(a,b)not in cache:cache[a,b]=(execute(o,a,n),execute(c,b,n))
  ao,co=cache[a,b];left=[x for x in ao['outputs']if x['pointer']==('static',row['original_pointer'],a+row['offset'])];right=[x for x in co['outputs']if x['pointer']==('static',row['candidate_pointer'],b+row['offset'])]
  ls={(x['kind'],x['pc']-a,x['length'])for x in left};rs={(x['kind'],x['pc']-b,x['length'])for x in right};assert ls==rs
  lengths={x['length'][1]for x in left if x['length']and x['length'][0]=='int'}
  if len(lengths)!=1 or len(left)!=sum(bool(x['length']and x['length'][0]=='int')for x in left):skipped.append(row);continue
  length=next(iter(lengths));assert 0<length<1024;av=o.b[row['original_pointer']:row['original_pointer']+length];cv=c.b[row['candidate_pointer']:row['candidate_pointer']+length]
  consumers=[]
  for x in left:
   if x['kind']=='call':
    offset=x['pc']-a;ot=o.calls[a+offset];ct=c.calls[b+offset];g=fs[ct]
    assert 'fmt..Write$GT$9write_str' in g['name']
    assert o.normalized[ot:ot+g['size']]==c.normalized[ct:ct+g['size']]and o.pattern(ot,g['size'])==c.pattern(ct,g['size'])
    consumers.append(g)
  out.append(row|{'bytes':length,'original_hex':av.hex(),'candidate_hex':cv.hex(),'equal':av==cv,'output_kind':left[0]['kind'],'output_offsets':sorted({x['pc']-a for x in left}),'unconstrained_cfg_states':ao['states'],'consumers':consumers})
 return {'resolved':len(out),'remaining':len(skipped),'rows':out,'remaining_rows':skipped,'scope':'Unconstrained conditional branches overapproximate local CFG paths; only unique constant slice lengths associated with the exact LDDW reference are accepted. Return slices are logical extents, not evidence that all bytes were read by a subsequent caller.'}
if __name__=='__main__':
 raise SystemExit('Use verify.py --root REPOSITORY.')
