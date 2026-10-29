from pathlib import Path
import hashlib,json,os
W=Path(__file__).resolve().parent;R=W.parents[1];H=R/'repro/pump_amm/incentive-order-recovery-20261027';D=H/'results';L=D/'new-proofs/lineage'
keep={'protocol-recipient','protocol-sweep','cpi-branches','buy-event','range-joint','independent-range','fourth','incentive-order','route-guard-component'}
def stats(p):
 rows=[];links=[]
 for parent,ds,fs in os.walk(p,followlinks=False):
  for n in ds+fs:
   q=Path(parent)/n
   if q.is_symlink():links.append(str(q.relative_to(p)))
  for n in fs:
   q=Path(parent)/n
   if q.is_file():rows.append((q.stat().st_size,str(q.relative_to(p))))
 return {'files':len(rows),'bytes':sum(r[0]for r in rows),'symlinks':links}
rows=[]
for p in sorted(L.iterdir()):
 s=stats(p)if p.is_dir()else{'files':1,'bytes':p.stat().st_size,'symlinks':[]};s.update({'name':p.name,'kind':'directory'if p.is_dir()else'file','retained':p.name in keep if p.is_dir()else True});rows.append(s)
record={'source':str(H),'source_manifest_sha256':hashlib.sha256((D/'manifest.json').read_bytes()).hexdigest(),'full_results':stats(D),'lineage':rows,'retained_directory_names':sorted(keep),'omittable_directories':[x['name']for x in rows if x['kind']=='directory'and not x['retained']]}
record['omittable_bytes']=sum(x['bytes']for x in rows if x['kind']=='directory'and not x['retained']);record['omittable_files']=sum(x['files']for x in rows if x['kind']=='directory'and not x['retained'])
(W/'inventory.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({'full_results':record['full_results'],'omittable_bytes':record['omittable_bytes'],'omittable_files':record['omittable_files'],'lineage':[{k:v for k,v in x.items()if k!='symlinks'}for x in rows]},indent=2))
