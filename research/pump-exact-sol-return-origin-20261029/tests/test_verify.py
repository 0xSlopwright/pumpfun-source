if not __debug__:
 raise SystemExit('Run without -O; inherited readers require assertions.')
from pathlib import Path
import copy,csv,gzip,hashlib,importlib.util,io,json,shutil,struct,subprocess,sys,tempfile,unittest

P=Path(__file__).resolve().parents[1];R=P.parents[1]
s=importlib.util.spec_from_file_location('return_origin_verify',P/'verify.py');v=importlib.util.module_from_spec(s);s.loader.exec_module(v)

class EvidenceTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.tmp=tempfile.TemporaryDirectory();p=Path(cls.tmp.name)/'candidate.so';p.write_bytes(v.read(P/'capture/symbols.so.gz'))
  a=v.module('return_origin_test_audit',R/'research/pump-exact-sol-guard-20261029/audit_target.py')
  cls.original=a.Elf(R/'evidence/original/pump/deployed.so');cls.candidate=a.Elf(p)
  cls.windows={int(x['original_start']):int(x['bytes']) for x in csv.DictReader(io.StringIO(v.read(P/'inputs/original-function-boundaries.tsv.gz').decode()),delimiter='\t') if x['program']=='pump' and x['variant']=='selected'}
 @classmethod
 def tearDownClass(cls):cls.tmp.cleanup()
 def changed(self,address,data):
  e=copy.deepcopy(self.candidate);b=bytearray(e.data);b[address:address+len(data)]=data;e.data=bytes(b);return e
 def check(self,candidate):return v.reference_comparison(self.original,candidate,self.windows)
 def test_valid_bounded_references(self):
  r=self.check(self.candidate);self.assertEqual(len(r['unique_child_functions']),9);self.assertEqual(r['data_pointer_fields'],7);self.assertFalse(r['root']['raw_equal'])
 def test_wrong_data_relocation_rejected(self):
  e=self.candidate;s=e.sections['.rel.dyn'];offset=next(p for p in range(s['offset'],s['offset']+s['size'],16) if struct.unpack_from('<Q',e.data,p)[0]==0x1bfa60)
  with self.assertRaisesRegex(AssertionError,'relative data relocation'):self.check(self.changed(offset+8,struct.pack('<Q',1)))
 def test_changed_vtable_target_rejected(self):
  with self.assertRaisesRegex(AssertionError,'referent function bytes|actual candidate function extent'):self.check(self.changed(0x1bfa78+4,struct.pack('<I',0xb1a0)))
 def test_vtable_scalar_rejected(self):
  with self.assertRaisesRegex(AssertionError,'non-pointer data bytes'):self.check(self.changed(0x1bfa68,struct.pack('<Q',25)))
 def test_message_change_rejected(self):
  with self.assertRaisesRegex(AssertionError,'message bytes'):self.check(self.changed(0x1b8214,b'X'))
 def test_location_line_rejected(self):
  with self.assertRaisesRegex(AssertionError,'non-pointer data bytes'):self.check(self.changed(0x1bfab0+16,struct.pack('<I',2558)))
 def test_path_change_rejected(self):
  with self.assertRaisesRegex(AssertionError,'panic source path'):self.check(self.changed(0x1b824b,b'X'))
 def test_nonzero_pointer_low_word_rejected(self):
  with self.assertRaisesRegex(AssertionError,'legacy data pointer encoding'):self.check(self.changed(0x1bfa60,struct.pack('<I',1)))
 def test_initial_extract_swap_rejected(self):
  raw=v.read(P/'capture/stderr.log.gz');old=b'  %1086 = extractvalue { i64, ptr } %1085, 0\r\n  %1087 = extractvalue { i64, ptr } %1085, 1'
  if old not in raw:old=old.replace(b'\r\n',b'\n')
  self.assertIn(old,raw);lines=old.splitlines(keepends=True);newline=b'\r\n' if b'\r\n' in old else b'\n';new=lines[1]+newline+lines[0].rstrip(b'\r\n')
  with self.assertRaisesRegex(AssertionError,'extract order'):v.trace_orders(raw.replace(old,new,1))
 def test_resealed_codegen_argument_rejected(self):
  with tempfile.TemporaryDirectory() as tmp:
   packet=Path(tmp)/'packet';shutil.copytree(P,packet);p=packet/'capture/launch.json.gz';x=v.js(p);x['command']+=['-C','opt-level=0'];p.write_bytes(gzip.compress((json.dumps(x,indent=2)+'\n').encode(),mtime=0))
   seal={p.relative_to(packet).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in packet.rglob('*') if p.is_file() and p.name!='MANIFEST.json'};(packet/'MANIFEST.json').write_text(json.dumps(seal,indent=2)+'\n')
   with self.assertRaisesRegex(AssertionError,'capture command binding'):v.verify(R,packet)
 def test_resealed_environment_change_rejected(self):
  with tempfile.TemporaryDirectory() as tmp:
   packet=Path(tmp)/'packet';shutil.copytree(P,packet);p=packet/'capture/launch.json.gz';x=v.js(p);x['environment']['RUSTFLAGS']='-C opt-level=0';p.write_bytes(gzip.compress((json.dumps(x,indent=2)+'\n').encode(),mtime=0))
   seal={p.relative_to(packet).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in packet.rglob('*') if p.is_file() and p.name!='MANIFEST.json'};(packet/'MANIFEST.json').write_text(json.dumps(seal,indent=2)+'\n')
   with self.assertRaisesRegex(AssertionError,'capture environment binding'):v.verify(R,packet)
 def repin(self,packet):
  entries={p.relative_to(packet).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in packet.rglob('*') if p.is_file() and p.name!='MANIFEST.json'}
  (packet/'MANIFEST.json').write_text(json.dumps(entries,indent=2)+'\n')
 def test_resealed_unmatched_window_extent_rejected(self):
  with tempfile.TemporaryDirectory() as tmp:
   packet=Path(tmp)/'packet';shutil.copytree(P,packet);f=packet/'inputs/original-function-boundaries.tsv.gz';reader=csv.DictReader(io.StringIO(v.read(f).decode()),delimiter='\t');fields=reader.fieldnames;rows=list(reader);target=124864
   row=next(x for x in rows if x['program']=='pump' and x['variant']=='selected' and int(x['original_start'])==target);size=int(row['bytes'])-8;row['bytes']=str(size)
   if 'original_end' in row:row['original_end']=str(target+size)
   out=io.StringIO();writer=csv.DictWriter(out,fieldnames=fields,delimiter='\t',lineterminator='\n');writer.writeheader();writer.writerows(rows);f.write_bytes(gzip.compress(out.getvalue().encode(),mtime=0))
   for name in ['inputs/baseline-census.json.gz','rejected/census.json.gz']:
    f=packet/name;x=v.js(f);row=next(r for r in x['windows'] if r['start']==target);self.assertFalse(row['normalized_matches']);self.assertFalse(row['raw_match']);row.update(bytes=size,end=target+size,raw_sha256=v.sha(self.original.body(target,size)));f.write_bytes(gzip.compress(json.dumps(x).encode(),mtime=0))
   self.repin(packet)
   with self.assertRaisesRegex(AssertionError,'canonical original-window membership/extents'):v.verify(R,packet)
 def test_resealed_later_explicit_store_order_rejected(self):
  with tempfile.TemporaryDirectory() as tmp:
   packet=Path(tmp)/'packet';shutil.copytree(P,packet);f=packet/'capture/stderr.log.gz';raw=v.read(f);newline=b'\r\n' if b'\r\n' in raw else b'\n';lines=[b'  store i64 %1086, ptr %346, align 8',b'  %1088 = getelementptr inbounds i8, ptr %346, i64 8',b'  store ptr %1087, ptr %1088, align 8'];old=newline.join(lines);first=raw.index(old);second=raw.index(old,first+len(old));new=newline.join([lines[1],lines[2],lines[0]]);raw=raw[:second]+new+raw[second+len(old):];f.write_bytes(gzip.compress(raw,mtime=0));f=packet/'capture/result.json.gz';x=v.js(f);x['logs']['stderr.log']={'sha256':v.sha(raw),'bytes':len(raw)};f.write_bytes(gzip.compress(json.dumps(x).encode(),mtime=0));self.repin(packet)
   with self.assertRaisesRegex(AssertionError,'explicit return store order'):v.verify(R,packet)
 def test_optimized_entrypoints_refuse(self):
  for entry in [P/'verify.py',P/'tests/test_verify.py']:
   result=subprocess.run([sys.executable,'-I','-O','-B',str(entry)],capture_output=True,text=True);self.assertNotEqual(result.returncode,0);self.assertEqual(result.stderr.strip(),'Run without -O; inherited readers require assertions.')

if __name__=='__main__':unittest.main()
