"""Independent field, signed-wire, nonsigner and ordered-log checks for the CTO partial."""
from pathlib import Path
import base64,collections,hashlib,json,re
from solders.transaction import Transaction
from solders.pubkey import Pubkey
R=Path(__file__).resolve().parent;ROOT=R.parents[2]
d=json.loads((R/'observations.json').read_text());e=json.loads((R/'execution.json').read_text());l=json.loads((R/'loader.json').read_text())
assert e['returncode']==0 and not d['mismatches'] and d['case_count']==len(d['cases'])
for name,digest in e['input_sha256'].items():assert hashlib.sha256((ROOT/name).read_bytes()).hexdigest()==digest
for name,digest in d['provenance'].items():assert hashlib.sha256(Path(name).read_bytes()).hexdigest()==digest
cu=re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed \d+ of \d+ compute units$')
idl=json.loads((ROOT/'evidence/upstream/pump.json').read_text());ix=next(x for x in idl['instructions']if x['name']=='admin_cto')
pool_position=next(i for i,a in enumerate(ix['accounts'])if a['name']=='pool_authority')
disc=bytes(ix['discriminator']);pool_argument_headers_checked=0
signatures=0;structured=[];messages=[];logs=[];wires=[];outcomes=collections.Counter();examples=[]
for i,row in enumerate(d['cases']):
 a,b=row['original'],row['candidate']
 for q in [a,b]:
  tx=Transaction.from_bytes(base64.b64decode(q['transaction_base64']));tx.verify();signatures+=len(tx.signatures)
  assert q['signatures_verified']and q['pool_authority_top_level_signer']is False
  calls=[a for a in tx.message.instructions if bytes(a.data).startswith(disc)]
  assert len(calls)==1
  if len(calls[0].accounts)>pool_position:
   # The compiled message header, not the producer's descriptive Boolean,
   # determines top-level signer status even in wrong-key fixtures.
   key_index=calls[0].accounts[pool_position]
   assert key_index>=tx.message.header.num_required_signatures
   pool_argument_headers_checked+=1
  outcomes['success'if q['error']is None else'failure']+=1
 diff=[k for k in ['error','before','after','events','inner','return']if a[k]!=b[k]]
 if diff:structured.append({'index':i,'fields':diff})
 program=lambda q:[s for s in q['logs']if s.startswith(('Program log: ','Program data: '))]
 full=lambda q:[s for s in q['logs']if not cu.fullmatch(s)]
 if program(a)!=program(b):
  messages.append(i)
  if len(examples)<6:examples.append({'index':i,'case':row['case']['name'],'original':[s for s in program(a)if s not in program(b)],'candidate':[s for s in program(b)if s not in program(a)]})
 if full(a)!=full(b):logs.append(i)
 if a['transaction_base64']!=b['transaction_base64']:wires.append(i)
counts=collections.Counter(x['elf_sha256']for x in l['loads'])
assert counts[d['candidate_sha256']]==len(d['cases'])and counts[d['original_sha256']]==len(d['cases'])
assert all(x['elf_prefix_unchanged']and x['zero_allocation_tail']and x['program_bytes']==36 and x['programdata_bytes']==10485760 for x in l['loads'])
out={'scope':__doc__,'candidate_sha256':d['candidate_sha256'],'case_pairs':len(d['cases']),'signed_outcomes':2*len(d['cases']),'signature_fields_verified':signatures,'outcomes':dict(outcomes),'structured_difference_cases':structured,'strict_ordered_program_message_difference_cases':messages,'ordered_log_differences_excluding_only_compute_unit_usage':logs,'signed_wire_difference_pairs':wires,'captured_loader_loads':len(l['loads']),'source_coordinate_normalization':None,'pool_authority_argument_compiled_headers_checked':pool_argument_headers_checked,'pool_authority_argument_top_level_signer':False,'strict_message_examples':examples,'audit_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'whole_window_claimed':False}
(R/'audit.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
assert not structured
