"""Compare every recorded field directly, excluding only compute and log coordinates."""
from pathlib import Path
import base64,gzip,json,re
from solders.transaction import Transaction

def load(p):
 p=Path(p)
 if not p.exists()and p.suffix=='.json':p=p.with_suffix('.json.gz')
 return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def logs(values):
 return [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',re.sub(r'(?<=panicked at )[^ ]+:[0-9]+:[0-9]+','<source>',v))for v in values if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',v)]
def clean(v):
 if isinstance(v,dict):return{k:logs(x)if k=='logs'else clean(x)for k,x in v.items()}
 if isinstance(v,list):return[clean(x)for x in v]
 return v

def audit(runtime,candidate_sha):
 failures=[];cases=transactions=signatures=log_pairs=input_pairs=0
 for run in load(runtime/'progress.json'):
  suite=run['suite'];r=load(runtime/(suite+'.json'))
  assert r['candidate_sha256']==candidate_sha and r['case_count']==len(r['cases'])
  for i,c in enumerate(r['cases']):
   a,b=clean(c['original']),clean(c['candidate']);cases+=1
   if a!=b:failures.append({'suite':suite,'case':i,'fields':[k for k in a if a[k]!=b.get(k)] if isinstance(a,dict)and isinstance(b,dict) else ['value']})
   if isinstance(a,dict)and 'logs'in a:log_pairs+=1
  observed=load(runtime/(suite+'-transactions.json.gz'));seq=observed['transactions'];transactions+=len(seq)
  for t in seq:
   tx=Transaction.from_bytes(base64.b64decode(t['transaction_base64'],validate=True));assert all(tx.verify_with_results())and t['all_signatures_verified'];signatures+=len(tx.signatures)
   assert len(tx.signatures)==t['signature_count']
  # The boost harness creates the same original-program pool for each side.
  # Pair those setup messages separately; the remaining actions alternate.
  if suite=='boost':
   setup=[];actions=[]
   for t in seq:
    tx=Transaction.from_bytes(base64.b64decode(t['transaction_base64']))
    (setup if tx.message.instructions[0].data[:8]==bytes.fromhex('e992d18ecf6840bc') else actions).append(t)
   assert len(setup)==150
   for left,right in zip(setup[::2],setup[1::2]):
    assert left['amm_program_sha256']==right['amm_program_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
    x,y=[Transaction.from_bytes(base64.b64decode(t['transaction_base64']))for t in [left,right]]
    assert bytes(x.message)==bytes(y.message)
    input_pairs+=1
   seq=actions
  cursor=0
  while cursor<len(seq):
   end=cursor+1
   while end<len(seq)and seq[end]['amm_program_sha256']==seq[cursor]['amm_program_sha256']:end+=1
   stop=end+1
   while stop<len(seq)and seq[stop]['amm_program_sha256']==seq[end]['amm_program_sha256']:stop+=1
   assert seq[cursor]['amm_program_sha256']=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
   assert seq[end]['amm_program_sha256']==candidate_sha and end-cursor==stop-end,(suite,cursor,end,stop)
   for left,right in zip(seq[cursor:end],seq[end:stop]):
    x,y=[Transaction.from_bytes(base64.b64decode(t['transaction_base64']))for t in [left,right]]
    assert bytes(x.message)==bytes(y.message),(suite,cursor,'different transaction inputs')
    input_pairs+=1
   cursor=stop
 return {'cases':cases,'transactions':transactions,'signature_fields':signatures,'recorded_top_level_log_pairs':log_pairs,'identical_signed_message_pairs':input_pairs,'mismatches':failures}
if __name__=='__main__':
 import argparse
 p=argparse.ArgumentParser();p.add_argument('runtime',type=Path);p.add_argument('candidate_sha');a=p.parse_args();print(json.dumps(audit(a.runtime,a.candidate_sha),indent=2))
