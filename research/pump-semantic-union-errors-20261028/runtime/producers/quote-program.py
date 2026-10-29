from pathlib import Path
import sys,argparse,json,hashlib,base64,gzip
sys.path.insert(0,'/workspace/pumpfun-source-latest/scripts')
import pump_cashback_differential as f
from solders.transaction import Transaction
ap=argparse.ArgumentParser();ap.add_argument('--candidate',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);args=ap.parse_args();baseline=Path('/workspace/pumpfun-source-latest/work/pump-l38/native-control/candidate.so');old_token=f.TOKEN;fake=f.f.Pubkey(bytes([73])*32)
cases=[({'name':'fake-zero','v2':True,'token_quote':True,'token_balance':0},True),({'name':'fake-positive','v2':True,'token_quote':True,'token_balance':1},True),({'name':'fake-wrong-mint-owner','v2':True,'token_quote':True,'token_balance':0,'mutations':{'quote_mint':{'system_owner':True}}},True),({'name':'native-ignores-quote-program','v2':True},True)]+[({'name':f'genuine-{token22}-{amount}','v2':True,'token_quote':True,'token22':token22,'token_balance':amount},False)for token22 in[False,True]for amount in[0,1]]
rows=[]
for case,bad in cases:
 f.TOKEN=fake if bad else old_token
 results={name:f.run(case,binary)for name,binary in [('original',None),('baseline',baseline),('candidate',args.candidate)]}
 for r in results.values():Transaction.from_bytes(base64.b64decode(r['transaction_base64'])).verify()
 fields=['error','accounts','events','inner','return_data'];diff=[k for k in fields if results['original'][k]!=results['candidate'][k]]
 if bad and case.get('token_quote'):assert'6064'in results['original']['error']and'6064'in results['candidate']['error']
 rows.append({'case':case,'fake_quote_program':str(fake)if bad else None,'signature_verifications':3,'differences':diff,**results})
f.TOKEN=old_token;sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();report={'case_count':len(rows),'signature_verifications':3*len(rows),'original_sha256':sha(f.R/'evidence/original/pump/deployed.so'),'baseline_sha256':sha(baseline),'candidate_sha256':sha(args.candidate),'producer_sha256':sha(Path(__file__)),'fixture_harness_sha256':sha(Path(f.__file__)),'mismatches':[x['case']['name']for x in rows if x['differences']],'cases':rows};args.output.write_bytes(gzip.compress(json.dumps(report,indent=2).encode(),mtime=0));print({k:report[k]for k in['case_count','signature_verifications','mismatches']});assert not report['mismatches']
