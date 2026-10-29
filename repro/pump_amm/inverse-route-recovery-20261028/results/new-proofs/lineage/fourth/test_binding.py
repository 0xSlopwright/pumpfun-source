from pathlib import Path
import copy,hashlib,json,tempfile,types
W=Path(__file__).resolve().parent;p=W/'verify_binding.py';m=types.ModuleType('binding');exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__)
a=json.loads((W/'build/build-comparison.json').read_bytes());expected=a['source_sha256'];mapping=json.loads((W/'build-input-binding.json').read_bytes())['inputs'];m.verify_inputs(W,expected,mapping);checks=[]
def reject(label,bad):
 try:m.verify_inputs(W,expected,bad)
 except AssertionError:checks.append(label);return
 raise AssertionError('failed to reject '+label)
bad=copy.deepcopy(mapping);del bad[next(iter(bad))];reject('missing input',bad)
bad=copy.deepcopy(mapping);bad['extra-input']=next(iter(bad.values()));reject('extra input',bad)
for prefix,label in [('source/','changed Rust source'),('dependency-inputs/','changed registry source')]:
 name=next(n for n,row in mapping.items()if row['archive_path'].startswith(prefix)and row['archive_path'].endswith('.rs'))
 with tempfile.TemporaryDirectory(prefix='negative-',dir=W)as temp:
  q=Path(temp)/'changed.rs';q.write_bytes((W/mapping[name]['archive_path']).read_bytes()+b'\n// negative binding control\n');bad=copy.deepcopy(mapping);bad[name]['archive_path']=str(q.relative_to(W));reject(label,bad)
print(json.dumps({'passed':True,'rejected':checks,'source_inputs':len(expected)},indent=2))
