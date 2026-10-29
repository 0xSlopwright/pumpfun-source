"""One unpadded private identity build of the independently reviewed R42 source."""
from pathlib import Path
import hashlib,json,os,subprocess,sys,time
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;S=R/'work/parallel-main-integration/round42-source/programs/pump';B=R/'work/parallel-main-integration/build-round42-identity'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();read=lambda p:json.loads(p.read_text())
review=R/'work/parallel-main-r41-installed-preflight/R42-COMPOSITION-REVIEW01.json'
assert sha(review)=='8d631c100e48deb6eafb8f0e22575cad654e10e6eb372716716da1f4ca5226a0'
assert not B.exists()
stage=read(W/'STAGED01.json')
for n,h in stage['source_sha256'].items():assert sha(S/n)==h,n
cfg=read(R/'work/parallel-main-r40-sbpf/CONFIG01.json')
env=os.environ.copy()
for k in ['RUSTFLAGS','CARGO_ENCODED_RUSTFLAGS','CARGO_TARGET_SBF_SOLANA_SOLANA_RUSTFLAGS','CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS','PUMP_DATA_ORDER_CERTIFICATE']:env.pop(k,None)
env['CARGO_BUILD_JOBS']='1'
command=[sys.executable,str(R/'scripts/pump_build_verified.py'),'--source-directory',str(S),'--workspace-layout','--sdk',cfg['sdk'],'--registry-home',cfg['registry_home'],'--dependency-cache',cfg['dependency_cache'],'--target-library-profile','linux-v1.44-sbpf','--target-library-directory',cfg['target_library_directory'],'--output',str(B)]
plan={'status':'running','independent_review_sha256':sha(review),'command':command,'compiler_jobs':1,'source_sha256':stage['source_sha256'],'stage_sha256':sha(W/'STAGED01.json'),'builder_sha256':sha(R/'scripts/pump_build_verified.py'),'steps':[]}
def save():(W/'BUILD-PLAN01.json').write_text(json.dumps(plan,indent=2)+'\n')
def run(args,name):
 now=time.monotonic()
 with(W/name).open('w')as f:p=subprocess.run(args,cwd=R,env=env,stdout=f,stderr=subprocess.STDOUT)
 step={'log':name,'seconds':time.monotonic()-now,'returncode':p.returncode};plan['steps'].append(step);save();print(step,flush=True)
 if p.returncode:plan['status']='failed';save();raise SystemExit(p.returncode)
save();run(command,'build-identity01.log')
receipt=read(B/'build-comparison.json');assert receipt['source_unchanged']and receipt['dependency_cache']['key']==cfg['cache_key']
run([sys.executable,str(R/'work/pump-reserve-byte-recovery/inventory_current.py'),'--candidate',str(B/'unstripped.so'),'--output',str(B/'normalized-inventory.json')],'identity-inventory01.log')
new=read(B/'normalized-inventory.json');selection=lambda j,k:{r['start']for r in j['windows']if r[k]};comparisons={}
for name,folder in [('R41_identity','build-round41-identity'),('R41_ordered_final','build-round41')]:
 p=R/'work/parallel-main-integration'/folder/'normalized-inventory.json';old=read(p)
 comparisons[name]={'baseline_sha256':sha(p),'counts':old['counts'],'sets':{k:{'gains':sorted(selection(new,k)-selection(old,k)),'losses':sorted(selection(old,k)-selection(new,k))}for k in['normalized_matches','raw_match']}}
for n,h in stage['source_sha256'].items():assert sha(S/n)==h,n
result={'status':'built_and_measured','candidate_sha256':sha(B/'candidate.so'),'unstripped_sha256':sha(B/'unstripped.so'),'counts':new['counts'],'comparisons':comparisons,'source_unchanged':True,'dependency_cache':receipt['dependency_cache']['key'],'build_receipt_sha256':sha(B/'build-comparison.json'),'inventory_sha256':sha(B/'normalized-inventory.json'),'limits':['Identity build has no ordered text/data placement; compare raw retention against the R41 identity baseline separately from the ordered final baseline.','No runtime or full-corpus qualification is implied by this result.','Whole-ELF identity remains unproved.']}
(W/'IDENTITY-RESULT01.json').write_text(json.dumps(result,indent=2)+'\n');plan['status']='built_and_measured';save()
(W/'IDENTITY-MANIFEST01.json').write_text(json.dumps({p.name:sha(p)for p in[W/'IDENTITY-RESULT01.json',W/'BUILD-PLAN01.json',W/'build_identity01.py']},indent=2)+'\n');print({'counts':new['counts'],'comparisons':comparisons,'result_sha256':sha(W/'IDENTITY-RESULT01.json')},flush=True)
