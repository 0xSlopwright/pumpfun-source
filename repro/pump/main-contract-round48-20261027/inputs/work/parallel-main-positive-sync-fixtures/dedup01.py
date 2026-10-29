"""Conservatively deduplicate eight actual input states against the full frozen18111-case corpus."""
from pathlib import Path
from collections import Counter
import base64,gzip,hashlib,json,sys
from solders.transaction import VersionedTransaction
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'));from paired_receipt_reader import records
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def account(a):
 if a is None:return None
 out={k:a[k]for k in ['owner','lamports','executable','rent_epoch']if k in a}
 data=None
 if isinstance(a.get('data'),list):data=bytes(a['data'])
 elif isinstance(a.get('data_hex'),str):data=bytes.fromhex(a['data_hex'])
 elif isinstance(a.get('data_base64'),str):data=base64.b64decode(a['data_base64'])
 elif isinstance(a.get('data'),str):
  try:data=bytes.fromhex(a['data'])
  except ValueError:data=base64.b64decode(a['data'])
 if data is not None:out['data_sha256']=hashlib.sha256(data).hexdigest()
 elif isinstance(a.get('data_sha256'),str):out['data_sha256']=a['data_sha256']
 return out

def state(o):
 raw=o.get('full_before',o.get('before'))
 if not isinstance(raw,dict):return None
 return{str(a.get('address',k))if isinstance(a,dict)else str(k):account(a)for k,a in raw.items()if a is not None}
def differences(a,b):return[{'address':k,'field':f}for k in a.keys()&b.keys()for f in a[k].keys()&b[k].keys()if a[k][f]!=b[k][f]]
def readonly(txbytes):
 m=VersionedTransaction.from_bytes(txbytes).message;h=m.header;n=len(m.account_keys);result=[]
 for j,k in enumerate(m.account_keys):
  writable=j<h.num_required_signatures-h.num_readonly_signed_accounts if j<h.num_required_signatures else j<n-h.num_readonly_unsigned_accounts
  if not writable:result.append(str(k))
 return result

def main():
 p=W/'RESULT01.json.gz';r=json.loads(gzip.decompress(p.read_bytes()));assert r['case_count']==8 and not r['mismatches']and not r['not_as_expected']
 targets=[]
 for row in r['cases']:
  o=row['original'];s=state(o);tx=base64.b64decode(o['transaction_base64']);assert s and o['clock']==row['candidate']['clock'];t={'name':row['case']['name'],'transaction_sha256':hashlib.sha256(tx).hexdigest(),'prestate_sha256':hashlib.sha256(json.dumps(s,sort_keys=True,separators=(',',':')).encode()).hexdigest(),'clock':o['clock'],'state':s,'readonly':readonly(tx),'exact':[],'conflicts':[],'ambiguous':[]};targets.append(t)
 assert len({(t['transaction_sha256'],t['prestate_sha256'],json.dumps(t['clock'],sort_keys=True))for t in targets})==8
 count=0;with_prestate=0;paths=[]
 for g,n in [('full',10468),('additional',7643)]:
  path=R/f'work/parallel-main-integration/round45-captured-{g}.json.gz';paths.append(path);total=0
  for ordinal,where,row in records(path):
   total+=1;count+=1;o=row['original'];txhash=hashlib.sha256(base64.b64decode(o['transaction_base64'])).hexdigest();s=state(o);with_prestate+=s is not None
   for t in targets:
    if txhash!=t['transaction_sha256']:continue
    ref={'group':g,'row':where,'ordinal':ordinal};d=differences(s,t['state'])if s is not None else[]
    if isinstance(o.get('clock'),dict)and o['clock']!=t['clock']:d.append({'address':'<Clock>','field':'clock'})
    if d:ref['fields']=d;t['conflicts'].append(ref);continue
    # Readonly transaction accounts cannot change during any instruction, so a
    # retained post-image is also a known pre-image for those addresses only.
    ro={k:account(o['accounts'][k])for k in t['readonly']if isinstance(o.get('accounts'),dict)and k in o['accounts']and o['accounts'][k]is not None}
    rd=differences(ro,t['state'])
    if rd:ref['readonly_postimage_fields']=rd;t['conflicts'].append(ref);continue
    if s==t['state']and isinstance(o.get('clock'),dict)and o['clock']==t['clock']:t['exact'].append(ref)
    else:ref['reason']='Missing or compatible partial prestate; no difference proven';t['ambiguous'].append(ref)
  assert total==n,(g,total,n)
 for t in targets:
  t.pop('state');t.pop('readonly');t['admit_as_new']=not t['exact']and not t['ambiguous']
 out={'status':'completed_conservative_scan','scope':__doc__,'existing_cases':count,'rows_with_any_prestate':with_prestate,'targets':targets,'new_distinct_cases':sum(t['admit_as_new']for t in targets),'inputs_sha256':{str(x.relative_to(R)):sha(x)for x in paths+[p,Path(__file__)]},'rules':['Signed transaction differences establish distinct inputs.','For matching transactions, differing shared prestate or Clock fields establish distinct inputs.','Readonly account postimages may establish known input differences because the transaction never grants write permission.','Missing compatible prestates remain ambiguous and cannot be counted as new.']};(W/'DEDUP01.json').write_text(json.dumps(out,indent=2)+'\n');print({'new_distinct_cases':out['new_distinct_cases'],'rows':[{k:t[k]for k in ['name','admit_as_new']}|{'exact':len(t['exact']),'conflicts':len(t['conflicts']),'ambiguous':len(t['ambiguous'])}for t in targets]})
if __name__=='__main__':main()
