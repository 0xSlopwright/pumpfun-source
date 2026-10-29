"""Run exactly two authorized normal false-whitelist controls on original/R47."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
 plan=json.loads((W/'PLAN01.json').read_text());assert sha(a.candidate)==plan['candidate_sha256'];assert len(plan['cases'])==2 and not a.output.exists()
 ready=json.loads((R/'work/parallel-main-v3-buy-positive-sync-fixtures/DEDUP01.json').read_text());assert ready['status']=='completed_conservative_scan'
 runner=R/'work/parallel-main-positive-sync-fixtures/run_cases.py';assert sha(runner)==plan['source_inputs'][str(runner.relative_to(R))]
 spec=importlib.util.spec_from_file_location('reviewed_sell_controls',runner);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
 original=R/'evidence/original/pump/deployed.so';rows=[]
 for c in plan['cases']:
  o=m.run(original,c);n=m.run(a.candidate,c)
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']
  different=[k for k in['error','accounts','inner_instructions','event_payloads','return_data']if o[k]!=n[k]]
  if m.log_oracle.scope(m.log_oracle.norm(o['logs']))!=m.log_oracle.scope(m.log_oracle.norm(n['logs'])):different.append('ordered_logs')
  e=m.expected(c,o);checks={'success':e.get('original_success')is True,'base_balances':e.get('post_base_balances_expected')is True,'no_sync':e.get('eligible')is False and e.get('virtual_quote')==e.get('no_sync_virtual_quote'),'matches_formula':e.get('matches_formula')is True}
  rows.append({'case':c,'original':o,'candidate':n,'different_fields':different,'expected_from_original_state':e,'checks':checks})
  print({'name':c['name'],'different_fields':different,'checks':checks,'virtual_quote':e.get('virtual_quote')},flush=True)
 report={'scope':__doc__,'case_count':2,'cases':rows,'candidate_sha256':sha(a.candidate),'original_sha256':sha(original),'plan_sha256':sha(W/'PLAN01.json'),'script_sha256':sha(Path(__file__)),'builder_sha256':sha(runner),'mismatches':[i for i,x in enumerate(rows)if x['different_fields']],'not_as_expected':[i for i,x in enumerate(rows)if not all(x['checks'].values())],'new_distinct_case_count':None}
 a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0));print({k:report[k]for k in['case_count','mismatches','not_as_expected']},flush=True)
if __name__=='__main__':main()
