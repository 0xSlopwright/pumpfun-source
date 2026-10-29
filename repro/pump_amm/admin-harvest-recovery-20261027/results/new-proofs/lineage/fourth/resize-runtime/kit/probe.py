"""Signed resize/guard interleavings across all nine original helper callers."""
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
import pump_amm_legacy_buy_differential as legacy
import pump_amm_trade_v2_differential as v2
import pump_amm_multi_hop_differential as hop
import pump_amm_sweep_differential as sweep
import pump_amm_creator_reassignment_cto_differential as cto
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
from solders.account import Account
from solders.pubkey import Pubkey
cleanpath=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';cleaner=types.ModuleType('cleaner');exec(compile(cleanpath.read_bytes(),str(cleanpath),'exec'),cleaner.__dict__)
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';SYSTEM='11111111111111111111111111111111';active=None;captures=[];send=LiteSVM.send_transaction

def mutate(vm,key,fn):
 a=vm.get_account(key);assert a is not None;data=bytearray(a.data);lamports=fn(data,a.lamports);vm.set_account(key,Account(a.lamports if lamports is None else lamports,bytes(data),a.owner))
def direct_system_calls(logs):
 stack={};count=0;amm_count=0
 for line in logs:
  m=re.fullmatch(r'Program (\w+) invoke \[(\d+)\]',line)
  if m:
   pid,level=m.group(1),int(m.group(2));stack={k:v for k,v in stack.items()if k<level};stack[level]=pid
   if pid==AMM:amm_count+=1
   if pid==SYSTEM and stack.get(level-1)==AMM:count+=1
  else:
   m=re.match(r'Program (\w+) (?:success|failed:)',line)
   if m:
    for level in sorted(stack,reverse=True):
     if stack[level]==m.group(1):stack={k:v for k,v in stack.items()if k<level};break
 return count,amm_count

def capture(vm,tx):
 c=active;assert c is not None;family=c['family'];is_cto=family=='admin_cto';pool=cto.POOL if is_cto else legacy.pool;config=cto.amm.CONFIG_KEY if is_cto else legacy.CONFIG_KEY;payer=tx.message.account_keys[0]
 def pool_mut(data,lamports):
  for off,val in c.get('pool_patches',[]):data[off:off+len(bytes.fromhex(val))]=bytes.fromhex(val)
  if c.get('pool_length')is not None:del data[c['pool_length']:]
  return c.get('pool_lamports',lamports)
 mutate(vm,pool,pool_mut)
 if c.get('payer_lamports')is not None:mutate(vm,payer,lambda d,l:c['payer_lamports'])
 if c.get('disabled'):
  mutate(vm,config,lambda d,l:d.__setitem__(56,16 if 'sell'in family else 8))
 if c.get('bad_token'):
  key=hop.userbase if family.startswith('hop')else legacy.userbase
  mutate(vm,key,lambda d,l:d.__setitem__(slice(0,32),bytes(32)))
 if c.get('bad_recipient'):
  if family=='sweep_creator':mutate(vm,pool,lambda d,l:d.__setitem__(slice(211,243),bytes(32)))
  elif family.startswith('legacy')or family=='sweep_protocol':mutate(vm,config,lambda d,l:d.__setitem__(slice(57,313),bytes(256)))
  else:mutate(vm,legacy.buyback,lambda d,l:d.__setitem__(slice(32,64),bytes(32)))
 def snap():
  out={}
  for key in tx.message.account_keys:
   a=vm.get_account(key)
   if a is None or not a.executable:out[str(key)]=None if a is None else {'data_hex':bytes(a.data).hex(),'owner':str(a.owner),'lamports':a.lamports}
  return out
 before=snap();result=send(vm,tx);failed=isinstance(result,FailedTransactionMetadata);meta=result.meta()if failed else result;q=json.loads(meta.to_json());logs=meta.logs();system_count,amm_count=direct_system_calls(logs)
 captures.append({'error':str(result.err())if failed else None,'logs':logs,'events':[x for x in logs if x.startswith('Program data:')],'inner':q['inner_instructions'],'return_data':q.get('return_data'),'before':before,'after':snap(),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'pool_key':str(pool),'payer_key':str(payer),'direct_amm_system_calls':system_count,'amm_invocations':amm_count})
 return result
LiteSVM.send_transaction=capture

def cases():
 rows=[]
 families=['legacy_buy','legacy_exact','legacy_sell','buy_v2','exact_v2','sell_v2','hop_buy','hop_sell']
 for f in families:
  basics=[('full',287,10**9,{}),('short243',243,1,{}),('short271',271,1,{}),('short286',286,1,{}),('short_prepaid',243,10**9,{}),('short_poor',243,1,{'payer_lamports':5000}),('short_zero',243,1,{'zero':True}),('full_zero',287,10**9,{'zero':True}),('poor_zero',243,1,{'payer_lamports':5000,'zero':True}),('short_disabled',243,1,{'disabled':True}),('poor_disabled',243,1,{'disabled':True,'payer_lamports':5000}),('short_bad_token',243,1,{'bad_token':True}),('short_bad_recipient',243,1,{'bad_recipient':True}),('poor_bad_recipient',243,1,{'bad_recipient':True,'payer_lamports':5000})]
  if f in ['buy_v2','exact_v2','sell_v2','hop_buy','hop_sell']:basics += [('short_cashback',245,1,{'pool_patches':[(244,'01')]}),('short_mayhem',245,1,{'pool_patches':[(243,'01')]})]
  for label,n,r,kw in basics:rows.append(dict(family=f,profile=label,pool_length=n,pool_lamports=r,**kw))
 for f in ['sweep_protocol','sweep_creator']:
  for label,n,r,kw in [('full',287,10**9,{}),('short243',243,1,{}),('short271',271,1,{}),('short286',286,1,{}),('short_prepaid',243,10**9,{}),('short_poor',243,1,{'payer_lamports':5000}),('short_zero',243,1,{'zero':True}),('poor_zero',243,1,{'zero':True,'payer_lamports':5000}),('short_bad_recipient',243,1,{'bad_recipient':True}),('poor_bad_recipient',243,1,{'bad_recipient':True,'payer_lamports':5000})]:rows.append(dict(family=f,profile=label,pool_length=n,pool_lamports=r,**kw))
  for label,n,r,kw in [('short_zero_recipient',243,1,{'zero_recipient':True}),('poor_zero_recipient',243,1,{'zero_recipient':True,'payer_lamports':5000}),('full_zero_recipient',287,10**9,{'zero_recipient':True})]:rows.append(dict(family=f,profile=label,pool_length=n,pool_lamports=r,**kw))
 for label,n,r,kw in [('full',301,10**9,{}),('short243',243,1,{}),('short271',271,1,{}),('short286',286,1,{}),('short_prepaid',243,10**9,{}),('short_mayhem',245,1,{'pool_patches':[(243,'01')]}),('short_holder',271,1,{'pool_patches':[(270,'01')]}),('short_unswept',286,1,{'pool_patches':[(279,'0100000000000000')]}),('full_unswept',301,10**9,{'pool_patches':[(279,'0100000000000000')]}),('short_poor',243,1,{'payer_lamports':10000}),('short_midfunds',243,1,{'payer_lamports':10**7}),('poor_mayhem',245,1,{'pool_patches':[(243,'01')],'payer_lamports':10000})]:rows.append(dict(family='admin_cto',profile=label,pool_length=n,pool_lamports=r,**kw))
 return rows

def run(c,binary):
 global active
 active=c;before=len(captures);family=c['family'];amount=0 if c.get('zero')else 10**6
 if family in ['legacy_buy','legacy_exact']:legacy.legacy_buy(name='buy'if family=='legacy_buy'else'buy_exact_quote_in',amount=amount,limit=10**12 if family=='legacy_buy'else 1,candidate=binary)
 elif family=='legacy_sell':legacy.legacy(amount=amount,limit=1,candidate=binary)
 elif family in ['buy_v2','exact_v2','sell_v2']:v2.trade(name={'buy_v2':'buy_v2','exact_v2':'buy_exact_quote_in_v2','sell_v2':'sell_v2'}[family],amount=amount,limit=10**12 if family=='buy_v2'else 1,candidate=binary)
 elif family.startswith('hop'):hop.run(amount=amount,limit=1,sell=family=='hop_sell',candidate=binary)
 elif family.startswith('sweep'):sweep.sweep(name='sweep_protocol_fee'if family=='sweep_protocol'else'sweep_creator_fee',amount=0 if c.get('zero')else 1000,candidate=binary,recipient=Pubkey.default() if c.get('zero_recipient') else None)
 elif family=='admin_cto':cto.run_case({},binary)
 assert len(captures)==before+1,(family,len(captures)-before)
 active=None;return captures[-1]

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for c in cases():
  x=run(c,None);y=run(c,a.candidate);assert x['before']==y['before']and x['transaction_base64']==y['transaction_base64'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':c,'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={r:hashlib.sha256((R/r).read_bytes()).hexdigest()for r in before};assert after==before
 out={'scope':__doc__,'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(x['mismatched_fields'])for x in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(x['original']['error']is None for x in rows),'direct_amm_system_cpis':sum(x['original']['direct_amm_system_calls']for x in rows),'inputs':len(before)},indent=2))
if __name__=='__main__':main()
