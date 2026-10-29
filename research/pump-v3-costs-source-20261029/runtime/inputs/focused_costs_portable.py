"""Fresh signed local V3 buy comparisons using the maintained synthetic fixture."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys,struct,re
_repo_parser=argparse.ArgumentParser(add_help=False)
_repo_parser.add_argument('--repo-root',type=Path,required=True)
_repo_args,_remaining_args=_repo_parser.parse_known_args()
ROOT=_repo_args.repo_root.resolve()
sys.argv=[sys.argv[0],*_remaining_args]
sys.path.insert(0,str(ROOT/'scripts'))
import pump_captured_loader as loader
loader.install()
import pump_v3_configured_fee_differential as suite
f=suite.f
Base=f.LiteSVM
CURRENT={}
OBS=[]
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
class ObservedVM(Base):
 def set_account(self,key,account):
  if key==suite.curve and 'real_quote' in CURRENT:
   data=bytearray(account.data);struct.pack_into('<Q',data,32,CURRENT['real_quote']);account=f.Account(account.lamports,bytes(data),account.owner,account.executable,account.rent_epoch)
  return super().set_account(key,account)
 def send_transaction(self,tx):
  keys=set(tx.message.account_keys)
  def snap():
   out={}
   for key in sorted(keys,key=str):
    a=self.get_account(key)
    out[str(key)]=None if a is None else dict(lamports=a.lamports,owner=str(a.owner),executable=a.executable,rent_epoch=a.rent_epoch,data_sha256=hashlib.sha256(a.data).hexdigest())
   return out
  before=snap();loads=list(loader.LOADS);result=super().send_transaction(tx)
  failed=isinstance(result,f.FailedTransactionMetadata);m=result.meta() if failed else result
  OBS.append(dict(transaction_base64=base64.b64encode(bytes(tx)).decode(),signatures_valid=all(tx.verify_with_results()),before=before,after=snap(),metadata=json.loads(m.to_json()),loaded_programs=loads))
  return result
f.LiteSVM=ObservedVM

def cases():
 half=2**63
 base=dict(operation='buy_v3',reserve_in=2,reserve_out=half-1,amount=2,max_cost=2**64-1,real_base=1,real_quote=0,base_vault_amount=3,token_quote=True,replace=13,quote_fees=[10000,0,10000],fees=[10000,0,10000],mutation='creator_zero',user_lamports=10**16)
 return [dict(base,label='combined_buyback_overflow'),dict(base,label='combined_buyback_nearby',reserve_out=half-2),dict(base,label='first_cost_overflow',quote_fees=[10000,0,0],fees=[10000,0,0]),dict(base,label='cost_sum_overflow',quote_fees=[0,0,0],fees=[0,0,0]),dict(base,label='finite_cost',reserve_out=99,amount=2),dict(base,label='non_crossing',reserve_out=99,amount=1)]

def main():
 p=argparse.ArgumentParser();p.add_argument('--parent',type=Path,required=True);p.add_argument('--proposal',type=Path,required=True);p.add_argument('--output',type=Path,required=True);args=p.parse_args()
 binaries=dict(original=ROOT/'evidence/original/pump/deployed.so',parent=args.parent.resolve(),proposal=args.proposal.resolve())
 rows=[]
 for c in cases():
  CURRENT.clear();CURRENT.update(c);runs={};observations={}
  for label,path in binaries.items():
   OBS.clear();loader.LOADS.clear();runs[label]=suite.run(path,c);assert len(OBS)==1;observations[label]=OBS[0]
  fields=['error','accounts','inner_instructions','event_payloads','return_data','logs']
  units=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
  def comparable(run,key):return [l for l in run[key] if not units.fullmatch(l)] if key=='logs' else run[key]
  compare=lambda a,b:[k for k in fields if comparable(runs[a],k)!=comparable(runs[b],k)]
  assert not compare('original','proposal')
  assert len({x['transaction_base64'] for x in runs.values()})==1
  assert all(x['signature_verified'] for x in runs.values())
  assert observations['original']['before']==observations['parent']['before']==observations['proposal']['before']
  assert observations['original']['after']==observations['parent']['after']==observations['proposal']['after']
  rows.append(dict(case=c,runs=runs,observations=observations,proposal_differences=compare('original','proposal'),parent_differences=compare('original','parent')))
  print(json.dumps(dict(label=c['label'],original_logs=runs['original']['logs'],proposal_differences=rows[-1]['proposal_differences'],parent_differences=rows[-1]['parent_differences'])),flush=True)
 report=dict(scope=__doc__,binary_sha256={k:sha(v) for k,v in binaries.items()},inputs_sha256={str(p.resolve()):sha(p) for p in [Path(__file__),Path(suite.__file__),Path(f.__file__),Path(loader.__file__)]},cases=rows)
 args.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0))
if __name__=='__main__':main()
