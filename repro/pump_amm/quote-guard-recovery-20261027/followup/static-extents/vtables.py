"""Read-only full StringError/Error vtables, including all late method slots."""
from pathlib import Path
import collections,hashlib,json,struct,sys,types
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf

def object_map(symbols):
 b=Path(symbols).read_bytes();off=struct.unpack_from('<Q',b,40)[0];size,count,ni=struct.unpack_from('<HHH',b,58);ss=[struct.unpack_from('<IIQQQQIIQQ',b,off+i*size)for i in range(count)];out=collections.defaultdict(list)
 for s in ss:
  if s[1]!=2:continue
  names_section=ss[s[6]];names=b[names_section[4]:names_section[4]+names_section[5]]
  for p in range(s[4],s[4]+s[5],24):
   name,info,_,idx,value,n=struct.unpack_from('<IBBHQQ',b,p)
   if info&15==1 and n:out[value].append({'name':names[name:].split(b'\0',1)[0].decode(),'bytes':n})
 return out

def analyze(root,original,candidate,symbols,descriptors,prior_closure):
 o=Elf(Path(original));c=Elf(Path(candidate));s=Elf(Path(symbols));defs=object_map(symbols);functions=collections.defaultdict(list)
 for f in s.funcs:functions[f['start']].append(f)
 ds=json.loads(Path(descriptors).read_bytes());prior=json.loads(Path(prior_closure).read_bytes());active={tuple(p)for p in prior['remaining_pairs']}
 def pointer(e,p):
  assert e.relocations.get(p,{}).get('type')==8
  return struct.unpack_from('<Q',e.b,p)[0]>>32
 def code_pair(a,b):
  n=o.entries[o.entries.index(a)+1]-a
  fs=[f for f in functions[b]if f['size']==n]
  if not fs or o.normalized[a:a+n]!=c.normalized[b:b+n]or o.pattern(a,n)!=c.pattern(b,n):return None
  return {'original_target':a,'candidate_target':b,'bytes':n,'candidate_names':[f['name']for f in fs],'already_in_bounded_closure':(a,b)in active}
 def header(a,b):return o.b[a+8:a+24]==c.b[b+8:b+24]and struct.unpack_from('<QQ',o.b,a+8)==(24,8)
 def compare(a,b):
  if not header(a,b):return None
  expected=[0,24,32,40,48,56,64,72,80]
  if [k for k in range(0,88,8)if a+k in o.relocations]!=expected or[k for k in range(0,88,8)if b+k in c.relocations]!=expected:return None
  code=[]
  for k in [0,24,32,48,56,64,72,80]:
   pair=code_pair(pointer(o,a+k),pointer(c,b+k))
   if pair is None:return None
   code.append({'offset':k,**pair})
  ap,bp=pointer(o,a+40),pointer(c,b+40)
  if not defs.get(bp)or{q['bytes']for q in defs[bp]}!={32}or not header(ap,bp):return None
  nested=[]
  for k in [0,24]:
   pair=code_pair(pointer(o,ap+k),pointer(c,bp+k))
   if pair is None:return None
   nested.append({'offset':k,**pair})
  return {'original_pointer':a,'candidate_pointer':b,'bytes':88,'metadata':{'value_size':24,'value_alignment':8},'code_slots':code,'supertrait':{'offset':40,'original_pointer':ap,'candidate_pointer':bp,'bytes':32,'code_slots':nested}}
 selected=[r for r in ds['observations']if r['kind']=='vtable'and defs.get(r['candidate_pointer'])and{p['bytes']for p in defs[r['candidate_pointer']]}=={88}]
 unique=sorted({(r['original_pointer'],r['candidate_pointer'])for r in selected});tables=[]
 for a,b in unique:
  row=compare(a,b);assert row is not None,(hex(a),hex(b));tables.append(row)
 assert len(selected)==6 and len(tables)==4
 for t in tables:
  assert all(p['already_in_bounded_closure']for p in t['code_slots']+t['supertrait']['code_slots'])
  assert code_pair(pointer(o,t['original_pointer']+56),pointer(c,t['candidate_pointer']+80))is None
  assert compare(t['original_pointer'],t['candidate_pointer']+8)is None
 matrix=[{'original_pointer':a,'candidate_pointer':b,'valid_full_alias':compare(a,b)is not None}for a in sorted({a for a,b in unique})for b in sorted({b for a,b in unique})]
 return {'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'observations':len(selected),'unique_error_vtables':len(tables),'full_vtable_bytes':sum(t['bytes']for t in tables),'nested_display_vtable_bytes':sum(t['supertrait']['bytes']for t in tables),'tables':tables,'alias_matrix':matrix,'negative_controls':{'late_type_id_target_substitution_rejected':len(tables),'shifted_vtable_pointer_rejected':len(tables)},'bounded_closure_windows_unchanged':prior['counts']['bounded_static_closed_windows'],'scope':'All88-byte Error vtable metadata and code slots plus32-byte Display supertrait vtables are checked. No full ELF or unclassified-vtable claim.'}
if __name__=='__main__':
 root=R;s=root/'work/amm-sixth-wave-build-worker-20261027/build/artifacts';d=root/'work/amm-sixth-independent-review-20261027/data-audit';out=analyze(root,root/'evidence/original/pump_amm/deployed.so',s/'pump_amm_recovered.so',s/'unstripped.so',d/'descriptors.json',d/'data-closure.json');(W/'error-vtables.json').write_text(json.dumps(out,indent=2)+'\n');print({k:v for k,v in out.items()if k not in['tables','alias_matrix']});print('matrix',sum(r['valid_full_alias']for r in out['alias_matrix']),len(out['alias_matrix']))
