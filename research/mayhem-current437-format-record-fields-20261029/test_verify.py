if not __debug__:
    raise SystemExit('Run without -O')
from pathlib import Path
import json
import shutil
import tempfile
import unittest
import proof

ROOT = Path(__file__).resolve().parents[2]

class Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        p = proof.prior(ROOT)
        d = p.prior(ROOT).prior(ROOT).base_reader(ROOT)
        original = (ROOT/'evidence/original/mayhem/deployed.so').read_bytes()
        candidate = d.inputs(ROOT, 'mayhem-current437-composition-20261028')
        prefix, _, _ = d.readers(ROOT/p.prior(ROOT).prior(ROOT).BASE, ROOT)
        cls.images = prefix.elves(original, candidate)

    def test_mutated_fields_and_instructions(self):
        for image, owner, callee, ptr in zip(self.images,(664640,598320),(678096,611776),(720328,700768)):
            section = next(s for s in image.sections if s['name'] == '.rodata')
            base = section['offset'] + ptr - section['address']
            locations = [base+i for a,b in proof.SLICES for i in range(a,b)]
            locations += [owner+168, owner+640, owner+644, owner+656, owner+824, callee+200, callee+208, callee+216, callee+224, callee+272, callee+280, callee+392, callee+400]
            saved = image.b
            for loc in locations:
                changed = bytearray(saved); changed[loc] ^= 1; image.b = bytes(changed)
                with self.subTest(owner=owner, location=loc), self.assertRaises(AssertionError):
                    proof.trace(image,owner,callee,ptr)
            image.b = saved

    def test_tampered_observations_rejected(self):
        with tempfile.TemporaryDirectory(dir=ROOT) as tmp:
            packet = Path(tmp)/'packet'; shutil.copytree(Path(__file__).resolve().parent,packet)
            (packet/'observations.json.gz').write_bytes(b'changed')
            with self.assertRaises(AssertionError): proof.check(packet,ROOT)

    def test_exact_intervals(self):
        report = proof.inspect(ROOT)
        self.assertEqual(report['intervals'],[[720328,720330],[720344,720346],[720360,720372]])
        self.assertEqual(report['new_bytes'],16)
        old = json.loads((ROOT/proof.PRIOR/'coverage-delta.json').read_bytes())
        covered = next(x['covered_intervals'] for x in old['sections'] if x['section']=='.rodata')
        self.assertFalse(any(a < d and c < b for a,b in report['intervals'] for c,d in covered))



class ReviewedBaselineControls(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Tests.setUpClass()

    def test_reviewed_baseline_and_resealed_delta(self):
        import gzip, hashlib, json, shutil, tempfile
        packet = Path(__file__).resolve().parent
        root = next(parent for parent in packet.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())
        report = json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
        delta = proof._review_coverage(root, report)
        self.assertEqual(delta['baseline_payload_bytes'], 21796)
        self.assertEqual(delta['new_payload_bytes'], 16)
        self.assertEqual(delta['payload_covered_bytes'], 21796 + 16)
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

    def test_concrete_branch_and_single_record_loop(self):
        import copy
        images = Tests.images
        for image,owner,callee,pointer in zip(images,(664640,598320),(678096,611776),(720328,700768)):
            for offset in (224,272,504,512,520,528,536,544):
                changed = copy.copy(image)
                blob = bytearray(image.b)
                blob[callee + offset + 2] ^= 1
                changed.b = bytes(blob)
                with self.subTest(callee=callee,offset=offset), self.assertRaises(AssertionError):
                    proof.trace(changed,owner,callee,pointer)

    def test_untraversed_record_bytes_are_not_absorbed(self):
        import copy
        for image,owner,callee,pointer in zip(Tests.images,(664640,598320),(678096,611776),(720328,700768)):
            expected = proof.trace(image,owner,callee,pointer)
            section = next(s for s in image.sections if s['name'] == '.rodata')
            for offset in (18,19):
                changed = copy.copy(image)
                blob = bytearray(image.b)
                blob[section['offset'] + pointer - section['address'] + offset] ^= 1
                changed.b = bytes(blob)
                self.assertEqual(proof.trace(changed,owner,callee,pointer), expected)

if __name__ == '__main__': unittest.main()
