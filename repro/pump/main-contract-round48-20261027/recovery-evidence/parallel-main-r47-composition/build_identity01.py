"""Build one independently reviewed, corrected R47 mapped identity."""
from pathlib import Path
import hashlib,json,os,shutil,subprocess,sys,time
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;S=R/'work/parallel-main-integration/round47-source/programs/pump';B=R/'work/parallel-main-integration/build-round47-identity'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
sys.path.insert(0,str(R/'scripts'));from build_source_manifest import source_manifest
review=R/'work/parallel-main-verification-resume/R47-COMPOSITION-REVIEW01.json';assert sha(review)=='faa673ee008053e582d15663cfd397a6765338b2ccf7ddbcc7b5ba161879565c'
stage=read(W/'STAGED01.json');assert sha(W/'STAGED01.json')=='6cb3455fa12a423c46b0af60980f912cd155f57c9314be94de54b1906e1c04d2'
source=R/stage['source'];expected=stage['source_after'];assert len(expected)==65 and not S.exists()and not B.exists()
for n,h in expected.items():assert sha(source/n)==h,n
S.parent.mkdir(parents=True,exist_ok=True);shutil.copytree(source,S)
actual={str((R/n).relative_to(S)):h for n,h in source_manifest(S,S,R).items()};assert actual==expected
cfgpath=R/'work/parallel-main-integration/round46-build-config.json';cfg=read(cfgpath);assert cfg['cache_key']=='cc75395a3c1f178105d500df5cc825f8696f42c21fd51a1d70bbd0aaac03ce9f'
assert cfg['target_library_profile']=='linux-v1.44-sbpf';order=R/'work/parallel-main-verified-linker-validation/identity-order.ld'
frozen={'status':'frozen_corrected_source_verified','source':str(S.relative_to(R)),'source_sha256':actual,'input_count':65,'stage_sha256':sha(W/'STAGED01.json'),'independent_review':str(review.relative_to(R)),'independent_review_sha256':sha(review),'config_sha256':sha(cfgpath),'text_order':str(order.relative_to(R)),'text_order_sha256':sha(order),'retains_R46_corrected_source':True};(W/'FROZEN-SOURCE01.json').write_text(json.dumps(frozen,indent=2)+'\n')
env=os.environ.copy()
for key in ['RUSTFLAGS','CARGO_ENCODED_RUSTFLAGS','CARGO_TARGET_SBF_SOLANA_SOLANA_RUSTFLAGS','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS','PUMP_DATA_ORDER_CERTIFICATE']:env.pop(key,None)
env['CARGO_BUILD_JOBS']='1'
command=[sys.executable,str(R/'scripts/pump_build_verified.py'),'--source-directory',str(S),'--workspace-layout','--sdk',cfg['sdk'],'--registry-home',cfg['registry_home'],'--dependency-cache',cfg['dependency_cache'],'--target-library-profile',cfg['target_library_profile'],'--target-library-directory',cfg['target_library_directory'],'--text-section-order',str(order),'--output',str(B)]
plan={'status':'running','command':command,'source_sha256':actual,'review_sha256':sha(review),'frozen_sha256':sha(W/'FROZEN-SOURCE01.json'),'steps':[]}
def save():(W/'BUILD-PLAN01.json').write_text(json.dumps(plan,indent=2)+'\n')
def run(args,name):
 start=time.monotonic()
 with(W/name).open('w')as f:out=subprocess.run(args,cwd=R,env=env,stdout=f,stderr=subprocess.STDOUT)
 step={'log':name,'seconds':time.monotonic()-start,'returncode':out.returncode};plan['steps'].append(step);save();print(step,flush=True)
 if out.returncode:plan['status']='failed';save();raise SystemExit(out.returncode)
save();run(command,'build-identity01.log')
receipt=read(B/'build-comparison.json');assert receipt['returncode']==0 and receipt['source_unchanged']
assert receipt['dependency_cache']['key']==cfg['cache_key']and receipt['dependency_cache']['manifest_sha256']==cfg['manifest_sha256']
assert (B/'link/link.map').stat().st_size>0 and receipt['text_layout']['script_sha256']==sha(order)
assert receipt['text_layout']['linker_invocation_sha256']==sha(B/'link/linker-invocation.json')
run([sys.executable,str(R/'work/pump-reserve-byte-recovery/inventory_current.py'),'--candidate',str(B/'unstripped.so'),'--output',str(B/'normalized-inventory.json')],'inventory01.log')
new=read(B/'normalized-inventory.json');select=lambda j,k:{x['start']for x in j['windows']if x[k]};comparisons={}
for name,folder in [('R46_identity','build-round46-identity'),('R46_ordered_final','build-round46')]:
 p=R/'work/parallel-main-integration'/folder/'normalized-inventory.json';old=read(p);comparisons[name]={'counts':old['counts'],'baseline_sha256':sha(p),'sets':{k:{'gains':sorted(select(new,k)-select(old,k)),'losses':sorted(select(old,k)-select(new,k))}for k in ['normalized_matches','raw_match']}}
for n,h in actual.items():assert sha(S/n)==h
stack_lines=[line for line in (B/'build.log').read_text().splitlines()if 'stack offset' in line.lower()]
retained=not comparisons['R46_identity']['sets']['normalized_matches']['losses']and not comparisons['R46_identity']['sets']['raw_match']['losses']and new['counts']['normalized']>=823 and new['counts']['raw']>=165
validation={'stack_offset_warning_count':len(stack_lines),'stack_offset_warnings':stack_lines,'prior_identity_windows_retained':retained}
(W/'IDENTITY-VALIDATION01.json').write_text(json.dumps(validation,indent=2)+'\n')
result={'status':'built_and_measured','source':str(S.relative_to(R)),'build':str(B.relative_to(R)),'candidate_sha256':sha(B/'candidate.so'),'unstripped_sha256':sha(B/'unstripped.so'),'counts':new['counts'],'comparisons':comparisons,'validation':validation,'source_unchanged':True,'build_receipt_sha256':sha(B/'build-comparison.json'),'link_map_sha256':sha(B/'link/link.map'),'linker_receipt_sha256':sha(B/'link/linker-invocation.json'),'limits':['One mapped identity build only; no final layout, runtime or publication.','Any prior matched-window loss requires explicit investigation before selection.','Historical migration stack risk requires zero stack-offset warnings.','Whole ELF identity remains unproved.']};(W/'IDENTITY-RESULT01.json').write_text(json.dumps(result,indent=2)+'\n');plan['status']='built_and_measured';save();(W/'IDENTITY-MANIFEST01.json').write_text(json.dumps({n:sha(W/n)for n in ['build_identity01.py','FROZEN-SOURCE01.json','BUILD-PLAN01.json','IDENTITY-RESULT01.json','IDENTITY-VALIDATION01.json']},indent=2)+'\n');print({'result_sha256':sha(W/'IDENTITY-RESULT01.json'),'counts':new['counts'],'comparisons':comparisons,'validation':validation},flush=True)

assert validation['stack_offset_warning_count']==0 and retained, 'Identity source/stack gate failed; preserve results and do not promote'
