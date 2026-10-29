import importlib.util,json,pathlib,tempfile,unittest
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('capture_utf8',pathlib.Path(__file__).resolve().parents[1]/'scripts/capture.py')
capture=importlib.util.module_from_spec(spec);spec.loader.exec_module(capture)
class CaptureManifestEncoding(unittest.TestCase):
    def test_resume_uses_utf8_independently_of_the_host_text_encoding(self):
        with tempfile.TemporaryDirectory() as tmp:
            folder=pathlib.Path(tmp);url='https://pump.fun/\u4e2d\u6587.js'
            (folder/'manifest.json').write_bytes(json.dumps({'records':[{'url':url}],'captured_at':'synthetic'},ensure_ascii=False).encode('utf-8'))
            original=pathlib.Path.read_text
            def windows_default(path,*args,**kwargs):
                kwargs.setdefault('encoding','cp1252');return original(path,*args,**kwargs)
            class Finished(Exception):pass
            def checked(records,captured_at):
                self.assertEqual(records[0]['url'],url);raise Finished()
            with patch.object(capture,'OUT',folder),patch.object(capture.sys,'argv',['capture.py','--resume']),patch.object(pathlib.Path,'read_text',windows_default),patch.object(capture,'load_reuse',checked),patch.object(capture,'pool',side_effect=AssertionError('network forbidden')):
                with self.assertRaises(Finished):capture.main()
