"""Verify bounded upgradeable-account loading and saved policy observations; no VM."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json,re,struct
from solders.pubkey import Pubkey
from solders.transaction import Transaction
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';PUMP='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';OWNER='BPFLoaderUpgradeab1e11111111111111111111111';BAD=[19,20,22,23]
def H(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def B(b):return hashlib.sha256(b).hexdigest()
def J(p):
 p=Path(p);return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def module(name,p):
 s=importlib.util.spec_from_file_location(name,p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def clean(row):return dict(row,logs=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',s)for s in row['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',s)])
def profile(row,pid):
 matches=[m for s in row['logs']if(m:=re.fullmatch(r'Program (\w+) consumed (\d+) of (\d+) compute units',s))and m[1]==pid];m=matches[-1];return int(m[2]),int(m[3])
def verify(root=None):
 w=Path(root or Path(__file__).resolve().parent);files=J(w/'manifest.json')['files'];assert files=={str(p.relative_to(w)):H(p)for p in w.rglob('*')if p.is_file()and p!=w/'manifest.json'}
 prior=w/'prior-allocation';old=module('retained_h19_allocation',prior/'verify.py').verify(prior);candidate=old['candidate_sha256'];assert candidate=='dbb5dcfd1a1487e22d61ae68d22a9b74087b78a868a08ab974c7bdbb127f1500'
 baseline=J(prior/'baseline-policy/report.json');index=J(prior/'baseline-policy/program-index.json');original=baseline['original_sha256'];payloads={candidate:(prior/'candidate.so').read_bytes(),original:(prior/'baseline-policy/programs'/f'{original}.so').read_bytes()}
 cap=J(w/'capture/capture.json');program=(w/'capture/program-account.bin').read_bytes();programdata=(w/'capture/programdata-account.bin').read_bytes();header=programdata[:45];assert len(program)==36 and H(w/'capture/program-account.bin')==cap['program_sha256'];assert cap['owner']==OWNER and struct.unpack_from('<I',program)[0]==2 and str(Pubkey.from_bytes(program[4:]))==cap['programdata'];assert struct.unpack_from('<I',header)[0]==3 and struct.unpack_from('<Q',header,4)[0]==cap['last_deploy_slot'];assert B(programdata)==cap['programdata_sha256']and programdata[45:]==payloads[original]
 # Pinned runtime actually reloads executable account insertion from ProgramData.
 code=(prior/'versioned-runtime/litesvm-accounts_db.rs').read_text();start=code.index('pub(crate) fn add_account(');end=code.index('fn maybe_handle_sysvar_account',start);account_code=code[start:end];assert 'account.executable()'in account_code and 'self.load_program(&account)?'in account_code and '.replenish(pubkey, Arc::new(loaded_program))'in account_code
 start=code.index('} else if bpf_loader_upgradeable::check_id(owner)');end=code.index('} else if loader_v4::check_id(owner)',start);upgrade_code=code[start:end];assert 'program_account.state()'in upgrade_code and 'self.get_account(&programdata_address)'in upgrade_code and 'program_data.get(UpgradeableLoaderState::size_of_programdata_metadata()..)'in upgrade_code and 'ProgramCacheEntry::new('in upgrade_code
 assert 'let slot = self.sysvar_cache.get_clock().unwrap().slot;'in code
 producer=(w/'probe.py').read_text();observer=(w/'observe.py').read_text();assert 'b.acquire_harness('not in producer and 'vm.get_account(b.PROGRAM) is None'in producer and 'fresh_upgradeable(candidate)'in producer
 assert "assert str(program_id)!=AMM"in observer and 'self.get_account(key) is None'in observer and 'original_set(self,key,account)'in observer
 report=J(w/'report.json');obs=J(w/'transactions.json.gz');assert report['candidate_sha256']==candidate and report['original_sha256']==original and report['case_count']==24 and report['mismatch_count']==0
 assert report['producer_sha256']==obs['script_sha256']==H(w/'probe.py')and obs['observer_sha256']==H(w/'observe.py');assert obs['amm_legacy_loads_forbidden']and len(report['upgradeable_loads'])==len(obs['upgradeable_load_trace'])==48
 assert obs['transaction_count']==len(obs['transactions'])==48
 signatures=0;costs=[]
 for i,row in enumerate(report['cases']):
  assert row['input']==baseline['cases'][i]['input'];assert clean(row['original'])==clean(row['candidate'])and not row['different_fields'];pair=obs['transactions'][2*i:2*i+2]
  assert pair[0]['transaction_base64']==pair[1]['transaction_base64']==row['original']['transaction_base64']==row['candidate']['transaction_base64']==baseline['cases'][i]['original']['transaction_base64']
  for side,t,load,trace in zip(['original','candidate'],pair,report['upgradeable_loads'][2*i:2*i+2],obs['upgradeable_load_trace'][2*i:2*i+2]):
   sha=report[side+'_sha256'];payload=payloads[sha];pd=header+payload
   assert load['file_sha256']==load['payload_sha256']==sha and load['program_account_bytes']==36 and load['program_account_sha256']==B(program)and load['owner']==OWNER and load['programdata_key']==cap['programdata'];assert load['programdata_bytes']==len(pd)and load['programdata_sha256']==B(pd)and load['metadata_sha256']==B(header)
   assert load['fresh_vm_without_amm_legacy_load']and load['loader_cache_clock_slot']==100 and load['captured_deploy_slot']==cap['last_deploy_slot']
   assert trace['mode']=='upgradeable-account-load'and trace['fresh_amm_account_absent_before_load']and trace['owner']==OWNER and trace['sha256']==sha and trace['programdata_sha256']==B(pd)and trace['program_account_sha256']==B(program)
   tx=Transaction.from_bytes(base64.b64decode(t['transaction_base64']));checks=tx.verify_with_results();assert checks and all(checks)and t['all_signatures_verified']and len(checks)==t['signature_count'];signatures+=len(checks);assert B(bytes(tx))==t['transaction_sha256']and t['amm_program_sha256']==sha and t['error']==row[side]['error']and t['loader_accounts_unchanged'];assert t['logs_sha256']==B(json.dumps(row[side]['logs'],separators=(',',':')).encode())
   for pid,loaded in t['loaded_programs'].items():
    assert loaded['sha256']in index and index[loaded['sha256']]['program_id']==pid
    if pid==AMM:assert loaded==trace
  if i in BAD:
   assert row['original']['error']is None and row['candidate']['error']is None
   a,b=profile(row['original'],AMM),profile(row['candidate'],AMM);outer_a,outer_b=profile(row['original'],PUMP),profile(row['candidate'],PUMP);assert a[1]==b[1]and a[0]-b[0]==14 and outer_a[0]-outer_b[0]==14
   costs.append({'case':i,'equal_amm_entry_budget':a[1],'original_amm_units':a[0],'candidate_amm_units':b[0],'original_outer_units':outer_a[0],'candidate_outer_units':outer_b[0]})
 assert signatures==48
 controls=J(w/'cache-controls.json');assert controls['candidate_sha256']==candidate and controls['script_sha256']==H(w/'cache_controls.py');assert len(controls['negative_loads'])==3 and all(x['rejected']for x in controls['negative_loads']);assert controls['programdata_write_alone_does_not_reload_cache']and controls['executable_program_reinsertion_reloads_cache']
 names=['fresh_amm_result','programdata_only_replacement_result','program_account_reloaded_result','fresh_distinct_payload_result'];canaries=[controls[x]for x in names];assert len({x['transaction_base64']for x in canaries})==1
 for row in canaries:
  tx=Transaction.from_bytes(base64.b64decode(row['transaction_base64']));checks=tx.verify_with_results();assert checks and all(checks)and row['all_signatures_verified']and len(checks)==row['signature_count'];assert B(bytes(tx))==row['transaction_sha256']
 assert canaries[0]['error']==canaries[1]['error']and canaries[2]['error']==canaries[3]['error']and canaries[0]['error']!=canaries[2]['error'];assert controls['signatures']==4
 return {'passed':True,'candidate_sha256':candidate,'original_sha256':original,'policy_cases':24,'canonical_cpi_cases':12,'direct_cases':12,'policy_mismatches':0,'policy_signature_fields':48,'formerly_failing_cases_now_successful':4,'negative_programdata_loads_rejected':3,'cache_selection_control_signatures':4,'program_account_bytes':36,'original_programdata_bytes':len(header)+len(payloads[original]),'candidate_programdata_bytes':len(header)+len(payloads[candidate]),'captured_owner':OWNER,'no_amm_legacy_load':True,'fresh_amm_loads':48,'programdata_only_replacement_does_not_reload':True,'explicit_program_reinsertion_reloads':True,'bounded_upgradeable_loader_representation_verified':True,'deployment_slot_and_lifecycle_semantics_verified':False,'cache_clock_slot':100,'captured_deployment_slot':cap['last_deploy_slot'],'intrinsic_amm_compute_gap':14,'broad_compute_parity_verified':False,'live_reachability_verified':False,'four_case_costs':costs,'retained_raw_default_mismatches':old['raw_default_resource_mismatches_preserved'],'retained_allocation_cases':old['equal_allocation_control_cases'],'manifest_sha256':H(w/'manifest.json')}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
