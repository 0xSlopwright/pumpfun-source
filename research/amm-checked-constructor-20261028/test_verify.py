#!/usr/bin/env python3
"""Reject resealed false source, constructor-depth and execution-witness claims."""
from pathlib import Path
import gzip,hashlib,importlib.util,io,json,os,shutil,tarfile,tempfile
P=Path(__file__).resolve().parent
ROOT=P.parents[1]
def write(path,raw):
 temporary=path.with_name(path.name+'.replacement');temporary.write_bytes(raw);temporary.replace(path)
def seal(packet):
 write(packet/'MANIFEST.json',(json.dumps({str(path.relative_to(packet)):hashlib.sha256(path.read_bytes()).hexdigest()for path in packet.rglob('*')if path.is_file()and path.name!='MANIFEST.json'and '__pycache__'not in path.parts},indent=2)+'\n').encode())
def source(packet):
 path=packet/'sources/canonical-source.tar.gz';out=io.BytesIO()
 with tarfile.open(fileobj=io.BytesIO(gzip.decompress(path.read_bytes())))as incoming,tarfile.open(fileobj=out,mode='w')as outgoing:
  for item in incoming:
   raw=incoming.extractfile(item).read()
   if item.name.endswith('/swap/sell.rs'):raw=raw.replace(b'Account::<UserVolumeAccumulator>::try_from(user_volume_accumulator)?',b'Account::<UserVolumeAccumulator>::try_from_unchecked(user_volume_accumulator)?')
   item.size=len(raw);outgoing.addfile(item,io.BytesIO(raw))
 write(path,gzip.compress(out.getvalue(),mtime=0))
def witness(packet):
 path=packet/'runtime/focused.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));value['cases'][0]['constructor_call_execution_witness']=False;write(path,gzip.compress(json.dumps(value).encode(),mtime=0))
def depth(packet):
 path=packet/'constructor/r51-depth2-audit.json.gz';value=json.loads(gzip.decompress(path.read_bytes()));value['all_sites'][0]['equal_depths_0_1_2']=[True,False,False];write(path,gzip.compress(json.dumps(value).encode(),mtime=0))
def check(name,mutate):
 with tempfile.TemporaryDirectory()as temporary:
  packet=Path(temporary)/'packet';shutil.copytree(P,packet,copy_function=os.link,ignore=shutil.ignore_patterns('work','__pycache__'));mutate(packet);seal(packet);spec=importlib.util.spec_from_file_location('tampered_checked',packet/'verify.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
  canonical=Path(temporary)/'canonical';canonical.mkdir()
  for filename,raw in module.archive(P/'sources/canonical-source.tar.gz').items():
   target=canonical/filename;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
  try:module.verify(ROOT,source_root=canonical)
  except (RuntimeError,ValueError,KeyError)as error:return {'test':name,'rejected':True,'reason':str(error)}
  raise RuntimeError('resealed tamper escaped: '+name)
if __name__=='__main__':print(json.dumps([check(name,mutate)for name,mutate in [('removed_checked_correction',source),('false_constructor_execution_witness',witness),('false_callee_depth_receipt',depth)]],indent=2))
