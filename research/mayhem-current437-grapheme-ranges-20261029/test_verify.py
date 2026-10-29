if not __debug__:
    raise SystemExit('Run without -O')
"""Mutation controls for the table, its index, and its consumer."""
from pathlib import Path
import copy, gzip, json, os, shutil, tempfile, unittest
import proof

P = Path(__file__).resolve().parent
R = next(p for p in P.parents if (p / 'evidence/original/mayhem/deployed.so').is_file())


class GraphemeRanges(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        old = proof.prior(R)
        original = (R / 'evidence/original/mayhem/deployed.so').read_bytes()
        candidate = old.candidate_bytes(R)
        _, cls.original, cls.candidate = old.images(R, original, candidate)
        cls.report = proof.inspect_images(cls.original, cls.candidate)

    def mutate(self, image, address):
        result = copy.copy(image)
        section = next(s for s in image.sections if s['type'] != 8 and s['address'] <= address < s['address'] + s['size'])
        offset = section['offset'] + address - section['address']
        data = bytearray(image.b)
        data[offset] ^= 1
        result.b = bytes(data)
        return result

    def test_full_verification(self):
        self.assertEqual(proof.check(P, R)['new_rodata_bytes'], 751)

    def test_every_byte_on_both_images(self):
        for original_side, image, base in ((True, self.original, 722528), (False, self.candidate, 702968)):
            for i in range(751):
                changed = self.mutate(image, base + i)
                with self.subTest(original=original_side, byte=i), self.assertRaises(AssertionError):
                    proof.inspect_images(changed if original_side else self.original,
                                         self.candidate if original_side else changed)

    def test_every_index_word_on_both_images(self):
        for original_side, image, base in ((True, self.original, 725292), (False, self.candidate, 705732)):
            for i in range(34):
                changed = self.mutate(image, base + 4 * i + 3)
                with self.subTest(original=original_side, index=i), self.assertRaises(AssertionError):
                    proof.inspect_images(changed if original_side else self.original,
                                         self.candidate if original_side else changed)

    def test_consumer_pointer_sentinel_guard_and_load(self):
        for original_side, image, start in ((True, self.original, 696640), (False, self.candidate, 630320)):
            for offset in (80, 776, 800, 808, 872, 888, 960, 1016):
                changed = self.mutate(image, start + offset + 4)
                with self.subTest(original=original_side, offset=offset), self.assertRaises(AssertionError):
                    proof.inspect_images(changed if original_side else self.original,
                                         self.candidate if original_side else changed)

    def test_following_byte_is_not_included(self):
        changed = self.mutate(self.candidate, 703719)
        self.assertEqual(proof.inspect_images(self.original, changed), self.report)

    def copied(self, change, reseal=False):
        with tempfile.TemporaryDirectory(dir=P.parent) as tmp:
            packet = Path(tmp) / 'packet'
            shutil.copytree(P, packet)
            change(packet)
            if reseal:
                (packet / 'manifest.json').write_text(json.dumps(proof.inventory(packet), indent=2) + '\n')
            with self.assertRaises((AssertionError, ValueError)):
                proof.check(packet, R)

    def test_inventory_and_special_files(self):
        for change in (lambda p: (p / 'extra').write_bytes(b'x'),
                       lambda p: (p / 'alias').symlink_to('inputs.json'),
                       lambda p: os.mkfifo(p / 'pipe')):
            with self.subTest(change=change):
                self.copied(change)

    def test_resealed_observations_and_coverage(self):
        def report(p):
            obj = json.loads(gzip.decompress((p / 'observations.json.gz').read_bytes()))
            obj['tables'][0]['starts'][0] = 1
            (p / 'observations.json.gz').write_bytes(gzip.compress(json.dumps(obj).encode(), mtime=0))
        def coverage(p):
            obj = json.loads((p / 'coverage-delta.json').read_bytes())
            obj['new_payload_bytes'] += 1
            (p / 'coverage-delta.json').write_text(json.dumps(obj))
        self.copied(report, True)
        self.copied(coverage, True)




class ReviewedBaselineControls(unittest.TestCase):
    def test_reviewed_baseline_and_resealed_delta(self):
        import gzip, hashlib, json, shutil, tempfile
        packet = Path(__file__).resolve().parent
        root = next(parent for parent in packet.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())
        report = json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
        delta = proof._review_coverage(root, report)
        self.assertEqual(delta['baseline_payload_bytes'], 21796)
        self.assertEqual(delta['new_payload_bytes'], 751)
        self.assertEqual(delta['payload_covered_bytes'], 21796 + 751)
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
    unittest.main(verbosity=2)
