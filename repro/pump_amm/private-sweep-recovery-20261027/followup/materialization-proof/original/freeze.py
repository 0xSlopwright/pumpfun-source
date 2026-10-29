"""Freeze the selected integrated build and its freshly executed receipts."""
from pathlib import Path
import gzip,hashlib,importlib.util,json,shutil,subprocess,sys
R=Path.cwd();W=Path(__file__).resolve().parent
OLD=R/'repro/pump_amm/admin-harvest-recovery-20261027'
H=R/'repro/pump_amm/incentive-order-recovery-20261027';D=H/'results'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p):return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def save(p,x):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(x,indent=2)+'\n')
def cp(a,b):b.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(a,b)
def compact(a,b):b.parent.mkdir(parents=True,exist_ok=True);b.write_bytes(gzip.compress(a.read_bytes(),mtime=0))
def module(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
assert not H.exists()
candidate=sha(W/'build/artifacts/pump_amm_recovered.so')
for p in OLD.glob('*.py'):cp(p,H/p.name)
replaced={'source','canonical-source','runtime','account-probes','trade-probes','liquidity-probes','refinements','new-proofs','dependency-proof','build','manifest.json'}
shutil.copytree(OLD/'results',D,ignore=lambda directory,names: sorted(set(names)&replaced) if Path(directory)==OLD/'results' else [])
# The source trees, builds and live-candidate receipts are always replaced.
for name in ['source','canonical-source','runtime','account-probes','trade-probes','liquidity-probes','refinements','new-proofs']:

 if (D/name).exists():shutil.rmtree(D/name)
shutil.copytree(W/'source',D/'source');shutil.copytree(W/'canonical-source',D/'canonical-source');shutil.copytree(W/'dependency-proof',D/'dependency-proof')
for name in ['runtime','account-probes']:
 for p in(W/name).iterdir():
  if p.suffix=='.json':compact(p,D/name/(p.name+'.gz'))
  elif p.suffix=='.gz':cp(p,D/name/p.name)
for name in ['trade-probes','refinements']:
 shutil.copytree(W/name,D/name,ignore=shutil.ignore_patterns('*.log'))
shutil.copytree(W/'focused',D/'liquidity-probes',ignore=shutil.ignore_patterns('*.log','*-attempt.json'))
for src,dst in [('build/artifacts/pump_amm_recovered.so','build/candidate.so'),('build/artifacts/unstripped.so','build/unstripped.so'),('build/build-comparison.json','build/build-comparison.json'),('build/build.log','build/build.log'),('build-repeat/build-comparison.json','build-repeat.json'),('build-repeat/build.log','build-repeat.log')]:cp(W/src,D/dst)
cp(R/'work/amm-incentive-liquidity-buy-combined-20261027/build_entrypoint.py',D/'build-driver.py')
for name in ['measurement','buyback','liquidity-extra','cpi','curve-balances','source-amounts','sqrt']:compact(W/(name+'.json'),D/(name+'.json.gz'))
for name in ['liquidity-extra','sqrt']:cp(W/(name+'-transactions.json.gz'),D/(name+'-transactions.json.gz'))
for folder,names,suffix in [
 ('v2-probes',['boundary','transfer','validation-order','curve-order','legacy-curve-order','matrix','market-cap','quote-routes'],'-transactions.json.gz'),
 ('supplemental',['order','buyback-payout','buyback-malformed','preview','token-preview','contexts','multihop-bumps','sell-cap','sell-transfers'],'-transactions.json.gz'),
 ('routes',['multihop-edges','multihop-large','multihop-routes','pool-decoders','buy-executors','buy-events'],'-signed-observer.json.gz'),
 ('error-order',['legacy-edges','legacy-rounding','legacy-collisions','withdraw-order','sell-events','fee-payout'],'-signed-observer.json.gz')]:
 for name in names:
  p=W/(name+'.json')
  if p.exists():compact(p,D/folder/(name+'.json.gz'))
  else:cp(W/(name+'.json.gz'),D/folder/(name+'.json.gz'))
  cp(W/(name+suffix),D/folder/(name+suffix))
cp(W/'pool-decoders-transactions.json.gz',D/'routes/pool-decoders-snapshots.json.gz')
for name in ['raw','mint-policy','canonical-mint']:compact(W/(name+'.json'),D/'supplemental'/(name+'.json.gz'))
for name in ['virtual','predicate']:cp(OLD/'results/refinements'/(name+'.py'),D/'refinements'/(name+'.py'))
save(D/'new-integration/composition.json',load(W/'composition.json'))
cp(W/'combined.patch',D/'new-integration/combined.patch')
m=load(W/'measurement.json');old=load(OLD/'results/measurement.json.gz')
matched=lambda x:{v['start']for v in x['rows']if v['matches']}
delta={'base_candidate_sha256':old['candidate_sha256'],'candidate_sha256':candidate,'gained':sorted(matched(m)-matched(old)),'lost':sorted(matched(old)-matched(m)),'matched_text_bytes':sum(v['end']-v['start']for v in m['rows']if v['matches']),'original_text_bytes':sum(v['end']-v['start']for v in m['rows'])}
assert not delta['lost'];save(D/'old-to-new.json',delta)
comparison=load(D/'new-integration/comparison.json');comparison['selection_base']={'candidate_sha256':old['candidate_sha256']};comparison['baseline_scope']='Retained historical liquidity comparator; old-to-new.json defines selection delta.';comparison['candidate']['candidate_sha256']=candidate;comparison['delta']=delta;save(D/'new-integration/comparison.json',comparison)
symbols=D/'build/unstripped.so';binary=D/'build/candidate.so'
save(D/'helper-comparison.json',module('next_helpers',H/'inspect_helpers.py').inspect(binary,symbols))
for name,path in [('pool','pool-layouts-agent-20261027/verify_static.py'),('global','global-config-layouts-agent-20261027/verify_static.py')]:save(H/(name+'-static.json'),module('next_'+name,R/'repro/pump_amm'/path).verify(binary,symbols))
save(H/'liquidity-static.json',module('next_liquidity',R/'repro/pump_amm/liquidity-account-audit-agent-20261027/audit.py').audit(binary,symbols))
save(D/'pool-abi.json',module('next_pool_abi',H/'verify_pool_abi.py').verify(binary,symbols,R))
closure=module('next_closure',R/'repro/pump_amm/call-closure-audit-20261027/audit.py').analyze(binary,symbols,D/'measurement.json.gz');save(D/'call-closure.json',closure)
save(D/'literal-constraints.json',module('next_literals',R/'repro/pump_amm/call-closure-audit-20261027/literal_constraints.py').analyze(binary,symbols,closure))
direct=module('next_direct',H/'compare_direct_cached.py').audit(D/'runtime',candidate);assert not direct['mismatches'];save(H/'direct-comparison.json',direct)
# Bind every local and archived source input; each new Rust file counts explicitly.
record=load(D/'build/build-comparison.json');total=len(record['source_sha256'])
recipe=module('new_source_recipe',H/'workspace_recipe_v2.py')
canonical_count=len(recipe.source_inputs(D/'canonical-source'));workspace_count=canonical_count+1
assert total==workspace_count+175==227
cp(W/'verify_source_binding.py',H/'verify_source_binding.py');cp(W/'verify_source_binding.py',D/'harness/verify_source_binding.py')
p=H/'verify_liquidity.py';p.write_text(p.read_text().replace(old['candidate_sha256'],candidate))
p=H/'verify_saved.py';s=p.read_text().replace(old['candidate_sha256'],candidate)
s=s.replace("len(record['source_sha256'])==226",f"len(record['source_sha256'])=={total}").replace("source_binding['total_compiled_inputs_verified']==226 and source_binding['standalone_inputs']==50",f"source_binding['total_compiled_inputs_verified']=={total} and source_binding['standalone_inputs']=={canonical_count}").replace("dependency['total_build_inputs_bound']==226",f"dependency['total_build_inputs_bound']=={total}")
prior_delta=load(OLD/'results/old-to-new.json')
s=s.replace(f"delta['gained']=={prior_delta['gained']!r} and delta['lost']==[]",f"delta['gained']=={delta['gained']!r} and delta['lost']==[]").replace("delta['matched_text_bytes']==826112",f"delta['matched_text_bytes']=={delta['matched_text_bytes']}")
s=s.replace("==(656,148)",f"==({m['normalized_matches']},{m['raw_matches']})").replace("'normalized_matches':656,'raw_matches':148",f"'normalized_matches':{m['normalized_matches']},'raw_matches':{m['raw_matches']}").replace("'build_source_inputs':226,'canonical_source_inputs':50",f"'build_source_inputs':{total},'canonical_source_inputs':{canonical_count}")
s=s.replace("dependency['packages']==8","dependency['packages']==9")
p.write_text(s)
# Add current-candidate expanded proofs before sealing (written by the coordinator).
shutil.copytree(W/'new-proofs',D/'new-proofs')
cp(W/'verify_new_proofs.py',H/'verify_new_proofs.py')
cp(W/'verify_new_proofs.py',D/'harness/verify_new_proofs.py')
cp(W/'verify_recovery.py',H/'verify_recovery.py')
cp(W/'verify_recovery.py',D/'harness/verify_recovery.py')
manifest={str(p.relative_to(D)):sha(p)for p in sorted(D.rglob('*'))if p.is_file()};save(D/'manifest.json',manifest);seal=sha(D/'manifest.json')
p=H/'verify_saved.py';p.write_text(p.read_text().replace("MANIFEST='a2f00d29efcb59a6dd3bcf27005d3311c93a1400fb5fe0fc769509ec01a88aa0'",f"MANIFEST='{seal}'"))
save(W/'frozen.json',{'candidate':candidate,'manifest':seal,'checkpoint':str(H.relative_to(R)),'delta':delta,'normalized':m['normalized_matches'],'raw':m['raw_matches']})
print(json.dumps(load(W/'frozen.json'),indent=2))
