#!/usr/bin/env python3
"""Run existing signed incentive/accumulator suites against one candidate."""
from pathlib import Path
import argparse,concurrent.futures,hashlib,json,os,shutil,subprocess,sys
W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--root',type=Path,required=True);a=p.parse_args();root=a.root.resolve();candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();out.mkdir(parents=True);kit=out/'kit';kit.mkdir()
 for n in ['incentives.py','accumulator.py','edges.py','admin_fixture.py','observer.py','run_suites.py','verify_suites.py']:shutil.copy2(W/n,kit/n)
 paths=['scripts/pump_amm_admin_differential.py','scripts/pump_amm_reusable_harness.py','evidence/upstream/pump_amm.json','research/imported-lab/analysis/pump_fun/config-snapshot.json','evidence/original/pump_amm/deployed.so','evidence/dependencies/spl_token/deployed.so','evidence/dependencies/spl_token_2022/deployed.so','evidence/dependencies/associated_token/deployed.so'];inputs={n:sha(root/n)for n in paths};candidate_hash=sha(candidate)
 for n in paths:
  if n.endswith('.py')or n.endswith('.json'):
   dest=out/'inputs'/n;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(root/n,dest)
 cache=out/'unused-bytecode';cache.mkdir();env={**os.environ,'PYTHONDONTWRITEBYTECODE':'1','PYTHONPYCACHEPREFIX':str(cache),'PYTHONPATH':str(root/'scripts')}
 def run(group):
  source='incentives.py'if group in ['admin','sync','claim']else group+'.py';cmd=[sys.executable,'-B',str(kit/'observer.py'),str(out/(group+'-transactions.json.gz')),str(kit/source),'--candidate',str(candidate),'--output',str(out/(group+'.json'))]
  if group in ['admin','sync','claim']:cmd+=['--family',group]
  with(out/(group+'.log')).open('w')as log:r=subprocess.run(cmd,cwd=root,env=env,stdout=log,stderr=subprocess.STDOUT)
  return {'group':group,'returncode':r.returncode}
 with concurrent.futures.ThreadPoolExecutor(max_workers=3)as ex:results=list(ex.map(run,['admin','sync','claim','accumulator','edges']))
 assert not list(cache.iterdir());cache.rmdir();assert inputs=={n:sha(root/n)for n in paths}and candidate_hash==sha(candidate)
 record={'candidate_sha256':candidate_hash,'inputs':inputs,'groups':results,'files':{str(p.relative_to(out)):sha(p)for p in sorted(out.rglob('*'))if p.is_file()}};(out/'run.json').write_text(json.dumps(record,indent=2)+'\n');assert all(x['returncode']==0 for x in results),results
 ns={'__name__':'suite_verifier','__file__':str(kit/'verify_suites.py')};exec(compile((kit/'verify_suites.py').read_bytes(),str(kit/'verify_suites.py'),'exec'),ns);verified=ns['verify'](out,candidate,root);(out/'verification.json').write_text(json.dumps(verified,indent=2)+'\n');print(json.dumps(verified,indent=2))
if __name__=='__main__':main()
