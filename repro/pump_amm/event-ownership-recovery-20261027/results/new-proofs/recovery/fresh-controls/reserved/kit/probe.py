"""Reserved recipient executable/rent constraints, signed local probes."""
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
import pump_amm_reserved_differential as h
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

from solders.clock import Clock
from solders.rent import Rent

def cases():
 return [{'mode':'valid','index':0}, {'mode':'duplicate','index':7}, {'mode':'short','index':0}, {'mode':'extra-zero','index':8}, {'mode':'owner-amm','index':0}] + [{'mode':m,'index':i}for i in [0,7]for m in ['zero','executable','rent-empty','rent-data','rent-exact','rent-minus-one']] + [{'mode':'rent-first-zero-later','index':0},{'mode':'exec-first-zero-later','index':0},{'mode':'zero-first-rent-later','index':0},{'mode':'zero-first-exec-later','index':0}]
def run(c,program):
 vm=h.Harness(program).vm;vm.set_clock(Clock(100,1234567890,0,0,1234567890));vm.set_account(h.CONFIG_KEY,h.Account(h.CONFIG['lamports'],bytes(h.RAW),h.PROGRAM));keys=[h.Pubkey.from_bytes(bytes([90+i])*32)for i in range(8)];mode=c['mode'];idx=c['index']
 for key in keys:vm.set_account(key,h.Account(10**9,b'',h.Pubkey.default()))
 if mode=='duplicate':keys[7]=keys[0]
 if mode=='short':keys=keys[:7]
 if mode=='extra-zero':keys.append(h.Pubkey.default())
 if mode=='owner-amm':vm.set_account(keys[idx],h.Account(10**9,b'recipient-data',h.PROGRAM))
 if mode=='zero':keys[idx]=h.Pubkey.default()
 if mode=='executable':keys[idx]=h.PROGRAM
 if mode in ['rent-empty','rent-data','rent-exact','rent-minus-one']:
  data=b''if mode=='rent-empty'else bytes(1000);minimum=Rent.default().minimum_balance(len(data));lamports=1 if mode in ['rent-empty','rent-data']else minimum-(mode=='rent-minus-one');vm.set_account(keys[idx],h.Account(lamports,data,h.Pubkey.default()))
 if mode in ['rent-first-zero-later','exec-first-zero-later','zero-first-rent-later','zero-first-exec-later']:
  if mode.startswith('zero-first'):keys[0]=h.Pubkey.default();target=7
  else:keys[7]=h.Pubkey.default();target=0
  if 'rent' in mode:vm.set_account(keys[target],h.Account(1,b'',h.Pubkey.default()))
  else:keys[target]=h.PROGRAM
 metas=[h.AccountMeta(h.CONFIG_KEY,False,True),h.AccountMeta(h.PAYER.pubkey(),True,False),h.AccountMeta(h.EVENT,False,False),h.AccountMeta(h.PROGRAM,False,False)]+[h.AccountMeta(k,False,False)for k in keys]
 tx=h.Transaction.new_signed_with_payer([h.Instruction(h.PROGRAM,h.DISC+bytes([199])*32,metas)],h.PAYER.pubkey(),[h.PAYER],vm.latest_blockhash());vm.send_transaction(tx)
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for c in cases():
  start=len(captures);run(c,R/'evidence/original/pump_amm/deployed.so');run(c,a.candidate);assert len(captures)==start+2;x,y=captures[start:];assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':c,'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows)},indent=2))
if __name__=='__main__':main()
