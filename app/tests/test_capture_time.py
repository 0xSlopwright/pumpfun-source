"""Resuming a mixed-age capture must preserve the acquisition provenance of each object."""
import datetime
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

spec=importlib.util.spec_from_file_location('capture',Path(__file__).resolve().parents[1]/'scripts/capture.py')
capture=importlib.util.module_from_spec(spec)
spec.loader.exec_module(capture)


class CaptureTimeTests(unittest.TestCase):
    def response(self,request,timeout):
        return SimpleNamespace(read=lambda:b'',close=lambda:None,url=request.full_url,status=200,headers={})

    def test_fresh_response_has_a_timezone_aware_acquisition_time(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            with patch.object(capture,'ROOT',root),patch.object(capture,'OUT',root/'evidence/web'),patch.object(capture.urllib.request,'urlopen',side_effect=self.response):
                record,_=capture.capture('https://pump.fun/new.js')
            timestamp=datetime.datetime.fromisoformat(record['captured_at'])
            self.assertEqual(timestamp.utcoffset(),datetime.timedelta(0))

    def test_resume_retains_record_time_or_original_batch_time(self):
        batch_time='2026-10-28T10:48:45.546100+00:00'
        for record_time in (None,'2026-10-27T09:00:00+00:00'):
            with self.subTest(record_time=record_time),tempfile.TemporaryDirectory() as tmp:
                root=Path(tmp);out=root/'evidence/web';(out/'objects').mkdir(parents=True)
                body=b'<html></html>';(out/'objects/retained.html').write_bytes(body)
                old={'url':'https://pump.fun/','status':200,'path':'evidence/web/objects/retained.html','bytes':len(body),'sha256':hashlib.sha256(body).hexdigest()}
                if record_time:old['captured_at']=record_time
                (out/'manifest.json').write_text(json.dumps({'captured_at':batch_time,'records':[old]}))
                with patch.object(capture,'ROOT',root),patch.object(capture,'OUT',out),patch.object(capture,'PAGES',['/']),patch.object(capture,'REUSE',{}),patch.object(capture.urllib.request,'urlopen',side_effect=self.response),patch('sys.argv',['capture.py','--resume']):
                    capture.main()
                manifest=json.loads((out/'manifest.json').read_text())
                retained=next(row for row in manifest['records'] if row['url']=='https://pump.fun/')
                self.assertEqual(retained['captured_at'],record_time or batch_time)
                self.assertEqual((out/'objects/retained.html').read_bytes(),body)
                self.assertNotEqual(manifest['captured_at'],batch_time)


if __name__=='__main__':unittest.main()
