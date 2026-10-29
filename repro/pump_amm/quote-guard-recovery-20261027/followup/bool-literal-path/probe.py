from pathlib import Path
import collections,json,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));from elf_reader import Elf

def function_graph(o,c,fs,ot,ct):
 todo=[(ot,ct)];pairs={}
 while todo:
  a,b=todo.pop()
  if(a,b)in pairs:continue
  f=fs[b];n=f['size'];assert o.entries[o.entries.index(a)+1]-a==n
  assert o.normalized[a:a+n]==c.normalized[b:b+n]and o.pattern(a,n)==c.pattern(b,n)
  pairs[a,b]=f
  for pc,t in c.calls.items():
   if b<=pc<b+n:todo.append((o.calls[a+pc-b],t))
 return pairs

def noreturn(e,functions):
 # Least fixed point: a node is safe only when every control path reaches
 # abort or a previously proved non-returning call, before EXIT/fallthrough.
 safe=set();changed=True
 while changed:
  changed=False
  for start,size in functions.items():
   local=set();again=True
   while again:
    again=False
    pcs=[];pc=start
    while pc<start+size:pcs.append(pc);pc+=16 if e.b[pc]==0x18 else 8
    for pc in reversed(pcs):
     op,rr,off,imm=struct.unpack_from('<BBhi',e.b,pc);nextpc=pc+(16 if op==0x18 else 8);ok=False
     if op==0x85:
      rel=e.relocations.get(pc)
      ok=bool(rel and rel.get('symbol')=='abort')or e.calls.get(pc)in safe or nextpc in local
     elif op==0x95:ok=False
     elif op==0x05:ok=pc+8+off*8 in local
     elif op&7 in(5,6):ok=nextpc in local and pc+8+off*8 in local
     else:ok=nextpc in local
     if ok and pc not in local:local.add(pc);again=True
   if start in local and start not in safe:safe.add(start);changed=True
 return safe

def execute(e,start,end,nr,memcpy,correlate=True):
 todo=[(start,{i:('sym',i)for i in range(1,10)}|{10:('stack',0)}, {}, {})];seen=set();copies=[]
 def asint(v):return v[1]if v and v[0]=='int'else None
 while todo:
  pc,regs,mem,known=todo.pop();sig=(pc,tuple(sorted(regs.items())),tuple(sorted(mem.items())),tuple(sorted(known.items(),key=repr)))
  if sig in seen:continue
  seen.add(sig);assert len(seen)<50000
  if not start<=pc<end:continue
  r=dict(regs);m=dict(mem);k=dict(known);op,rr,off,imm=struct.unpack_from('<BBhi',e.b,pc);d,s=rr&15,rr>>4;np=pc+8
  if op==0x18:
   value=struct.unpack_from('<I',e.b,pc+4)[0]|struct.unpack_from('<I',e.b,pc+12)[0]<<32;r[d]=('static',value,pc)if e.relocations.get(pc,{}).get('type')==8 else('int',value);np=pc+16
  elif op==0xbf:r[d]=r.get(s)
  elif op==0xb7:r[d]=('int',imm)
  elif op==0x07:
   x=r.get(d);r[d]=(x[0],x[1]+imm)if x and x[0]in('int','stack')else('expr',pc)
  elif op in(0x0f,0x1f):
   x,y=asint(r.get(d)),asint(r.get(s));r[d]=('int',(x+y if op==0x0f else x-y)&((1<<64)-1))if x is not None and y is not None else('expr',pc)
  elif op==0x57:
   x=asint(r.get(d));r[d]=('int',x&imm)if x is not None else('expr',pc)
  elif op in(0x7b,0x7a):
   base=r.get(d)
   if base and base[0]=='stack':m[base[1]+off]=r.get(s)if op==0x7b else('int',imm)
  elif op in(0x79,0x71,0x69,0x61):
   base=r.get(s);r[d]=m.get(base[1]+off,('load',pc))if base and base[0]=='stack'else('load',pc)
  elif op==0x85:
   target=e.calls.get(pc)
   if target in nr:continue
   assert target==memcpy,('unexpected returning call',pc,target)
   copies.append({'pc':pc,'pointer':r.get(2),'length':r.get(3),'zero_predicates':k});continue
  elif op==0x95:continue
  elif op==0x05:np=pc+8+off*8
  elif op&7 in(5,6):
   target=pc+8+off*8;v=r.get(d);vi=asint(v)
   if op in(0x15,0x55)and imm==0:
    equal=(vi==0)if vi is not None else k.get(v)if v is not None and v[0]=='sym'and correlate else None
    taken=equal if op==0x15 else not equal if equal is not None else None
    if taken is not None:np=target if taken else np
    else:
     yes=dict(k);no=dict(k)
     if v is not None and v[0]=='sym'and correlate:yes[v]=op==0x15;no[v]=op!=0x15
     todo.append((target,r,m,yes));k=no
   else:todo.append((target,r,m,k))
  elif op&7 in(1,4,7):r[d]=('expr',pc)
  todo.append((np,r,m,k))
 return {'states':len(seen),'copies':copies}

def analyze(original,candidate,symbols):
 o,c,s=Elf(Path(original)),Elf(Path(candidate)),Elf(Path(symbols));fs={f['start']:f for f in s.funcs};a=b=3504;f=fs[b];assert f['size']==1368 and 'with_values' in f['name'];assert o.normalized[a:a+1368]==c.normalized[b:b+1368]and o.pattern(a,1368)==c.pattern(b,1368)
 graph=function_graph(o,c,fs,o.calls[a+240],c.calls[b+240]);on=noreturn(o,{x:f['size']for(x,y),f in graph.items()});cn=noreturn(c,{y:f['size']for(x,y),f in graph.items()});assert o.calls[a+240]in on and c.calls[b+240]in cn
 oc,cc=o.calls[a+352],c.calls[b+352];mf=fs[cc];assert mf['name']=='memcpy'and mf['size']==32 and o.normalized[oc:oc+32]==c.normalized[cc:cc+32]and o.pattern(oc,32)==c.pattern(cc,32)
 allout=[]
 for local in[16,360,1000]:
  x=execute(o,a+local,a+1368,on,oc);y=execute(c,b+local,b+1368,cn,cc)
  def normalized(z,base):return sorted([(r['pc']-base,r['pointer'][1]if r['pointer']and r['pointer'][0]=='static'else None,r['length'])for r in z['copies']],key=repr)
  xx=normalized(x,a);yy=normalized(y,b);assert len(xx)==len(yy)
  # Addresses differ; compare values through their attached LDDW and bytes below.
  allout.append((x,y,local))
 rows=json.loads((W/'input.json').read_bytes())['rows'];out=[]
 for row in rows:
  hits=[]
  for x,y,local in allout:
   left=[q for q in x['copies']if q['pointer']==('static',row['original_pointer'],a+row['offset'])];right=[q for q in y['copies']if q['pointer']==('static',row['candidate_pointer'],b+row['offset'])]
   assert sorted((q['pc']-a,q['length'])for q in left)==sorted((q['pc']-b,q['length'])for q in right)
   hits.extend((q,local)for q in left)
  assert hits and all(q['length']==('int',4)for q,_ in hits),(row,hits)
  av,cv=o.b[row['original_pointer']:row['original_pointer']+4],c.b[row['candidate_pointer']:row['candidate_pointer']+4];assert av==cv==b'true'
  out.append(row|{'bytes':4,'original_hex':av.hex(),'candidate_hex':cv.hex(),'copy_offsets':sorted({q['pc']-a for q,_ in hits}),'entry_offsets':sorted({entry for _,entry in hits}),'copy_paths':len(hits)})
 uncorrelated=execute(c,b+16,b+1368,cn,cc,False)
 wrong=[q for q in uncorrelated['copies']if q['pointer']and q['pointer'][0]=='static'and q['pointer'][1]==rows[0]['candidate_pointer']and q['length']==('int',5)]
 assert wrong, 'The negative control must exhibit the false five-byte pairing.'
 assert cc not in cn, 'A returning memcpy must not pass the abort proof.'
 return {'resolved':4,'rows':out,'noreturn_pairs':[{'original':x,'candidate':y,'function':f,'original_noreturn':x in on,'candidate_noreturn':y in cn}for(x,y),f in graph.items()],'entry_state_counts':[{'entry':entry,'original':x['states'],'candidate':y['states']}for x,y,entry in allout],'negative_uncorrelated_five_byte_paths':len(wrong),'negative_returning_memcpy_is_not_noreturn':True,'scope':'Exact boolean zero/nonzero correlations; other branches overapproximated. The only calls before each copy are proved non-returning by a control-flow fixed point ending in abort. Stops at each memcpy, so no memcpy memory side effect is assumed.'}
if __name__=='__main__':
 raise SystemExit('Use verify.py --root REPOSITORY.')
