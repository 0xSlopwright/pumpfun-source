"""Fetch the exact SDK LLVM revision and stage only compiler build sources."""
from pathlib import Path,PurePosixPath
import datetime,hashlib,json,tarfile,time,urllib.request
D=Path(__file__).resolve().parent;W=D.parent
REV='08aedd64bf3abe4f163407b7bcf680403b84b32d'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def main():
 archive=D/'llvm-project.tar.gz';url='https://codeload.github.com/anza-xyz/llvm-project/tar.gz/'+REV
 assert not archive.exists() and not (D/'source').exists()
 start=time.time();request={'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'url':url,'revision':REV,'repository':'anza-xyz/llvm-project','controller_sha256':sha(Path(__file__))}
 save(D/'download-request.json',request)
 with urllib.request.urlopen(url,timeout=120) as response,archive.open('wb') as f:
  request['response_headers']=dict(response.headers)
  while data:=response.read(1024*1024):f.write(data)
 request.update(archive_sha256=sha(archive),archive_bytes=archive.stat().st_size,download_seconds=time.time()-start);save(D/'download-result.json',request)
 root=D/'source';root.mkdir();files={};excluded=0
 with tarfile.open(archive,'r:gz') as t:
  for m in t:
   parts=PurePosixPath(m.name).parts;assert parts[0]=='llvm-project-'+REV
   if len(parts)<2 or parts[1] not in ['llvm','cmake','third-party','LICENSE.TXT']:continue
   if len(parts)>2 and parts[1]=='llvm' and parts[2] in ['test','docs']:excluded+=1;continue
   rel=PurePosixPath(*parts[1:]);assert not rel.is_absolute() and '..' not in rel.parts and '\\' not in m.name
   if m.isdir():continue
   assert m.isfile(),m.name;assert rel.as_posix() not in files
   f=root/rel;f.parent.mkdir(parents=True,exist_ok=True);data=t.extractfile(m).read();f.write_bytes(data);files[rel.as_posix()]=hashlib.sha256(data).hexdigest()
 pins=json.loads((W/'pump-exact-sol-controls/compiler-source-identities.json').read_bytes())
 for pin in pins:assert files[pin['path']]==pin['sha256'],pin['path']
 save(D/'source-inventory.json',files);save(D/'preparation.json',dict(revision=REV,archive_sha256=request['archive_sha256'],staged_files=len(files),staged_bytes=sum((root/n).stat().st_size for n in files),scope='llvm, cmake, third-party and LICENSE.TXT; llvm/test and llvm/docs excluded. No source edits. Nine independently acquired Git blob pins cross-checked.',crosschecked_git_blobs=pins,source_inventory_sha256=sha(D/'source-inventory.json'),seconds=time.time()-start))
 print(json.dumps({'files':len(files),'bytes':request['archive_bytes'],'archive_sha256':request['archive_sha256'],'seconds':time.time()-start},indent=2),flush=True)
if __name__=='__main__':main()
