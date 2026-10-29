"""Capture normal-account set_params zero-key versus rent-guard precedence."""
from pathlib import Path
import argparse,gzip,hashlib,inspect,json,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent;sys.path.insert(0,str(R/'scripts'))
import pump_set_params_differential as h
source=inspect.getsource(h.run)
needle=' before=snap();r=vm.send_transaction(tx);'
assert source.count(needle)==1
source=source.replace(needle," full_before={str(k):json.loads(a.to_json())if(a:=vm.get_account(k))is not None else None for k in set(keys+[PAYER.pubkey(),OUTSIDER.pubkey()]) if k!=PROGRAM}\n"+needle)
source=source.replace('return dict(error=',"return dict(full_before=full_before,clock=json.loads(vm.get_clock().to_json()),error=")
ns=dict(h.__dict__);exec(compile(source,str(Path(__file__)),'exec'),ns);run=ns['run']
def cases():
 keys=[str(h.Pubkey.from_bytes(bytes([100+i])*32))for i in range(8)]
 return [
  {'name':'nonzero-underfunded-control','recipient_lamports':1,'recipients':keys},
  {'name':'zero-with-earlier-underfunded','recipient_lamports':1,'recipients':keys[:7]+[str(h.Pubkey.default())]},
  {'name':'zero-rent-exempt-control','recipients':keys[:7]+[str(h.Pubkey.default())]},
 ]
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();rows=[]
 for c in cases():
  o=run(c);n=run(c,a.candidate)
  assert o['signature_verification']and n['signature_verification']and o['transaction_base64']==n['transaction_base64']and o['full_before']==n['full_before']and o['clock']==n['clock']
  for v in o['full_before'].values():
   if v and v['executable']:assert v['owner']=='NativeLoader1111111111111111111111111111111'
  fields=[k for k in ['error','before','after','events','inner','returns']if o[k]!=n[k]]
  rows.append({'case':c,'original':o,'candidate':n,'different_fields':fields});print({'case':c['name'],'original_error':o['error'],'candidate_error':n['error'],'different_fields':fields},flush=True)
 report={'scope':__doc__,'case_count':len(rows),'cases':rows,'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256(h.ORIGINAL.read_bytes()).hexdigest(),'harness_sha256':hashlib.sha256(Path(h.__file__).read_bytes()).hexdigest(),'transformed_run_sha256':hashlib.sha256(source.encode()).hexdigest(),'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'fixture_constraints':['Recipient nonzero accounts are ordinary System-owned, nonexecutable, empty data; only their lamports are set.','The zero pubkey is the existing executable System Program account, never overwritten or given a synthetic owner.','Global owner/data/authority use the existing set_params fixture. Full non-target instruction-account prestates, clock, and actual verified signed transactions are retained.']}
 a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0))
if __name__=='__main__':main()
