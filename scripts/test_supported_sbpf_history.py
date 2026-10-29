"""Fail-closed controls for the historical SBPF tooling view."""
from pathlib import Path
import tempfile
import shutil
import unittest

import verify_supported_sbpf_history as bridge


class HistoricalViewTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'input'
        self.root.mkdir()
        bridge.stage_historical_view(bridge.ROOT, self.root)

    def rejected(self):
        output = Path(self.temp.name) / 'output'
        output.mkdir()
        with self.assertRaises(AssertionError):
            bridge.stage_historical_view(self.root, output)

    def test_changed_old_verifier_is_rejected(self):
        (self.root / bridge.HISTORY / 'verify.py').write_text('pass\n')
        self.rejected()

    def test_changed_historical_source_is_rejected(self):
        (self.root / bridge.HISTORY / 'source/programs/mayhem/src/lib.rs').write_text('changed\n')
        self.rejected()

    def test_changed_installed_helper_is_rejected(self):
        (self.root / 'scripts/build_source_manifest.py').write_text('changed\n')
        self.rejected()

    def test_unlisted_packet_file_is_rejected(self):
        (self.root / bridge.HISTORY / 'unlisted.txt').write_text('extra\n')
        self.rejected()

    def test_unsafe_relative_paths_are_rejected(self):
        for name in ['/tmp/absolute', '../escape', 'inside/../../escape']:
            with self.subTest(name=name), self.assertRaises(AssertionError):
                bridge.relative(name)


class InstalledTransitionTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / 'input'
        self.root.mkdir()
        bridge.stage_historical_view(bridge.ROOT, self.root)
        target = self.root / bridge.TRANSITION
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(bridge.ROOT / bridge.TRANSITION, target)
        for name in ('build_supported_sbpf_candidate.py', 'build_source_manifest.py', 'test_supported_sbpf_policy.py', 'test_supported_sbpf_entry_paths.py'):
            shutil.copyfile(bridge.ROOT / 'scripts' / name, self.root / 'scripts' / name)
        bridge.transition(self.root)

    def test_changed_current_adapter_rejected(self):
        (self.root / 'scripts/build_supported_sbpf_candidate.py').write_text('changed\n')
        with self.assertRaises(AssertionError):
            bridge.transition(self.root)

    def test_changed_current_inventory_rejected(self):
        (self.root / 'scripts/build_source_manifest.py').write_text('changed\n')
        with self.assertRaises(AssertionError):
            bridge.transition(self.root)

    def test_changed_transition_diff_rejected(self):
        (self.root / bridge.TRANSITION / 'build_source_manifest.py.patch').write_text('changed\n')
        with self.assertRaises(AssertionError):
            bridge.transition(self.root)


if __name__ == '__main__':
    unittest.main()
