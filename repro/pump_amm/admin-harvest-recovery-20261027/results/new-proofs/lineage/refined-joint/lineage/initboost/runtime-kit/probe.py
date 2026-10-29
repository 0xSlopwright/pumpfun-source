"""Canonical signed Pump migration probes for InitBoost call boundaries."""
from pathlib import Path
import sys,hashlib,json,os,gzip,base64,argparse,re,types
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parents[2];reads={};busy=False

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
sys.addaudithook(audit)
sys.path.insert(0,str(R/'scripts'))
import pump_amm_boost_differential as h
p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';cleaner=types.ModuleType('cleaner');exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)

from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
captures=[]
original_send=LiteSVM.send_transaction
def snapshot(vm,tx):
 out={}
 for key in tx.message.account_keys:
  a=vm.get_account(key)
  if a is None or not a.executable:out[str(key)]=None if a is None else {'data_hex':bytes(a.data).hex(),'lamports':a.lamports,'owner':str(a.owner)}
 return out
def capture_send(vm,tx):
 before=snapshot(vm,tx);r=original_send(vm,tx);failed=isinstance(r,FailedTransactionMetadata);meta=r.meta()if failed else r
 captures.append({'before':before,'after':snapshot(vm,tx),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'error':str(r.err())if failed else None,'logs':meta.logs(),'inner':json.loads(meta.to_json())['inner_instructions'],'return_data':json.loads(meta.to_json()).get('return_data')})
 return r
LiteSVM.send_transaction=capture_send

def cases():
 return [{'field':'control','value':0}]+[{'field':'enabled','value':x}for x in [0,1]]+[{'field':'base','value':x}for x in [1,10**12,10**15-1,10**15,10**15+1,2**64-1]]+[{'field':'lamports','value':x}for x in [10**6,10**9,10**15,2**64-1]]
def change(c):
 def apply(vm,k):
  field=c['field'];v=c['value']
  if field=='control':return
  key=k['amm_global_config']if field=='enabled'else k['associated_base_bonding_curve']if field=='base'else k['bonding_curve'];a=vm.get_account(key);d=bytearray(a.data)
  if field=='enabled':d[939]=v
  if field=='base':d[64:72]=h.struct.pack('<Q',v)
  vm.set_account(key,h.Account(v if field=='lamports'else a.lamports,bytes(d),a.owner))
 return apply
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for c in cases():
  start=len(captures);h.run_migration(label='migration',overrides=change(c));h.run_migration(candidate=a.candidate,label='migration',overrides=change(c));assert len(captures)==start+2;x,y=captures[start:];assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':c,'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows)},indent=2))
if __name__=='__main__':main()
