import hashlib
import json
from pathlib import Path
import tempfile
import types
import unittest
from unittest.mock import patch

import measure

CASES = {
    'pump': ('research/pump-program-creator-notice-qualification-20261028/artifacts/unstripped.so', '0f50faa8c325104dc77898ed84866dec2ad1eec475b6abba72c475cf7bf9bab6', 45),
    'pump_amm': ('research/amm-layout-closure-20261028/results/build-a/symbols.so', '7271aaf8afe13b6c8f13a6cf0e9534896a66650dda13a2aa1b32e41edd46426d', 87),
    'mayhem': ('research/mayhem-canonical-promotion-20261028/hosted/40770208958/symbols.so', '7b15bb1e5c7c9c53041322fa64d4a420906fffd96ff97a55d70d627bcb854960', 58),
}


def archived_module():
    module = types.ModuleType('archived_measurement')
    module.__file__ = str(measure.SOURCE)
    exec(compile(measure.SOURCE.read_bytes(), str(measure.SOURCE), 'exec'), module.__dict__)
    return module


class RawAttributionTests(unittest.TestCase):
    def test_every_raw_result_names_an_actual_raw_witness(self):
        module = measure.corrected_module()
        archived = archived_module()
        Elf = module._elf_class()
        for program, (relative, digest, expected_changed) in CASES.items():
            with self.subTest(program=program):
                candidate_path = measure.ROOT / relative
                self.assertEqual(hashlib.sha256(candidate_path.read_bytes()).hexdigest(), digest)
                original_path = measure.ROOT / f'evidence/original/{program}/deployed.so'
                original, candidate = Elf(original_path), Elf(candidate_path)
                before = archived.measure(original_path, candidate_path)
                after = module.measure(original_path, candidate_path)
                changed = 0
                for old, new in zip(before, after):
                    self.assertEqual({k: v for k, v in old.items() if k != 'match'}, {k: v for k, v in new.items() if k != 'match'})
                    if old['match'] != new['match']:
                        changed += 1
                        self.assertTrue(new['raw'])
                    if not new['raw']:
                        self.assertEqual(old, new)
                        continue
                    start, size = int(new['original'], 16), new['bytes']
                    witnesses = [f for f in candidate.funcs if f['name'] == new['match'] and f['size'] == size
                                 and candidate.b[f['start']:f['start'] + size] == original.b[start:start + size]
                                 and candidate.pattern(f['start'], size) == original.pattern(start, size)]
                    self.assertTrue(witnesses, new)
                self.assertEqual(changed, expected_changed)

    def test_reviewed_checkout_forms_and_source_drift(self):
        raw = measure.SOURCE.read_bytes().replace(b'\r\n', b'\n')
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'window_measure.py'
            with patch.object(measure, 'SOURCE', path):
                for data in (raw, raw.replace(b'\n', b'\r\n')):
                    path.write_bytes(data)
                    self.assertTrue(callable(measure.corrected_module().measure))
                path.write_bytes(raw + b'\n# drift\n')
                with self.assertRaisesRegex(ValueError, 'reviewed window-measurement source'):
                    measure.corrected_module()


if __name__ == '__main__':
    unittest.main()
