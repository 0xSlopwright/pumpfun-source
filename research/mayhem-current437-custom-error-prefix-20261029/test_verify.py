if not __debug__:
    raise SystemExit('Run without -O')
from pathlib import Path
import json, shutil, tempfile, unittest
import proof
ROOT = Path(__file__).resolve().parents[2]

class MutationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.helper = proof.module(ROOT, proof.HELPER)
        _, cls.original, cls.candidate = cls.helper.images(ROOT, *proof.images(ROOT))

    def test_descriptor_pointer_length_and_payload(self):
        expected = b'Custom program error: '
        for image, desc, pointer in ((self.original,731784,720306),(self.candidate,712224,700746)):
            section = next(s for s in image.sections if s['name']=='.rodata')
            at = section['offset'] + pointer - section['address']
            for pos in list(range(desc,desc+16)) + list(range(at,at+len(expected))):
                saved = image.b; changed = bytearray(saved); changed[pos] ^= 1; image.b = bytes(changed)
                try:
                    with self.assertRaises(AssertionError):
                        self.helper.descriptor(image,desc,pointer,len(expected))
                        assert self.helper.rodata_bytes(image,pointer,len(expected)) == expected
                finally: image.b = saved

    def test_coverage_mutation(self):
        with tempfile.TemporaryDirectory() as tmp:
            packet = Path(tmp)/'packet'; shutil.copytree(Path(__file__).resolve().parent,packet)
            data = json.loads((packet/'coverage-delta.json').read_bytes()); data['new_payload_bytes'] += 1
            (packet/'coverage-delta.json').write_text(json.dumps(data))
            with self.assertRaises(AssertionError): proof.check(packet,ROOT)



class ReviewedBaselineControls(unittest.TestCase):
    def test_reviewed_baseline_and_resealed_delta(self):
        import gzip, hashlib, json, shutil, tempfile
        packet = Path(__file__).resolve().parent
        root = next(parent for parent in packet.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())
        report = json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
        delta = proof._review_coverage(root, report)
        self.assertEqual(delta['baseline_payload_bytes'], 21796)
        self.assertEqual(delta['new_payload_bytes'], 22)
        self.assertEqual(delta['payload_covered_bytes'], 21796 + 22)
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

if __name__ == '__main__': unittest.main()
