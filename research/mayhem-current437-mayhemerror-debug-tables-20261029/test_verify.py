"""Mutation controls for the twenty MayhemError Debug table entries."""
from pathlib import Path
import copy, gzip, json, os, shutil, struct, tempfile, unittest
import proof
P = Path(__file__).resolve().parent
R = next(parent for parent in P.parents if (parent / 'evidence/original/mayhem/deployed.so').is_file())
CANDIDATE_OWNER = 173568

class MayhemErrorDebugTables(unittest.TestCase):
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
        cls.original_elf = bundle['original_elf']
        cls.windows = bundle['candidate_windows']
        cls.symbols = bundle['symbols']
        cls.report = proof.inspect(P, original, candidate, R)
        cls.rows = [row for row in cls.report['observations'] if row['candidate_owner'] == CANDIDATE_OWNER]
        cls.rows.sort(key=lambda row: row['observed_tag'])
        cls.owner = CANDIDATE_OWNER
        cls.window = cls.windows[cls.owner]
        cls.variants = proof.source_context(P, R)['variants']

    def elf(self, blob):
        image = copy.copy(self.candidate_elf)
        image.b = bytes(blob)
        return image

    def file_offset(self, address):
        return proof.file_offset(self.candidate_elf, address)

    def mutate(self, row, kind, index=0):
        blob = bytearray(self.candidate)
        tag = row['observed_tag']
        entry = row['candidate']
        if kind == 'byte':
            blob[self.file_offset(entry['pointer']) + index] ^= 1
        elif kind == 'following':
            blob[self.file_offset(entry['pointer'] + entry['length'])] ^= 1
        elif kind == 'length':
            at = self.file_offset(entry['length_slot'])
            struct.pack_into('<Q', blob, at, entry['length'] + 1)
        elif kind == 'pointer':
            at = self.file_offset(entry['pointer_slot'])
            struct.pack_into('<Q', blob, at, (entry['pointer'] + 1) << 32)
        elif kind == 'low':
            at = self.file_offset(entry['pointer_slot'])
            struct.pack_into('<I', blob, at, 1)
        elif kind == 'after_table':
            blob[self.file_offset(self.rows[-1]['candidate']['length_slot'] + 8)] ^= 1
        else:
            raise AssertionError(kind)
        return blob

    def traces(self):
        return [
            proof.trace(self.elf(self.candidate), self.window, row['observed_tag'])
            for row in self.rows
        ]

    def test_complete(self):
        summary = proof.check(P, R)
        self.assertEqual(
            (
                summary['normalized_windows'], summary['extended_pairs'],
                summary['owner_pairs'], summary['selected_tags'],
                summary['length_table_bytes'], summary['pointer_table_raw_bytes'],
                summary['pointer_table_mapped_bytes'], summary['new_payload_bytes'],
                summary['prior_name_bytes'], summary['new_name_bytes'],
            ),
            (437, 581, 1, 20, 160, 80, 80, 320, 335, 0),
        )

    def test_every_length_and_pointer_entry(self):
        for row, traced in zip(self.rows, self.traces()):
            name = row['name'].encode().hex()
            self.assertEqual(traced['bytes_hex'], name)
            for kind in ('length', 'pointer'):
                with self.subTest(tag=row['observed_tag'], kind=kind):
                    changed = proof.trace(
                        self.elf(self.mutate(row, kind)), self.window, row['observed_tag']
                    )
                    self.assertNotEqual(
                        (changed['length'], changed['pointer'], changed['bytes_hex']),
                        (traced['length'], traced['pointer'], traced['bytes_hex']),
                    )
                    self.assertNotEqual(changed['bytes_hex'], name)

    def test_every_low_zero_word(self):
        for row in self.rows:
            with self.subTest(tag=row['observed_tag']):
                with self.assertRaises(AssertionError):
                    proof.trace(
                        self.elf(self.mutate(row, 'low')), self.window, row['observed_tag']
                    )

    def test_every_name_byte_changes_entry(self):
        for row in self.rows:
            for index in range(row['candidate']['length']):
                with self.subTest(tag=row['observed_tag'], index=index):
                    changed = proof.trace(
                        self.elf(self.mutate(row, 'byte', index)), self.window, row['observed_tag']
                    )
                    self.assertNotEqual(changed['bytes_hex'], row['name'].encode().hex())

    def test_following_byte_is_not_counted(self):
        for row in self.rows:
            with self.subTest(tag=row['observed_tag']):
                changed = proof.trace(
                    self.elf(self.mutate(row, 'following')), self.window, row['observed_tag']
                )
                self.assertEqual(changed['length'], row['candidate']['length'])
                self.assertEqual(changed['bytes_hex'], row['name'].encode().hex())

    def test_table_end_is_not_counted(self):
        for end in (
            self.rows[-1]['candidate']['length_slot'] + 8,
            self.rows[-1]['candidate']['pointer_slot'] + 8,
        ):
            blob = bytearray(self.candidate)
            blob[self.file_offset(end)] ^= 1
            for row, tagged in zip(self.rows, self.traces()):
                with self.subTest(table_end=end, tag=row['observed_tag']):
                    mutated = proof.trace(
                        self.elf(blob), self.window, row['observed_tag']
                    )
                    self.assertEqual(mutated['bytes_hex'], tagged['bytes_hex'])
                    self.assertEqual(mutated['length'], tagged['length'])

    def test_length_entry_drops_owner_pair(self):
        row = self.rows[0]
        report = proof.inspect(P, self.original, bytes(self.mutate(row, 'length')), R)
        self.assertEqual(report['summary']['normalized_windows'], 437)
        self.assertNotIn([proof.OWNER, self.owner], report['active_pairs'])
        self.assertGreater(report['summary']['rejected_pairs'], 0)
        self.assertFalse(report['observations'][0]['owner_closed'])
        self.assertFalse(report['observations'][0]['bytes_and_count_equal'])

    def test_pointer_entry_drops_owner_pair(self):
        row = self.rows[0]
        report = proof.inspect(P, self.original, bytes(self.mutate(row, 'pointer')), R)
        self.assertEqual(report['summary']['normalized_windows'], 437)
        self.assertNotIn([proof.OWNER, self.owner], report['active_pairs'])
        self.assertGreater(report['summary']['rejected_pairs'], 0)
        self.assertFalse(report['observations'][0]['owner_closed'])

    def test_pointer_slot_relocation_is_required(self):
        row = self.rows[0]
        slot = row['candidate']['pointer_slot']
        relocation = self.candidate_elf.rel[slot]
        for change in (
            lambda rel: None,
            lambda rel: dict(rel, type=10),
            lambda rel: dict(rel, symbol_index=1),
        ):
            with self.subTest(change=change):
                image = copy.copy(self.candidate_elf)
                image.rel = dict(self.candidate_elf.rel)
                changed = change(relocation)
                if changed is None:
                    del image.rel[slot]
                else:
                    image.rel[slot] = changed
                with self.assertRaises(AssertionError):
                    proof.trace(image, self.window, row['observed_tag'])

    def test_length_slot_has_no_relocation(self):
        row = self.rows[0]
        image = copy.copy(self.candidate_elf)
        image.rel = dict(self.candidate_elf.rel)
        image.rel[row['candidate']['length_slot']] = dict(
            self.candidate_elf.rel[row['candidate']['pointer_slot']]
        )
        with self.assertRaises(AssertionError):
            proof.trace(image, self.window, row['observed_tag'])

    def test_tags_outside_range_are_rejected(self):
        for tag in (-1, 20):
            with self.subTest(tag=tag):
                with self.assertRaises(AssertionError):
                    proof.trace(self.candidate_elf, self.window, tag)

    def test_names_are_not_recredited(self):
        delta = json.loads((P / 'coverage-delta.json').read_bytes())
        baseline = json.loads((P / proof.BASELINE).read_bytes())
        by_delta = {section['section']: section for section in delta['sections']}
        by_base = {section['section']: section for section in baseline['sections']}
        self.assertEqual(by_delta['.rodata']['new_bytes'], 160)
        self.assertEqual(by_delta['.data.rel.ro']['new_bytes'], 160)
        self.assertEqual(
            (by_delta['.rodata']['raw_equal_bytes'] - by_base['.rodata']['raw_equal_bytes']),
            160,
        )
        self.assertEqual(
            (by_delta['.data.rel.ro']['raw_equal_bytes'] - by_base['.data.rel.ro']['raw_equal_bytes']),
            80,
        )
        self.assertEqual(
            (by_delta['.data.rel.ro']['pointer_only_bytes'] - by_base['.data.rel.ro']['pointer_only_bytes']),
            80,
        )
        added = {}
        for name, section in by_delta.items():
            base = by_base[name]['covered_intervals']
            current = section['covered_intervals']
            pieces = []
            for start, end in current:
                cursor = start
                for bstart, bend in base:
                    if bend <= cursor:
                        continue
                    if bstart >= end:
                        break
                    if bstart > cursor:
                        pieces.append([cursor, min(bstart, end)])
                    cursor = max(cursor, bend)
                    if cursor >= end:
                        break
                if cursor < end:
                    pieces.append([cursor, end])
            added[name] = pieces
        self.assertEqual(added['.rodata'], [[713112, 713272]])
        self.assertEqual(added['.data.rel.ro'], [[727696, 727856]])
        for row in self.rows:
            start = row['original']['pointer']
            end = start + row['original']['length']
            self.assertFalse(713112 <= start < 713272 or 713112 < end <= 713272)
            self.assertFalse(727696 <= start < 727856 or 727696 < end <= 727856)

    def test_baseline_union_is_recomputed(self):
        baseline = proof.baseline_union(P, R)
        self.assertEqual(len(baseline['deltas']), 23)
        self.assertEqual(baseline['payload_covered_bytes'], 23514)
        self.assertEqual(
            sum(section['covered_bytes'] for section in baseline['sections']), 23514
        )

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
                    if path.is_file() and path != packet / 'manifest.json'
                    and '__pycache__' not in path.parts
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
            (packet / 'observations.json.gz').write_bytes(
                gzip.compress(json.dumps(report).encode(), mtime=0)
            )
        self.copied(change, True)

    def test_resealed_coverage(self):
        def change(packet):
            delta = json.loads((packet / 'coverage-delta.json').read_bytes())
            delta['new_payload_bytes'] += 1
            (packet / 'coverage-delta.json').write_text(json.dumps(delta))
        self.copied(change, True)

    def test_resealed_baseline_source_membership(self):
        # This real historical member is redundant in the23-file union. Omitting
        # it preserves every count, so only exact input membership rejects it.
        omitted = 'research/mayhem-current437-bounded-encoding-20261029/coverage-delta.json'
        def change(packet):
            path = packet / proof.BASELINE
            baseline = json.loads(path.read_bytes())
            del baseline['deltas'][omitted]
            path.write_text(json.dumps(baseline))
            path = packet / 'coverage-delta.json'
            delta = json.loads(path.read_bytes())
            del delta['baseline_delta_sha256'][omitted]
            path.write_text(json.dumps(delta))
        self.copied(change, True)

    def test_resealed_baseline(self):
        def change(packet):
            baseline = json.loads((packet / proof.BASELINE).read_bytes())
            baseline['sections'][0]['covered_bytes'] += 1
            (packet / proof.BASELINE).write_text(json.dumps(baseline))
        self.copied(change, True)

    def test_resealed_excerpt(self):
        def change(packet):
            path = packet / 'source-context/mayhem-error.rs'
            blob = bytearray(path.read_bytes())
            blob[-2] ^= 1
            path.write_bytes(blob)
        self.copied(change, True)

    def test_resealed_provenance(self):
        def change(packet):
            path = packet / 'source-context/provenance.json'
            provenance = json.loads(path.read_bytes())
            provenance['variants'][0]['name'] = 'Changed'
            path.write_text(json.dumps(provenance))
        self.copied(change, True)

if __name__ == '__main__':
    unittest.main(verbosity=2)
