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

def execsnap(vm,tx):
 out={}
 for key in tx.message.account_keys:
  a=vm.get_account(key)
  if a is not None and a.executable:out[str(key)]={'data_sha256':hashlib.sha256(bytes(a.data)).hexdigest(),'data_len':len(a.data),'lamports':a.lamports,'owner':str(a.owner)}
 return out

def send(vm,tx):
 before=snap(vm,tx);executables=execsnap(vm,tx);rent=json.loads(vm.get_rent().to_json());r=orig_send(vm,tx);f=isinstance(r,FailedTransactionMetadata);m=r.meta()if f else r;j=json.loads(m.to_json());captures.append({'before':before,'after':snap(vm,tx),'executable_before':executables,'executable_after':execsnap(vm,tx),'rent':rent,'transaction_base64':base64.b64encode(bytes(tx)).decode(),'error':str(r.err())if f else None,'logs':m.logs(),'inner':j['inner_instructions'],'return_data':j.get('return_data')});return r
LiteSVM.send_transaction=send

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();old=a.output.with_name('retained-original.json');sys.argv=[str(h.__file__),'--candidate',str(a.candidate),'--output',str(old)];h.main();saved=json.loads(old.read_text());assert len(captures)==len(saved['cases'])*2;rows=[]
 for i,case in enumerate(saved['cases']):
  x,y=captures[2*i:2*i+2];assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64']and x['rent']==y['rent'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if k not in ['executable_before','executable_after'] and xx[k]!=yy.get(k)];rows.append({'case':{k:v for k,v in case.items()if k not in ['original','candidate','diff']},'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows)},indent=2))
if __name__=='__main__':main()
