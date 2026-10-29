import contextlib
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
import verify


class Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.copy=Path(tempfile.mkdtemp(prefix='loader-domain-',dir=verify.ROOT.parent)).resolve()
        def link(source,target):
            try:os.link(source,target)
            except OSError:shutil.copy2(source,target)
            return target
        shutil.copytree(verify.ROOT/'evidence',cls.copy/'evidence',copy_function=link)

    @classmethod
    def tearDownClass(cls):
        assert cls.copy.parent==verify.ROOT.parent.resolve() and cls.copy.name.startswith('loader-domain-')
        shutil.rmtree(cls.copy)

    def gate(self,corrected):
        with contextlib.redirect_stdout(io.StringIO()):
            return verify.verify(self.copy) if corrected else verify.byte_gate(self.copy).main()

    def test_real_captures_in_all_interpreter_modes(self):
        for flags in ([],['-O'],['-OO']):
            result=subprocess.run([sys.executable,*flags,str(Path(verify.__file__)),'--evidence-root',str(self.copy)],capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            self.assertIn('9 captures verified',result.stdout)

    def test_invalid_option_tags_still_hashed_but_not_valid_loader_values(self):
        folder=self.copy/'evidence/original/pump';binary=folder/'programdata-account.bin';manifest=folder/'capture.json'
        original_bytes=binary.read_bytes();original_manifest=manifest.read_bytes()
        for tag in (2,255):
            data=bytearray(original_bytes);data[12]=tag
            metadata=json.loads(original_manifest);metadata['programdata_sha256']=hashlib.sha256(data).hexdigest()
            binary.unlink();binary.write_bytes(data)
            manifest.unlink();manifest.write_text(json.dumps(metadata),encoding='utf-8')
            try:
                self.gate(False)
                with self.assertRaisesRegex(verify.LoaderDomainError,'option tag'):self.gate(True)
            finally:
                binary.write_bytes(original_bytes);manifest.write_bytes(original_manifest)

    def test_missing_fractional_overflowing_and_legacy_observations(self):
        cases=[('original/pump',[461038878]),('original/pump',[461038878.5,461038879,461038884,461038885]),
               ('original/pump',[2**64]*4),('dependencies/associated_token',[-1,461039273])]
        for name,slots in cases:
            path=self.copy/f'evidence/{name}/capture.json';original=path.read_bytes();metadata=json.loads(original);metadata['context_slots']=slots
            path.unlink();path.write_text(json.dumps(metadata),encoding='utf-8')
            try:
                self.gate(False)
                with self.assertRaisesRegex(verify.LoaderDomainError,'observation slots'):self.gate(True)
                for flags in (['-O'],['-OO']):
                    result=subprocess.run([sys.executable,*flags,str(Path(verify.__file__)),'--evidence-root',str(self.copy)],capture_output=True,text=True)
                    self.assertNotEqual(result.returncode,0)
                    self.assertIn('LoaderDomainError',result.stderr)
            finally:path.write_bytes(original)


if __name__=='__main__':unittest.main()
