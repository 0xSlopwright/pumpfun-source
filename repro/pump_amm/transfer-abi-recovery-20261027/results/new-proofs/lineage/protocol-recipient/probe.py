"""Signed legacy normal and mayhem protocol-recipient search controls."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'));import pump_amm_legacy_buy_differential as h
s=importlib.util.spec_from_file_location('cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(s);s.loader.exec_module(cleaner)
PROFILES = ['normal_sorted', 'normal_reverse', 'normal_rotate', 'normal_absent', 'normal_duplicates_present', 'normal_duplicates_absent', 'mayhem_primary'] + [f'mayhem_secondary_{i}' for i in range(7)] + ['mayhem_absent']
def setup(profile):
 def apply(vm,m):
  account=vm.vm.get_account(h.CONFIG_KEY);raw=bytearray(account.data);values=sorted(bytes(raw[i:i+32])for i in range(57,313,32));key=bytes(h.PROTOCOL);assert key in values;other=next(v for v in values if v!=key);absent=[v for v in values if v!=key]
  mode=profile.startswith('mayhem_')
  if profile=='normal_reverse':values.reverse()
  elif profile=='normal_rotate':values=values[1:]+values[:1]
  elif profile=='normal_absent':values=sorted(absent+[other])
  elif profile=='normal_duplicates_present':values=[key]*8
  elif profile=='normal_duplicates_absent':values=[other]*8
  raw[57:313]=b''.join(values)
  if mode:
   primary=other;secondary=[other]*7
   if profile=='mayhem_primary':primary=key
   elif profile.startswith('mayhem_secondary_'):secondary[int(profile.rsplit('_',1)[1])]=key
   raw[385:417]=primary;raw[418:642]=b''.join(secondary)
  vm.vm.set_account(h.CONFIG_KEY,h.Account(account.lamports,bytes(raw),account.owner))
  pool=m[0].pubkey;account=vm.vm.get_account(pool);raw=bytearray(account.data);raw[243:245]=bytes([mode,False]);vm.vm.set_account(pool,h.Account(account.lamports,bytes(raw),account.owner))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for family in ['buy','buy_exact_quote_in','sell']:
  for profile in PROFILES:
   def run(candidate=None):
    kw={'amount':10**6,'limit':10**12 if family=='buy'else 1,'overrides':setup(profile),'candidate':candidate};return h.legacy(**kw)if family=='sell'else h.legacy_buy(name=family,**kw)
   x,y=run(),run(a.candidate);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'family':family,'profile':profile},'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as f:
  with gzip.GzipFile(fileobj=f,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(out,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'results':[{'case':r['case'],'fields':r['mismatched_fields'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows]},indent=2))
if __name__=='__main__':main()
