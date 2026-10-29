"""Capture manifests use portable paths regardless of the host OS."""
import hashlib
import importlib.util
from pathlib import Path, PurePosixPath
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('capture', Path(__file__).resolve().parents[1] / 'scripts/capture.py')
capture = importlib.util.module_from_spec(spec)
spec.loader.exec_module(capture)


class CapturePathTests(unittest.TestCase):
    def test_record_paths_use_posix_separators(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            url = 'https://pump.fun/_next/static/chunks/test.js'
            body = b'const captured = true;'
            response = SimpleNamespace(read=lambda: body, close=lambda: None, url=url, status=200, headers={})
            with patch.object(capture, 'ROOT', root), patch.object(capture, 'OUT', root / 'evidence/web'), patch.object(capture.urllib.request, 'urlopen', return_value=response):
                record, retained = capture.capture(url)
            self.assertEqual(retained, body)
            expected = 'evidence/web/objects/' + hashlib.sha256(url.encode()).hexdigest()[:16] + '-' + hashlib.sha256(body).hexdigest() + '.js'
            self.assertEqual(record['path'], expected)
            self.assertEqual(root.joinpath(*PurePosixPath(record['path']).parts).read_bytes(), body)


if __name__ == '__main__':
    unittest.main()
