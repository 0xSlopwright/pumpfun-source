"""Verify a self-contained saved60-case resize replay with its supplied candidate."""
from pathlib import Path
import argparse,hashlib,json,sys,types
sys.dont_write_bytecode=True
HERE=Path(__file__).resolve().parent
def verify(directory,candidate):
 d=Path(directory);sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();files={str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'evidence-manifest.json'};assert files==json.loads((d/'evidence-manifest.json').read_text())['files'];p=d/'kit/verify.py';m=types.ModuleType('saved_verifier');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m.verify_output(d/'kit',Path(candidate),d,json.loads((d/'run.json').read_text())['expected_bad'])
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=HERE);p.add_argument('--candidate',type=Path,required=True);a=p.parse_args();r=verify(a.directory,a.candidate);print(json.dumps({k:v for k,v in r.items()if k not in ['messages','originals']},indent=2))
