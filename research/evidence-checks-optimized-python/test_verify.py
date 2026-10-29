import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

import verify


class OptimizedEvidenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(dir=verify.ROOT.parent)
        cls.copy = Path(cls.temp.name)
        def copy_file(source, target):
            try:
                os.link(source, target)
            except OSError:
                shutil.copy2(source, target)
            return target
        shutil.copytree(verify.ROOT / 'evidence', cls.copy / 'evidence', copy_function=copy_file)

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def run_gate(self, flags=(), original=False):
        if original:
            code = "import importlib.util,sys;sys.path.insert(0,sys.argv[1]);s=importlib.util.spec_from_file_location('archived_gate',sys.argv[2]);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);m.ROOT=__import__('pathlib').Path(sys.argv[3]);m.main()"
            args = ['-c', code, str(verify.ROOT / 'scripts'), str(verify.ROOT / 'scripts/verify_evidence.py'), str(self.copy)]
        else:
            args = [str(Path(verify.__file__)), '--evidence-root', str(self.copy)]
        return subprocess.run([sys.executable, *flags, *args], capture_output=True, text=True)

    def test_original_corpus_passes_all_interpreter_modes(self):
        for flags in ((), ('-O',), ('-OO',)):
            with self.subTest(flags=flags):
                result = self.run_gate(flags)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn('9 captures verified', result.stdout)

    def test_corrupt_metadata_and_missing_capture_are_rejected_in_all_modes(self):
        provenance = self.copy / 'evidence/upstream/provenance.json'
        capture = self.copy / 'evidence/original/pump/capture.json'
        mutations = [
            (provenance, lambda data: data['file_sha256'].__setitem__(next(iter(data['file_sha256'])), '0' * 64)),
            (capture, lambda data: data.__setitem__('payload_bytes', data['payload_bytes'] + 1)),
            (capture, lambda data: data.__setitem__('genesis_hash', 'incorrect-chain')),
            (capture, lambda data: data.__setitem__('last_deploy_slot', data['last_deploy_slot'] + 1)),
            (capture, None),
        ]
        for path, mutate in mutations:
            with self.subTest(path=path.name, mutation=mutate):
                original = path.read_bytes()
                # Unlink our copy first: never write through an original-evidence hardlink.
                path.unlink()
                try:
                    if mutate:
                        data = json.loads(original)
                        mutate(data)
                        path.write_text(json.dumps(data), encoding='utf-8')
                    before = self.run_gate(('-O',), original=True)
                    self.assertEqual(before.returncode, 0, before.stderr)
                    self.assertIn('captures verified', before.stdout)
                    self.assertNotEqual(self.run_gate(original=True).returncode, 0)
                    for flags in ((), ('-O',), ('-OO',)):
                        result = self.run_gate(flags)
                        self.assertNotEqual(result.returncode, 0)
                        self.assertIn('AssertionError', result.stderr)
                finally:
                    if path.exists():
                        path.unlink()
                    path.write_bytes(original)

    def test_dependent_elf_assertions_are_also_retained(self):
        gate = verify.checked_module()
        payload = (verify.ROOT / 'evidence/original/pump/deployed.so').read_bytes()
        self.assertTrue(gate.elf_layout(payload)['trailing_all_zero'])
        with self.assertRaises(AssertionError):
            gate.elf_layout(b'BAD!' + payload[4:])

    def test_all_helpers_bind_reviewed_lf_crlf_and_reject_drift(self):
        with tempfile.TemporaryDirectory(dir=verify.ROOT.parent) as directory:
            root = Path(directory)
            (root / 'scripts').mkdir()
            sources = {name: (verify.ROOT / 'scripts' / name).read_bytes().replace(b'\r\n', b'\n') for name in verify.SOURCE_HASHES}
            with patch.object(verify, 'ROOT', root):
                for crlf in (False, True):
                    for name, raw in sources.items():
                        (root / 'scripts' / name).write_bytes(raw.replace(b'\n', b'\r\n') if crlf else raw)
                    self.assertTrue(callable(verify.checked_module(self.copy).main))
                for name, raw in sources.items():
                    path = root / 'scripts' / name
                    previous = path.read_bytes()
                    path.write_bytes(raw + b'\n# unexpected drift\n')
                    with self.assertRaisesRegex(ValueError, 'Reviewed evidence helper has changed'):
                        verify.checked_module(self.copy)
                    path.write_bytes(previous)


if __name__ == '__main__':
    unittest.main()
