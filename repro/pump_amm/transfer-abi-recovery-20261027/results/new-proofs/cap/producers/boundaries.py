"""Signed available-quote boundaries immediately below, at, and above observed quote-without-LP."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,struct
W=Path(__file__).resolve().parent
s=importlib.util.spec_from_file_location('cap_core',W/'probe.py');core=importlib.util.module_from_spec(s);s.loader.exec_module(core);h=core.h
roster=json.loads((W/'thresholds.json').read_text())
def setup(row,delta):
 def apply(vm,metas):
  core.setup(row['route'],row['profile'],'control')(vm,metas);a=vm.vm.get_account(metas[18].pubkey);d=bytearray(a.data);d[271:279]=struct.pack('<Q',10**9-row['quote_without_lp']-delta);vm.vm.set_account(metas[18].pubkey,h.Account(a.lamports,bytes(d),a.owner))
 return apply
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for item in roster['cases']:
  for delta in [-1,0,1]:
   params={'sell':True,'amount':10**6,'limit':1,'overrides':setup(item,delta)};x=h.run(**params);y=h.run(candidate=a.candidate,**params);assert x['transaction_base64']==y['transaction_base64']and x['before']==y['before'];xx,yy=map(core.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{**item,'available_delta':delta},'original':x,'candidate':y,'mismatched_fields':diff})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'thresholds_sha256':hashlib.sha256((W/'thresholds.json').read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((core.R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as f:
  with gzip.GzipFile(fileobj=f,filename='',mtime=0,mode='wb')as z:z.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'original_successes':sum(x['original']['error']is None for x in rows)},indent=2))
if __name__=='__main__':main()
