"""Offline verification of full-core and impacted event/context observations."""
from pathlib import Path
import base64,collections,gzip,hashlib,json,sys,types
from functools import cache
from solders.transaction import Transaction
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent;I=W/'runtime-inputs'
@cache
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read_payload(p):
 p=Path(p)
 if not p.exists():p=p.with_suffix(p.suffix+'.gz')
 data=p.read_bytes();return gzip.decompress(data)if data[:2]==b'\x1f\x8b'else data
def read(p):return json.loads(read_payload(p))
assert{str(p.relative_to(I)):sha(p)for p in I.rglob('*')if p.is_file()}==read(W/'runtime-inputs.json')
C=W/'build/artifacts/pump_amm_recovered.so';digest=sha(C);original=sha(I/'evidence/original/pump_amm/deployed.so')
p=I/'repro/pump_amm/transfer-abi-recovery-20261027/compare_direct_cached.py';direct=types.ModuleType('direct');direct.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),direct.__dict__)
core=direct.audit(W/'runtime',digest);assert(core['cases'],core['transactions'],core['signature_fields'],core['identical_signed_message_pairs'])==(17462,35074,35418,17537)and not core['mismatches']
summary=read(W/'runtime/summary.json');assert summary['candidate_sha256']==digest and summary['original_sha256']==original and summary['cases']==17462 and summary['inputs_unchanged']
assert summary['observer_sha256']==sha(I/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py');assert summary['replay_driver_sha256']==sha(I/'repro/pump_amm/transfer-abi-recovery-20261027/replay_parallel.py')
for k,v in summary['harness_sha256'].items():assert sha(I/k)==v
AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';deps={'6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':'evidence/original/pump/deployed.so','TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so','TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so','pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so','ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so'}
def leafs(x):
 if isinstance(x,dict):
  if 'transaction_base64'in x and 'logs'in x and 'error'in x:yield x
  else:
   for v in x.values():yield from leafs(v)
 elif isinstance(x,list):
  for v in x:yield from leafs(v)
def key(encoded,error,logs):return(encoded,error,json.dumps(logs,separators=(',',':')))
all_reports=collections.Counter();all_observed=collections.Counter();setup_count=0
for run in read(W/'runtime/progress.json'):
 suite=run['suite'];r=read(W/'runtime'/(suite+'.json'));obs=read(W/'runtime'/(suite+'-transactions.json.gz'));assert hashlib.sha256(read_payload(W/'runtime'/(suite+'.json'))).hexdigest()==run['receipt_sha256'];assert sha(W/'runtime'/(suite+'-transactions.json.gz'))==run['sidecar_sha256'];assert obs['observer_sha256']==summary['observer_sha256'];cmd=run['command'];script=cmd[3];assert obs['script_sha256']==sha(I/'scripts'/Path(script).name)
 for row in r['cases']:
  for q in leafs(row):all_reports[(q['transaction_base64'],q['error'],hashlib.sha256(json.dumps(q['logs'],separators=(',',':')).encode()).hexdigest())]+=1
 for t in obs['transactions']:
  raw=base64.b64decode(t['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256'];assert AMM in t['loaded_programs'];assert t['amm_program_sha256']==t['loaded_programs'][AMM]['sha256']and t['amm_program_sha256']in[original,digest]
  for pid,v in t['loaded_programs'].items():assert v['sha256']==(t['amm_program_sha256']if pid==AMM else sha(I/deps[pid]))
  tx=Transaction.from_bytes(raw);is_setup=suite=='boost'and bytes(tx.message.instructions[0].data[:8])==bytes.fromhex('e992d18ecf6840bc')
  if is_setup:setup_count+=1
  else:all_observed[(t['transaction_base64'],t['error'],t['logs_sha256'])]+=1
assert setup_count==150
assert not (all_reports-all_observed), ('unbound full transaction results', sum((all_reports-all_observed).values()))
# Some maintained suites omit serialized transactions from their report format.
# Bind every case to its ordered signed receipt pair using the retained execution order.
error_bindings=log_bindings=transaction_bindings=0
for run in read(W/'runtime/progress.json'):
 suite=run['suite'];report=read(W/'runtime'/(suite+'.json'));seq=read(W/'runtime'/(suite+'-transactions.json.gz'))['transactions']
 if suite=='boost':seq=[t for t in seq if bytes(Transaction.from_bytes(base64.b64decode(t['transaction_base64'])).message.instructions[0].data[:8])!=bytes.fromhex('e992d18ecf6840bc')]
 pairs=[];cursor=0
 while cursor<len(seq):
  end=cursor+1
  while end<len(seq)and seq[end]['amm_program_sha256']==seq[cursor]['amm_program_sha256']:end+=1
  stop=end+1
  while stop<len(seq)and seq[stop]['amm_program_sha256']==seq[end]['amm_program_sha256']:stop+=1
  assert end-cursor==stop-end and seq[cursor]['amm_program_sha256']==original and seq[end]['amm_program_sha256']==digest
  pairs.extend(zip(seq[cursor:end],seq[end:stop]));cursor=stop
 assert len(pairs)==len(report['cases'])
 for row,pair in zip(report['cases'],pairs):
  for side,receipt in zip(['original','candidate'],pair):
   result=row[side];assert result['error']==receipt['error'],(suite,'error binding');error_bindings+=1
   if 'logs'in result:
    assert hashlib.sha256(json.dumps(result['logs'],separators=(',',':')).encode()).hexdigest()==receipt['logs_sha256'],(suite,'log binding');log_bindings+=1
   if 'transaction_base64'in result:assert result['transaction_base64']==receipt['transaction_base64'];transaction_bindings+=1
assert error_bindings==34924

report={'verified':True,'candidate_sha256':digest,'core':core,'ordered_error_receipt_bindings':error_bindings,'exact_log_receipt_bindings':log_bindings,'exact_transaction_receipt_bindings':transaction_bindings,'vm_executed_by_verifier':False}
(W/'runtime-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
