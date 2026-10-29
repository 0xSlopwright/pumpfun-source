"""A failed fresh capture must preserve the last published evidence."""
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from contextlib import redirect_stdout

spec = importlib.util.spec_from_file_location(
    'capture_publication', Path(__file__).resolve().parents[1] / 'scripts/capture.py')
capture = importlib.util.module_from_spec(spec)
spec.loader.exec_module(capture)


class Response:
    status = 200
    headers = {'Content-Type': 'text/html'}

    def __init__(self, url, body):
        self.url = url
        self.body = body

    def close(self):
        pass

    def read(self):
        return self.body


class CapturePublicationTests(unittest.TestCase):
    def test_changed_response_does_not_overwrite_retained_object(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            out = root / 'evidence/web'
            url = 'https://pump.fun/'
            with patch.object(capture, 'ROOT', root), patch.object(capture, 'OUT', out):
                with patch.object(capture.urllib.request, 'urlopen', return_value=Response(url, b'old capture')):
                    old, _ = capture.capture(url)
                retained = (root / old['path']).read_bytes()
                with patch.object(capture.urllib.request, 'urlopen', return_value=Response(url, b'new capture')):
                    new, body = capture.capture(url)
                self.assertEqual((root / old['path']).read_bytes(), retained)
                self.assertNotEqual(old['path'], new['path'])
                self.assertEqual((root / new['path']).read_bytes(), body)
                self.assertEqual(hashlib.sha256(retained).hexdigest(), old['sha256'])

    def test_discovery_failure_preserves_manifest_and_every_retained_object(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            out = root / 'evidence/web'
            url = 'https://pump.fun/'
            with patch.object(capture, 'ROOT', root), patch.object(capture, 'OUT', out), patch.object(capture, 'REUSE', {}):
                with patch.object(capture.urllib.request, 'urlopen', return_value=Response(url, b'old capture')):
                    old, _ = capture.capture(url)
                manifest = out / 'manifest.json'
                published = json.dumps({'records': [old]}).encode()
                manifest.write_bytes(published)
                real_pool = capture.pool

                def pool(urls):
                    if any('/_next/' in item for item in urls):
                        raise RuntimeError('discovery interrupted')
                    return real_pool(urls)

                def response(request, **_):
                    return Response(request.full_url, b'<script src="/_next/static/chunks/new.js"></script>')

                with patch.object(capture, 'pool', side_effect=pool), patch.object(capture.urllib.request, 'urlopen', side_effect=response), patch.object(capture.sys, 'argv', ['capture.py']):
                    with self.assertRaisesRegex(RuntimeError, 'discovery interrupted'):
                        capture.main()
                self.assertEqual(manifest.read_bytes(), published)
                self.assertEqual((root / old['path']).read_bytes(), b'old capture')
                self.assertEqual(hashlib.sha256((root / old['path']).read_bytes()).hexdigest(), old['sha256'])

    def test_failed_object_publication_keeps_identical_retained_bytes(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            out = root / 'evidence/web'
            url = 'https://pump.fun/example.js'
            with patch.object(capture, 'ROOT', root), patch.object(capture, 'OUT', out), patch.object(capture.urllib.request, 'urlopen', return_value=Response(url, b'original')):
                old, _ = capture.capture(url)
                with patch.object(capture.os, 'replace', side_effect=OSError('publication interrupted')):
                    failed, body = capture.capture(url)
                self.assertIn('publication interrupted', failed['error'])
                self.assertEqual(body, b'')
                self.assertEqual((root / old['path']).read_bytes(), b'original')
                self.assertEqual(list((out / 'objects').glob('*.tmp')), [])

    def test_manifest_publication_failure_keeps_old_snapshot_then_retry_publishes_complete_records(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            out = root / 'evidence/web'
            url = 'https://pump.fun/'
            with patch.object(capture, 'ROOT', root), patch.object(capture, 'OUT', out), patch.object(capture, 'REUSE', {}):
                with patch.object(capture.urllib.request, 'urlopen', return_value=Response(url, b'original')):
                    old, _ = capture.capture(url)
                manifest = out / 'manifest.json'
                published = json.dumps({'records': [old]}).encode()
                manifest.write_bytes(published)
                replace = capture.os.replace

                def refuse_manifest(source, target):
                    if Path(target) == manifest:
                        raise OSError('manifest publication interrupted')
                    return replace(source, target)

                def response(request, **_):
                    return Response(request.full_url, b'new complete response')

                with patch.object(capture.urllib.request, 'urlopen', side_effect=response), patch.object(capture.sys, 'argv', ['capture.py']):
                    with patch.object(capture.os, 'replace', side_effect=refuse_manifest):
                        with self.assertRaisesRegex(OSError, 'manifest publication interrupted'):
                            capture.main()
                    self.assertEqual(manifest.read_bytes(), published)
                    self.assertEqual((root / old['path']).read_bytes(), b'original')
                    self.assertEqual(list(out.glob('*.tmp')), [])
                    with redirect_stdout(io.StringIO()):
                        capture.main()
                current = json.loads(manifest.read_bytes())
                self.assertEqual(len(current['records']), len(capture.PAGES) + 2)
                for record in current['records']:
                    body = (root / record['path']).read_bytes()
                    self.assertEqual(len(body), record['bytes'])
                    self.assertEqual(hashlib.sha256(body).hexdigest(), record['sha256'])
                self.assertEqual((root / old['path']).read_bytes(), b'original')
                self.assertEqual(list(out.rglob('*.tmp')), [])


if __name__ == '__main__':
    unittest.main()
