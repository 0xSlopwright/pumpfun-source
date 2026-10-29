#!/usr/bin/env python3
"""Reject concrete proof corruption using the real frozen SellV2 inputs in memory."""
from pathlib import Path
import argparse, copy, importlib.util, json, struct, unittest

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('sell_order_verify',HERE/'verify.py')
v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
ROOT=HERE.parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--original',type=Path,default=ROOT/'evidence/original/pump/deployed.so')
parser.add_argument('--symbols',type=Path,default=ROOT/v.PACKET/'artifacts/unstripped.so')
parser.add_argument('--inventory',type=Path,default=ROOT/v.PACKET/'analysis/inventory.json.gz')
parser.add_argument('--source',type=Path,default=ROOT/v.PACKET/'source/src/sell_v2.rs')
args,rest=parser.parse_known_args()

def mutate_text(data,address,relative,payload):
 # Locate the function bytes from the authenticated ELF; only the in-memory test copy changes.
 raw=v.elf_body(data,address,13976)
 at=data.index(raw)
 assert data.find(raw,at+1)==-1
 result=bytearray(data);result[at+relative:at+relative+len(payload)]=payload
 return bytes(result)

class FrozenInputTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.original=args.original.read_bytes();cls.candidate=args.symbols.read_bytes()
  cls.inventory=args.inventory.read_bytes();cls.source=args.source.read_bytes()
  cls.overlay=(HERE/'overlay/sell_v2.rs').read_bytes()

 def test_positive_binds_real_inputs_and_frozen_report(self):
  actual=v.audit(self.original,self.candidate,self.inventory,self.source,self.overlay)
  self.assertEqual(actual,json.loads((HERE/'STATIC-PROOF.json').read_text()))
  self.assertFalse(actual['qualification']['source_overlay_compiled'])
  self.assertFalse(actual['qualification']['sell_v2_vm_executed'])

 def test_original_cfg_dominance_rejects_entry_bypass(self):
  # A real branch entering at Clock bypasses the purportedly dominating key writes.
  jump=struct.pack('<BBhi',0x05,0,0x2ab8//8-1,0)
  changed=mutate_text(self.original,0x144508,0,jump)
  with self.assertRaises(AssertionError):v.analyze(changed,self.candidate)

 def test_cfg_engine_does_not_confuse_physical_order_with_dominance(self):
  # The original real CFG is changed in memory to add an entry edge directly to Clock.
  raw=v.elf_body(self.original,0x144508,13976);graph=v.graph(v.instructions(raw))
  self.assertTrue(v.dominates(graph,0x29e8,0x2ab8))
  graph=copy.deepcopy(graph);graph[0].append(0x2ab8)
  self.assertFalse(v.dominates(graph,0x29e8,0x2ab8))

 def test_key_provenance_rejects_other_account_field(self):
  changed=mutate_text(self.original,0x144508,0x2a00+2,struct.pack('<h',0x160))
  with self.assertRaises(AssertionError):v.analyze(changed,self.candidate)

 def test_event_def_use_rejects_other_snapshot_slot(self):
  changed=mutate_text(self.original,0x144508,0x2fa8+2,struct.pack('<h',-0x108))
  with self.assertRaises(AssertionError):v.analyze(changed,self.candidate)

 def test_key_def_use_rejects_intervening_stack_write(self):
  # An instruction after both snapshots is replaced by an actual overwrite of user word0.
  changed=mutate_text(self.original,0x144508,0x2ac0,struct.pack('<BBhi',0x7a,10,-0x100,0))
  with self.assertRaises(AssertionError):v.analyze(changed,self.candidate)

 def test_call_site_rejects_clock_replaced_with_noncall(self):
  changed=mutate_text(self.original,0x144508,0x2ab8,struct.pack('<BBhi',0xb7,0,0,0))
  with self.assertRaises(AssertionError):v.analyze(changed,self.candidate)

 def test_input_sha_rejects_changed_candidate(self):
  changed=bytearray(self.candidate);changed[-1]^=1
  with self.assertRaisesRegex(AssertionError,'candidate input SHA256 mismatch'):
   v.audit(self.original,bytes(changed),self.inventory,self.source,self.overlay)

 def test_overlay_rejects_additional_arithmetic_change(self):
  changed=self.overlay.replace(b'let quote_transfer_fee=output.checked_sub(net_output)',b'let quote_transfer_fee=output.checked_add(net_output)',1)
  self.assertNotEqual(changed,self.overlay)
  with self.assertRaises(AssertionError):v.verify_overlay(self.source,changed)

 def test_overlay_preserves_all_macro_coordinates(self):
  proof=v.verify_overlay(self.source,self.overlay)
  self.assertEqual(proof['changed_physical_lines'],[402,403])
  self.assertTrue(any(x[0]=='error' for x in proof['macro_sites_unchanged']))
  self.assertEqual(v.source_sites(self.source),v.source_sites(self.overlay))

if __name__=='__main__':unittest.main(argv=[__file__]+rest)
