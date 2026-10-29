#!/usr/bin/env python3
"""Recount phase3 artifacts and retain complete positive/failed graph mappings."""
from pathlib import Path
import collections,hashlib,importlib.util,json,re,sys
R=Path(__file__).resolve().parent;P=R.parent;REPO=P.parents[1]
if not __debug__:raise RuntimeError('Pinned graph tools require assertions; do not use -O')
sys.path.insert(0,str(R/'tools'))
import measure,cfg_attribution as cfg,audit
ORIGINAL=REPO/'evidence/original/pump_amm/deployed.so'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def machine(path):
 t=path.read_text(errors='replace');marks=list(re.finditer(r'^# \*\*\* IR Dump (Before|After) Branch Probability Basic Block Placement \(block-placement\) \*\*\*:',t,re.M));out=[]
 for i,mark in enumerate(marks):
  raw=t[mark.end():marks[i+1].start() if i+1<len(marks) else len(t)];heads=list(re.finditer(r'^bb\.(\d+) \(%ir-block\.(\d+)\):',raw,re.M));nodes=[]
  for j,h in enumerate(heads):
   block=raw[h.end():heads[j+1].start() if j+1<len(heads) else len(raw)];p=re.search(r'^; predecessors: (.+)',block,re.M);s=re.search(r'^  successors: (.+)',block,re.M)
   ins=[x.strip()for x in block.splitlines()if re.match(r'  (\$|JMP|JNE|JEQ|EXIT|JAL|ST|LD|MOV|ADD|SUB|AND|OR|XOR|J[A-Z])',x)]
   nodes.append({'machine_id':int(h.group(1)),'ir_id':int(h.group(2)),'predecessors':p.group(1)if p else None,'successors':s.group(1)if s else None,'instructions':ins})
  pure=[n for n in nodes if len(n['instructions'])==2 and re.match(r'^\$r6 = LDD_V1 \$r10, -\d+$',n['instructions'][0]) and n['instructions'][1].startswith('JMP')]
  out.append({'stage':mark.group(1),'blocks_data':nodes,'pure_reload_stubs_any_offset':pure})
 return out

def run():
 assert sha(ORIGINAL)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 before=measure.measure(ORIGINAL,P/'baseline.so');base={x['original']for x in before if x['match']};assert len(base)==779
 original=cfg.Inventory(ORIGINAL,True);og=original.graph(0x4c750,True)
 ocalls=original.function(0x4c750)['calls'];call_tags=collections.Counter(json.dumps(original.tag(x['target'],2),sort_keys=True)for x in ocalls)
 results=[]
 for log in sorted(R.glob('*/compiler.log')):
  root=log.parent;path=root/'symbols.so';rec={'name':root.name,'kind':'compiler-diagnostic' if root.name=='no-placement-fold' else 'source-control','build_ok':path.is_file(),'source_sha256':sha(root/'sell.rs'),'compiler_log_sha256':sha(log)}
  if not path.is_file():
   assert 'error[E0271]' in log.read_text();rec['error']='E0271';results.append(rec);continue
  rows=measure.measure(ORIGINAL,path);old=json.loads((root/'rows.json').read_text())if(root/'rows.json').exists()else rows;assert rows==old
  (root/'rows.json').write_text(json.dumps(rows,indent=2)+'\n');now={x['original']for x in rows if x['match']}
  cand=cfg.Inventory(path);f=next(f for f in cand.functions.values()if '4sell8cashback' in f['name']and f['size']>500);cg=cand.graph(f['start'],True);v=audit.compare_graphs(og,cg,cfg)
  ccalls=cand.function(f['start'])['calls'];ctags=collections.Counter(json.dumps(cand.tag(x['target'],2),sort_keys=True)for x in ccalls)
  binding=None;binding_error=None
  try:binding=audit.incoming_binding(original,cand,f['start'])
  except Exception as e:binding_error=str(e)
  graph={'original':og,'candidate':cg,'comparison':v,'incoming_binding':binding,'incoming_binding_error':binding_error,'actual_callee_multiset_equal_through_depth2':ctags==call_tags}
  (root/'graph-analysis.json').write_text(json.dumps(graph,indent=2)+'\n')
  snapshots=machine(log);(root/'placement-analysis.json').write_text(json.dumps(snapshots,indent=2)+'\n')
  rec.update(sha256=sha(path),normalized=len(now),raw=sum(x['raw']for x in rows),gains=sorted(now-base),losses=sorted(base-now),sell_matched='0x4c750'in now,sell_bytes=f['size'],canonical_nodes=len(cg['nodes']),graph_verified=v['topology']['verified'],register_differences=v.get('register_different_slots'),nonbranch_values_equal=v.get('instruction_and_relocation_equal'),actual_calls=len(ccalls),actual_callee_multiset_equal_through_depth2=ctags==call_tags,caller_bound=binding is not None,topology_failure=None if v['topology']['verified']else v['topology'])
  results.append(rec)
 for row in results:
  if row['build_ok']:
   assert not row['gains'] and not row['sell_matched']
   if row['kind']=='source-control':assert row['normalized']==779 and not row['losses']
 (R/'summary.json').write_text(json.dumps({'attempts':len(results),'successful_builds':sum(x['build_ok']for x in results),'new_windows':0,'maintained_source_changed':False,'results':results},indent=2)+'\n')
 print(json.dumps([{k:r[k]for k in ['name','build_ok','normalized','raw','sell_bytes','canonical_nodes','graph_verified','register_differences','actual_calls']if k in r}for r in results],indent=2))
if __name__=='__main__':run()
