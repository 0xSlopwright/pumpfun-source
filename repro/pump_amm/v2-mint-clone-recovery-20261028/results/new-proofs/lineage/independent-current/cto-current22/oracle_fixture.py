"""Synthetic local CPI caller substituted for Pump; normal signatures and invoke_signed rules remain enabled."""
from pathlib import Path
import argparse,base64,hashlib,json,re,struct,sys
ROOT=next((p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file()),Path.cwd())
sys.path.insert(0,str(ROOT/'scripts'))
import pump_amm_creator_reassignment_cto_differential as h
from solders.account import Account
from solders.instruction import AccountMeta,Instruction
from solders.litesvm import LiteSVM
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata
from solders.compute_budget import set_compute_unit_limit
from solders.clock import Clock
from solders.pubkey import Pubkey
W=Path(__file__).resolve().parent
ORIGINAL=ROOT/'evidence/original/pump_amm/deployed.so'
def clean(logs):return [re.sub(r'(?<=thrown in )[^\s:]+:[0-9]+','<source>',v)for v in logs if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)]
def run(case,binary):
 vm=LiteSVM().with_sigverify(True).with_transaction_history(0);vm.add_program_from_file(h.PUMP,W/'synthetic-cpi-caller.so');vm.add_program_from_file(h.AMM,binary);vm.set_clock(Clock(1000,0,0,0,1700000000))
 vm.set_account(h.PAYER.pubkey(),Account(case.get('payer_lamports',10**12),b'',Pubkey.default()))
 quote=Pubkey.from_bytes(bytes([81])*32)if case.get('exotic')else h.QUOTE
 pool,bump=Pubkey.find_program_address([b'pool',bytes(2),bytes(h.POOL_AUTH),bytes(h.MINT),bytes(quote)],h.AMM)
 cfg=bytearray(h.amm.RAW)
 if case.get('exotic'):cfg[940]=1;struct.pack_into('<Q',cfg,941,100)
 vm.set_account(h.amm.CONFIG_KEY,Account(10**9,bytes(cfg),h.AMM))
 data=bytearray(hashlib.sha256(b'account:Pool').digest()[:8]+bytes([bump])+bytes(2)+bytes(h.POOL_AUTH)+bytes(h.MINT)+bytes(quote)+bytes(96)+bytes(8)+bytes(h.SHARING)+bytes(2)+bytes(16));data.extend(bytes(301-len(data)))
 for offset,value in case.get('patches',[]):data[offset:offset+len(bytes.fromhex(value))]=bytes.fromhex(value)
 data=data[:case.get('length',301)];vm.set_account(pool,Account(1,bytes(data),h.AMM))
 authority=h.OTHER.pubkey() if case.get('wrong_authority') else h.POOL_AUTH
 for key in [authority,h.amm.EVENT,h.MINT]:vm.set_account(key,Account(10**9,b'',Pubkey.default()))
 creator=Pubkey.from_string(case.get('coin_creator',str(h.OTHER.pubkey())));fee=b'\x00'if 'fee'not in case else b'\x01'+struct.pack('<Q',case['fee']);payload=bytes(next(v for v in h.amm.IDL['instructions']if v['name']=='admin_cto_pool')['discriminator'])+bytes(creator)+bytes([bool(case.get('holder',False))])+fee
 keys=[h.PAYER.pubkey(),h.amm.CONFIG_KEY,pool,authority,Pubkey.default(),h.amm.EVENT,h.AMM,h.MINT];metas=[AccountMeta(k,i==0,i in [0,2])for i,k in enumerate(keys)]
 tx=Transaction.new_signed_with_payer([set_compute_unit_limit(1400000),Instruction(h.PUMP,payload,metas)],h.PAYER.pubkey(),[h.PAYER],vm.latest_blockhash());assert all(tx.verify_with_results());assert h.POOL_AUTH not in tx.message.account_keys[:tx.message.header.num_required_signatures]
 def snap():
  out={}
  for k in keys:
   a=vm.get_account(k)
   if a is None or not a.executable:out[str(k)]=None if a is None else {'data':a.data.hex(),'lamports':a.lamports,'owner':str(a.owner)}
  return out
 before=snap();result=vm.send_transaction(tx);bad=isinstance(result,FailedTransactionMetadata);meta=result.meta()if bad else result
 return {'error':str(result.err())if bad else None,'before':before,'after':snap(),'inner':json.loads(meta.to_json())['inner_instructions'],'logs':meta.logs(),'diagnostics':clean(meta.logs()),'events':[v for v in meta.logs()if v.startswith('Program data:')],'transaction_base64':base64.b64encode(bytes(tx)).decode(),'reached_amm':any('Instruction: AdminCtoPool'in v for v in meta.logs())}
