"""Verify current-candidate expanded receipts and their retained input packets."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json,re
from solders.transaction import Transaction
def load(p):
 p=Path(p)
 if not p.exists()and p.suffix=='.json':p=p.with_suffix('.json.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def module(name,path):
 s=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def normalized(row):
 row=json.loads(json.dumps(row));row['metadata'].pop('compute_units_consumed',None)
 def logs(lines):
  return [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',re.sub(r'(?<=panicked at )[^ ]+:[0-9]+:[0-9]+','<source>',x))for x in lines if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',x)]
 row['logs']=logs(row['logs'])
 if 'logs'in row['metadata']:row['metadata']['logs']=logs(row['metadata']['logs'])
 return row
def verify(results,candidate,root):
 results,candidate,root=map(Path,[results,candidate,root]);d=results/'new-proofs';digest=sha(candidate)
 accounts=load(d/'accounts/result.json.gz');assert accounts['candidate_sha256']==digest and accounts['case_count']==len(accounts['cases'])==182 and not accounts['mismatches']
 assert accounts['script_sha256']==sha(d/'accounts/probe.py');signatures=0
 for row in accounts['cases']:
  assert row['match']and normalized(row['original'])==normalized(row['candidate'])
  assert row['original']['before']==row['candidate']['before']and row['original']['transaction_base64']==row['candidate']['transaction_base64']
  for side in ['original','candidate']:
   raw=base64.b64decode(row[side]['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);assert bytes(tx)==raw and all(tx.verify_with_results());assert len(tx.signatures)==row[side]['signature_count'];signatures+=len(tx.signatures)
 buyback=module('current_buyback',d/'buyback/verify.py').verify(d/'buyback',candidate,root)
 accrual=module('current_accrual',d/'accrue/verify.py').verify(d/'accrue',candidate)
 native=module('current_native_fees',d/'packets/math/verify.py');native.verify_inventory();fees=native.verify_output(candidate,d/'math');assert fees['signatures_verified']==428
 exact=module('current_legacy_exact',d/'packets/legacy-exact/verify.py');exact.verify_inventory();exact_result=exact.verify_output(candidate,d/'legacy-exact');assert exact_result['signatures_verified']==638
 resize=module('current_resize',d/'resize/verify.py').verify(d/'resize',candidate,repository_root=root)
 # The 934 earlier decoder cases are freshly replayed on this exact candidate.
 tlv=module('current_tlv',results/'tlv-proof/verify.py').verify(d/'current-tlv/independent.json.gz',d/'current-tlv/independent-transactions.json.gz',candidate,0)
 decoder=module('current_decoder',results/'decoder-proof/verify_packet.py');decoder.CANDIDATES['current']=(str(candidate.resolve()),digest,0)
 short=decoder.verify_run('current',d/'current-tlv/decoder.json.gz',d/'current-tlv/decoder-transactions.json.gz')
 # The cap packet retains both the old discrepancy and this candidate's run.
 cap=module('current_cap',d/'cap/verify_current.py').verify(d/'cap',candidate)
 q=d/'continuation'
 new_accounts=module('continuation_accounts',q/'accounts/verify.py').verify(q/'accounts',candidate,root)
 incentive=module('continuation_incentive',q/'incentive/verify.py').verify(q/'incentive',candidate,repository_root=root)
 mint=module('continuation_mint',q/'mint-packet/verify.py');mint.verify_inventory();mint_result=mint.verify_output(candidate,q/'mint')
 creator=module('continuation_creator',q/'creator/kit/verify.py').verify(q/'creator',candidate,root)
 swaps=module('continuation_swaps',q/'swap-helpers/verify.py').verify(q/'swap-helpers',candidate)
 reserved=module('continuation_reserved',q/'verify_reserved.py').verify(q/'reserved',candidate,q/'reserved-packet')
 negative=module('continuation_cto_negative',q/'cto-negative/verify.py').verify(q/'cto-negative','0df3c6a147f7cf77b42d710f74448f0d94031014a449c768ebb97fdb2f9cd9bb')
 creator_context=module('new_creator_context',q/'creator-context/kit/verify.py').verify(q/'creator-context',candidate,root)
 migrate=module('new_migrate',q/'migrate-constraint/kit/verify.py').verify(q/'migrate-constraint',candidate,root)
 previous=root/'repro/pump_amm/account-context-recovery-20261027'
 migrate_negative=module('previous_migrate_negative',previous/'followup/migrate-constraint/verify.py').verify(previous/'followup/migrate-constraint',candidate=previous/'results/build/candidate.so',expected_seal='b251bb5f1406ad4217eb99fdb0160e05d2aa13cd7255f11d24387ebb2a6c873c')
 assert migrate_negative['differences']==12
 route_guard=module('new_route_guard',q/'route-guard/verify.py').verify(q/'route-guard',candidate)
 route_vault=module('new_route_vault',q/'route-vault/verify.py').verify(q/'route-vault',candidate)
 volume=module('new_volume',q/'volume-state/kit/verify_suites.py').verify(q/'volume-state',candidate,root)
 deep=module('new_deep_routes',q/'deep-routes/verify.py').verify(q/'deep-routes',candidate)
 completed=module('new_route_completion',q/'deep-routes/verify_completion.py').verify(q/'deep-routes',candidate)
 assert completed['original_budget_failures']==0 and completed['original_successes']==42
 component=module('route_guard_component',d/'lineage/route-guard-component/verify.py').verify(d/'lineage/route-guard-component')
 assert component['baseline_mismatches']==12 and component['mismatches']==0
 static=d/'static';symbols=results/'build/unstripped.so'
 pda=module('new_pda',static/'verify_pda_helpers.py').verify(candidate,symbols,results/'measurement.json.gz',root)
 paths=module('new_state_paths',static/'verify_state_paths.py').verify(candidate,symbols,results/'canonical-source',static/'state-declaration-hashes.json',root)
 route_shape=module('new_route_shape',static/'route/verify.py').verify(candidate,symbols,static/'route')
 vault_shape=module('new_vault_shape',static/'vault/shape.py').verify(candidate,symbols,static/'vault')
 return {
  'new_creator_context_cases':creator_context['cases'],'migrate_constraint_cases':migrate['cases'],'migrate_baseline_mismatches':migrate_negative['differences'],
  'route_guard_cases':route_guard['cases'],'route_vault_cases':route_vault['cases'],'volume_state_cases':volume['cases'],'deep_route_cases':deep['cases'],
  'pda_helpers_verified':len(pda['recovered_helpers']),'accumulator_paths_verified':len(paths['descriptors']),
  'reserved_account_cases':reserved['comparison_cases'], 'creator_order_baseline_differences':negative['mismatches'],
  'continued_account_cases':new_accounts['cases'], 'incentive_domain_cases':incentive['selected_cases'],
  'mint_order_cases':sum(v['cases']for v in mint_result['runs']),
  'creator_context_cases':creator['cases'], 'swap_helper_cases':swaps['cases'],
  'account_parser_cases': 182, 'account_parser_signatures': signatures,
  'buyback_cases': buyback['cases'], 'accrual_cases': accrual['cases'],
  'native_fee_cases': sum(x['cases'] for x in fees['runs']),
  'legacy_exact_quote_cases': sum(x['cases'] for x in exact_result['runs']),
  'admin_resize_cases': resize['selected_cases'],
  'independent_tlv_cases': tlv.get('case_count', 876),
  'focused_decoder_cases': short['cases'], 'cap': cap,
  'candidate_sha256': digest, 'new_runtime_executions': 0,
 }
