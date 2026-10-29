"""Conservatively qualify the two actual false-whitelist inputs against all prior inputs."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('v3_dedup_helpers',R/'work/parallel-main-v3-buy-positive-sync-fixtures/dedup01.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()

def main():
 path=W/'RESULT01.json.gz';result=json.loads(gzip.decompress(path.read_bytes()));assert result['case_count']==2 and not result['mismatches']and not result['not_as_expected']
 targets=[]
 for row in result['cases']:
  o=row['original'];tx=base64.b64decode(o['transaction_base64']);state=h.state(o['full_before']);assert h.complete(state)
  targets.append({'name':row['case']['name'],'transaction_sha256':hashlib.sha256(tx).hexdigest(),'state':state,'clock':o['clock'],'readonly':h.readonly(tx),'collisions':[]})
 assert targets[0]['transaction_sha256']!=targets[1]['transaction_sha256']
 paths=[(R/'work/parallel-main-integration/round45-captured-full.json.gz',10468),(R/'work/parallel-main-integration/round45-captured-additional.json.gz',7643),(R/'work/parallel-main-positive-sync-fixtures/RESULT01.json.gz',8),(R/'work/parallel-main-v2-positive-sync-fixtures/RESULT01.json.gz',12),(R/'work/parallel-main-v3-buy-positive-sync-fixtures/RESULT01.json.gz',8)]
 baseline=[]
 for prior,expected in paths:
  count=0
  for ordinal,where,row in h.input_rows(prior):
   count+=1;o=row['original'];txhash=hashlib.sha256(base64.b64decode(o['transaction_base64'])).hexdigest()
   for t in targets:
    if txhash!=t['transaction_sha256']:continue
    state=h.state(o.get('full_before',o.get('before')));diff=h.differences(state,t['state'])
    if isinstance(o.get('clock'),dict)and o['clock']!=t['clock']:diff.append({'address':'<Clock>','field':'clock'})
    after=h.state(o.get('accounts'))or{};readonly={key:after[key]for key in t['readonly']if key in after};ro_diff=h.differences(readonly,t['state'])
    status='distinct'if diff or ro_diff else'duplicate'if h.complete(state)and state==t['state']and o.get('clock')==t['clock']else'unknown'
    t['collisions'].append({'path':str(prior.relative_to(R)),'ordinal':ordinal,'row':where,'status':status,'different_fields':diff,'readonly_different_fields':ro_diff})
  assert count==expected
  baseline.append({'path':str(prior.relative_to(R)),'sha256':sha(prior),'cases':count})
 for t in targets:
  t['prestate_sha256']=hashlib.sha256(json.dumps(t.pop('state'),sort_keys=True,separators=(',',':')).encode()).hexdigest();t.pop('readonly');t['admit_as_new']=all(c['status']=='distinct'for c in t['collisions'])
 report={'status':'conservative_dedup_complete','new_distinct_cases':sum(t['admit_as_new']for t in targets),'existing_cases':sum(n for _,n in paths),'targets':targets,'inputs':baseline,'result_sha256':sha(path),'script_sha256':sha(Path(__file__)),'helper_sha256':sha(R/'work/parallel-main-v3-buy-positive-sync-fixtures/dedup01.py')}
 (W/'DEDUP01.json').write_text(json.dumps(report,indent=2)+'\n');print({'existing_cases':report['existing_cases'],'new_distinct_cases':report['new_distinct_cases'],'collisions':[len(t['collisions'])for t in targets]})
if __name__=='__main__':main()
