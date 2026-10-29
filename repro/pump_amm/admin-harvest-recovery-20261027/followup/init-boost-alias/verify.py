"""Verify the bounded InitBoost alias-elision negative; no build or VM execution."""
from pathlib import Path
import argparse,difflib,hashlib,json
W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inv(p):return {str(f.relative_to(p)):sha(f)for f in p.rglob('*')if f.is_file()}
def verify(directory):
 P=Path(directory);assert json.loads((P/'manifest.json').read_bytes())['files']=={k:v for k,v in inv(P).items()if k!='manifest.json'}
 a,b=P/'baseline-source',P/'source';before,after=inv(a),inv(b);assert before.keys()==after.keys();changed=[k for k in before if before[k]!=after[k]];assert changed==['programs/pump-amm/src/instructions/boost.rs'];n=changed[0]
 x,y=(a/n).read_text(),(b/n).read_text();expected=x.replace('    let p = &a.pool;\n','').replace('&p.index.to_le_bytes()','&a.pool.index.to_le_bytes()').replace('p.creator.as_ref()','a.pool.creator.as_ref()').replace('p.base_mint.as_ref()','a.pool.base_mint.as_ref()').replace('p.quote_mint.as_ref()','a.pool.quote_mint.as_ref()').replace('&[p.pool_bump]','&[a.pool.pool_bump]');assert y==expected and x!=y
 assert(P/'recovery.patch').read_text()==''.join(difflib.unified_diff(x.splitlines(True),y.splitlines(True),fromfile='a/'+n,tofile='b/'+n))
 r=json.loads((P/'build/build-comparison.json').read_bytes());assert r['returncode']==0 and r['source_unchanged']and r['source_sha256']==r['source_after_sha256']and r['dependency_cache_before']==r['dependency_cache_after']and len(r['dependency_cache_before'])==762
 suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in r['source_sha256']if k.endswith(suffix));assert after=={k[len(prefix):]:v for k,v in r['source_sha256'].items()if k.startswith(prefix)}
 for name in ['pump_amm_recovered.so','unstripped.so']:assert(P/'build/artifacts'/name).read_bytes()==(P/'baseline'/name).read_bytes()
 assert sha(P/'build/artifacts/pump_amm_recovered.so')==r['comparison']['candidate_sha256']=='58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b'
 assert sha(P/'build/build.log')==r['build_log_sha256']and'Compiling pump-amm-recovered'in(P/'build/build.log').read_text()
 return {'passed':True,'candidate_and_baseline_byte_identical':True,'stripped_sha256':r['comparison']['candidate_sha256'],'unstripped_sha256':sha(P/'baseline/unstripped.so'),'patch_sha256':sha(P/'recovery.patch'),'candidate_inputs':len(r['source_sha256']),'unchanged_dependencies':762,'fresh_runtime_cases':0,'scope':'One natural alias-elision variant only; no selected source change or general source-equivalence claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=W);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
