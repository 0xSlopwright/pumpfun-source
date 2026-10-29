from pathlib import Path
import gzip,hashlib,io,json,tarfile
P=Path(__file__).resolve().parent;R=Path.cwd();D=R/'research/pump-program-creator-notice-qualification-20261028';sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
environment=json.loads((P/'environment-reference.json').read_text())
for name,digest in environment['sdk_and_tool_files'].items():assert sha(Path(name))==digest,name
for row in environment['locked_registry_archives'].values():
 for name in row['equivalent_archive_paths']:assert sha(Path(name))==row['sha256'],name
for root,files in environment['actual_registry_source_files'].items():
 for name,digest in files.items():assert sha(Path(root)/name)==digest,name
binding=json.loads((P/'source-bindings.json').read_text());expected=binding['trial_source65'];source=P/'source65';receipt=json.loads((P/'warm/build-comparison.json').read_text());base_receipt=json.loads((D/'builds/primary/build-comparison.json').read_text())
assert receipt==json.loads((P/'warm/build-attempt.json').read_text())
assert {n:sha(source/n)for n in expected}==expected
assert {str((R/n).relative_to(source)):h for n,h in receipt['primary_source_sha256'].items()}==expected
assert all(receipt[k]for k in ['source_unchanged','tools_unchanged','target_libraries_unchanged','reused_external_artifacts_unchanged','executed_python_sources_unchanged'])
assert receipt['fresh_local_compilations']=={'pump-recovered':True,'pump-token-ext':True}and not receipt['external_dependency_rebuild']
assert receipt['cold_empty_target']is False and receipt['target_existed_before']is True
for key in ['tool_sha256','target_libraries_sha256','source_wrapper_sha256']:assert receipt[key]==base_receipt[key]
# Ordinary Cargo and strip options remain those of actual qualified D037 warm.
assert receipt['command'][-6:]==base_receipt['command'][-6:]and'--emit'not in ' '.join(receipt['command'])
workspace=Path(receipt['workspace_directory']);compiled={str((R/n).relative_to(workspace)):h for n,h in receipt['source_sha256'].items()};assert len(compiled)==66
old_workspace=Path(base_receipt['workspace_directory']);old_compiled={str((R/n).relative_to(old_workspace)):h for n,h in base_receipt['source_sha256'].items()}
assert set(compiled)==set(old_compiled)and [n for n in compiled if compiled[n]!=old_compiled[n]]==['programs/pump/src/buy.rs']
buffer=io.BytesIO()
with tarfile.open(fileobj=buffer,mode='w')as archive:
 for name,digest in sorted(compiled.items()):
  path=workspace/name;assert sha(path)==digest;raw=path.read_bytes();info=tarfile.TarInfo(name);info.size=len(raw);info.mode=0o644;info.mtime=0;archive.addfile(info,io.BytesIO(raw))
(P/'warm/compiled-workspace.tar.gz').write_bytes(gzip.compress(buffer.getvalue(),mtime=0));(P/'compiled66.json').write_text(json.dumps(compiled,indent=2)+'\n')
measured=json.loads((P/'MEASURED.json').read_text());assert measured['counts']==dict(total=1035,normalized=1019,raw=188,unmatched=16,matched_text_bytes=1611088)
assert all(not values for group in measured['memberships_vs_D037'].values()for values in group.values())
assert measured['native_trial_normalized_equal_retained_linux_guard']and measured['target_diff_original']['different_bytes']==4 and measured['target_diff_original']['different_slots']==[1003,1004]
assert not measured['control_to_trial_complete_callee_class_differences']
manifest=json.loads((D/'MANIFEST.json').read_text())['files'];assert sha(D/'MANIFEST.json')=='ef50bb5262f67c59f4d1850f83e2821fa1e9c5f02649589cab356a6e28cffb49'and all(sha(D/n)==h for n,h in manifest.items())
old=R/'work/pump-remaining-frontier-20261028-latest';old_manifest=json.loads((old/'EVIDENCE-MANIFEST.json').read_text());assert all(sha(old/n)==h for n,h in old_manifest['files'].items())
envafter=dict(status='PASS',environment_reference_sha256=sha(P/'environment-reference.json'),SDK_tool_files=len(environment['sdk_and_tool_files']),archive_pins=len(environment['locked_registry_archives']),registry_source_files=environment['source_files_checked'],all_environment_bytes_unchanged=True,source65_and_actual_compiled66_unchanged=True,tools_target_libraries_wrapper_equal_actual_D037=True,frozen_D037350_files_unchanged=True,old325_files_unchanged=True)
(P/'environment-after.json').write_text(json.dumps(envafter,indent=2)+'\n')
report=dict(status='NEGATIVE_STOP_SAME_TWO_LOAD_ORDER_NO_GAIN',ordinary_native_warm_builds=1,baseline='Retained selected native D037 warm/cold; no redundant control compilation',new_VM_executions=0,source65_sha256=sha(P/'SOURCE65.json'),source_bindings_sha256=sha(P/'source-bindings.json'),only_changed_source='src/buy.rs',buy_sha256=expected['src/buy.rs'],unchanged_source_inputs=64,CTO_sha256=expected['src/creator/admin_cto.rs'],compiled66_sha256=sha(P/'compiled66.json'),actual_compiled66_archive_sha256=sha(P/'warm/compiled-workspace.tar.gz'),actual_receipt_sha256=sha(P/'warm/build-comparison.json'),actual_build_log_sha256=sha(P/'warm/build.log'),actual_builder_sha256=sha(P/'build.py'),candidate_sha256=receipt['comparison']['candidate_sha256'],symbols_sha256=receipt['unstripped_sha256'],seconds=receipt['seconds'],fresh_local_crates=receipt['fresh_local_compilations'],external_dependencies_rebuilt=False,cold_empty_target=False,target_existed_before=True,full_canonical_census=measured['counts'],memberships_vs_D037=measured['memberships_vs_D037'],target=measured['targets']['native_trial'],original_residual=measured['target_diff_original'],native_target_equal_retained_linux_guard_normalized=True,control_to_trial_complete_callee_class_differences=[],actual_call_operands='actual-call-operands.json',all_environment_bytes_unchanged=True,frozen_D037_and_old325_evidence_unchanged=True,canonical_Git_PR_or_shared_target_writes=False,owned_target_idle=True,whole_window_gain=0,goal_complete=False,next_action='Stop; preserve native negative. No cold/runtime qualification, promotion, source return/layout guesses or further build variants warranted by this result.')
(P/'HANDOFF.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k]for k in ('status','candidate_sha256','symbols_sha256','source65_sha256','actual_compiled66_archive_sha256','actual_receipt_sha256','seconds','full_canonical_census','memberships_vs_D037','whole_window_gain','goal_complete')},indent=2))
