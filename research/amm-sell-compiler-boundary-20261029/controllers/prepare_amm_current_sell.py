from pathlib import Path
import hashlib, importlib.util, json, shutil, subprocess
W=Path(__file__).resolve().parent;R=W/'pumpfun-source';D=W/'amm-current-sell-controls'
assert not D.exists();D.mkdir()
def sha(b):return hashlib.sha256(b).hexdigest()
def mod(n,p):
 s=importlib.util.spec_from_file_location(n,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
reader=mod('checkpoint_modules',R/'scripts/amm_checkpoint_modules.py')
packet=R/'research/amm-layout-closure-20261028'
recipe=reader.load('recipe',packet/'workspace_recipe.py',R)
inputs,workspace=recipe.expected_workspace(R)
binding=json.loads((packet/'results/build-a/source-binding.json').read_text())
assert {n:sha(b) for n,b in inputs.items()}==binding['input_sha256']
assert {n:sha(b) for n,b in workspace.items()}==binding['workspace_sha256']
records=[];rev='a18e1e89b59bf9d734955550c92f321c97c95e62'
for name,b in inputs.items():
 git=subprocess.check_output(['git','-C',str(R),'show',rev+':'+name]);assert git==b
 records.append({'path':name,'sha256':sha(b),'git_blob':hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()})
for name,b in workspace.items():
 p=D/'source'/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(b)
for n in ['build.py','inspect.py','trace.py']:shutil.copyfile(W/'amm-cashback-controls'/n,D/n)
shutil.copyfile(packet/'results/build-a/symbols.so',D/'upstream-symbols.so')
shutil.copyfile(packet/'results/build-a/candidate.so',D/'upstream-candidate.so')
(D/'source-binding.json').write_bytes((json.dumps({'revision':rev,'source_inputs':records,'workspace_sha256':binding['workspace_sha256'],'input_sha256':binding['input_sha256'],'upstream_candidate_sha256':sha((D/'upstream-candidate.so').read_bytes()),'upstream_symbols_sha256':sha((D/'upstream-symbols.so').read_bytes()),'recipe_sha256':sha((packet/'workspace_recipe.py').read_bytes()),'portable_reader_sha256':sha((R/'scripts/amm_checkpoint_modules.py').read_bytes()),'scope':'68 current maintained inputs ->69 workspace inputs using reviewed mapper. Independent Windows v1.44 compiler and Linux target libs with default linker order; not the selected Linux explicit-layout build. No target execution.'},indent=2)+'\n').encode())
print('Prepared',D,len(inputs),len(workspace))
