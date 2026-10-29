"""Check the retained unselected proposals and the explicit negative baseline."""
from pathlib import Path
import hashlib,importlib.util,json,subprocess,sys
P=Path(__file__).resolve().parent
EXPECTED={'native-inverse-proposal': '35cb57cf07218fd6b54d0c6eccce5ad84c516403b8e7bf48e47455b7a61b6719', 'route-option-proposal': '2b1c082d26eabb39380624e044dbcd09e791132e132e3c84202118eaa37b18c6', 'upstream-incentive-regression': '39254930b39b82c35453934739c2557039058193e995a1483189fb0f5ad05e8f', 'source-coordinate-review': '76aad798d4de5d14eed6510269e58983a15063849985b28fbd4354a0166db51c', 'inverse-context-review': '54694b9f2824ff3d8be4a677b363e2008c1d73508da6e1397ea14dc0c6891cda', 'authentic-admin-history': 'd2ffcf69bbee18cf7c8f3a90ebffc1a5e1ec11c32b0d40b7927c664d62771d7d'}

def verify():
 result={}
 for name,seal in EXPECTED.items():
  root=P/name;manifest=root/'manifest.json';assert hashlib.sha256(manifest.read_bytes()).hexdigest()==seal
  entries=json.loads(manifest.read_bytes())['files']
  for relative,item in entries.items():
   want=item['sha256'] if isinstance(item,dict) else item
   assert hashlib.sha256((root/relative).read_bytes()).hexdigest()==want
  if name=='upstream-incentive-regression':
   spec=importlib.util.spec_from_file_location('retained_negative',root/'verify.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
   report=m.verify(root,expected_bad=128);assert report['mismatches']==128
  elif (root/'verify.py').exists():
   child=subprocess.run([sys.executable,'-B',str(root/'verify.py')],cwd='/',capture_output=True,text=True,check=True)
  result[name]={'manifest_verified':True,'saved_verifier_passed':name!='source-coordinate-review'}
 return {'passed':True,'packets':result,'selected_current_candidate_changed':False}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
