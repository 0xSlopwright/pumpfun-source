"""Verify and optionally extract the main-Pump research snapshot; never execute it."""
from pathlib import Path,PurePosixPath
import argparse,gzip,hashlib,io,json,tarfile
P=Path(__file__).resolve().parent
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--extract',type=Path);a=p.parse_args()
r=json.loads((P/'MANIFEST.json').read_text());data=[]
for part in r['parts']:
 b=(P/part['name']).read_bytes();assert len(b)==part['bytes']and hashlib.sha256(b).hexdigest()==part['sha256'];data.append(b)
archive=b''.join(data);assert len(archive)==r['snapshot_bytes']and hashlib.sha256(archive).hexdigest()==r['snapshot_sha256']
if a.extract:a.extract.mkdir(parents=True,exist_ok=False)
seen=set()
with tarfile.open(fileobj=io.BytesIO(archive),mode='r:gz')as t:
 for f in t:
  name=PurePosixPath(f.name);assert f.isfile()and not name.is_absolute()and '..'not in name.parts and f.name not in seen
  b=t.extractfile(f).read();expected=r['files'][f.name];assert len(b)==expected['bytes']and hashlib.sha256(b).hexdigest()==expected['sha256'];seen.add(f.name)
  if a.extract:
   out=a.extract.joinpath(*name.parts);out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(b)
assert seen==set(r['files'])
updates=P/'UPDATES.json'
if updates.exists():
 for name,record in json.loads(updates.read_text())['files'].items():
  content=(P/name).read_bytes();assert len(content)==record['bytes']and hashlib.sha256(content).hexdigest()==record['sha256']
print(json.dumps({'verified':True,'files':len(seen),'snapshot_bytes':len(archive),'maintained_checkpoint':r['maintained_checkpoint'],'goal_complete':False}))
