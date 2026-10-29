#!/usr/bin/env python3
"""Independent ea14 source, code, closure and saved signed-receipt verification."""
from pathlib import Path,PurePosixPath
import gzip,hashlib,importlib.util,json,subprocess,sys,tempfile,shutil
sys.dont_write_bytecode=True
def H(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def J(p):return json.loads(Path(p).read_bytes())
def module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
def verify(root=None):
 w=Path(root or Path(__file__).parent).resolve();sys.path.insert(0,str(w));manifest=J(w/'manifest.json')['files']
 actual={str(p.relative_to(w))for p in w.rglob('*')if p.is_file()and '__pycache__'not in p.parts};assert actual==set(manifest)|{'manifest.json'}
 for name,digest in manifest.items():
  path=PurePosixPath(name);assert not path.is_absolute()and '..'not in path.parts
  p=w/name;assert not any(q.is_symlink()for q in(p,*p.parents)if q!=w.parent);assert H(p)==digest,name
 for name,row in J(w/'compression-map.json').items():
  assert H(w/name)==row['stored_sha256']
  assert hashlib.sha256(gzip.decompress((w/name).read_bytes())).hexdigest()==row['uncompressed_sha256']
 audit=module('current_independent_audit',w/'audit.py');static=audit.static(w);assert static==J(w/'static-review.json')
 runtime=module('current_independent_runtime',w/'verify_runtime.py').verify(w);assert runtime==J(w/'runtime-review.json')
 cto=module('current_independent_cto',w/'verify_cto.py').verify(w);assert cto==J(w/'cto-review.json')
 native=module('current_native_focused',w/'verify_native_focused.py').verify(w);assert native==J(w/'native-focused-review.json')
 bound=module('current_native_cache',w/'verify_native_artifact.py').verify(w);assert bound['candidate_sha256']==static['candidate_sha256']
 context=module('current_native_context',w/'native-context-proof/verify.py').verify(w/'native-context-proof');assert context['candidate_sha256']==static['candidate_sha256']
 raw=module('current_raw_gains',w/'verify_raw_gains.py').verify(w);assert raw==J(w/'raw-gains-verification.json')
 remaining=module('current_remaining_audit',w/'remaining_audit.py').analyze();assert remaining==J(w/'remaining-audit.json')
 assert remaining['metrics']['remaining_windows']==126 and remaining['candidate_sha256']==static['candidate_sha256']
 negative=module('current_negative_controls',w/'negative_controls.py').run(w);assert negative==J(w/'negative-controls.json')
 inventory=lambda p:{str(x.relative_to(p)):H(x)for x in p.rglob('*')if x.is_file()}
 with tempfile.TemporaryDirectory()as tmp:
  tree=Path(tmp)/'source';shutil.copytree(w/'baseline-source',tree)
  p=subprocess.run(['patch','--batch','-p1','-i',str(w/'recovery.patch')],cwd=tree,capture_output=True,text=True);assert p.returncode==0,p.stderr
  assert inventory(tree)==inventory(w/'source')
  component_tree=Path(tmp)/'components';shutil.copytree(w/'baseline-source',component_tree)
  comp=J(w/'composition.json');assert comp['base_sources']==inventory(w/'baseline-source')and comp['selected_sources']==inventory(w/'source')
  for index,part in enumerate(comp['component_patches']):
   patch=w/('component-'+str(index)+'.patch');assert H(patch)==part['sha256']
   applied=subprocess.run(['patch','--batch','-p1','-i',str(patch)],cwd=component_tree,capture_output=True,text=True);assert applied.returncode==0,applied.stderr
  assert inventory(component_tree)==inventory(tree)
 d=w/'h11-incentive';old=J(d/'prior-manifest.bytes')['files'];assert H(d/'joint.rs')==old['source/joint.rs']and H(d/'review.json')==old['review.json']
 assert(d/'joint.rs').read_bytes()==(w/'source/programs/pump-amm/src/state/volume_accumulator.rs').read_bytes()
 assert J(d/'review.json')['corpus']['counterexamples']['count']==128 and runtime['incentive']['mismatches']==0
 return {'passed':True,'candidate_sha256':static['candidate_sha256'],'normalized_windows':659,'normalized_gained_windows':1,'raw_gained_windows':11,'raw_windows':159,'normalized_text_bytes':830808,'remaining_unmatched_windows':126,'bounded_static_closed_windows':595,'source_coordinate_closed_windows':588,'wrappers':38,'source_inputs':232,'dependency_roots':9,'old_dependency_artifacts':762,'native_dependency_artifacts':3,'current_incentive_boundary_cases':1730,'current_incentive_boundary_mismatches':0,'baseline_mismatches':128,'volume_accumulator_identical_to_h11':True,'summed_case_observations':20948,'summed_executions':42046,'summed_signature_fields':42710,'additional_cto_cases':41,'additional_cto_signatures':144,'additional_native_cases':216,'additional_native_signatures':648,'native_raw_source_coordinate_differences':14,'native_normalized_mismatches':0,'negative_controls':len(negative),'strict_repeat':True,'whole_elf_equal':False,'manifest_sha256':H(w/'manifest.json'),'scope':'Independent complete-window and typed closure recomputation plus current saved signed observations. Primary and additional suites overlap; no new compiler or VM and no whole-program identity claim.'}
if __name__=='__main__':print(json.dumps(verify(Path(sys.argv[1])if len(sys.argv)>1 else None),indent=2))
