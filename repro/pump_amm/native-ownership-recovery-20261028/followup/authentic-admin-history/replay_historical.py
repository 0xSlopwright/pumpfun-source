from pathlib import Path
import base64,hashlib,json
from solders.account import Account
from solders.litesvm import LiteSVM
from solders.pubkey import Pubkey
from solders.transaction import VersionedTransaction
from solders.transaction_metadata import FailedTransactionMetadata
W=Path(__file__).resolve().parent;R=W.parents[1];SIG='2gNxbFQQmCsMaq7QYZkBxgeb2fcy5rsvQV9Mv9LzzoMtek9NbNWDzqqDcd4kfu8VeZFrf5FMqdeVw2YDpwJJYZTN'
rpc=json.loads((W/'transactions'/(SIG+'.response.json')).read_text())['result'];raw=base64.b64decode(rpc['transaction'][0]);tx=VersionedTransaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)
AMM=Pubkey.from_string('pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA');keys=list(tx.message.account_keys);assert str(keys[0])=='8LWu7QM2dGR1G8nKDHthckea57bkCzXyBTAKPJUBDHo8';ix=tx.message.instructions[0];assert keys[ix.program_id_index]==AMM and len(ix.data)==280
out=[]
for label,p in [('original',R/'evidence/original/pump_amm/deployed.so'),('h14',R/'work/amm-inverse-route-combined-20261028/build/artifacts/pump_amm_recovered.so')]:
 vm=LiteSVM().with_sigverify(True).with_blockhash_check(False);vm.add_program_from_file(AMM,p)
 vm.set_account(keys[0],Account(rpc['meta']['preBalances'][0],b'',Pubkey.default()))
 result=vm.send_transaction(tx);failed=isinstance(result,FailedTransactionMetadata);meta=result.meta()if failed else result
 out.append({'label':label,'program_sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'error':str(result.err())if failed else None,'logs':meta.logs(),'compute_units':meta.compute_units_consumed()})
report={'signature':SIG,'transaction_sha256':hashlib.sha256(raw).hexdigest(),'signed_payload_bytes':280,'current_idl_required_payload_bytes':320,'all_original_signatures_verified':all(checks),'signature_verification_enabled':True,'blockhash_expiry_check_enabled':False,'message_changed':False,'historical_full_prestate_available':False,'payer_prebalance_from_rpc':rpc['meta']['preBalances'][0],'payer_system_empty_data_inferred':True,'scope':'Exact historical signed transaction, current executable and minimal payer state. Only expiry check disabled for old hash. This early instruction decode test is not an original historical execution replay or matching full-prestate success proof.','runs':out}
(W/'historical-replay.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
