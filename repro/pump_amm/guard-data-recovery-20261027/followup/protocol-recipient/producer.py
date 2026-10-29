"""Signed legacy normal-recipient lookup ordering controls."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'));import pump_amm_legacy_buy_differential as h
s=importlib.util.spec_from_file_location('cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(s);s.loader.exec_module(cleaner)
def setup(order):
 def apply(vm,m):
  account=vm.vm.get_account(h.CONFIG_KEY);raw=bytearray(account.data);values=sorted(bytes(raw[i:i+32])for i in range(57,313,32));assert bytes(h.PROTOCOL)in values
  if order=='reverse':values.reverse()
  elif order=='rotate':values=values[1:]+values[:1]
  raw[57:313]=b''.join(values);vm.vm.set_account(h.CONFIG_KEY,h.Account(account.lamports,bytes(raw),account.owner))
  pool=m[0].pubkey;account=vm.vm.get_account(pool);raw=bytearray(account.data);raw[243:245]=bytes(2);vm.vm.set_account(pool,h.Account(account.lamports,bytes(raw),account.owner))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for family in ['buy','buy_exact_quote_in','sell']:
  for order in ['sorted','reverse','rotate']:
   def run(candidate=None):
    kw={'amount':10**6,'limit':10**12 if family=='buy'else 1,'overrides':setup(order),'candidate':candidate};return h.legacy(**kw)if family=='sell'else h.legacy_buy(name=family,**kw)
   x,y=run(),run(a.candidate);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'family':family,'order':order},'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as f:
  with gzip.GzipFile(fileobj=f,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(out,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'results':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows]},indent=2))
if __name__=='__main__':main()
