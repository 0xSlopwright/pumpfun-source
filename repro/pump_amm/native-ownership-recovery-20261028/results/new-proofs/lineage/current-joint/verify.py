"""Verify current combined source/build and saved bounded receipts, without build/VM."""
from pathlib import Path
import contextlib,gzip,hashlib,io,json,shutil,subprocess,sys,tempfile,types

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_bytes())
def module(name,path,**bindings):
 m=types.ModuleType(name);m.__file__=str(path);m.__dict__.update(bindings)
 exec(compile(Path(path).read_bytes(),str(path),'exec'),m.__dict__);return m
def inventory(root):return {str(p.relative_to(root)):sha(p)for p in root.rglob('*')if p.is_file()}

def verify(root=None):
 P=Path(root)if root is not None else Path(__file__).resolve().parent
 manifest=read(P/'manifest.json')['files'];assert manifest=={str(p.relative_to(P)):sha(p)for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
 for name in manifest:
  p=P/name;assert not p.is_symlink()and not any(q.is_symlink()for q in p.parents if q!=P.parent)
 for name,entry in read(P/'compression-map.json').items():
  assert sha(P/entry['stored'])==entry['stored_sha256']
  assert hashlib.sha256(gzip.decompress((P/entry['stored']).read_bytes())).hexdigest()==entry['original_sha256']
 sys.path.insert(0,str(P));from elf_reader import Elf
 import measure
 C=P/'build/artifacts/pump_amm_recovered.so';U=P/'build/artifacts/unstripped.so';O=P/'runtime-inputs/evidence/original/pump_amm/deployed.so'
 assert sha(C)=='ea14ee8e5ea9a9b6695110fa141af77f378a21dcd36e159ae92279c9c6d6b593'
 o,c,u,b,bu=map(Elf,[O,C,U,P/'baseline/candidate.so',P/'baseline/unstripped.so'])
 summary,rows=measure.measured(o,c,u,b,bu);assert summary==read(P/'measurement.json')and rows==read(P/'measurement-full.json')['rows']
 assert(summary['normalized'],summary['raw'],summary['normalized_text_bytes'])==(658,148,830032)
 assert summary['normalized_gains']==['0x58028','0xf2d60']and not any(summary[k]for k in ['normalized_losses','raw_gains','raw_losses'])
 assert sum(any('__global'in f['name']for f in row['matches'])for row in rows)==38
 comp=read(P/'composition.json');assert comp['base_candidate_sha256']==sha(P/'baseline/candidate.so')and comp['candidate_sha256']==sha(C)
 assert comp['base_sources']==inventory(P/'baseline/source')and comp['source_sha256']==inventory(P/'source')
 assert len(comp['components'])==10 and sha(P/'recovery.patch')==comp['aggregate_patch_sha256']
 for item in comp['components']:assert sha(P/item['applied_patch'])==item['applied_sha256']
 with tempfile.TemporaryDirectory()as td:
  for name,patches in [('aggregate',[P/'recovery.patch']),('components',[P/x['applied_patch']for x in comp['components']])]:
   dest=Path(td)/name;shutil.copytree(P/'baseline/source',dest)
   for patch in patches:
    result=subprocess.run(['patch','--batch','--no-backup-if-mismatch','-p1','-i',str(patch.resolve())],cwd=dest,capture_output=True)
    assert result.returncode==0,(name,str(patch),result.stderr)
   assert inventory(dest)==comp['source_sha256']
 binding=module('current_source',P/'verify_source_binding.py').verify(P/'canonical-source',P/'source',P/'build/build-comparison.json',C,U,P/'dependency-proof')
 assert binding['total_compiled_inputs_verified']==232
 dep=module('current_dependencies',P/'dependency-proof/verify.py').verify(P/'canonical-source',P/'build/build-comparison.json',P/'dependency-proof')
 assert dep['unchanged_original_dependency_artifacts']==762 and dep['new_native_dependency_artifacts']==3
 first=read(P/'build/build-comparison.json');second=read(P/'build-repeat/build-comparison.json')
 assert first['source_sha256']==second['source_sha256']and len(first['source_sha256'])==232
 assert first['dependency_cache_before']==first['dependency_cache_after']==second['dependency_cache_before']==second['dependency_cache_after']and len(first['dependency_cache_after'])==765
 for name in ['pump_amm_recovered.so','unstripped.so']:assert(P/'build/artifacts'/name).read_bytes()==(P/'build-repeat/artifacts'/name).read_bytes()
 core=module('current_core',P/'core_audit.py',W=P).report
 private=module('current_private',P/'verify_cases.py').verify(P)
 incentive=module('current_incentive',P/'counterexamples/verify.py').verify(P/'counterexamples')
 with contextlib.redirect_stdout(io.StringIO()):extras=module('current_extras',P/'verify_extras.py').verify()
 cto=module('current_cto',P/'cto-controls/verify.py').verify(P/'cto-controls',expected_bad=0)
 retained=module('current_cto19',P/'cto-controls/retained19/verify.py').verify(P/'cto-controls/retained19')
 native=module('current_native',P/'native-focused/verify.py').verify({'original':sha(O),'baseline':sha(P/'baseline/candidate.so'),'candidate':sha(C)})
 assert native['raw_source_coordinate_differences']==14 and native['normalized_mismatches']==0
 assert(core['core']['cases'],private['cases'],incentive['cases'],extras['supplemental_cases'])==(17462,1502,1730,2811)
 assert retained['cases']==19 and cto['captured_cases']+cto['synthetic_cases']+retained['cases']==41
 ready=read(P/'finalization-ready.json');assert ready['candidate_sha256']==sha(C)and ready['all_13_acceptance_jobs_passed']
 assert len(ready['acceptance'])==13 and all(row['returncode']==0 for row in ready['acceptance'])
 for name,digest in ready['proof_files'].items():assert sha(P/name)==digest
 assert manifest=={str(p.relative_to(P)):sha(p)for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':sha(C),'normalized_windows':658,'raw_windows':148,'normalized_text_bytes':830032,'wrappers':38,'source_inputs':232,'original_dependencies_unchanged':762,'native_dependency_artifacts':3,'strict_repeat_identical':True,'core_cases':17462,'private_cases':1502,'incentive_cases':1730,'incentive_mismatches':0,'extras_cases_including_reused_sweep':2811,'cto_cases':41,'cto_mismatches':0,'native_cases':216,'native_raw_source_coordinate_differences':14,'native_normalized_mismatches':0,'broad_status_bound_without_duplicate_payloads':True,'whole_elf_equal':False,'executes_build_or_vm':False}

if __name__=='__main__':print(json.dumps(verify(),indent=2))
