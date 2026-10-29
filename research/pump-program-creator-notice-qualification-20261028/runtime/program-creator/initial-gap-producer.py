"""One bounded synthetic existing-program creator witness; no source/build/chain changes."""
from pathlib import Path
import base64,copy,gzip,hashlib,json,sys
R=Path.cwd();P=Path(__file__).resolve().parent;sys.path.insert(0,str(R/'scripts'))
import pump_captured_loader as loader
loader.install()
import pump_admin_cto_differential as f
from solders.transaction import Transaction
sha=lambda b:hashlib.sha256(b).hexdigest()
paths={'original':R/'evidence/original/pump/deployed.so','current_C0':R/'research/pump-multihop-accrual-qualification-20261028/artifacts/candidate.so','trial21':R/'work/pump-remaining-frontier-20261028-latest/trial-build/candidate.so'}
inputs={str(path):sha(path.read_bytes())for path in [Path(__file__),Path(f.__file__),R/'scripts/pump_captured_loader.py',*paths.values(),R/'evidence/original/pump_fees/deployed.so',R/'evidence/original/pump_amm/deployed.so']}
assert f.PROGRAM not in [f.PAYER.pubkey(),f.AUTH.pubkey(),f.OTHER.pubkey()]
# One existing non-payer executable dependency becomes the old creator. The
# maintained fixture sets curve.creator to the same key and uses ordinary AUTH.
# Its executable/owner/ProgramData metadata comes from genuine add_program(),
# not an executable bit applied to an invalid or fee-paying account.
case={'name':'existing-executable-fees-program-as-current-creator','current':str(f.PROGRAM)}
ACTIVE=None;observations={}
class WitnessVM(loader.CapturedLiteSVM):
 def add_program_from_file(self,program_id,path):
  raw=Path(path).read_bytes();out=super().add_program_from_file(program_id,path)
  observations.setdefault(ACTIVE,{}).setdefault('actual_add_program_calls',[]).append(dict(program=str(program_id),input_sha256=sha(raw),input_path=str(Path(path).resolve())))
  return out
 def send_transaction(self,tx):
  raw=bytes(tx);checks=tx.verify_with_results();assert checks and all(checks)
  assert f.PROGRAM not in tx.message.account_keys[:tx.message.header.num_required_signatures]
  creator=self.get_account(f.PROGRAM);payer=self.get_account(f.PAYER.pubkey());assert creator and creator.executable and payer and not payer.executable
  row=observations.setdefault(ACTIVE,{})
  def encode(key):
   account=self.get_account(key)
   if account is None:return None
   return dict(lamports=account.lamports,owner=str(account.owner),executable=account.executable,data_bytes=len(account.data),data_sha256=sha(bytes(account.data)),data_base64=base64.b64encode(bytes(account.data)).decode())
  row['wire']=base64.b64encode(raw).decode();row['wire_sha256']=sha(raw);row['signature_fields']=len(checks);row['signatures_verified']=list(checks);row['before']={str(key):encode(key)for key in tx.message.account_keys};row['current_creator_before']=encode(f.PROGRAM);row['payer_before']=encode(f.PAYER.pubkey())
  result=super().send_transaction(tx)
  row['after']={str(key):encode(key)for key in tx.message.account_keys};return result
f.LiteSVM=WitnessVM
runs={};start=len(loader.LOADS)
for label,path in paths.items():
 ACTIVE=label;load_start=len(loader.LOADS);result=f.run(copy.deepcopy(case),path);observations[label]['loader']=loader.LOADS[load_start:];assert len(observations[label]['loader'])==1 and observations[label]['loader'][0]['elf_sha256']==sha(path.read_bytes());runs[label]=result
assert len(loader.LOADS)-start==3
assert len({x['transaction_base64']for x in runs.values()})==1
assert len({x['wire_sha256']for x in observations.values()})==1
assert all(x['before']==observations['original']['before']for x in observations.values())
assert all(sha(Path(name).read_bytes())==digest for name,digest in inputs.items())
fields=['error','before','after','events','inner','return'];diffs={label:[k for k in fields if row[k]!=runs['original'][k]]for label,row in runs.items()if label!='original'}
messages={label:[x for x in row['logs']if x.startswith('Program log: ')]for label,row in runs.items()}
notice='Program log: Creator is a program; fees left in the vaults'
report=dict(scope=__doc__,case=case,metadata_source='Existing executable Fees dependency account loaded by maintained fixture; only current-creator key and corresponding curve/PDA fixture values selected. No payer mutation, signer/owner/PDA bypass or network transaction.',input_sha256=inputs,images={k:sha(v.read_bytes())for k,v in paths.items()},runs=runs,observations=observations,structured_differences=diffs,program_messages=messages,original_program_notice=notice in runs['original']['logs'],current_C0_program_notice=notice in runs['current_C0']['logs'],trial21_program_notice=notice in runs['trial21']['logs'],case_count=1,signed_executions=3,signature_fields=sum(x['signature_fields']for x in observations.values()),distinct_wire_count=1,actual_captured_main_loads=3,reachable_mainnet_claim=False)
(P/'program-creator-witness.json.gz').write_bytes(gzip.compress(json.dumps(report,indent=2).encode(),mtime=0))
summary={k:report[k]for k in ['images','structured_differences','original_program_notice','current_C0_program_notice','trial21_program_notice','case_count','signed_executions','signature_fields','distinct_wire_count','actual_captured_main_loads','reachable_mainnet_claim']};summary['errors']={k:r['error']for k,r in runs.items()};summary['messages']=messages;summary['witness_sha256']=sha((P/'program-creator-witness.json.gz').read_bytes());(P/'program-creator-witness-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
