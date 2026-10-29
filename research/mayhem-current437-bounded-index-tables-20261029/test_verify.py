from pathlib import Path
import json
import shutil
import tempfile
import unittest
import proof

ROOT = Path(__file__).resolve().parents[2]

class MutationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        prev = proof.prior(ROOT).prior(ROOT)
        names = prev.prior(ROOT)
        cls.bundle = names.images(ROOT, *prev.images(ROOT))

    def test_tables_pointer_bound_and_load(self):
        for left, right, offset, reg, expected, _ in proof.SITES:
            for side, owner in [('original', left), ('candidate', right)]:
                image = self.bundle[side+'_elf']
                window = self.bundle[side+'_windows'][owner]
                info = proof.trace(image, window, offset, reg, expected)
                section = next(s for s in image.sections if s['name'] == '.rodata')
                at = section['offset'] + info['pointer'] - section['address']
                pc = window['start'] + offset
                offsets = [-24, -16, -8, 16, 24] if reg == 2 else [-56, -48, -40, -32, -24, -16, -8, 16, 24, 32]
                positions = list(range(at, at + len(expected))) + [pc + 4] + [pc + x for x in offsets]
                for pos in positions:
                    saved = image.b
                    changed = bytearray(saved)
                    changed[pos] ^= 1
                    image.b = bytes(changed)
                    try:
                        with self.assertRaises((AssertionError, KeyError, IndexError)):
                            proof.trace(image, window, offset, reg, expected)
                    finally:
                        image.b = saved

    def test_coverage_mutation(self):
        with tempfile.TemporaryDirectory() as tmp:
            packet = Path(tmp)/'packet'
            shutil.copytree(Path(__file__).resolve().parent, packet)
            data = json.loads((packet/'coverage-delta.json').read_bytes())
            data['new_payload_bytes'] += 1
            (packet/'coverage-delta.json').write_text(json.dumps(data))
            with self.assertRaises(AssertionError):
                proof.check(packet, ROOT)

    def test_latest_baseline_and_disjoint_union(self):
        report=proof.inspect(ROOT)
        delta=proof.delta(ROOT,report)
        baseline=json.loads((ROOT/proof.BASELINE/'coverage-delta.json').read_bytes())
        before={i for s in baseline['sections'] for a,b in s['covered_intervals'] for i in range(a,b)}
        after={i for s in delta['sections'] for a,b in s['covered_intervals'] for i in range(a,b)}
        self.assertTrue(before<=after)
        self.assertEqual((len(before),len(after-before),len(after)),(21634,162,21796))

if __name__ == '__main__':
    unittest.main()
