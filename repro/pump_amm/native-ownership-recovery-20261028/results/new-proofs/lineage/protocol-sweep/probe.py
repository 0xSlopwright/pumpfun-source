"""Signed protocol-sweep recipient matrix plus unchanged creator-branch controls."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys,types
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'));import pump_amm_sweep_differential as h
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';cleaner=types.ModuleType('cleaner');exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)
PROFILES=['normal_sorted','normal_reverse','normal_rotate','normal_absent','normal_duplicates_present','normal_duplicates_absent','mayhem_primary']+[f'mayhem_secondary_{i}'for i in range(7)]+['mayhem_absent','creator_empty','creator_positive']
KEY=h.Pubkey.from_bytes(bytes(h.RAW[57:89]));send=LiteSVM.send_transaction;captures=[]
def capture(self,tx):
 def snapshot():
  rows={}
  for key in tx.message.account_keys:
   a=self.get_account(key)
   if a is None or not a.executable:rows[str(key)]=None if a is None else {'data_hex':bytes(a.data).hex(),'lamports':a.lamports,'owner':str(a.owner)}
  return rows
 before=snapshot();r=send(self,tx);failed=isinstance(r,FailedTransactionMetadata);meta=r.meta()if failed else r;q=json.loads(meta.to_json());logs=meta.logs();captures.append({'error':str(r.err())if failed else None,'logs':logs,'events':[s for s in logs if s.startswith('Program data: ')],'inner':q['inner_instructions'],'return_data':q.get('return_data'),'before':before,'after':snapshot(),'transaction_base64':base64.b64encode(bytes(tx)).decode()});return r
LiteSVM.send_transaction=capture
def setup(profile):
 def apply(vm,m):
  account=vm.vm.get_account(h.CONFIG_KEY);raw=bytearray(account.data);values=sorted(bytes(raw[i:i+32])for i in range(57,313,32));key=bytes(KEY);assert key in values;other=next(v for v in values if v!=key);absent=[v for v in values if v!=key]
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
  vm.vm.set_account(h.CONFIG_KEY,h.Account(account.lamports,bytes(raw),account.owner));pool=m[2].pubkey;account=vm.vm.get_account(pool);raw=bytearray(account.data);raw[243:245]=bytes([mode,False]);vm.vm.set_account(pool,h.Account(account.lamports,bytes(raw),account.owner))
 return apply
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for profile in PROFILES:
  def run(candidate=None):
   count=len(captures);creator=profile.startswith('creator_');h.sweep(name='sweep_creator_fee'if creator else'sweep_protocol_fee',amount=0 if profile=='creator_empty'else 1000,candidate=candidate,recipient=None if creator else KEY,overrides=setup(profile));assert len(captures)==count+1;return captures[-1]
  x,y=run(),run(a.candidate);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'profile':profile},'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'results':[{'profile':r['case']['profile'],'original_error':r['original']['error'],'candidate_error':r['candidate']['error']}for r in rows]},indent=2))
if __name__=='__main__':main()
