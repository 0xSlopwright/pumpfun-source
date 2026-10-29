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

TOKEN22=h.Pubkey.from_string('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb')
NATIVE22=h.Pubkey.from_string('9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP')
observed_load=LiteSVM.add_program_from_file
def selected_token_load(vm,pid,path):
 if pid==TOKEN22 and Path(path).name=='deployed.so' and Path(path).parent.name=='spl_token':path=R/'evidence/dependencies/spl_token_2022/deployed.so'
 return observed_load(vm,pid,path)
LiteSVM.add_program_from_file=selected_token_load

def cases():
 return [{'fee':None,'configurable':True,'cashback':False},{'fee':0,'configurable':True,'cashback':False},{'fee':1,'configurable':True,'cashback':False},{'fee':1,'configurable':False,'cashback':False},{'fee':1,'configurable':True,'cashback':True}]
def run_native(c,binary=None):
 prior={k:getattr(h,k)for k in ['TOKEN','QUOTE','POOL','POOL_BUMP']}
 h.TOKEN=TOKEN22;h.QUOTE=NATIVE22;h.POOL,h.POOL_BUMP=h.Pubkey.find_program_address([b'pool',bytes(2),bytes(h.POOL_AUTH),bytes(h.MINT),bytes(h.QUOTE)],h.AMM)
 fixture={'config_patches':[(940,'01'if c['configurable']else'00'),(941,(100).to_bytes(8,'little').hex())],'curve_patches':[(83,bytes(NATIVE22).hex()),(123,'01')],'pump_config_patches':[(1045,'01'),(1046,(2**64-1).to_bytes(8,'little').hex())]}
 if c['cashback']:fixture['pool_patches']=[(244,'01')]
 if c['fee']is not None:fixture['fee_bps']=c['fee']
 try:h.run_cto(fixture,binary)
 finally:
  for k,v in prior.items():setattr(h,k,v)
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for c in cases():
  start=len(captures);run_native(c);run_native(c,a.candidate);assert len(captures)==start+2;x,y=captures[start:];assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':c,'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'scope':'Consistent Token-2022 native quote fixture: quote/PDA/curve bytes and token owner/program selected together. Uses captured Pump executable CPI and normal local signatures. Synthetic states do not establish production reachability.','producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows),'original_amm_invocations':sum(any('Instruction: AdminCtoPool'in l for l in r['original']['logs'])for r in rows)},indent=2))
if __name__=='__main__':main()
