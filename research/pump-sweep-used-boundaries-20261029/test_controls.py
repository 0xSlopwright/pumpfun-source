#!/usr/bin/env python3
"""Negative controls for the static evidence gate; no program execution."""
import copy
import json
from pathlib import Path
import struct
import unittest
import verify as v


class EvidenceControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original = (v.ROOT / 'evidence/original/pump/deployed.so').read_bytes()
        cls.os = v.sections(cls.original)
        cls.proposal = json.loads((v.HERE / 'PROPOSAL.json').read_text())
        cls.ledger = json.loads((v.HERE / 'ARGUMENT-LEDGER.json').read_text())

    def test_original_state_and_argument_rows(self):
        v.check_state(self.proposal, self.original, self.os)
        for name in ('native_topup', 'common_transfer'):
            for row in self.ledger[name]['instruction_slice']:
                v.check_instruction(row, self.original, self.os)

    def test_rejects_changed_original_argument_bytes(self):
        row = copy.deepcopy(self.ledger['native_topup']['instruction_slice'][-4])
        row['raw'] = '0000000000000000'
        with self.assertRaisesRegex(ValueError, 'raw'):
            v.check_instruction(row, self.original, self.os)

    def test_rejects_wrong_actual_callee_despite_unchanged_raw_row(self):
        rows = self.ledger['common_transfer']['instruction_slice']
        row = copy.deepcopy(next(x for x in rows if 'actual_callee' in x))
        row['actual_callee'] = '0x8cc58'
        with self.assertRaisesRegex(ValueError, 'actual_callee'):
            v.check_instruction(row, self.original, self.os)

    def test_rejects_clear_of_different_bucket(self):
        proposal = copy.deepcopy(self.proposal)
        proposal['state_order'][0]['original_instructions'][2]['offset'] = 0x78
        with self.assertRaisesRegex(ValueError, 'offset'):
            v.check_state(proposal, self.original, self.os)

    def test_rejects_overlay_mutation(self):
        before = (v.HERE / 'source-before.rs').read_bytes()
        after = (v.HERE / 'source/programs/pump/src/sweep_fees.rs').read_bytes()
        v.check_source(before, after, self.proposal)
        changed = after.replace(b'a.bonding_curve.protocol_fees=0;', b'a.bonding_curve.creator_fee=0;')
        with self.assertRaisesRegex(ValueError, 'overlay source hash'):
            v.check_source(before, changed, self.proposal)

    def test_call_target_mutation_is_hidden_by_normalizer_but_not_edge_check(self):
        # Two copies of the authentic original isolate the edge check from ELF hashes.
        # The helper body still normalizes identically after changing one call target.
        import gzip
        import os
        inventory = Path(os.environ.get('PUMP_SWEEP_INVENTORY',
            v.ROOT / 'research/pump-final-composition-673-20261028/analysis/inventory.json.gz'))
        sizes = {x['start']: x['bytes'] for x in json.loads(gzip.decompress(inventory.read_bytes()))['windows']}
        start = 0x8cc58
        raw = v.body(self.original, self.os, start, sizes[start])
        normalized, operands = v.normalize(raw, start, self.os)
        call = next(x for x in operands if x['kind'] == 'direct-call')
        pc = start + call['offset']
        changed = bytearray(self.original)
        file_offset = self.os['.text']['offset'] + pc - self.os['.text']['addr']
        # Redirect to the authentic, differently sized Rent::get helper.
        struct.pack_into('<i', changed, file_offset + 4, (0x1a0a20 - pc - 8) // 8)
        changed = bytes(changed)
        self.assertEqual(normalized, v.normalize(v.body(changed, self.os, start, sizes[start]), start, self.os)[0])
        with self.assertRaisesRegex(ValueError, 'helper normalized body differs'):
            v.helper_pair(self.original, changed, self.os, self.os, sizes, sizes, start, start, 2)


if __name__ == '__main__':
    unittest.main()
