from pathlib import Path
import argparse,difflib,hashlib,json,sys,types
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify(root):
 assert json.loads((W/'manifest.json').read_bytes())['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 before,after=W/'source-base',W/'source-borrow';old={str(p.relative_to(before)):sha(p)for p in before.rglob('*')if p.is_file()};new={str(p.relative_to(after)):sha(p)for p in after.rglob('*')if p.is_file()};assert old.keys()==new.keys()and[k for k in old if old[k]!=new[k]]==['programs/pump-amm/src/lib.rs']
 path='programs/pump-amm/src/lib.rs';a=(before/path).read_text();b=(after/path).read_text();start=a.index('    pub fn disable(');end=a.index('\n    pub fn update_admin',start);assert b==a[:start]+a[start:end].replace('emit!(event.clone())','emit!(event)')+a[end:]
 assert(W/'recovery.patch').read_text()==''.join(difflib.unified_diff(a.splitlines(True),b.splitlines(True),fromfile='a/'+path,tofile='b/'+path))
 r=json.loads((W/'baseline-build-comparison.json').read_bytes());suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in r['source_sha256']if k.endswith(suffix));assert old=={k[len(prefix):]:v for k,v in r['source_sha256'].items()if k.startswith(prefix)}
 assert r['comparison']['candidate_sha256']==sha(W/'baseline/pump_amm_recovered.so')and r['unstripped_sha256']==sha(W/'baseline/unstripped.so')
 p=W/'verify_objects.py';m=types.ModuleType('objects');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);out=m.verify(Path(root),W/'baseline/pump_amm_recovered.so',W/'baseline/unstripped.so');assert out==json.loads((W/'full-object-verification.json').read_bytes());assert out['borrow_all_normalized_bytes_equal_original']and out['borrow_call_relocation_positions_equal_original']
 for name in ['base','borrow']:assert json.loads((W/('full-'+name+'-build.json')).read_bytes())['returncode']==0
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'patch_sha256':sha(W/'recovery.patch'),'base_bytes':3088,'original_and_borrow_bytes':3024,'all_normalized_bytes_equal':True,'all_call_relocation_positions_equal':True,'runtime_executed':False,'scope':'Exact Disable body in an ordinary full-crate Rust object; no linked candidate or whole-program identity claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
