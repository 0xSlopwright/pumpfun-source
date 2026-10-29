"""Authenticate new route/decoder cases and every preserved result/state/log field."""
from pathlib import Path
import base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction
HERE=Path(__file__).resolve().parent;ROOT=HERE.parents[2]
def load(p):
 p=Path(p);b=p.read_bytes();return json.loads(gzip.decompress(b)if p.suffix=='.gz'else b)
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
s=importlib.util.spec_from_file_location('route_compare',HERE/'compare_direct_cached.py');direct=importlib.util.module_from_spec(s);s.loader.exec_module(direct)
def verify(report,observer,candidate,producer,count,expected_bad=0,own=None,core=None):
 r=load(report);side=load(observer);rows=r['cases'];txs=side['transactions'];digest=sha(candidate);original=sha(ROOT/'evidence/original/pump_amm/deployed.so')
 assert r['candidate_sha256']==digest and r['original_sha256']==original
 assert r['producer_sha256'] == side['script_sha256'] == sha(producer)
 if 'imported_core_sha256'in r:assert r['imported_core_sha256']==sha(core or HERE/'probe_multihop_edges.py')
 assert len(rows)==r['case_count']==count and len(txs)==count*2
 local=load(own)['transactions']if own else None
 if local is not None:assert len(local)==count*2
 failed=[];verified={};signatures=0
 for i,row in enumerate(rows):
  a,b=direct.clean(row['original']),direct.clean(row['candidate']);fields=[k for k in a if a[k]!=b.get(k)]
  if local is not None:
   left,right=local[2*i:2*i+2];assert left['before']==right['before']
   if left['after']!=right['after']:fields.append('full_after_snapshot')
  embedded=[row['original_receipt'],row['candidate_receipt']]if 'original_receipt'in row else None
  if embedded:
   assert embedded[0]['before']==embedded[1]['before']
   if embedded[0]['after']!=embedded[1]['after']:fields.append('full_account_snapshot')
  assert fields==row.get('mismatched_fields',row.get('differences'))
  if fields:failed.append(i)
  messages=[]
  for j,(label,t,pid)in enumerate(zip(['original','candidate'],txs[2*i:2*i+2],[original,digest])):
   raw=base64.b64decode(t['transaction_base64'],validate=True)
   if raw not in verified:
    tx=Transaction.from_bytes(raw);assert all(tx.verify_with_results());verified[raw]=tx
   tx=verified[raw];assert t['all_signatures_verified'] and len(tx.signatures)==t['signature_count'];signatures+=len(tx.signatures)
   assert hashlib.sha256(raw).hexdigest()==t['transaction_sha256'] and t['amm_program_sha256']==pid
   assert t['logs_sha256']==hashlib.sha256(json.dumps(row[label]['logs'],separators=(',',':')).encode()).hexdigest();messages.append(bytes(tx.message))
   if embedded:assert embedded[j]['tx_sha256']==t['transaction_sha256']
   if local is not None:assert local[2*i+j]['transaction_base64']==t['transaction_base64'] and all(local[2*i+j]['signature_verification'])
  assert messages[0]==messages[1]
 assert len(failed)==expected_bad
 if 'mismatch_count'in r:assert r['mismatch_count']==expected_bad
 else:assert r['mismatches']==failed
 return {'cases':count,'mismatches':len(failed),'signatures':signatures}
