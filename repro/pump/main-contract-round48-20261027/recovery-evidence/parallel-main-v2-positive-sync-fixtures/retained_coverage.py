"""Read retained signed receipts only; no harness import, VM or transaction run."""
from pathlib import Path
import base64,gzip,hashlib,json
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
corpus=R/'repro/pump/main-contract-round43-20261027/full.json.gz'
fixture=R/'research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json'
idlp=R/'evidence/upstream/pump.json'
full=json.loads(gzip.decompress(corpus.read_bytes()));f=json.loads(fixture.read_text());idl=json.loads(idlp.read_text())
global_key=f['accounts']['global']
fields=next(t for t in idl['types']if t['name']=='Global')['type']['fields']
def width(t):
 if isinstance(t,str):return {'bool':1,'pubkey':32,'u64':8}[t]
 return width(t['array'][0])*t['array'][1]
offset=8
for x in fields:
 if x['name']=='whitelist_pda':break
 offset+=width(x['type'])
assert offset==451
def compact(b,p):
 n=s=0
 while True:
  t=b[p];p+=1;n|=(t&127)<<s
  if t<128:return n,p
  s+=7
rows=[]
for name in ['buy_v2','sell_v2','legacy_buy','legacy_sell','legacy_sell_configured_fee']:
 checked=equal=0;excluded=[]
 for entry in full['suites'][name]['cases']:
  o=entry['original'];tx=o.get('transaction_base64');a=o.get('accounts',{}).get(global_key)
  if not tx or not a or not a.get('data')or len(base64.b64decode(a['data']))<offset+32:
   excluded.append(entry['case']);continue
  b=base64.b64decode(tx);n,p=compact(b,0);p+=64*n
  if b[p]&128:p+=1
  p+=3;_,p=compact(b,p);payer=b[p:p+32]
  equal+=payer==base64.b64decode(a['data'])[offset:offset+32];checked+=1
 rows.append({'suite':name,'retained_case_count':len(full['suites'][name]['cases']),'decidable':checked,'payer_equals_whitelist':equal,'undecidable_cases':excluded})
assert all(x['payer_equals_whitelist']==0 for x in rows)
inputs=[corpus,fixture,idlp,R/'scripts/pump_buy_v2_differential.py',R/'scripts/pump_sell_v2_differential.py',R/'scripts/pump_legacy_buy_differential.py',R/'scripts/pump_legacy_sell_differential.py',Path(__file__)]
report={'status':'read-only retained receipt audit','scope':'Five named R43 regression suites only; no claim about every other corpus suite or machine branch traces.',
 'serialized_global_whitelist_offset':offset,'rows':rows,
 'interpretation':'These harnesses sign as USER and use USER as the payer and instruction user. No decidable retained receipt in these suites has that payer equal to Global.whitelist_pda. Their rerun alone cannot establish positive guarded reload/sync coverage.',
 'limitations':['Uses retained post-transaction Global snapshots. These five trade harnesses do not change Global during the transaction.','Invalid or missing Global account receipts are undecidable and excluded.','No harness was imported, no VM instantiated, no new transaction constructed or executed.','This does not measure coverage of other suites; new reviewed positive cases require independent execution and deduplication.'],
 'input_sha256':{str(p.relative_to(R)):sha(p)for p in inputs}}
(W/'RETAINED-COVERAGE01.json').write_text(json.dumps(report,indent=2)+'\n')
print({'rows':[{k:v for k,v in x.items()if k!='undecidable_cases'}for x in rows],'sha256':sha(W/'RETAINED-COVERAGE01.json')})
