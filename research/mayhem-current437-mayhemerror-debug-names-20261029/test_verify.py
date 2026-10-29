"""Mutation controls for the twenty MayhemError Debug unit-variant names."""
from pathlib import Path
import copy, gzip, json, os, shutil, struct, tempfile, unittest
import proof
P = Path(__file__).resolve().parent
R = next(parent for parent in P.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())
CANDIDATE_OWNER = 173568

class MayhemErrorDebugNames(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        original = (R / 'evidence/original/mayhem/deployed.so').read_bytes()
        candidate = proof.format_proof(R).readers(R)[2].inputs(
            R, 'mayhem-current437-composition-20261028'
        )
        bundle = proof.images(R, original, candidate)
        cls.original = original
        cls.candidate = candidate
        cls.candidate_elf = bundle['candidate_elf']
        cls.windows = bundle['candidate_windows']
        cls.symbols = bundle['symbols']
        cls.report = proof.inspect(P, original, candidate, R)
        cls.rows = [row for row in cls.report['observations'] if row['candidate_owner'] == CANDIDATE_OWNER]
        cls.owner = CANDIDATE_OWNER
        cls.window = cls.windows[cls.owner]
        cls.variants = proof.source_context(P, R)['variants']

    def elf(self, blob):
        image = copy.copy(self.candidate_elf)
        image.b = bytes(blob)
        return image

    def file_offset(self, address):
        return proof.file_offset(self.candidate_elf, address)

    def mutate(self, traced, tag, kind, index=0):
        blob = bytearray(self.candidate)
        if kind == 'byte':
            blob[self.file_offset(traced['pointer']) + index] ^= 1
        elif kind == 'length':
            at = self.file_offset(traced['length_table_base'] + tag * 8)
            struct.pack_into('<Q', blob, at, traced['length'] + 1)
        elif kind == 'pointer':
            at = self.file_offset(traced['pointer_table_base'] + tag * 8)
            struct.pack_into('<Q', blob, at, (traced['pointer'] + 1) << 32)
        else:
            raise AssertionError(kind)
        return blob

    def traces(self):
        return [
            proof.trace(self.candidate_elf, self.window, variant['observed_tag'])
            for variant in self.variants
        ]

    def test_complete(self):
        summary = proof.check(P, R)
        self.assertEqual(summary['literal_bytes'], 335)
        self.assertEqual(
            (summary['normalized_windows'], summary['extended_pairs'], summary['rejected_pairs'], summary['owner_pairs']),
            (437, 581, 0, 1),
        )

    def test_every_name_byte(self):
        for variant, traced in zip(self.variants, self.traces()):
            name = variant['name'].encode().hex()
            self.assertEqual(traced['bytes_hex'], name)
            for index in range(traced['length']):
                with self.subTest(tag=variant['observed_tag'], kind='byte', index=index):
                    changed = proof.trace(
                        self.elf(self.mutate(traced, variant['observed_tag'], 'byte', index)),
                        self.window,
                        variant['observed_tag'],
                    )
                    self.assertNotEqual(changed['bytes_hex'], name)

    def test_every_length_and_pointer_table_entry(self):
        for variant, traced in zip(self.variants, self.traces()):
            name = variant['name'].encode().hex()
            for kind in ('length', 'pointer'):
                with self.subTest(tag=variant['observed_tag'], kind=kind):
                    changed = proof.trace(
                        self.elf(self.mutate(traced, variant['observed_tag'], kind)),
                        self.window,
                        variant['observed_tag'],
                    )
                    self.assertNotEqual(changed['bytes_hex'], name)

    def test_byte_and_pointer_remove_owner_and_dependents(self):
        traced = self.traces()[0]
        for kind in ('byte', 'pointer'):
            with self.subTest(kind=kind):
                report = proof.inspect(
                    P, self.original, bytes(self.mutate(traced, self.variants[0]['observed_tag'], kind)), R
                )
                self.assertEqual((report['summary']['normalized_windows'], report['summary']['base_pairs']), (437, 581))
                self.assertNotIn([proof.OWNER, self.owner], report['active_pairs'])
                self.assertGreater(report['summary']['rejected_pairs'], 0)
                self.assertFalse(all(
                    row['bytes_and_count_equal']
                    for row in report['observations']
                    if row['candidate_owner'] == self.owner
                ))

    def test_length_table_entry_drops_owner_pair(self):
        traced = self.traces()[0]
        report = proof.inspect(
            P, self.original, bytes(self.mutate(traced, self.variants[0]['observed_tag'], 'length')), R
        )
        self.assertEqual(report['summary']['normalized_windows'], 437)
        self.assertNotIn([proof.OWNER, self.owner], report['active_pairs'])
        self.assertGreater(report['summary']['rejected_pairs'], 0)

    def test_tags_outside_range_are_rejected(self):
        for tag in (-1, 20):
            with self.subTest(tag=tag):
                with self.assertRaises(AssertionError):
                    proof.trace(self.candidate_elf, self.window, tag)

    def test_writer_slot_and_callback_register(self):
        target = self.rows[0]['candidate']['call_target']
        window = self.windows[target]
        for offset, width, value in ((18, 'h', 16), (36, 'i', 4)):
            with self.subTest(offset=offset):
                blob = bytearray(self.candidate)
                struct.pack_into('<' + width, blob, target + offset, value)
                with self.assertRaises(AssertionError):
                    proof.writer(self.elf(blob), window)

    def test_following_byte_is_not_counted(self):
        traced = max(self.traces(), key=lambda item: item['pointer'] + item['length'])
        blob = bytearray(self.candidate)
        blob[self.file_offset(traced['pointer'] + traced['length'])] ^= 1
        tag = next(
            variant['observed_tag']
            for variant, item in zip(self.variants, self.traces())
            if item['pointer'] == traced['pointer']
        )
        self.assertEqual(proof.trace(self.elf(blob), self.window, tag), traced)

    def test_table_bytes_are_not_credited(self):
        delta = json.loads((P / 'coverage-delta.json').read_bytes())
        by_section = {section['section']: section for section in delta['sections']}
        self.assertEqual(by_section['.data.rel.ro']['new_bytes'], 0)
        counted = [
            (row['original']['pointer'], row['original']['pointer'] + row['original']['length'])
            for row in self.rows
        ]
        for start, end in counted:
            self.assertFalse(start < 713272 and end > 713112, 'length table credited')
            self.assertFalse(start < 727856 and end > 727696, 'pointer table credited')

    def copied(self, change, reseal=False):
        with tempfile.TemporaryDirectory() as temporary:
            packet = Path(temporary) / 'packet'
            shutil.copytree(P, packet, ignore=shutil.ignore_patterns('SPEC.md', '__pycache__'))
            spec = packet / 'SPEC.md'
            if spec.exists():
                spec.unlink()
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
            report['observations'][0]['candidate']['length'] += 1
            (packet / 'observations.json.gz').write_bytes(gzip.compress(json.dumps(report).encode(), mtime=0))
        self.copied(change, True)

    def test_resealed_coverage(self):
        def change(packet):
            delta = json.loads((packet / 'coverage-delta.json').read_bytes())
            delta['new_payload_bytes'] += 1
            (packet / 'coverage-delta.json').write_text(json.dumps(delta))
        self.copied(change, True)

    def test_resealed_excerpt(self):
        def change(packet):
            path = packet / 'source-context/mayhem-error.rs'
            blob = bytearray(path.read_bytes())
            blob[-2] ^= 1
            path.write_bytes(blob)
        self.copied(change, True)

if __name__ == '__main__':
    unittest.main(verbosity=2)
