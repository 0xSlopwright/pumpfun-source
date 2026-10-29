from pathlib import Path
import hashlib,json,struct,sys
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W));from elf_reader import Elf
B=Elf(W/'baseline/artifacts/pump_amm_recovered.so');BS=Elf(W/'baseline/artifacts/unstripped.so');C=Elf(W/'build/artifacts/pump_amm_recovered.so');CS=Elf(W/'build/artifacts/unstripped.so')
bm={f['name']:f for f in BS.funcs};cm={f['name']:f for f in CS.funcs};assert len(bm)==len(cm)==803 and bm.keys()==cm.keys()
expected=[('incentives5claim28_',416,96,97,'programs/pump-amm/src/incentives.rs'),('create_pool17initial_liquidity',560,215,214,'programs/pump-amm/src/instructions/create_pool.rs'),('create_pool7execute28_',416,148,147,'programs/pump-amm/src/instructions/create_pool.rs')]
source_rows=[]
for needle,offset,oldline,newline,filename in expected:
 name=next(k for k in bm if needle in k);a,b=bm[name],cm[name];assert a['size']==b['size'];x=B.normalized[a['start']:a['start']+a['size']];y=C.normalized[b['start']:b['start']+b['size']]
 assert [i for i in range(0,len(x),8)if x[i:i+8]!=y[i:i+8]]==[offset]
 assert struct.unpack_from('<BBhi',x,offset)==(0x62,0x0a,-248,oldline)and struct.unpack_from('<BBhi',y,offset)==(0x62,0x0a,-248,newline)
 assert B.pattern(a['start'],a['size'])==C.pattern(b['start'],b['size'])
 pointers=[]
 for e,f in [(B,a),(C,b)]:
  at=f['start']+offset-40;assert e.relocations[at]['type']==8 and e.b[at]==0x18
  ptr=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32;assert e.b[ptr:ptr+len(filename)]==filename.encode();pointers.append(hex(ptr))
 source_rows.append({'name':name,'offset':offset,'old_line':oldline,'new_line':newline,'filename':filename,'base_current_filename_pointers':pointers,'all_other_normalized_body_bytes_and_relocations_equal':True})
non_source=[];unchanged=0
for name in bm:
 a,b=bm[name],cm[name];x=B.normalized[a['start']:a['start']+a['size']];y=C.normalized[b['start']:b['start']+b['size']]
 if x==y and B.pattern(a['start'],a['size'])==C.pattern(b['start'],b['size']):unchanged+=1
 elif name not in [r['name']for r in source_rows]:non_source.append(name)
assert len(non_source)==2 and any('create_pool7execute17'in n for n in non_source)and any('18pump_amm_recovered29admin_update_token_incentives17'in n for n in non_source)
r={'passed':True,'candidate_sha256':hashlib.sha256(C.b).hexdigest(),'shared_named_symbols':803,'unchanged_normalized_body_and_relocation_symbols':unchanged,'source_coordinate_only_changes':source_rows,'intended_changed_handlers':non_source,'no_added_or_removed_named_symbols':True,'scope':'Named symbol census and typed Source-line attribution; no assertion of whole-data or historical source identity.'};