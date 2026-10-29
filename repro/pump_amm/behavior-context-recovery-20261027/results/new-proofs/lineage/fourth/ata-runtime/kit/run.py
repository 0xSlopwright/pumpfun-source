"""Fresh signed60-case replay using the sealed producer and authenticated repository inputs."""
from pathlib import Path
import argparse,hashlib,importlib.metadata,json,os,shutil,subprocess,sys,tempfile,types
sys.dont_write_bytecode=True
H=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--repo-root',type=Path,required=True);p.add_argument('--expected-bad',type=int,default=0);a=p.parse_args();candidate=a.candidate.resolve();out=a.output.resolve();root=a.repo_root.resolve();assert not out.exists()
 m=types.ModuleType('checked_verify');m.__file__=str(H/'verify.py');exec(compile((H/'verify.py').read_bytes(),m.__file__,'exec'),m.__dict__);m.check_inventory(H);spec=json.loads((H/'runtime-inputs.json').read_text());inputs=spec;before={k:sha(root/k)for k in inputs};assert before==inputs;candidate_before=sha(candidate);out.mkdir()
 with tempfile.TemporaryDirectory(prefix='amm-recipient-replay-',dir=root/'work')as temp:
  stage=Path(temp);shutil.copy2(H/'probe.py',stage/'probe.py');shutil.copy2(H/'observer.py',stage/'observer.py');cache=stage/'empty';env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1',PYTHONPYCACHEPREFIX=str(cache));cmd=[sys.executable,'-B',str(stage/'observer.py'),str(out/'transactions.json.gz'),str(stage/'probe.py'),'--candidate',str(candidate),'--output',str(out/'report.json.gz')]
  with(out/'runtime.log').open('wb')as log:r=subprocess.run(cmd,cwd=root,env=env,stdout=log,stderr=subprocess.STDOUT)
  assert r.returncode==0 and not cache.exists()
 after={k:sha(root/k)for k in inputs};assert after==before and sha(candidate)==candidate_before
 record={'runtime_executed':True,'command':cmd,'candidate_sha256':candidate_before,'candidate_after_sha256':sha(candidate),'inputs_before':before,'inputs_after':after,'python_executable':sys.executable,'solders_version':importlib.metadata.version('solders'),'bytecode_cache_initially_absent_and_not_written':True,'packet_manifest_sha256':sha(H/'manifest.json'),'expected_bad':a.expected_bad};(out/'run.json').write_text(json.dumps(record,indent=2)+'\n');result=m.verify_output(H,candidate,out,a.expected_bad);result={k:v for k,v in result.items()if k not in ['messages','originals']};(out/'verification.json').write_text(json.dumps(result,indent=2)+'\n')
 shutil.copytree(H,out/'kit',copy_function=shutil.copy2)
 shutil.copy2(H/'verify_saved.py',out/'verify.py')
 evidence={str(p.relative_to(out)):sha(p)for p in out.rglob('*')if p.is_file()and p!=out/'evidence-manifest.json'}
 (out/'evidence-manifest.json').write_text(json.dumps({'files':evidence},indent=2)+'\n')
 print(json.dumps(result,indent=2))
if __name__=='__main__':main()
