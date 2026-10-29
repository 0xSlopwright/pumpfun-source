#!/usr/bin/env python3
"""Independently compare all five existing focused frontiers on the successor image."""
from pathlib import Path
import base64,gzip,hashlib,json,re
if not __debug__:raise SystemExit('Optimized Python is unsupported.')
from solders.transaction import VersionedTransaction
P=Path(__file__).resolve().parent;O=P/'runtime/sibling-focused';sha=lambda b:hashlib.sha256(b).hexdigest();candidate=sha((P/'builds/primary/candidate.so').read_bytes());runs=json.loads((O/'runs.json').read_text());assert len(runs)==5 and all(q['returncode']==0 and q['candidate_sha256']==candidate for q in runs)
units=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$');ordered=lambda r:[s for s in r['logs']if not units.fullmatch(s)];program=lambda r:[s for s in r['logs']if s.startswith(('Program log: ','Program data: '))]
cases=txs=sigs=loads=0;reports={}
for name,count in [('shared-buyback',20),('cost-overflow',6),('cashback',18),('cto',5),('shared-holder',12)]:
 raw=(O/(name+'.json.gz')).read_bytes();report=json.loads(gzip.decompress(raw));run=next(q for q in runs if q['name']==name);assert sha(raw)==run['report_sha256'];assert len(report['cases'])==count;cs=ct=ss=0
 for row in report['cases']:
  if name=='shared-buyback':outcomes={k:row[k]for k in ['original','control','candidate']};left,right=outcomes['original'],outcomes['candidate'];fields=['error','accounts','inner_instructions','event_payloads','return_data'];assert ordered(left)==ordered(right)
  elif name=='cost-overflow':outcomes=row['runs'];left,right=outcomes['original'],outcomes['proposal'];fields=['error','accounts','inner_instructions','event_payloads','return_data'];assert ordered(left)==ordered(right)
  else:outcomes={k:row[k]for k in ['original','baseline','candidate']};left,right=outcomes['original'],outcomes['candidate'];fields=['error','accounts','events','inner','return_data']if name=='cashback'else['error','before','after','events','inner','return'];assert program(left)==program(right)
  for key in fields:assert left[key]==right[key],(name,key)
  for result in outcomes.values():
   tx=VersionedTransaction.from_bytes(base64.b64decode(result['transaction_base64'],validate=True));assert all(tx.verify_with_results());ct+=1;ss+=len(tx.signatures)
  cs+=1
 loader=(O/(name+'-loader.json')).read_bytes();assert sha(loader)==run['loader_receipt_sha256'];items=json.loads(loader)['loads'];assert any(q['elf_sha256']==candidate for q in items);assert all(q['elf_prefix_unchanged']and q['zero_allocation_tail']and q['program_bytes']==36 and q['programdata_bytes']==10485760 for q in items);loads+=len(items);cases+=cs;txs+=ct;sigs+=ss;reports[name]={'cases':cs,'outcome_transactions':ct,'signature_fields_verified':ss,'candidate_semantic_or_ordered_message_mismatches':0}
assert cases==61 and txs==183
result={'candidate_sha256':candidate,'cases':cases,'outcome_transactions':txs,'signature_fields_verified':sigs,'captured_loader_loads':loads,'reports':reports,'source_coordinate_normalization':None};(P/'SIBLING-FOCUSED-VERIFIED.json').write_text(json.dumps(result,indent=2)+'\n') if '--no-write' not in __import__('sys').argv else None;print(json.dumps(result,indent=2))
