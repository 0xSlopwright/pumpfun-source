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
import pump_amm_legacy_buy_differential as h
import pump_amm_sweep_differential as sw
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
from solders.account import Account
from solders.pubkey import Pubkey
from solders.instruction import AccountMeta
p=R/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py';cleaner=types.ModuleType('cleaner');exec(compile(p.read_bytes(),str(p),'exec'),cleaner.__dict__)
ATA='ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';captures=[];send=LiteSVM.send_transaction

def capture(vm,tx):
 def snap():
  out={}
  for key in tx.message.account_keys:
   a=vm.get_account(key)
   if a is None or not a.executable:out[str(key)]=None if a is None else {'data_hex':bytes(a.data).hex(),'owner':str(a.owner),'lamports':a.lamports}
  return out
 before=snap();r=send(vm,tx);failed=isinstance(r,FailedTransactionMetadata);meta=r.meta()if failed else r;q=json.loads(meta.to_json());logs=meta.logs();captures.append({'error':str(r.err())if failed else None,'logs':logs,'events':[v for v in logs if v.startswith('Program data:')],'inner':q['inner_instructions'],'return_data':q.get('return_data'),'before':before,'after':snap(),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'ata_invocations':sum(line.startswith('Program '+ATA+' invoke [')for line in logs)});return r
LiteSVM.send_transaction=capture
PROFILES=[{'name':'empty_readonly','empty':True,'readonly':True},{'name':'empty_rent_insufficient','empty':True,'poor':True},{'name':'empty_token_owned','empty':True,'token_owned':True},{'name':'zero_empty_lowfunds','zero':True,'empty':True,'poor':True},{'name':'zero_frozen','zero':True,'frozen':True},{'name':'zero_wrong_owner','zero':True,'wrong_owner':True},{'name':'zero_wrong_mint','zero':True,'wrong_mint':True},{'name':'zero_readonly','zero':True,'readonly':True},{'name':'token22_empty','token22':True,'empty':True},{'name':'token22_empty_readonly','token22':True,'empty':True,'readonly':True},{'name':'token22_empty_rent','token22':True,'empty':True,'poor':True},{'name':'token22_zero_empty','token22':True,'empty':True,'zero':True}]

def setup(family,profile):
 def apply(vm,m):
  sweep=family.startswith('sweep');buy=family in ['buy','exact']
  if profile.get('token22'):
   if not sweep:
    fn=h.legacy_transferfee(h.quote,100,1000);(h.adapt_sell_helper(fn)if buy else fn)(vm,m)
   else:
    a=vm.vm.get_account(sw.quote);d=a.data[:82]+bytes(83)+b'\1';conf=bytes(72)+sw.struct.pack('<QQH',0,1000,100)*2;d+=sw.struct.pack('<HH',1,len(conf))+conf;vm.vm.set_account(sw.quote,Account(a.lamports,d,sw.TOKEN22));a=vm.vm.get_account(sw.vaultquote);d=a.data[:165]+b'\2'+sw.struct.pack('<HHQ',2,8,0);vm.vm.set_account(sw.vaultquote,Account(a.lamports,d,sw.TOKEN22));m[4]=AccountMeta(sw.TOKEN22,False,False);key=Pubkey.find_program_address([bytes(m[6].pubkey),bytes(sw.TOKEN22),bytes(sw.quote)],sw.ATA)[0];m[7]=AccountMeta(key,False,True)
  if buy:h.existing_volume()(vm,m)
  if not sweep:
   a=vm.vm.get_account(h.CONFIG_KEY);d=bytearray(a.data);d[899:907]=(0 if profile.get('zero')else 10000).to_bytes(8,'little');vm.vm.set_account(h.CONFIG_KEY,Account(a.lamports,bytes(d),a.owner))
  idx=7 if sweep else len(m)-1;key=m[idx].pubkey;owner=m[6].pubkey if sweep else m[-2].pubkey;program=h.TOKEN22 if profile.get('token22')else h.TOKEN;a=vm.vm.get_account(key)
  if not a or not a.data:
   d=h.token(h.quote,owner,0,True);d=d+b'\2'+h.struct.pack('<HHQ',2,8,0)if profile.get('token22')else d;a=Account(2039280,d,program)
  d=bytearray(a.data);actual_owner=a.owner;lamports=a.lamports
  if profile.get('empty'):d=bytearray();actual_owner=program if profile.get('token_owned')else Pubkey.default();lamports=1 if profile.get('token_owned')else 0
  else:
   if profile.get('frozen'):d[108]=2
   if profile.get('wrong_owner'):actual_owner=Pubkey.default()
   if profile.get('wrong_mint'):d[:32]=bytes(h.base)
  vm.vm.set_account(key,Account(lamports,bytes(d),actual_owner))
  if profile.get('readonly'):m[idx]=AccountMeta(key,False,False)
  if profile.get('poor'):a=vm.vm.get_account(h.PAYER.pubkey());vm.vm.set_account(h.PAYER.pubkey(),Account(5000,a.data,a.owner))
 return apply

def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();rows=[]
 for family in ['buy','exact','sell','sweep_protocol','sweep_creator']:
  for profile in PROFILES:
   def run(candidate=None):
    before=len(captures);ov=setup(family,profile)
    if family in ['buy','exact']:h.legacy_buy(name='buy'if family=='buy'else'buy_exact_quote_in',amount=10**8,limit=10**12 if family=='buy'else 1,candidate=candidate,overrides=ov)
    elif family=='sell':h.legacy(amount=10**8,limit=1,candidate=candidate,overrides=ov)
    else:sw.sweep(name='sweep_protocol_fee'if family=='sweep_protocol'else'sweep_creator_fee',amount=0 if profile.get('zero')else 1000,candidate=candidate,overrides=ov)
    assert len(captures)==before+1;return captures[-1]
   x,y=run(),run(a.candidate);assert x['transaction_base64']==y['transaction_base64']and x['before']==y['before'];xx,yy=map(cleaner.clean,[x,y]);diff=[k for k in xx if xx[k]!=yy.get(k)];rows.append({'case':{'family':family,**profile},'original':x,'candidate':y,'mismatched_fields':diff})
 before=dict(reads);after={k:hashlib.sha256((R/k).read_bytes()).hexdigest()for k in before};assert before==after;out={'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'case_count':len(rows),'mismatch_count':sum(bool(r['mismatched_fields'])for r in rows),'runtime_reads_before':before,'runtime_reads_after':after,'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(out,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'mismatches':out['mismatch_count'],'original_successes':sum(r['original']['error']is None for r in rows),'ata_invocations':sum(r['original']['ata_invocations']for r in rows),'inputs':len(before)},indent=2))
if __name__=='__main__':main()
