#!/usr/bin/env python3
"""Replay PR616 frozen signed create cases against an explicitly selected exact image."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys,tempfile
if not __debug__:raise SystemExit('Optimized Python is unsupported; run without -O.')
P=Path(__file__).resolve().parent;R=P.parents[2];sys.path.insert(0,str(R/'scripts'))
from solders.account import Account
from solders.clock import Clock
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata
from solders.litesvm import LiteSVM
p=argparse.ArgumentParser(description=__doc__);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--baseline',type=Path);p.add_argument('--expected-payload',choices=['present','absent'],default='present');p.add_argument('--output',type=Path,required=True);a=p.parse_args()
H=R/'research/pump-create-rejected-quote-keys-20261028';sha=lambda b:hashlib.sha256(b).hexdigest();manifest=json.loads((H/'MANIFEST.json').read_text())['files']
def read(name):
 raw=(H/name).read_bytes();assert sha(raw)==manifest[name];return gzip.decompress(raw)if raw.startswith(b'\x1f\x8b')else raw
records=json.loads(read('runtime/cases.json.gz'));ids=json.loads(read('runtime/images.json'));programs={row['program_id']:read('runtime/images/'+name+'.so.gz')for name,row in ids.items()}
for name,row in ids.items():assert sha(programs[row['program_id']])==row['sha256']
main='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';images={'original':programs[main],'candidate':a.candidate.read_bytes()}
if a.baseline:images['baseline']=a.baseline.read_bytes()
rows=[];sigs=txs=0
with tempfile.TemporaryDirectory(prefix='pump616-image-replay-')as tmp:
 tmp=Path(tmp)
 for case in records['cases']:
  frozen=case['results']['original'];raw=base64.b64decode(frozen['transaction_base64']);assert all(frozen['transaction_base64']==r['transaction_base64']for r in case['results'].values());tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results())and len(tx.signatures)==2;results={}
  for label,image in images.items():
   vm=LiteSVM().with_transaction_history(0);vm.set_clock(Clock(100,1700000000,0,0,1700000000));selected=dict(programs);selected[main]=image
   for pid,blob in selected.items():f=tmp/(pid+'.so');f.write_bytes(blob);vm.add_program_from_file(Pubkey.from_string(pid),f)
   for key,state in frozen['before'].items():
    if state is not None:vm.set_account(Pubkey.from_string(key),Account(state['lamports'],bytes.fromhex(state['data']),Pubkey.from_string(state['owner'])))
   assert str(tx.message.recent_blockhash)==str(vm.latest_blockhash());sent=vm.send_transaction(tx);failed=isinstance(sent,FailedTransactionMetadata);meta=sent.meta()if failed else sent;encoded=json.loads(meta.to_json());after={}
   for key in frozen['after']:
    account=vm.get_account(Pubkey.from_string(key));after[key]=None if account is None else{'lamports':account.lamports,'owner':str(account.owner),'data':bytes(account.data).hex()}
   results[label]={'transaction_base64':frozen['transaction_base64'],'signature_fields':len(tx.signatures),'signatures_verified':all(tx.verify_with_results()),'before':frozen['before'],'after':after,'error':str(sent.err())if failed else None,'logs':meta.logs(),'events':[x for x in meta.logs()if x.startswith('Program data:')],'inner':encoded['inner_instructions'],'return':encoded.get('return_data')};txs+=1;sigs+=len(tx.signatures)
  fields=['before','after','error','events','inner','return'];assert all(results['original'][k]==frozen[k]for k in fields)
  diffs={label:[k for k in fields if results[label][k]!=results['original'][k]]for label in results if label!='original'};assert not any(diffs.values())
  messages=lambda x:[v for v in x['logs']if v.startswith(('Program log: ','Program data: '))]
  # Preserve raw messages. Compare only this explicitly disclosed reconstructed Source coordinate separately.
  comparable=lambda x:[v.replace('create_v2.rs:220.','create_v2.rs:70.')for v in messages(x)]
  payload={};expected=[]
  if case['rejected']:
   banned=case['input']['quote_pubkey'];expected=['Program log: Left:','Program log: '+banned,'Program log: Right:','Program log: '+banned]
   for label,result in results.items():
    at=next(i for i,line in enumerate(result['logs'])if 'Error Code: UnsupportedQuoteMint. Error Number: 6063.'in line);payload[label]=result['logs'][at+1:at+5]==expected
   assert payload['original'];assert payload['candidate']==(a.expected_payload=='present')
  else:assert results['original']['error']is None
  ordered={label:comparable(result)==comparable(results['original'])for label,result in results.items()}
  if a.expected_payload=='present':assert ordered['candidate']
  rows.append({'input':case['input'],'rejected':case['rejected'],'token2022':case['token2022'],'structured_differences':diffs,'ordered_program_messages_equal_except_declared_source':ordered,'compared_payload_present':payload,'results':results})
report={'scope':__doc__,'frozen_case_file_sha256':manifest['runtime/cases.json.gz'],'producer_sha256':sha(Path(__file__).read_bytes()),'image_sha256':{n:sha(b)for n,b in images.items()},'case_count':len(rows),'executed_transactions':txs,'signature_fields_verified':sigs,'expected_candidate_payload':a.expected_payload,'declared_source_residue':{'original':220,'candidate':70},'candidate_payload_mismatch_cases':[r['input']['case']for r in rows if r['rejected']and not r['compared_payload_present']['candidate']],'cases':rows}
a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_bytes(gzip.compress(json.dumps(report,indent=2).encode(),mtime=0));print(json.dumps({k:report[k]for k in ['case_count','executed_transactions','signature_fields_verified','candidate_payload_mismatch_cases']},indent=2))
