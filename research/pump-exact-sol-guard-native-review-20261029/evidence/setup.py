from pathlib import Path
import difflib,hashlib,importlib.util,json,re,shutil,sys
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent;R=Path.cwd();sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
D=R/'research/pump-program-creator-notice-qualification-20261028';A=R/'work/pump-exact-sol-guard-next-20261028'
assert sha(D/'MANIFEST.json')=='ef50bb5262f67c59f4d1850f83e2821fa1e9c5f02649589cab356a6e28cffb49'
assert sha(A/'D037-buy-only.patch')=='a97c61b36bd09a56fc967d65ed26ad1cb2a2342e5f118c87a6734e51f3574507'
assert sha(A/'AUDIT.json')=='eaafcaab2579fb87eb1afa74959b3970f6edaac1d5d04e68c92b32031f2b68ab'
audit_seal=json.loads((A/'EVIDENCE-MANIFEST.json').read_text());assert all(sha(A/n)==h for n,h in audit_seal['files'].items())
base=json.loads((D/'SOURCE65.json').read_text());assert len(base)==65 and sha(D/'SOURCE65.json')=='61e9741da82f4bc28dcfa25c78e0160f25d9eaeb9c95e9b1d0af52e13a972003'
sys.path.insert(0,str(R/'scripts'))
from build_source_manifest import source_manifest
crate=R/'programs/pump';actual=source_manifest(crate,crate,R,cwd=crate);assert {str((R/n).relative_to(crate)):h for n,h in actual.items()}==base
source=P/'source65';assert not source.exists();source.mkdir()
for name,digest in base.items():
 src=D/'source'/name;assert sha(src)==digest,name
 dst=source/name;dst.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(src,dst)
buy=source/'src/buy.rs';before=buy.read_text();proposal=A/'proposed-buy.rs';assert sha(proposal)=='d4935c98c281cbd3b01175709b033b8ce4412fb851491aaa1cf9f58a65df8599'
shutil.copyfile(proposal,buy);after=buy.read_text();delta=''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/programs/pump/src/buy.rs',tofile='b/programs/pump/src/buy.rs'))
assert delta==(A/'D037-buy-only.patch').read_text();(P/'source.patch').write_text(delta)
expected={n:sha(source/n)for n in base};assert [n for n in base if base[n]!=expected[n]]==['src/buy.rs']
assert expected['src/creator/admin_cto.rs']=='3545aa72915c541810c3ea9219237f4d1791c7f40b0056b81e8a493e2cefcdb7'
assert expected['src/multi_hop_curve_swap.rs']=='734bdae1189dd4e4f54a27fd215624611228f36b92d3877b63f00df19ccc9e44'
positions=lambda text:[(m.group(),text[:m.start()].count('\n')+1,m.start()-text.rfind('\n',0,m.start()))for m in re.finditer(r'\b(?:error|err|require(?:_[a-z_]+)?|panic)!\s*\(|\.\s*(?:unwrap|expect)\s*\(',text)]
assert positions(before)==positions(after)
record=dict(base='selected D037 notice-only source65',base_manifest_sha256=sha(D/'MANIFEST.json'),base_source65_sha256=sha(D/'SOURCE65.json'),base_candidate_sha256='d0377d7cef5b7378063f8bfabac5dc9c08d29eeaaaaa14022d36909688ff5e1b',base_symbols_sha256='0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6',parent_source65=base,trial_source65=expected,sole_delta='src/buy.rs lines96/110',audited_patch_sha256=sha(P/'source.patch'),prior_readonly_audit_sha256=sha(A/'AUDIT.json'),unchanged_source_inputs=64,existing_buy_diagnostic_coordinates=positions(after),no_F4_21_Clock_overlay=True,ordinary_native_builds_allowed=1,no_original_object_IR_or_assembly_compiler_input=True,no_compiler_wrapper_linker_flag_or_normalizer_changes=True,no_VM=True,goal_complete=False)
(P/'SOURCE65.json').write_text(json.dumps(expected,indent=2)+'\n');(P/'source-bindings.json').write_text(json.dumps(record,indent=2)+'\n')
old=R/'work/pump-remaining-frontier-20261028-latest';environment=json.loads((old/'environment-before.json').read_text())
for name,digest in environment['sdk_and_tool_files'].items():assert sha(Path(name))==digest,name
for row in environment['locked_registry_archives'].values():
 for name in row['equivalent_archive_paths']:assert sha(Path(name))==row['sha256'],name
for root,files in environment['actual_registry_source_files'].items():
 for name,digest in files.items():assert sha(Path(root)/name)==digest,name
shutil.copyfile(old/'environment-before.json',P/'environment-reference.json')
(P/'environment-before.json').write_text(json.dumps(dict(status='AUTHENTICATED_BEFORE_ONE_ORDINARY_NATIVE_WARM_BUILD',environment_reference_sha256=sha(P/'environment-reference.json'),SDK_tool_files=len(environment['sdk_and_tool_files']),archive_pins=len(environment['locked_registry_archives']),registry_source_files=environment['source_files_checked'],source_binding_sha256=sha(P/'source-bindings.json')),indent=2)+'\n')
spec=importlib.util.spec_from_file_location('separate_owned_target_copy',R/'scripts/pump_dependency_cache.py');dep=importlib.util.module_from_spec(spec);spec.loader.exec_module(dep)
seed=R/'work/pump-remaining-frontier-20261028-latest-target';target=R/'work/pump-exact-sol-guard-native-20261028-target';assert seed.is_dir()and not target.exists();methods={}
def copy(a,b):
 method=dep.clone_file(Path(a),Path(b));methods[method]=methods.get(method,0)+1;return b
shutil.copytree(seed,target,copy_function=copy,symlinks=False,ignore=shutil.ignore_patterns('incremental'))
(P/'target-seed.json').write_text(json.dumps(dict(seed=str(seed),owned_target=str(target),copy_methods=methods,hardlinks=False,seed_mutated=False),indent=2)+'\n')
text=(R/'work/pump-cto-program-notice-fix-20261028/build.py').read_text();old_target='target=Path('+repr(str(seed))+')';assert text.count(old_target)==1;text=text.replace(old_target,'target=Path('+repr(str(target))+')')
text=text.replace("'notice_only_current_C0_successor':True", "'audited_buyguard_D037_trial':True")
text=re.sub(r"'source_binding_preflight_sha256':'[0-9a-f]{64}'", "'source_binding_preflight_sha256':"+repr(sha(P/'source-bindings.json')),text)
(P/'build.py').write_text(text)
print(json.dumps(dict(source65_sha256=sha(P/'SOURCE65.json'),buy_sha256=sha(buy),unchanged_source_inputs=64,CTO_sha256=expected['src/creator/admin_cto.rs'],target_copy_methods=methods,builder_sha256=sha(P/'build.py')),indent=2))
