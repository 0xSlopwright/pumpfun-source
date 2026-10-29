import gzip
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
import generate


class Tests(unittest.TestCase):
    def test_actual_complete_packets_across_hash_seeds(self):
        scratch=Path(tempfile.mkdtemp(prefix='deterministic-deep-',dir=generate.ROOT.parent)).resolve()
        try:
            outputs=[]
            for corrected,seed in ((False,'1'),(False,'2'),(True,'1'),(True,'2')):
                target=scratch/f'{corrected}-{seed}'
                entry=Path(generate.__file__) if corrected else generate.SOURCE
                env=os.environ.copy();env['PYTHONHASHSEED']=seed
                result=subprocess.run([sys.executable,str(entry),'--program','pump','--output',str(target)],env=env,capture_output=True,text=True)
                self.assertEqual(result.returncode,0,result.stderr)
                outputs.append(target)
            old1,old2,new1,new2=outputs
            self.assertNotEqual((old1/'windows-deep.json').read_bytes(),(old2/'windows-deep.json').read_bytes())
            self.assertNotEqual((old1/'disassembly.json.gz').read_bytes()[4:8],bytes(4))
            self.assertEqual(sorted(p.name for p in new1.iterdir()),sorted(p.name for p in new2.iterdir()))
            for path in new1.iterdir():
                self.assertEqual(path.read_bytes(),(new2/path.name).read_bytes(),path.name)
            old_rows=json.loads((old1/'windows-deep.json').read_text())
            for row in old_rows:
                for field in ('syscalls','extern_calls'):row[field].sort()
            self.assertEqual(old_rows,json.loads((new1/'windows-deep.json').read_text()))
            self.assertEqual(json.loads(gzip.decompress((old1/'disassembly.json.gz').read_bytes())),json.loads(gzip.decompress((new1/'disassembly.json.gz').read_bytes())))
            self.assertEqual((new1/'disassembly.json.gz').read_bytes()[3:8],bytes(5))
            verified=subprocess.run([sys.executable,str(new1/'verify.py')],capture_output=True,text=True)
            self.assertEqual(verified.returncode,0,verified.stderr)
        finally:
            assert scratch.parent==generate.ROOT.parent.resolve() and scratch.name.startswith('deterministic-deep-')
            shutil.rmtree(scratch)

    def test_gzip_does_not_embed_output_name(self):
        scratch=Path(tempfile.mkdtemp(prefix='gzip-name-',dir=generate.ROOT.parent)).resolve()
        try:
            for name in ('first.gz','different.gz'):
                with generate.deterministic_gzip_text(scratch/name) as stream:stream.write('same\ntext')
            self.assertEqual((scratch/'first.gz').read_bytes(),(scratch/'different.gz').read_bytes())
        finally:
            assert scratch.parent==generate.ROOT.parent.resolve() and scratch.name.startswith('gzip-name-')
            shutil.rmtree(scratch)

    def test_source_drift(self):
        with patch.object(Path,'read_bytes',return_value=b'changed'):
            with self.assertRaisesRegex(ValueError,'disassembler changed'):generate.reviewed_module()


if __name__=='__main__':unittest.main()
