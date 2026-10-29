from pathlib import Path
import gzip
import importlib.util
import json
import unittest

HERE = Path(__file__).resolve().parent

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result

a = module('cleanup_analysis_tests', HERE / 'analyze.py')
v = module('cleanup_verification_tests', HERE / 'verify.py')
inputs = json.loads((HERE / 'inputs.json').read_bytes())
mirs = json.loads(gzip.decompress((HERE / 'mir/sell-snapshots.json.gz').read_bytes()))
mir = mirs[inputs['final_mir']]
trace = gzip.decompress((HERE / 'runs/13-named-ir-trace/stderr.log.gz').read_bytes())
observed = a.analyze(mir, trace)

class CleanupTests(unittest.TestCase):
    def test_valid_captures(self):
        self.assertEqual(observed['condition_local'], '_52')
        self.assertEqual(observed['boundary']['before']['index'], 16)

    def test_wrong_dead_local(self):
        cleanup = observed['rust_cleanup']
        changed = mir.replace(cleanup, cleanup.replace('StorageDead(_52)', 'StorageDead(_53)'))
        with self.assertRaisesRegex(ValueError, 'condition cleanup'):
            a.analyze(changed, trace)

    def test_wrong_condition_producer(self):
        changed = mir.replace("_52 = anchor_lang::prelude::AccountInfo::<'_>::data_is_empty", "_53 = anchor_lang::prelude::AccountInfo::<'_>::data_is_empty")
        with self.assertRaisesRegex(ValueError, 'condition producer'):
            a.analyze(changed, trace)

    def mutated_boundary(self, old, new):
        row = observed['boundary']['before']
        section = trace[row['offset']:row['end']]
        self.assertIn(old, section)
        return trace[:row['offset']] + section.replace(old, new, 1) + trace[row['end']:]

    def test_lowered_cleanup_has_real_work(self):
        changed = self.mutated_boundary(b'bb85:                                             ; preds = %bb84, %bb78, %bb38\r\n  br label %bb86', b'bb85:                                             ; preds = %bb84, %bb78, %bb38\r\n  call void @extra_work()\r\n  br label %bb86')
        with self.assertRaisesRegex(ValueError, 'empty lowered cleanup'):
            a.analyze(mir, changed)

    def test_wrong_switch_successor(self):
        changed = self.mutated_boundary(b'i64 0, label %bb121', b'i64 0, label %bb120')
        with self.assertRaisesRegex(ValueError, 'named switch successors'):
            a.analyze(mir, changed)

    def test_code_byte_change_is_rejected(self):
        reader = module('cleanup_reader_tests', v.PARENT / 'elf_reader.py')
        baseline = gzip.decompress((v.PARENT / inputs['parent_baseline']).read_bytes())
        named = bytearray(gzip.decompress((HERE / 'outputs/named-symbols.so.gz').read_bytes()))
        class Bytes:
            def read_bytes(self): return bytes(named)
        elf = reader.Elf(Bytes())
        named[elf.lo + 4] ^= 1
        with self.assertRaisesRegex(ValueError, 'only symbol sections differ'):
            a.compare_sections(reader, baseline, bytes(named))

if __name__ == '__main__':
    unittest.main()
