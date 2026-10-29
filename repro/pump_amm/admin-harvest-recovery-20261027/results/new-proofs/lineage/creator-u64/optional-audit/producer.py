"""Signed CreatePool optional-u64 short-read/non-consumption and following-boolean diagnostics."""
from pathlib import Path
import argparse,base64,hashlib,json,sys,struct
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_create_differential as h
from solders.litesvm import LiteSVM
from solders.transaction import Transaction
captured=[];underlying=LiteSVM.send_transaction

def snapshot(vm,keys):
 out={}
 for key in keys:
  a=vm.get_account(key)
  if a is not None and a.executable:continue
  out[str(key)]=None if a is None else dict(lamports=a.lamports,owner=str(a.owner),data_hex=bytes(a.data).hex())
 return out

def send(vm,tx):
 assert tx.signatures and all(tx.verify_with_results());before=snapshot(vm,tx.message.account_keys);raw=bytes(tx);result=underlying(vm,tx);assert bytes(tx)==raw;captured.append({'transaction_base64':base64.b64encode(raw).decode(),'before':before,'after':snapshot(vm,tx.message.account_keys)});return result
LiteSVM.send_transaction=send

def cases():
 out=[];tails=[b'',b'\0',b'\1',b'\2',b'\0\1',b'\1\0',b'\1\1',b'\0\0\xff']
 for n in range(8):
  for prefix in ([b'']if n==0 else [bytes([marker])+bytes(n-1)for marker in [0,1,2,255]]):
   for tail in tails:out.append({'kind':'short-prefix','prefix_bytes':n,'prefix_hex':prefix.hex(),'following_hex':tail.hex(),'optional_hex':(b'\0'+prefix+tail).hex(),'bytes_available_to_u64':len(prefix+tail)})
 for value in [0,1,25,(1<<64)-1]:
  for tail in tails:out.append({'kind':'full-u64','value':value,'following_hex':tail.hex(),'optional_hex':(b'\0'+struct.pack('<Q',value)+tail).hex(),'bytes_available_to_u64':8+len(tail)})
 assert len(out)==264
 return out

def run(candidate):
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();rows=[]
 for case in cases():
  pair=[]
  for binary in [ROOT/'evidence/original/pump_amm/deployed.so',a.candidate]:
   n=len(captured);value=h.create(candidate=binary,optional=bytes.fromhex(case['optional_hex']));assert len(captured)==n+1;cap=captured[-1];value.update(full_before=cap['before'],full_after=cap['after'],transaction_base64=cap['transaction_base64']);pair.append(value)
  assert pair[0]['transaction_base64']==pair[1]['transaction_base64']and pair[0]['full_before']==pair[1]['full_before'];x,y=pair;rows.append({'case':case,'original':x,'candidate':y,'diff':[k for k in x if k!='logs'and x[k]!=y[k]]})
 sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest();out={'scope':__doc__,'original_sha256':sha(ROOT/'evidence/original/pump_amm/deployed.so'),'candidate_sha256':sha(a.candidate),'producer_sha256':sha(__file__),'case_count':len(rows),'mismatches':[i for i,r in enumerate(rows)if r['diff']],'cases':rows};a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_text(json.dumps(out,separators=(',',':'))+'\n');print(json.dumps({'cases':len(rows),'mismatches':len(out['mismatches']),'indices':out['mismatches']}))
if __name__=='__main__':run(None)
