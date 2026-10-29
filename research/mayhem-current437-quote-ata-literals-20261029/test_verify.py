"""Mutation controls for the three quote-ATA literals and their call sites."""
from pathlib import Path
import copy
import gzip
import json
import os
import shutil
import struct
import tempfile
import unittest
import proof

P = Path(__file__).resolve().parent
R = proof.REPO


class QuoteAtaLiterals(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original = proof.Elf(R / proof.ORIGINAL)
        cls.candidate = proof.elf_from_gzip(R / proof.CANDIDATE)
        cls.report = proof.verify_images(cls.original, cls.candidate)

    def image(self, image, blob):
        changed = copy.copy(image)
        changed.b = bytes(blob)
        return changed

    def offset(self, image, address, name):
        section = image.secs[name]
        assert section[3] <= address < section[3] + section[5]
        return section[4] + address - section[3]

    def mutate_bytes(self, image, address, name, change):
        blob = bytearray(image.b)
        start = self.offset(image, address, name)
        change(blob, start)
        return self.image(image, blob)

    def test_complete(self):
        summary = proof.check(P, R)
        self.assertEqual(
            (summary['literals'], summary['literal_bytes'], summary['call_sites'],
             summary['call_sites_candidate'], summary['new_payload_bytes']),
            (3, 50, 13, 13, 50),
        )

    def test_every_literal_byte(self):
        for row in proof.LITERALS:
            for index in range(len(row['text'])):
                with self.subTest(literal=row['name'], byte=index):
                    at = row['candidate'] + index
                    changed = self.mutate_bytes(
                        self.candidate, at, '.rodata',
                        lambda blob, start: blob.__setitem__(start, blob[start] ^ 1),
                    )
                    with self.assertRaises(AssertionError):
                        proof.verify_images(self.original, changed)

    def test_every_site_pointer_low(self):
        for row in self.report['literals']:
            for site in row['original']['sites']:
                with self.subTest(literal=row['name'], site=site):
                    changed = self.mutate_bytes(
                        self.original, site, '.text',
                        lambda blob, start: blob.__setitem__(start + 4, blob[start + 4] ^ 1),
                    )
                    with self.assertRaises(AssertionError):
                        proof.verify_images(changed, self.candidate)

    def test_every_site_pointer_high(self):
        for row in self.report['literals']:
            for site in row['original']['sites']:
                with self.subTest(literal=row['name'], site=site):
                    changed = self.mutate_bytes(
                        self.original, site, '.text',
                        lambda blob, start: blob.__setitem__(start + 12, blob[start + 12] ^ 1),
                    )
                    with self.assertRaises(AssertionError):
                        proof.verify_images(changed, self.candidate)

    def test_every_site_length(self):
        for row in self.report['literals']:
            for site in row['original']['sites']:
                with self.subTest(literal=row['name'], site=site):
                    changed = self.mutate_bytes(
                        self.original, site, '.text',
                        lambda blob, start: blob.__setitem__(start + 20, blob[start + 20] + 1),
                    )
                    with self.assertRaises(AssertionError):
                        proof.verify_images(changed, self.candidate)

    def test_every_site_is_a_call(self):
        for row in self.report['literals']:
            for site in row['original']['sites']:
                with self.subTest(literal=row['name'], site=site):
                    changed = self.mutate_bytes(
                        self.original, site, '.text',
                        lambda blob, start: blob.__setitem__(start + 24, 0x95),
                    )
                    with self.assertRaises(AssertionError):
                        proof.verify_images(changed, self.candidate)

    def test_candidate_site_length(self):
        row = self.report['literals'][0]
        site = sorted(row['candidate']['sites'])[0]
        changed = self.mutate_bytes(
            self.candidate, site, '.text',
            lambda blob, start: blob.__setitem__(start + 20, blob[start + 20] - 1),
        )
        with self.assertRaises(AssertionError):
            proof.verify_images(self.original, changed)

    def test_adjacent_literal_is_not_a_bound(self):
        spec = next(row for row in proof.LITERALS if row['name'] == 'sol_vault_quote_ata')
        neighbour = next(row for row in proof.LITERALS if row['name'] == 'admin_quote_ata')
        self.assertEqual(spec['candidate'] + len(spec['text']), neighbour['candidate'])
        before = proof.sites(self.candidate, spec['candidate'], len(spec['text']))
        changed = self.mutate_bytes(
            self.candidate, neighbour['candidate'], '.rodata',
            lambda blob, start: blob.__setitem__(start, blob[start] ^ 1),
        )
        after = proof.sites(changed, spec['candidate'], len(spec['text']))
        self.assertEqual(before, after)

    def test_following_byte_is_not_absorbed(self):
        spec = next(row for row in proof.LITERALS if row['name'] == 'trader_quote_ata')
        at = spec['candidate'] + len(spec['text'])
        changed = self.mutate_bytes(
            self.candidate, at, '.rodata',
            lambda blob, start: blob.__setitem__(start, blob[start] ^ 1),
        )
        self.assertEqual(
            proof.verify_images(self.original, changed),
            self.report,
        )

    def copied(self, change, reseal=False):
        with tempfile.TemporaryDirectory() as temporary:
            packet = Path(temporary) / 'packet'
            shutil.copytree(P, packet, ignore=shutil.ignore_patterns('__pycache__', '*.pyc'))
            change(packet)
            if reseal:
                inventory = {
                    str(path.relative_to(packet)): proof.sha(path.read_bytes())
                    for path in packet.rglob('*')
                    if path.is_file()
                    and path.name != 'manifest.json'
                    and '__pycache__' not in path.parts
                    and path.suffix != '.pyc'
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

    def test_resealed_observations(self):
        def change(packet):
            report = json.loads(gzip.decompress((packet / 'observations.json.gz').read_bytes()))
            report['literals'][0]['original']['sites'].append(1)
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

    def test_baseline_tamper(self):
        def change(packet):
            baseline = json.loads((packet / 'baseline/sources.json').read_bytes())
            path = next(iter(baseline['deltas']))
            baseline['deltas'][path] = '0' * 64
            (packet / 'baseline/sources.json').write_text(json.dumps(baseline))
        self.copied(change, True)

    def test_inputs_tamper(self):
        def change(packet):
            pins = json.loads((packet / 'inputs.json').read_bytes())
            path = next(iter(pins))
            pins[path] = '0' * 64
            (packet / 'inputs.json').write_text(json.dumps(pins))
        self.copied(change, True)


if __name__ == '__main__':
    unittest.main(verbosity=2)
