"""Portable saved-source gates, using the real sealed AMM inputs (no VM)."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import tarfile
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


reader = module('portable_amm_tests', ROOT/'scripts/amm_checkpoint_modules.py')


class SourceTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix='amm-path-test-')
        self.addCleanup(self.temporary.cleanup)
        self.base = Path(self.temporary.name)
        self.source = self.base/'source'
        self.workspace = self.base/'workspace'
        self.packet = ROOT/reader.LAYOUT
        self.recipe = reader.load('test_recipe', self.packet/'workspace_recipe.py', ROOT)
        self.extract(self.packet, self.source)
        _, expected = self.recipe.expected_workspace(self.source)
        for name, data in expected.items():
            target = self.workspace/name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)

    def extract(self, packet, destination):
        with tarfile.open(packet/'results/build-a/canonical-source.tar.gz') as archive:
            for member in archive:
                self.assertTrue(member.isfile())
                self.assertFalse(Path(member.name).is_absolute())
                self.assertNotIn('..', Path(member.name).parts)
                target = destination/member.name
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(archive.extractfile(member).read())

    def test_both_archived_source_bindings_reproduce(self):
        for relative in (reader.CANONICAL, reader.LAYOUT):
            with self.subTest(packet=relative):
                packet = ROOT/relative
                source = self.base/Path(relative).name
                self.extract(packet, source)
                recipe = reader.load('bound_recipe', packet/'workspace_recipe.py', ROOT)
                inputs, workspace = recipe.expected_workspace(source)
                hashes = lambda files: {n: hashlib.sha256(b).hexdigest() for n, b in files.items()}
                binding = json.loads((packet/'results/build-a/source-binding.json').read_text())
                self.assertEqual(hashes(inputs), binding['input_sha256'])
                self.assertEqual(hashes(workspace), binding['workspace_sha256'])
                self.assertEqual((len(inputs), len(workspace)), (68, 69))
                self.assertTrue(all('\\' not in name for name in workspace))

    def test_workspace_round_trip(self):
        report = self.recipe.verify_workspace(self.source, self.workspace)
        self.assertTrue(report['verified'])
        self.assertEqual((report['standalone_inputs'], report['workspace_inputs']), (68, 69))

    def test_changed_source_is_rejected(self):
        path = self.source/'programs/pump-amm/src/instructions/swap/sell.rs'
        path.write_bytes(path.read_bytes()+b'\n')
        with self.assertRaisesRegex(RuntimeError, 'workspace input changed'):
            self.recipe.verify_workspace(self.source, self.workspace)

    def test_changed_workspace_is_rejected(self):
        path = self.workspace/'Cargo.lock'
        path.write_bytes(path.read_bytes()+b'\n')
        with self.assertRaisesRegex(RuntimeError, 'workspace input changed'):
            self.recipe.verify_workspace(self.source, self.workspace)

    def test_extra_workspace_input_is_rejected(self):
        (self.workspace/'unrecorded.txt').write_bytes(b'extra')
        with self.assertRaisesRegex(RuntimeError, 'workspace inventory'):
            self.recipe.verify_workspace(self.source, self.workspace)

    def test_missing_workspace_input_is_rejected(self):
        (self.workspace/'Cargo.lock').unlink()
        with self.assertRaisesRegex(RuntimeError, 'workspace inventory'):
            self.recipe.verify_workspace(self.source, self.workspace)

    def test_ambient_selector_is_rejected(self):
        path = self.source/'programs/pump-amm/.cargo/config.toml'
        path.parent.mkdir()
        path.write_text('[build]\n')
        with self.assertRaisesRegex(RuntimeError, 'Ambient Cargo/toolchain'):
            self.recipe.expected_workspace(self.source)

    def test_unreviewed_local_dependency_is_rejected(self):
        path = self.source/'programs/pump-amm/Cargo.toml'
        path.write_bytes(path.read_bytes().replace(b'../../crates/native-transfer-fee', b'../../other'))
        with self.assertRaisesRegex(RuntimeError, 'native-transfer-fee'):
            self.recipe.expected_workspace(self.source)

    @unittest.skipUnless(os.name == 'nt', 'original failure requires Windows paths')
    def test_original_recipe_reproduces_windows_failure(self):
        original = module('unmodified_recipe', self.packet/'workspace_recipe.py')
        with self.assertRaisesRegex(RuntimeError, 'Cargo.toml.*in result'):
            original.source_inputs(self.source)
        self.assertNotEqual(original.file_inventory(self.workspace), self.recipe.file_inventory(self.workspace))


class LoaderTests(unittest.TestCase):
    def test_nested_modules_use_portable_recipes_without_disk_changes(self):
        paths = [ROOT/name for name in reader.REVIEWED]
        before = {p: p.read_bytes() for p in paths}
        gate = reader.load('test_layout', ROOT/reader.LAYOUT/'verify.py', ROOT)
        parent = gate.module('test_parent', ROOT/reader.CANONICAL/'verify.py')
        for owner, relative in ((gate, reader.LAYOUT), (parent, reader.CANONICAL)):
            recipe = owner.module('test_nested_recipe', ROOT/relative/'workspace_recipe.py')
            self.assertEqual(recipe.__file__, str((ROOT/relative/'workspace_recipe.py').resolve()))
            # Native Windows separators cannot escape into manifest keys.
            inputs = recipe.source_inputs(ROOT)
            self.assertIn('programs/pump-amm/Cargo.toml', inputs)
        self.assertEqual(before, {p: p.read_bytes() for p in paths})

    def test_unknown_script_bytes_rejected_before_execution(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            marker = root/'executed'
            for relative in reader.REVIEWED:
                with self.subTest(module=relative):
                    path = root/relative
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.write_bytes((ROOT/relative).read_bytes()+
                                     ('\nfrom pathlib import Path\nPath('+repr(str(marker))+').touch()\n').encode())
                    with self.assertRaisesRegex(ValueError, 'Unreviewed AMM checkpoint module'):
                        reader.load('tampered', path, root)
                    self.assertFalse(marker.exists())

    def test_parent_inventory_rejects_extra_and_changed_files(self):
        parent = reader.load('test_membership', ROOT/reader.CANONICAL/'verify.py', ROOT)
        with tempfile.TemporaryDirectory() as directory:
            packet = Path(directory)
            path = packet/'nested/file.txt'
            path.parent.mkdir()
            path.write_bytes(b'original')
            (packet/'MANIFEST.json').write_text(json.dumps({'nested/file.txt': hashlib.sha256(b'original').hexdigest()}))
            parent.P = packet
            extra = packet/'extra.txt'
            extra.write_bytes(b'extra')
            with self.assertRaisesRegex(RuntimeError, 'packet membership differs'):
                parent.verify(ROOT)
            extra.unlink()
            path.write_bytes(b'changed')
            with self.assertRaisesRegex(RuntimeError, 'packet hash differs: nested/file.txt'):
                parent.verify(ROOT)

    def test_unadapted_support_module_loads_normally(self):
        path = ROOT/reader.CANONICAL/'tools/measure.py'
        value = reader.load('ordinary_support_module', path, ROOT)
        self.assertTrue(callable(value.measure))
        self.assertEqual(value.__file__, str(path.resolve()))

    def test_public_dispatch_loads_portable_gate(self):
        public = module('public_amm_gate', ROOT/'scripts/verify_pump_amm_checkpoint.py')
        gate = public.checkpoint_module('public_test', ROOT/reader.LAYOUT/'verify.py', ROOT)
        recipe = gate.module('public_recipe', ROOT/reader.LAYOUT/'workspace_recipe.py')
        self.assertEqual(len(recipe.source_inputs(ROOT)), 68)


if __name__ == '__main__':
    unittest.main()
