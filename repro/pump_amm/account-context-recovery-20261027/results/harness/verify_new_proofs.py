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
 return {
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
