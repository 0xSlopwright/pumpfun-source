#!/usr/bin/env python3
"""Independently verify the unchanged 18 common-wallet witnesses on this exact composition."""
from pathlib import Path
import base64,gzip,hashlib,json
if not __debug__:raise SystemExit('Optimized Python is unsupported.')
from solders.transaction import VersionedTransaction
P=Path(__file__).resolve().parent;sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();raw=(P/'runtime/admin-wallet.json.gz').read_bytes();x=json.loads(gzip.decompress(raw)if raw.startswith(b'\x1f\x8b')else raw);assert len(x['cases'])==x['case_count']==18 and not x['candidate_mismatches']and len(x['baseline_mismatches'])==8
candidate=sha(P/'builds/primary/candidate.so');assert candidate in x['inputs'].values();assert x['producer_sha256'] in x['inputs'].values();cases=txs=sigs=0
messages=lambda r:[s for s in r['logs']if s.startswith(('Program log: ','Program data: '))]
for row in x['cases']:
 a,b=row['original'],row['candidate'];assert messages(a)==messages(b)
 for k in ['error','before','after','events','inner','return']:assert a[k]==b[k]
 assert a['transaction_base64']==row['baseline']['transaction_base64']==b['transaction_base64']
 for result in [a,row['baseline'],b]:
  assert not result['pool_authority_top_level_signer'];tx=VersionedTransaction.from_bytes(base64.b64decode(result['transaction_base64'],validate=True));assert all(tx.verify_with_results());txs+=1;sigs+=len(tx.signatures)
 cases+=1
assert(cases,txs,sigs)==(18,54,108);loader=json.loads((P/'runtime/admin-wallet-loader.json').read_text());assert any(r['elf_sha256']==candidate for r in loader['loads']);assert all(r['elf_prefix_unchanged']and r['zero_allocation_tail']and r['program_bytes']==36 and r['programdata_bytes']==10485760 for r in loader['loads'])
result={'candidate_sha256':candidate,'cases':cases,'executed_transactions':txs,'signature_fields_verified':sigs,'candidate_structured_or_strict_message_mismatches':0,'baseline_mismatch_cases':x['baseline_mismatches'],'source_normalization':None,'pool_authority_top_level_signer':False,'captured_loader_loads':len(loader['loads'])};(P/'ADMIN-WALLET-VERIFIED.json').write_text(json.dumps(result,indent=2)+'\n') if '--no-write' not in __import__('sys').argv else None;print(json.dumps(result,indent=2))
