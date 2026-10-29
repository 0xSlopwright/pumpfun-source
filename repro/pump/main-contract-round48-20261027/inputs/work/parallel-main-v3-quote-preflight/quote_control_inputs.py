"""Replay the reviewed ordinary quote-control inputs, without creating a VM on import."""
from pathlib import Path
import hashlib,importlib.util,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()

def fixture():
 path=R/'work/parallel-main-positive-sync-fixtures/run_cases.py'
 assert sha(path)=='fcd5889d68c066317fa0c7be9392779aed1f36280abb7df1aca33724812673bc'
 spec=importlib.util.spec_from_file_location('reviewed_quote_inputs',path);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h);return h

def run(h,binary,case,plan):
 real=h.f.Instruction;calls=[]
 def instruction(program,data,accounts):
  assert program==h.PROGRAM and bytes(data[:8])==hashlib.sha256(b'global:sell_v3').digest()[:8]
  accounts=list(accounts)
  if case['replace_quote_user_with_quote_curve']:accounts[10]=h.f.AccountMeta(accounts[7].pubkey,False,True)
  calls.append([str(x.pubkey)for x in accounts]);return real(program,data,accounts)
 setup=dict(plan['setup']);setup.update(amount=case['amount'],minimum_output=0);h.f.Instruction=instruction
 try:out=h.run(binary,setup)
 finally:h.f.Instruction=real
 assert len(calls)==1
 out['instruction_account_keys']=calls[0];return out

def rollback(h,row):
 if row['error']is None:return True
 for key,before in row['full_before'].items():
  after=row['accounts'][key]
  if before==after:continue
  if key==str(h.USER.pubkey())and before and after and {k:v for k,v in before.items()if k!='lamports'}=={k:v for k,v in after.items()if k!='lamports'}and before['lamports']>=after['lamports']:continue
  return False
 return True
