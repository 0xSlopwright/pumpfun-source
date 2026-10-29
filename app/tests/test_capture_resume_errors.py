import hashlib,importlib.util,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('capture_retry',Path(__file__).resolve().parents[1]/'scripts/capture.py')
capture=importlib.util.module_from_spec(spec);spec.loader.exec_module(capture)
class RetryTests(unittest.TestCase):
    def test_error_records_are_retried_and_valid_objects_are_reused(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);objects=root/'evidence/web/objects';objects.mkdir(parents=True)
            body=b'retained';(objects/'good.js').write_bytes(body)
            good={'url':'https://pump.fun/good.js','path':'evidence/web/objects/good.js','bytes':len(body),'sha256':hashlib.sha256(body).hexdigest()}
            failed={'url':'https://pump.fun/retry.js','error':'temporary network failure'}
            with patch.object(capture,'ROOT',root),patch.object(capture,'REUSE',{}),patch.object(capture,'capture',return_value=({'url':failed['url']},b'retried')) as fetch:
                capture.load_reuse([good,failed])
                results=capture.pool({good['url'],failed['url']})
                fetch.assert_called_once_with(failed['url'])
                self.assertIn((good,body),results)
    def test_corrupt_retained_object_is_still_rejected(self):
        with self.assertRaises(capture.RetainedCaptureError):
            capture.load_reuse([{'url':'https://pump.fun/bad','error':'failure','path':'../bad'}])
