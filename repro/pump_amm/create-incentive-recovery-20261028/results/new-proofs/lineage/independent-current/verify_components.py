from pathlib import Path
import hashlib,json,shutil,subprocess,tempfile

def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inventory(p):return {str(x.relative_to(p)):H(x)for x in p.rglob('*')if x.is_file()}
def verify(root):
 w=Path(root);comp=json.loads((w/'composition.json').read_bytes());old,new=inventory(w/'baseline-source'),inventory(w/'source');assert comp['base_sources']==old and comp['selected_sources']==comp['source_sha256']==new
 changed=sorted(n for n in old if old[n]!=new[n]);assert changed==comp['changed_files']==['programs/pump-amm/src/incentives.rs','programs/pump-amm/src/instructions/create_pool.rs']
 assert old['programs/pump-amm/src/lib.rs']==new['programs/pump-amm/src/lib.rs']
 assert old['crates/native-transfer-fee/src/lib.rs']==new['crates/native-transfer-fee/src/lib.rs']
 assert H(w/'recovery.patch')==comp['aggregate_patch_sha256']=='49e1a509fbfe5797e039d4668df5b107adef8d0dfd8c7c39aeb1f83297fdbea9'
 with tempfile.TemporaryDirectory()as tmp:
  tree=Path(tmp)/'tree';shutil.copytree(w/'baseline-source',tree)
  for i,component in enumerate(comp['components']):
   patch=w/f'component-{i}.patch';assert H(patch)==component['sha256'];r=subprocess.run(['patch','--batch','-p1','-i',str(patch)],cwd=tree,capture_output=True,text=True);assert r.returncode==0,r.stderr
  assert inventory(tree)==new
  tree=Path(tmp)/'aggregate';shutil.copytree(w/'baseline-source',tree);r=subprocess.run(['patch','--batch','-p1','-i',str(w/'recovery.patch')],cwd=tree,capture_output=True,text=True);assert r.returncode==0 and inventory(tree)==new
 return {'passed':True,'changed_files':changed,'independent_component_patches':2,'context_borrow_change_absent':True,'native_crate_unchanged':True,'historical_original_source_identity_proven':False}
