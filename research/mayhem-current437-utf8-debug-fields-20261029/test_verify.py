if not __debug__:
    raise SystemExit('Run without -O')
from pathlib import Path
import copy
import unittest
import proof

ROOT = Path(__file__).resolve().parents[2]


class Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        copy_module = proof.module(ROOT, proof.COPY)
        old = copy_module.prior(ROOT)
        original, candidate = copy_module.images(ROOT)
        cls.bundle = old.images(ROOT, original, candidate)
        cls.counted = staticmethod(old.counted)

    def test_valid_both_images(self):
        for side, start in [('original', 646872), ('candidate', 580552)]:
            proof.trace(self.bundle[side + '_elf'], self.bundle[side + '_windows'][start], self.counted)

    def test_each_string_and_instruction_mutation_fails(self):
        for side, start in [('original', 646872), ('candidate', 580552)]:
            image = self.bundle[side + '_elf']
            window = self.bundle[side + '_windows'][start]
            report = proof.trace(image, window, self.counted)
            positions = [start + x for x in (80, 136, 144, 168, 184, 192, 208)]
            for entry in report['strings']:
                section = next(s for s in image.sections if s['name'] == '.rodata')
                positions.extend(section['offset'] + entry['pointer'] - section['address'] + i for i in range(entry['length']))
            for pos in positions:
                changed = copy.copy(image)
                data = bytearray(image.b)
                data[pos] ^= 1
                changed.b = bytes(data)
                with self.subTest(side=side, position=pos), self.assertRaises(AssertionError):
                    proof.trace(changed, window, self.counted)

    def test_real_packet(self):
        self.assertEqual(proof.check(Path(__file__).resolve().parent, ROOT)['new_bytes'], 29)




class ReviewedBaselineControls(unittest.TestCase):
    def test_reviewed_baseline_and_resealed_delta(self):
        import gzip, hashlib, json, shutil, tempfile
        packet = Path(__file__).resolve().parent
        root = next(parent for parent in packet.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())
        report = json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
        delta = proof._review_coverage(root, report)
        self.assertEqual(delta['baseline_payload_bytes'], 21796)
        self.assertEqual(delta['new_payload_bytes'], 29)
        self.assertEqual(delta['payload_covered_bytes'], 21796 + 29)
        with tempfile.TemporaryDirectory() as temporary:
            view = Path(temporary)
            (view / 'research').mkdir()
            for entry in root.iterdir():
                if entry.name != 'research': (view / entry.name).symlink_to(entry, target_is_directory=entry.is_dir())
            for entry in (root / 'research').iterdir():
                if entry.name != packet.name: (view / 'research' / entry.name).symlink_to(entry, target_is_directory=entry.is_dir())
            trial = view / 'research' / packet.name
            shutil.copytree(packet, trial)
            changed = json.loads((trial / 'coverage-delta.json').read_bytes())
            changed['new_payload_bytes'] += 1
            (trial / 'coverage-delta.json').write_text(json.dumps(changed))
            pins = json.loads((trial / 'inputs.json').read_bytes())
            for name in list(pins):
                if name.startswith('research/' + packet.name + '/'):
                    pins[name] = hashlib.sha256((view / name).read_bytes()).hexdigest()
            (trial / 'inputs.json').write_text(json.dumps(pins))
            inventory = {str(q.relative_to(trial)): hashlib.sha256(q.read_bytes()).hexdigest()
                for q in sorted(trial.rglob('*')) if q.is_file() and q.name != 'manifest.json'}
            (trial / 'manifest.json').write_text(json.dumps(inventory))
            with self.assertRaisesRegex(AssertionError, 'coverage delta differs'):
                proof.check(trial, view)

if __name__ == '__main__':
    unittest.main()
