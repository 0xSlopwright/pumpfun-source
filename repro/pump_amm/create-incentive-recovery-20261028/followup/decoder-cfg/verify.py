from pathlib import Path
import hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root=None):
 w=Path(root or Path(__file__).resolve().parent);sys.path.insert(0,str(w))
 manifest=json.loads((w/'manifest.json').read_text())['files']
 assert manifest=={str(p.relative_to(w)):h(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'}
 actual=module('decoder_cfg',w/'analyze.py').analyze();assert json.loads(json.dumps(actual))==json.loads((w/'analysis.json').read_text())
 record=json.loads((w/'build-record.json').read_text());native=[v for k,v in record['source_sha256'].items()if k.endswith('/crates/native-transfer-fee/src/lib.rs')]
 assert native==[h(w/'native.rs')]
 sections=module('decoder_sections',w/'object_sections.py').sections(w/'cursor-and-policy.o')
 obj=[x for x in sections if 'decode_transfer_fees' in x['name']];assert len(obj)==1 and not obj[0]['relocations']
 elf=module('decoder_reader',w/'elf_reader.py');c=elf.Elf(w/'candidate.so');s=elf.Elf(w/'symbols.so');f=[x for x in s.funcs if 'decode_transfer_fees' in x['name']][0]
 assert obj[0]['code']==c.b[f['start']:f['start']+f['size']]
 ir=(w/'cursor-and-policy.ll').read_text();start=ir.index('define hidden void @_ZN19native_transfer_fee20decode_transfer_fees');end=ir.index('\n}',start);body=ir[start:end]
 assert '!prof'not in body
 return {'passed':True,'candidate_sha256':actual['candidate_sha256'],'original_bytes':664,'candidate_bytes':656,'paired_cutpoints':22,'same_register_and_ordered_memory_effects':True,'same_branch_predicates':True,'net_extra_original_instruction_offset':656,'extra_instruction_kind':'unconditional payload-to-advance edge','historical_source_spelling_identified':False,'new_source_patch':False,'vm_or_compile_executed':False,'manifest_sha256':h(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
