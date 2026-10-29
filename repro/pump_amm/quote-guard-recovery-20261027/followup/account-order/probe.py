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
 def add(instruction,label,changes=[],**params):out.append({'instruction':instruction,'name':label,'changes':changes,**params})
 owner=lambda idx:{'index':idx,'owner':'11111111111111111111111111111111'}
 write=lambda idx,at,value:{'index':idx,'at':at,'hex':value}
 state=lambda idx,v:write(idx,108,bytes([v]).hex())
 for ins in ['deposit','withdraw']:
  add(ins,'valid')
  changes=[('base-owner',owner(3)),('quote-owner',owner(4)),('lp-owner',owner(5)),('user-base-owner',owner(6)),('user-quote-owner',owner(7)),('user-lp-owner',owner(8)),('pool-base-owner',owner(9)),('pool-quote-owner',owner(10)),('base-uninitialized',write(3,45,'00')),('quote-uninitialized',write(4,45,'00')),('lp-uninitialized',write(5,45,'00')),('base-mint-option',write(3,0,'02000000')),('quote-mint-option',write(4,0,'02000000')),('user-base-uninitialized',state(6,0)),('user-quote-uninitialized',state(7,0)),('user-lp-uninitialized',state(8,0)),('pool-base-invalid-state',state(9,3)),('pool-quote-invalid-state',state(10,3)),('user-base-mint',write(6,0,'00'*32)),('user-quote-mint',write(7,0,'00'*32)),('user-lp-mint',write(8,0,'00'*32)),('user-base-authority',write(6,32,'00'*32)),('user-quote-authority',write(7,32,'00'*32)),('user-lp-authority',write(8,32,'00'*32)),('pool-base-authority',write(9,32,'00'*32)),('pool-quote-authority',write(10,32,'00'*32)),('user-base-frozen',state(6,2)),('user-quote-frozen',state(7,2)),('user-lp-frozen',state(8,2))]
  for name,change in changes:
   add(ins,name,[change]);add(ins,name+'+disabled',[change,write(1,56,'ff')]);add(ins,name+'+zero',[change],amount=0)
  pairs=[('base-owner+quote-owner',owner(3),owner(4)),('base-option+quote-owner',write(3,0,'02000000'),owner(4)),('user-base-owner+pool-base-owner',owner(6),owner(9)),('user-base-frozen+user-quote-owner',state(6,2),owner(7)),('user-base-authority+user-lp-owner',write(6,32,'00'*32),owner(8)),('user-base-mint+pool-base-invalid',write(6,0,'00'*32),state(9,3)),('user-lp-authority+pool-quote-owner',write(8,32,'00'*32),owner(10)),('user-lp-frozen+user-base-frozen',state(8,2),state(6,2)),('quote-mint-option+lp-uninitialized',write(4,0,'02000000'),write(5,45,'00'))]
  for name,a,b in pairs:add(ins,name,[a,b])
  for name,change in [('user-base-frozen',state(6,2)),('user-quote-frozen',state(7,2)),('pool-base-authority',write(9,32,'00'*32)),('user-lp-mint',write(8,0,'00'*32))]:add(ins,name+'+base-limit',[change],maxbase=0 if ins=='deposit'else 2**64-1)
 for name,change in [('base-owner',owner(3)),('quote-owner',owner(4)),('user-base-owner',owner(6)),('user-quote-owner',owner(7)),('base-uninitialized',write(3,45,'00')),('quote-uninitialized',write(4,45,'00')),('base-mint-option',write(3,0,'02000000')),('quote-mint-option',write(4,0,'02000000')),('user-base-state',state(6,0)),('user-quote-state',state(7,0)),('user-base-mint',write(6,0,'00'*32)),('user-quote-mint',write(7,0,'00'*32)),('user-base-authority',write(6,32,'00'*32)),('user-quote-authority',write(7,32,'00'*32)),('user-base-frozen',state(6,2)),('user-quote-frozen',state(7,2))]:
  add('create_pool',name,[change]);add('create_pool',name+'+zero',[change],base_amount=0,quote_amount=0);add('create_pool',name+'+disabled',[change,write(1,56,'ff')])
 add('create_pool','valid')
 for name,a,b in [('base-owner+quote-owner',owner(3),owner(4)),('base-uninitialized+quote-owner',write(3,45,'00'),owner(4)),('user-base-frozen+user-quote-owner',state(6,2),owner(7)),('user-base-authority+user-quote-mint',write(6,32,'00'*32),write(7,0,'00'*32))]:add('create_pool',name,[a,b])
 return out

def apply(changes):
 def mutate(vm,metas):
  for m in changes:
   key=metas[m['index']].pubkey;a=vm.vm.get_account(key);d=bytearray(a.data)
   if 'at'in m:b=bytes.fromhex(m['hex']);d[m['at']:m['at']+len(b)]=b
   vm.vm.set_account(key,h.Account(a.lamports,bytes(d),h.Pubkey.from_string(m['owner'])if'owner'in m else a.owner))
 return mutate

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for case in cases():
  start=len(captures);ins=case['instruction'];params={k:v for k,v in case.items()if k not in ['instruction','name','changes']};params['overrides']=apply(case['changes'])
  if ins=='create_pool':fn=c.create
  else:fn=h.run;params.update(name=ins);params.setdefault('amount',1000000);params.setdefault('maxbase',0 if ins=='withdraw'else 2**64-1);params.setdefault('maxquote',0 if ins=='withdraw'else 2**64-1)
  fn(**params);fn(candidate=a.candidate,**params);assert len(captures)==start+2;x,y=captures[start:];assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':case,'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows),'bad':[{'case':r['case'],'fields':r['mismatched_fields'],'original':r['original']['error'],'candidate':r['candidate']['error']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__=='__main__':main()
