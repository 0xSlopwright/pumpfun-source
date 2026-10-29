from pathlib import Path
import json,struct,sys,hashlib
W=Path(__file__).resolve().parent;ROOT=next(p for p in W.parents if(p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
c=Elf(W/'build/artifacts/pump_amm_recovered.so');s=Elf(W/'build/artifacts/unstripped.so');o=Elf(ROOT/'evidence/original/pump_amm/deployed.so')
getters={f['start']for f in s.funcs if '15get_return_data17h'in f['name']}
rows=[]
for f in s.funcs:
 calls=[x for x in c.callsites(f['start'],f['size'])if x['target']in getters]
 if not calls:continue
 origins=[]
 for at,r in c.relocations.items():
  if not f['start']<=at<f['start']+f['size']or r['type']!=8 or c.b[at]!=0x18:continue
  p=struct.unpack_from('<I',c.b,at+4)[0]|struct.unpack_from('<I',c.b,at+12)[0]<<32
  if c.relocations.get(p,{}).get('type')!=8:continue
  fp=struct.unpack_from('<Q',c.b,p)[0]>>32;n=struct.unpack_from('<Q',c.b,p+8)[0]
  if not 0<n<256:continue
  raw=c.b[fp:fp+n]
  if raw!=b'programs/pump-amm/src/lib.rs':continue
  line,col=struct.unpack_from('<II',c.b,p+16);origins.append({'offset':at-f['start'],'file':raw.decode(),'line':line,'column':col})
 rows.append({'function':f,'get_return_data_calls':calls,'lib_source_origins':origins,'matches_original344':f['size']==344 and c.normalized[f['start']:f['start']+344]==o.normalized[0xd84b0:0xd8608],'relocation_pattern_equal':f['size']==344 and c.pattern(f['start'],344)==o.pattern(0xd84b0,344)})
result={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'manual_helper_present':any('read_cpi_return'in f['name']for f in s.funcs),'return_callers':rows};(W/'return-helper-evidence.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
