#!/usr/bin/env python3
from pathlib import Path
import gzip,json,sys,importlib.util
R=Path(__file__).resolve().parent;REPO=R.parents[1];spec=importlib.util.spec_from_file_location('structure',REPO/'research/goal-pump-swap-final-20261028/structure.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
inputs=json.loads((R/'INPUTS.json').read_text());o=m.Inventory(m.H.parent/'base/original.so',True);c=m.Inventory(R/'probes/matched-business-seed-gates/unstripped.so');cf=next(f for f in c.functions.values()if m.win.demangle(f['name'])=='pump_recovered::multi_hop_curve::swap_hop');raw=json.loads(gzip.decompress((R/'probes/matched-business-seed-gates/graph.json.gz').read_bytes()));out=[]
for side,inv,start,g in [('original',o,0x5b3b0,raw['original']),('recovery',c,cf['start'],raw['candidate'])]:
 ns={n['offset']:n for n in g['nodes']};allnodes=set(ns);pred={n:set()for n in ns}
 for n in ns.values():
  for _,to in n['edges']:pred[to].add(n['offset'])
 dom={n:({'0x0'}if n=='0x0'else set(allnodes))for n in ns};changed=True
 while changed:
  changed=False
  for n in ns:
   if n=='0x0':continue
   value={n}|set.intersection(*(dom[p]for p in pred[n]))
   if value!=dom[n]:dom[n]=value;changed=True
 def reaches(a,b):
  todo=[a];seen=set()
  while todo:
   q=todo.pop()
   if q==b:return True
   if q in seen:continue
   seen.add(q);todo.extend(x for _,x in ns[q]['edges'])
  return False
 dis=m.win.objdump_text(inv.path,start,start+inv.functions[start]['size']);records=[]
 for target,label in[(0x93050,'base_out'),(0x8eda0,'quote_out'),(0x940c0,'buyback_out')]:
  identity=o.describe_callee(target,2)['identity_sha256'];node=next(n for n in ns.values()if any(q['actual_direct_callee']and q['actual_direct_callee']['identity_sha256']==identity for q in n['code']));gates=[]
  for key in sorted(dom[node['offset']],key=lambda x:len(dom[x]),reverse=True):
   q=ns[key]
   if q['term']['kind']!='conditional':continue
   paths=[reaches(to,node['offset'])for _,to in q['edges']]
   if sum(paths)!=1:continue
   vals=[{'offset':x['offset'],'instruction':dis[start+int(x['offset'],16)]}for x in q['code'][-4:]]
   term=q['machine_terminators'][-1];gates.append({'node':key,'branch_offset':term['offset'],'instruction':dis[start+int(term['offset'],16)],'path_to_call':q['edges'][paths.index(True)][0],'last_values':vals})
  records.append({'helper':label,'call_node':node['offset'],'nearest_gates':gates[:7]})
 out.append({'side':side,'calls':records})
(R/'OUTPUT-GATE-PATHS.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
