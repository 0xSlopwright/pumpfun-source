"""Four normally signed creation cases against original, control and union."""
from pathlib import Path
import argparse,base64,gzip,hashlib,importlib.util,json
from solders.transaction import Transaction

p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--harness',type=Path,required=True)
p.add_argument('--original',type=Path,required=True)
p.add_argument('--baseline',type=Path,required=True)
p.add_argument('--candidate',type=Path,required=True)
p.add_argument('--output',type=Path,required=True)
a=p.parse_args()
spec=importlib.util.spec_from_file_location('creation_fixture',a.harness)
h=importlib.util.module_from_spec(spec);spec.loader.exec_module(h)
sha=lambda path:hashlib.sha256(path.read_bytes()).hexdigest()
paths={'original':a.original,'baseline':a.baseline,'candidate':a.candidate}
rows=[];signatures=0
for rejected in [False,True]:
 for token22 in [False,True]:
  case={'case':f'literal-{rejected}-token22-{token22}','instruction':'create_v2','quote':True,'quote_token22':token22}
  if rejected:case['quote_pubkey']='9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP'
  rs={name:h.run(case,path)for name,path in paths.items()}
  for result in rs.values():
   tx=Transaction.from_bytes(base64.b64decode(result['transaction_base64']));checks=tx.verify_with_results()
   assert len(checks)==2 and all(checks);signatures+=len(checks)
  differences=[field for field in ['before','after','error','events','inner','return']if rs['original'][field]!=rs['candidate'][field]]
  assert not differences,(case,differences)
  if rejected:
   assert '6063'in rs['original']['error']
   expected=['Program log: Left:','Program log: '+case['quote_pubkey'],'Program log: Right:','Program log: '+case['quote_pubkey']]
   for name,result in rs.items():
    at=next(i for i,line in enumerate(result['logs'])if 'Error Code: UnsupportedQuoteMint.'in line)
    assert ('create_v2.rs:220.'if name=='original'else'create_v2.rs:70.')in result['logs'][at]
    assert (result['logs'][at+1:at+5]==expected)==(name!='baseline')
  else:assert rs['original']['error']is None
  rows.append({'case':case,'differences':differences,'results':rs})
report={'scope':__doc__,'candidate_sha256':sha(a.candidate),'image_sha256':{k:sha(v)for k,v in paths.items()},'harness_sha256':sha(a.harness),'producer_sha256':sha(Path(__file__)),'case_count':len(rows),'signature_verifications':signatures,'cases':rows,'mismatches':[]}
a.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0))
print(json.dumps({'cases':len(rows),'transactions':12,'independently_verified_signatures':signatures,'mismatches':[]}))
