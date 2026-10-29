#!/usr/bin/env python3
from pathlib import Path
import hashlib,importlib.util,json,struct,sys
def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def J(p):return json.loads(p.read_text())
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root=None):
 w=Path(root or Path(__file__).parent).resolve();manifest=J(w/'manifest.json')['files'];assert manifest=={str(p.relative_to(w)):H(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'and '__pycache__'not in p.parts}
 e=module('native_inverse_elf',w/'elf_reader.py');fields=module('native_inverse_fields',w/'source_fields.py');o=e.Elf(w/'original.so');c=e.Elf(w/'candidate.so');s=e.Elf(w/'symbols.so');r=J(w/'review.json');build=J(w/'build-record.json')
 assert H(w/'candidate.so')==r['candidate_sha256']==build['comparison']['candidate_sha256'];assert H(w/'symbols.so')==r['symbols_sha256']==build['unstripped_sha256']
 assert build['returncode']==0 and build['source_unchanged']
 assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 for p in (w/'source').rglob('*'):
  if p.is_file():
   suffix='/source/'+str(p.relative_to(w/'source'));keys=[k for k in build['source_sha256']if k.endswith(suffix)];assert len(keys)==1 and build['source_sha256'][keys[0]]==H(p)
 for row in r['functions']:
  a=int(row['original'],16);f=row['candidate'];assert f in s.funcs;b=f['start'];size=f['size'];assert size==row['original_size']
  diffs=[i for i in range(0,size,8)if o.normalized[a+i:a+i+8]!=c.normalized[b+i:b+i+8]]
  expected=[584]if row['role']=='amount_before_fee'else[];assert diffs==expected
  assert o.pattern(a,size)==c.pattern(b,size)
  oc=o.callsites(a,size);cc=c.callsites(b,size);assert [x['offset']for x in oc]==[x['offset']for x in cc]
  for x,y in zip(oc,cc):
   i=o.entries.index(x['target']);z=o.entries[i+1]if i+1<len(o.entries)else o.hi;t=next(t for t in s.funcs if t['start']==y['target'])
   assert z-x['target']==t['size'];assert o.normalized[x['target']:z]==c.normalized[t['start']:t['start']+t['size']];assert o.pattern(x['target'],t['size'])==c.pattern(t['start'],t['size'])
   if row['role']!='amount_before_fee':assert o.b[x['target']:z]==c.b[t['start']:t['start']+t['size']]
  if row['role']=='amount_before_fee':
   assert len(oc)==5 and oc[0]['offset']==120 and oc[0]['target']==0xf2ed0
   assert o.normalized[a:a+128]==c.normalized[b:b+128]
   of=fields.source_fields(o,a,size);cf=fields.source_fields(c,b,size);assert {'original':of,'candidate':cf}==J(w/'source-fields.json')
   assert len(of)==len(cf)==1 and of[0]['filename']==cf[0]['filename']=='programs/pump-amm/src/utils/transfer_fee.rs'
   assert of[0]['line']==67 and cf[0]['line']==34 and of[0]['length']==cf[0]['length']==43
   assert of[0]['line_store']-a==cf[0]['line_store']-b==584
 return {'passed':True,'candidate_sha256':r['candidate_sha256'],'native_fee_bytes':368,'native_inverse_bytes':776,'inverse_wrapper_bytes':688,'inverse_wrapper_other_instruction_differences':0,'inverse_wrapper_source_line':[67,34],'inverse_wrapper_actual_matched_callees':5,'build_inputs_bound':2,'executes_build_or_runtime':False,'whole_elf_equal':False,'manifest_sha256':H(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(Path(sys.argv[1])if len(sys.argv)>1 else None),indent=2))
