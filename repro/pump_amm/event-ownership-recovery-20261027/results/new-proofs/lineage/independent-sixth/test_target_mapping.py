from pathlib import Path
import json,tempfile,types
W=Path(__file__).resolve().parent;D=W/'results/dependency-proof';p=D/'verify.py';m=types.ModuleType('dependency');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__)
record=json.loads((W/'results/build/build-comparison.json').read_bytes());checks=[]
with tempfile.TemporaryDirectory(prefix='amm-sixth-target-negative-')as td:
 for name in ['missing_mount','wrong_logical_target']:
  bad=json.loads(json.dumps(record))
  if name=='missing_mount':
   physical=Path(bad['strip_command'][2]).parents[2];mount=str(physical)+':'+bad['environment']['CARGO_TARGET_DIR']+':rw';index=bad['command'].index(mount);assert bad['command'][index-1]=='-v';del bad['command'][index-1:index+1]
  else:bad['environment']['CARGO_TARGET_DIR']+='/not-the-mounted-target'
  q=Path(td)/(name+'.json');q.write_text(json.dumps(bad))
  try:m.verify(W/'results/canonical-source',q,proof_root=D)
  except AssertionError as e:
   assert 'Target cache mount' in str(e);checks.append({'name':name,'rejected':True})
  else:raise AssertionError(name+' was accepted')
print(json.dumps({'passed':True,'cases':checks},indent=2))
