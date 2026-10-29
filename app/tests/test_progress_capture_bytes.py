import importlib.util,copy,pathlib,unittest
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('progress_bytes',pathlib.Path(__file__).resolve().parents[1]/'scripts/progress.py')
progress=importlib.util.module_from_spec(spec);spec.loader.exec_module(progress)
class ProgressBytes(unittest.TestCase):
    def test_declared_script_size_must_match_before_verification_credit(self):
        original=progress.read
        manifest=original('evidence/web/manifest.json')
        record=next(row for row in manifest['records'] if row['url'].endswith('.js') and row.get('status')==200)
        for size in [record['bytes']+1,True,-1]:
            changed=copy.deepcopy(manifest)
            next(row for row in changed['records'] if row['path']==record['path'])['bytes']=size
            with patch.object(progress,'read',lambda path:changed if path=='evidence/web/manifest.json' else original(path)):
                with self.assertRaisesRegex(ValueError,'byte count'):progress.render()
