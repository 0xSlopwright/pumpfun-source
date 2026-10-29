#!/usr/bin/env python3
"""Real compiled-artifact and emitted-dataflow mutations; no compiler/VM."""
from pathlib import Path
import argparse,copy,importlib.util,json,struct,unittest,zipfile
HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('measurement_verify',HERE/'verify_measurement.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
p=argparse.ArgumentParser();root=HERE.parents[1];selected=root/m.v.PACKET
p.add_argument('--artifact-zip',type=Path,default=root/'research/pump-current673-macos-qualification/evidence/sell-event-40793772555.zip')
p.add_argument('--baseline',type=Path,default=selected/'artifacts/unstripped.so')
p.add_argument('--baseline-inventory',type=Path,default=selected/'analysis/inventory.json.gz')
p.add_argument('--source-manifest',type=Path,default=selected/'SOURCE-FROZEN.json')
a,rest=p.parse_known_args()

class EmittedArtifactTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.z=a.artifact_zip.read_bytes();contents,manifest=m.artifact(cls.z)
  cls.image=m.Image(contents['unstripped.so']);cls.raw=cls.image.body(0x86170,14128)
  cls.baseline=a.baseline.read_bytes();cls.bi=a.baseline_inventory.read_bytes();cls.sm=a.source_manifest.read_bytes()
  cls.inventory=(HERE/'measurement/inventory.json.gz').read_bytes()

 def test_positive_full_compile_binding_and_static_result(self):
  actual=m.audit(self.z,self.inventory,self.baseline,self.bi,self.sm)
  self.assertEqual(actual,json.loads((HERE/'measurement/COMPILER-STATIC-PROOF.json').read_text()))
  self.assertEqual(actual['ordinal_complete_callee_memberships'],dict(baseline=78,measured=80))
  self.assertFalse(actual['sell_v2_vm_executed']);self.assertFalse(actual['canonical_source_changed'])

 def test_archive_tamper_is_rejected_before_graph_qualification(self):
  bad=bytearray(self.z);bad[-1]^=1
  with self.assertRaises(AssertionError):m.artifact(bytes(bad))

 def test_missing_shared_artifact_does_not_silently_skip(self):
  path=HERE/'measurement/UNAVAILABLE-compiler-artifact.zip'
  self.assertFalse(path.exists())
  with self.assertRaises(FileNotFoundError):path.read_bytes()

 def test_entry_jump_bypassing_actual_key_stores_is_rejected(self):
  bad=bytearray(self.raw);bad[:8]=struct.pack('<BBhi',0x05,0,0x2b30//8-1,0)
  with self.assertRaises(AssertionError):m.emitted(bytes(bad))

 def test_wrong_user_input_account_field_is_rejected(self):
  bad=bytearray(self.raw);struct.pack_into('<h',bad,0x2a78+2,0x160)
  with self.assertRaises(AssertionError):m.emitted(bytes(bad))

 def test_wrong_event_snapshot_consumer_is_rejected(self):
  bad=bytearray(self.raw);struct.pack_into('<h',bad,0x2ff8+2,-0x350)
  with self.assertRaises(AssertionError):m.emitted(bytes(bad))

 def test_intervening_partial_snapshot_overwrite_is_rejected(self):
  bad=bytearray(self.raw);bad[0x2b38:0x2b40]=struct.pack('<BBhi',0x62,10,-0x344,0)
  with self.assertRaises(AssertionError):m.emitted(bytes(bad))

 def test_old_clock_first_image_cannot_be_reported_as_emitted_overlay(self):
  raw=m.v.elf_body(self.baseline,0x86170,14104)
  with self.assertRaises(AssertionError):m.emitted(raw)

if __name__=='__main__':unittest.main(argv=[__file__]+rest)
