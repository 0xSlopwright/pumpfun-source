from pathlib import Path
import json,hashlib,gzip,base64,re
from solders.transaction import Transaction
D=Path(__file__).parent
H=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def J(p):return json.loads(gzip.decompress(p.read_bytes())if p.suffix=='.gz'else p.read_bytes())
def clean(x):
 x=dict(x);x['logs']=[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',s)for s in x['logs']if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',s)];return x

def verify(root=D):
 root=Path(root);
 m=J(root/'manifest.json')['files'];assert m=={str(p.relative_to(root)):H(p)for p in root.rglob('*')if p.is_file()and p!=root/'manifest.json'and'__pycache__'not in p.parts}
 index=J(root/'program-index.json');assert all(H(root/'programs'/f'{h}.so')==h for h in index)
 caller=H(root/'caller.so');assert caller==J(root/'build.json')['caller_sha256']and H(root/'caller.rs')==J(root/'build.json')['source_sha256']
 bad_expected=[19,20,22,23];reports={};total=0
 for name,report,sidecar,producer in [('default','report.json','transactions.json.gz','probe.py'),('high','highbudget-report.json','highbudget-transactions.json.gz','probe-highbudget.py'),('h16','h16-default200k-report.json','h16-default200k-transactions.json.gz','probe.py')]:
  r=J(root/report);obs=J(root/sidecar);assert r['case_count']==len(r['cases'])==24 and r['caller_sha256']==caller and r['producer_sha256']==obs['script_sha256']==H(root/producer);assert obs['transaction_count']==len(obs['transactions'])==48
  bad=[]
  for i,row in enumerate(r['cases']):
   a,b=clean(row['original']),clean(row['candidate']);diff=[k for k in a if a[k]!=b[k]];assert diff==row['different_fields'];pair=obs['transactions'][i*2:i*2+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']==row['original']['transaction_base64']==row['candidate']['transaction_base64']
   if diff:bad.append(i)
   for side,t,expected in zip(['original','candidate'],pair,[r['original_sha256'],r['candidate_sha256']]):
    tx=Transaction.from_bytes(base64.b64decode(t['transaction_base64']));valid=tx.verify_with_results();assert valid and all(valid)and t['all_signatures_verified']and len(valid)==t['signature_count'];total+=len(valid)
    assert hashlib.sha256(bytes(tx)).hexdigest()==t['transaction_sha256']and t['error']==row[side]['error']and t['amm_program_sha256']==expected
    for pid,loaded in t['loaded_programs'].items():assert loaded['sha256']in index and index[loaded['sha256']]['program_id']==pid
    assert t['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
    if row['input']['canonical']:assert t['loaded_programs']['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P']['sha256']==caller
   if name=='high':
    ix=tx.message.instructions[0];assert str(tx.message.account_keys[ix.program_id_index])=='ComputeBudget111111111111111111111111111111'and bytes(ix.data)==b'\x02'+(1400000).to_bytes(4,'little')
  assert bad==([]if name=='high'else bad_expected)
  reports[name]=r
 def ix_shape(row):
  tx=Transaction.from_bytes(base64.b64decode(row['transaction_base64']));ix=tx.message.instructions[-1];return(str(tx.message.account_keys[ix.program_id_index]),bytes(ix.data),[str(tx.message.account_keys[i])for i in ix.accounts])
 for i in range(24):
  a,b,c=[reports[n]['cases'][i]for n in ['default','high','h16']];assert a['input']==b['input']==c['input']
  assert ix_shape(a['original'])==ix_shape(b['original'])==ix_shape(c['original'])
  assert clean(a['candidate'])==clean(c['candidate'])
  if i in bad_expected:
   assert a['original']['error']=='TransactionErrorInstructionError((0, Fieldless(ProgramFailedToComplete)))'and a['candidate']['error']is None
   assert any('exceeded CUs meter' in l for l in a['original']['logs'])
  if a['input']['kind']=='fee':
   assert b['original']['error']is None if a['input']['canonical']else 'Custom(6007)'in b['original']['error']
 assert total==144
 return {'passed':True,'candidate_sha256':reports['default']['candidate_sha256'],'caller_sha256':caller,'cases_per_budget':24,'default_budget_real_resource_mismatches':4,'same_h16_baseline_resource_mismatches':4,'high_budget_mismatches':0,'signed_transactions_verified':144,'default_budget':200000,'high_budget':1400000,'scope':'Synthetic Pump caller with valid CPI PDA signer, not network reachability; default compute budget resource mismatches preserved. Higher-budget pairs use identical instructions and data except the explicit common ComputeBudget instruction.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
