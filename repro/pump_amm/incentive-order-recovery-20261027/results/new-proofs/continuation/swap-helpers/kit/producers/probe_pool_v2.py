"""Signed legacy swap pool-v2 lookup boundaries at remaining-account indices zero, one and two."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'));import pump_amm_legacy_buy_differential as h
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
spec=importlib.util.spec_from_file_location('cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(spec);spec.loader.exec_module(cleaner)
forward=LiteSVM.send_transaction;captured=[]
def send(self,tx):
 def snap():
  out={}
  for key in tx.message.account_keys:
   a=self.get_account(key)
   if a is None or not a.executable:out[str(key)]=None if a is None else{'lamports':a.lamports,'owner':str(a.owner),'data_hex':bytes(a.data).hex()}
  return out
 before=snap();r=forward(self,tx);meta=r.meta()if isinstance(r,FailedTransactionMetadata)else r;captured.append({'before':before,'after':snap(),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'return_data':json.loads(meta.to_json()).get('return_data')});return r
LiteSVM.send_transaction=send
MUTATIONS=['valid','missing','wrong-key','readonly','foreign-owner','garbage-data','only-lookup','extra-tail']
def setup(family,cashback,mutation):
 def ov(vm,m):
  (h.legacy_rekey(h.quote,True)if family=='sell'else h.adapt_sell_helper(h.legacy_rekey(h.quote,True)))(vm,m)
  if cashback:
   (h.cash(present=True)if family=='sell'else h.cashback_buy(present=True))(vm,m)
   key=m[0].pubkey;account=vm.vm.get_account(key);data=bytearray(account.data);data[244]=1;vm.vm.set_account(key,h.Account(account.lamports,bytes(data),account.owner))
  h.custom_fee_table([(0,(100,200,300))])(vm,m)
  p2=h.Pubkey.find_program_address([b'pool-v2',bytes(h.base)],h.PROGRAM)[0];idx=next(i for i,x in enumerate(m)if x.pubkey==p2)
  if mutation=='missing':del m[idx:]
  elif mutation=='wrong-key':
   key=h.Pubkey.from_bytes(bytes([194])*32);vm.vm.set_account(key,h.Account(10**9,b'',h.Pubkey.default()));m[idx]=h.AccountMeta(key,False,False)
  elif mutation=='readonly':m[idx]=h.AccountMeta(p2,False,False)
  elif mutation=='foreign-owner':vm.vm.set_account(p2,h.Account(10**9,b'',h.TOKEN))
  elif mutation=='garbage-data':vm.vm.set_account(p2,h.Account(10**9,bytes(range(32)),h.TOKEN22))
  elif mutation=='only-lookup':del m[idx+1:]
  elif mutation=='extra-tail':
   key=h.Pubkey.from_bytes(bytes([195])*32);vm.vm.set_account(key,h.Account(10**9,b'',h.Pubkey.default()));m.append(h.AccountMeta(key,False,False))
 return ov

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for family in ['buy','buy_exact_quote_in','sell']:
  for cashback in [False,True]:
   for mutation in MUTATIONS:
    def run(candidate=None):
     kw={'amount':10**7,'limit':10**12 if family=='buy'else 1,'overrides':setup(family,cashback,mutation),'candidate':candidate}
     r=h.legacy(**kw)if family=='sell'else h.legacy_buy(name=family,**kw);r.update(captured[-1]);return r
    x,y=run(),run(a.candidate);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'family':family,'cashback':cashback,'mutation':mutation},'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as file:
  with gzip.GzipFile(fileobj=file,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(out,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(x['original']['error']is None for x in rows),'valid_cases':[{'case':x['case'],'error':x['original']['error']}for x in rows if x['case']['mutation']in ['valid','missing','wrong-key']]},indent=2))
if __name__=='__main__':main()
