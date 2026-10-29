"""Run the unchanged45-case recipient probe with pinned inputs and an empty bytecode cache."""
from pathlib import Path
import argparse,hashlib,importlib.metadata,json,os,subprocess,sys,tempfile
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;R=W.parents[1]
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();spec=json.loads((W/'runtime-inputs.json').read_text());inputs={**spec['repository_inputs'],**spec['runtime_binary_inputs']};before={k:sha(R/k)for k in inputs};assert before==inputs
 local={n:sha(W/n)for n in ['probe_expanded.py','run_expanded.py','verify_expanded.py','negative-packet/observer.py','negative-packet/cleaner.py']};candidate_before=sha(candidate);out.mkdir()
 with tempfile.TemporaryDirectory(prefix='amm-recipient-pycache-',dir=R/'work')as temp:
  cache=Path(temp)/'empty';env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1',PYTHONPYCACHEPREFIX=str(cache));cmd=[sys.executable,'-B',str(W/'negative-packet/observer.py'),str(out/'transactions.json.gz'),str(W/'probe_expanded.py'),'--candidate',str(candidate),'--output',str(out/'report.json.gz')]
  with(out/'runtime.log').open('wb')as log:result=subprocess.run(cmd,cwd=R,env=env,stdout=log,stderr=subprocess.STDOUT)
  assert result.returncode==0;assert not cache.exists()
 after={k:sha(R/k)for k in inputs};assert after==before;assert sha(candidate)==candidate_before;assert local=={n:sha(W/n)for n in local}
 record={'runtime_executed':True,'command':cmd,'candidate_sha256':candidate_before,'candidate_after_sha256':sha(candidate),'inputs_before':before,'inputs_after':after,'local_sources':local,'python_executable':sys.executable,'solders_version':importlib.metadata.version('solders'),'bytecode_cache_initially_absent_and_not_written':True};(out/'run.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps({'candidate_sha256':candidate_before,'returncode':0,'output':str(out)}))
if __name__=='__main__':main()
