from pathlib import Path
import shutil,json,hashlib,subprocess,tempfile
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;J=R/'work/amm-incentive-liquidity-buy-combined-20261027';B=R/'work/amm-admin-create-refined-20261027';P=R/'work/amm-refined-independent-review-20261027'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def inv(d):return{str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()}
def cp(src,dest):
 d=W/dest;d.parent.mkdir(parents=True,exist_ok=True)
 if src.is_dir():shutil.copytree(src,d)
 else:shutil.copy2(src,d)
for a,b in [('source','source'),('composition.json','worker-records/composition.json'),('combined.patch','worker-records/combined.patch')]:cp(J/a,b)
cp(B/'source','baseline-source');cp(P/'canonical-source','canonical-source')
for x in ['elf_reader.py','verify_source_binding.py','workspace_recipe_v2.py','closure-tools','input-root','remaining-hints.json','dependency-proof']:cp(P/x,x)
for x in ['wrapper_census.py','pump_amm.json']:cp(R/'work/amm-event-borrow-batch-review-20261027'/x,x)
cp(B/'build/artifacts/pump_amm_recovered.so','artifacts/baseline.so');cp(B/'build/artifacts/unstripped.so','artifacts/baseline-unstripped.so');cp(B/'measurement-full.json','baseline-measurement.json')
C=json.loads((J/'composition.json').read_bytes());assert inv(W/'source')==C['source_sha256']and inv(W/'baseline-source')==C['base_sources']
components=[]
for c in C['components']:
 p=R/c['patch'];assert sha(p)==c['sha256'];dst='components/'+c['name']+'.patch';cp(p,dst);components.append({**c,'saved':dst})
with tempfile.TemporaryDirectory()as td:
 q=Path(td)/'source';shutil.copytree(W/'baseline-source',q)
 for c in components:subprocess.run(['patch','--batch','-p1','-i',str((W/c['saved']).resolve())],cwd=q,check=True,capture_output=True)
 assert inv(q)==C['source_sha256']
with tempfile.TemporaryDirectory()as td:
 q=Path(td)/'source';shutil.copytree(W/'baseline-source',q);subprocess.run(['patch','--batch','-p1','-i',str((W/'worker-records/combined.patch').resolve())],cwd=q,check=True,capture_output=True);assert inv(q)==C['source_sha256']
subprocess.run(['patch','--batch','-p1','-i',str((W/'worker-records/combined.patch').resolve())],cwd=W/'canonical-source',check=True,capture_output=True)
import sys;sys.path.insert(0,str(W));import workspace_recipe_v2 as recipe
bound=recipe.verify_workspace(W/'canonical-source',W/'source');assert bound['standalone_inputs']==51 and bound['workspace_inputs']==52
proof={'source_inputs':bound,'components':components,'aggregate_sha256':sha(W/'worker-records/combined.patch'),'patch_composition_exact':True,'compatibility_stub_retained':(W/'source/programs/pump-amm/src/legacy_buy.rs').read_text()=='pub(crate) use crate::instructions::swap::buy::*;\n','changed_files':[p for p in sorted(C['source_sha256'])if C['base_sources'].get(p)!=C['source_sha256'][p]],'source_unchanged_during_copy':inv(J/'source')==C['source_sha256']}
(W/'source-composition.json').write_text(json.dumps(proof,indent=2)+'\n');print(json.dumps(proof,indent=2))
