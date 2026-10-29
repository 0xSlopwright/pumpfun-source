"""Focused existing-fixture executions for the eight selected event sites."""
import argparse,base64,hashlib,json,sys,types
from pathlib import Path
I=Path.cwd();sys.path.insert(0,str(I/'scripts'))
import pump_amm_create_differential as create
import pump_amm_boost_differential as boost
import pump_amm_boost_burn_differential as burn
import pump_amm_creator_reassignment_cto_differential as cto
import pump_amm_extend_differential as extend
import pump_amm_legacy_sell_differential as sell
p=I/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';cleaner=types.ModuleType('cleaner');cleaner.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)
def run(candidate,output):
 rows=[]
 def pair(case_name,fn,**kw):
  x=fn(**kw);y=fn(candidate=candidate,**kw);a,b=cleaner.clean(x),cleaner.clean(y)
  fields=[k for k in set(a)|set(b)if a.get(k)!=b.get(k)]
  rows.append({'case':case_name,'arguments':kw,'original':x,'candidate':y,'different_fields':fields})
 for amount in[0,1,10**9]:pair('create-'+str(amount),create.create,base_amount=amount)
 for amount in[0,1,10**9,10**12]:pair('burn-'+str(amount),burn.run,amount=amount)
 pair('init-boost-captured-migration',boost.run_migration,label='migration')
 for label,c in [('base',{}),('holder',{'holder':True,'new_none':True}),('cashback',{'pool_patches':[(244,'01')]})]:
  pair('cto-'+label,lambda candidate=None,c=c:cto.run_case(c,candidate))
 for kind,size in[('Pool',8),('Pool',300),('GlobalConfig',8),('GlobalConfig',948),('UserVolumeAccumulator',8),('GlobalVolumeAccumulator',8)]:pair('extend-'+kind+'-'+str(size),extend.extend,kind=kind,size=size,lamports=10**9)
 for amount in[0,1,10**6,10**10]:pair('legacy-sell-'+str(amount),sell.legacy,amount=amount)
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
 report={'candidate_sha256':sha(candidate),'original_sha256':sha(I/'evidence/original/pump_amm/deployed.so'),'producer_sha256':sha(__file__),'case_count':len(rows),'mismatch_count':sum(bool(r['different_fields'])for r in rows),'cases':rows}
 output.write_text(json.dumps(report,separators=(',',':'))+'\n');print(json.dumps({k:v for k,v in report.items()if k!='cases'}));assert not report['mismatch_count']
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();run(a.candidate,a.output)
