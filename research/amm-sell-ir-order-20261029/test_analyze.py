"""Mutation controls for the recorded IR order boundary."""
from pathlib import Path
import gzip
import importlib.util
import unittest

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('analyze', HERE / 'analyze.py')
analyze = importlib.util.module_from_spec(spec)
spec.loader.exec_module(analyze)


class IROrderTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.raw = gzip.decompress((analyze.PARENT / 'runs/05-all-pass-trace/stderr.log.gz').read_bytes())
        cls.report = analyze.analyze(cls.raw)

    def mutate(self, row, old, new):
        start, end = row['offset'], row['end']
        body = self.raw[start:end]
        self.assertIn(old, body)
        return self.raw[:start] + body.replace(old, new, 1) + self.raw[end:]

    def test_all_recorded_ir_is_classified(self):
        self.assertEqual(len(self.report['rows']), 276)
        self.assertEqual(self.report['boundary']['before']['success_block'], '342')
        self.assertEqual(self.report['boundary']['after']['success_block'], '338')

    def test_earlier_adjacency_claim_rejected(self):
        before = self.report['boundary']['before']
        raw = self.mutate(before, before['following_block'].encode(), b'')
        with self.assertRaisesRegex(ValueError, 'IR success-adjacency boundary'):
            analyze.analyze(raw)

    def test_disconnected_select_and_switch_rejected(self):
        before = self.report['boundary']['before']
        raw = self.mutate(before, b'switch i64 %340,', b'switch i64 %999,')
        with self.assertRaisesRegex(ValueError, 'IR switch consumes selected discriminant'):
            analyze.analyze(raw)

    def test_wrong_post_pass_successor_rejected(self):
        after = self.report['boundary']['after']
        raw = self.mutate(after, b'label %338, label %355', b'label %355, label %338')
        with self.assertRaisesRegex(ValueError, 'IR success-adjacency boundary'):
            analyze.analyze(raw)


if __name__ == '__main__':
    unittest.main()
