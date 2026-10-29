"""Bind final worker status metadata to its immutable manifest; receipts are audited independently."""
from pathlib import Path
import hashlib,json
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
J=lambda p:json.loads(Path(p).read_bytes())
def verify(root):
 w=Path(root);m=J(w/'worker-manifest.bytes')['files'];seal=H(w/'worker-manifest.bytes');v=J(w/'worker-final-verification.json');candidate=H(w/'build/artifacts/pump_amm_recovered.so')
 assert seal=='a155ac3b64834772725ad9b8285bbac5614ce50a7c15be6e54d81aa36c493def'and v['passed']and v['manifest_sha256']==seal and v['candidate_sha256']==candidate
 for n in ['finalization-ready.json','command-preflight.json','acceptance.json','broad-acceptance.json','additional-acceptance.json']:assert H(w/n)==m[n]
 f=J(w/'finalization-ready.json');assert f['candidate_sha256']==candidate and f['all_13_acceptance_jobs_passed']and f['strict_repeat']==J(w/'repeat-verification.json')
 assert f['proof_sha256']['command-preflight.json']==H(w/'command-preflight.json')
 c=J(w/'command-preflight.json');assert c['passed']and c['candidate_sha256']==candidate and len(c['commands'])==24
 b=f['dependency_binding'];assert b['new_native_dependency_artifacts']==0 and b['reused_native_dependency_artifacts']==3 and b['total_build_inputs_bound']==233
 assert(v['successful_acceptance_groups'],v['default_budget_resource_mismatches'],v['native_raw_source_differences'])==(13,4,14)
 return {'passed':True,'candidate_sha256':candidate,'worker_manifest_sha256':seal,'final_command_records':24,'current_successful_groups':13,'historical_native_origin':b['native_compilation_origin_candidate_sha256'],'new_native_artifacts':0,'reused_native_artifacts':3,'scope':'Final worker manifest and status provenance binding. Actual source, build and retained signed receipts are independently checked by the other components; omitted broad raw payloads remain in the sealed worker packet.'}
