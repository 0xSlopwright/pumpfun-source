#!/usr/bin/env python3
"""Verify paired direct-call closure without changing retained byte normalization."""
from pathlib import Path
import argparse,collections,gzip,hashlib,json,struct,sys
ROOT=next(p for p in Path(__file__).resolve().parents if(p/'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0,str(ROOT/'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf
ORIGINAL=ROOT/'evidence/original/pump_amm/deployed.so'
DEFAULT=ROOT/'repro/pump_amm/diagnostic-parity-20261027/results'
def sha(data):return hashlib.sha256(data).hexdigest()
def load(p):return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def analyze(candidate,symbols,measurement):
 o=Elf(ORIGINAL);c=Elf(candidate);s=Elf(symbols);m=load(measurement)
 assert m['candidate_sha256']==sha(c.b)
 assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 windows={r['start']:r for r in m['rows']}
 names=collections.defaultdict(list)
 for f in s.funcs:names[(f['start'],f['size'])].append(f['name'])
 pairs={}
 for r in m['rows']:
  a=r['start'];size=r['end']-a
  for match in r['matches']:
   b=match['start'];key=(a,b)
   assert (b,size)in names
   assert o.normalized[a:a+size]==c.normalized[b:b+size]
   assert o.pattern(a,size)==c.pattern(b,size)
   indirect=[];external=[];data=[];edges=[]
   at=a
   while at<a+size:
    op=o.b[at];ca=b+at-a
    if op==0x8d:indirect.append(at-a)
    if at in o.relocations:
     rel=o.relocations[at]
     if rel['type']==10:external.append({'offset':at-a,'symbol':rel['symbol']})
     elif rel['type']==8:data.append(at-a)
    if at in o.calls:
     assert ca in c.calls
     edges.append({'offset':at-a,'original_target':o.calls[at],'candidate_target':c.calls[ca]})
    at+=16 if op==0x18 else 8
   assert {x-a for x in o.calls if a<=x<a+size}=={x-b for x in c.calls if b<=x<b+size}
   pairs[key]={'original':a,'candidate':b,'bytes':size,'candidate_names':sorted(set(names[(b,size)])),'edges':edges,'indirect_call_offsets':indirect,'external_calls':external,'relocated_data_offsets':data}
 def close(blockers):
  active={key for key,p in pairs.items()if not blockers(p)};rounds=[]
  while True:
   bad={key for key in active if any((e['original_target'],e['candidate_target'])not in active for e in pairs[key]['edges'])}
   if not bad:return active,rounds
   rounds.append(len(bad));active-=bad
 direct,dr=close(lambda p:False)
 noindirect,ir=close(lambda p:bool(p['indirect_call_offsets']))
 isolated,sr=close(lambda p:bool(p['indirect_call_offsets']or p['external_calls']or p['relocated_data_offsets']))
 boundary=[]
 for key,p in sorted(pairs.items()):
  for edge in p['edges']:
   target=(edge['original_target'],edge['candidate_target'])
   if target not in pairs:
    t=windows.get(edge['original_target'])
    boundary.append({'original':p['original'],'candidate':p['candidate'],**edge,'target_has_some_body_match':bool(t and t['matches']),'reason':'actual called target pair has no full-window match'})
  p.update(in_internal_direct_closure=key in direct,in_no_indirect_closure=key in noindirect,in_no_static_or_external_boundary_closure=key in isolated)
 def count_orig(keys):return len({a for a,b in keys})
 return {'original_sha256':sha(o.b),'candidate_sha256':sha(c.b),'symbols_sha256':sha(s.b),'measurement_sha256':sha(measurement.read_bytes()),'reader_sha256':sha((ROOT/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py').read_bytes()),'counts':{'matched_original_windows':sum(bool(r['matches'])for r in m['rows']),'body_match_pairs':len(pairs),'internal_direct_closure_pairs':len(direct),'internal_direct_closure_windows':count_orig(direct),'no_indirect_closure_pairs':len(noindirect),'no_indirect_closure_windows':count_orig(noindirect),'no_static_or_external_boundary_pairs':len(isolated),'no_static_or_external_boundary_windows':count_orig(isolated),'unmatched_direct_target_edges':len(boundary),'unmatched_direct_original_targets':len({r['original_target']for r in boundary})},'pruning_rounds':{'internal_direct':dr,'no_indirect':ir,'no_static_or_external':sr},'pairs':list(pairs.values()),'unmatched_direct_boundaries':boundary,'scope':'Greatest fixed point over exact original-window/candidate-symbol body pairs. Internal direct-call closure proves every actual internal call target remains in the paired set, including cycles. External symbol/provider identity, data contents, indirect-call targets and runtime equivalence are not implied. The strict third set excludes all relocated data, external and indirect call boundaries transitively.'}
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,default=DEFAULT/'build/candidate.so');p.add_argument('--symbols',type=Path,default=DEFAULT/'build/unstripped.so');p.add_argument('--measurement',type=Path,default=DEFAULT/'measurement.json.gz');p.add_argument('--output',type=Path);a=p.parse_args();r=analyze(a.candidate,a.symbols,a.measurement)
 if a.output:
  assert not a.output.exists();a.output.write_text(json.dumps(r,indent=2)+'\n')
 print(json.dumps(r['counts'],indent=2))
if __name__=='__main__':main()
