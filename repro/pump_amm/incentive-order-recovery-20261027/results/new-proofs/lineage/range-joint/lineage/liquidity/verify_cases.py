from pathlib import Path
import base64,gzip,hashlib,json,re
from solders.transaction import Transaction
W=Path(__file__).resolve().parent
CANDIDATE='da29e99d0dbb63b50bb59655f7788fad0a06b7aa75dfdcebcf043d0f7ea76a59';ORIGINAL='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
def load(p):
 p=Path(p)
 if not p.exists()and p.suffix=='.json':p=p.with_suffix('.json.gz')
 b=p.read_bytes();return json.loads(gzip.decompress(b)if b[:2]==b'\x1f\x8b'else b)
def clean(x):
 if isinstance(x,dict):return{k:logs(v)if k=='logs'else clean(v)for k,v in x.items()}
 if isinstance(x,list):return[clean(y)for y in x]
 return x
def logs(v):
 return[re.sub(r'(?<=thrown in )[^ ]+:[0-9]+','<source>',re.sub(r'(?<=panicked at )[^ ]+:[0-9]+:[0-9]+','<source>',s))for s in v if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units',s)]
def verify(root=W):
 root=Path(root);groups={'focused':{'deposit-44':44,'burn':18,'withdraw-order':18,'payout':336,'sweep':254,'liquidity':680},'boundaries':{'curve-order':32,'legacy-curve-order':32,'boundary':72,'transfer':4,'validation-order':252,'matrix':1536,'market-cap':48,'quote-routes':20},'.':{'program-identity':32}}
 total=transactions=signatures=0;summary=[]
 for folder,names in groups.items():
  for name,count in names.items():
   report=load(root/folder/(name+'.json'));obs=load(root/folder/(name+'-transactions.json.gz'));assert report['candidate_sha256']==CANDIDATE and report['original_sha256']==ORIGINAL
   assert len(report['cases'])==count and len(obs['transactions'])==count*2
   if'case_count'in report:assert report['case_count']==count
   group_signatures=0
   for i,row in enumerate(report['cases']):
    assert clean(row['original'])==clean(row['candidate']),(folder,name,i)
    if 'original_receipt'in row:assert row['original_receipt']['before']==row['candidate_receipt']['before']and row['original_receipt']['after']==row['candidate_receipt']['after']
    pair=obs['transactions'][2*i:2*i+2];assert pair[0]['transaction_base64']==pair[1]['transaction_base64']
    for txrow,side,digest in zip(pair,['original','candidate'],[ORIGINAL,CANDIDATE]):
     raw=base64.b64decode(txrow['transaction_base64'],validate=True);tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and txrow['all_signatures_verified'];assert len(checks)==txrow['signature_count'];group_signatures+=len(checks)
     assert hashlib.sha256(raw).hexdigest()==txrow['transaction_sha256']and txrow['amm_program_sha256']==digest
     assert hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()==txrow['logs_sha256']
   total+=count;transactions+=count*2;signatures+=group_signatures;summary.append({'group':folder+'/'+name,'cases':count,'transactions':count*2,'signatures':group_signatures})
 assert total==3378 and transactions==signatures==6756
 return {'passed':True,'candidate_sha256':CANDIDATE,'cases':total,'transactions':transactions,'verified_signatures':signatures,'groups':summary,'scope':'Saved full-state/log/signature audit of freshly executed3378cases, including1350liquidity1996boundaries32program-identity. Source coordinates and compute consumption are explicitly normalized; no new VM executed by verifier.'}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
