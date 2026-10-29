"""Creator native payout rent/lamport/error-order diagnostic, signed offline."""
from pathlib import Path
import sys,os,json,gzip,hashlib,base64,types,argparse
sys.dont_write_bytecode=True
R=Path(os.environ.get('PUMP_AMM_REPO_ROOT',Path(__file__).resolve().parents[2])).resolve();reads={};busy=False

def audit(event,args):
 global busy
 if busy or event!='open':return
 name,mode,flags=args
 if not isinstance(name,(str,bytes,os.PathLike)):return
 p=Path(name).resolve()
 try:rel=p.relative_to(R)
 except ValueError:return
 if not rel.parts or rel.parts[0]not in ['scripts','evidence','research','repro']:return
 if mode and any(x in mode for x in 'wax+'):return
 if p.suffix not in ['.py','.json','.so']or not p.is_file():return
 busy=True
 try:reads[str(rel)]=hashlib.sha256(p.read_bytes()).hexdigest()
 finally:busy=False
sys.addaudithook(audit);sys.path.insert(0,str(R/'scripts'))
import pump_amm_transfer_creator_differential as h
from solders.litesvm import LiteSVM
from solders.rent import Rent
from solders.transaction_metadata import FailedTransactionMetadata
cleaner=types.ModuleType('cleaner');p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)
captures=[];orig_send=LiteSVM.send_transaction

def snap(vm,tx):
 out={}
 for key in tx.message.account_keys:
  a=vm.get_account(key)
  if a is None or not a.executable:out[str(key)]=None if a is None else {'data_hex':bytes(a.data).hex(),'lamports':a.lamports,'owner':str(a.owner)}
 return out

def send(vm,tx):
 before=snap(vm,tx);rent=json.loads(vm.get_rent().to_json());r=orig_send(vm,tx);f=isinstance(r,FailedTransactionMetadata);m=r.meta()if f else r;j=json.loads(m.to_json());captures.append({'before':before,'after':snap(vm,tx),'rent':rent,'transaction_base64':base64.b64encode(bytes(tx)).decode(),'error':str(r.err())if f else None,'logs':m.logs(),'inner':j['inner_instructions'],'return_data':j.get('return_data')});return r
LiteSVM.send_transaction=send

def cases():
 out=[]
 for ins in ['transfer_creator_fees_to_pump','transfer_creator_fees_to_pump_v2']:
  out.append({'instruction':ins,'name':'default'})
  for rent in [[3480,2.0,50],[0,0.0,0],[1,1.0,0],[2**56,1.0,50],[2**56,2.0,50],[2**64-1,2.0,50],*[[(1<<e),float(t),50]for e in [53,54,55]for t in [2,3,4]]]:
   out.append({'instruction':ins,'name':'rent-'+str(rent),'rent':rent})
  for destination in [0,1,890879,890880,890881]:
   for delta in [-1,0,1]:out.append({'instruction':ins,'name':'threshold-'+str((destination,delta)),'dest_lamports':destination,'vault_lamports':2039280+max(0,890880-destination)+delta})
  for lamports,amount in [(0,1000),(1,1000),(2039279,1000),(2039280,0),(2039280,1000),(2920160,0),(2920160,1000000),(10**9,0)]:out.append({'instruction':ins,'name':'inconsistent-native-'+str((lamports,amount)),'vault_lamports':lamports,'amount':amount,'dest_lamports':0})
  for failure in ['frozen','native-none','wrong-close-authority','destination-data','readonly-destination']:
   for lamports in [2039279,2039280,2920160]:out.append({'instruction':ins,'name':failure+'-'+str(lamports),'failure':failure,'vault_lamports':lamports,'dest_lamports':0})
 return out

def mutate(c):
 def f(x,metas):
  x.vm.set_rent(Rent(*c.get('rent',[3480,2.0,50])))
  if'vault_lamports'in c:a=x.vm.get_account(h.VAULT);x.vm.set_account(h.VAULT,h.Account(c['vault_lamports'],a.data,a.owner))
  if'dest_lamports'in c:a=x.vm.get_account(h.PUMPVAULT);x.vm.set_account(h.PUMPVAULT,h.Account(c['dest_lamports'],a.data,a.owner))
  fail=c.get('failure')
  if fail in ['frozen','native-none','wrong-close-authority']:
   a=x.vm.get_account(h.VAULT);d=bytearray(a.data)
   if fail=='frozen':d[108]=2
   elif fail=='native-none':d[109:113]=bytes(4)
   else:d[129:133]=(1).to_bytes(4,'little');d[133:165]=bytes(h.PAYER.pubkey())
   x.vm.set_account(h.VAULT,h.Account(a.lamports,bytes(d),a.owner))
  if fail=='destination-data':a=x.vm.get_account(h.PUMPVAULT);x.vm.set_account(h.PUMPVAULT,h.Account(a.lamports if a else 0,b'123',h.PROGRAM))
  if fail=='readonly-destination':i=8 if c['instruction'].endswith('_v2')else 7;m=metas[i];metas[i]=h.AccountMeta(m.pubkey,m.is_signer,False)
 return f

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for c in cases():
  start=len(captures);h.transfer(c['instruction'],amount=c.get('amount',1000),overrides=mutate(c));h.transfer(c['instruction'],amount=c.get('amount',1000),overrides=mutate(c),candidate=a.candidate);x,y=captures[start:];assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64']and x['rent']==y['rent'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':c,'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows),'bad':[{'case':r['case'],'fields':r['mismatched_fields'],'original':r['original']['error'],'candidate':r['candidate']['error'],'original_logs':r['original']['logs'],'candidate_logs':r['candidate']['logs']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
