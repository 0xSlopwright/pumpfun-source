#!/usr/bin/env python3
"""Replay immutable signed PR616/651 cases against one explicitly bound fresh source image."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys,tempfile
if not __debug__:raise SystemExit('Run without -O; assertions authenticate replay inputs.')
P=Path(__file__).resolve().parent;R=P.parents[1];sys.path.insert(0,str(R));from native_binding import bind,CONTROL_STRIP
from solders.account import Account
from solders.clock import Clock
from solders.pubkey import Pubkey
from solders.transaction import Transaction
from solders.transaction_metadata import FailedTransactionMetadata
from solders.litesvm import LiteSVM
sha=lambda b:hashlib.sha256(b).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--control-directory',type=Path,required=True);p.add_argument('--candidate-directory',type=Path,required=True);p.add_argument('--kind',choices=['control','perhop','constructor','perhop-clock'],required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();binding=bind(a.control_directory,a.candidate_directory,a.kind);receipt_path=a.candidate_directory/'build-comparison.json';output=a.output.resolve();assert not output.exists();output.parent.mkdir(parents=True,exist_ok=True)
receipt=json.loads(receipt_path.read_text());candidate=(a.candidate_directory/'candidate.so').read_bytes();assert sha(candidate)==binding['candidate_sha256']==receipt['comparison']['candidate_sha256'];from solders.litesvm import LiteSVM;assert LiteSVM.__name__=='CapturedLiteSVM','Use the authenticated captured-loader wrapper';import pump_captured_loader as loader;loader.LOADS.clear()
baseline=(a.control_directory/'candidate.so').read_bytes();assert sha(baseline)==CONTROL_STRIP
main='6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';rows=[];stats={}
with tempfile.TemporaryDirectory(prefix='pump-create-boundary-')as temp:
 temp=Path(temp)
 for family,directory in [('616','pump-create-rejected-quote-keys-20261028'),('651','pump-create-v2-minimum-value-20261028')]:
  H=R/'research'/directory;manifest=json.loads((H/'MANIFEST.json').read_text())['files']
  def read(name):
   raw=(H/name).read_bytes();assert sha(raw)==manifest[name],name
   return gzip.decompress(raw)if raw.startswith(b'\x1f\x8b')else raw
  records=json.loads(read('runtime/cases.json.gz'));ids=json.loads(read('runtime/images.json'));programs={row['program_id']:read('runtime/images/'+name+'.so.gz')for name,row in ids.items()}
  for name,row in ids.items():assert sha(programs[row['program_id']])==row['sha256']
  images={'original':programs[main],'control':baseline,'candidate':candidate};mismatch={k:[]for k in ['control','candidate']};structured={k:[]for k in mismatch};sigfields=0
  for index,case in enumerate(records['cases']):
   frozen=case['results']['original'];raw=base64.b64decode(frozen['transaction_base64']);assert all(q['transaction_base64']==frozen['transaction_base64']for q in case['results'].values());tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results());results={}
   for label,image in images.items():
    vm=LiteSVM().with_transaction_history(0);vm.set_clock(Clock(100,1700000000,0,0,1700000000));selected=dict(programs);selected[main]=image
    for pid,blob in selected.items():path=temp/(pid+'.so');path.write_bytes(blob);vm.add_program_from_file(Pubkey.from_string(pid),path)
    for address,state in frozen['before'].items():
     if state is not None:vm.set_account(Pubkey.from_string(address),Account(state['lamports'],bytes.fromhex(state['data']),Pubkey.from_string(state['owner'])))
    assert str(tx.message.recent_blockhash)==str(vm.latest_blockhash());sent=vm.send_transaction(tx);failed=isinstance(sent,FailedTransactionMetadata);meta=sent.meta()if failed else sent;encoded=json.loads(meta.to_json());after={}
    for address in frozen['after']:
     account=vm.get_account(Pubkey.from_string(address));after[address]=None if account is None else{'lamports':account.lamports,'owner':str(account.owner),'data':bytes(account.data).hex()}
    results[label]={'transaction_base64':frozen['transaction_base64'],'signatures_verified':all(tx.verify_with_results()),'signature_fields':len(tx.signatures),'before':frozen['before'],'after':after,'error':str(sent.err())if failed else None,'logs':meta.logs(),'events':[q for q in meta.logs()if q.startswith('Program data:')],'inner':encoded['inner_instructions'],'return':encoded.get('return_data')};sigfields+=len(tx.signatures)
   fields=['before','after','error','events','inner','return'];assert all(results['original'][k]==frozen[k]for k in fields),(family,index,'original')
   messages=lambda result:[q for q in result['logs']if not __import__('re').fullmatch(r'Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units',q)];assert messages(results['original'])==messages(frozen),(family,index,'frozen original ordered logs')
   for label in mismatch:
    differences=[k for k in fields if results[label][k]!=results['original'][k]]
    if differences:structured[label].append({'case':index,'fields':differences})
    if messages(results[label])!=messages(results['original']):mismatch[label].append(index)
   rows.append({'family':family,'index':index,'input':case['input'],'results':results})
  stats[family]={'cases':len(records['cases']),'executed_transactions':len(records['cases'])*3,'signature_fields_verified':sigfields,'structured_mismatches':structured,'strict_ordered_program_message_mismatches':mismatch,'case_file_sha256':manifest['runtime/cases.json.gz'],'images_sha256':{k:sha(v)for k,v in images.items()}}
report={'scope':__doc__,'runner_sha256':sha(Path(__file__).read_bytes()),'build_receipt_sha256':sha(receipt_path.read_bytes()),'native_cold_binding':binding,'captured_loader_loads':list(loader.LOADS),'ordered_logs_policy':'all ordered lines retained except complete compute-meter lines; Source retained','source_coordinate_normalization':None,'families':stats,'cases':rows}
output.write_bytes(gzip.compress(json.dumps(report,indent=2).encode(),mtime=0));print(json.dumps(stats,indent=2));assert all(not q['structured_mismatches']['candidate']and not q['strict_ordered_program_message_mismatches']['candidate']for q in stats.values())
