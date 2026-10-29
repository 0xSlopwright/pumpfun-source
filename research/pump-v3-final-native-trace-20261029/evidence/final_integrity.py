#!/usr/bin/env python3
"""Read saved bytes and retained native inputs only; never invoke a compiler or VM."""
if not __debug__:
    raise SystemExit('Run without -O; saved integrity assertions are required.')
from pathlib import Path
import gzip,hashlib,io,json,tarfile
R=Path('/Users/shawwalters/.codex/worktrees/pump-swap-remaining-20261028/pumpfun-source')
P=Path(__file__).resolve().parent;Q=R/'work/pump-v3-final-native-trace-plan-20261028'
sha=lambda p:hashlib.file_digest(Path(p).open('rb'),'sha256').hexdigest()
def checkmap(base,files):
 for n,h in files.items():assert sha(base/n)==h,(str(base/n),h)
def archive(p):
 with tarfile.open(p,'r:gz')as t:
  mm=t.getmembers();assert all(m.isfile()for m in mm);assert len({m.name for m in mm})==len(mm)
  return {m.name:hashlib.sha256(t.extractfile(m).read()).hexdigest()for m in mm}
plan=json.loads((Q/'PLAN.json').read_text());assert sha(Q/'PLAN.json')=='15660946baa2d6676d421c9fdba5edb20f2dc0ba210eadc03d0ca452e70265d6'
assert sha(Q/'MANIFEST.json')=='423cc2b54c178e5decfda935647f7d726e2180fd7e982ac65144caa3db133372';checkmap(Q,json.loads((Q/'MANIFEST.json').read_text())['files'])
parent=R/'research/pump-program-creator-notice-qualification-20261028';assert sha(parent/'MANIFEST.json')=='ef50bb5262f67c59f4d1850f83e2821fa1e9c5f02649589cab356a6e28cffb49';checkmap(parent,json.loads((parent/'MANIFEST.json').read_text())['files'])
old=json.loads((parent/'SOURCE65.json').read_text());src=json.loads((Q/'SOURCE65.json').read_text());assert len(src)==len(old)==65 and src.keys()==old.keys();assert [n for n in old if old[n]!=src[n]]==['src/trade_v3.rs'];checkmap(Q/'source65',src)
assert src['src/trade_v3.rs']=='1e437df3fa4e7bc182427ba2304f57393ecc4239fc395eb00d0ff2e27d6cfcc1'
oldlines=(parent/'source/src/trade_v3.rs').read_text().splitlines();newlines=(Q/'source65/src/trade_v3.rs').read_text().splitlines();assert len(oldlines)==len(newlines);assert [i+1 for i,(a,b)in enumerate(zip(oldlines,newlines))if a!=b]==[366,376]
A=R/'work/pr831-review-20261028/projection/research/pump-v3-costs-source-20261029';assert sha(A/'MANIFEST.json')=='ef8ba48f5cff579133360a4dc49dd0fba4d5c2791eca519b6d4b4ca8c47ce039';checkmap(A,json.loads((A/'MANIFEST.json').read_text()))
assert sha(P/'environment-reference.json')=='9b20d3ed39d61c05fc72b590c95c32e13d79b47f656c3153a2c468b215b04f94';env=json.loads((P/'environment-reference.json').read_text());checkmap(Path('/'),env['sdk_and_tool_files'])
ns=0
for base,files in env['actual_registry_source_files'].items():checkmap(Path(base),files);ns+=len(files)
for rec in env['locked_registry_archives'].values():
 for name in rec['equivalent_archive_paths']:assert sha(name)==rec['sha256'],name
for name,p in plan['recipe']['tool_paths'].items():assert sha(p)==plan['recipe']['tool_sha256'][name]
assert ns==4176 and len(env['locked_registry_archives'])==254 and len(env['sdk_and_tool_files'])==1855
seeds={}
for role in ['stock','passive']:
 s=json.loads((P/f'{role}-target-seed.json').read_text());checkmap(Path(s['seed']),s['files']);assert s['hardlinks']==0 and s['seed_writes']==0
 actual={str(p.relative_to(Path(s['seed'])))for p in Path(s['seed']).rglob('*')if p.is_file()};assert actual==set(s['files']);seeds[role]=len(s['files'])
 for n in s['files']:
  a=Path(s['seed'])/n;b=Path(s['target'])/n
  if b.exists():assert(a.stat().st_dev,a.stat().st_ino)!=(b.stat().st_dev,b.stat().st_ino),(role,n)
attempts=json.loads((P/'native-attempts.json').read_text());assert [x['mode']for x in attempts]==['stock','passive']
builds={}
for role in ['stock','passive']:
 b=P/role;r=json.loads((b/'build-comparison.json').read_text());assert (b/'build-attempt.json').read_bytes()==(b/'build-comparison.json').read_bytes()
 assert r['returncode']==r['clean_returncode']==0 and r['actual_compiled_workspace_inputs']==66
 assert r['compiled_packages']==['pump-token-ext','pump-recovered']and all(r['fresh_local_compilations'].values())and not r['external_dependency_rebuild']and not r['stack_warnings']
 for flag in ['source_unchanged','tools_unchanged','target_libraries_unchanged','reused_external_artifacts_unchanged','executed_python_sources_unchanged']:assert r[flag]
 assert sha(b/'executed-builder.py')==r['builder_sha256']==sha(P/'build.py')
 assert sha(b/'build.log')==r['build_log_sha256']and sha(b/'candidate.so')==r['comparison']['candidate_sha256']and sha(b/'unstripped.so')==r['unstripped_sha256']
 assert sha(b/'compiled66.json')==r['compiled66_sha256']and sha(b/'compiled-workspace.tar.gz')==r['compiled_workspace_archive_sha256']
 c=json.loads((b/'compiled66.json').read_text());assert len(c)==66 and archive(b/'compiled-workspace.tar.gz')==c;checkmap(b/'source',c)
 for n,h in src.items():
  if n not in ['Cargo.toml','Cargo.lock']:assert c['programs/pump/'+n]==h
 assert c['Cargo.lock']==src['Cargo.lock'];assert c['Cargo.toml']=='adfeee82af4178636813c170b650934d552ec08954a5abb369f7512b21a0b20c'and c['programs/pump/Cargo.toml']=='e81841e686018bc20019d31054d56510bad11089fe876d5feb7bea753f2bdff0'
 checkmap(R,r['source_sha256']);checkmap(R,r['primary_source_sha256']);assert r['source_sha256']==r['source_after_sha256']and r['primary_source_sha256']==r['primary_source_after_sha256']
 for n,rec in r['executed_python_sources'].items():assert sha(rec['source'])==rec['sha256']==sha(b/'executed-tools'/n)
 builds[role]={'candidate_sha256':sha(b/'candidate.so'),'symbols_sha256':sha(b/'unstripped.so'),'actual_receipt_sha256':sha(b/'build-comparison.json'),'actual_archive_sha256':sha(b/'compiled-workspace.tar.gz'),'compiled66_sha256':sha(b/'compiled66.json'),'build_log_sha256':sha(b/'build.log'),'seconds':r['seconds']}
for n in ['candidate.so','unstripped.so']:assert(P/'stock'/n).read_bytes()==(P/'passive'/n).read_bytes()
q=json.loads((P/'trace-qualification.json').read_text());assert q['qualified']and all(q['whole_files_equal'].values())and q['native_builds']==2
m=json.loads((P/'stock/measurement.json').read_text());assert m['official_counts']==dict(total=1035,normalized=1019,raw=188,unmatched=16,matched_text_bytes=1611088);assert all(not x for d in m['memberships_vs_D037'].values()for x in d.values());assert m['Linux_native']['normalized_equal']and m['original_native']['aligned_changed_slots']==25
out={'status':'PASS','scope':'Private saved/native-input custody check; no compiler, VM, network, cold build or promotion. Absolute locators are private provenance.','authorized_plan_sha256':sha(Q/'PLAN.json'),'plan_manifest_sha256':sha(Q/'MANIFEST.json'),'parent_D037_manifest_sha256':sha(parent/'MANIFEST.json'),'original_PR831_manifest_sha256':sha(A/'MANIFEST.json'),'source65_files':65,'source65_sha256':sha(Q/'SOURCE65.json'),'sole_source_delta':'src/trade_v3.rs lines366,376','unchanged_D037_files':64,'actual_compiled_input_files_per_build':66,'SDK_tool_files':1855,'locked_archives':254,'registry_source_files':ns,'readonly_seed_files':seeds,'actual_native_builds':2,'precompiler_setup_failures':1,'VM_executions':0,'cold_builds':0,'promotions':0,'builds':builds,'qualified_whole_stripped_and_symbols_equal':True,'native_final_narrow_body_equals_Linux_final':True,'gained_windows':0,'lost_windows':0,'script_sha256':sha(Path(__file__))}
(P/'final-integrity.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
