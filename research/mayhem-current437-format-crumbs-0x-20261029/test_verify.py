if not __debug__:
    raise SystemExit('Run without -O')
"""Mutation controls for format-crumb and `0x` text-site strings."""
from pathlib import Path
import copy, gzip, json, os, shutil, struct, tempfile, unittest
import proof
P = Path(__file__).resolve().parent
R = next(parent for parent in P.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())


class FormatCrumbs0x(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original = (R / 'evidence/original/mayhem/deployed.so').read_bytes()
        cls.candidate = proof.candidate_bytes(R)
        cls.prefix, cls.original_elf, cls.candidate_elf = proof.images(R, cls.original, cls.candidate)
        cls.report = proof.verify_images(cls.original_elf, cls.candidate_elf)
        cls.strings = cls.report['strings']
        cls.text_sites = cls.report['text_sites']

    def elf(self, blob):
        image = copy.copy(self.candidate_elf)
        image.b = bytes(blob)
        return image

    def file_offset(self, address):
        section = next(
            section for section in self.candidate_elf.sections
            if section['type'] != 8 and section['address'] <= address < section['address'] + section['size']
        )
        return section['offset'] + address - section['address']

    def mutated_string(self, row, index):
        blob = bytearray(self.candidate)
        blob[self.file_offset(row['candidate_ptr']) + index] ^= 1
        return self.elf(blob)

    def mutated_text(self, row):
        blob = bytearray(self.candidate)
        struct.pack_into('<i', blob, self.file_offset(row['candidate_pc']) + 20, row['length'] + 1)
        return self.elf(blob)

    def test_complete(self):
        summary = proof.check(P, R)
        self.assertEqual(
            (summary['normalized_windows'], summary['raw_windows'], summary['extended_windows'], summary['extended_pairs']),
            (437, 141, 431, 581),
        )
        self.assertEqual(
            (summary['string_count'], summary['descriptor_count'], summary['text_site_count']),
            (7, 0, 18),
        )
        self.assertEqual(
            (summary['literal_bytes'], summary['descriptor_bytes'], summary['new_payload_bytes'], summary['rejected_pairs']),
            (11, 0, 11, 0),
        )

    def test_every_string_byte(self):
        for row in self.strings:
            expected = row['text'].encode().hex()
            self.assertEqual(row['original_bytes_hex'], expected)
            self.assertEqual(row['candidate_bytes_hex'], expected)
            for index in range(row['length']):
                with self.subTest(index=row['index'], byte=index):
                    with self.assertRaises(AssertionError):
                        proof.verify_images(self.original_elf, self.mutated_string(row, index))

    def test_every_text_length_immediate(self):
        for row in self.text_sites:
            with self.subTest(pc=row['original_pc']):
                with self.assertRaises(AssertionError):
                    proof.verify_images(self.original_elf, self.mutated_text(row))

    def test_following_byte_is_not_absorbed(self):
        intervals = [
            (row['candidate_ptr'], row['candidate_ptr'] + row['length'])
            for row in self.strings
        ]
        starts = {start for start, _end in intervals}
        row = next(
            row for row in self.strings
            if (row['candidate_ptr'] + row['length']) not in starts
            and not any(start <= row['candidate_ptr'] + row['length'] < end for start, end in intervals)
        )
        end = row['candidate_ptr'] + row['length']
        blob = bytearray(self.candidate)
        blob[self.file_offset(end)] ^= 1
        self.assertEqual(proof.verify_images(self.original_elf, self.elf(blob)), self.report)

    def copied(self, change, reseal=False):
        with tempfile.TemporaryDirectory() as temporary:
            packet = Path(temporary) / 'packet'
            shutil.copytree(P, packet, ignore=shutil.ignore_patterns('__pycache__'))
            change(packet)
            if reseal:
                inventory = {
                    str(path.relative_to(packet)): proof.sha(path.read_bytes())
                    for path in packet.rglob('*')
                    if path.is_file() and path != packet / 'manifest.json' and '__pycache__' not in path.parts
                }
                (packet / 'manifest.json').write_text(json.dumps(inventory, indent=2) + '\n')
            with self.assertRaises((AssertionError, ValueError)):
                proof.check(packet, R)

    def test_unlisted_file(self):
        self.copied(lambda packet: (packet / 'extra').write_bytes(b'x'))

    def test_symlink(self):
        self.copied(lambda packet: (packet / 'alias').symlink_to('inputs.json'))

    def test_fifo(self):
        self.copied(lambda packet: os.mkfifo(packet / 'pipe'))

    def test_resealed_report(self):
        def change(packet):
            report = json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
            report['observations']['strings'][0]['candidate_ptr'] += 1
            (packet / 'observations.json.gz').write_bytes(
                gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0)
            )
        self.copied(change, True)

    def test_resealed_coverage(self):
        def change(packet):
            delta = json.loads((packet / 'coverage-delta.json').read_bytes())
            delta['new_payload_bytes'] += 1
            (packet / 'coverage-delta.json').write_text(json.dumps(delta))
        self.copied(change, True)




class ReviewedBaselineControls(unittest.TestCase):
    def test_reviewed_baseline_and_resealed_delta(self):
        import gzip, hashlib, json, shutil, tempfile
        packet = Path(__file__).resolve().parent
        root = next(parent for parent in packet.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())
        report = json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
        delta = proof._review_coverage(root, report)
        self.assertEqual(delta['baseline_payload_bytes'], 21796)
        self.assertEqual(delta['new_payload_bytes'], 11)
        self.assertEqual(delta['payload_covered_bytes'], 21796 + 11)
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

    def test_every_pointer_argument_register_on_both_images(self):
        import copy
        packet = Path(__file__).resolve().parent
        root = next(parent for parent in packet.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())
        original = (root / 'evidence/original/mayhem/deployed.so').read_bytes()
        _, left, right = proof.images(root, original, proof.candidate_bytes(root))
        for side, image in enumerate((left, right)):
            for row in proof.TEXT_SITES:
                pc, pointer = row[side], row[2 + side]
                changed = copy.copy(image)
                blob = bytearray(image.b)
                blob[pc + 1] ^= 1
                changed.b = bytes(blob)
                with self.subTest(side=side,pc=pc), self.assertRaisesRegex(AssertionError, 'pointer argument register'):
                    proof.text_site(changed, pc, pointer, row[4], row[5])

if __name__ == '__main__':
    unittest.main(verbosity=2)
