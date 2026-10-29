"""Signed buy-result sum and final user-quote addition boundaries."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,itertools,json,struct,sys
R=Path(__file__).resolve().parents[2];sys.path.insert(0,str(R/'scripts'));import pump_amm_trade_v2_differential as h
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
spec=importlib.util.spec_from_file_location('cleaner',R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py');cleaner=importlib.util.module_from_spec(spec);spec.loader.exec_module(cleaner)
forward=LiteSVM.send_transaction;captures=[];MAX=(1<<64)-1;BASE=10**9
PROFILES={'zero':(0,0,0),'lp':(10000,0,0),'protocol':(0,10000,0),'creator':(0,0,10000),'all':(10000,10000,10000),'ordinary':(25,5,10)}
def send(self,tx):
 def snap():
  out={}
  for key in tx.message.account_keys:
   a=self.get_account(key)
   if a is None or not a.executable:out[str(key)]=None if a is None else{'lamports':a.lamports,'owner':str(a.owner),'data_hex':bytes(a.data).hex()}
  return out
 before=snap();r=forward(self,tx);meta=r.meta()if isinstance(r,FailedTransactionMetadata)else r;captures.append({'before':before,'after':snap(),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'return_data':json.loads(meta.to_json()).get('return_data')});return r
LiteSVM.send_transaction=send

def setup(profile,q,cap=None):
 def ov(vm,m):
  h.rekey_pool(h.quote,True)(vm,m);h.custom_fee_table([(0,PROFILES[profile])])(vm,m)
  key=m[0].pubkey;a=vm.vm.get_account(key);d=bytearray(a.data);d[211:243]=bytes(h.OUTSIDER.pubkey());d[243:269]=bytes(26);d[271:287]=bytes(16);vm.vm.set_account(key,h.Account(a.lamports,bytes(d),a.owner))
  for key,amount in[(m[7].pubkey,BASE),(m[8].pubkey,q)]:
   a=vm.vm.get_account(key);d=bytearray(a.data);d[64:72]=struct.pack('<Q',amount);vm.vm.set_account(key,h.Account(max(a.lamports,amount+2039280),bytes(d),a.owner))
  h.mutate(h.CONFIG_KEY,899,struct.pack('<Q',10000 if cap is not None else 0))(vm,m)
  if cap is not None:h.trade_transferfee(h.quote,10000,cap)(vm,m)
 return ov

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();cases=[]
 for name,profile,(scale,q)in itertools.product(['buy_v2','buy_exact_quote_in_v2'],PROFILES,[('ordinary',10**9),('sum-below',MAX//2),('sum-above',MAX//2+1),('maximum',MAX-2039280)]):
  cases.append(({'group':'sum','instruction':name,'profile':profile,'quote_reserve':q,'scale':scale},BASE//2 if name=='buy_v2'else(10**7 if scale=='ordinary'else MAX),MAX if name=='buy_v2'else 1,setup(profile,q)))
 for delta in[-1,0,1]:
  q=10**9;curve=q;cap=MAX-2*curve+delta;cases.append(({'group':'final-add','instruction':'buy_v2','quote_reserve':q,'maximum_fee':cap,'expected_total_offset_from_max':delta},BASE//2,MAX,setup('protocol',q,cap)))
 rows=[]
 for case,amount,limit,ov in cases:
  def run(candidate=None):
   r=h.trade(case['instruction'],amount=amount,limit=limit,overrides=ov,candidate=candidate);r.update(captures[-1]);r['events']=[x for x in r['logs']if x.startswith('Program data: ')];return r
  x,y=run(),run(a.candidate);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':case,'original':x,'candidate':y,'mismatched_fields':diff})
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'cases':rows}
 with a.output.open('wb')as file:
  with gzip.GzipFile(fileobj=file,filename='',mode='wb',mtime=0)as z:z.write((json.dumps(out,separators=(',',':'))+'\n').encode())
 print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(x['original']['error']is None for x in rows),'final_add':[{'case':x['case'],'error':x['original']['error']}for x in rows if x['case']['group']=='final-add'],'differences':[{'case':x['case'],'fields':x['mismatched_fields']}for x in rows if x['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
