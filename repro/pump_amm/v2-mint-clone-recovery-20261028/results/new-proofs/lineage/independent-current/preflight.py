from pathlib import Path
import gzip,hashlib,json,importlib.util
W=Path(__file__).resolve().parent
C='dbb5dcfd1a1487e22d61ae68d22a9b74087b78a868a08ab974c7bdbb127f1500'
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def J(p):
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def verify(w=W):
 assert H(w/'build/artifacts/pump_amm_recovered.so')==H(w/'build-repeat/artifacts/pump_amm_recovered.so')==C
 assert H(w/'build/artifacts/unstripped.so')==H(w/'build-repeat/artifacts/unstripped.so')
 for name in ['runtime/summary.json','cases-verification.json','sweep254-verification.json','counterexamples-verification.json','native-focused/report.json','decoder58.json','incentive700-verification.json','create246.json','canonical37.json','order60.json','policy-cpi/report.json','policy-cpi/highbudget-report.json']:
  data=J(w/name);assert data.get('candidate_sha256',data.get('image_sha256',{}).get('candidate'))==C,(name,data.keys())
 a=J(w/'acceptance.json');assert len(a)==13 and all(x['returncode']==0 for x in a)
 r=J(w/'repeat-verification.json');assert r['passed']and r['candidate_sha256']==C and r['source_inputs']==233 and r['dependency_artifacts']==765
 for n in ['verify_runtime.py','verify_cto.py','verify_native_focused.py','verify_decoder58.py','verify_components.py','verify_composition.py','verify_create_structure.py','verify_order.py','verify_policy_resource.py','verify_source_binding.py','workspace_recipe_v3.py','dependency-proof/manifest.json','compression-map.json']:
  assert(w/n).is_file(),n
 return {'passed':True,'candidate_sha256':C,'receipt_candidate_checks':13,'successful_standard_jobs':13,'repeat':True}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
