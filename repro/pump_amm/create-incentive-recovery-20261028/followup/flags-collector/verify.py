from pathlib import Path
import hashlib,importlib.util,json,struct,sys
sys.dont_write_bytecode=True
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root=None):
 w=Path(root or Path(__file__).resolve().parent);sys.path.insert(0,str(w))
 files=json.loads((w/'manifest.json').read_text())['files'];assert files=={str(p.relative_to(w)):h(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'}
 E=module('collector_elf',w/'elf_reader.py').Elf;o=E(w/'original.so');c=E(w/'candidate.so');s=E(w/'symbols.so')
 assert h(w/'candidate.so')=='e33e6aace7d53008b3300364c07540f0cd7d1764196cd601554b08838b06e615'
 incoming=[at for at,target in o.calls.items()if target==0xfb08];assert incoming==[0x3f2c8]
 assert o.callsites(0xfb08,704)==[{'offset':696,'target':0x111348}]
 # 32-byte iterator carrier: bool reference, count reference, start and end.
 expected={0x3f268:(0x7b,0x3a,-328,0),0x3f270:(0xbf,0xa1,0,0),0x3f278:(0x07,1,0,-656),0x3f280:(0x7b,0x1a,-336,0),0x3f288:(0xbf,0xa1,0,0),0x3f290:(0x07,1,0,-592),0x3f298:(0x7b,0x1a,-344,0),0x3f2a0:(0x7b,0x6a,-320,0),0x3f2b8:(0xbf,0xa2,0,0),0x3f2c0:(0x07,2,0,-344)}
 # Exact locations are independently decoded; no source name controls them.
 for a,v in expected.items():assert struct.unpack_from('<BBhi',o.b,a)==v,(hex(a),struct.unpack_from('<BBhi',o.b,a),v)
 ob=o.normalized[0xfb08:0xfdc8];obj=module('collector_obj',w/'object_reader.py').sections(w/'flags.o');q=next(x for x in obj if'tuple_buy17'in x['name']);assert q['size']==704
 diff=[i for i in range(0,704,8)if ob[i:i+8]!=q['code'][i:i+8]];assert diff==[328,336,344,352,360,368]
 assert not any(f['size']==704 and c.normalized[f['start']:f['start']+704]==ob and c.pattern(f['start'],704)==o.pattern(0xfb08,704)for f in s.funcs)
 micro=module('collector_micro',w/'verify_flags_model.py').verify();assert micro==json.loads((w/'flags-micro-execution.json').read_text())
 return {'passed':True,'candidate_sha256':h(w/'candidate.so'),'original_helper':'0xfb08/704','incoming_callsite':'0x3f2c8','parent':'0x3dbc0','carrier_bytes':32,'fields':['direction bool reference','count usize reference','range start usize','range end usize'],'output':'Vec<u8>','original_handle_error':'0x111348/24','saved_object_size':704,'saved_object_differing_slots':diff,'interpreter_cases':200,'matched_current_helper':False,'source_patch_proposed':False,'build_or_solana_vm_executed':False,'manifest_sha256':h(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
