from pathlib import Path
import base64,hashlib,json,os
from solders.account import Account
from solders.clock import Clock
from solders.instruction import Instruction
from solders.keypair import Keypair
from solders.litesvm import LiteSVM
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata
W=Path(__file__).parent;I=Path(os.environ['AMM_RUNTIME_ROOT'])
CAP=json.loads((Path(os.environ['AMM_CAPTURE_ROOT'])/'capture.json').read_text());AMM=Pubkey.from_string(CAP['program']);PD=Pubkey.from_string(CAP['programdata']);OWNER=Pubkey.from_string(CAP['owner']);PROGRAM=(Path(os.environ['AMM_CAPTURE_ROOT'])/'program-account.bin').read_bytes();HEADER=(Path(os.environ['AMM_CAPTURE_ROOT'])/'programdata-account.bin').read_bytes()[:45];PAYER=Keypair.from_seed(bytes([201])*32)
H=lambda b:hashlib.sha256(b).hexdigest()
def vm():
 v=LiteSVM().with_transaction_history(0);v.set_clock(Clock(100,1234567890,0,0,1234567890));v.airdrop(PAYER.pubkey(),10**12);assert v.get_account(AMM)is None;return v
def put_pd(v,payload):v.set_account(PD,Account(CAP['lamports'],HEADER+payload,OWNER,False))
def put_program(v):v.set_account(AMM,Account(10**9,PROGRAM,OWNER,True))
def send(v):
 tx=Transaction.new_signed_with_payer([Instruction(AMM,b'\xff',[])],PAYER.pubkey(),[PAYER],v.latest_blockhash());checks=tx.verify_with_results();assert all(checks);r=v.send_transaction(tx);failed=isinstance(r,FailedTransactionMetadata);m=r.meta()if failed else r
 return {'transaction_base64':base64.b64encode(bytes(tx)).decode(),'transaction_sha256':H(bytes(tx)),'signature_count':len(checks),'all_signatures_verified':all(checks),'error':str(r.err())if failed else None,'logs':m.logs()}
negative=[]
for name,data in [('missing_programdata',None),('short_programdata',b'\0'*44),('invalid_programdata_elf',HEADER+b'not-an-elf')]:
 v=vm()
 if data is not None:v.set_account(PD,Account(CAP['lamports'],data,OWNER,False))
 try:put_program(v)
 except Exception as e:negative.append({'case':name,'rejected':True,'error':str(e)});continue
 raise AssertionError(name+' unexpectedly loaded')
amm=Path(os.environ['AMM_CANDIDATE']).read_bytes();token=(I/'evidence/dependencies/spl_token/deployed.so').read_bytes()
v=vm();put_pd(v,amm);put_program(v);before=send(v)
put_pd(v,token);stale=send(v)
put_program(v);reloaded=send(v)
v2=vm();put_pd(v2,token);put_program(v2);fresh_token=send(v2)
assert before['error']==stale['error'] and before['logs']==stale['logs']
assert reloaded['error']==fresh_token['error'] and reloaded['logs']==fresh_token['logs']
assert before['error']!=reloaded['error']
r={'negative_loads':negative,'candidate_sha256':H(amm),'distinct_payload_sha256':H(token),'program_account_sha256':H(PROGRAM),'programdata_header_sha256':H(HEADER),'fresh_amm_result':before,'programdata_only_replacement_result':stale,'program_account_reloaded_result':reloaded,'fresh_distinct_payload_result':fresh_token,'programdata_write_alone_does_not_reload_cache':True,'executable_program_reinsertion_reloads_cache':True,'all_fresh_policy_vms_avoid_stale_cache':True,'signatures':sum(x['signature_count']for x in [before,stale,reloaded,fresh_token]),'script_sha256':H(Path(__file__).read_bytes())};Path(os.environ['AMM_CACHE_OUTPUT']).write_text(json.dumps(r,indent=2)+'\n');print({k:r[k]for k in ['candidate_sha256','programdata_write_alone_does_not_reload_cache','executable_program_reinsertion_reloads_cache','signatures']});print('canary errors',before['error'],reloaded['error'])
