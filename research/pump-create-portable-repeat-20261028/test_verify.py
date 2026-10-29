#!/usr/bin/env python3
"""Counterexamples for the executed cold build and current source binding."""
import gzip
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

P = Path(__file__).resolve().parent
ROOT = P.parents[1]
PROPOSAL = ROOT/'research/pump-create-used-boundaries-20261028'
spec = importlib.util.spec_from_file_location('pump_cold_gate_tests',P/'verify.py')
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


class RejectionTests(unittest.TestCase):
    def check(self, change, message):
        with tempfile.TemporaryDirectory(prefix='pump-cold-negative-',dir=Path(tempfile.gettempdir()).resolve()) as directory:
            packet, source = Path(directory)/'packet', Path(directory)/'source'
            shutil.copytree(P,packet,ignore=shutil.ignore_patterns('__pycache__'))
            shutil.copytree(PROPOSAL/'source',source)
            change(packet,source)
            previous = gate.P
            gate.P = packet
            try:
                (packet/'manifest.json').write_text(json.dumps(gate.inventory()))
                with self.assertRaisesRegex(ValueError,message):
                    gate.verify(ROOT,source)
            finally:
                gate.P = previous

    def test_resealed_warm_target_claim_is_rejected(self):
        def change(p,s):
            for name in ('build-comparison.json','build-attempt.json'):
                f = p/name
                d = json.loads(f.read_text())
                d['target_existed_before'] = True
                f.write_text(json.dumps(d))
        self.check(change,'Empty-target compilation absent')

    def test_resealed_registry_scope_is_rejected(self):
        def change(p,s):
            f = p/'registry-authentication.json.gz'
            d = json.loads(gzip.decompress(f.read_bytes()))
            d['files_checked'] -= 1
            raw = json.dumps(d).encode()
            f.write_bytes(gzip.compress(raw,mtime=0))
            for name in ('build-comparison.json','build-attempt.json'):
                f = p/name
                d = json.loads(f.read_text())
                d['registry_authentication_sha256'] = gate.sha(raw)
                f.write_text(json.dumps(d))
        self.check(change,'Registry scope differs')

    def test_matching_source_bytes_through_symlink_are_rejected(self):
        def change(p,s):
            f = s/'src/create_v2.rs'
            target = s.parent/'retained-create.rs'
            target.write_bytes(f.read_bytes())
            f.unlink()
            f.symlink_to(target)
        self.check(change,'Maintained source symlink')


if __name__ == '__main__':
    unittest.main()
