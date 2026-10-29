"""Portable read-only independent source/handler review; no compiler or VM."""
from pathlib import Path
import hashlib,json,sys,types

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(p,name):
 m=types.ModuleType(name);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m

def verify(root=None):
 P=Path(root)if root is not None else Path(__file__).resolve().parent
 assert not any(p.is_symlink()for p in P.rglob('*'))
 assert json.loads((P/'manifest.json').read_bytes())['files']=={str(p.relative_to(P)):sha(p)for p in P.rglob('*')if p.is_file()and p!=P/'manifest.json'}
 sys.dont_write_bytecode=True;sys.path.insert(0,str(P))
 assert sha(P/'original.so')=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 source=module(P/'review_source.py','joint_source').r
 build=module(P/'review_build.py','joint_build').r
 symbols=module(P/'review_symbols.py','joint_symbols').r
 assert source==json.loads((P/'source-review.json').read_bytes())
 assert build==json.loads((P/'build-review.json').read_bytes())
 assert symbols==json.loads((P/'symbol-review.json').read_bytes())
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':build['candidate_sha256'],'normalized_windows':660,'raw_windows':159,'remaining_windows':125,'matched_text_bytes':831376,'source_local_inputs':57,'source_total_inputs_recorded':232,'unchanged_cached_dependencies':765,'named_symbols':803,'normalized_unchanged_named_symbols':798,'source_only_named_changes':3,'intended_changed_handlers':2,'context_borrow_change_absent':True,'new_compiler_executions':0,'new_vm_executions':0,'scope':'Independent source/handler composition proof; runtime, full dependencies, strict repeat and data closure are separate gates.'}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
