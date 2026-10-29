"""Six source-proven distinct normal-balance SellV3 sync inputs; captured local programs only."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('positive_sync_fixture',W/'run_cases.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();proof=json.loads((W/'DEDUP-ADDENDUM02.json').read_text());assert proof['new_distinct_cases']==6;names=set(proof['admitted_names']);assert len(names)==6;rows=[]
 for c in h.PLAN['cases']:
  if c['name']not in names:continue
  o=h.run(R/'evidence/original/pump/deployed.so',c);n=h.run(a.candidate,c)
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']and o['signature_verified']and n['signature_verified']
  diff=[k for k in ['error','accounts','inner_instructions','event_payloads','return_data']if o[k]!=n[k]]
  if h.log_oracle.scope(h.log_oracle.norm(o['logs']))!=h.log_oracle.scope(h.log_oracle.norm(n['logs'])):diff.append('ordered_logs')
  e=h.expected(c,o)
  if not(e.get('original_success')and e.get('post_base_balances_expected')and e.get('eligible')==c['expected_sync_update']and e.get('matches_formula')and(e.get('positive_change_observed')if c['expected_sync_update']else True)):diff.append('original_sync_conditions')
  rows.append({'case':c,'original':o,'candidate':n,'different_fields':diff,'sync_conditions':e})
 assert len(rows)==6
 report={'scope':__doc__,'case_count':len(rows),'cases':rows,'mismatches':[i for i,r in enumerate(rows)if r['different_fields']],'candidate_sha256':sha(a.candidate),'original_sha256':sha(R/'evidence/original/pump/deployed.so'),'fixture_sha256':sha(W/'run_cases.py'),'dedup_sha256':sha(W/'DEDUP-ADDENDUM02.json')};a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0));print({'case_count':len(rows),'mismatches':report['mismatches']});assert not report['mismatches']
if __name__=='__main__':main()
