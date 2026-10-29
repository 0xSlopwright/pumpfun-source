"""Five signed synthetic schedule controls; no RPC. Run from the repository root."""
import argparse,gzip,hashlib,importlib.util,json
from pathlib import Path
HERE=Path(__file__).resolve().parent
def run(candidate,output):
 s=importlib.util.spec_from_file_location('schedule_fixture',HERE/'fixture.py');h=importlib.util.module_from_spec(s);s.loader.exec_module(h)
 rows=[]
 for name,end,now,supply in [('negative-end',-1,0,1),('end-before-start',1,10,1),('active-control',49,10,1),('equality-control',1,20,1),('zero-supply',1,10,0)]:
  c=dict(instruction='admin_update_token_incentives',start=20,end=end,period=1,new_start=0,new_end=0,new_period=1,now=now,day=0,supply=supply)
  a,b=h.run(c),h.run(c,candidate)
  rows.append(dict(name=name,input=c,original=a,candidate=b,error_equal=a['error']==b['error']))
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
 inputs=['scripts/pump_amm_admin_differential.py','scripts/pump_amm_reusable_harness.py','evidence/original/pump_amm/deployed.so','evidence/upstream/pump_amm.json','research/imported-lab/analysis/pump_fun/config-snapshot.json']+[f'evidence/dependencies/{n}/deployed.so'for n in ['spl_token','spl_token_2022','associated_token']]
 result=dict(candidate_sha256=sha(candidate),original_sha256=sha(h.ORIGINAL),producer_sha256=sha(__file__),fixture_sha256=sha(HERE/'fixture.py'),inputs={n:sha(h.ROOT/n)for n in inputs},global_volume_account=str(h.G),cases=rows,scope='Five bounded synthetic AMM-owned schedule fixtures with ordinary verified local signatures. Executable-account data hashes bound per observation. No live-reachability, full-1730 replay, or compiler-run claim.')
 output.write_bytes(gzip.compress(json.dumps(result,separators=(',',':')).encode(),mtime=0))
 print(json.dumps(dict(cases=5,transactions=10,mismatches=sum(not r['error_equal']for r in rows),candidate_sha256=result['candidate_sha256'])))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();run(a.candidate.resolve(),a.output.resolve())
