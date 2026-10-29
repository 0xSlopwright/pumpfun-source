"""Two normal false-whitelist SellV3 regression controls, with distinct signed inputs."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
 proof=json.loads((W/'DEDUP01.json').read_text());assert proof['new_distinct_cases']==2 and all(t['admit_as_new']for t in proof['targets'])
 plan=json.loads((W/'PLAN01.json').read_text());assert sha(W/'PLAN01.json')=='38879cb2c73407984ae7cc852416d6e3f94114cf5ed653d097b0e5da16ab0c9b'
 runner=R/'work/parallel-main-positive-sync-fixtures/run_cases.py';assert sha(runner)==plan['source_inputs'][str(runner.relative_to(R))]
 spec=importlib.util.spec_from_file_location('reviewed_sell_regression',runner);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
 rows=[]
 for c in plan['cases']:
  o=h.run(R/'evidence/original/pump/deployed.so',c);n=h.run(a.candidate,c)
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']and o['signature_verified']and n['signature_verified']
  diff=[k for k in['error','accounts','inner_instructions','event_payloads','return_data']if o[k]!=n[k]]
  if h.log_oracle.scope(h.log_oracle.norm(o['logs']))!=h.log_oracle.scope(h.log_oracle.norm(n['logs'])):diff.append('ordered_logs')
  e=h.expected(c,o)
  if not(e.get('original_success')and e.get('post_base_balances_expected')and e.get('eligible')is False and e.get('matches_formula')and e.get('virtual_quote')==e.get('no_sync_virtual_quote')):diff.append('original_nonwhite_control')
  rows.append({'case':c,'original':o,'candidate':n,'different_fields':diff,'sync_conditions':e})
 assert len(rows)==2
 report={'scope':__doc__,'case_count':2,'cases':rows,'mismatches':[i for i,r in enumerate(rows)if r['different_fields']],'candidate_sha256':sha(a.candidate),'original_sha256':sha(R/'evidence/original/pump/deployed.so'),'plan_sha256':sha(W/'PLAN01.json'),'dedup_sha256':sha(W/'DEDUP01.json')}
 a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0));print({'case_count':2,'mismatches':report['mismatches']});assert not report['mismatches']
if __name__=='__main__':main()
