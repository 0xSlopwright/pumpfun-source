import base64, hashlib, io, json, pathlib, shutil, subprocess, sys, tarfile, tempfile, unittest
class EvidencePathBoundary(unittest.TestCase):
    def test_paths_cannot_escape_the_checkpoint_even_with_matching_hashes(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=pathlib.Path(tmp)/'app'
            for folder in ['scripts','evidence/web','evidence/sdk','packages/sdk/src']:(root/folder).mkdir(parents=True)
            script=root/'scripts/verify-evidence.py'
            shutil.copyfile(pathlib.Path(__file__).resolve().parents[1]/'scripts/verify-evidence.py',script)
            outside=pathlib.Path(tmp)/'outside.txt';outside.write_bytes(b'synthetic')
            source=root/'packages/sdk/src/index.ts';source.write_bytes(b'export {};')
            archive=root/'evidence/sdk/pump-sdk-4.3.1.tgz'
            with tarfile.open(archive,'w:gz') as tar:
                entry=tarfile.TarInfo('package/src/index.ts');entry.size=10;tar.addfile(entry,io.BytesIO(b'export {};'))
            integrity='sha512-'+base64.b64encode(hashlib.sha512(archive.read_bytes()).digest()).decode()
            (root/'evidence/sdk/registry.json').write_text(json.dumps({'dist':{'integrity':integrity}}))
            for name in ['api-probes.json','source-map-probes.json']:(root/'evidence'/name).write_text('[]')
            for path in ['../outside.txt',str(outside.resolve()),'evidence/../../outside.txt']:
                (root/'evidence/web/manifest.json').write_text(json.dumps({'records':[{'path':path,'sha256':hashlib.sha256(b'synthetic').hexdigest()}]}))
                for flag in [[],['-O']]:
                    result=subprocess.run([sys.executable,*flag,str(script)],capture_output=True,text=True)
                    self.assertNotEqual(result.returncode,0,path)
                    self.assertIn('capture path',result.stderr)
