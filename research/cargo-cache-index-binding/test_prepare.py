"""The archived cache helper must not be extended; this checks the successor."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parent))
import prepare

ROOT = Path(__file__).resolve().parents[2]
ARCHIVED = ROOT / 'scripts/prepare_locked_cargo_home.py'
ARCHIVED_SHA256 = {
    '1130ba3e380cd6b12d9fb89022fc0da615e6a91edac4b8978508852aa0131904',
    '00998f8ca992ef98e41fd2e10c666afb9c5d43b54d37b3fe2e5e1975ce4ea649',
}
GOOD = 'index.crates.io-6f17d22bba15001f'
OLD = 'index.crates.io-1949cf8c6b5b557f'
ARCHIVE = b'checksum-matched archive'
MATCHING_INDEX = b'INDEX-FROM-MATCHING-NAMESPACE'
OTHER_INDEX = b'INDEX-FROM-OTHER-NAMESPACE'


def lock_text(digest):
    return ('[[package]]\nname="cache-probe"\nversion="1.0.0"\n'
            'source="registry+https://github.com/rust-lang/crates.io-index"\n'
            f'checksum="{digest}"\n')


def write_namespace(home, namespace, archive, index, config=b'{}'):
    crate = home / 'registry/cache' / namespace / 'cache-probe-1.0.0.crate'
    crate.parent.mkdir(parents=True, exist_ok=True)
    if archive is not None:
        crate.write_bytes(archive)
    meta = home / 'registry/index' / namespace / '.cache/ca/ch/cache-probe'
    meta.parent.mkdir(parents=True, exist_ok=True)
    if index is not None:
        meta.write_bytes(index)
    (home / 'registry/index' / namespace / 'config.json').write_bytes(config)


def run_archived(home, lock, output):
    return subprocess.run([sys.executable, str(ARCHIVED), '--lockfile', str(lock), '--output', str(output)],
                          env={**os.environ, 'CARGO_HOME': str(home)}, capture_output=True, text=True)


def read_pair(output, namespace):
    archive = (output / 'registry/cache' / namespace / 'cache-probe-1.0.0.crate').read_bytes()
    index = (output / 'registry/index' / namespace / '.cache/ca/ch/cache-probe').read_bytes()
    return archive, index


class CargoIndexBindingTests(unittest.TestCase):
    def test_archived_helper_is_the_reviewed_text(self):
        digest = hashlib.sha256(ARCHIVED.read_bytes()).hexdigest()
        self.assertIn(digest, ARCHIVED_SHA256)
        text = ARCHIVED.read_bytes().replace(b'\r\n', b'\n').decode()
        self.assertEqual(text.count("shutil.copyfile(indexes[0], index_target)"), 1)

    def test_archived_helper_borrows_the_other_namespace_index(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            home = root / 'cargo-home'
            digest = hashlib.sha256(ARCHIVE).hexdigest()
            write_namespace(home, GOOD, ARCHIVE, MATCHING_INDEX)
            write_namespace(home, OLD, b'different bytes', OTHER_INDEX)
            output = root / 'output'
            result = run_archived(home, self.write_lock(root, digest), output)
            self.assertEqual(result.returncode, 0, result.stderr)
            for namespace in (GOOD, OLD):
                archive, index = read_pair(output, namespace)
                self.assertEqual(archive, ARCHIVE)
                self.assertEqual(index, OTHER_INDEX)

    def test_successor_keeps_the_index_beside_the_matching_archive(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            home = root / 'cargo-home'
            digest = hashlib.sha256(ARCHIVE).hexdigest()
            write_namespace(home, GOOD, ARCHIVE, MATCHING_INDEX, b'{"from":"matching"}')
            write_namespace(home, OLD, b'different bytes', OTHER_INDEX, b'{"from":"other"}')
            output = root / 'output'
            manifest = prepare.prepare(self.write_lock(root, digest), output, home)
            self.assertEqual(manifest['packages'][0]['source_namespace'], GOOD)
            self.assertEqual(manifest['packages'][0]['index_sha256'], hashlib.sha256(MATCHING_INDEX).hexdigest())
            for namespace in (GOOD, OLD):
                archive, index = read_pair(output, namespace)
                self.assertEqual(archive, ARCHIVE)
                self.assertEqual(index, MATCHING_INDEX)

    def test_successor_still_prefers_1949_when_that_archive_matches(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            home = root / 'cargo-home'
            digest = hashlib.sha256(ARCHIVE).hexdigest()
            write_namespace(home, GOOD, ARCHIVE, b'index-6f17')
            write_namespace(home, OLD, ARCHIVE, b'index-1949')
            manifest = prepare.prepare(self.write_lock(root, digest), root / 'output', home)
            self.assertEqual(manifest['packages'][0]['source_namespace'], OLD)
            self.assertEqual(read_pair(root / 'output', GOOD)[1], b'index-1949')

    def test_successor_rejects_a_verified_archive_without_its_own_index(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            home = root / 'cargo-home'
            digest = hashlib.sha256(ARCHIVE).hexdigest()
            write_namespace(home, GOOD, ARCHIVE, None)
            write_namespace(home, OLD, b'different bytes', OTHER_INDEX)
            with self.assertRaisesRegex(RuntimeError, 'no colocated sparse index'):
                prepare.prepare(self.write_lock(root, digest), root / 'output', home)

    def test_path_only_lockfile_needs_no_registry_cache(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            lock = root / 'Cargo.lock'
            lock.write_text('version = 3\n[[package]]\nname = "local-only"\nversion = "1.0.0"\n', encoding='utf-8')
            manifest = prepare.prepare(lock, root / 'output', root / 'absent')
            self.assertEqual(manifest['packages'], [])
            self.assertIsNone(manifest['registry_config_sha256'])
            self.assertFalse((root / 'output/registry').exists())

    def write_lock(self, root, digest):
        lock = root / 'Cargo.lock'
        lock.write_text(lock_text(digest), encoding='utf-8')
        return lock


if __name__ == '__main__':
    unittest.main()
