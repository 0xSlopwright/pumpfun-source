from pathlib import Path
import json,hashlib,shutil,tarfile,gzip
r=Path('work/pump-amm-multi-hop');main=r/'main-build-06';scratch=r/'build-05';dest=Path('repro/pump_amm/multi-hop-thirty-seven');sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
a=main/'artifacts/pump_amm_recovered.so';b=scratch/'artifacts/pump_amm_recovered.so';assert a.read_bytes()==b.read_bytes(),'Main differs: rerun all25 suites before promotion'
report=json.loads((main/'build-comparison.json').read_text());attempt=json.loads((main/'build-attempt.json').read_text());assert attempt['returncode']==0 and attempt['source_unchanged']
for p,h in report['source_sha256'].items():assert sha(Path(p))==h,p
oldtests=json.loads((scratch/'results/test-source-sha256.json').read_text())
with tarfile.open(scratch/'results/test-snapshot.tar.gz')as t:
 for p,h in oldtests.items():assert hashlib.sha256(t.extractfile(p).read()).hexdigest()==h,p
for p,h in oldtests.items():assert sha(Path(p))==h,p
new=json.loads((r/'maintained-portability.json').read_text());old=json.loads((scratch/'results/multi_hop/report.json').read_text());assert new['cases']==old['cases'];assert not new['mismatches'];assert new['candidate_sha256']==sha(a)
check={'case_count':new['case_count'],'case_results_equal':True,'main_receipt_sha256':sha(r/'maintained-portability.json'),'scratch_receipt_sha256':sha(scratch/'results/multi_hop/report.json'),'maintained_harness_sha256':sha(Path('scripts/pump_amm_multi_hop_differential.py'))}
shutil.copytree(r/'handoff',dest)
for n in ['build-attempt.json','build-comparison.json','source-snapshot.tar.gz','build.log.gz','test-source-sha256.json','test-snapshot.tar.gz','regression-run.json','pump_amm_multi_hop_differential.py','standalone-differential.json.gz','standalone-identity.json']:
 (dest/'scratch-build').mkdir(exist_ok=True);shutil.move(dest/n,dest/'scratch-build'/n)
for n in ['build-attempt.json','build-comparison.json']:shutil.copyfile(main/n,dest/n)
(dest/'build.log.gz').write_bytes(gzip.compress((main/'build.log').read_bytes(),mtime=0));shutil.copyfile(a,dest/'pump_amm_recovered.so')
with tarfile.open(dest/'source-snapshot.tar.gz','w:gz')as t:
 for p in report['source_sha256']:t.add(p,arcname=p)
identity={'scope':'Clean main-path build is whole-file identical to scratch build05. All25 suites ran against scratch. Reuse24 prior suite receipts by exact executable identity. The maintained735-case multi-hop harness ran from /tmp on main and produced exactly the same case results; these are not additional unique cases.','main_candidate':str(a),'scratch_candidate':str(b),'main_sha256':sha(a),'scratch_sha256':sha(b),'whole_file_equal':True,'bytes':a.stat().st_size,'main_build_inputs':report['source_sha256'],'scratch_build_inputs':json.loads((scratch/'build-comparison.json').read_text())['source_sha256'],'validated_unique_cases':17462,'main_build_attempt_sha256':sha(main/'build-attempt.json'),'scratch_build_attempt_sha256':sha(scratch/'build-attempt.json'),'maintained_harness_replay':check,'portability_working_directory':'/tmp'}
(dest/'main-scratch-identity.json').write_text(json.dumps(identity,indent=2)+'\n');name='multi_hop-differential.json.gz';shutil.move(dest/name,dest/'scratch-build'/name);(dest/name).write_bytes(gzip.compress((r/'maintained-portability.json').read_bytes(),mtime=0))
tests={p:h for p,h in oldtests.items()if p.startswith('scripts/')};tests['scripts/pump_amm_multi_hop_differential.py']=sha(Path('scripts/pump_amm_multi_hop_differential.py'))
for p in [r/'independent-compare.py',r/'promote-package.py']:tests[str(p)]=sha(p)
(dest/'test-source-sha256.json').write_text(json.dumps(tests,indent=2)+'\n')
with tarfile.open(dest/'test-snapshot.tar.gz','w:gz')as t:
 for p,h in tests.items():assert sha(Path(p))==h,p;t.add(p,arcname=p)
commands=[]
for row in json.loads((scratch/'results/regression-run.json').read_text()):
 if row['suite']=='multi_hop':cmd=['work/test-env/bin/python','scripts/pump_amm_multi_hop_differential.py','--candidate',str(dest/'pump_amm_recovered.so'),'--output','work/amm37-replay/multi_hop.json']
 else:
  cmd=row['command'];cmd[cmd.index('--candidate')+1]=str(dest/'pump_amm_recovered.so');cmd[cmd.index('--output')+1]='work/amm37-replay/'+row['suite']+'.json'
 commands.append({'suite':row['suite'],'command':cmd})
(dest/'replay-commands.json').write_text(json.dumps({'scope':'Reproduction commands; actual executed scratch commands remain in scratch-build/regression-run.json.','commands':commands},indent=2)+'\n')
summary=json.loads((dest/'summary.json').read_text());summary.update({'scope':'Main-path AMM37 multi_hop_swap checkpoint. Bounded parity; original full ELF identity remains false.','main_source_changed':True,'main_scratch_whole_file_equal':True,'runtime_evidence_reused_by_whole_file_identity':True,'test_helper_inputs':len(tests),'maintained_harness_portability_cases':735,'maintained_harness_portability_cases_are_additional':False});(dest/'summary.json').write_text(json.dumps(summary,indent=2)+'\n')
shutil.copyfile(r/'README-promotion.md',dest/'README.md');shutil.copyfile(r/'promote-package.py',dest/'promotion-package-script.py')
status=json.loads(Path('repro/status.json').read_text())['pump_amm'];old='repro/pump_amm/boost-burn-thirty-six';new=str(dest)
for k in ['candidate_artifact','comparison_report','build_log','candidate_build_identity_report']:status[k]=status[k].replace(old,new)
if 'multi_hop_swap'not in status['implemented_handlers']:status['implemented_handlers'].append('multi_hop_swap')
status['validated_cases']=17462;status['validation_reports']=[x.replace(old,new)for x in status['validation_reports']]+[str(dest/'multi_hop-differential.json.gz')];status['prior_checkpoint']=old;status['multi_hop_recovery_report']='audit/pump_amm/MULTI_HOP_RECOVERY.md';(r/'status-entry.json').write_text(json.dumps(status,indent=2)+'\n')
docs=['programs/pump-amm/README.md','audit/pump_amm/MULTI_HOP_RECOVERY.md'];(dest/'documentation-sha256.json').write_text(json.dumps({p:sha(Path(p))for p in docs},indent=2)+'\n')
manifest={str(p.relative_to(dest)):sha(p)for p in sorted(dest.rglob('*'))if p.is_file()and p.name!='manifest-sha256.json'};(dest/'manifest-sha256.json').write_text(json.dumps(manifest,indent=2)+'\n')
changed=['programs/pump-amm/src/lib.rs','programs/pump-amm/src/multi_hop.rs','programs/pump-amm/README.md','scripts/pump_amm_multi_hop_differential.py','audit/pump_amm/MULTI_HOP_RECOVERY.md']
result={'changed_owned_paths':changed+[str(dest)+'/'],'sha256':{p:sha(Path(p))for p in changed},'replacement_status':str(r/'status-entry.json'),'main_candidate_sha256':sha(a),'main_candidate_bytes':a.stat().st_size,'main_input_files':len(report['source_sha256']),'test_input_files':len(tests),'runtime_input_files':len(json.loads((dest/'runtime-input-sha256.json').read_text())),'package_files':len(manifest),'manifest_sha256':sha(dest/'manifest-sha256.json'),'validated_cases':17462,'suites':25,'main_source_frozen':True};(r/'handoff-status.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
