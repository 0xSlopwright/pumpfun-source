if not __debug__:
 raise SystemExit('Run without -O; inherited readers require assertions.')
from pathlib import Path
import gzip,hashlib,importlib.util,json,shutil,subprocess,sys,tempfile,unittest
P=Path(__file__).resolve().parents[1];R=P.parents[1]
s=importlib.util.spec_from_file_location('queue_verify',P/'verify.py');v=importlib.util.module_from_spec(s);s.loader.exec_module(v)

class QueueEvidenceTests(unittest.TestCase):
 def test_both_actual_traces_and_line_endings(self):
  for name,swapped in [('baseline',False),('swapped',True)]:
   b=v.read(P/f'captures/{name}/stderr.log.gz');a=v.trace_observation(b,swapped)
   self.assertEqual(a['actual_pops'],35);self.assertEqual(a,v.trace_observation(b.replace(b'\r\n',b'\n'),swapped))
 def mutate_trace(self,old,new,message):
  b=v.read(P/'captures/baseline/stderr.log.gz');start=b.index(b'********** List Scheduling %bb.53 ');a=b[:start];tail=b[start:]
  self.assertIn(old,tail)
  with self.assertRaisesRegex(AssertionError,message):v.trace_observation(a+tail.replace(old,new,1))
 def test_reversed_queue_ids_rejected(self):
  self.mutate_trace(b'SCHED_PROBE pop 34:3 33:4',b'SCHED_PROBE pop 34:4 33:3','queue comparison operands')
 def test_hypothetical_node_number_reason_rejected(self):
  self.mutate_trace(b'BURRSort:(left->NodeQueueId > right->NodeQueueId)',b'BURRSort:(left->NodeNum > right->NodeNum)','initial export queue-ID decision')
 def test_wrong_actual_selection_rejected(self):
  self.mutate_trace(b'SCHED_PROBE selected 34',b'SCHED_PROBE selected 33','queue replay selection')
 def test_wrong_export_load_wiring_rejected(self):
  self.mutate_trace(b'SU(34): t86: ch = CopyToReg t0, Register:i64 %80, t80',b'SU(34): t86: ch = CopyToReg t0, Register:i64 %80, t82','first export value')
 def test_changed_comparator_predicate_rejected(self):
  parent=R/'research/pump-exact-sol-scheduler-20261029';sources=v.js(parent/'compiler/sources.json.gz');stock=next(s['content'] for s in sources if s['path'].endswith('ScheduleDAGRRList.cpp'))
  changed=v.read(P/'compiler/ScheduleDAGRRList.cpp.gz').decode();changed=changed.replace('left, right, (LPDiff > RPDiff)','left, right, (LPDiff < RPDiff)',1)
  with self.assertRaisesRegex(AssertionError,'diagnostic return expression label'):v.diagnostic_source(stock,changed)
 def changed_packet(self,relative,change,message,update_result=None):
  with tempfile.TemporaryDirectory() as tmp:
   p=Path(tmp)/'packet';shutil.copytree(P,p);f=p/relative;x=v.js(f);change(x);f.write_bytes(gzip.compress((json.dumps(x,indent=2)+'\n').encode(),mtime=0))
   if update_result:update_result(p)
   seal={f.relative_to(p).as_posix():hashlib.sha256(f.read_bytes()).hexdigest() for f in p.rglob('*') if f.is_file() and f.name!='MANIFEST.json'};(p/'MANIFEST.json').write_bytes((json.dumps(seal,indent=2)+'\n').encode())
   with self.assertRaisesRegex(AssertionError,message):v.verify(R,p)
 def test_resealed_codegen_feature_change_rejected(self):
  self.changed_packet('captures/baseline/launch.json.gz',lambda x:x['command'].remove('-mattr=+store-imm,+jmp-ext'),'probe command binding')
 def test_resealed_environment_change_rejected(self):
  self.changed_packet('captures/baseline/launch.json.gz',lambda x:x['environment'].update(RUSTFLAGS='-C opt-level=0'),'probe environment/cwd binding')
 def test_resealed_build_output_escape_rejected(self):
  def change(x):x['commands']['link']=[a.replace('/llc.exe','/outside.exe') if '/llc.exe' in a else a.replace('\\llc.exe','\\outside.exe') for a in x['commands']['link']]
  self.changed_packet('build/build-launch.json.gz',change,'derivative build command transformation')
 def test_resealed_complete_object_claim_rejected(self):
  self.changed_packet('captures/baseline/result.json.gz',lambda x:x.update(object_sha256='0'*64),'complete probe object equality')
 def test_optimized_entrypoints_refuse(self):
  for entry in [P/'verify.py',P/'tests/test_verify.py']:
   result=subprocess.run([sys.executable,'-I','-O','-B',str(entry)],capture_output=True,text=True)
   self.assertNotEqual(result.returncode,0)
   self.assertEqual(result.stderr.strip(),'Run without -O; inherited readers require assertions.')

if __name__=='__main__':unittest.main()
