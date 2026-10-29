"""Deduplicate the one zero-before-rent witness against full frozen R41 prestates."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('bounded_reader',R/'work/parallel-main-schedule-guard-corpus/dedup06.py');rd=importlib.util.module_from_spec(spec);spec.loader.exec_module(rd)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def canonical(o):
 if not isinstance(o.get('before'),dict):return None
 out={}
 for label,a in o['before'].items():
  if a is None:continue
  v={k:a[k]for k in['owner','lamports','executable','rent_epoch']if k in a}
  if'data_hex'in a:v['data_hex']=a['data_hex']
  elif'data_base64'in a:v['data_hex']=base64.b64decode(a['data_base64']).hex()
  elif'data'in a:
   if isinstance(a['data'],list):v['data_hex']=bytes(a['data']).hex()
   elif isinstance(a['data'],str):
    try:v['data_hex']=bytes.fromhex(a['data']).hex()
    except ValueError:v['data_hex']=base64.b64decode(a['data']).hex()
  out[str(a.get('address',label))]=v
 return out
def main():
 report=json.loads(gzip.decompress((W/'witness01.json.gz').read_bytes()));targets=[]
 for row in report['cases']:
  o=row['original'];s=canonical(o);targets.append({'name':row['case']['name'],'transaction_sha256':hashlib.sha256(base64.b64decode(o['transaction_base64'])).hexdigest(),'prestate_sha256':hashlib.sha256(json.dumps(s,sort_keys=True,separators=(',',':')).encode()).hexdigest(),'prestate':s,'exact':[],'conflicting':[],'ambiguous':[]})
 paths=[R/'work/parallel-main-integration'/('round41-captured-'+g+'.json.gz')for g in['full','additional']];counts={};with_before=0
 for p,expected in zip(paths,[10468,7642]):
  count=0
  for ordinal,where,o in rd.records(p):
   count+=1;s=canonical(o);with_before+=s is not None;tx=hashlib.sha256(base64.b64decode(o['transaction_base64'])).hexdigest()
   for t in targets:
    if tx!=t['transaction_sha256']:continue
    ref={'file':str(p.relative_to(R)),'row':where,'ordinal':ordinal}
    if s==t['prestate']:t['exact'].append(ref)
    elif s is None:t['ambiguous'].append(ref)
    else:
     differences=[{'address':a,'field':k}for a in s.keys()&t['prestate'].keys()for k in s[a].keys()&t['prestate'][a].keys()if s[a][k]!=t['prestate'][a][k]]
     if differences:ref['differences']=differences;t['conflicting'].append(ref)
     else:t['ambiguous'].append(ref)
  assert count==expected;counts[str(p.relative_to(R))]=count;print(p.name,count,flush=True)
 for t in targets:
  t.pop('prestate');t['admit_as_new']=t['name']=='zero-with-earlier-underfunded'and not t['exact']and not t['ambiguous']
 result={'status':'passed','scope':__doc__,'existing_cases':sum(counts.values()),'with_prestate':with_before,'counts':counts,'rows':targets,'new_cases':sum(t['admit_as_new']for t in targets),'definition':'Actual signed transaction plus full canonical non-null retained prestate. A known conflicting field proves distinction; missing or compatible partial prestate remains ambiguous. Controls are never counted as new.','inputs_sha256':{str(p.relative_to(R)):sha(p)for p in paths+[W/'witness01.json.gz']}}
 (W/'DEDUP02.json').write_text(json.dumps(result,indent=2)+'\n');print({'new_cases':result['new_cases'],'rows':[{k:t[k]for k in['name','admit_as_new']}for t in targets]},flush=True)
 assert result['new_cases']==1
if __name__=='__main__':main()
