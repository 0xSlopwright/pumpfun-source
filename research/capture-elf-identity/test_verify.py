import contextlib
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import struct
import subprocess
import sys
import tempfile
import unittest
import verify


class Tests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.copy=Path(tempfile.mkdtemp(prefix='elf-identity-',dir=verify.ROOT.parent)).resolve()
        def link(source,target):
            try:os.link(source,target)
            except OSError:shutil.copy2(source,target)
            return target
        shutil.copytree(verify.ROOT/'evidence',cls.copy/'evidence',copy_function=link)

    @classmethod
    def tearDownClass(cls):
        assert cls.copy.parent==verify.ROOT.parent.resolve() and cls.copy.name.startswith('elf-identity-')
        shutil.rmtree(cls.copy)

    def gate(self,corrected):
        with contextlib.redirect_stdout(io.StringIO()):
            return verify.verify(self.copy) if corrected else verify.byte_gate(self.copy).main()

    def test_real_captures_both_machine_ids_and_all_modes(self):
        machines=set()
        for path in (verify.ROOT/'evidence').glob('**/deployed.so'):
            data=path.read_bytes();verify.check_identity(data);machines.add(struct.unpack_from('<H',data,18)[0])
        self.assertEqual(machines,{247,263})
        for flags in ([],['-O'],['-OO']):
            result=subprocess.run([sys.executable,*flags,str(Path(verify.__file__)),'--evidence-root',str(self.copy)],capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)

    def test_structurally_parseable_foreign_or_inconsistent_headers(self):
        folder=self.copy/'evidence/original/pump'
        files={name:(folder/name).read_bytes() for name in ('deployed.so','programdata-account.bin','capture.json')}
        mutations=[(6,b'\0'),(16,struct.pack('<H',1)),(18,struct.pack('<H',62)),(20,struct.pack('<I',2)),(52,b'\0\0')]
        for offset,change in mutations:
            data=bytearray(files['deployed.so']);data[offset:offset+len(change)]=change
            programdata=files['programdata-account.bin'][:45]+data
            metadata=json.loads(files['capture.json'])
            metadata['payload_sha256']=hashlib.sha256(data).hexdigest()
            metadata['programdata_sha256']=hashlib.sha256(programdata).hexdigest()
            changes={'deployed.so':data,'programdata-account.bin':programdata,'capture.json':json.dumps(metadata).encode()}
            for name,content in changes.items():
                path=folder/name;path.unlink();path.write_bytes(content)
            try:
                self.gate(False)
                with self.assertRaises(verify.ElfIdentityError):self.gate(True)
            finally:
                for name,content in files.items():(folder/name).write_bytes(content)

    def test_truncated_header(self):
        with self.assertRaisesRegex(verify.ElfIdentityError,'truncated'):verify.check_identity(b'\x7fELF')


if __name__=='__main__':unittest.main()
