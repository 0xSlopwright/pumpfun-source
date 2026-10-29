"""Signed CTO fixed-quote guard controls through captured Pump CPI."""
from pathlib import Path
import sys,hashlib,json,os,gzip,base64,argparse,re,types
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
import pump_amm_creator_reassignment_cto_differential as h
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
 quotes=['So11111111111111111111111111111111111111112','9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP','EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v','6US7gzTTF5xDSjyBaUXXBKCWY6roG8XQPWw3D9Ez3Ltq']
 rows=[{'quote':q,'fee':fee,'configurable':True,'cashback':False}for q in quotes for fee in [None,0,1]]
 rows +=[{'quote':quotes[1],'fee':1,'configurable':False,'cashback':False},{'quote':quotes[1],'fee':1,'configurable':True,'cashback':True}]
 return rows
def fixture(c):
 patches=[(75,bytes(h.Pubkey.from_string(c['quote'])).hex())]
 if c['cashback']:patches.append((244,'01'))
 r={'exotic':True,'config_patches':[(940,'01'if c['configurable']else'00'),(941,(100).to_bytes(8,'little').hex())],'pool_patches':patches}
 if c['fee']is not None:r['fee_bps']=c['fee']
 return r
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for c in cases():
  start=len(captures);h.run_case(fixture(c));h.run_case(fixture(c),a.candidate);assert len(captures)==start+2;x,y=captures[start:];assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':c,'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows),'original_amm_invocations':sum(any('Instruction: AdminCtoPool'in l for l in r['original']['logs'])for r in rows)},indent=2))
if __name__=='__main__':main()
