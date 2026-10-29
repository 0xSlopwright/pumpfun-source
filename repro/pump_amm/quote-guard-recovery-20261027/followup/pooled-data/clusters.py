"""Enumerate exact-pointer relocation users of the bounded pooled target set."""
from pathlib import Path
import bisect, collections, json, struct, sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf

def analyze(original,observations,call_closure,slices,indexed):
 e=Elf(Path(original));rows=json.loads(Path(observations).read_bytes());pairs=json.loads(Path(call_closure).read_bytes())['pairs'];matched={p['original']for p in pairs};names=collections.defaultdict(set)
 for p in pairs:names[p['original']].update(p['candidate_names'])
 targets={r['original_pointer']for r in rows};users=collections.defaultdict(list)
 for at,rel in e.relocations.items():
  if rel['type']!=8:continue
  text=e.lo<=at<e.hi
  if text:
   if e.b[at]!=0x18:continue
   ptr=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32
  else:ptr=struct.unpack_from('<Q',e.b,at)[0]>>32
  if ptr not in targets:continue
  if text:
   owner=e.entries[bisect.bisect_right(e.entries,at)-1];i=e.entries.index(owner);end=e.entries[i+1]if i+1<len(e.entries)else e.hi
   users[ptr].append({'reference':at,'kind':'code','owner':owner,'owner_bytes':end-owner,'offset':at-owner,'owner_has_equal_body_candidate':owner in matched,'candidate_body_names':sorted(names[owner])})
  else:users[ptr].append({'reference':at,'kind':'data'})
 bounded=collections.defaultdict(set)
 for r in slices['rows']+indexed['rows']:bounded[r['original_pointer']].add((r.get('index_min',0),r['bytes'],r['original_hex']))
 clusters=[]
 for p in sorted(targets):
  obs=[r for r in rows if r['original_pointer']==p];u=users[p]
  clusters.append({'original_pointer':p,'input_observations':len(obs),'candidate_pointers':sorted({r['candidate_pointer']for r in obs}),'bounded_ranges':[{'offset':a,'bytes':n,'hex':h}for a,n,h in sorted(bounded[p])],'exact_pointer_users':u,'code_users':sum(q['kind']=='code'for q in u),'users_without_equal_body_candidate':sum(q['kind']=='code'and not q['owner_has_equal_body_candidate']for q in u)})
 return {'input_observations':len(rows),'original_target_clusters':len(clusters),'exact_pointer_relocations':sum(len(r['exact_pointer_users'])for r in clusters),'code_relocations':sum(r['code_users']for r in clusters),'code_relocations_in_unmatched_owners':sum(r['users_without_equal_body_candidate']for r in clusters),'clusters':clusters,'scope':'Exact-target relocation census only. Interior pointers, unrelocated immediate arithmetic and dynamic pointers are outside this enumeration. Owner entries are actual direct-call/relocation entry boundaries; lack of an equal-body candidate is not a behavior mismatch.'}
if __name__=='__main__':
 raise SystemExit('Use verify.py --root REPOSITORY to run the sealed audit.')
