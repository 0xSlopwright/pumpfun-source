"""Mutation controls for the sixteen Option/seed/path strings, descriptors and sites."""
from pathlib import Path
import copy, gzip, json, os, shutil, struct, tempfile, unittest
import proof
P = Path(__file__).resolve().parent
R = next(parent for parent in P.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())

class OptionSeedsPaths(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original = (R / 'evidence/original/mayhem/deployed.so').read_bytes()
        cls.candidate = proof.candidate_bytes(R)
        cls.prefix, cls.original_elf, cls.candidate_elf = proof.images(R, cls.original, cls.candidate)
        cls.report = proof.verify_images(cls.original_elf, cls.candidate_elf)
        cls.strings = cls.report['strings']
        cls.descriptors = cls.report['descriptors']
        cls.text_sites = cls.report['text_sites']
        cls.path_sites = cls.report['path_sites']

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

    def mutated_descriptor(self, row, field):
        blob = bytearray(self.candidate)
        offset = self.file_offset(row['candidate_offset'])
        if field == 'length':
            struct.pack_into('<Q', blob, offset + 8, row['length'] + 1)
        elif field == 'pointer':
            struct.pack_into('<I', blob, offset + 4, (row['candidate_ptr'] + 1) & 0xffffffff)
        else:
            raise AssertionError(field)
        return self.elf(blob)

    def mutated_text(self, row):
        blob = bytearray(self.candidate)
        struct.pack_into('<i', blob, self.file_offset(row['candidate_pc']) + 20, row['length'] + 1)
        return self.elf(blob)

    def mutated_path(self, row):
        blob = bytearray(self.candidate)
        struct.pack_into('<i', blob, self.file_offset(row['length_pc']) + 4, row['length'] + 1)
        return self.elf(blob)

    def test_complete(self):
        summary = proof.check(P, R)
        self.assertEqual(
            (summary['normalized_windows'], summary['raw_windows'], summary['extended_windows'], summary['extended_pairs']),
            (437, 141, 431, 581),
        )
        self.assertEqual(
            (summary['literal_bytes'], summary['descriptor_bytes'], summary['new_payload_bytes'], summary['rejected_pairs']),
            (592, 112, 704, 0),
        )

    def test_every_string_byte(self):
        for row in self.strings:
            expected = row['text'].encode('latin-1').hex()
            self.assertEqual(row['original_bytes_hex'], expected)
            self.assertEqual(row['candidate_bytes_hex'], expected)
            for index in range(row['length']):
                with self.subTest(index=row['index'], byte=index):
                    with self.assertRaises(AssertionError):
                        proof.verify_images(self.original_elf, self.mutated_string(row, index))

    def test_every_descriptor_field(self):
        for row in self.descriptors:
            for field in ('length', 'pointer'):
                with self.subTest(offset=row['original_offset'], field=field):
                    with self.assertRaises(AssertionError):
                        proof.verify_images(self.original_elf, self.mutated_descriptor(row, field))

    def test_every_text_length_immediate(self):
        for row in self.text_sites:
            with self.subTest(pc=row['original_pc']):
                with self.assertRaises(AssertionError):
                    proof.verify_images(self.original_elf, self.mutated_text(row))

    def test_every_path_length_immediate(self):
        for row in self.path_sites:
            with self.subTest(pc=row['original_pc']):
                with self.assertRaises(AssertionError):
                    proof.verify_images(self.original_elf, self.mutated_path(row))

    def test_every_path_pointer_length_binding(self):
        for side, image in (('original', self.original_elf), ('candidate', self.candidate_elf)):
            for row in self.path_sites:
                pc = row['original_pc'] if side == 'original' else row['candidate_pc']
                pointer = row['original_ptr'] if side == 'original' else row['candidate_ptr']
                length_pc = row['original_length_pc'] if side == 'original' else row['length_pc']
                edits = ((pc + 1, 1), (pc + 17, 16), (pc + 18, 1), (length_pc + 1, 1), (length_pc + 2, 1))
                for at, bit in edits:
                    with self.subTest(side=side, pc=pc, at=at):
                        changed = copy.copy(image)
                        blob = bytearray(image.b)
                        blob[at] ^= bit
                        changed.b = bytes(blob)
                        with self.assertRaises(AssertionError):
                            proof.path_site(changed, pc, pointer, row['length'])

    def test_text_pointer_argument_register(self):
        for row in self.text_sites:
            blob = bytearray(self.candidate)
            blob[self.file_offset(row['candidate_pc']) + 1] ^= 1
            with self.assertRaises(AssertionError):
                proof.verify_images(self.original_elf, self.elf(blob))

    def test_descriptor_pointer_credit_is_mapped(self):
        report = proof.inspect(P, self.original, self.candidate, R)
        delta = proof.coverage_delta(R, report)
        section = next(row for row in delta['sections'] if row['section'] == '.data.rel.ro')
        raw = {i for a,b in section['raw_intervals'] for i in range(a,b)}
        mapped = {i for a,b in section['mapped_intervals'] for i in range(a,b)}
        for row in self.descriptors:
            start = row['original_offset']
            self.assertTrue(set(range(start, start + 8)) <= mapped)
            self.assertFalse(set(range(start, start + 8)) & raw)
            self.assertTrue(set(range(start + 8, start + 16)) <= raw)

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

if __name__ == '__main__':
    unittest.main(verbosity=2)
