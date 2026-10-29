from pathlib import Path
import argparse,difflib,hashlib,json,struct,sys,types
W=Path(__file__).resolve().parent
ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7';CANDIDATE='97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643';SYMBOLS='0142baeed4ee183435f763fb0d6124fa746196722700f3511c3d2b8375813dca';PATCH='f5664fc646c3637a0894ca836c7f5eea70e114fa39c6ccac7977202d138d6845'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inventory(p):return{str(f.relative_to(p)):sha(f)for f in p.rglob('*')if f.is_file()}
def verify(root):
 root=Path(root);assert json.loads((W/'manifest.json').read_bytes())['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 assert(sha(root/'evidence/original/pump_amm/deployed.so'),sha(W/'baseline/candidate.so'),sha(W/'baseline/unstripped.so'))==(ORIGINAL,CANDIDATE,SYMBOLS)
 record=json.loads((W/'baseline/build-comparison.json').read_bytes());suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in record['source_sha256']if k.endswith(suffix));local={k[len(prefix):]:v for k,v in record['source_sha256'].items()if k.startswith(prefix)};assert local==inventory(W/'baseline-source')and len(local)==52
 before=W/'baseline-source';after=W/'source';assert (before/'programs/pump-amm/src/sweep.rs').read_bytes()==(after/'programs/pump-amm/src/instructions/sweep_fees.rs').read_bytes();assert not(after/'programs/pump-amm/src/sweep.rs').exists()
 assert(after/'programs/pump-amm/src/lib.rs').read_text()==(before/'programs/pump-amm/src/lib.rs').read_text().replace('mod sweep;','pub use instructions::sweep_fees as sweep;')
 assert(after/'programs/pump-amm/src/instructions/mod.rs').read_text()==(before/'programs/pump-amm/src/instructions/mod.rs').read_text()+'\npub mod sweep_fees;\n'
 files=set(inventory(before))|set(inventory(after));patch=''
 for name in sorted(files):
  a,b=before/name,after/name;aa=a.read_bytes()if a.exists()else b'';bb=b.read_bytes()if b.exists()else b''
  if aa!=bb:patch+=''.join(difflib.unified_diff(aa.decode().splitlines(True),bb.decode().splitlines(True),fromfile='a/'+name if a.exists()else'/dev/null',tofile='b/'+name if b.exists()else'/dev/null'))
 assert patch==(W/'recovery.patch').read_text()and sha(W/'recovery.patch')==PATCH
 sys.path.insert(0,str(W));from elf_reader import Elf
 o,c,s=Elf(root/'evidence/original/pump_amm/deployed.so'),Elf(W/'baseline/candidate.so'),Elf(W/'baseline/unstripped.so');fs={f['start']:f for f in s.funcs};data=json.loads((W/'wrapper-map.json').read_bytes());assert data['original_shared_handler']==0x59408
 for r in data['wrappers']:
  a,b=r['original'],r['candidate']['start'];flag=r['selector'];assert o.entries[o.entries.index(a)+1]-a==1072 and r['candidate']==fs[b]and r['candidate']['size']==984
  assert o.calls[a+440]==0x59408 and c.calls[b+352]==data['candidate_shared_handler']['start'];assert struct.unpack_from('<BBhi',o.b,a+432)==(0xb7,3,0,flag)and struct.unpack_from('<BBhi',c.b,b+344)==(0xb7,4,0,flag)
  for index in[0,1,3]:
   oc,cc=r['original_calls'][index],r['candidate_calls'][index];f=cc['function'];assert o.calls[a+oc['offset']]==oc['target']and c.calls[b+cc['offset']]==f['start'];n=f['size'];assert o.normalized[oc['target']:oc['target']+n]==c.normalized[f['start']:f['start']+n]and o.pattern(oc['target'],n)==c.pattern(f['start'],n)
 assert struct.unpack_from('<BBhi',o.b,0x59408+24)==(0x79,0x78,8,0)
 assert struct.unpack_from('<BBhi',o.b,0x59408+3384)==(0x71,0x71,33,0)
 path=json.loads((W/'original-path-evidence.json').read_bytes());assert len(path['filename_references'])==2
 for r in path['filename_references']:
  p=0x59408+r['offset'];assert o.relocations[p]['type']==8;pointer=struct.unpack_from('<I',o.b,p+4)[0]|struct.unpack_from('<I',o.b,p+12)[0]<<32;assert pointer==r['pointer']and o.b[pointer:pointer+len(r['filename'])].decode()==r['filename']
 private=(W/'diagnostic/guard_private.ll').read_text();public=(W/'diagnostic/guard_public.ll').read_text();assert not any(x.startswith('define')and'handler'in x for x in private.splitlines());line=next(x for x in public.splitlines()if x.startswith('define')and'handler'in x);assert'dereferenceable(40) %ctx'in line and'i1 noundef zeroext %creator'in line
 for name in['guard_private.rs','guard_public.rs']:assert '#[inline'not in(W/'diagnostic'/name).read_text()and'no_mangle'not in(W/'diagnostic'/name).read_text()
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'base_candidate_sha256':CANDIDATE,'source_patch_sha256':PATCH,'original_wrappers':[1072,1072],'current_wrappers':[984,984],'original_handler_shared':True,'original_handler_bytes':4456,'current_handler_bytes':data['candidate_shared_handler']['size'],'original_selector_values':[0,1],'original_context_fields_read':[8,33],'public_object_context_bytes':40,'attributes_added_to_source':0,'full_build_performed':False,'runtime_executed':False,'scope':'Original call/field/path evidence plus attribute-free typed object calibration. Source relocation is unbuilt and must be measured in the combined candidate.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
