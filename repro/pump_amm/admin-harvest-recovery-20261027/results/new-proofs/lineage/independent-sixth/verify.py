"""Offline independent sixth-candidate recount and portable227-input binding."""
from pathlib import Path
import argparse,hashlib,json,sys,types
W=Path(__file__).resolve().parent
sys.dont_write_bytecode=True
CANDIDATE='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(path,root=None):
 p=Path(path);m=types.ModuleType('saved_'+p.stem);m.__file__=str(p);m.__dict__['ROOT']=root;exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(root):
 root=Path(root).resolve();manifest=json.loads((W/'manifest.json').read_bytes());assert manifest['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 sys.path.insert(0,str(W));sys.path.insert(0,str(W/'reader'))
 r=W/'results';candidate=r/'build/artifacts/pump_amm_recovered.so';symbols=candidate.with_name('unstripped.so');assert sha(candidate)==CANDIDATE and sha(r/'dependency-proof/builder-executed.py')=='a5565b5d4bd8ad196913444496cda170d701f3be4c3570bf878e5d2787de9cca'
 gate=module(W/'verify_source_binding.py');binding=gate.verify(r/'canonical-source',r/'source',r/'build/build-comparison.json',candidate,symbols,r/'dependency-proof');assert(binding['standalone_inputs'],binding['workspace_inputs'],binding['external_inputs_verified'])==(51,52,175)
 dep=module(r/'dependency-proof/verify.py').verify(r/'canonical-source',r/'build/build-comparison.json');assert dep['target_mount_verified']
 baseline=W/'baseline';assert sha(baseline/'candidate.so')=='7f501a865b83cf1dfbc4072191967162c700d3e7e487d2f6400e8d230f15ca62' and sha(baseline/'unstripped.so')=='e212a9725a3359bcbfd1c3dea67fa1457d15dc8600272391724cdaffc7819282';measurement=module(W/'verify_measurement.py').verify(root,candidate,symbols,baseline/'candidate.so',baseline/'unstripped.so');assert measurement==json.loads((W/'independent-measurement.json').read_bytes())
 quote=module(W/'verify_quote.py').verify(root,candidate,symbols);assert quote==json.loads((W/'quote-verification.json').read_bytes())
 a=module(W/'closure-tools/audit.py',root);a.ROOT=root;a.ORIGINAL=root/'evidence/original/pump_amm/deployed.so';cl=a.analyze(candidate,symbols,W/'data-audit/measurement.json');assert cl==json.loads((W/'data-audit/call-closure.json').read_bytes())
 d=module(W/'closure-tools/descriptors.py',root);d.ROOT=root;ds=d.analyze(candidate,symbols,cl);assert ds==json.loads((W/'data-audit/descriptors.json').read_bytes())
 t=module(W/'closure-tools/targets.py',root);t.ROOT=root;closed=t.analyze(candidate,symbols,cl,ds);assert closed==json.loads((W/'data-audit/data-closure.json').read_bytes())
 data=module(W/'verify_data_boundaries.py').verify(root,candidate,symbols);assert data==json.loads((W/'data-boundaries-verification.json').read_bytes())
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':CANDIDATE,'source_binding':[binding['standalone_inputs'],binding['workspace_inputs'],binding['external_inputs_verified']],'total_build_inputs':227,'dependency_packages':dep['packages'],'target_mount_verified':True,'normalized_windows':measurement['normalized'],'raw_windows':measurement['raw'],'raw_gains':len(measurement['raw_gains']),'normalized_losses':measurement['normalized_losses'],'raw_losses':measurement['raw_losses'],'quote_helper_bytes':quote['normalized_bytes'],'quote_direct_calls':len(quote['callees']),'quote_data_constants':len(quote['data_objects']),'bounded_static_closed_windows':data['bounded_static_closed_windows'],'source_coordinates_remaining':data['source_coordinate_observations'],'known_tables_bytes':data['table_bytes'],'runtime_executed':False,'new_compilations':0,'scope':'Independent source, metadata and static review; second strict repeat and runtime acceptance are separately owned.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
