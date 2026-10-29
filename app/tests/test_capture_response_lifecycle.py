import importlib.util
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch
import urllib.error
import io

spec=importlib.util.spec_from_file_location('capture_lifecycle',Path(__file__).resolve().parents[1]/'scripts/capture.py')
capture=importlib.util.module_from_spec(spec)
spec.loader.exec_module(capture)
class Response(io.BytesIO):
    url='https://example.test/asset.js'
    status=200
    headers={}
class Lifecycle(unittest.TestCase):
    def test_success_and_read_failure_close_response(self):
        for failure in (False,True):
            with self.subTest(failure=failure), TemporaryDirectory() as directory:
                root=Path(directory)
                response=Response(b'example')
                with patch.object(capture,'ROOT',root),patch.object(capture,'OUT',root/'evidence/web'),patch.object(capture.urllib.request,'urlopen',return_value=response):
                    if failure:
                        with patch.object(response,'read',side_effect=OSError('read failed')):
                            record,body=capture.capture(response.url)
                        self.assertIn('error',record)
                    else:
                        record,body=capture.capture(response.url)
                        self.assertEqual(body,b'example')
                        self.assertEqual(record['bytes'],7)
                self.assertTrue(response.closed)
    def test_http_error_body_is_retained_and_closed(self):
        with TemporaryDirectory() as directory:
            root=Path(directory);body=io.BytesIO(b'not found')
            response=urllib.error.HTTPError(Response.url,404,'Not found',{},body)
            with patch.object(capture,'ROOT',root),patch.object(capture,'OUT',root/'evidence/web'),patch.object(capture.urllib.request,'urlopen',side_effect=response):
                record,retained=capture.capture(Response.url)
            self.assertEqual(record['status'],404)
            self.assertEqual(retained,b'not found')
            self.assertTrue(body.closed)
