#!/usr/bin/env python3
"""Resolve recognized fmt::Write vtable aliases and direct formatter pointers.

This is a bounded static relation, not full data/vtable/indirect closure.
"""
from pathlib import Path
import argparse, collections, hashlib, json, struct, sys
ROOT=next(p for p in Path(__file__).resolve().parents if(p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf

def analyze(candidate,symbols,closure,descriptors,origins=False):
 o=Elf(ROOT/'evidence/original/pump_amm/deployed.so');c=Elf(candidate);s=Elf(symbols);assert hashlib.sha256(c.b).hexdigest()==closure['candidate_sha256']==descriptors['candidate_sha256'];pairs={(p['original'],p['candidate']):p for p in closure['pairs']};names=collections.defaultdict(list)
 for f in s.funcs:names[f['start']].append(f['name'])
 def ptr(e,at):
  assert e.relocations.get(at,{}).get('type')==8,(hex(at),e.relocations.get(at));return struct.unpack_from('<Q',e.b,at)[0]>>32
 fmt=[];code=[];old_unbound=[];extra=collections.defaultdict(set);bad=set()
 for row in descriptors['observations']:
  key=row['original'],row['candidate'];kind=row['kind']
  if kind=='text_descriptor':
   if not row['equal']or(origins and row.get('origin_coordinates_equal')is False):bad.add(key)
  elif kind=='code_pointer':
   extra[key].add((row['original_target'],row['candidate_target']));code.append(row)
   if not row['body_pair']:old_unbound.append(row)
  elif kind=='vtable':
   if not row['metadata_equal']:bad.add(key)
   offsets=[0,24]
   if any('core..fmt..Write$GT$9write_str' in name for name in row['candidate_method_names']):offsets=[0,24,32,40]
   slots=[]
   for off in offsets:
    ot=ptr(o,row['original_pointer']+off);ct=ptr(c,row['candidate_pointer']+off);extra[key].add((ot,ct));slots.append({'offset':off,'original_target':ot,'candidate_target':ct,'body_pair':(ot,ct)in pairs,'candidate_names':names[ct]})
   if offsets==[0,24,32,40]:fmt.append({**row,'slots':slots,'all_body_pairs':all(x['body_pair']for x in slots)})
   if not row['drop_body_pair']or not row['method_body_pair']:old_unbound.append(row)
 initial={k for k,p in pairs.items()if p['in_internal_direct_closure']};active=initial-bad;rounds=[]
 while True:
  rejected={k for k in active if any((x['original_target'],x['candidate_target'])not in active for x in pairs[k]['edges'])or any(x not in active for x in extra.get(k,()))}
  if not rejected:break
  rounds.append(len(rejected));active-=rejected
 resolutions=[]
 for row in old_unbound:
  if row['kind']=='vtable':
   witnesses=[{'original':v['original'],'candidate':v['candidate'],'original_pointer':v['original_pointer'],'candidate_pointer':v['candidate_pointer'],'slots':v['slots']}for v in fmt if v['original']==row['original']and v['all_body_pairs']]
  else:
   witnesses=[v for v in code if v['original']==row['original']and v['body_pair']]
  active_witnesses=[x for x in witnesses if(x['original'],x['candidate'])in active]
  resolutions.append({'unbound_observation':row,'alternate_witnesses':witnesses,'has_witness':bool(witnesses),'active_witnesses':active_witnesses,'has_active_witness':bool(active_witnesses)})
 true_text=[];false_text=[];obs=descriptors['observations']
 for row in obs:
  if row['kind']!='text_descriptor'or row['equal']:continue
  alternatives=[v for v in obs if v['kind']=='text_descriptor'and v['original']==row['original']and v['offset']==row['offset']and v['equal']]
  (false_text if alternatives else true_text).append({'observation':row,'equal_alternatives':alternatives})
 return {'candidate_sha256':closure['candidate_sha256'],'original_sha256':closure['original_sha256'],'source_coordinates_included':origins,'counts':{'original_unbound_observations':len(old_unbound),'original_unbound_vtable_observations':sum(v['kind']=='vtable'for v in old_unbound),'original_unbound_code_pointer_observations':sum(v['kind']=='code_pointer'for v in old_unbound),'resolved_by_actual_target_alternative':sum(v['has_witness']for v in resolutions),'unresolved':sum(not v['has_witness']for v in resolutions),'resolved_in_bounded_closure':sum(v['has_active_witness']for v in resolutions),'fmt_vtable_pairs':len(fmt),'fmt_vtable_pairs_all_four_targets_bound':sum(v['all_body_pairs']for v in fmt),'direct_closed_pairs':len(initial),'direct_closed_windows':len({a for a,b in initial}),'bounded_static_closed_pairs':len(active),'bounded_static_closed_windows':len({a for a,b in active}),'unequal_text_with_equal_alternative':len(false_text),'unequal_text_without_equal_alternative':len(true_text)},'pruning_rounds':rounds,'unbound_resolutions':resolutions,'fmt_vtable_pairs':fmt,'code_pointer_pairs':code,'remaining_pairs':[list(k)for k in sorted(active)],'false_text_cross_pairs':false_text,'true_text_mismatches':true_text,'scope':'Actual relocation-target relation and all three fmt::Write methods plus drop. Other recognized vtables retain drop/first-method scope. Aliases are alternate complete targets, not arbitrary address normalization. No full indirect-call/data/ELF identity claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);p.add_argument('--closure',type=Path,required=True);p.add_argument('--descriptors',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--source-coordinates',action='store_true');a=p.parse_args();r=analyze(a.candidate,a.symbols,json.loads(a.closure.read_bytes()),json.loads(a.descriptors.read_bytes()),a.source_coordinates);a.output.write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r['counts'],indent=2))
