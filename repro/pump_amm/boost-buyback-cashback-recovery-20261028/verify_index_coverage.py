"""Require every result-manifest member in the Git index before a checkpoint commit."""
from pathlib import Path,PurePosixPath
import argparse,hashlib,json,subprocess

def verify(repository,checkpoint,verify_blobs=False):
 repository=Path(repository).resolve();checkpoint=PurePosixPath(checkpoint)
 assert not checkpoint.is_absolute()and '..'not in checkpoint.parts
 raw=subprocess.check_output(['git','-C',str(repository),'ls-files','--stage','-z','--',str(checkpoint)])
 entries={}
 for row in raw.split(b'\0'):
  if not row:continue
  meta,path=row.split(b'\t',1);mode,oid,stage=meta.decode().split();assert stage=='0',('unmerged',path)
  entries[path.decode()]={'mode':mode,'oid':oid}
 manifest_path=str(checkpoint/'results/manifest.json');assert manifest_path in entries,('manifest not staged',manifest_path)
 manifest_blob=subprocess.check_output(['git','-C',str(repository),'cat-file','blob',entries[manifest_path]['oid']])
 local=repository/manifest_path;assert local.read_bytes()==manifest_blob,'Staged result manifest differs from local frozen manifest'
 manifest=json.loads(manifest_blob);required={}
 for path,digest in manifest.items():
  relative=PurePosixPath(path);assert not relative.is_absolute()and '..'not in relative.parts
  required[str(checkpoint/'results'/relative)]=digest
 missing=sorted(set(required)-set(entries));assert not missing,('Manifest members absent from Git index',missing)
 assert all(entries[p]['mode']in ['100644','100755']for p in required),'Manifest data must be regular indexed files'
 checked=0
 if verify_blobs:
  proc=subprocess.Popen(['git','-C',str(repository),'cat-file','--batch'],stdin=subprocess.PIPE,stdout=subprocess.PIPE)
  memo={}
  try:
   for name,digest in required.items():
    oid=entries[name]['oid']
    if oid not in memo:
     proc.stdin.write((oid+'\n').encode());proc.stdin.flush();header=proc.stdout.readline().decode().strip().split();assert len(header)==3 and header[1]=='blob',header
     remain=int(header[2]);h=hashlib.sha256()
     while remain:
      block=proc.stdout.read(min(remain,1024*1024));assert block;h.update(block);remain-=len(block)
     assert proc.stdout.read(1)==b'\n';memo[oid]=h.hexdigest()
    assert memo[oid]==digest,('Indexed blob differs from result manifest',name);checked+=1
  finally:
   proc.stdin.close();proc.stdout.close();assert proc.wait()==0
 return {'passed':True,'checkpoint':str(checkpoint),'manifest_sha256':hashlib.sha256(manifest_blob).hexdigest(),'manifest_members':len(required),'missing_index_members':0,'indexed_blob_hashes_verified':checked,'scope':'Read-only staged Git coverage, including ignored manifest members; no commit or push performed.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--repository',type=Path,required=True);p.add_argument('--checkpoint',default='repro/pump_amm/private-sweep-recovery-20261027');p.add_argument('--verify-blobs',action='store_true');a=p.parse_args();print(json.dumps(verify(a.repository,a.checkpoint,a.verify_blobs),indent=2))
