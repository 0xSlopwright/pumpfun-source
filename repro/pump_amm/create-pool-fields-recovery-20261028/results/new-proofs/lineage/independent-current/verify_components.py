from pathlib import Path
import hashlib,json,shutil,subprocess,tempfile
def H(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inventory(p):return {str(x.relative_to(p)):H(x)for x in p.rglob('*')if x.is_file()}
def verify(root):
 w=Path(root);meta=json.loads((w/'composition.json').read_text());before=inventory(w/'baseline-source');after=inventory(w/'source');assert meta['base_sources']==before and meta['selected_sources']==after
 changed=sorted(n for n in before if before[n]!=after[n]);assert changed==['programs/pump-amm/src/instructions/create_pool.rs']
 assert H(w/'recovery.patch')==meta['aggregate_patch_sha256']=='7a3c77b9a657daaba8785f0e5f7f95c2e16a4cff587f5e7f09da26adbd504ef1'
 parts=json.loads((w/'components.json').read_text())
 with tempfile.TemporaryDirectory()as temp:
  tree=Path(temp)/'parts';shutil.copytree(w/'baseline-source',tree)
  for name,digest in parts.items():
   p=w/'components'/name;assert H(p)==digest;r=subprocess.run(['patch','--batch','-p1','-i',str(p)],cwd=tree,capture_output=True);assert r.returncode==0,r.stderr
  assert inventory(tree)==after
  tree=Path(temp)/'aggregate';shutil.copytree(w/'baseline-source',tree);r=subprocess.run(['patch','--batch','-p1','-i',str(w/'recovery.patch')],cwd=tree,capture_output=True);assert r.returncode==0 and inventory(tree)==after
 assert before['crates/native-transfer-fee/src/lib.rs']==after['crates/native-transfer-fee/src/lib.rs']
 return {'passed':True,'candidate_sha256':H(w/'build/artifacts/pump_amm_recovered.so'),'changed_files':changed,'component_patches':3,'native_unchanged':True,'source_file_count':len(after),'aggregate_exact':True,'historical_source_identity_proven':False}
