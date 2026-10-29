from pathlib import Path
import gzip, hashlib, importlib.util, json, shutil, sys
W=Path(__file__).resolve().parent; R=W.parents[1]
B=R/'work/amm-inverse-route-combined-20261028'
I=R/'work/amm-inverse-route-independent-20261028'
sys.dont_write_bytecode=True;sys.path.insert(0,str(W))
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def j(p):return json.loads(Path(p).read_bytes())
def save(p,v):Path(p).write_text(json.dumps(v,indent=2)+'\n')
def cp(a,b):
 a=Path(a);b=Path(b);b.parent.mkdir(parents=True,exist_ok=True)
 if a.is_dir():shutil.copytree(a,b)
 else:shutil.copy2(a,b)
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def seal(p):save(p/'manifest.json',{'files':{str(x.relative_to(p)):h(x)for x in sorted(p.rglob('*'))if x.is_file()and x!=p/'manifest.json'and'__pycache__'not in x.parts}})
C=W/'build/artifacts/pump_amm_recovered.so';U=W/'build/artifacts/unstripped.so'
if not (W/'canonical-source').exists():
 cp(B/'canonical-source',W/'canonical-source')
 for n in j(W/'composition.json')['changed_files']:cp(W/'source'/n,W/'canonical-source'/n)
if not (W/'base-source').exists():cp(B/'source',W/'base-source')
save(W/'source-manifest.json',{str(p.relative_to(W/'source')):h(p)for p in sorted((W/'source').rglob('*'))if p.is_file()})
save(W/'base-source-manifest.json',{str(p.relative_to(W/'base-source')):h(p)for p in sorted((W/'base-source').rglob('*'))if p.is_file()})
d=W/'dependency-proof'
if not d.exists():
 d.mkdir()
 for n in ['base','reference','verify.py']:cp(I/'dependency-proof'/n,d/n)
 for a,b in [('build-native-prime/native-prime.json','native-prime.json'),('build-native-prime/build.log','native-prime.log'),('build-repeat/build-comparison.json','build-repeat.json'),('build-repeat/build.log','build-repeat.log'),('build/dependency-metadata.json','dependency-metadata.json'),('build_entrypoint.py','builder-executed.py'),('build-native-prime/native-artifact-proof','native-artifact-proof')]:cp(W/a,d/b)
 prime=j(d/'native-prime.json')
 for n in prime['native_dependency_additions']:cp(W/'target'/n,d/'native-artifacts'/n)
 seal(d)
dependency=module('native_scanners_dependencies',d/'verify.py').verify(W/'canonical-source',W/'build/build-comparison.json',d)
save(W/'dependency-verification.json',dependency)
source=module('native_scanners_source',W/'verify_source_binding.py').verify(W/'canonical-source',W/'source',W/'build/build-comparison.json',C,U,d)
save(W/'source-binding-verification.json',source)
assert source['total_compiled_inputs_verified']==232 and dependency['unchanged_dependency_artifacts']==765
if not (W/'acceptance-primary.json').exists():cp(W/'acceptance.json',W/'acceptance-primary.json')
allgroups=j(W/'acceptance-primary.json')+j(W/'broad-acceptance.json')
assert len(allgroups)==13 and all(x['returncode']==0 for x in allgroups)
save(W/'acceptance.json',allgroups)
metric=j(W/'measurement.json');save(W/'canonical-measurement.json',metric)
from elf_reader import Elf
import measure
o=Elf(W/'runtime-inputs/evidence/original/pump_amm/deployed.so');c=Elf(C);s=Elf(U);b=Elf(W/'baseline-artifacts/pump_amm_recovered.so');bs=Elf(W/'baseline-artifacts/unstripped.so')
actual,rows=measure.measured(o,c,s,b,bs);assert actual==metric
wc=R/'work/amm-next-joint-independent-20261027/wrapper_census.py'
cp(wc,W/'wrapper_census.py')
cp(wc.parent/'pump_amm.json',W/'pump_amm.json')
wrappers=module('native_scanner_wrappers',W/'wrapper_census.py').census(W/'runtime-inputs/evidence/original/pump_amm/deployed.so',C,U)
save(W/'wrappers.json',wrappers);assert wrappers['normalized_and_relocation_matches']==38
# Preserve direct and retained CTO witnesses under a single portable inventory.
q=W/'cto-portable'
if not q.exists():
 q.mkdir();a=R/'work/amm-admin-cto-pool-context-next-20261027/negative'
 for n in ['verify.py','captured-producer.py','synthetic-producer.py','oracle_fixture.py','oracle.rs','observer.py','cleaner.py','programs']:cp(a/n,q/n)
 ix=j(a/'program-index.json');cp(C,q/'candidate.so');cp(C,q/'programs'/(h(C)+'.so'));ix[h(C)]={'program_id':'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA','source_path':str(C)};save(q/'program-index.json',ix)
 for n in ['captured','synthetic']:
  (q/(n+'.json.gz')).write_bytes(gzip.compress((W/'cto-controls'/(n+'.json')).read_bytes(),mtime=0));cp(W/'cto-controls'/(n+'-transactions.json.gz'),q/(n+'-transactions.json.gz'))
 cp(W/'cto-proof',q/'retained19');seal(q)
cto=module('native_scanners_cto',q/'verify.py').verify(q,expected_bad=0)
retained=module('native_scanners_cto19',q/'retained19/verify.py').verify(q/'retained19')
save(W/'cto-verification.json',{'passed':True,'candidate_sha256':h(C),'cases':41,'mismatches':0,'direct':cto,'retained19':retained})
ready={'candidate_sha256':h(C),'all_13_acceptance_jobs_passed':True,'strict_repeat':j(W/'repeat-verification.json'),'source_binding':source,'dependency_binding':dependency,'proof_sha256':{n:h(W/n)for n in ['runtime-verification.json','cases-verification.json','sweep254-verification.json','counterexamples-verification.json','native-verification.json','decoder58-verification.json','cto-verification.json','extras-verification.json','acceptance.json','broad-acceptance.json']},'native_raw_differences_preserved':14,'whole_elf_identity':False}
save(W/'finalization-ready.json',ready)
print(json.dumps({'passed':True,'candidate':h(C),'dependency_seal':h(d/'manifest.json'),'groups':13,'wrappers':38,'cto_cases':41},indent=2))
