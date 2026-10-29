"""Signed boundary controls for replacing replicated fee account types with IDL types."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,re,sys
R=Path.cwd();sys.path.insert(0,str(R/'scripts'))
import pump_amm_creator_reassignment_differential as cr
import pump_amm_trade_v2_differential as tr
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata

trace=[];send0=LiteSVM.send_transaction
def snap(vm,keys):
 out={}
 for k in keys:
  a=vm.get_account(k)
  if a is not None and a.executable:continue
  out[str(k)]=None if a is None else {'data':a.data.hex(),'owner':str(a.owner),'lamports':a.lamports,'executable':a.executable,'rent_epoch':a.rent_epoch}
 return out
def send(vm,tx):
 assert all(tx.verify_with_results());raw=bytes(tx);keys=tx.message.account_keys;before=snap(vm,keys);result=send0(vm,tx)
 meta=result.meta()if isinstance(result,FailedTransactionMetadata)else result
 trace.append({'transaction_base64':base64.b64encode(raw).decode(),'signature_count':len(tx.signatures),'before':before,'after':snap(vm,keys),'error':str(result.err())if isinstance(result,FailedTransactionMetadata)else None,'logs':meta.logs(),'metadata':json.loads(meta.to_json())})
 assert bytes(tx)==raw;return result
LiteSVM.send_transaction=send
def normalized(row):
 row=json.loads(json.dumps(row));row['metadata'].pop('compute_units_consumed',None)
 def logs(lines):
  return [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',re.sub(r'(?<=panicked at )[^ ]+:[0-9]+:[0-9]+','<source>',x))for x in lines if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',x)]
 row['logs']=logs(row['logs'])
 if 'logs'in row['metadata']:row['metadata']['logs']=logs(row['metadata']['logs'])
 return row
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();rows=[]
 for case in cr.cases():
  if not (any(x in case['name'] for x in ['sharing', 'status-', 'revoked-', 'curve', 'metadata']) or case['name'].endswith('-base')):continue
  pair=[]
  for binary in [None,a.candidate]:
   old=len(trace);cr.run_creator(case,binary);assert len(trace)==old+1;pair.append(trace[-1])
  assert pair[0]['transaction_base64']==pair[1]['transaction_base64'] and pair[0]['before']==pair[1]['before']
  rows.append({'case':case,'original':pair[0],'candidate':pair[1],'match':normalized(pair[0])==normalized(pair[1])})
 specs=[('length-'+str(n),tr.mutate(tr.feeconfig,0,b'',n))for n in [0,1,7,8,9,40,41,64,65,68,69,1068,1069,2511,2512,4072,4073,4096,4097]]
 specs += [('bytes-'+str((off,raw.hex())),tr.mutate(tr.feeconfig,off,raw))for off,raw in [(0,bytes(8)),(0,b'\xff'),(65,b'\xff'*4),(65,b'\0'*4),(1069,b'\xff'*4),(1069,b'\0'*4)]]
 for name in ['buy_v2','buy_exact_quote_in_v2','sell_v2']:
  for label,mutation in specs:
   pair=[]
   for binary in [None,a.candidate]:
    old=len(trace)
    tr.trade(name, 10**7 if name=='buy_exact_quote_in_v2' else 10**10,
             10**9 if name=='buy_v2' else 1, overrides=mutation, candidate=binary)
    assert len(trace)==old+1;pair.append(trace[-1])
   assert pair[0]['transaction_base64']==pair[1]['transaction_base64']and pair[0]['before']==pair[1]['before']
   rows.append({'case':{'op':name,'name':label},'original':pair[0],'candidate':pair[1],'match':normalized(pair[0])==normalized(pair[1])})
 report={'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'script_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'scope':'Every signature, identical signed input and full nonexecutable transaction-account prestate checked; all metadata/state/logs compared except consumed compute and source coordinates. Synthetic boundary fixtures.','case_count':len(rows),'mismatches':[i for i,x in enumerate(rows)if not x['match']],'cases':rows}
 a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_bytes(gzip.compress((json.dumps(report,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({k:v for k,v in report.items()if k!='cases'}))
if __name__=='__main__':main()
