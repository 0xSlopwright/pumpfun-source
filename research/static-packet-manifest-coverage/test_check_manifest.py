import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

import check_manifest

ROOT = Path(__file__).resolve().parents[2]
GENERATORS = {'windows': 'analyze_program.py', 'sections': 'deep_section_analysis.py',
              'disassembly': 'deep_disassembly.py', 'signatures': 'bytecode_signatures.py',
              'roadmap': 'reconstruction_roadmap.py'}
TARGETS = {'windows': 'call-graph.json', 'sections': 'layer2-relocation-map.json',
           'disassembly': 'dispatch-table.json', 'signatures': 'shared-signatures.json',
           'roadmap': 'reconstruction-plan.json'}


class ManifestCoverageTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(dir=ROOT.parent)
        cls.path = Path(cls.temp.name)
        env = os.environ.copy()
        env['PYTHONUTF8'] = '1'
        for kind, generator in GENERATORS.items():
            command = [sys.executable, str(ROOT / 'scripts' / generator), '--output', str(cls.path / kind)]
            if kind in ('windows', 'sections', 'disassembly'):
                command += ['--program', 'mayhem']
            subprocess.run(command, cwd=ROOT, env=env, check=True, capture_output=True)

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def test_complete_real_generated_packets_pass(self):
        for kind in GENERATORS:
            with self.subTest(kind=kind):
                result = check_manifest.check_manifest(self.path / kind, kind)
                self.assertEqual(result['required_artifacts'], len(check_manifest.REQUIRED[kind]))
                self.assertEqual(result['hashed_artifacts'], result['required_artifacts'])

    def test_omitted_real_artifacts_pass_old_verifier_and_fail_coverage_guard(self):
        for kind, target in TARGETS.items():
            with self.subTest(kind=kind):
                copy = self.path / ('omitted-' + kind)
                shutil.copytree(self.path / kind, copy)
                path = copy / 'manifest.json'
                manifest = json.loads(path.read_text())
                del manifest[target]
                path.write_text(json.dumps(manifest), encoding='utf-8')
                if kind == 'sections':
                    # The old section verifier checks presence, but not this omitted hash.
                    (copy / target).write_text('{}\n', encoding='utf-8')
                else:
                    (copy / target).unlink()
                old = subprocess.run([sys.executable, str(copy / 'verify.py')], capture_output=True, text=True)
                self.assertEqual(old.returncode, 0, old.stdout + old.stderr)
                with self.assertRaisesRegex(ValueError, 'Required artifacts omitted'):
                    check_manifest.check_manifest(copy, kind)

    def test_corrupt_present_hash_and_unsafe_optional_name_are_rejected(self):
        copy = self.path / 'corrupt-roadmap'
        shutil.copytree(self.path / 'roadmap', copy)
        (copy / 'reconstruction-plan.json').write_text('{}\n', encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'hash mismatch'):
            check_manifest.check_manifest(copy, 'roadmap')
        manifest_path = copy / 'manifest.json'
        manifest = json.loads(manifest_path.read_text())
        manifest['../outside.json'] = '0' * 64
        manifest_path.write_text(json.dumps(manifest), encoding='utf-8')
        with self.assertRaisesRegex(ValueError, 'Invalid artifact name'):
            check_manifest.check_manifest(copy, 'roadmap')


if __name__ == '__main__':
    unittest.main()
