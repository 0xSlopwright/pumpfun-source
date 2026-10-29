import hashlib
import json
from pathlib import Path
import tempfile
import types
import unittest
from unittest.mock import patch

import recover


class DispatchEncodingTests(unittest.TestCase):
    def test_real_dispatch_results_match_utf8_baseline_under_cp936_defaults(self):
        corrected = recover.corrected_module()
        archived = types.ModuleType('archived_dispatch')
        archived.__file__ = str(recover.SOURCE)
        exec(compile(recover.SOURCE.read_bytes(), str(recover.SOURCE), 'exec'), archived.__dict__)
        real_read_text = Path.read_text
        def using_default(encoding):
            def read_text(path, *args, **kwargs):
                if not args and 'encoding' not in kwargs:
                    kwargs['encoding'] = encoding
                return real_read_text(path, *args, **kwargs)
            return read_text
        for program in ('pump', 'pump_amm', 'pump_fees', 'mayhem'):
            with self.subTest(program=program):
                with patch.object(Path, 'read_text', using_default('utf-8')):
                    expected = archived.recover(program)
                with patch.object(Path, 'read_text', using_default('cp936')):
                    actual = corrected.recover(program)
                self.assertEqual(actual, expected)
                self.assertEqual(actual['binary_sha256'], hashlib.sha256((recover.ROOT / f'evidence/original/{program}/deployed.so').read_bytes()).hexdigest())
        with patch.object(Path, 'read_text', using_default('cp936')):
            with self.assertRaises(UnicodeDecodeError):
                archived.recover('pump')

    def test_reviewed_checkout_forms_and_source_drift(self):
        raw = recover.SOURCE.read_bytes().replace(b'\r\n', b'\n')
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'recover_dispatch.py'
            with patch.object(recover, 'SOURCE', path):
                for data in (raw, raw.replace(b'\n', b'\r\n')):
                    path.write_bytes(data)
                    self.assertTrue(callable(recover.corrected_module().recover))
                path.write_bytes(raw + b'\n# drift\n')
                with self.assertRaisesRegex(ValueError, 'reviewed dispatch-recovery source'):
                    recover.corrected_module()


if __name__ == '__main__':
    unittest.main()
