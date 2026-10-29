#!/usr/bin/env python3
"""Exercise attribution against real ELF mutations, not just hash failures."""
import copy
import json
from pathlib import Path
import struct
import tempfile
import unittest

import audit


class BoundaryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tools, _ = audit.dependencies()
        cls.o = cls.tools.Inventory(audit.ROOT / audit.ORIGINAL, True)
        cls.c = cls.tools.Inventory(audit.ROOT / audit.CURRENT)
        cls.baseline = audit.run()
        audit.qualify(cls.baseline)
        cls.start = int(cls.baseline['current']['candidate_start'], 16)
        cls.og = cls.o.graph(audit.ENTRY, True)
        cls.cg = cls.c.graph(cls.start, True)

    def rejected_image(self, change):
        data = bytearray(self.c.elf.b)
        change(data)
        with tempfile.TemporaryDirectory(prefix='amm-layout-mutation-') as directory:
            path = Path(directory) / 'changed.so'
            path.write_bytes(data)
            # Deliberately bypass the outer input hash gate. The actual ELF
            # parser, caller binding, CFG comparison and claim checks must fail.
            with self.assertRaises((ValueError, AssertionError, KeyError)):
                candidate = self.tools.Inventory(path)
                r = copy.deepcopy(self.baseline)
                r['current'] = audit.analyze(self.o, candidate, self.tools)
                audit.qualify(r)

    def test_current_and_historical_controls(self):
        self.assertEqual(self.baseline, json.loads(json.dumps(self.baseline)))
        v = self.baseline['current']['comparison']
        self.assertTrue(v['instruction_and_relocation_equal'])
        self.assertEqual(v['register_different_slots'], 0)
        old = self.baseline['historical_pr645']['comparison']
        self.assertEqual(old['register_different_slots'], 120)
        self.assertEqual(sum(x['depth2_identity_equal'] for x in old['calls']), 80)

    def test_used_register_byte(self):
        self.rejected_image(lambda b: b.__setitem__(self.start+1, 0x18))

    def test_value_opcode(self):
        self.rejected_image(lambda b: b.__setitem__(self.start, 0xb7))

    def test_store_displacement(self):
        self.rejected_image(lambda b: struct.pack_into('<h', b, self.start+0x40+2, -800))

    def test_wide_immediate_continuation(self):
        self.rejected_image(lambda b: b.__setitem__(self.start+0xcf8+7, 0x81))

    def test_branch_inverse_without_edge_swap(self):
        self.rejected_image(lambda b: b.__setitem__(self.start+0xd00, 0x1d))

    def test_branch_edge_target(self):
        self.rejected_image(lambda b: struct.pack_into('<h', b, self.start+8+2, 0))

    def test_branch_compared_constant(self):
        self.rejected_image(lambda b: struct.pack_into('<i', b, self.start+8+4, 2))

    def test_actual_caller_redirect(self):
        at = 0x498e8 + 0x13d0
        self.rejected_image(lambda b: struct.pack_into('<i', b, at+4, (0x3a10-at-8)//8))

    def test_masked_immediate_callee_redirect(self):
        at = self.start + 0x1798
        target = next(a for a, f in self.c.functions.items() if f['name'] == 'memcpy')
        self.rejected_image(lambda b: struct.pack_into('<i', b, at+4, (target-at-8)//8))

    def test_corrected_nested_decoder_invalidates_stale_report(self):
        target = next(a for a in self.c.functions if self.c.tag(a, 0) == self.o.tag(0xd4f90, 0))
        at = 0x3a10 + 0x290
        self.rejected_image(lambda b: struct.pack_into('<i', b, at+4, (target-at-8)//8))

    def test_missing_instruction(self):
        c = copy.deepcopy(self.cg)
        c['nodes'][0]['code'].pop()
        self.assertFalse(audit.compare_graphs(self.og, c, self.tools)['instruction_and_relocation_equal'])

    def test_changed_relocation_metadata(self):
        c = copy.deepcopy(self.cg)
        row = next(r for n in c['nodes'] for r in n['code'] if r['relocation'])
        row['relocation']['type'] ^= 1
        self.assertFalse(audit.compare_graphs(self.og, c, self.tools)['instruction_and_relocation_equal'])

    def test_wrong_graph_edge_role(self):
        c = copy.deepcopy(self.cg)
        c['nodes'][0]['edges'].reverse()
        self.assertFalse(audit.compare_graphs(self.og, c, self.tools)['topology']['verified'])

    def test_missing_reachable_node(self):
        c = copy.deepcopy(self.cg)
        c['nodes'].pop(0)
        self.assertFalse(audit.compare_graphs(self.og, c, self.tools)['topology']['verified'])


if __name__ == '__main__':
    unittest.main(verbosity=2)
