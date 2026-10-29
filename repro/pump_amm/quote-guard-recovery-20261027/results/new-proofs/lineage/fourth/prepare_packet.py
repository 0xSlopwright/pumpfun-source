from pathlib import Path
import hashlib,json,shutil,difflib
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def cp(a,b):
 b.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(a,b)
a=json.loads((W/'build/build-comparison.json').read_bytes());b=json.loads((W/'build-repeat/build-comparison.json').read_bytes())
assert a['source_sha256']==a['source_after_sha256']==b['source_sha256']==b['source_after_sha256']
assert a['dependency_cache_before']==a['dependency_cache_after']==b['dependency_cache_before']==b['dependency_cache_after']
inputs={}
for name,h in a['source_sha256'].items():
 p=R/name
 if '/registry/src/' in name:
  tail=name.split('/registry/src/',1)[1].split('/',1)[1];dest=W/'dependency-inputs'/tail;cp(p,dest)
 else:
  dest=p;assert p.is_relative_to(W/'source')
 assert sha(dest)==h
 inputs[name]={'archive_path':str(dest.relative_to(W)),'sha256':h}
(W/'build-input-binding.json').write_text(json.dumps({'scope':'Exact226 compiled source inputs, preserved independently of private cache paths.','inputs':inputs},indent=2)+'\n')
proof=R/'work/amm-final-nine-root-20261027/proof'
for name in ['packages.json','base-build-cached.py','builder-inputs.json','sbpf-archive-provenance.json','sdk-archive.json','sdk-release-evidence.json','pubkey-official-git-source.json','pubkey-source-provenance.json']:
 cp(proof/name,W/'dependency-proof'/name)
for p in (proof/'archives').glob('*.crate'):cp(p,W/'dependency-proof/archives'/p.name)
for p in (proof/'builder-imports').glob('*.py'):cp(p,W/'dependency-proof/builder-imports'/p.name)
for name,src in [('verify_helpers.py',R/'work/amm-third-wave-build-worker-20261027/verify_helpers.py'),('verify_entrypoint.py',R/'work/amm-entrypoint-build-worker-20261027/verify_entrypoint.py'),('verify_runtime.py',R/'work/amm-entrypoint-build-worker-20261027/verify_runtime.py'),('run_runtime.py',R/'work/amm-entrypoint-build-worker-20261027/run_runtime.py'),('run_audit.py',R/'work/amm-joint-data-audit-20261027/run_audit.py')]:cp(src,W/name)
for name in ['runtime-inputs','tools']:
 source=R/('work/amm-entrypoint-build-worker-20261027'if name=='runtime-inputs'else 'work/amm-joint-data-audit-20261027')/name
 shutil.copytree(source,W/name,copy_function=shutil.copy2,dirs_exist_ok=True)
boost=R/'work/amm-boost-guard-next-20261027'
for name in ['verify.py','cleaner.py','runtime-inputs.json','probe.py','observer.py']:cp(boost/name,W/'boost-kit'/name)
shutil.copytree(boost/'runtime-sources',W/'boost-kit/runtime-sources',copy_function=shutil.copy2,dirs_exist_ok=True)
base=R/'work/amm-third-wave-build-worker-20261027/source-final';patch=[]
for name in json.loads((W/'composition.json').read_bytes())['changed_files']:
 patch+=difflib.unified_diff((base/name).read_text().splitlines(True),(W/'source'/name).read_text().splitlines(True),fromfile='a/'+name,tofile='b/'+name)
(W/'recovery.patch').write_text(''.join(patch))
(W/'strict-repeat.json').write_text(json.dumps({'candidate_sha256':sha(W/'build/artifacts/pump_amm_recovered.so'),'unstripped_sha256':sha(W/'build/artifacts/unstripped.so'),'stripped_identical':(W/'build/artifacts/pump_amm_recovered.so').read_bytes()==(W/'build-repeat/artifacts/pump_amm_recovered.so').read_bytes(),'unstripped_identical':(W/'build/artifacts/unstripped.so').read_bytes()==(W/'build-repeat/artifacts/unstripped.so').read_bytes(),'source_inputs':len(inputs),'dependencies_unchanged':len(b['dependency_cache_after']),'both_builds_strict':not a['priming']and not b['priming'],'first_seconds':a['seconds'],'repeat_seconds':b['seconds']},indent=2)+'\n')
print(json.dumps({'inputs':len(inputs),'dependency_files':sum(x['archive_path'].startswith('dependency-inputs/')for x in inputs.values()),'recovery_patch_sha256':sha(W/'recovery.patch')}))
