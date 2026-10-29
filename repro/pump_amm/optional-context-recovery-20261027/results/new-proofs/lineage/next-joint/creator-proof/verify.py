from pathlib import Path
import argparse,hashlib,json,types
HERE=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(p):
 m=types.ModuleType('verified');m.__file__=str(p);exec(compile(Path(p).read_bytes(),str(p),'exec'),m.__dict__);return m
def verify(directory=HERE,candidate=None):
 d=Path(directory);manifest=json.loads((d/'manifest.json').read_text());inv=lambda:{str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()and p!=d/'manifest.json'};assert inv()==manifest['files'];candidate=Path(candidate)if candidate else d/'candidate.so';digest=sha(candidate);assert digest=='97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643';rows={n:module(d/n/'verify.py').verify(d/n,candidate)for n in ['rent-proof','retained-proof','cto-proof']};assert sum(v['cases']for v in rows.values())==394 and sum(v['signatures']for v in rows.values())==826 and all(v['mismatches']==0 for v in rows.values());assert inv()==manifest['files'];return {'verified':True,'candidate_sha256':digest,'fresh_cases':394,'signatures':826,'mismatches':0,'suites':rows,'executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('directory',type=Path,nargs='?',default=HERE);p.add_argument('--candidate',type=Path);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
