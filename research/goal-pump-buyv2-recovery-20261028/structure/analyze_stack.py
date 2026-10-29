from pathlib import Path
import re,json
R=Path(__file__).resolve().parents[1];P=R/'structure/passive';s=(P/'raw.log').read_text();a=s.index('# *** IR Dump Before Merge disjoint stack slots');b=s.index('# *** IR Dump After Merge disjoint stack slots');before=s[a:b];after=s[b:];frames={int(i):{'size':int(z),'align':int(align)}for i,z,align in re.findall(r'fi#(\d+): size=(\d+), align=(\d+)',before)}
def defs(t):
 out={}
 for l in t.splitlines():
  m=re.search(r'(%\d+:gpr) = .*?%stack\.(\d+)(?:\.([^ ,]+))?',l)
  if m:out[m[1]]={'id':int(m[2]),'name':m[3],'line':l.strip()}
 return out
x,y=defs(before),defs(after);mapping={};witnesses={}
for k,v in x.items():
 if k in y:
  to=y[k]['id'];mapping.setdefault(v['id'],set()).add(to);witnesses.setdefault(v['id'],[]).append({'vreg':k,'before':v['line'],'after':y[k]['line']})
groups={}
for i,targets in mapping.items():
 if len(targets)==1:groups.setdefault(next(iter(targets)),[]).append(i)
lines=before.splitlines();block='';lives={}
for n,l in enumerate(lines):
 bm=re.search(r'bb\.(\d+)\.([^:]*):',l)
 if bm:block='bb.'+bm[1]+'.'+bm[2]
 lm=re.search(r'(\d+)B\s+LIFETIME_(START|END) %stack\.(\d+)(?:\.([^ ,]+))?',l)
 if lm:lives.setdefault(int(lm[3]),[]).append({'slot_index':int(lm[1]),'kind':lm[2],'name':lm[4],'block':block,'log_line':s[:a].count('\n')+n+1})
report={'limits':'Compiler passive dump; slot indices describe machine instruction ordering, not wall time or dynamic liveness. Original source/IR lifetimes remain unknown.','qualified_allocated_sections_equal_best':True,'machine_frame_objects_before':frames,'merge_groups':{str(k):v for k,v in groups.items()},'selected_group_9':{str(i):{'frame':frames[i],'lifetime_markers':lives.get(i,[]),'mapping_witness':witnesses[i][0]}for i in groups[9]},'ambiguous_mappings':{str(i):list(v)for i,v in mapping.items()if len(v)!=1}}
(P/'stack-coloring-analysis.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report['selected_group_9'],indent=2))
