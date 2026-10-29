#!/usr/bin/env python3
"""Portable independent H18 composed helpers source, whole-window, closure and saved-receipt verification."""
from pathlib import Path,PurePosixPath
import gzip,hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True
def H(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def J(p):return json.loads(Path(p).read_bytes())
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def verify(root=None):
 w=Path(root or Path(__file__).parent).resolve();sys.path.insert(0,str(w));manifest=J(w/'manifest.json')['files']
 actual={str(p.relative_to(w))for p in w.rglob('*')if p.is_file()and '__pycache__'not in p.parts};assert actual==set(manifest)|{'manifest.json'}
 for name,digest in manifest.items():
  path=PurePosixPath(name);assert not path.is_absolute()and '..'not in path.parts
  p=w/name;assert not any(q.is_symlink()for q in(p,*p.parents)if q!=w.parent);assert H(p)==digest,name
 for name,row in J(w/'compression-map.json').items():
  assert H(w/name)==row['stored_sha256']and hashlib.sha256(gzip.decompress((w/name).read_bytes())).hexdigest()==row['uncompressed_sha256']
 module('current_preflight',w/'preflight.py').verify(w)
 static=module('current_independent_audit',w/'audit.py').static(w);assert static==J(w/'static-review.json')
 for name,output in [('verify_runtime','runtime-review.json'),('verify_cto','cto-review.json'),('verify_native_focused','native-focused-review.json'),('verify_decoder58','decoder58-review.json'),('verify_raw_gains','raw-gains-verification.json'),('verify_native_artifact','native-artifacts-verification.json'),('verify_components','component-review.json'),('verify_boundaries','boundary-review.json'),('verify_incentive700','incentive700-review.json'),('verify_composition','composition-review.json'),('verify_original_components','original-component-review.json'),('verify_worker_binding','worker-binding-review.json'),('verify_targeted','targeted-create-review.json'),('verify_create_structure','create-structure-review.json'),('verify_order','order-review.json'),('verify_policy_resource','policy-resource-review.json'),('verify_boost_controls','boost-controls-review.json')]:
  result=module('current_'+name,w/(name+'.py')).verify(w);assert result==J(w/output),name
 remaining=module('current_remaining_audit',w/'remaining_audit.py').analyze();assert remaining==J(w/'remaining-audit.json')
 assert remaining['metrics']['remaining_windows']==125 and remaining['candidate_sha256']==static['candidate_sha256']
 negative=module('current_negative_controls',w/'negative_controls.py').run(w);assert negative==J(w/'negative-controls.json')
 d=w/'h11-incentive';old=J(d/'prior-manifest.bytes')['files'];assert H(d/'joint.rs')==old['source/joint.rs']and H(d/'review.json')==old['review.json']
 assert(d/'joint.rs').read_bytes()==(w/'source/programs/pump-amm/src/state/volume_accumulator.rs').read_bytes()
 runtime=J(w/'runtime-review.json');assert J(d/'review.json')['corpus']['counterexamples']['count']==128 and runtime['incentive']['mismatches']==0
 acceptance=J(w/'acceptance.json');assert len(acceptance)==13 and all(v['returncode']==0 for v in acceptance)
 repeat=J(w/'repeat-verification.json');assert repeat['passed']and repeat['candidate_sha256']==static['candidate_sha256']and repeat['source_inputs']==233 and repeat['dependency_artifacts']==765
 for name in ['pump_amm_recovered.so','unstripped.so']:assert H(w/'build/artifacts'/name)==H(w/'build-repeat/artifacts'/name)
 return {'passed':True,'candidate_sha256':static['candidate_sha256'],'normalized_windows':660,'normalized_gained_windows':0,'component_patches':3,'added_source_files':1,'current_boost_supplemental_cases':14,'current_boost_supplemental_signatures':28,'current_create_cases':283,'current_create_signatures':566,'current_create_order_cases':60,'current_create_order_signatures':120,'canonical_store_skip_restored':True,'policy_default_cases':24,'policy_default_resource_differences':4,'policy_h16_default_resource_differences':4,'policy_high_budget_cases':24,'policy_high_budget_mismatches':0,'policy_signatures':144,'current_incentive700_cases':700,'raw_gained_windows':0,'raw_windows':159,'normalized_text_bytes':831376,'remaining_unmatched_windows':125,'typed_source_only_candidates':80,'code_or_shape_gaps':45,'bounded_static_closed_windows':595,'source_coordinate_closed_windows':588,'wrappers':38,'source_inputs':233,'dependency_roots':9,'old_dependency_artifacts':762,'native_dependency_artifacts':3,'native_artifact_mode':'reused_from_H15','current_incentive_boundary_cases':1730,'current_incentive_boundary_mismatches':0,'baseline_mismatches':128,'volume_accumulator_identical_to_h11':True,'summed_case_observations':20948,'summed_executions':42046,'summed_signature_fields':42710,'additional_cto_cases':41,'additional_cto_signatures':144,'additional_native_cases':216,'additional_native_signatures':648,'native_raw_source_coordinate_differences':14,'native_normalized_mismatches':0,'additional_decoder_cases':58,'additional_decoder_signatures':116,'additional_decoder_mismatches':0,'native_scanner_bytes':[1192,1168],'native_decoder_bytes':[664,656],'current_successful_job_statuses':13,'negative_controls':len(negative),'strict_repeat':True,'whole_elf_equal':False,'manifest_sha256':H(w/'manifest.json'),'scope':'Independent complete-window/typed closure and current saved signed observations; primary/additional suites overlap. No new compiler/VM and no whole-program identity claim.'}
if __name__=='__main__':print(json.dumps(verify(Path(sys.argv[1])if len(sys.argv)>1 else None),indent=2))
