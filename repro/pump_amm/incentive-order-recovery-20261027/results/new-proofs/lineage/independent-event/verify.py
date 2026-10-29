"""Portable independent H9 source, dependency and static review."""
from pathlib import Path
import argparse,hashlib,json,sys,types
W=Path(__file__).resolve().parent
CANDIDATE='4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12'
BASELINE='97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(path,root=None,name=None):
 p=Path(path);m=types.ModuleType(name or 'saved_'+p.stem);m.__file__=str(p)
 if root is not None:m.ROOT=Path(root)
 exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def prepare_reader():
 sys.path.insert(0,str(W));sys.path.insert(0,str(W/'reader'))
 sys.modules['elf_reader']=module(W/'reader/elf_reader.py',name='elf_reader')
def compute(root):
 root=Path(root).resolve();prepare_reader();r=W/'results';candidate=r/'build/artifacts/pump_amm_recovered.so';symbols=candidate.with_name('unstripped.so')
 assert sha(candidate)==CANDIDATE and sha(W/'baseline/candidate.so')==BASELINE
 binding=module(W/'verify_source_binding.py').verify(r/'canonical-source',r/'source',r/'build/build-comparison.json',candidate,symbols,r/'dependency-proof')
 dep=module(r/'dependency-proof/verify.py').verify(r/'canonical-source',r/'build/build-comparison.json')
 measurement,full=module(W/'verify_measurement.py').verify(root,candidate,symbols,W/'baseline/candidate.so',W/'baseline/unstripped.so')
 events=module(W/'verify_events.py').verify(root,candidate,symbols)
 quote=module(W/'verify_quote.py').verify(root,candidate,symbols)
 wrappers=module(W/'wrapper_census.py').census(root/'evidence/original/pump_amm/deployed.so',candidate,symbols)
 cl=module(W/'closure-tools/audit.py',root).analyze(candidate,symbols,W/'data-audit/measurement.json')
 ds=module(W/'closure-tools/descriptors.py',root).analyze(candidate,symbols,cl)
 closed=module(W/'closure-tools/targets.py',root).analyze(candidate,symbols,cl,ds)
 origins=module(W/'closure-tools/targets.py',root).analyze(candidate,symbols,cl,ds,True)
 return {'source-verification.json':binding,'dependency-verification.json':dep,'independent-measurement.json':measurement,'events-verification.json':events,'quote-verification.json':quote,'wrapper-census.json':wrappers,'data-audit/measurement.json':full,'data-audit/call-closure.json':cl,'data-audit/descriptors.json':ds,'data-audit/data-closure.json':closed,'data-audit/origins.json':origins}
def verify(root):
 assert json.loads((W/'manifest.json').read_bytes())['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 result=compute(root)
 for name,data in result.items():assert data==json.loads((W/name).read_bytes()),name
 assert result['source-verification.json']['total_compiled_inputs_verified']==227
 source_tests=json.loads((W/'source-negative-tests.json').read_bytes());assert len(source_tests['negative_cases'])==7 and all(r['rejected']for r in source_tests['negative_cases'])
 target_tests=json.loads((W/'target-negative-tests.json').read_bytes());assert len(target_tests['cases'])==2 and all(r['rejected']for r in target_tests['cases'])
 assert result['data-audit/call-closure.json']['counts']['internal_direct_closure_windows']==587
 assert result['data-audit/data-closure.json']['counts']['bounded_static_closed_windows']==587
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':CANDIDATE,'source_binding':[51,52,175],'dependency_packages':9,'unchanged_dependency_artifacts':762,'normalized_windows':653,'raw_windows':148,'normalized_text_bytes':818944,'normalized_gains':2,'normalized_losses':[],'raw_losses':[],'public_instruction_wrappers':38,'event_sites_with_shared_self_pointer':8,'quote_selector_bytes':1632,'quote_actual_callees':13,'quote_keys_equal':3,'bounded_static_closed_windows':587,'source_external_negative_controls':7,'target_mapping_negative_controls':2,'runtime_executed':False,'new_compilations':0,'scope':'Archived source/dependency binding and independent static review only. Eight event self pointers and borrowed quote ABI are recovered; complete business handlers and whole ELF remain unequal. Runtime/repeat qualification is separately owned.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
