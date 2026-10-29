from pathlib import Path
import hashlib,importlib.util,json,time
W=Path(__file__).resolve().parent;R=W.parents[1];C=W/'checkpoint';D=C/'results';L=D/'new-proofs/lineage';hidden=W/'hidden-controls';hidden.mkdir(exist_ok=True)
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
rows=[]
for component,name in [('verify_recovery.py','protocol-recipient'),('verify_new_proofs.py','route-guard-component')]:
 src=L/name;dst=hidden/name;assert src.is_dir()and not dst.exists();src.rename(dst);start=time.monotonic()
 try:
  module('negative_'+name,C/component).verify(D,D/'build/candidate.so',R)
 except FileNotFoundError as exc:
  assert Path(exc.filename)==src/'verify.py',(name,exc.filename)
  rows.append({'component':component,'removed_packet':name,'result':'required_packet_rejected','exception_type':type(exc).__name__,'missing_path':str(exc.filename),'seconds':time.monotonic()-start,'verifier_sha256':hashlib.sha256((C/component).read_bytes()).hexdigest()})
 else:raise AssertionError('Required packet removal was accepted: '+name)
 finally:dst.rename(src)
assert all((L/x['removed_packet']).is_dir()for x in rows)
(W/'negative-controls.json').write_text(json.dumps({'passed':True,'controls':rows,'private_packets_restored':True,'compiler_executions':0,'vm_executions':0},indent=2)+'\n');print(json.dumps(rows,indent=2))
