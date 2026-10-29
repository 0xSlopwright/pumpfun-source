"""Conservative static input deduplication for the eight completed V3-buy pairs."""
from pathlib import Path
import base64, gzip, hashlib, json, sys
from solders.transaction import VersionedTransaction

R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'))
from paired_receipt_reader import records
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()

def account(a):
 if a is None:return None
 out={k:a[k]for k in['owner','lamports','executable','rent_epoch']if k in a}
 options=set()
 if isinstance(a.get('data_sha256'),str):options.add(a['data_sha256'])
 for field,decoder in [('data_hex',bytes.fromhex),('data_base64',lambda x:base64.b64decode(x,validate=True))]:
  if isinstance(a.get(field),str):options.add(hashlib.sha256(decoder(a[field])).hexdigest())
 data=a.get('data')
 if isinstance(data,list):options.add(hashlib.sha256(bytes(data)).hexdigest())
 elif isinstance(data,str):
  # Untagged old string snapshots can be hex or base64; retain every valid
  # interpretation and prove a difference only if none overlap.
  for decoder in[bytes.fromhex,lambda x:base64.b64decode(x,validate=True)]:
   try:options.add(hashlib.sha256(decoder(data)).hexdigest())
   except ValueError:pass
 if options:out['data_sha256']=sorted(options)
 return out

def state(raw):
 if not isinstance(raw,dict):return None
 return{str(a.get('address',k))if isinstance(a,dict)else str(k):account(a)for k,a in raw.items()}

def differences(a,b):
 if a is None or b is None:return[]
 differences=[]
 for key in a.keys()&b.keys():
  x,y=a[key],b[key]
  if x is None or y is None:
   if x!=y:differences.append({'address':key,'field':'presence'})
   continue
  for field in x.keys()&y.keys():
   unequal=not(set(x[field])&set(y[field]))if field=='data_sha256'else x[field]!=y[field]
   if unequal:differences.append({'address':key,'field':field})
 return differences

def readonly(tx):
 message=VersionedTransaction.from_bytes(tx).message;header=message.header;n=len(message.account_keys)
 return[str(key)for i,key in enumerate(message.account_keys)if not(i<header.num_required_signatures-header.num_readonly_signed_accounts if i<header.num_required_signatures else i<n-header.num_readonly_unsigned_accounts)]

def complete(s):
 return s is not None and all(a is None or set(a)>={'owner','lamports','executable','data_sha256'}for a in s.values())

def input_rows(path):
 if path.parent.name=='parallel-main-integration':
  yield from records(path)
 else:
  local=json.loads(gzip.decompress(path.read_bytes()))
  for ordinal,row in enumerate(local['cases']):yield ordinal,f'cases/{ordinal}',row

def main():
 result_path=W/'RESULT01.json.gz';result=json.loads(gzip.decompress(result_path.read_bytes()))
 assert result['case_count']==8 and not result['mismatches']and not result['not_as_expected']
 targets=[]
 for row in result['cases']:
  o=row['original'];tx=base64.b64decode(o['transaction_base64']);s=state(o['full_before'])
  assert complete(s)
  targets.append({'name':row['case']['name'],'transaction_sha256':hashlib.sha256(tx).hexdigest(),'state':s,'clock':o['clock'],'readonly':readonly(tx),'exact':[],'conflicts':[],'ambiguous':[]})
 paths=[(R/'work/parallel-main-integration/round45-captured-full.json.gz',10468),(R/'work/parallel-main-integration/round45-captured-additional.json.gz',7643),(R/'work/parallel-main-positive-sync-fixtures/RESULT01.json.gz',8),(R/'work/parallel-main-v2-positive-sync-fixtures/RESULT01.json.gz',12),(result_path,8)]
 baseline=[]
 for path,expected in paths:
  total=0
  for ordinal,where,row in input_rows(path):
   total+=1;o=row['original'];txhash=hashlib.sha256(base64.b64decode(o['transaction_base64'])).hexdigest();s=state(o.get('full_before',o.get('before')))
   for t in targets:
    # The last file proves pairwise uniqueness, not novelty versus itself.
    if path==result_path and row['case']['name']==t['name']:continue
    if txhash!=t['transaction_sha256']:continue
    ref={'path':str(path.relative_to(R)),'row':where,'ordinal':ordinal}
    diff=differences(s,t['state'])
    if isinstance(o.get('clock'),dict)and o['clock']!=t['clock']:diff.append({'address':'<Clock>','field':'clock'})
    if diff:ref['fields']=diff;t['conflicts'].append(ref);continue
    after=state(o.get('accounts'))or{}
    ro={key:after[key]for key in t['readonly']if key in after}
    diff=differences(ro,t['state'])
    if diff:ref['readonly_postimage_fields']=diff;t['conflicts'].append(ref);continue
    if complete(s)and s==t['state']and o.get('clock')==t['clock']:t['exact'].append(ref)
    else:ref['reason']='Compatible or absent old prestate; no decisive field difference';t['ambiguous'].append(ref)
  assert total==expected,(path,total,expected)
  baseline.append({'path':str(path.relative_to(R)),'sha256':sha(path),'cases':total,'role':'pairwise_new_inputs'if path==result_path else'retained_prior_inputs'})
 for t in targets:
  t['prestate_sha256']=hashlib.sha256(json.dumps(t.pop('state'),sort_keys=True,separators=(',',':')).encode()).hexdigest();t.pop('readonly');t['admit_as_new']=not t['exact']and not t['ambiguous']
 report={'status':'completed_conservative_scan','new_distinct_cases':sum(t['admit_as_new']for t in targets),'existing_cases':18131,'pairwise_new_cases':8,'targets':targets,'inputs':baseline,'script_sha256':sha(Path(__file__)),'rules':['No transaction collision is a direct distinct-input proof.','Matching transactions require a different mutually observed prestate/Clock field or immutable readonly postimage.','Untagged hex/base64 strings retain all valid interpretations; disjoint data-hash sets prove difference.','Missing compatible old state remains unknown and is excluded from new-case claims.']}
 (W/'DEDUP01.json').write_text(json.dumps(report,indent=2)+'\n')
 print({'new_distinct_cases':report['new_distinct_cases'],'targets':[{'name':t['name'],'admit_as_new':t['admit_as_new'],'exact':len(t['exact']),'conflicts':len(t['conflicts']),'ambiguous':len(t['ambiguous'])}for t in targets]})
if __name__=='__main__':main()
