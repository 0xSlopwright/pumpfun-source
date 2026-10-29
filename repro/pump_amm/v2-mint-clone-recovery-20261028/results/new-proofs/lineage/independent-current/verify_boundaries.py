from pathlib import Path
import hashlib,importlib.util,json,struct

def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m

def verify(root):
 w=Path(root);e=module('boundary_elf',w/'elf_reader.py');fields=module('boundary_fields',w/'source_fields.py');o=e.Elf(w/'input-root/evidence/original/pump_amm/deployed.so');c=e.Elf(w/'build/artifacts/pump_amm_recovered.so');s=e.Elf(w/'build/artifacts/unstripped.so')
 def pointer(image,at):
  assert image.relocations[at]['type']==8 and image.b[at]==0x18
  return struct.unpack_from('<I',image.b,at+4)[0]|struct.unpack_from('<I',image.b,at+12)[0]<<32
 rows=[]
 for role,a,n,name,diff in [('supported_mint',0x73ef0,568,'14supported_mint',[]),('from_mint',0x74128,1312,'9from_mint',[1032]),('amount_before_fee',0x74b80,688,'17amount_before_fee',[584])]:
  f=next(f for f in s.funcs if name in f['name']);b=f['start'];assert f['size']==n
  got=[i for i in range(0,n,8)if o.normalized[a+i:a+i+8]!=c.normalized[b+i:b+i+8]];assert got==diff and o.pattern(a,n)==c.pattern(b,n)
  oc,cc=o.callsites(a,n),c.callsites(b,n);assert [x['offset']for x in oc]==[x['offset']for x in cc]
  matches=[];opens=[]
  for x,y in zip(oc,cc):
   i=o.entries.index(x['target']);on=(o.entries[i+1]if i+1<len(o.entries)else o.hi)-x['target'];cf=next(f for f in s.funcs if f['start']==y['target'])
   same=on==cf['size']and o.normalized[x['target']:x['target']+on]==c.normalized[y['target']:y['target']+on]and o.pattern(x['target'],on)==c.pattern(y['target'],on)
   (matches if same else opens).append({'offset':x['offset'],'original':hex(x['target']),'original_bytes':on,'candidate_bytes':cf['size']})
  if role=='supported_mint':
   assert len(matches)==2 and opens==[{'offset':392,'original':'0xf28b8','original_bytes':1192,'candidate_bytes':1168}]
   op,cp=pointer(o,a+104),pointer(c,b+104);assert o.b[op:op+32]==c.b[cp:cp+32]
   op,cp=pointer(o,a+544),pointer(c,b+544)
   def loc(image,p):
    q=struct.unpack_from('<Q',image.b,p)[0]>>32;length,line,col=struct.unpack_from('<QII',image.b,p+8)
    return {'filename':image.b[q:q+length].decode(),'line':line,'column':col}
   original_loc,candidate_loc=loc(o,op),loc(c,cp);assert original_loc=={'filename':'programs/pump-amm/src/utils/token.rs','line':341,'column':36};assert candidate_loc['filename']==original_loc['filename']
  else:
   of,cf=fields.source_fields(o,a,n),fields.source_fields(c,b,n);assert len(of)==len(cf)==1 and of[0]['filename']==cf[0]['filename']=='programs/pump-amm/src/utils/transfer_fee.rs' and of[0]['length']==cf[0]['length']==43
   assert [(v['line'],v['line_store']-base)for v,base in [(of[0],a),(cf[0],b)]]==([(32,1032),(13,1032)]if role=='from_mint'else[(67,584),(35,584)])
   if role=='from_mint':assert len(matches)==9 and opens==[{'offset':200,'original':'0xf31d8','original_bytes':664,'candidate_bytes':656}]
   else:assert len(matches)==5 and not opens
  row={'role':role,'original':hex(a),'candidate':f,'bytes':n,'differing_instruction_offsets':got,'matched_actual_callees':matches,'open_actual_callees':opens}
  if role=='supported_mint':row.update(original_panic_location=original_loc,candidate_panic_location=candidate_loc)
  rows.append(row)
 return {'passed':True,'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'rows':rows,'whole_elf_equal':False,'scope':'Body/relocation and actual target comparisons; scanner and decoder are explicitly open, panic source coordinates differ. No blanket pointer-prefix equivalence.'}
if __name__=='__main__':print(json.dumps(verify(Path(__file__).parent),indent=2))
