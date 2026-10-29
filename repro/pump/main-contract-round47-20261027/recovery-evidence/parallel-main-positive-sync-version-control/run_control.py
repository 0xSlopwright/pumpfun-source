"""Replay only two already-reviewed SellV3 positives on the historical R44 binary."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,struct
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
 old=R/'work/parallel-main-integration/build-round44/candidate.so';baseline_path=R/'work/parallel-main-positive-sync-fixtures/RESULT01.json.gz';runner=R/'work/parallel-main-positive-sync-fixtures/run_cases.py'
 assert sha(old)=='89e1c533816c53effee670da298e8493a08085e92aefe23a89c6ef0bdc7d7af5'
 assert sha(baseline_path)=='d1bdd4581886de675b41d46d5221944362bffe43e565bba07c51c9ac838f2a9c'
 assert not a.output.exists()
 baseline=json.loads(gzip.decompress(baseline_path.read_bytes()));assert not baseline['mismatches']and not baseline['not_as_expected']
 spec=importlib.util.spec_from_file_location('reviewed_sell_sync',runner);mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
 rows=[]
 for row in baseline['cases']:
  c=row['case']
  if c['name']not in['native-positive','token-positive']:continue
  historical=mod.run(old,c);original=row['original'];current=row['candidate']
  assert historical['full_before']==original['full_before']==current['full_before']
  assert historical['clock']==original['clock']==current['clock']
  assert historical['transaction_base64']==original['transaction_base64']==current['transaction_base64']
  actual=bytes(historical['accounts'][str(mod.CURVE)]['data']);reference=bytes(original['accounts'][str(mod.CURVE)]['data'])
  old_vq=struct.unpack_from('<Q',actual,16)[0];original_vq=struct.unpack_from('<Q',reference,16)[0]
  no_sync=row['expected_from_original_state']['no_sync_virtual_quote']
  diff=[k for k in['error','accounts','inner_instructions','event_payloads','return_data']if historical[k]!=original[k]]
  same_other_curve_fields=actual[:16]==reference[:16]and actual[24:]==reference[24:]
  same_other_accounts=all(v==original['accounts'].get(k)for k,v in historical['accounts'].items()if k!=str(mod.CURVE))
  checks={'old_success':historical['error']is None,'old_no_sync':old_vq==no_sync,'original_updated':original_vq!=no_sync,'current_matches_original':current['accounts']==original['accounts'],'same_other_curve_fields':same_other_curve_fields,'same_other_accounts':same_other_accounts}
  rows.append({'name':c['name'],'reused_case':c,'historical_r44':historical,'original_and_r45_reference':{'path':str(baseline_path.relative_to(R)),'sha256':sha(baseline_path),'name':c['name']},'historical_virtual_quote':old_vq,'original_and_r45_virtual_quote':original_vq,'no_sync_virtual_quote':no_sync,'different_outcome_fields':diff,'checks':checks,'all_checks':all(checks.values())})
  print({'name':c['name'],'old_vq':old_vq,'fixed_vq':original_vq,'different_fields':diff,'checks':checks},flush=True)
 assert len(rows)==2
 report={'scope':__doc__,'case_count':2,'new_distinct_case_count':0,'historical_candidate_sha256':sha(old),'original_sha256':baseline['original_sha256'],'current_r45_candidate_sha256':baseline['candidate_sha256'],'baseline_result_sha256':sha(baseline_path),'source_runner_sha256':sha(runner),'script_sha256':sha(Path(__file__)),'version_comparisons':rows,'unexpected':[i for i,r in enumerate(rows)if not r['all_checks']],'limits':['Existing approved inputs only; no new case admission.','Two historical candidate VM executions. Original and corrected R45 outcomes reused from their exact signed-input receipt.','No source changes, live calls, owner/executable/authority mutations or extreme balances.']}
 a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0));print({'case_count':2,'new_distinct_case_count':0,'unexpected':report['unexpected']},flush=True)
if __name__=='__main__':main()
