from pathlib import Path
import hashlib,json,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));sys.dont_write_bytecode=True
from elf_reader import Elf
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def graph(code):
 nodes=set();edges={};i=0
 while i<len(code):
  op,rs,off,imm=struct.unpack_from('<BBhi',code,i);nodes.add(i)
  if op==0x95:nexts=[]
  elif op==0x05:nexts=[i+8+off*8]
  elif op&7 in(5,6)and op!=0x85:nexts=[i+8,i+8+off*8]
  else:nexts=[i+(16 if op==0x18 else 8)]
  edges[i]=nexts;i+=16 if op==0x18 else 8
 assert all(n in nodes for out in edges.values()for n in out)
 preds={n:{v for v,out in edges.items()if n in out}for n in nodes};dom={n:({0}if n==0 else set(nodes))for n in nodes}
 while True:
  new={n:({0}if n==0 else {n}|set.intersection(*(dom[x]for x in preds[n])))for n in nodes}
  if new==dom:break
  dom=new
 return nodes,edges,dom
def summarize(e,s,start,size):
 code=e.b[start:start+size];nodes,edges,dom=graph(code);length=[]
 for at in sorted(nodes):
  op,rs,off,imm=struct.unpack_from('<BBhi',code,at)
  if op==0x25 and imm==2511:length.append(at)
 assert len(length)==1;guard=length[0];calls=e.callsites(start,size)
 assert len(calls)==13
 cmp=[x for x in calls if s and next((f['name']for f in s.funcs if f['start']==x['target']),None)=='memcmp']if s else [x for x in calls if x['target']==0x1198e0]
 assert len(cmp)==4;canonical=cmp[0]['offset'];witness=[]
 for q in calls:
  a=q['target'];f=next((f for f in s.funcs if f['start']==a),None)if s else None
  if f:n=f['size'];name=f['name']
  else:n=e.entries[e.entries.index(a)+1]-a;name=None
  witness.append({'offset':q['offset'],'target':hex(a),'name':name,'bytes':n,'raw_sha256':hashlib.sha256(e.b[a:a+n]).hexdigest(),'normalized_sha256':hashlib.sha256(e.normalized[a:a+n]).hexdigest(),'relocation_pattern':e.pattern(a,n)})
 paths=[]
 # Short-config path has only one successor after taking the guard's false edge.
 for edge in edges[guard]:
  todo=[edge];seen=set()
  while todo:
   x=todo.pop()
   if x in seen:continue
   seen.add(x);todo+=edges[x]
  paths.append({'edge_offset':edge,'canonical_memcmp_reachable':canonical in seen})
 return {'start':hex(start),'bytes':size,'instructions':len(nodes),'length_guard_offset':guard,
  'guard_instruction':code[guard:guard+8].hex(),'canonical_compare_offset':canonical,
  'canonical_dominates_guard':canonical in dom[guard],
  'guard_dominates_canonical':guard in dom[canonical],
  'guard_successor_reachability':paths,'direct_calls':witness,
  'canonical_dom_offsets':sorted(dom[canonical]),'length_guard_dom_offsets':sorted(dom[guard])}
def analyze():
 o=Elf(W/'original.so');c=Elf(W/'candidate.so');s=Elf(W/'symbols.so')
 assert h(W/'candidate.so')=='e33e6aace7d53008b3300364c07540f0cd7d1764196cd601554b08838b06e615'
 f=next(f for f in s.funcs if 'fees19select_and_apply_v2' in f['name'])
 a=summarize(o,None,0x14088,1656);b=summarize(c,s,f['start'],f['size'])
 assert a['canonical_dominates_guard']and not a['guard_dominates_canonical']
 assert b['guard_dominates_canonical']and not b['canonical_dominates_guard']
 assert a['canonical_compare_offset']==416 and a['length_guard_offset']==424
 assert b['canonical_compare_offset']==400 and b['length_guard_offset']==352
 assert not any(p['canonical_memcmp_reachable']for p in a['guard_successor_reachability'])
 assert [p['canonical_memcmp_reachable']for p in b['guard_successor_reachability']]==[False,True]
 return {'passed':True,'candidate_sha256':h(W/'candidate.so'),'original':a,'candidate':b,
  'conclusion':'The original executes canonical memcmp before the config length guard; current executes it only on the sufficient-length branch. This is a control-flow/scheduling witness, not a semantic failure on valid account storage or a source recovery proposal.',
  'source_hypothesis_qualified':False,'build_executed':False}
if __name__=='__main__':print(json.dumps(analyze(),indent=2))
