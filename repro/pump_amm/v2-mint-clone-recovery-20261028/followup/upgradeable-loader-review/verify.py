"""Independent audit of the explicit upgradeable-account policy replay; no VM."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json,struct
from solders.transaction import Transaction
from solders.pubkey import Pubkey
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def J(p):
 p=Path(p);return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def verify(proof):
 w=Path(proof);seal=H(w/'manifest.json');assert seal=='3d56cc78fdc97fd6b7318d8e5f6f8dab899126b3d4790ab43434738f9b0684c6';s=importlib.util.spec_from_file_location('upgradeable_saved',w/'verify.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);parent=m.verify(w)
 cap=J(w/'capture/capture.json');pd=(w/'capture/programdata-account.bin').read_bytes();assert pd[12]==1 and str(Pubkey(pd[13:45]))==cap['upgrade_authority'];assert struct.unpack_from('<Q',pd,4)[0]==cap['last_deploy_slot']
 r=J(w/'report.json');obs=J(w/'transactions.json.gz');amm=cap['program'];pump='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';images=w/'prior-allocation/baseline-policy/programs';count=0
 for i,row in enumerate(r['cases']):
  for side,t,load in zip(['original','candidate'],obs['transactions'][2*i:2*i+2],obs['upgradeable_load_trace'][2*i:2*i+2]):
   wanted=r[side+'_sha256'];assert t['loaded_programs'][amm]['sha256']==wanted==load['sha256']and load['fresh_amm_account_absent_before_load']
   for pid,image in t['loaded_programs'].items():assert H(images/(image['sha256']+'.so'))==image['sha256']
   if row['input']['canonical']:assert t['loaded_programs'][pump]['sha256']==H(w/'caller.so')
   else:assert pump not in t['loaded_programs']
   tx=Transaction.from_bytes(base64.b64decode(t['transaction_base64']));assert all(tx.verify_with_results());ins=tx.message.instructions[0];assert str(tx.message.account_keys[ins.program_id_index])==(pump if row['input']['canonical']else amm)
   if row['input']['canonical']:assert str(tx.message.account_keys[ins.accounts[17]])==amm
   count+=len(tx.signatures)
 assert count==48
 c=J(w/'cache-controls.json');assert c['distinct_payload_sha256']==H(images/(c['distinct_payload_sha256']+'.so'))
 names=['fresh_amm_result','programdata_only_replacement_result','program_account_reloaded_result','fresh_distinct_payload_result'];canaries=[c[n]for n in names]
 for row in canaries:
  tx=Transaction.from_bytes(base64.b64decode(row['transaction_base64']));assert all(tx.verify_with_results());ins=tx.message.instructions[0];assert str(tx.message.account_keys[ins.program_id_index])==amm and bytes(ins.data)==b'\xff'and len(ins.accounts)==0
 assert canaries[0]['logs']==canaries[1]['logs']and canaries[2]['logs']==canaries[3]['logs']and canaries[0]['logs']!=canaries[2]['logs']
 assert {x['case']for x in c['negative_loads']}=={'missing_programdata','short_programdata','invalid_programdata_elf'}and all(x['rejected']for x in c['negative_loads'])
 return {'passed':True,'proof_manifest_sha256':seal,'candidate_sha256':r['candidate_sha256'],'policy_pairs':24,'signatures':48,'canary_signatures':4,'fresh_amm_upgradeable_loads':48,'former_four_legacy_failures_succeed':4,'no_amm_legacy_load':True,'programdata_bytes_and_cache_selection_verified':True,'captured_program_bytes':36,'captured_deployment_slot':cap['last_deploy_slot'],'synthetic_clock_slot':100,'deployment_lifecycle_semantics_verified':False,'all_dependencies_use_captured_loader_models':False,'live_reachability_verified':False,'broad_compute_parity_verified':False,'scope':'Independent signed message/image, captured authority/slot and cache canary audit. Fresh-Vm AMM representation verified; caller/token dependency loader setup and synthetic Clock remain distinct from a full cluster replica. No VM or compiler executed.'}
if __name__=='__main__':
 import sys;print(json.dumps(verify(sys.argv[1]),indent=2))
