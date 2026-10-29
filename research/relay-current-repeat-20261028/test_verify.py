#!/usr/bin/env python3
"""Reject resealed build, SDK, executable, runtime and maintained-source drift."""
from pathlib import Path
import gzip,hashlib,importlib.util,json,os,shutil,tempfile,unittest
P=Path(__file__).resolve().parent;ROOT=P.parents[1]
def put(path,data):
 q=path.with_name(path.name+'.replacement');q.write_bytes(data);q.replace(path)
def seal(packet):
 put(packet/'manifest.json',(json.dumps({p.relative_to(packet).as_posix():hashlib.sha256(p.read_bytes()).hexdigest()for p in sorted(packet.rglob('*'))if p.is_file()and'__pycache__'not in p.parts and p.name!='manifest.json'},indent=2)+'\n').encode())
def change_json(path,mutate):
 value=json.loads(gzip.decompress(path.read_bytes()));mutate(value);put(path,gzip.compress(json.dumps(value).encode(),mtime=0))
class Controls(unittest.TestCase):
 def check(self,mutation,source_mutation=None):
  with tempfile.TemporaryDirectory()as td:
   packet=Path(td)/'packet';shutil.copytree(P,packet,copy_function=os.link,ignore=shutil.ignore_patterns('__pycache__'));source=ROOT/'programs/donation-relay'
   if source_mutation:
    copy=Path(td)/'source';shutil.copytree(source,copy);source=copy;source_mutation(source)
   mutation(packet);seal(packet);spec=importlib.util.spec_from_file_location('relay_repeat_control',packet/'verify.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
   with self.assertRaises(ValueError):m.verify(ROOT,packet,source,signatures=False)
 def test_false_empty_target(self):self.check(lambda p:change_json(p/'results/build/result.json.gz',lambda r:r.update(target_initially_empty=False)))
 def test_sdk_byte_drift(self):
  def mutate(r):r['sdk_inputs'][next(iter(r['sdk_inputs']))]='0'*64
  self.check(lambda p:change_json(p/'results/build/result.json.gz',mutate))
 def test_changed_elf(self):
  def mutate(p):
   path=p/'results/build/candidate.so.gz';b=bytearray(gzip.decompress(path.read_bytes()));b[400]^=1;put(path,gzip.compress(bytes(b),mtime=0))
  self.check(mutate)
 def test_resealed_runtime_log(self):self.check(lambda p:change_json(p/'results/runtime-equal-allocation.json.gz',lambda r:r['cases'][0]['candidate']['logs'].append('Program log: altered')))
 def test_extra_current_rust(self):self.check(lambda p:None,lambda s:(s/'src/unbound.rs').write_text('pub fn unrelated() {}\n'))
if __name__=='__main__':unittest.main()
