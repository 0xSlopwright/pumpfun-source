from pathlib import Path
import difflib,hashlib,json
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def inv(p):return{str(f.relative_to(p)):H(f)for f in p.rglob('*')if f.is_file()}
def verify(root):
 w=Path(root);m=json.loads((w/'composition.json').read_bytes());old,new=inv(w/'baseline-source'),inv(w/'source');assert old==m['base_sources']and new==m['selected_sources']==m['source_sha256']and len(old)==len(new)==58
 path='programs/pump-amm/src/instructions/swap/trade_v2.rs';assert[k for k in old if old[k]!=new[k]]==m['changed_files']==[path]
 a=(w/'baseline-source'/path).read_text();b=(w/'source'/path).read_text();needle='transfer_fee::from_mint(a.quote_mint.as_ref().as_ref())?';assert a.count(needle)==3 and a.replace(needle,'transfer_fee::from_mint(&a.quote_mint.to_account_info())?')==b
 patch=''.join(difflib.unified_diff(a.splitlines(True),b.splitlines(True),fromfile='a/'+path,tofile='b/'+path));assert patch==(w/'recovery.patch').read_text()and H(w/'recovery.patch')==m['aggregate_patch_sha256']=='06b62c3f4a3d753c6199895a0baf4d22282259127f89d110ef85c0b2616d6d14'
 proof=w/'v2-ownership-proof';assert(proof/'before.rs').read_text()==a and(proof/'after.rs').read_text()==b
 assert old['crates/native-transfer-fee/src/lib.rs']==new['crates/native-transfer-fee/src/lib.rs']
 return {'passed':True,'changed_files':[path],'component_patches':1,'workspace_sources':58,'native_unchanged':True,'historical_source_identity_proven':False}
