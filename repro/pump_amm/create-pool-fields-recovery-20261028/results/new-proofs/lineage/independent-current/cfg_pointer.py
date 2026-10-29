from pathlib import Path
import bisect,collections,json,struct,types
W=Path(__file__).resolve().parent
def reader():
 p=W/'elf_reader.py';m=types.ModuleType('elf');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m.Elf
def pointer_states(e,a,n):
 """Conservative stack-address register propagation over the whole intrafunction CFG.
 Unknown register writes discard information; calls clobber r0-r5. No stack loads
 are assumed to preserve pointers. Joins retain only identical incoming values.
 """
 pcs=[];p=a
 while p<a+n:
  pcs.append(p);p+=16 if e.b[p]==0x18 else 8
 valid=set(pcs);initial=tuple([None]*10+[0]);states={a:initial};todo=collections.deque([a]);iterations=0
 while todo:
  pc=todo.popleft();iterations+=1;assert iterations<100000
  r=list(states[pc]);op,both,off,imm=struct.unpack_from('<BBhi',e.b,pc);d,s=both&15,both>>4;step=16 if op==0x18 else 8
  if op==0x18:r[d]=None
  elif op==0xbf:r[d]=r[s]
  elif op==0x07:r[d]=None if r[d] is None else r[d]+imm
  elif op==0x17:r[d]=None if r[d] is None else r[d]-imm
  elif op in (0x85,0x8d):
   for i in range(6):r[i]=None
  elif op&7 in (1,4,7):r[d]=None
  if op==0x95:succ=[]
  elif op in (0x05,0x06):succ=[pc+8+off*8]
  elif op&7 in (5,6) and op not in (0x85,0x8d):succ=[pc+8,pc+8+off*8]
  else:succ=[pc+step]
  for p in succ:
   if p not in valid:continue
   v=tuple(r)
   if p in states:v=tuple(x if x==y else None for x,y in zip(states[p],v))
   if states.get(p)!=v:states[p]=v;todo.append(p)
 return states
def scan(root,candidate,symbols):
 E=reader();o=E(Path(root)/'evidence/original/pump_amm/deployed.so');c=E(Path(candidate));s=E(Path(symbols));fs=s.funcs;idx=collections.defaultdict(list)
 def key(e,a,n):return(n,e.normalized[a:a+n],json.dumps(e.pattern(a,n),sort_keys=True))
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):idx[key(o,a,z-a)].append(a)
 targets=[]
 for f in fs:
  if 'Event$GT$4data' in f['name']:
   orig=idx[key(c,f['start'],f['size'])];assert len(orig)==1;targets.append((orig[0],f))
 def origowner(pc):a=o.entries[bisect.bisect_right(o.entries,pc)-1];return{'start':a,'size':o.entries[o.entries.index(a)+1]-a}
 def owner(pc):return next(f for f in fs if f['start']<=pc<f['start']+f['size'])
 groups=[]
 for ot,ct in targets:
  oo=collections.defaultdict(list);cc=collections.defaultdict(list)
  for pc,t in o.calls.items():
   if t==ot:oo[origowner(pc)['start']].append(pc)
  for pc,t in c.calls.items():
   if t==ct['start']:cc[owner(pc)['start']].append(pc)
  og=[];cg=[]
  for e,owners,out,which in [(o,oo,og,0),(c,cc,cg,1)]:
   for a,pcs in owners.items():
    f=origowner(pcs[0]) if which==0 else owner(pcs[0]);states=pointer_states(e,a,f['size']);calls=[{'offset':pc-a,'self_stack_offset':states.get(pc,[None]*11)[2]}for pc in pcs];out.append({'function':f,'calls':calls})
  groups.append({'event_data_candidate':ct,'event_data_original':ot,'original_handlers':og,'candidate_handlers':cg})
 return groups
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();a.output.write_text(json.dumps(scan(a.root,a.candidate,a.symbols),indent=2)+'\n')
