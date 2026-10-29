from pathlib import Path
import hashlib,json,shutil,subprocess,tempfile

def H(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def inv(p):return{str(f.relative_to(p)):H(f)for f in p.rglob('*')if f.is_file()}
def verify(root):
 w=Path(root);m=json.loads((w/'composition.json').read_bytes());old,new=inv(w/'baseline-source'),inv(w/'source');assert old==m['base_sources']and new==m['selected_sources']==m['source_sha256']
 changed=sorted(k for k in old.keys()|new.keys()if old.get(k)!=new.get(k));assert changed==m['changed_files']==['programs/pump-amm/src/boost_burn.rs','programs/pump-amm/src/cashback.rs','programs/pump-amm/src/instructions/admin/mod.rs','programs/pump-amm/src/instructions/admin/update_buyback_config.rs','programs/pump-amm/src/lib.rs']
 assert len(old)==57 and len(new)==58 and set(new)-set(old)=={'programs/pump-amm/src/instructions/admin/update_buyback_config.rs'}
 assert H(w/'recovery.patch')==m['aggregate_patch_sha256']=='515bb8628edd27f831a57f6bbc68e1f660f67bab10436cfd3ee65b5cf47722ab'
 with tempfile.TemporaryDirectory()as t:
  p=Path(t)/'parts';shutil.copytree(w/'baseline-source',p)
  for c in m['components']:
   patch=w/c['patch'];assert H(patch)==c['sha256'];q=subprocess.run(['patch','--batch','-p1','-i',str(patch)],cwd=p,capture_output=True,text=True);assert q.returncode==0,q.stderr
  assert inv(p)==new
  p=Path(t)/'aggregate';shutil.copytree(w/'baseline-source',p);q=subprocess.run(['patch','--batch','-p1','-i',str(w/'recovery.patch')],cwd=p,capture_output=True,text=True);assert q.returncode==0 and inv(p)==new
 files={'boost':['programs/pump-amm/src/boost_burn.rs'],'cashback':['programs/pump-amm/src/cashback.rs'],'buyback':['programs/pump-amm/src/instructions/admin/mod.rs','programs/pump-amm/src/instructions/admin/update_buyback_config.rs','programs/pump-amm/src/lib.rs']}
 for kind,names in files.items():
  for n in names:assert(w/'source'/n).read_bytes()==(w/'isolated-components'/kind/'source'/n).read_bytes()
 assert old['crates/native-transfer-fee/src/lib.rs']==new['crates/native-transfer-fee/src/lib.rs']
 return {'passed':True,'changed_files':changed,'new_source_file':'programs/pump-amm/src/instructions/admin/update_buyback_config.rs','component_patches':3,'workspace_sources':58,'native_unchanged':True,'isolated_component_source_bytes_equal':True,'historical_source_identity_proven':False}
