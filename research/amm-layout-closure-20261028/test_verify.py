#!/usr/bin/env python3
"""Resealed negatives for the new source/layout qualification surface."""
import importlib.util
import json
from pathlib import Path
import shutil
import tempfile
import unittest

P = Path(__file__).resolve().parent
ROOT = P.parents[1]
spec = importlib.util.spec_from_file_location('layout_gate_tests', P/'verify.py')
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


class RejectionTests(unittest.TestCase):
    def packet(self, change, expected):
        with tempfile.TemporaryDirectory(prefix='amm-layout-negative-') as directory:
            target = Path(directory)/'packet'
            shutil.copytree(P, target, ignore=shutil.ignore_patterns('__pycache__'))
            source = Path(directory)/'source'
            for name, data in gate.archive(P/'results/build-a/canonical-source.tar.gz').items():
                path = source/name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(data)
            change(target)
            (target/'manifest.json').write_text(json.dumps(gate.inventory(target)))
            previous = gate.P
            gate.P = target
            try:
                with self.assertRaisesRegex(ValueError, expected):
                    gate.verify(ROOT, source_root=source)
            finally:
                gate.P = previous

    def test_resealed_linker_recipe_is_rejected(self):
        self.packet(lambda p:(p/'ordered.ld').write_bytes((p/'ordered.ld').read_bytes()+b'\n'), 'Executed build controller changed')

    def test_resealed_cold_claim_is_rejected(self):
        def mutate(p):
            f = p/'results/build-b/build-record.json'
            d = json.loads(f.read_text())
            d['clean_all'] = False
            f.write_text(json.dumps(d))
        self.packet(mutate, 'Actual build scope differs')

    def test_resealed_compiler_output_is_rejected(self):
        def mutate(p):
            f = p/'results/build-a/candidate.so'
            b = bytearray(f.read_bytes())
            b[0x32a4] ^= 1
            f.write_bytes(b)
        self.packet(mutate, 'Actual compiler output differs')

    def test_literal_audit_rejects_another_function_difference(self):
        with tempfile.TemporaryDirectory(prefix='amm-literal-negative-') as directory:
            candidate = Path(directory)/'candidate.so'
            b = bytearray((P/'results/build-a/candidate.so').read_bytes())
            b[0x32a4] ^= 1
            candidate.write_bytes(b)
            audit = gate.module('literal_negative_audit', P/'audit_elf.py')
            with self.assertRaisesRegex(ValueError, 'Another raw function boundary differs'):
                audit.audit(ROOT, candidate, P/'results/build-a/symbols.so')


if __name__ == '__main__':
    unittest.main()
