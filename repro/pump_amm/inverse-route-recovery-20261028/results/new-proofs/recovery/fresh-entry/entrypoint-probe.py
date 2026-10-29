"""Signed default-entrypoint paths: instruction truncation and duplicate account indices."""
from pathlib import Path
import argparse,hashlib,json,sys
ROOT=next(p for p in Path(__file__).resolve().parents if(p/'evidence/original/pump_amm/deployed.so').is_file());sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_trade_v2_differential as h

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for name in ['buy_v2','buy_exact_quote_in_v2','sell_v2']:
  amount=10**7 if name=='buy_exact_quote_in_v2' else 10**10;limit=10**12 if name=='buy_v2' else 1
  for n in [0,1,7,8,9,15,16,17,23,24]:
   args={'name':name,'amount':amount,'limit':limit,'payload_length':n};x=h.trade(**args);y=h.trade(**args,candidate=a.candidate);rows.append({'instruction':name,'case':'payload_length='+str(n),'original':x,'candidate':y})
  for n in [1,8,32]:
   def duplicate(vm,metas,n=n):
    old=tuple(metas);metas.extend(old[i%len(old)]for i in range(n))
   args={'name':name,'amount':amount,'limit':limit,'overrides':duplicate};x=h.trade(**args);y=h.trade(**args,candidate=a.candidate);rows.append({'instruction':name,'case':'duplicate_indices='+str(n),'original':x,'candidate':y})
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();r={'scope':__doc__,'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(a.candidate),'producer_sha256':sha(Path(__file__)),'cases':rows,'case_count':len(rows)};a.output.write_text(json.dumps(r,separators=(',',':'))+'\n');print('cases',len(rows))
if __name__=='__main__':main()
