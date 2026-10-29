from pathlib import Path
import collections,hashlib,importlib.util,json,struct,sys
ROOT=Path(sys.argv[4]).resolve()if len(sys.argv)>4 else Path(__file__).resolve().parents[3];p=ROOT/'repro/pump_amm/canonical-frontier-20261028/tools/elf_reader.py';spec=importlib.util.spec_from_file_location('elf',p);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
original=m.Elf(ROOT/'evidence/original/pump/deployed.so');candidate=m.Elf(Path(sys.argv[1]));start=int(sys.argv[2],16);end=next(x for x in original.entries+[original.hi]if x>start);function=next(f for f in candidate.funcs if sys.argv[3]in f['name'])
def graph(e,a,z):
 boundaries={a};jumps={}
 for at in range(a,z,8):
  op=e.b[at];kind=op&7
  if kind not in [5,6]or op in [0x85,0x95]:continue
  target=at+8+struct.unpack_from('<h',e.b,at+2)[0]*8
  if not a<=target<z:raise ValueError('jump leaves selected body')
  jumps[at]=(target,op==5);boundaries.add(target)
  if at+8<z:boundaries.add(at+8)
 boundaries=sorted(boundaries);nodes={}
 for i,b in enumerate(boundaries):
  stop=boundaries[i+1]if i+1<len(boundaries)else z;last=stop-8;term=None;out=[]
  if last in jumps:
   target,uncond=jumps[last];body=e.normalized[b:last];out=[target]if uncond else[target,stop]
   if not uncond:
    term=bytearray(e.normalized[last:stop]);term[2:4]=b'\0\0';op=term[0]&0xf0;inverse={0x50:0x10,0xb0:0x20,0xa0:0x30,0xd0:0x60,0xc0:0x70}
    if op in inverse:term[0]=inverse[op]|(term[0]&0xf);out.reverse()
    term=bytes(term)
  else:
   body=e.normalized[b:stop];out=[]if e.b[last]==0x95 else[stop]
  nodes[b]={'body':body,'term':term,'out':out,'ats':list(range(b,last if last in jumps else stop,8))}
 def resolve(b):
  seen=set()
  while b in nodes and not nodes[b]['body']and nodes[b]['term']is None and len(nodes[b]['out'])==1:
   if b in seen:break
   seen.add(b);b=nodes[b]['out'][0]
  return b
 for v in nodes.values():v['out']=[resolve(t)for t in v['out']]
 entry=resolve(a);nodes={b:v for b,v in nodes.items()if resolve(b)==b}
 # Fold a single-successor block into its uniquely reached successor.
 change=True
 while change:
  change=False;pred=collections.Counter(t for v in nodes.values()for t in v['out'])
  for b,v in list(nodes.items()):
   if v['term']is not None or len(v['out'])!=1:continue
   t=v['out'][0]
   if t==b or t==entry or t not in nodes or pred[t]!=1:continue
   u=nodes.pop(t);v['body']+=u['body'];v['ats']+=u['ats'];v['term']=u['term'];v['out']=u['out'];change=True;break
 return entry,nodes
A,ga=graph(original,start,end);B,gb=graph(candidate,function['start'],function['start']+function['size']);todo=[(A,B)];mapping={};errors=[]
while todo:
 a,b=todo.pop()
 if a in mapping:
  if mapping[a]!=b:errors.append({'kind':'edge mapping conflict','original':hex(a),'candidate':hex(b)})
  continue
 mapping[a]=b;x,y=ga[a],gb[b]
 if x['body']!=y['body']or x['term']!=y['term']:
  errors.append({'kind':'block instructions differ','original':hex(a),'candidate':hex(b),'original_bytes':len(x['body']),'candidate_bytes':len(y['body']),'original_term':x['term'].hex()if x['term']else None,'candidate_term':y['term'].hex()if y['term']else None});continue
 if len(x['out'])!=len(y['out']):errors.append({'kind':'successor count differs','original':hex(a),'candidate':hex(b)});continue
 todo.extend(zip(x['out'],y['out']))
call_results=[]
for a,b in mapping.items():
 x,y=ga[a],gb[b]
 if x['body']!=y['body'] or len(x['ats'])!=len(y['ats']):continue
 for oa,ca in zip(x['ats'],y['ats']):
  if oa not in original.calls:continue
  ot=original.calls[oa];ct=candidate.calls.get(ca);oe=next((v for v in original.entries+[original.hi]if v>ot),None);fs=[f for f in candidate.funcs if f['start']==ct]
  matches=[f for f in fs if f['size']==oe-ot and candidate.normalized[ct:ct+f['size']]==original.normalized[ot:oe]and candidate.pattern(ct,f['size'])==original.pattern(ot,oe-ot)]if ct is not None and oe is not None else[]
  call_results.append({'original_site':hex(oa),'candidate_site':hex(ca),'original_target':hex(ot),'candidate_target':hex(ct)if ct is not None else None,'complete_normalized_body_equal':bool(matches),'candidate_names':[f['name']for f in matches]})
print(json.dumps({'all_actual_direct_calls':call_results,'direct_calls_checked':len(call_results),'direct_callee_body_mismatches':[r for r in call_results if not r['complete_normalized_body_equal']],'original_start':hex(start),'candidate_name':function['name'],'original_blocks':len(ga),'candidate_blocks':len(gb),'mapped_blocks':len(mapping),'differences':errors,'scope':'Analysis only: branch polarity and empty jump blocks canonicalized to locate compiler CFG residuals. This does not modify the reconstruction matching rules or claim byte equality.'},indent=2))
