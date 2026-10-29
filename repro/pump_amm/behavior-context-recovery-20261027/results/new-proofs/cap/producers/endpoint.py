"""Signed synthetic endpoint, buyback and fee-failure probes for the multihop accrual wrapper."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,struct,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'scripts'));import pump_amm_multi_hop_differential as h
spec=importlib.util.spec_from_file_location('cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(spec);spec.loader.exec_module(cleaner)
U64=(1<<64)-1
PROFILES={'zero':(0,0,0),'ordinary':(10,20,30),'protocol-only':(0,20,0),'creator-only':(0,0,30),'large':(2500,2500,2500)}
def setup(sell,route,profile,bps):
 def apply(vm,metas):
  if route=='two':h.route2(sell)(vm,metas)
  for start in range(16,len(metas),5):
   key=metas[start+2].pubkey;a=vm.vm.get_account(key);data=bytearray(a.data);data[245:269]=bytes(24);data[271:287]=bytes(16);data[211:243]=bytes(h.OUTSIDER.pubkey());vm.vm.set_account(key,h.Account(a.lamports,bytes(data),a.owner))
   for offset in [3,4]:
    key=metas[start+offset].pubkey;a=vm.vm.get_account(key);data=bytearray(a.data);data[64:72]=struct.pack('<Q',10**9);vm.vm.set_account(key,h.Account(max(a.lamports,10**9+2039280),bytes(data),a.owner))
  h.custom_fee_table([(0,PROFILES[profile])])(vm,metas)
  a=vm.vm.get_account(h.CONFIG_KEY);data=bytearray(a.data);data[899:907]=struct.pack('<Q',bps);data[940]=0;vm.vm.set_account(h.CONFIG_KEY,h.Account(a.lamports,bytes(data),a.owner))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for sell in [False,True]:
  for route in ['single','two']:
   for profile in PROFILES:
    for bps in [0,5000,10000,10001,U64]:
     params={'sell':sell,'amount':1000000,'limit':1,'overrides':setup(sell,route,profile,bps)}
     original=h.run(**params);candidate=h.run(candidate=a.candidate,**params);assert original['transaction_base64']==candidate['transaction_base64']and original['before']==candidate['before'];x,y=map(cleaner.clean,[original,candidate]);diff=[k for k in x if x[k]!=y.get(k)]
     rows.append({'case':{'sell':sell,'route':route,'profile':profile,'buyback_bps':bps},'original':original,'candidate':candidate,'mismatched_fields':diff})
 report={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as file:
  with gzip.GzipFile(fileobj=file,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(report,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'failures':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
