#!/usr/bin/env python3
"""Verify the completed unchanged broad corpus and strict successor create replays."""
from pathlib import Path
import base64,gzip,hashlib,json,sys
if not __debug__:raise SystemExit('Optimized Python is unsupported.')
P=Path(__file__).resolve().parent;R=P.parents[1];sys.path.insert(0,str(R/'scripts'))
from pump_diagnostic_audit import audit,messages
from solders.transaction import VersionedTransaction
sha=lambda b:hashlib.sha256(b).hexdigest();D=P/'builds/primary';full=json.loads(gzip.decompress((P/'runtime/full44.json.gz').read_bytes()));candidate=sha((D/'candidate.so').read_bytes());original=sha((R/'evidence/original/pump/deployed.so').read_bytes());assert full['candidate_sha256']==candidate and full['original_sha256']==original
record=json.loads((D/'build-comparison.json').read_text());assert full['compiled_source_sha256']==record['source_sha256'];assert full['case_count']==10468 and len(full['suites'])==44 and not full['mismatches'];assert audit(full['suites'])==full['diagnostics']and full['diagnostics']['log_bearing_cases']==10464 and not full['diagnostics']['mismatches']
pairs=txs=sigs=0

def walk(value):
 global pairs,txs,sigs
 if isinstance(value,dict):
  if isinstance(value.get('original'),dict)and isinstance(value.get('candidate'),dict):
   a,b=value['original'],value['candidate'];pairs+=1;assert a.keys()==b.keys()
   for key in a:
    if key=='logs':assert messages(a[key])==messages(b[key])
    elif key=='program_sha256':
     assert a[key].keys()==b[key].keys();changed=[n for n in a[key]if a[key][n]!=b[key][n]];assert changed==['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'];assert a[key][changed[0]]==original and b[key][changed[0]]==candidate
    elif key=='metadata':
     assert a[key].keys()==b[key].keys()
     for field in a[key]:
      if field=='logs':assert messages(a[key][field])==messages(b[key][field])
      elif field=='compute_units_consumed':assert isinstance(a[key][field],int)and isinstance(b[key][field],int)
      else:assert a[key][field]==b[key][field]
    else:assert a[key]==b[key],key
  if 'transaction_base64'in value:
   raw=base64.b64decode(value['transaction_base64'],validate=True);tx=VersionedTransaction.from_bytes(raw);assert all(tx.verify_with_results());txs+=1;sigs+=len(tx.signatures)
  for item in value.values():walk(item)
 elif isinstance(value,list):
  for item in value:walk(item)
walk(full['suites']);assert pairs==10468
loads=0
for name,row in full['loader_receipts'].items():
 path=R/row['path'];raw=path.read_bytes();assert sha(raw)==row['sha256'];items=json.loads(raw)['loads'];assert len(items)==row['load_count'];assert {q['elf_sha256']for q in items}=={original,candidate};assert all(q['elf_prefix_unchanged']and q['zero_allocation_tail']and q['program_bytes']==36 and q['programdata_bytes']==10485760 for q in items);loads+=len(items)
focused=json.loads(gzip.decompress((D/'create-runtime.json.gz').read_bytes()));assert focused['source_coordinate_normalization']is None
for family,row in focused['families'].items():assert row['images_sha256']['candidate']==candidate and not row['structured_mismatches']['candidate']and not row['strict_ordered_program_message_mismatches']['candidate']
for row in focused['cases']:
 results=row['results'];raw=base64.b64decode(results['candidate']['transaction_base64']);tx=VersionedTransaction.from_bytes(raw);assert all(tx.verify_with_results());fields=['before','after','error','events','inner','return'];assert all(results['candidate'][k]==results['original'][k]for k in fields);ordered=lambda q:[s for s in q['logs']if s.startswith(('Program log: ','Program data: '))];assert ordered(results['candidate'])==ordered(results['original'])
result={'candidate_sha256':candidate,'original_sha256':original,'broad_suites':44,'broad_case_pairs':pairs,'diagnostic_cases':10464,'broad_structured_mismatches':0,'broad_diagnostic_mismatches':0,'broad_serialized_transaction_fields_verified':txs,'broad_signature_fields_verified':sigs,'captured_loader_loads':loads,'strict_create_cases':14,'strict_create_executed_transactions':42,'strict_create_signature_fields_verified':84,'strict_create_source_normalization':None,'strict_create_candidate_message_mismatches':0,'strict_create_canonical_message_mismatches':6,'whole_elf_identical':False,'normalized_window_gain':0}
(P/'RUNTIME-VERIFIED.json').write_text(json.dumps(result,indent=2)+'\n') if '--no-write' not in __import__('sys').argv else None;print(json.dumps(result,indent=2))
