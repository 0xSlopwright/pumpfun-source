from pathlib import Path,PurePosixPath
import hashlib,importlib.util,json,sys
sys.dont_write_bytecode=True

def verify(root=None):
 w=Path(__file__).resolve().parent;manifest=json.loads((w/'manifest.json').read_bytes());files=manifest['files'];actual={str(p.relative_to(w))for p in w.rglob('*')if p.is_file()and '__pycache__'not in p.parts};assert actual==set(files)|{'manifest.json'}
 for n,h in files.items():
  r=PurePosixPath(n);assert not r.is_absolute()and '..'not in r.parts;path=w/n;assert not any(p.is_symlink()for p in(path,*path.parents)if p!=w.parent);assert hashlib.sha256(path.read_bytes()).hexdigest()==h,n
 sys.path.insert(0,str(w));s=importlib.util.spec_from_file_location('incentive_independent_analyze',w/'analyze.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);report=m.run(w);assert report==json.loads((w/'review.json').read_bytes())
 joint=next(x for x in report['corpus']['groups']if x['group']=='joint1730');assert joint['mismatches']==0 and joint['cases']==1730
 return {'passed':True,'candidate_sha256':m.JOINT,'cases':joint['cases'],'transactions':joint['transactions'],'signature_fields':joint['signature_fields'],'mismatches':0,'baseline_mismatches':report['corpus']['counterexamples']['count'],'original_successes':joint['original_successes'],'manifest_sha256':hashlib.sha256((w/'manifest.json').read_bytes()).hexdigest(),'all_recorded_observations':report['corpus']['all_records_including_historical_negatives'],'strict_equality_boundary_controls':88,'new_vm_executions':0,'scope':'Independent original conditional-branch, minimal source patch, and saved signed incentive-domain audit. No whole-ELF or live-reachability claim.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
