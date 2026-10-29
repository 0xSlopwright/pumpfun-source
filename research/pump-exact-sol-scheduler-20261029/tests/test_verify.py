from pathlib import Path
import copy,gzip,hashlib,importlib.util,json,shutil,tempfile,unittest
P=Path(__file__).resolve().parents[1];R=P.parents[1]
s=importlib.util.spec_from_file_location('scheduler_verify',P/'verify.py');v=importlib.util.module_from_spec(s);s.loader.exec_module(v)

class EvidenceTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.tmp=tempfile.TemporaryDirectory();d=Path(cls.tmp.name);audit=v.module('scheduler_test_audit',R/'research/pump-exact-sol-guard-20261029/audit_target.py')
  for n in ['control.o','swapped.o']:(d/n).write_bytes(v.read(P/'outputs'/(n+'.gz')))
  cls.raw,cls.reloc=v.object_target(audit,d/'control.o');cls.changed,cls.changed_reloc=v.object_target(audit,d/'swapped.o');cls.ir=v.read(P/'inputs/control.ll.gz');cls.swapped_ir=v.read(P/'inputs/swapped.ll.gz')
 @classmethod
 def tearDownClass(cls):cls.tmp.cleanup()
 def check(self,**change):
  args=dict(a=self.ir,b=self.swapped_ir,raw=self.raw,changed=self.changed,relocs=self.reloc,changed_relocs=self.changed_reloc);args.update(change);return v.counterfactual(**args)
 def test_real_counterfactual(self):self.assertEqual(self.check(),[1003,1004])
 def test_extra_ir_change_rejected(self):
  with self.assertRaisesRegex(AssertionError,'IR change'):self.check(b=self.swapped_ir+b'; extra change\n')
 def test_unrelated_opcode_change_rejected(self):
  data=bytearray(self.changed);data[0]^=1
  with self.assertRaisesRegex(AssertionError,'instruction slots'):self.check(changed=bytes(data))
 def test_changed_call_relocation_rejected(self):
  rows=copy.deepcopy(self.changed_reloc);rows[0]['symbol']='different_callee'
  with self.assertRaisesRegex(AssertionError,'relocations'):self.check(changed_relocs=rows)
 def test_missing_scheduler_decision_rejected(self):
  trace=v.read(P/'traces/control-scheduler.log.gz');self.assertEqual([x[2] for x in v.schedule(trace,[0,8])],[0,8]);trace=trace.replace(b'RegPressureDiff SU(33): 1 != SU(32): -1',b'omitted decision')
  with self.assertRaisesRegex(AssertionError,'decision missing'):v.schedule(trace,[0,8])
 def test_unknown_relocation_mask_rejected(self):
  rows=copy.deepcopy(self.reloc);rows[0]['type']=999
  with self.assertRaisesRegex(AssertionError,'unsupported'):v.normalize_object(self.raw,rows)

 def test_resealed_wrong_sdk_features_rejected(self):
  with tempfile.TemporaryDirectory() as tmp:
   packet=Path(tmp)/'packet';shutil.copytree(P,packet)
   for name in ['whole-module-launch.json.gz','whole-module-result.json.gz']:
    path=packet/'observations/qualification03-sdk-features'/name;value=v.js(path)
    value['command']=[arg.replace('-mattr=+store-imm,+jmp-ext','-mattr=-store-imm,-jmp-ext') for arg in value['command']]
    path.write_bytes(gzip.compress((json.dumps(value,indent=2)+'\n').encode(),mtime=0))
   files={p.relative_to(packet).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in packet.rglob('*') if p.is_file() and p.name!='MANIFEST.json'}
   (packet/'MANIFEST.json').write_text(json.dumps(files,indent=2)+'\n')
   with self.assertRaisesRegex(AssertionError,'SDK feature flags'):v.verify(R,packet)
 def test_qualified_launch_result_mismatch_rejected(self):
  with tempfile.TemporaryDirectory() as tmp:
   packet=Path(tmp)/'packet';shutil.copytree(P,packet)
   path=packet/'observations/qualification03-sdk-features/whole-module-result.json.gz';value=v.js(path);value['command'].append('-O0');path.write_bytes(gzip.compress((json.dumps(value,indent=2)+'\n').encode(),mtime=0))
   files={p.relative_to(packet).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in packet.rglob('*') if p.is_file() and p.name!='MANIFEST.json'}
   (packet/'MANIFEST.json').write_text(json.dumps(files,indent=2)+'\n')
   with self.assertRaisesRegex(AssertionError,'launch/result mismatch'):v.verify(R,packet)

if __name__=='__main__':unittest.main()
