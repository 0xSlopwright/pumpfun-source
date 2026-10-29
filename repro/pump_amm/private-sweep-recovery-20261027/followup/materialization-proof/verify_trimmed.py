from pathlib import Path
import ast,hashlib,importlib.util,json,time
W=Path(__file__).resolve().parent;R=W.parents[1];C=W/'checkpoint';D=C/'results';H=R/'repro/pump_amm/incentive-order-recovery-20261027'
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
source=json.loads((W/'inventory.json').read_bytes());reference_inputs=json.loads((W/'reference-inputs.json').read_bytes())
reference=reference_inputs['saved_verification'];out={}
summary=next(x for x in ast.walk(ast.parse((C/'verify_saved.py').read_text()))if isinstance(x,ast.Dict)and any(isinstance(k,ast.Constant)and k.value=='current_source_checked'for k in x.keys))
overrides={k.value for k in summary.keys if isinstance(k,ast.Constant)}
for key,file in [('expanded','verify_new_proofs.py'),('recovery','verify_recovery.py')]:
 assert sha(C/file)==reference_inputs['root_verifier_sha256'][file]
 started=time.monotonic();value=module('private_'+key,C/file).verify(D,D/'build/candidate.so',R)
 for field,expected in value.items():
  if field not in overrides:assert reference[field]==expected,(key,field,reference.get(field),expected)
 out[key]={'seconds':time.monotonic()-started,'result':value,'verifier_sha256':sha(C/file),'root_summary_override_fields':sorted(set(value)&overrides)}
 print(json.dumps({'component':key,'seconds':out[key]['seconds'],'passed':True}),flush=True)
out['no_original_checkpoint_fallback']='Enforced by inherited audit hook'
(W/'component-verification.json').write_text(json.dumps(out,indent=2)+'\n');print('Both unchanged saved-verifier components passed.')
