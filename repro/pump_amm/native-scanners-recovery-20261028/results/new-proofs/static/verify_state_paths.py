"""Inspect actual accumulator declaration descriptors and unchanged field declarations."""
from pathlib import Path
import hashlib,importlib.util,json,struct
def sha(data):return hashlib.sha256(data).hexdigest()
def verify(candidate,symbols,source,expected_file,root):
 root=Path(root);candidate=Path(candidate);symbols=Path(symbols);source=Path(source)
 reader=root/'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py';sp=importlib.util.spec_from_file_location('state_path_elf',reader);m=importlib.util.module_from_spec(sp);sp.loader.exec_module(m)
 o=m.Elf(root/'evidence/original/pump_amm/deployed.so');c=m.Elf(candidate);s=m.Elf(symbols)
 assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]and c.pattern(c.lo,c.hi-c.lo)==s.pattern(s.lo,s.hi-s.lo)
 def descriptor(e,start):
  at=start+40;assert e.b[at]==0x18 and e.relocations[at]['type']==8
  ptr=struct.unpack_from('<I',e.b,at+4)[0]|struct.unpack_from('<I',e.b,at+12)[0]<<32;assert e.relocations[ptr]['type']==8
  p=struct.unpack_from('<Q',e.b,ptr)[0]>>32;n,line,col=struct.unpack_from('<QII',e.b,ptr+8)
  return {'file':e.b[p:p+n].decode(),'line':line,'column':col}
 out=[]
 for name,start in [('GlobalVolumeAccumulator',0xd47b8),('UserVolumeAccumulator',0xd5268)]:
  fs=[f for f in s.funcs if('..state..volume_accumulator..'+name+'$u20$as$u20$anchor_lang..AccountDeserialize')in f['name']and'25try_deserialize_unchecked'in f['name']];assert len(fs)==1
  f=fs[0];a,b=descriptor(o,start),descriptor(c,f['start'])
  assert a['file']==b['file']=='programs/pump-amm/src/state/volume_accumulator.rs'
  assert o.normalized[start:start+f['size']]==c.normalized[f['start']:f['start']+f['size']]
  assert o.pattern(start,f['size'])==c.pattern(f['start'],f['size'])
  out.append({'type':name,'original':a,'candidate':b,'path_equal':True,'coordinates_equal':(a['line'],a['column'])==(b['line'],b['column'])})
 expected=json.loads(Path(expected_file).read_text());code=(source/'programs/pump-amm/src/state/volume_accumulator.rs').read_text();a=code.index('#[account]\n#[derive(Debug)]');b=code.index('#[account]\npub struct UserVolumeAccumulator',a);global_text=code[a:b];a=b;b=code.index('impl GlobalVolumeAccumulator',a);user=code[a:b]
 assert sha(global_text.encode())==expected['moved_global_definition_sha256'];assert sha(user.encode())==expected['moved_user_definition_sha256']
 return {'passed':True,'candidate_sha256':sha(c.b),'descriptors':out,'declaration_bytes_preserved':True,'scope':'Actual descriptor paths and declaration bytes; source line/column equality is reported separately and not assumed.'}
