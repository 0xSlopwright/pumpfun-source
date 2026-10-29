"""Portable read-only verification of the CreatePool and incentive mint composition and saved observations."""
from pathlib import Path,PurePosixPath
import difflib,gzip,hashlib,json,re,sys,types
sys.dont_write_bytecode=True
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):
 p=Path(p)
 if not p.exists():p=p.with_suffix(p.suffix+'.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(n,p):
 m=types.ModuleType(n);m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def verify(root=None):
 w=Path(root or Path(__file__).resolve().parent).resolve();sys.path.insert(0,str(w));inventory=read(w/'manifest.json')['files']
 assert {str(p.relative_to(w))for p in w.rglob('*')if p.is_file()}==set(inventory)|{'manifest.json'}
 for n,h in inventory.items():
  r=PurePosixPath(n);assert not r.is_absolute()and'..'not in r.parts
  assert sha(w/n)==h,n
 c=w/'build/artifacts/pump_amm_recovered.so';s=w/'build/artifacts/unstripped.so';h=sha(c)
 assert h=='9e4891b1a25fc8f7413e1e9f2ed8e5730a1c39301e306ab68fc4e82acfd952c3'
 assert sha(s)=='482734719c6cc37668896a4f1c2ce3ca8dc745706054ad14e07661651220c587'
 assert sha(w/'baseline-artifacts/pump_amm_recovered.so')=='e33e6aace7d53008b3300364c07540f0cd7d1764196cd601554b08838b06e615'
 for n in ['pump_amm_recovered.so','unstripped.so']:assert(w/'build/artifacts'/n).read_bytes()==gzip.decompress((w/'build-repeat/artifacts'/(n+'.gz')).read_bytes())
 dependency=module('native_scanners_dependency',w/'dependency-proof/verify.py').verify(w/'canonical-source',w/'build/build-comparison.json',w/'dependency-proof')
 source=module('native_scanners_source',w/'verify_source_binding.py').verify(w/'canonical-source',w/'source',w/'build/build-comparison.json',c,s,w/'dependency-proof')
 assert source['total_compiled_inputs_verified']==232 and dependency['unchanged_dependency_artifacts']==765
 for n,t in [('source','source-manifest.json'),('base-source','base-source-manifest.json')]:
  v=read(w/t);assert len(v)==57 and v=={str(p.relative_to(w/n)):sha(p)for p in(w/n).rglob('*')if p.is_file()}
 a=read(w/'source-manifest.json');b=read(w/'base-source-manifest.json');changed={n for n in a if a[n]!=b[n]}
 assert changed=={'programs/pump-amm/src/incentives.rs','programs/pump-amm/src/instructions/create_pool.rs'}
 comp=read(w/'composition.json');assert comp['base_candidate_sha256']==sha(w/'baseline-artifacts/pump_amm_recovered.so')
 assert comp['aggregate_patch_sha256']==sha(w/'recovery.patch')
 assert [(x['name'],x['sha256'])for x in comp['components']]==[('create_arguments',sha(w/'components/create_arguments.patch')),('incentive_mint_snapshot',sha(w/'components/incentive_mint_snapshot.patch'))]
 patch=(w/'recovery.patch').read_text();order=re.findall(r'^--- a/(.+)$',patch,re.M);assert set(order)==changed and len(order)==len(changed)
 expected=''.join(''.join(difflib.unified_diff((w/'base-source'/n).read_text().splitlines(True),(w/'source'/n).read_text().splitlines(True),fromfile='a/'+n,tofile='b/'+n))for n in order)
 assert expected==patch
 from elf_reader import Elf
 import measure
 o=Elf(w/'runtime-inputs/evidence/original/pump_amm/deployed.so');celf=Elf(c);uelf=Elf(s);base=Elf(w/'baseline-artifacts/pump_amm_recovered.so');bu=Elf(w/'baseline-artifacts/unstripped.so')
 metric,rows=measure.measured(o,celf,uelf,base,bu);assert metric==read(w/'measurement.json')
 assert read(w/'measurement-full.json')==metric|{'rows':rows}
 assert (metric['normalized'],metric['raw'],metric['windows'],metric['normalized_text_bytes'])==(660,159,785,831376)
 assert metric['normalized_gains']==[]and not metric['normalized_losses']and not metric['raw_losses']and not metric['raw_gains']
 wrappers=module('native_scanners_wrappers',w/'wrapper_census.py').census(w/'runtime-inputs/evidence/original/pump_amm/deployed.so',c,s)
 assert wrappers==read(w/'wrappers.json')and wrappers['normalized_and_relocation_matches']==38
 for name,size in [('decode_transfer_fees',656),('supported_mint_data',1168)]:
  found=[f for f in uelf.funcs if name in f['name']];assert len(found)==1 and found[0]['size']==size
 context=module('create_context',w/'context_check.py').verify(w);assert context==read(w/'context-verification.json')
 create=module('create_targeted',w/'verify_targeted.py').verify(w);assert create==read(w/'targeted-create-verification.json')
 incentives=module('incentive700',w/'incentive700/verify.py').verify(w/'incentive700',c,repository_root=w/'runtime-inputs');assert incentives==read(w/'incentive700-verification.json')
 core=module('native_scanners_core',w/'verify_core.py')
 private=module('native_scanners_private',w/'verify_cases.py').verify(w)
 sweep=module('native_scanners_sweep',w/'verify_sweep.py').verify(w/'sweep-inputs',c,w/'sweep254',w/'observe_sweep.py')
 incentive=module('native_scanners_incentive',w/'counterexamples/verify.py').verify(w/'counterexamples')
 native=module('native_scanners_native',w/'verify_native_focused.py').verify(w)
 decoder=module('native_scanners_decoder58',w/'verify_decoder58.py').verify(w)
 cto=module('native_scanners_cto',w/'cto-controls/verify.py').verify(w/'cto-controls',expected_bad=0)
 retained=module('native_scanners_cto19',w/'cto-controls/retained19/verify.py').verify(w/'cto-controls/retained19')
 extra=module('native_scanners_extras',w/'verify_extras.py').verify()
 assert extra['supplemental_cases']==2811 and private['cases']==1502 and sweep['cases']==254 and incentive['cases']==1730 and incentive['mismatches']==0
 assert native['cases']==216 and native['raw_source_coordinate_differences']==14 and native['only_two_exact_source_coordinate_triples']
 assert decoder['cases']==58 and not decoder['mismatches']
 status=read(w/'acceptance.json');assert len(status)==13 and all(x['returncode']==0 for x in status)
 assert {x.get('suite',x.get('name'))for x in status}=={'private1502','sweep254','current1730','fullcore17462','regression','refinements','liquidity-focused','expanded','recovery','extra-controls','retained-extras','targeted-admin','program-identity32'}
 ready=read(w/'finalization-ready.json');assert ready['candidate_sha256']==h and ready['all_13_acceptance_jobs_passed']
 for n,digest in ready['proof_sha256'].items():assert sha(w/n)==digest
 return {'passed':True,'candidate_sha256':h,'normalized_windows':660,'raw_windows':159,'remaining_windows':125,'normalized_text_bytes':831376,'wrappers':38,'exact_repeat':True,'source_inputs':232,'fixed_dependencies':765,'new_native_artifacts':0,'reused_native_artifacts':3,'additional_incentive_cases':700,'additional_create_cases':283,'core_cases':17462,'incentive_cases':1730,'private_cases':1502,'sweep_cases':254,'native_cases':216,'native_raw_source_differences':14,'decoder_cases':58,'cto_cases':41,'supplemental_cases':2811,'successful_acceptance_groups':13,'whole_elf_identity':False,'runtime_reexecuted_by_verifier':False,'manifest_sha256':sha(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
