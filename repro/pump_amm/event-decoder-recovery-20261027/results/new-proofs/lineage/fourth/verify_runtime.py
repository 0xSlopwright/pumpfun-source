from pathlib import Path
import argparse,base64,gzip,hashlib,json,sys
from solders.transaction import Transaction
W=Path(__file__).resolve().parent

def verify(root,candidate=None,output=None,selected_groups=None):
 root=Path(root).resolve();candidate=Path(candidate)if candidate else W/'build/artifacts/pump_amm_recovered.so';out=Path(output)if output else W/'runtime';sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();ch=sha(candidate);oh=sha(root/'evidence/original/pump_amm/deployed.so');ns={'__name__':'direct_source','__file__':str(W/'runtime-inputs/direct.py')};exec(compile((W/'runtime-inputs/direct.py').read_bytes(),str(W/'runtime-inputs/direct.py'),'exec'),ns);clean=ns['clean'];total=sigs=0;groups=[]
 allowed={ch,oh}|{sha(root/'evidence/dependencies'/n/'deployed.so')for n in ['spl_token','spl_token_2022','associated_token']}|{sha(root/'evidence/original'/n/'deployed.so')for n in ['pump','pump_fees']}
 for name,count in (selected_groups or [('events',16),('orders',18),('curves',64),('entrypoint',39)]):
  report=json.loads((out/(name+'.json')).read_bytes());txs=json.loads(gzip.decompress((out/(name+'-transactions.json.gz')).read_bytes()))['transactions'];assert len(report['cases'])==count and len(txs)==2*count;assert report['candidate_sha256']==ch and report['original_sha256']==oh
  for i,case in enumerate(report['cases']):
   x,y=case['original'],case['candidate'];assert clean(x)==clean(y),(name,i)
   if name=='events':assert x['error']is None
   messages=[]
   for j,row in enumerate(txs[i*2:i*2+2]):
    side=x if j==0 else y;raw=base64.b64decode(row['transaction_base64'],validate=True);assert hashlib.sha256(raw).hexdigest()==row['transaction_sha256'];tx=Transaction.from_bytes(raw);checks=tx.verify_with_results();assert checks and all(checks)and len(checks)==row['signature_count'];assert row['amm_program_sha256']==(oh if j==0 else ch);assert row['error']==side['error'];assert row['logs_sha256']==hashlib.sha256(json.dumps(side['logs'],separators=(',',':')).encode()).hexdigest();assert all(v['sha256']in allowed for v in row['loaded_programs'].values());assert name!='curves'or row['loaded_programs']['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P']['sha256']==sha(root/'evidence/original/pump/deployed.so');messages.append(bytes(tx.message));total+=1;sigs+=len(checks)
   assert messages[0]==messages[1]
  groups.append({'name':name,'cases':count})
 return {'passed':True,'candidate_sha256':ch,'cases':sum(x['cases']for x in groups),'transactions_verified':total,'signatures_verified':sigs,'raw_log_hashes_verified':total,'groups':groups,'scope':'Captured programs; verifies only the explicitly listed groups, compares all fields, and normalizes log source coordinates/compute counts. No live-chain or whole-program identity claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--output',type=Path);p.add_argument('--entrypoint-only',action='store_true');a=p.parse_args();print(json.dumps(verify(a.root,a.candidate,a.output,[('entrypoint',39)]if a.entrypoint_only else None),indent=2))
