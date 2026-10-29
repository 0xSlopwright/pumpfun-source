#!/usr/bin/env python3
from pathlib import Path
import argparse, collections, hashlib, importlib.util, json, struct
W=Path(__file__).resolve().parent
H=W
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def run():
 reader=W/'elf_reader.py'
 spec=importlib.util.spec_from_file_location('audit_elf',reader); mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
 measurement=H/'worker-records/measurement-full.json'; m=json.loads(measurement.read_bytes())
 remainder=W/'remaining-hints.json'; old=json.loads(remainder.read_bytes()); hints={int(x['original_start'],16):x for x in old['windows']}
 candidate=H/'artifacts/candidate.so';symbols=H/'artifacts/unstripped.so'
 assert symbols.is_file()
 o=mod.Elf(W/'input-root/evidence/original/pump_amm/deployed.so');c=mod.Elf(candidate);s=mod.Elf(symbols)
 assert sha(candidate)==m['candidate_sha256']
 remaining=[x for x in m['rows']if not x['matches']];assert len(remaining)==129
 assert {x['start']for x in remaining}==set(hints)-{0x17960,0x74e30,0xf6eb0}
 assert sum(x['end']-x['start']for x in m['rows'])==1162040
 by_size=collections.defaultdict(list)
 seen=set()
 for f in s.funcs:
  if (f['start'],f['size'])not in seen:by_size[f['size']].append(f);seen.add((f['start'],f['size']))
 rows=[]
 for row in remaining:
  a,z=row['start'],row['end'];h=hints[a];n=z-a; opts=[]
  for f in by_size[n]:
   b=f['start'];pat=c.pattern(b,n)
   if pat!=o.pattern(a,n):continue
   diffs=[i for i in range(0,n,8)if o.normalized[a+i:a+i+8]!=c.normalized[b+i:b+i+8]]
   opts.append((len(diffs),f,diffs))
  opts.sort(key=lambda x:(x[0],x[1]['name']))
  best=[]
  if opts:
   for k,f,ds in opts:
    if k!=opts[0][0]:break
    best.append({'candidate_start':hex(f['start']),'name':f['name'],'differing_instructions':k,'differences':[{'offset':i,'original':o.normalized[a+i:a+i+8].hex(),'candidate':c.normalized[f['start']+i:f['start']+i+8].hex()}for i in ds] if k<=8 else []})
  # Structural domain labels, not asserted semantic equivalence.
  if a in (0xaf3b0,0xd44e0,0xd4f90):category='generated_account_validation'
  elif h['owner']=='math_and_dependencies':category='math_token_and_runtime_helpers'
  elif any('/state/'in x['file']for x in h['historical_source_hint'])or 0x61630<=a<=0x6f3c8:category='state_methods_and_serialization'
  elif n in (520,536) and a not in (0x4efb8,):category='instruction_error_closures'
  elif h['owner']=='swaps_events_contexts':category='swap_and_route_business'
  else:category='liquidity_admin_incentive_business'
  rows.append({'original_start':hex(a),'original_end':hex(z),'bytes':n,'domain':category,'previous_owner':h['owner'],'historical_source_hints':h['historical_source_hint'],'candidate_call_target_hints':h['candidate_call_target_names'],'same_size_same_relocation_best_instruction_difference':opts[0][0]if opts else None,'best_alternatives_count':len(best),'best_alternatives':best[:4]})
 domain=collections.defaultdict(lambda:{'windows':0,'bytes':0});
 for x in rows:domain[x['domain']]['windows']+=1;domain[x['domain']]['bytes']+=x['bytes']
 out={'candidate_sha256':m['candidate_sha256'],'measurement_sha256':sha(measurement),'original_capture_sha256':sha(W/'input-root/evidence/original/pump_amm/deployed.so'),'symbol_sha256':sha(symbols),'scope':'Every unmatched original window exactly once; domains are structural routing, same-size alternatives are diagnostics, neither is proof of cause or completion.','metrics':{'normalized_windows':656,'total_windows':785,'unmatched_windows':129,'normalized_percent':656/785*100,'remaining_window_percent':129/785*100,'raw_equal_windows':148,'raw_equal_percent':148/785*100,'normalized_only_windows':508,'matched_text_bytes':826112,'original_text_bytes':1162040,'unmatched_text_bytes':sum(x['bytes']for x in rows),'matched_text_percent':826112/1162040*100,'remaining_text_percent':(1162040-826112)/1162040*100,'whole_elf_equal':False},'domains':dict(domain),'rows':rows}
 assert out['metrics']['unmatched_text_bytes']==335928
 (W/'remaining-audit.json').write_text(json.dumps(out,indent=2)+'\n')
 print(json.dumps({'metrics':out['metrics'],'domains':out['domains'],'near_shape_windows':sum(x['same_size_same_relocation_best_instruction_difference']in(1,2,3)for x in rows),'near_shape_bytes':sum(x['bytes']for x in rows if x['same_size_same_relocation_best_instruction_difference']in(1,2,3))},indent=2))
if __name__=='__main__':run()
