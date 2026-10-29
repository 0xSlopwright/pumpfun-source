"""Four reviewed quote/balance precedence controls on original and unchanged R47."""
from pathlib import Path
import argparse,gzip,hashlib,importlib.util,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
PLAN_SHA='2d5000e018032bbe268ad11c0a3da4b13547b3f35ff2c117115cde4b0facb0eb'
R47='0204c444fd17534f71b9f85424a1af2ef2550453630e3dad1578db008e1cf5f9'
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args()
 assert sha(a.candidate)==R47 and sha(W/'FIXTURE-PLAN01.json')==PLAN_SHA
 plan=json.loads((W/'FIXTURE-PLAN01.json').read_text())
 hp=R/'work/parallel-main-positive-sync-fixtures/run_cases.py'
 assert sha(hp)=='fcd5889d68c066317fa0c7be9392779aed1f36280abb7df1aca33724812673bc'
 spec=importlib.util.spec_from_file_location('normal_quote_fixture',hp);h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
 real_instruction=h.f.Instruction;rows=[];original=R/'evidence/original/pump/deployed.so'
 def run(binary,c):
  calls=[]
  def instruction(program,data,accounts):
   assert program==h.PROGRAM and bytes(data[:8])==hashlib.sha256(b'global:sell_v3').digest()[:8]
   accounts=list(accounts)
   if c['replace_quote_user_with_quote_curve']:
    accounts[10]=h.f.AccountMeta(accounts[7].pubkey,False,True)
   calls.append([str(x.pubkey)for x in accounts]);return real_instruction(program,data,accounts)
  setup=dict(plan['setup']);setup.update(amount=c['amount'],minimum_output=0)
  h.f.Instruction=instruction
  try:out=h.run(binary,setup)
  finally:h.f.Instruction=real_instruction
  assert len(calls)==1
  if c['replace_quote_user_with_quote_curve']:assert calls[0][7]==calls[0][10]
  out['instruction_account_keys']=calls[0];return out
 def label(row):
  if row['error']is None:return'success'
  for name in['NotEnoughTokensToSell','AccountTypeNotSupported']:
   if any('Error Code: '+name+'.'in x for x in row['logs']):return name
  return row['error']
 def rollback(row):
  if row['error']is None:return None
  changed=[]
  for key,before in row['full_before'].items():
   after=row['accounts'][key]
   if before==after:continue
   if key==str(h.USER.pubkey())and before and after and {k:v for k,v in before.items()if k!='lamports'}=={k:v for k,v in after.items()if k!='lamports'}and before['lamports']>=after['lamports']:
    changed.append({'account':key,'permitted_transaction_fee':before['lamports']-after['lamports']})
   else:changed.append({'account':key,'unexpected_nonfee_change':True})
  return{'changes':changed,'no_nonfee_state_change':all('unexpected_nonfee_change'not in x for x in changed)}
 for c in plan['cases']:
  o=run(original,c);n=run(a.candidate,c)
  assert o['full_before']==n['full_before']and o['clock']==n['clock']and o['transaction_base64']==n['transaction_base64']and o['signature_verified']and n['signature_verified']
  different=[k for k in['error','accounts','inner_instructions','event_payloads','return_data']if o[k]!=n[k]]
  if h.log_oracle.scope(h.log_oracle.norm(o['logs']))!=h.log_oracle.scope(h.log_oracle.norm(n['logs'])):different.append('ordered_logs')
  observed={'original':label(o),'unchanged_R47':label(n),'original_rollback':rollback(o),'unchanged_R47_rollback':rollback(n)}
  rows.append({'case':c,'original':o,'candidate':n,'different_fields':different,'observed':observed})
  print({'case':c['name'],'different_fields':different,'observed':observed},flush=True)
 report={'scope':__doc__,'candidate_sha256':sha(a.candidate),'original_sha256':sha(original),'case_count':len(rows),'cases':rows,'observed_differences':[x['case']['name']for x in rows if x['different_fields']],'plan_sha256':PLAN_SHA,'script_sha256':sha(Path(__file__)),'base_builder_sha256':sha(hp),'new_distinct_case_count':None,'limitations':['Qualification controls only, not new-corpus admission.','The candidate is unchanged R47; proposed quote-preflight source was not built or executed.','All actual errors and logs are retained; predictions do not alter output.']}
 a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),compresslevel=1,mtime=0));print({'case_count':len(rows),'observed_differences':report['observed_differences']},flush=True)
if __name__=='__main__':main()
