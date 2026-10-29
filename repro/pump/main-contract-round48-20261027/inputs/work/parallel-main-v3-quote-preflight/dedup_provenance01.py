"""Read-only provenance and input dedup for four already-executed quote controls."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
spec=importlib.util.spec_from_file_location('input_compare',R/'work/parallel-main-v3-buy-positive-sync-fixtures/dedup01.py');h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)

def main():
 result_path=W/'BASELINE01.json.gz';plan_path=W/'FIXTURE-PLAN01.json'
 assert sha(result_path)=='ab23628c803f8aebfbaebd0a89b24b176176c2910e985e94c874869c6f8b9560'
 assert sha(plan_path)=='2d5000e018032bbe268ad11c0a3da4b13547b3f35ff2c117115cde4b0facb0eb'
 result=json.loads(gzip.decompress(result_path.read_bytes()));plan=json.loads(plan_path.read_text());assert result['case_count']==4
 old_manifest=R/'work/parallel-main-integration/unified-main-corpus-round46.json';manifest=R/'work/parallel-main-integration/unified-main-corpus-round47.json'
 old=json.loads(old_manifest.read_text());current=json.loads(manifest.read_text())
 assert old['counts']=={'full':10468,'additional':7643}and current['counts']=={'full':10468,'additional':7677}
 for key,value in old['definition_sha256'].items():assert current['definition_sha256'][key]==value,key
 assert current['suites'][:len(old['suites'])]==old['suites']
 for key,value in current['definition_sha256'].items():assert sha(R/key)==value,key
 fixture_path=R/plan['base_fixture'];fixture=json.loads(fixture_path.read_text());assert sha(fixture_path)==plan['base_fixture_sha256'];captured=fixture['steps'][plan['base_step']]['before']
 targets=[]
 for row in result['cases']:
  c=row['case'];o=row['original'];n=row['candidate'];tx=base64.b64decode(o['transaction_base64']);state=h.state(o['full_before']);assert h.complete(state)
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']
  assert o['signature_verified']and n['signature_verified']
  base_preserved={}
  for name in['mint','curve_base','user_base']:
   key=fixture['accounts'][name];a=o['full_before'][key];b=captured[name]
   base_preserved[name]=a['owner']==b['owner']and a['lamports']==b['lamports']and bytes(a['data'])==base64.b64decode(b['data_base64'])and not a['executable']
  assert all(base_preserved.values())
  keys=o['instruction_account_keys'];assert (keys[7]==keys[10])==c['replace_quote_user_with_quote_curve']
  for account_key in[keys[7],keys[10]]:
   account=o['full_before'][account_key];assert account['owner']=='TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'and not account['executable']
  targets.append({'name':c['name'],'case':c,'state':state,'clock':o['clock'],'transaction_sha256':hashlib.sha256(tx).hexdigest(),'readonly':h.readonly(tx),'base_accounts_preserved':base_preserved,'observed_baseline':row['observed'],'exact':[],'different':[],'unknown':[]})
 def compare(row,ref):
  o=row['original'];txhash=hashlib.sha256(base64.b64decode(o['transaction_base64'])).hexdigest()
  for t in targets:
   if txhash!=t['transaction_sha256']:continue
   state=h.state(o.get('full_before',o.get('before')));diff=h.differences(state,t['state'])
   if isinstance(o.get('clock'),dict)and o['clock']!=t['clock']:diff.append({'address':'<Clock>','field':'clock'})
   after=h.state(o.get('accounts'))or{};readonly={key:after[key]for key in t['readonly']if key in after};ro_diff=h.differences(readonly,t['state'])
   if diff or ro_diff:t['different'].append(dict(ref,fields=diff,readonly_fields=ro_diff))
   elif h.complete(state)and state==t['state']and o.get('clock')==t['clock']:t['exact'].append(ref)
   else:t['unknown'].append(ref)
 inputs=[];total=0
 for group,count in[('full',10468),('additional',7643)]:
  p=R/f'work/parallel-main-integration/round45-captured-{group}.json.gz';n=0
  for ordinal,where,row in h.records(p):n+=1;compare(row,{'group':group,'row':where,'source':str(p.relative_to(R)),'ordinal':ordinal})
  assert n==count;total+=n;inputs.append({'path':str(p.relative_to(R)),'sha256':sha(p),'cases':n})
 new=[('sell_v3_positive_sync','parallel-main-positive-sync-fixtures',6),('v3_buy_positive_sync','parallel-main-v3-buy-positive-sync-fixtures',8),('sell_v3_nonwhite_sync_controls','parallel-main-positive-sync-nonwhite-controls',2),('v2_positive_sync','parallel-main-v2-positive-sync-fixtures',12),('legacy_positive_sync','parallel-main-legacy-positive-sync-fixtures',6)]
 for suite,folder,count in new:
  p=R/'work'/folder/'RESULT01.json.gz';obj=json.loads(gzip.decompress(p.read_bytes()));rows=obj['cases']
  if count==6 and suite=='sell_v3_positive_sync':
   admitted=set(json.loads((p.parent/'DEDUP-ADDENDUM02.json').read_text())['admitted_names']);rows=[r for r in rows if r['case']['name']in admitted]
  assert len(rows)==count
  for i,row in enumerate(rows):compare(row,{'group':'additional','row':f'{suite}/cases/{i}','source':str(p.relative_to(R)),'ordinal':i})
  total+=len(rows);inputs.append({'path':str(p.relative_to(R)),'sha256':sha(p),'admitted_cases':len(rows)})
 assert total==18145
 for t in targets:
  t['prestate_sha256']=hashlib.sha256(json.dumps(t.pop('state'),sort_keys=True,separators=(',',':')).encode()).hexdigest();t.pop('readonly')
  t['admit_as_new']=not t['exact']and not t['unknown'];t['status']='duplicate'if t['exact']else'unknown'if t['unknown']else'distinct'
 report={'status':'read_only_dedup_provenance_complete','existing_r47_inputs':total,'qualification_definitions':4,'new_distinct_cases':sum(t['admit_as_new']for t in targets),'targets':targets,'baseline_candidate_sha256':result['candidate_sha256'],'source_candidate_executed':False,'input_sha256':{str(p.relative_to(R)):sha(p)for p in[result_path,plan_path,manifest,old_manifest,Path(__file__),R/'work/parallel-main-v3-buy-positive-sync-fixtures/dedup01.py',R/'work/parallel-main-v3-quote-preflight/run_baseline01.py']},'retained_inputs':inputs,'limits':['R47 actual final aggregate is still being captured; this scan binds its frozen definition manifest, unchanged prior18111 input receipts and all34 admitted qualification inputs.','Four baseline controls were executed previously by the source owner; this audit performs no VM or transaction.','Duplicate controls remain useful qualification evidence and are excluded from future added-case counts.','Any compatible missing historical prestate remains unresolved and is not counted as new.']}
 (W/'DEDUP-PROVENANCE01.json').write_text(json.dumps(report,indent=2)+'\n');print({'new_distinct_cases':report['new_distinct_cases'],'targets':[{'name':t['name'],'status':t['status'],'exact':len(t['exact']),'unknown':len(t['unknown']),'different':len(t['different'])}for t in targets]})
if __name__=='__main__':main()
