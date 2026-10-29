"""Signed account owner/type/guard precedence probes; original vs selected AMM."""
from pathlib import Path
import os,sys,types,json,gzip,base64,hashlib,argparse,itertools
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
sys.addaudithook(audit)
sys.path.insert(0,str(R/'scripts'))
import pump_amm_create_differential as c
import pump_amm_liquidity_differential as h
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
cleaner=types.ModuleType('cleaner');p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)
captures=[];orig_send=LiteSVM.send_transaction

def snapshot(vm,tx):
 out={}
 for key in tx.message.account_keys:
  a=vm.get_account(key)
  if a is None or not a.executable:out[str(key)]=None if a is None else {'data_hex':bytes(a.data).hex(),'lamports':a.lamports,'owner':str(a.owner)}
 return out

def capture_send(vm,tx):
 before=snapshot(vm,tx);r=orig_send(vm,tx);failed=isinstance(r,FailedTransactionMetadata);m=r.meta()if failed else r;j=json.loads(m.to_json())
 captures.append({'before':before,'after':snapshot(vm,tx),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'error':str(r.err())if failed else None,'logs':m.logs(),'inner':j['inner_instructions'],'return_data':j.get('return_data')})
 return r
LiteSVM.send_transaction=capture_send

def cases():
 out=[]
 tails=[('empty',''),('short-false','00'),('short-true','01'),('bad-first','02'),('bad-second','0002'),('bad-second-after-edit','0102'),('two-valid','0001'),('seven-zero','00'*7),('seven-edit','01'+'00'*6),('seven-bad-second','0002'+'00'*5),('full-eight','00'*8),('full-eight-bad-bool','00'*8+'02')]
 for enabled in [0,1]:
  for name,tail in tails:out.append({'name':f'cashback1-enabled{enabled}-{name}','cashback_enabled':enabled,'optional_hex':'01'+tail})
 return out

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for case in cases():
  params={'optional':bytes.fromhex(case['optional_hex']),'overrides':h.mutate(h.CONFIG_KEY,642,bytes([case['cashback_enabled']]))};start=len(captures);c.create(**params);c.create(candidate=a.candidate,**params);assert len(captures)==start+2;x,y=captures[start:];assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':case,'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'outcomes':[{'name':r['case']['name'],'error':r['original']['error']}for r in rows]},indent=2))
if __name__=='__main__':main()
