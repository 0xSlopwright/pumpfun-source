"""Counterexamples for strict inventory and the saved error-order control evidence."""
import base64,gzip,hashlib,json,os,shutil,subprocess,sys,tempfile,unittest,runpy
from pathlib import Path
from unittest.mock import patch
P=Path(__file__).resolve().parent
def seal(p):
 files={f.relative_to(p).as_posix():hashlib.sha256(f.read_bytes()).hexdigest()for f in p.rglob('*')if f.is_file()and f!=p/'MANIFEST.json'}
 (p/'MANIFEST.json').write_text(json.dumps({'files':files},indent=2)+'\n')
def edit_receipt(p,fn):
 f=p/'negative/source-only.json.gz';d=json.loads(gzip.decompress(f.read_bytes()));fn(d);f.write_bytes(gzip.compress(json.dumps(d).encode(),mtime=0))
class Evidence(unittest.TestCase):
 def run_copy(self,fn,reason,reseal=False,signatures=False):
  with tempfile.TemporaryDirectory(dir=P.parent)as td:
   p=Path(td);shutil.copytree(P,p,dirs_exist_ok=True);fn(p)
   if reseal:seal(p)
   command=[sys.executable,'-I','-B',str(p/('negative/verify.py'if signatures else'verify.py'))]
   if signatures:command.append('--signatures')
   r=subprocess.run(command,capture_output=True,text=True,timeout=30)
   self.assertNotEqual(r.returncode,0);self.assertIn(reason,r.stderr)
 def test_valid_static_record(self):
  r=subprocess.run([sys.executable,'-I','-B',str(P/'verify.py')],capture_output=True,text=True,timeout=30)
  self.assertEqual(r.returncode,0,r.stderr);d=json.loads(r.stdout);self.assertFalse(d['eligible_for_maintained_promotion']);self.assertEqual(d['negative_controls']['mismatches'],0)
 def test_unlisted_nested_manifest(self):self.run_copy(lambda p:((p/'extra').mkdir(),(p/'extra/MANIFEST.json').write_text('{}')),'membership differs')
 def test_symlink(self):self.run_copy(lambda p:(p/'unexpected').symlink_to('README.md'),'special file')
 def test_fifo(self):self.run_copy(lambda p:os.mkfifo(p/'unexpected'),'special file')
 def pre_read_rejection(self,name,kind):
  for standalone in [False,True]:
   with self.subTest(name=name,kind=kind,standalone=standalone),tempfile.TemporaryDirectory(dir=P.parent)as td:
    root=Path(td).resolve();p=root/'packet';shutil.copytree(P,p);file=p/name;file.unlink()
    if kind=='symlink':
     outside=root/'external';outside.write_text('must not read');file.symlink_to(outside)
    else:
     if not hasattr(os,'mkfifo'):self.skipTest('FIFO unavailable')
     os.mkfifo(file)
    module=runpy.run_path(str(p/'negative/verify.py'))if standalone else None
    attempted=[]
    def no_read(path,*args,**kwargs):
     attempted.append(str(path));raise AssertionError('unexpected file content read')
    reason=('negative packet symlink'if kind=='symlink'else'negative packet special file')if standalone else'special file'
    with patch.object(Path,'read_text',no_read),patch.object(Path,'read_bytes',no_read):
     with self.assertRaisesRegex((SystemExit,ValueError),reason):
      if standalone:module['verify'](p)
      else:runpy.run_path(str(p/'verify.py'),run_name='__main__')
    self.assertEqual(attempted,[])
 def test_root_manifest_symlink_before_reads(self):self.pre_read_rejection('MANIFEST.json','symlink')
 def test_root_manifest_fifo_before_reads(self):self.pre_read_rejection('MANIFEST.json','fifo')
 def test_measurement_symlink_before_reads(self):self.pre_read_rejection('measurement.json','symlink')
 def test_measurement_fifo_before_reads(self):self.pre_read_rejection('measurement.json','fifo')
 def test_standalone_rejects_unsealed_receipt(self):
  self.run_copy(lambda p:edit_receipt(p,lambda d:d['cases'][0].__setitem__('name','altered')),'negative packet hash negative/source-only.json.gz',False,True)
 def test_resealed_false_counterexample(self):
  def change(p):edit_receipt(p,lambda d:d['cases'][0]['candidate'].__setitem__('error','TransactionErrorInstructionError((0, Tagged(InstructionErrorCustom(6035))))'))
  self.run_copy(change,'error equality summary',True)
 def test_resealed_wrong_executable(self):
  self.run_copy(lambda p:edit_receipt(p,lambda d:d['cases'][0]['candidate'].__setitem__('executed_program_sha256','0'*64)),'wrong executable account candidate',True)
 def test_corrupt_signature(self):
  def change(p):
   def corrupt(d):
    for role in ['original','candidate']:
     x=bytearray(base64.b64decode(d['cases'][0][role]['transaction_base64']));x[1]^=1;d['cases'][0][role]['transaction_base64']=base64.b64encode(x).decode()
   edit_receipt(p,corrupt)
  try:__import__('solders')
  except ImportError:self.skipTest('solders required only for signature negative')
  self.run_copy(change,'invalid signature',True,True)
 def test_resealed_wrong_layout_source_diff(self):
  def change(p):
   m=json.loads((p/'measurement.json').read_text());m['layout']['raw_losses_vs_source_only']=m['layout']['raw_losses_vs_source_only']+['0x120'];(p/'measurement.json').write_text(json.dumps(m))
  self.run_copy(change,'FAIL: layout raw',True)
 def test_resealed_parent_layout_mismatch(self):
  def change(p):
   m=json.loads((p/'measurement.json').read_text());m['layout']['parent_layout']['raw']+=1;(p/'measurement.json').write_text(json.dumps(m))
  self.run_copy(change,'FAIL: layout raw vs parent layout layer',True)
 def test_predict_cli_preserves_order_and_bindings(self):
  with tempfile.TemporaryDirectory()as td:
   d=Path(td);source=d/'symbols.so';mapping=d/'link.map'
   source.write_bytes(gzip.decompress((P/'builds/a/symbols.so.gz').read_bytes()))
   mapping.write_bytes(gzip.decompress((P/'layout/link-map.txt.gz').read_bytes()))
   hashes={p:hashlib.sha256(p.read_bytes()).hexdigest()for p in [source,mapping]}
   tool=runpy.run_path(str(P/'tools/lay.py'),run_name='layout_review')
   self.assertEqual(hashlib.sha256(tool['ORIG'].read_bytes()).hexdigest(),'6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7')
   model=tool['Layout'](source,mapping);before=(dict(model.bind),dict(model.dplace))
   measure=runpy.run_path(str(P/'tools/measure.py'),run_name='measure_review')
   rows=measure['measure'](tool['ORIG'],source);prediction=model.predict(rows)
   self.assertEqual(before,(model.bind,model.dplace));self.assertEqual(len(prediction),784)
   out=d/'ordered.ld';pred=d/'prediction.json';report=d/'report.json'
   command=[sys.executable,'-I','-B',str(P/'tools/lay.py'),str(source),str(mapping),'--mode','order','--ld',str(out),'--predict',str(pred),'--report',str(report)]
   result=subprocess.run(command,capture_output=True,text=True,timeout=30)
   self.assertEqual(result.returncode,0,result.stderr)
   self.assertEqual(out.read_bytes(),(P/'layout/ordered.ld').read_bytes())
   self.assertEqual(json.loads(pred.read_text()),prediction)
   self.assertEqual(json.loads(report.read_text())['data_placed'],len(model.dplace))
   self.assertEqual(hashes,{p:hashlib.sha256(p.read_bytes()).hexdigest()for p in hashes})
if __name__=='__main__':unittest.main(verbosity=2)
