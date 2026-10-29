"""Distinct ordinary quote-preflight controls; records the remaining known filename-only gap."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--all-controls',action='store_true');a=p.parse_args()
 proof=json.loads((W/'DEDUP-PROVENANCE01.json').read_text());assert proof['existing_r47_inputs']==18145
 names={t['name']for t in proof['targets']if t['admit_as_new']}
 plan=json.loads((W/'FIXTURE-PLAN01.json').read_text());assert sha(W/'FIXTURE-PLAN01.json')=='2d5000e018032bbe268ad11c0a3da4b13547b3f35ff2c117115cde4b0facb0eb'
 spec=importlib.util.spec_from_file_location('quote_inputs',W/'quote_control_inputs.py');q=importlib.util.module_from_spec(spec);spec.loader.exec_module(q);h=q.fixture();rows=[]
 for c in plan['cases']:
  if not a.all_controls and c['name']not in names:continue
  o=q.run(h,R/'evidence/original/pump/deployed.so',c,plan);n=q.run(h,a.candidate,c,plan)
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']and o['signature_verified']and n['signature_verified']
  diff=[k for k in['error','accounts','inner_instructions','event_payloads','return_data']if o[k]!=n[k]]
  left=h.log_oracle.scope(h.log_oracle.norm(o['logs']));right=h.log_oracle.scope(h.log_oracle.norm(n['logs']));known_gap=False
  if left!=right:
   # The source proposal corrects the precedence counterexample. The sole
   # quote-authority control still exposes a previously recorded filename gap;
   # its error/code/keys and all observable state must nevertheless agree.
   family=h.log_oracle.classify(left,right)[0]if left is not None and right is not None else None
   expected_right=[line.replace('programs/pump/src/buy_v2.rs:<source>','programs/pump/src/trade_v3.rs:<source>')for line in left]if left is not None else None
   known_gap=c['name']=='sell-v3-token-quote-authority-only'and family=='source_file_path_only'and right==expected_right
   if not known_gap:diff.append('ordered_logs')
  if not q.rollback(h,o)or not q.rollback(h,n):diff.append('nonfee_rollback')
  rows.append({'case':c,'original':o,'candidate':n,'different_fields':diff,'known_filename_only_gap':known_gap})
 expected=4 if a.all_controls else proof['new_distinct_cases'];assert len(rows)==expected
 report={'scope':__doc__,'case_count':len(rows),'cases':rows,'mismatches':[i for i,r in enumerate(rows)if r['different_fields']],'known_filename_only_rows':[i for i,r in enumerate(rows)if r['known_filename_only_gap']],'candidate_sha256':sha(a.candidate),'original_sha256':sha(R/'evidence/original/pump/deployed.so'),'plan_sha256':sha(W/'FIXTURE-PLAN01.json'),'dedup_sha256':sha(W/'DEDUP-PROVENANCE01.json'),'definition_sha256':sha(W/'quote_control_inputs.py'),'limits':['One pre-existing quote-authority filename-only gap is reported explicitly; differing codes, keys, state or ordering fail.','--all-controls includes the duplicate valid qualification input and must not add that input to corpus counts.']}
 a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),compresslevel=1,mtime=0));print({'case_count':len(rows),'mismatches':report['mismatches'],'known_filename_only_rows':report['known_filename_only_rows']});assert not report['mismatches']
if __name__=='__main__':main()
