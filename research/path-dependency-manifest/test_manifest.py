"""Archived source manifests miss in-repository path dependencies."""
import hashlib
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / 'scripts'))
import manifest
from build_source_manifest import source_manifest as archived

ROOT = manifest.ROOT
DEP = 'crates/native-transfer-fee/src/lib.rs'


class PathDependencyManifestTests(unittest.TestCase):
    def test_archived_helper_is_bound(self):
        digest = manifest.require_archived_helper()
        self.assertEqual(digest, '05eb3446b95c0b7b80517fe05a98a9841fa53053fe39ca56fe2659daf6b58df0')

    def test_pump_amm_path_crate_is_invisible_to_the_archived_manifest(self):
        crate = ROOT / 'programs/pump-amm'
        before = archived(crate, crate, ROOT, cwd=ROOT)
        self.assertNotIn(DEP, before)
        self.assertIn(DEP, manifest.source_manifest(crate, crate, ROOT, cwd=ROOT))
        digest = hashlib.sha256((ROOT / DEP).read_bytes()).hexdigest()
        self.assertEqual(manifest.source_manifest(crate, crate, ROOT)[DEP], digest)

    def test_editing_the_path_crate_does_not_change_the_archived_manifest(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            shutil.copytree(ROOT / 'programs/pump-amm', root / 'programs/pump-amm')
            shutil.copytree(ROOT / 'crates/native-transfer-fee', root / 'crates/native-transfer-fee')
            crate = root / 'programs/pump-amm'
            first = archived(crate, crate, root, cwd=root)
            successor = manifest.source_manifest(crate, crate, root, cwd=root)
            self.assertNotIn(DEP, first)
            self.assertIn(DEP, successor)
            target = root / DEP
            target.write_bytes(target.read_bytes() + b'\n')
            self.assertEqual(archived(crate, crate, root, cwd=root), first)
            self.assertNotEqual(manifest.source_manifest(crate, crate, root, cwd=root)[DEP], successor[DEP])

    def test_in_tree_path_dependency_does_not_add_keys(self):
        crate = ROOT / 'programs/pump'
        self.assertEqual(
            set(manifest.source_manifest(crate, crate, ROOT)),
            set(archived(crate, crate, ROOT)),
        )

    def test_missing_path_dependency_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            crate = root / 'programs/demo'
            crate.mkdir(parents=True)
            (crate / 'src').mkdir()
            (crate / 'src/lib.rs').write_text('pub fn demo() {}\n', encoding='utf-8')
            (crate / 'Cargo.toml').write_text(
                '[package]\nname="demo"\nversion="0.1.0"\n'
                '[dependencies]\nmissing={path="../missing"}\n',
                encoding='utf-8',
            )
            with self.assertRaisesRegex(ValueError, 'does not exist'):
                manifest.source_manifest(crate, crate, root)


if __name__ == '__main__':
    unittest.main()
