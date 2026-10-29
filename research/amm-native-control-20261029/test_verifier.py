#!/usr/bin/env python3
"""Meaningful negative controls for this evidence package's acceptance boundaries."""
import copy
import importlib.util
from pathlib import Path
import tempfile
import unittest

P = Path(__file__).resolve().parent
s = importlib.util.spec_from_file_location('proof', P/'verify.py')
v = importlib.util.module_from_spec(s)
s.loader.exec_module(v)


class EvidenceMutationTests(unittest.TestCase):
    def test_one_real_expression_only(self):
        a = v.source_files(P/'recorded/control/source.tar.gz')
        b = v.source_files(P/'recorded/candidate/source.tar.gz')
        v.verify_source_pair(a, b)
        bad = dict(b)
        bad[v.SELL] += b'\n'
        with self.assertRaisesRegex(ValueError, 'beyond the one'):
            v.verify_source_pair(a, bad)

    def test_wrapper_path_change_cannot_hide_logic_change(self):
        for name, count in [('rustc_wrapper.py', 2), ('linker_wrapper.py', 5)]:
            source = (P/'reference'/name).read_text()
            adapted = source.replace('/out/', '/tmp/owned-proof/')
            v.verify_wrapper(source, adapted, '/tmp/owned-proof', count)
            with self.assertRaisesRegex(ValueError, 'beyond output transport'):
                v.verify_wrapper(source, adapted+'\narguments += ["--bad-flag"]\n', '/tmp/owned-proof', count)

    def test_omitted_raw_loss_is_rejected(self):
        rows = v.load(P/'recorded/candidate/census-785.json')
        changed = copy.deepcopy(rows)
        row = next(r for r in changed if not r['raw'] and r['match'])
        row['raw'] = True
        with self.assertRaisesRegex(ValueError, 'census changed'):
            v.verify_census(rows, changed, 784, 257)

    def test_official_sell_cannot_be_marked_recovered(self):
        rows = v.load(P/'recorded/candidate/census-785.json')
        changed = copy.deepcopy(rows)
        next(r for r in changed if int(r['original'], 16) == 0x4c750)['match'] = 'fabricated'
        with self.assertRaisesRegex(ValueError, 'census changed'):
            v.verify_census(rows, changed, 785, 257)

    def test_compressed_elf_tamper_fails_manifest_before_execution(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            target = root/'candidate.so.gz'
            target.write_bytes(b'proof')
            (root/'MANIFEST.json').write_text('{"files":{"candidate.so.gz":{"bytes":5,"sha256":"'+v.sha(b'proof')+'"}}}')
            v.authenticate(root)
            target.write_bytes(b'altered')
            with self.assertRaisesRegex(ValueError, 'manifest'):
                v.authenticate(root)

    def test_complete_byte_delta_includes_removed_suffix(self):
        result = v.delta(b'abcdxy', b'abzd')
        self.assertEqual(result['changed_offset_runs'], [[2, 3]])
        self.assertEqual(result['missing_after_bytes'], 2)
        self.assertEqual(result['differing_common_extent_bytes'], 1)


if __name__ == '__main__':
    unittest.main()
