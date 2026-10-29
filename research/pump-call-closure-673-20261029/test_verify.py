#!/usr/bin/env python3
"""Actual-input and graph mutations for the fixed Pump673 call-closure audit."""
from pathlib import Path
import argparse,copy,gzip,importlib.util,json,struct,unittest

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('closure_verify',HERE/'verify.py')
v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v)
parser=argparse.ArgumentParser()
root=HERE.parents[1];selected=root/'research/pump-final-composition-673-20261028'
parser.add_argument('--original',type=Path,default=root/'evidence/original/pump/deployed.so')
parser.add_argument('--candidate',type=Path,default=selected/'artifacts/unstripped.so')
parser.add_argument('--inventory',type=Path,default=selected/'analysis/inventory.json.gz')
args,rest=parser.parse_known_args()

class ActualInputTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.ob=args.original.read_bytes();cls.cb=args.candidate.read_bytes();cls.ib=args.inventory.read_bytes()
  cls.o=v.ELF(cls.ob);cls.c=v.ELF(cls.cb)
  cls.inventory=json.loads(gzip.decompress(cls.ib));cls.windows={w['start']:w for w in cls.inventory['windows']}
  cls.members={s:{m['start'] for m in w['normalized_matches']} for s,w in cls.windows.items()}
  cls.report=v.audit(cls.ob,cls.cb,cls.ib)

 def edge(self,status):
  return next((p,e) for p in self.report['pairs'] for e in p['edges'] if e['status']==status)

 def classify(self,old,new):return v.classify_edge(old,new,self.o,self.c,self.windows,self.members)

 def test_complete_recomputed_graph_equals_retained_proof(self):
  self.assertEqual(self.report,json.loads(gzip.decompress((HERE/'call-closure.json.gz').read_bytes())))
  self.assertEqual(len(self.report['original_graph']),1035)
  self.assertEqual(len(self.report['candidate_graph']),1045)
  self.assertEqual(len(self.report['pairs']),2360)
  self.assertEqual(sum(len(w['calls']) for w in self.report['original_graph']),11005)

 def test_input_byte_change_cannot_enter_qualified_graph(self):
  bad=bytearray(self.cb);bad[-1]^=1
  with self.assertRaises(AssertionError):v.audit(self.ob,bytes(bad),self.ib)

 def test_inventory_deletion_cannot_shrink_denominator(self):
  inventory=copy.deepcopy(self.inventory);inventory['windows'].pop()
  bad=gzip.compress(json.dumps(inventory).encode(),mtime=0)
  with self.assertRaises(AssertionError):v.audit(self.ob,self.cb,bad)

 def test_actual_unique_setter_formatter_boundary_is_not_closed(self):
  p=next(p for p in self.report['pairs'] if p['original']==0x6fef8)
  e=next(e for e in p['edges'] if e['offset']==0x18a8)
  self.assertEqual((e['original']['target'],e['candidate']['target']),(0xd300,0x1ad880))
  self.assertEqual(e['status'],'different_complete_callee')
  self.assertFalse(p['direct_closure'])
  # Graph-only mutation: a strictly matching target would be distinguished.
  new=copy.deepcopy(e['candidate']);new['target']=0xd450
  self.assertEqual(self.classify(e['original'],new)['status'],'matched_complete_callee')

 def test_same_call_instruction_different_import_stays_different(self):
  _,e=self.edge('different_external_import')
  self.assertEqual(e['original']['instruction_hex'],e['candidate']['instruction_hex'])
  self.assertNotEqual(e['original']['import_symbol'],e['candidate']['import_symbol'])
  self.assertEqual(self.classify(e['original'],e['candidate'])['status'],'different_external_import')
  new=copy.deepcopy(e['candidate']);new['import_symbol']=e['original']['import_symbol']
  self.assertEqual(self.classify(e['original'],new)['status'],'same_external_import')

 def test_target_inside_original_window_is_not_entry_identity(self):
  _,e=self.edge('matched_complete_callee')
  old=copy.deepcopy(e['original']);old['target']+=8
  self.assertEqual(self.classify(old,e['candidate'])['status'],'unresolved_original_nonboundary')

 def test_target_inside_candidate_is_not_entry_identity(self):
  _,e=self.edge('matched_complete_callee')
  new=copy.deepcopy(e['candidate']);new['target']+=8
  self.assertEqual(self.classify(e['original'],new)['status'],'unresolved_candidate_nonentry')

 def test_known_gap_target_cannot_be_credited_from_symbol_name(self):
  p,e=self.edge('known_unmatched_original_target')
  self.assertTrue(e['candidate_target_symbols'])
  self.assertEqual(self.members[e['original']['target']],set())
  self.assertFalse(p['direct_closure'])

 def test_indirect_call_same_encoding_remains_unresolved(self):
  p,e=self.edge('unresolved_indirect_same_encoding')
  self.assertEqual(e['original']['instruction_hex'],e['candidate']['instruction_hex'])
  self.assertFalse(p['direct_closure'])

 def test_defined_custom_panic_relocation_preserves_unqualified_boundary(self):
  _,e=self.edge('unresolved_call_kind_or_relocation')
  self.assertEqual(e['original']['kind'],'defined_call_relocation')
  self.assertEqual(e['candidate']['kind'],'defined_call_relocation')
  self.assertEqual(e['original']['relocation_symbol']['symbol'],'custom_panic')
  self.assertEqual(e['candidate']['relocation_symbol']['symbol'],'custom_panic')

 def test_depth2_detects_child_graph_failure_without_promoting_parent(self):
  pairs=[dict(p,edges=[dict(e) for e in p['edges']]) for p in self.report['pairs']]
  by=v.qualify_pairs(pairs)
  parent,edge=next((p,e) for p in pairs if p['depth2_closure'] for e in p['edges']
   if e['status']=='matched_complete_callee' and tuple(e['callee_pair'])!=(p['original'],p['candidate']) and by[tuple(e['callee_pair'])]['edges'])
  child=tuple(edge['callee_pair'])
  for p in pairs:
   if (p['original'],p['candidate'])==child:p['edges'][0]=dict(p['edges'][0],status='unresolved_injected_graph_failure')
  v.qualify_pairs(pairs)
  self.assertTrue(parent['direct_closure']);self.assertFalse(parent['depth2_closure'])

 def test_absent_child_pair_is_error_not_silent_depth2_pass(self):
  pairs=[dict(p,edges=[dict(e) for e in p['edges']]) for p in self.report['pairs']]
  parent,edge=next((p,e) for p in pairs if p['direct_closure'] for e in p['edges'] if e['status']=='matched_complete_callee' and tuple(e['callee_pair'])!=(p['original'],p['candidate']))
  child=tuple(edge['callee_pair']);pairs=[p for p in pairs if (p['original'],p['candidate'])!=child]
  with self.assertRaises(KeyError):v.qualify_pairs(pairs)

 def test_same_address_aliases_remain_and_cannot_hide_conflicting_edges(self):
  grouped={}
  for p in self.report['pairs']:grouped.setdefault((p['original'],p['candidate']),[]).append(p)
  aliases=next(rows for rows in grouped.values() if len(rows)>1)
  self.assertNotEqual(aliases[0]['candidate_symbol'],aliases[1]['candidate_symbol'])
  bad=[copy.deepcopy(aliases[0]),copy.deepcopy(aliases[1])];bad[1]['bytes']+=8
  with self.assertRaises(AssertionError):v.qualify_pairs(bad)
  self.assertEqual(sum(len(rows)-1 for rows in grouped.values()),47)

 def test_per_window_candidates_preserve_every_inventory_alias(self):
  for window in self.report['windows']:
   expected=self.windows[window['original']]['normalized_matches']
   self.assertEqual([(m['start'],m['symbol']) for m in expected],
                    [(m['start'],m['symbol']) for m in window['candidates']])

 def test_normalization_does_not_hide_register_or_branch_changes(self):
  raw=self.o.body(0x6fef8,self.windows[0x6fef8]['bytes']);baseline=self.o.normalize(raw)
  changed=bytearray(raw);changed[1]^=1
  self.assertNotEqual(self.o.normalize(changed),baseline)
  pc=0
  while pc<len(raw):
   op,regs,off,imm=struct.unpack_from('<BBhi',raw,pc)
   if op&7 in (5,6) and op&0xf0 not in (0x80,0x90):break
   pc+=16 if op==0x18 else 8
  self.assertLess(pc,len(raw));changed=bytearray(raw);changed[pc+2]^=1
  self.assertNotEqual(self.o.normalize(changed),baseline)

if __name__=='__main__':unittest.main(argv=[__file__]+rest)
