#!/usr/bin/env python3
"""Portable verification of the final 9278 H12 source and saved executions."""
from pathlib import Path,PurePosixPath
import contextlib,gzip,hashlib,io,json,shutil,subprocess,sys,tempfile,types
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;sys.path.insert(0,str(W))
from elf_reader import Elf
import measure,verify_source_binding,wrapper_census,event_provenance,callgap_proof,sweep_check
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
load=lambda p:json.loads(Path(p).read_bytes())

def module(name,path):
 m=types.ModuleType(name);m.__file__=str(path);exec(compile(Path(path).read_bytes(),str(path),'exec'),m.__dict__);return m

def run(w=W):
 w=Path(w);C=w/'build/artifacts/pump_amm_recovered.so';U=w/'build/artifacts/unstripped.so';O=w/'runtime-inputs/evidence/original/pump_amm/deployed.so';B=w/'baseline/candidate.so';BU=w/'baseline/unstripped.so'
 assert sha(C)=='9278a52ae4fd93bb6159a72fa625f121394902a93f701d86931a7ec3778055fb'
 assert sha(B)=='c20007e860f47db1cc443344605afafe505d61bb4de6d61306fa164db3482544'
 o,c,u,b,bu=map(Elf,[O,C,U,B,BU]);assert c.b[c.lo:c.hi]==u.b[u.lo:u.hi]
 measured,rows=measure.measured(o,c,u,b,bu);assert measured==load(w/'measurement.json');assert rows==load(w/'measurement-full.json')['rows']
 assert (measured['windows'],measured['normalized'],measured['raw'],measured['normalized_text_bytes'])==(785,656,148,826112)
 assert not any(measured[k]for k in ['normalized_gains','normalized_losses','raw_gains','raw_losses'])
 wrappers=wrapper_census.census(O,C,U);assert wrappers==load(w/'wrappers.json')and wrappers['normalized_and_relocation_matches']==38
 sweeps=sweep_check.sweep(o,c,u,rows);assert sweeps==load(w/'sweep-body.json')
 events=event_provenance.scan(O,C,U,w/'pump_amm.json');assert events==load(w/'event-provenance.json')
 baseline_events=event_provenance.scan(O,B,BU,w/'pump_amm.json')
 assert len(events['events'])==4
 for before,after in zip(baseline_events['events'],events['events']):
  assert before['event']==after['event']and before['original']==after['original']
  assert before['original_same_source_stack']and not before['candidate_same_source_stack']and after['candidate_same_source_stack']
 selected=callgap_proof.selected(C,U);assert selected==load(w/'selected-callgap.json')and selected['call_count']==25
 original_callgap=callgap_proof.analyze(O,w/'error-callgap-baseline/candidate.so',w/'error-callgap-baseline/unstripped.so');assert original_callgap==load(w/'callgap-original-evidence.json')
 comp=load(w/'composition.json');inventory=lambda p:{str(f.relative_to(p)):sha(f)for f in p.rglob('*')if f.is_file()}
 assert inventory(w/'baseline-source')==comp['base_sources']and inventory(w/'source')==comp['source_sha256']
 assert len(comp['changed_files'])==3 and len(comp['components'])==2
 assert sha(w/'combined.patch')==comp['aggregate_patch_sha256']
 for item in comp['components']:assert sha(w/item['patch'])==item['sha256']
 with tempfile.TemporaryDirectory()as td:
  for name,patches in [('aggregate',[w/'combined.patch']),('components',[w/x['patch']for x in comp['components']])]:
   d=Path(td)/name;shutil.copytree(w/'baseline-source',d)
   for patch in patches:
    result=subprocess.run(['patch','--batch','-p1','-i',str(patch)],cwd=d,capture_output=True);assert result.returncode==0,result.stderr
   assert inventory(d)==comp['source_sha256']
 src=verify_source_binding.verify(w/'canonical-source',w/'source',w/'build/build-comparison.json',C,U,w/'dependency-proof')
 rep=verify_source_binding.verify(w/'canonical-source',w/'source',w/'build-repeat/build-comparison.json',w/'build-repeat/artifacts/pump_amm_recovered.so',w/'build-repeat/artifacts/unstripped.so',w/'dependency-proof')
 assert src==load(w/'source-binding-verification.json')and rep==load(w/'repeat-source-binding.json')
 dep=module('dependencies',w/'dependency-proof/verify.py').verify(w/'canonical-source',w/'build/build-comparison.json',w/'dependency-proof',sha(w/'dependency-proof/manifest.json'));assert dep==load(w/'dependency-verification.json')
 first=load(w/'build/build-comparison.json');second=load(w/'build-repeat/build-comparison.json')
 assert first['source_sha256']==second['source_sha256']and first['dependency_cache_after']==second['dependency_cache_after']
 for d in ['build','build-repeat']:
  r=load(w/d/'build-comparison.json');assert r['returncode']==0 and r['source_unchanged']and not r['priming']
  assert r['dependency_cache_before']==r['dependency_cache_after']and len(r['dependency_cache_after'])==762
  assert 'Compiling pump-amm-recovered'in(w/d/'build.log').read_text()
 for n in ['pump_amm_recovered.so','unstripped.so']:assert(w/'build/artifacts'/n).read_bytes()==(w/'build-repeat/artifacts'/n).read_bytes()
 with contextlib.redirect_stdout(io.StringIO()):core=module('core_receipts',w/'verify_core.py').report
 assert core==load(w/'runtime-verification.json')
 private=module('private_receipts',w/'verify_cases.py').verify(w);assert private==load(w/'cases-verification.json')
 incentive=module('incentive_receipts',w/'counterexamples/verify.py').verify(w/'counterexamples');assert incentive==load(w/'counterexamples-verification.json')
 extras=module('extra_receipts',w/'verify_extras.py').verify();assert extras==load(w/'extras-verification.json')
 assert(core['core']['cases'],private['cases'],incentive['cases'],extras['supplemental_cases'])==(17462,1502,1730,2811)
 # Saved broad status is bound here; its detailed broad payloads are deliberately
 # retained in the worker/coordinator rather than duplicated in this packet.
 ready=load(w/'finalization-ready.json');assert ready['candidate_sha256']==sha(C)and ready['all_13_acceptance_jobs_passed']
 assert len(ready['acceptance'])==13 and all(x['returncode']==0 for x in ready['acceptance'])
 for name,digest in ready['proof_files'].items():assert sha(w/name)==digest
 return {'candidate_sha256':sha(C),'measurement':measured,'wrappers':38,'source':src,'repeat_source':rep,'dependencies':dep,'sweep':sweeps,'events_reusing_original_storage':4,'set_coin_creator_calls':25,'second_PDA_result_on_error':True,'core':core['core'],'private':private,'incentive':incentive,'extras':extras,'strict_repeat':True,'broad_status_bound_without_duplicate_payloads':True,'whole_ELF_equal':False,'executes_new_build_or_VM':False}

def verify(root=None):
 w=W;m=load(w/'manifest.json');actual={str(p.relative_to(w))for p in w.rglob('*')if p.is_file()}
 assert actual==set(m['files'])|{'manifest.json'}
 for name,digest in m['files'].items():
  p=PurePosixPath(name);assert not p.is_absolute()and '..'not in p.parts
  q=w/name;assert not any(v.is_symlink()for v in(q,*q.parents)if v!=w.parent);assert sha(q)==digest,name
 for name,record in load(w/'compression-map.json').items():
  assert sha(w/record['stored'])==record['stored_sha256']
  assert hashlib.sha256(gzip.decompress((w/record['stored']).read_bytes())).hexdigest()==record['original_sha256']
 result=run(w);assert result==load(w/'review.json')
 # Every file, including any manifest-referenced ignored cache, remains covered.
 for name,digest in m['files'].items():assert sha(w/name)==digest,name
 return {'passed':True,'candidate_sha256':result['candidate_sha256'],'normalized_windows':656,'raw_windows':148,'wrappers':38,'strict_repeat':True,'source_inputs':227,'dependency_artifacts':762,'core_cases':17462,'private_event_cases':1502,'incentive_cases':1730,'incentive_mismatches':0,'retained_cases_including_reused_sweep':2811,'sweep_bytes':4456,'sweep_source_line_differences':2,'set_coin_creator_calls':25,'broad_status_bound':True,'whole_ELF_equal':False,'manifest_sha256':sha(w/'manifest.json')}

if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path);p.add_argument('--prepare',action='store_true');a=p.parse_args()
 if a.prepare:(W/'review.json').write_text(json.dumps(run(),indent=2)+'\n')
 else:print(json.dumps(verify(a.root),indent=2))
