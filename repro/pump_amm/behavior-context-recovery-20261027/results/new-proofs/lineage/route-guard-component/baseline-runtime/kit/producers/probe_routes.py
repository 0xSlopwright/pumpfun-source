"""Signed two-hop owner classification and lookahead precedence matrix."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'));import pump_amm_multi_hop_differential as h
s=importlib.util.spec_from_file_location('cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(s);s.loader.exec_module(cleaner)
def setup(sell,route,position,owner_name):
 def apply(vm,metas):
  routes={'two-amm':h.route2,'two-curve':h.two_curves,'curve-amm':h.curve_then_amm,'amm-curve':h.amm_then_curve}
  routes[route](sell)(vm,metas)
  if position is None:return
  key=metas[18+5*position].pubkey;a=vm.vm.get_account(key);owners={'system':h.Pubkey.default(),'token':h.TOKEN,'foreign':h.OUTSIDER.pubkey()};vm.vm.set_account(key,h.Account(a.lamports,bytes(a.data),owners[owner_name]))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for sell in [False,True]:
  for route in ['two-amm','two-curve','curve-amm','amm-curve']:
   for position,owner_name in [(None,'valid')]+[(i,o)for i in [0,1]for o in ['system','token','foreign']]:
    params={'sell':sell,'amount':10**6,'limit':1,'overrides':setup(sell,route,position,owner_name)};x=h.run(**params);y=h.run(candidate=a.candidate,**params);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'sell':sell,'route':route,'position':position,'owner':owner_name},'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as f:
  with gzip.GzipFile(fileobj=f,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(out,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'results':[{'case':x['case'],'fields':x['mismatched_fields'],'original_error':x['original']['error'],'candidate_error':x['candidate']['error'],'original_pump_cpis':sum('Program '+str(h.PUMP)+' invoke'in l for l in x['original']['logs']),'candidate_pump_cpis':sum('Program '+str(h.PUMP)+' invoke'in l for l in x['candidate']['logs'])}for x in rows]},indent=2))
if __name__=='__main__':main()
