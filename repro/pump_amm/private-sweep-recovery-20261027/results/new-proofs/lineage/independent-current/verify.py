#!/usr/bin/env python3
from pathlib import Path,PurePosixPath
import collections,gzip,hashlib,json,sys
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W))
import audit,verify_runtime,negative_controls
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
J=lambda p:json.loads(Path(p).read_bytes())

def verify(root=None):
 w=Path(__file__).resolve().parent;m=J(w/'manifest.json');actual={str(p.relative_to(w))for p in w.rglob('*')if p.is_file()and '__pycache__'not in p.parts};assert actual==set(m['files'])|{'manifest.json'}
 for n,h in m['files'].items():
  p=PurePosixPath(n);assert not p.is_absolute()and '..'not in p.parts
  x=w/n;assert not any(q.is_symlink()for q in(x,*x.parents)if q!=w.parent);assert H(x)==h,n
 for n,row in J(w/'compression-map.json').items():assert hashlib.sha256(gzip.decompress((w/n).read_bytes())).hexdigest()==row['uncompressed_sha256']and H(w/n)==row['stored_sha256']
 static=audit.static(w);assert static==J(w/'static-review.json');runtime=verify_runtime.verify(w);assert runtime==J(w/'runtime-review.json');controls=negative_controls.run(w);assert controls==J(w/'negative-controls.json')
 ledger=J(w/'remaining-ledger.json');meas=J(w/'measurement-full.json');assert ledger['candidate_sha256']==meas['candidate_sha256']==static['candidate_sha256'];assert len(ledger['rows'])==129
 expected={(r['start'],r['end'])for r in meas['rows']if not r['matches']};assert{(r['start'],r['end'])for r in ledger['rows']}==expected and len(expected)==129;assert dict(collections.Counter(r['domain']for r in ledger['rows']))==ledger['domain_counts']
 d=w/'h11-incentive';assert H(d/'prior-manifest.bytes')=='d24301590134bbb87909edbe492fb0f03c8118da54c8ae6903e8c6a577db6890';old=J(d/'prior-manifest.bytes')['files'];assert H(d/'joint.rs')==old['source/joint.rs']and H(d/'review.json')==old['review.json'];assert(d/'joint.rs').read_bytes()==(w/'source/programs/pump-amm/src/state/volume_accumulator.rs').read_bytes();baseline=J(d/'review.json')['corpus']['counterexamples']['count'];assert baseline==128
 fresh=runtime['incentive'];assert(fresh['cases'],fresh['mismatches'])==(1730,0);assert fresh['candidate_sha256']==static['candidate_sha256']
 return {'passed':True,'candidate_sha256':static['candidate_sha256'],'normalized_windows':static['measurement']['normalized'],'raw_windows':static['measurement']['raw'],'normalized_text_bytes':static['measurement']['normalized_text_bytes'],'remaining_unmatched_windows':129,'bounded_static_closed_windows':static['bounded_static_closure']['bounded_static_closed_windows'],'source_coordinate_closed_windows':static['including_source_coordinates']['bounded_static_closed_windows'],'wrappers':static['wrappers'],'source_inputs':static['source']['source_inputs'],'dependency_roots':static['source']['dependency_roots'],'current_incentive_boundary_cases':fresh['cases'],'current_incentive_boundary_mismatches':fresh['mismatches'],'baseline_mismatches':baseline,'volume_accumulator_identical_to_h11':True,'summed_case_observations':runtime['summed_case_observations'],'summed_executions':runtime['summed_executions'],'summed_signature_fields':runtime['summed_signature_fields'],'negative_controls':len(controls),'strict_repeat':False,'whole_elf_equal':False,'manifest_sha256':H(w/'manifest.json'),'scope':'Independent recomputation of source/build binding, complete window census, bounded call/data closure, local event/PDA/sweep origins and saved signed observations. Overlapping suites; no new compiler/VM or whole-program identity claim.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
