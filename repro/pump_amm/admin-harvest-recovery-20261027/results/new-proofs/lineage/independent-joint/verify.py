"""Portable independent joint-candidate source/dependency and static proof."""
from pathlib import Path
import argparse,hashlib,json,sys,types
W=Path(__file__).resolve().parent
CANDIDATE='0881a95dafe465623c7220fb3da84b3f9c7d9b0094d572f62487f05cbd80a07c'
BASELINE='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(path,root=None):
 p=Path(path);m=types.ModuleType('saved_'+p.stem);m.__file__=str(p)
 if root is not None:m.ROOT=Path(root)
 exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(root):
 root=Path(root).resolve();manifest=json.loads((W/'manifest.json').read_bytes());assert manifest['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 sys.path[:0]=[str(W),str(W/'reader')];r=W/'results';candidate=r/'build/artifacts/pump_amm_recovered.so';symbols=candidate.with_name('unstripped.so');assert sha(candidate)==CANDIDATE and sha(W/'baseline/candidate.so')==BASELINE and sha(r/'dependency-proof/builder-executed.py')=='a5565b5d4bd8ad196913444496cda170d701f3be4c3570bf878e5d2787de9cca'
 binding=module(W/'verify_source_binding.py').verify(r/'canonical-source',r/'source',r/'build/build-comparison.json',candidate,symbols,r/'dependency-proof');assert(binding['standalone_inputs'],binding['workspace_inputs'],binding['external_inputs_verified'])==(51,52,175)
 dep=module(r/'dependency-proof/verify.py').verify(r/'canonical-source',r/'build/build-comparison.json');assert dep['target_mount_verified']
 measurement=module(W/'verify_measurement.py').verify(root,candidate,symbols,W/'baseline/candidate.so',W/'baseline/unstripped.so');assert measurement==json.loads((W/'independent-measurement.json').read_bytes())
 gains=module(W/'verify_gains.py').verify(root,candidate,symbols);assert gains==json.loads((W/'gains-verification.json').read_bytes())
 a=module(W/'closure-tools/audit.py',root);cl=a.analyze(candidate,symbols,W/'data-audit/measurement.json');assert cl==json.loads((W/'data-audit/call-closure.json').read_bytes())
 d=module(W/'closure-tools/descriptors.py',root);ds=d.analyze(candidate,symbols,cl);assert ds==json.loads((W/'data-audit/descriptors.json').read_bytes())
 t=module(W/'closure-tools/targets.py',root);closed=t.analyze(candidate,symbols,cl,ds);assert closed==json.loads((W/'data-audit/data-closure.json').read_bytes());origins=t.analyze(candidate,symbols,cl,ds,True);assert origins==json.loads((W/'data-audit/origins.json').read_bytes())
 assert(cl['counts']['internal_direct_closure_windows'],closed['counts']['bounded_static_closed_windows'])==(587,587)
 return {'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':CANDIDATE,'source_binding':[51,52,175],'total_build_inputs':227,'dependency_packages':dep['packages'],'unchanged_dependency_artifacts':dep['unchanged_dependency_artifacts'],'target_mount_verified':True,'normalized_windows':measurement['normalized'],'raw_windows':measurement['raw'],'normalized_gains':4,'raw_gains':0,'normalized_losses':measurement['normalized_losses'],'raw_losses':measurement['raw_losses'],'new_exact_actual_callees':gains['exact_actual_direct_targets'],'new_unmatched_handler_callees':len(gains['unmatched_business_handler_calls']),'bounded_static_closed_windows':587,'runtime_executed':False,'new_compilations':0,'scope':'Independent archived source,metadata and static review. Strict repeat and runtime qualification are separately owned.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
