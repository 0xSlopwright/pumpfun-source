#!/usr/bin/env python3
"""Trace finite body-pair dependencies to exact unmatched target-pair leaves."""
from pathlib import Path
import collections,hashlib,json,struct,sys,types
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent
sys.path.insert(0,str(W))
from elf_reader import Elf
from source_fields import source_fields
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
load=lambda p:json.loads(Path(p).read_bytes())

def module(name,path,**values):
 m=types.ModuleType(name);m.__file__=str(path);m.__dict__.update(values)
 exec(compile(Path(path).read_bytes(),str(path),'exec'),m.__dict__);return m

def union_closure(pairs):
 leaves={k:{(e['original_target'],e['candidate_target'])for e in p['edges']if(e['original_target'],e['candidate_target'])not in pairs}for k,p in pairs.items()}
 rounds=0
 while True:
  after={k:set().union(leaves[k],*(leaves.get((e['original_target'],e['candidate_target']),set())for e in p['edges']))for k,p in pairs.items()}
  if after==leaves:return leaves,rounds
  leaves=after;rounds+=1

def direct_fixed_point(pairs, supplied=frozenset()):
 active=set(pairs)
 while True:
  accepted=active|supplied
  bad={k for k in active if any((e['original_target'],e['candidate_target'])not in accepted for e in pairs[k]['edges'])}
  if not bad:return active
  active-=bad

def minimal(sets):
 unique={frozenset(s)for s in sets}
 return sorted((x for x in unique if not any(y<x for y in unique)),key=lambda x:(len(x),sorted(x)))

def run(w=W,write=False):
 w=Path(w);o=Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=Elf(w/'artifacts/candidate.so');s=Elf(w/'artifacts/unstripped.so')
 m=load(w/'worker-records/measurement-full.json');cl=load(w/'call-closure.json');ds=load(w/'descriptors.json');bounded=load(w/'bounded-static.json');origins=load(w/'origins.json');previous=load(w/'remaining-audit.json')
 assert sha(w/'artifacts/candidate.so')==m['candidate_sha256']==cl['candidate_sha256']==bounded['candidate_sha256']=='c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544'
 assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 lineage=load(w/'input-lineage.json')
 for name,digest in lineage['files'].items():assert sha(w/name)==digest,name
 # Regenerate every body-pair/edge and recognized descriptor from actual ELF
 # data, then require exact agreement with the sealed independent checkpoint.
 spec={'ROOT':w/'input-root'}
 assert module('call_audit',w/'closure-tools/audit.py',**spec).analyze(w/'artifacts/candidate.so',w/'artifacts/unstripped.so',w/'worker-records/measurement-full.json')==cl
 actual_ds=module('desc_audit',w/'closure-tools/descriptors.py',**spec).analyze(w/'artifacts/candidate.so',w/'artifacts/unstripped.so',cl)
 assert actual_ds==ds
 t=module('target_audit',w/'closure-tools/targets.py',**spec)
 assert t.analyze(w/'artifacts/candidate.so',w/'artifacts/unstripped.so',cl,ds,False)==bounded
 assert t.analyze(w/'artifacts/candidate.so',w/'artifacts/unstripped.so',cl,ds,True)==origins
 pairs={(p['original'],p['candidate']):p for p in cl['pairs']}
 direct=direct_fixed_point(pairs);assert direct=={k for k,p in pairs.items()if p['in_internal_direct_closure']}
 bactive=set(map(tuple,bounded['remaining_pairs']));matched={k[0]for k in pairs};closed={k[0]for k in bactive};blocked=matched-closed
 assert len(matched)==656 and len(closed)==592 and len(blocked)==64
 assert blocked==matched-{a for a,b in direct},'Some window is blocked only by recognized data; classify separately'
 leafsets,rounds=union_closure(pairs)
 assert {k for k,v in leafsets.items()if not v}==direct
 rootpairs={k:p for k,p in pairs.items()if k[0]in blocked}
 relevant=set().union(*(leafsets[k]for k in rootpairs))
 names=collections.defaultdict(list);functions=collections.defaultdict(list)
 for f in s.funcs:names[f['start']].append(f['name']);functions[f['start']].append(f)
 windows={r['start']:r for r in m['rows']};entities={int(r['original_start'],16):r for r in previous['rows']}
 observations=collections.defaultdict(list)
 for row in ds['observations']:observations[row['original'],row['candidate']].append(row)
 def keystr(k):return hex(k[0])+'->'+hex(k[1])
 def code_ref(k,edge):
  off=edge['offset'];op=k[0]+off;cp=k[1]+off;assert o.calls[op]==edge['original_target']and c.calls[cp]==edge['candidate_target']
  return {'parent_pair':keystr(k),'offset':off,'original_callsite':hex(op),'candidate_callsite':hex(cp),'original_instruction':o.b[op:op+8].hex(),'candidate_instruction':c.b[cp:cp+8].hex(),'original_target':hex(edge['original_target']),'candidate_target':hex(edge['candidate_target']),'candidate_target_names':names[edge['candidate_target']],'target_pair_has_body_match':(edge['original_target'],edge['candidate_target'])in pairs}
 # Terminal classifications inspect only the concrete actual target. Alternative
 # names are retained but never substituted into a call edge.
 leafrecords={}
 for k in sorted(relevant):
  a,b=k;row=windows.get(a);n=row['end']-a if row else None;fs=functions[b]
  same=[f for f in fs if f['size']==n];diffs=[];pat=False;typed=[];source_only=False
  if same:
   pat=o.pattern(a,n)==c.pattern(b,n)
   diffs=[i for i in range(0,n,8)if o.normalized[a+i:a+i+8]!=c.normalized[b+i:b+i+8]]
   of={f['line_store']-a:f for f in source_fields(o,a,n)};cf={f['line_store']-b:f for f in source_fields(c,b,n)}
   for off in sorted(set(of)&set(cf)):
    x,y=of[off],cf[off]
    typed.append({'offset':off,'original':x,'candidate':y,'same_filename':x['filename']==y['filename'],'same_line':x['line']==y['line']})
   # No arbitrary byte masking: only the immediate of a decoded Source line
   # store may differ; every other byte, extent and relocation must agree.
   source_only=pat and bool(diffs) and all(i in of and i in cf and of[i]['filename']==cf[i]['filename'] and o.normalized[a+i:a+i+4]==c.normalized[b+i:b+i+4]for i in diffs)
  semantic=entities.get(a,{}).get('current_identity')
  entity=semantic['best_source_entity']if semantic else '; '.join(names[b])
  refs=[]
  for parent,p in pairs.items():
   for e in p['edges']:
    if(e['original_target'],e['candidate_target'])==k:refs.append(code_ref(parent,e))
  leafrecords[k]={'id':keystr(k),'original_target':hex(a),'original_bytes':n,'candidate_target':hex(b),'candidate_functions':fs,'candidate_names':names[b],'best_source_entity':entity,'prior_identity':semantic,'original_target_has_some_body_match':bool(row and row['matches']),'classification':'typed_source_line_only'if source_only else('actual_alias_pair_mismatch'if row and row['matches']else'body_or_boundary_gap'),'same_extent_candidate':bool(same),'same_relocation_pattern':pat,'differing_instruction_offsets':diffs if len(diffs)<=20 else[],'differing_instruction_count':len(diffs)if same else None,'typed_source_fields':typed,'direct_terminal_references':refs}
 # A shortest fully concrete path to each unmatched pair keeps terminal causes
 # distinguishable from transitive dependants and handles cycles explicitly.
 def paths(root):
  queue=collections.deque([(root,[])]);seen={root};out={}
  while queue:
   k,path=queue.popleft()
   for e in pairs[k]['edges']:
    dest=e['original_target'],e['candidate_target'];walk=path+[code_ref(k,e)]
    if dest not in pairs:
     out.setdefault(dest,walk)
    elif dest not in seen:seen.add(dest);queue.append((dest,walk))
  assert set(out)==leafsets[root]
  return out
 roots=[]
 for a in sorted(blocked):
  alternatives=[]
  for k,p in sorted(rootpairs.items()):
   if k[0]!=a:continue
   observations_here=observations[k];recognized={x['offset']for x in observations_here}
   indirect=[{'offset':i,'original_instruction':o.b[a+i:a+i+8].hex(),'candidate_instruction':c.b[k[1]+i:k[1]+i+8].hex(),'status':'register-target instruction; not generally resolved by this bounded model'}for i in p['indirect_call_offsets']]
   unknown_data=[{'offset':i,'original_instruction':o.b[a+i:a+i+16].hex(),'candidate_instruction':c.b[k[1]+i:k[1]+i+16].hex(),'status':'relocation not classified as recognized text/vtable/code-pointer descriptor'}for i in p['relocated_data_offsets']if i not in recognized]
   walked=paths(k)
   alternatives.append({'pair':keystr(k),'candidate_names':p['candidate_names'],'required_terminal_pair_ids':sorted(map(keystr,leafsets[k])),'terminal_paths':[{'terminal_pair':keystr(t),'path':walked[t]}for t in sorted(walked)],'direct_calls':[code_ref(k,e)for e in p['edges']],'recognized_data_observations':observations_here,'unclassified_relocations':unknown_data,'external_calls':p['external_calls'],'indirect_instructions':indirect,'direct_closed':False})
  cuts=minimal(leafsets[k]for k in rootpairs if k[0]==a)
  origcuts=minimal({t[0]for t in leafsets[k]}for k in rootpairs if k[0]==a)
  roots.append({'original_start':hex(a),'bytes':windows[a]['end']-a,'alternatives':alternatives,'minimal_pair_cut_sets':[sorted(map(keystr,v))for v in cuts],'minimal_original_target_groups':[[hex(t)for t in sorted(v)]for v in origcuts],'semantics':'Every member of one alternative cut set must first be established as a closed actual target pair. Original-target groups merge aliases for prioritization only.'})
 # Conditional ranking is a static experiment: accept selected missing pair
 # leaves as already closed, recompute the exact greatest fixed point, and
 # count newly closed distinct originals. It is not a repair or proof.
 def coverage(supplied):
  hypothetical=direct_fixed_point(pairs,set(supplied));now={a for a,b in hypothetical}-closed
  assert now<=blocked
  return sorted(now)
 ranking=[]
 for k,rec in leafrecords.items():
  touched=sorted({a for a,b in rootpairs if k in leafsets[a,b]});new=coverage([k])
  ranking.append({'terminal_pair':rec['id'],'classification':rec['classification'],'entity':rec['best_source_entity'],'affected_original_windows':[hex(x)for x in touched],'affected_count':len(touched),'conditional_single_pair_closure_originals':[hex(x)for x in new],'conditional_single_pair_closure_count':len(new)})
 ranking.sort(key=lambda x:(-x['conditional_single_pair_closure_count'],-x['affected_count'],x['terminal_pair']))
 groups=[]
 for a in sorted({k[0]for k in relevant}):
  ks={k for k in relevant if k[0]==a};touched=sorted({p for p,q in rootpairs if any(k in leafsets[p,q]for k in ks)});new=coverage(ks)
  groups.append({'original_target':hex(a),'terminal_pairs':sorted(map(keystr,ks)),'classifications':sorted({leafrecords[k]['classification']for k in ks}),'entities':sorted({leafrecords[k]['best_source_entity']for k in ks}),'affected_original_windows':[hex(x)for x in touched],'affected_count':len(touched),'conditional_all_aliases_closed_originals':[hex(x)for x in new],'conditional_all_aliases_closed_count':len(new)})
 groups.sort(key=lambda x:(-x['conditional_all_aliases_closed_count'],-x['affected_count'],x['original_target']))
 no_coord=[x for x in ranking if x['classification']!='typed_source_line_only']
 summary={'candidate_sha256':cl['candidate_sha256'],'normalized_original_windows':656,'bounded_closed_original_windows':592,'blocked_original_windows':len(blocked),'blocked_body_pairs':len(rootpairs),'all_64_already_fail_direct_closure':True,'additional_original_windows_blocked_only_by_recognized_data':0,'source_coordinate_closed_original_windows':585,'leaf_propagation_rounds':rounds,'distinct_relevant_terminal_pairs':len(relevant),'distinct_relevant_original_targets':len({k[0]for k in relevant}),'typed_source_line_only_terminal_pairs':sum(v['classification']=='typed_source_line_only'for v in leafrecords.values()),'ranking_is_conditional_not_proof':True,'first_non_coordinate_rank':no_coord[0]if no_coord else None,'external_and_unresolved_indirect_boundaries_are_not_closed_by_this_model':True}
 out={'summary':summary,'roots':roots,'terminal_targets':[leafrecords[k]for k in sorted(leafrecords)],'pair_ranking':ranking,'original_target_group_ranking':groups,'scope':__doc__+' The 64-window cut is a direct-call cut; data and indirect references are retained as separate limits. No new build, VM execution, source change or identity claim.'}
 if write:(w/'cutsets.json').write_text(json.dumps(out,indent=2)+'\n')
 return out

if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--write',action='store_true');a=p.parse_args();r=run(write=a.write);print(json.dumps(r['summary'],indent=2))
