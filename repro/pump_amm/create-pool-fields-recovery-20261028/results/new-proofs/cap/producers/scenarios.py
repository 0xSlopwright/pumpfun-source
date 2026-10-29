"""Signed synthetic multihop sell reserve-cap collisions: available reserves versus virtual pricing reserves."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sp=importlib.util.spec_from_file_location('base_probe',R/'work/amm-event-closure-next-20261027/probe_accrue.py');bp=importlib.util.module_from_spec(sp);sp.loader.exec_module(bp);h=bp.h;clean=bp.cleaner.clean
SCENARIOS={'control':(10**9,0,0,0),'protocol-reserved':(10**9,0,999999999,0),'creator-reserved':(10**9,0,0,999999999),'virtual-exceeds-real':(1000,10**9,0,0)}
def setup(route,profile,scenario):
 def apply(vm,metas):
  bp.setup(True,route,profile,5000)(vm,metas)
  raw,virtual,protocol,creator=SCENARIOS[scenario]
  key=metas[18].pubkey;a=vm.vm.get_account(key);d=bytearray(a.data);d[245:261]=virtual.to_bytes(16,'little',signed=True);d[271:279]=struct.pack('<Q',protocol);d[279:287]=struct.pack('<Q',creator);vm.vm.set_account(key,h.Account(a.lamports,bytes(d),a.owner))
  key=metas[20].pubkey;a=vm.vm.get_account(key);d=bytearray(a.data);d[64:72]=struct.pack('<Q',raw);vm.vm.set_account(key,h.Account(max(a.lamports,raw+2039280),bytes(d),a.owner))
 return apply
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for route in ['single','two']:
  for profile in ['zero','ordinary']:
   for scenario in SCENARIOS:
    params={'sell':True,'amount':10**6,'limit':1,'overrides':setup(route,profile,scenario)};x=h.run(**params);y=h.run(candidate=a.candidate,**params);assert x['transaction_base64']==y['transaction_base64']and x['before']==y['before'];xx,yy=map(clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'route':route,'profile':profile,'scenario':scenario},'original':x,'candidate':y,'mismatched_fields':diff})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'base_producer_sha256':hashlib.sha256(Path(bp.__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as f:
  with gzip.GzipFile(fileobj=f,filename='',mtime=0,mode='wb')as z:z.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':x['case'],'fields':x['mismatched_fields'],'original_error':x['original']['error'],'candidate_error':x['candidate']['error']}for x in rows if x['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
