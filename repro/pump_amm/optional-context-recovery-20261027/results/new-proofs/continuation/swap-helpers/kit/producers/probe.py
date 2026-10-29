"""Signed v2 and multi-hop buyback token-account validation boundaries."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'));import pump_amm_multi_hop_differential as h
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
spec=importlib.util.spec_from_file_location('full_cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(spec);spec.loader.exec_module(cleaner)
forward=LiteSVM.send_transaction;captured=[]
def send(self,tx):
 def snap():
  out={}
  for key in tx.message.account_keys:
   a=self.get_account(key)
   if a is None or not a.executable:out[str(key)]=None if a is None else{'lamports':a.lamports,'owner':str(a.owner),'data_hex':bytes(a.data).hex()}
  return out
 before=snap();r=forward(self,tx);meta=r.meta()if isinstance(r,FailedTransactionMetadata)else r
 captured.append({'before':before,'after':snap(),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'return_data':json.loads(meta.to_json()).get('return_data')});return r
LiteSVM.send_transaction=send
CASES=[('valid',None,None,None),('owner-wrong',None,None,'owner'),('owner-wrong-empty',0,None,'owner')]+[(f'len-{n}',n,None,None)for n in [0,1,31,32,63,64,108,109,164,165,166,355,512]]+[('uninitialized',None,(108,b'\0'),None),('frozen',None,(108,b'\2'),None),('invalid-state',None,(108,b'\3'),None),('wrong-mint',None,(0,bytes(h.base)),None),('zero-authority',None,(32,bytes(32)),None),('unauthorized',None,(32,bytes(h.OUTSIDER.pubkey())),None),('wrong-address',None,None,'address'),('bad-mint-and-authority',None,None,'both')]
assert len(CASES)==24

def setup(case):
 _,length,edit,flag=case
 def apply(vm,metas):
  key=h.buyback;a=vm.vm.get_account(key);data=bytearray(a.data);owner=a.owner
  if edit:data[edit[0]:edit[0]+len(edit[1])]=edit[1]
  if flag=='owner':owner=h.Pubkey.default()
  if flag=='both':data[0:32]=bytes(h.base);data[32:64]=bytes(32)
  if length is not None:data=data[:length].ljust(length,b'\0')
  if flag=='address':
   new=h.Pubkey.from_bytes(bytes([197])*32)
   for i,x in enumerate(metas):
    if x.pubkey==key:metas[i]=h.AccountMeta(new,x.is_signer,x.is_writable)
   key=new
  vm.vm.set_account(key,h.Account(a.lamports,bytes(data),owner))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for family in ['buy_v2','buy_exact_quote_in_v2','sell_v2','hop-buy','hop-sell']:
  for case in CASES:
   kw={'amount':10**6,'limit':10**12 if family=='buy_v2'else 1,'overrides':setup(case)}
   def run(candidate=None):
    if family.startswith('hop-'):r=h.run(sell=family=='hop-sell',candidate=candidate,**kw)
    else:r=h.trade(family,candidate=candidate,**kw)
    r.update(captured[-1]);r['events']=[x for x in r['logs']if x.startswith('Program data: ')];return r
   x=run();y=run(a.candidate);assert x['before']==y['before'] and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)]
   rows.append({'case':{'family':family,'mutation':case[0]},'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as file:
  with gzip.GzipFile(fileobj=file,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(out,separators=(',',':'))+'\n').encode())
 print(json.dumps({'case_count':len(rows),'mismatch_count':out['mismatch_count'],'original_successes':sum(x['original']['error']is None for x in rows),'failures':[{'case':x['case'],'fields':x['mismatched_fields'],'original_error':x['original']['error'],'candidate_error':x['candidate']['error']}for x in rows if x['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
