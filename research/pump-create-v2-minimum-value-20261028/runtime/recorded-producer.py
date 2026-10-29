from pathlib import Path
import importlib.util,json,gzip,hashlib,base64,sys
from solders.transaction import Transaction
R=Path('/workspace/pumpfun-source-latest');B=Path(__file__).resolve().parent;OUT=B/'create641-count-runtime';OUT.mkdir(exist_ok=True)
s=importlib.util.spec_from_file_location('quoteh',R/'scripts/pump_create_quote_differential.py');h=importlib.util.module_from_spec(s);s.loader.exec_module(h)
images={'original':R/'evidence/original/pump/deployed.so','control':B/'create641-control/candidate.so'}
if len(sys.argv)>1:images['fixed']=B/'create641-minimum-literal/candidate.so'
rows=[];fixed_accounts=len(next(x for x in h.IDL['instructions']if x['name']=='create_v2')['accounts'])
for token22 in [False,True]:
 cases=[{'case':'count-'+str(n)+'-'+str(token22),'instruction':'create_v2','quote':True,'quote_token22':token22,'quote_count':n}for n in range(4)]
 cases.append({'case':'count-3-readonly-ata-'+str(token22),'instruction':'create_v2','quote':True,'quote_token22':token22,'quote_count':3,'readonly':'associated_quote_bonding_curve'})
 for c in cases:
  rs={label:h.run(c,path)for label,path in images.items()};fields=['before','after','error','events','inner','return'];diffs={label:[k for k in fields if q[k]!=rs['original'][k]]for label,q in rs.items()};assert not any(diffs.values()),(c,diffs)
  for label,q in rs.items():
   tx=Transaction.from_bytes(base64.b64decode(q['transaction_base64']));assert all(tx.verify_with_results())and tx.message.header.num_required_signatures==2
   assert len(tx.message.instructions[1].accounts)-fixed_accounts==c['quote_count']
  if c['quote_count']in [1,2]:
   for label,q in rs.items():
    line=next(l for l in q['logs']if 'Error Code: NotEnoughRemainingAccounts.'in l);assert ('create_v2.rs:198.'if label=='original'else'create_v2.rs:62.')in line
    at=q['logs'].index(line);assert q['logs'][at+1:at+3]==['Program log: Left: '+str(c['quote_count']),'Program log: Right: 3']
  elif 'readonly'in c:assert rs['original']['error']is not None and not rs['original']['events']
  else:assert rs['original']['error']is None and len(rs['original']['events'])==1
  rows.append({'input':c,'results':rs,'different_fields':diffs});print(c['case'],'passed')
report={'images':{label:{'path':str(path),'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}for label,path in images.items()},'fixed_idl_account_count':fixed_accounts,'cases':rows,'signatures':'genuine payer+mint signatures verified with normal VM signature checks','compare_fields':fields};(OUT/('cases-fixed.json.gz'if'fixed'in images else'cases-control.json.gz')).write_bytes(gzip.compress(json.dumps(report,sort_keys=True).encode(),mtime=0))
