from pathlib import Path
import argparse,hashlib,json,types
W=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inventory(p):return{str(f.relative_to(p)):sha(f)for f in p.rglob('*')if f.is_file()}
def verify(root):
 assert json.loads((W/'manifest.json').read_bytes())['files']=={k:v for k,v in inventory(W).items()if k!='manifest.json'}
 assert sha(W/'recovery.patch')=='e7e1d899af3b6016354fd894268edd1d390890e55182c97aefd7b88677426041'
 rec=json.loads((W/'build-comparison.json').read_bytes());suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in rec['source_sha256']if k.endswith(suffix));local={k[len(prefix):]:v for k,v in rec['source_sha256'].items()if k.startswith(prefix)}
 before,after=W/'baseline-source',W/'source';assert local==inventory(before)and len(local)==52
 assert rec['comparison']['candidate_sha256']==sha(W/'baseline/pump_amm_recovered.so')and rec['unstripped_sha256']==sha(W/'baseline/unstripped.so')
 expected={
  'programs/pump-amm/src/boost_burn.rs':2,
  'programs/pump-amm/src/creator_reassignment.rs':1,
  'programs/pump-amm/src/extend.rs':1,
  'programs/pump-amm/src/instructions/create_pool.rs':1,
  'programs/pump-amm/src/instructions/boost.rs':1,
  'programs/pump-amm/src/legacy_sell.rs':1,
 }
 old,new=inventory(before),inventory(after);assert old.keys()==new.keys()and{k for k in old if old[k]!=new[k]}==set(expected)
 for name,count in expected.items():
  a=(before/name).read_text();b=(after/name).read_text()
  if name.endswith('/creator_reassignment.rs'):
   lines=a.splitlines(True);hits=[i for i,l in enumerate(lines)if'AdminCtoPoolEvent{'in l and'emit!(event.clone())'in l];assert len(hits)==1;lines[hits[0]]=lines[hits[0]].replace('emit!(event.clone())','emit!(event)');assert b==''.join(lines)
  else:assert a.count('emit!(event.clone())')==count and b==a.replace('emit!(event.clone())','emit!(event)')
  assert a.count('emit!(event.clone())')-b.count('emit!(event.clone())')==count
 p=W/'qualify.py';m=types.ModuleType('qualify');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);q=m.qualify(Path(root));assert q==json.loads((W/'qualification.json').read_bytes())
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'patch_sha256':sha(W/'recovery.patch'),'baseline_sha256':sha(W/'baseline/pump_amm_recovered.so'),'selected_sites':7,'changed_files':6,'exact_event_target_bodies':7,'excluded_control_cases':8,'negative_controls':q['negative_controls'],'compiled_candidate':False,'runtime_executed':False,'scope':q['scope']}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
