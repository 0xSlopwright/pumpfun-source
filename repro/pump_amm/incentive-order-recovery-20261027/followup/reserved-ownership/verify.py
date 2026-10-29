"""Saved admin-state structural diagnostics; no VM/build execution."""
from pathlib import Path
import argparse,bisect,collections,hashlib,json,struct,types

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inv(p):return{str(f.relative_to(p)):sha(f)for f in p.rglob('*')if f.is_file()}
def module(p):
 p=Path(p);m=types.ModuleType('proof_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(directory):
 P=Path(directory);assert json.loads((P/'manifest.json').read_bytes())['files']=={k:v for k,v in inv(P).items()if k!='manifest.json'}
 E=module(P/'tools/elf_reader.py').Elf;obj=module(P/'tools/object_reader.py');o=E(P/'inputs/evidence/original/pump_amm/deployed.so');assert sha(o.path)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 configs=json.loads((P/'variants.json').read_bytes());results=[]
 for row in configs:
  D=P/row['name'];C=D/'build/artifacts/pump_amm_recovered.so';S=C.with_name('unstripped.so');c=E(C);s=E(S);assert sha(C)==row['candidate_sha256'];f=next(f for f in s.funcs if '18pump_amm_recovered27set_reserved_fee_recipients' in f['name']);assert f['size']==row['handler_bytes'];calls=c.callsites(f['start'],f['size']);assert len(calls)==row['call_count']
  index=collections.defaultdict(list)
  for g in s.funcs:index[g['size'],c.normalized[g['start']:g['start']+g['size']],json.dumps(c.pattern(g['start'],g['size']),sort_keys=True)].append(g)
  norm=raw=0
  for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
   found=index[z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True)];norm+=bool(found);raw+=any(o.b[a:z]==c.b[g['start']:g['start']+z-a]for g in found)
  assert(norm,raw)==(656,148)
  r=json.loads((D/'build/build-comparison.json').read_bytes());assert r['source_unchanged']and r['returncode']==0 and not r['priming']and r['source_sha256']==r['source_after_sha256'];assert r['dependency_cache_before']==r['dependency_cache_after']and len(r['dependency_cache_after'])==762
  suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in r['source_sha256']if k.endswith(suffix));assert inv(D/'source')=={k[len(prefix):]:v for k,v in r['source_sha256'].items()if k.startswith(prefix)}
  for n,h in r['source_sha256'].items():assert sha(P/'build-inputs'/n)==h
  assert sha(D/'build/build.log')==r['build_log_sha256'];assert 'Compiling pump-amm-recovered'in(D/'build/build.log').read_text()
  focused=module(P/'reserved-kit/verify.py').verify_output(P/'reserved-kit',C,D/'runtime/focused')
  core=module(P/'inputs/repro/pump_amm/transfer-abi-recovery-20261027/compare_direct_cached.py').audit(D/'runtime/core',sha(C));assert focused['cases']==21 and focused['signatures']==42 and core['cases']==157 and core['signature_fields']==314 and not core['mismatches']
  results.append({'name':row['name'],'candidate':sha(C),'normalized':norm,'raw':raw,'handler_bytes':f['size'],'calls':len(calls),'cases':178,'signatures':356})
 # Fingerprint actual dependency method with the natural owned argument ABI.
 method=next(f for f in obj.sections(P/'account-name/owned.o')if 'attach'in f['name']);assert method['size']==232 and method['code']==o.normalized[0x2288:0x2370]
 rel=[r for r in method['relocations']if r['type']==10];assert [r['offset']for r in rel]==[72,128]
 for r in rel:assert 'String$u20$as$u20$core..clone..Clone' in r['symbol']
 assert [(x['offset'],x['target'])for x in o.callsites(0x2288,232)]==[(72,0x1118f8),(128,0x1118f8)]
 assert [(site,target)for site,target in o.calls.items()if target==0x2288]==[(0x1aa10,0x2288)]
 # Caller has Error tag/pointer in r2/r3 and owned formatter String pointer in r4.
 assert o.b[0x1a9f8:0x1aa10]==bytes.fromhex('bf82000000000000bf73000000000000bf94000000000000')
 for name,n in [('borrowed',656),('str',656),('arguments',1096)]:
  f=next(x for x in obj.sections(P/'account-name'/(name+'.o'))if'attach'in x['name']);assert f['size']==n and f['code']!=method['code']
 vec=next(f for f in obj.sections(P/'collection-types/vec.o')if 'collect'in f['name']);box=next(f for f in obj.sections(P/'collection-types/boxed_slice.o')if 'collect'in f['name']);fixed=next(f for f in obj.sections(P/'collection-types/boxed_array.o')if 'collect'in f['name']);assert vec['size']==box['size']==936 and vec['code']==box['code'];assert fixed['size']==992 and fixed['code']!=vec['code']
 # Exact original heap bump decrement and seven-key tail copy, no class claim.
 assert struct.unpack_from('<BBhi',o.b,0x19170)==(7,1,0,-256)
 assert struct.unpack_from('<BBhi',o.b,0x194e0)==(183,3,0,224)
 assert o.calls[0x194e8]==0x119898 and o.calls[0x19500]==0x106f20
 return{'passed':True,'manifest_sha256':sha(P/'manifest.json'),'variants':results,'new_window_gains':0,'selected':False,'owned_string_helper_exact_normalized_bytes':232,'same_owned_string_callees':2,'vec_and_boxed_slice_distinguishable_in_microcode':False,'scope':'Three unselected structural source trials and bounded native-type fingerprints. No whole ELF/source identity or live execution claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
