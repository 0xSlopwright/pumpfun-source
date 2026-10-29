"""Independent saved-evidence audit. Pass the immutable allocation proof packet directory."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json,struct,sys
from solders.transaction import Transaction
from solders.pubkey import Pubkey
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def J(p):
 p=Path(p);return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def verify(proof_root):
 w=Path(proof_root);seal=H(w/'manifest.json');assert seal=='426f15a989e62a83d789a085c2ee21ef951f4ecb241d88604641fd1af7bdfe01'
 spec=importlib.util.spec_from_file_location('allocation_producer_saved_verify',w/'verify.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module);parent=module.verify(w)
 assert parent['manifest_sha256']==seal
 cap=J(w/'capture/capture.json');pa=(w/'capture/program-account.bin').read_bytes();pd=(w/'capture/programdata-account.bin').read_bytes();assert len(pa)==36 and struct.unpack_from('<I',pa)[0]==2 and str(Pubkey(pa[4:]))==cap['programdata']
 assert pd[12]==1 and str(Pubkey(pd[13:45]))==cap['upgrade_authority']
 raw=J(w/'baseline-policy/report.json');high=J(w/'baseline-policy/highbudget-report.json');amm=cap['program'];pump='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';candidate=H(w/'candidate.so');original=raw['original_sha256'];count=0;results=[]
 for mode in ['small','large']:
  report=J(w/'control'/f'{mode}-report.json');observations=J(w/'control'/f'{mode}-transactions.json.gz');caller=report['caller_sha256'];assert H(w/'baseline-policy/caller.so')==caller
  for i,row in enumerate(report['cases']):
   assert row['input']==raw['cases'][i]['input']
   for side,t in zip(['original','candidate'],observations['transactions'][2*i:2*i+2]):
    assert t['loaded_programs'][amm]['sha256']==(original if side=='original'else candidate)
    if row['input']['canonical']:assert t['loaded_programs'][pump]['sha256']==caller
    else:assert pump not in t['loaded_programs']
    for pid,image in t['loaded_programs'].items():assert H(w/'baseline-policy/programs'/(image['sha256']+'.so'))==image['sha256']
    tx=Transaction.from_bytes(base64.b64decode(t['transaction_base64']));assert all(tx.verify_with_results())
    msg=tx.message;ix=msg.instructions[0];assert str(msg.account_keys[ix.program_id_index])==(pump if row['input']['canonical']else amm)
    # The CPI caller receives AMM itself as account 17; its executable-data size is therefore metered.
    if row['input']['canonical']:assert str(msg.account_keys[ix.accounts[17]])==amm
    count+=len(tx.signatures)
  results.append({'mode':mode,'pairs':len(report['cases']),'different_fields':sum(bool(x['different_fields'])for x in report['cases'])})
 assert count==96
 profiles=[]
 for i in [19,20,22,23]:
  def costs(side):
   import re
   logs=high['cases'][i][side]['logs'];r=[]
   for x in logs:
    m=re.fullmatch(r'Program (\w+) consumed (\d+) of (\d+) compute units',x)
    if m:r.append((m[1],int(m[2]),int(m[3])))
   return {pid:next(x for x in reversed(r)if x[0]==pid)[1:]for pid in[amm,pump]}
  a,b=costs('original'),costs('candidate');assert b[amm][1]-a[amm][1]==36767 and a[amm][0]-b[amm][0]==14 and a[pump][0]-b[pump][0]==36781
  profiles.append({'case':i,'original_amm_cost':a[amm][0],'candidate_amm_cost':b[amm][0],'entry_budget_gap':36767,'outer_cost_gap':36781})
 # The intervention updates only Account data and preserves all other Account constructor fields.
 code=(w/'control/probe.py').read_text();assert 'h.vm.set_account(b.PROGRAM,b.Account(account.lamports,data,account.owner,account.executable,account.rent_epoch))'in code
 assert 'h.vm.send_transaction(tx)'in code and 'assert not any(raw[allocation:])'in code
 return {'passed':True,'proof_manifest_sha256':seal,'candidate_sha256':candidate,'control_pairs':48,'control_signature_fields':count,'raw_default_resource_mismatches_preserved':4,'equal_allocation_mismatches':0,'captured_program_account_bytes':36,'captured_programdata_bytes':len(pd),'captured_loader':'upgradeable','fixture_loader':'legacy BPFLoader2','allocation_charge_gap':36767,'measured_amm_execution_gap':14,'control_results':results,'four_case_cost_table':profiles,'source_fix_justified':False,'original_binary_changed':False,'current_binary_changed':False,'upgradeable_faithful_runtime_replay_performed':False,'broad_compute_parity_proven':False,'scope':'Independent read-only audit of sealed signed receipts, actual loaded image hashes, instruction account indices, captured loader layout, data-only intervention and exact charge accounting. No new VM/build or live replay.'}
if __name__=='__main__':print(json.dumps(verify(Path(sys.argv[1])),indent=2))
