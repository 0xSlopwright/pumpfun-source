"""Bounded signed Disable flag and parser controls; no chain/RPC access."""
from pathlib import Path
import argparse,base64,gzip,hashlib,itertools,json,sys,types
sys.dont_write_bytecode=True
R=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(R/'scripts'))
import pump_amm_admin_differential as h
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata
captured=[];send=LiteSVM.send_transaction
def snapshot(vm,tx):
 result={}
 for key in tx.message.account_keys:
  a=vm.get_account(key)
  if a is None or not a.executable:result[str(key)]=None if a is None else {'lamports':a.lamports,'data_hex':bytes(a.data).hex(),'owner':str(a.owner)}
 return result
def capture(vm,tx):
 before=snapshot(vm,tx);result=send(vm,tx);failed=isinstance(result,FailedTransactionMetadata);meta=result.meta()if failed else result
 captured.append({'before':before,'after':snapshot(vm,tx),'transaction_base64':base64.b64encode(bytes(tx)).decode(),'error':str(result.err())if failed else None,'logs':meta.logs(),'inner':json.loads(meta.to_json())['inner_instructions'],'return_data':json.loads(meta.to_json()).get('return_data')});return result
LiteSVM.send_transaction=capture
def cases():
 out=[{'name':f'flags-{prior}-{bits}','prior':prior,'args':bytes(bits).hex(),'mutation':None}for prior in [0,31,224,255]for bits in itertools.product([0,1],repeat=5)]
 out +=[{'name':m,'prior':255,'args':'0000000100','mutation':m}for m in ['outsider','unsigned','readonly','owner','discriminator','truncated','event','noncanonical_config','program']]
 out +=[{'name':f'invalid-bool-{i}','prior':255,'args':(bytes(i)+b'\2'+bytes(4-i)).hex(),'mutation':None}for i in range(5)]
 out +=[{'name':f'short-{n}','prior':255,'args':bytes(n).hex(),'mutation':None}for n in range(5)]
 out +=[{'name':'trailing','prior':255,'args':(bytes(5)+b'ignored').hex(),'mutation':None}]
 return out
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();assert not a.output.exists();left=h.Harness(R/'evidence/original/pump_amm/deployed.so');right=h.Harness(a.candidate);rows=[]
 for spec in cases():
  i=len(captured);x=left.query(bytes.fromhex(spec['args']),spec['prior'],spec['mutation']);y=right.query(bytes.fromhex(spec['args']),spec['prior'],spec['mutation']);assert len(captured)==i+2;u,v=captured[i:];assert u['transaction_base64']==v['transaction_base64'] and u['before']==v['before'];rows.append({'case':spec,'original':u,'candidate':v,'query_original':x,'query_candidate':y})
 report={'original_sha256':hashlib.sha256((R/'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),'candidate_sha256':hashlib.sha256(a.candidate.read_bytes()).hexdigest(),'producer_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'cases':rows};a.output.write_bytes(gzip.compress((json.dumps(report,separators=(',',':'))+'\n').encode(),mtime=0));print(json.dumps({'cases':len(rows),'transactions':len(captured)}))
if __name__=='__main__':main()
