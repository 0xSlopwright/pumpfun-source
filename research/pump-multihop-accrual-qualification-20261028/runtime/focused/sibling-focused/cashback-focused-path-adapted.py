from pathlib import Path
import sys,json,base64,hashlib,gzip,argparse
sys.path.insert(0,'/Users/shawwalters/.codex/worktrees/pump-swap-remaining-20261028/pumpfun-source/scripts')
import pump_cashback_differential as f
from solders.transaction import Transaction
ap=argparse.ArgumentParser();ap.add_argument('--candidate',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);args=ap.parse_args()
baseline=Path('/Users/shawwalters/.codex/worktrees/pump-swap-remaining-20261028/pumpfun-source/research/pump-multihop-accrual-qualification-20261028/runtime/focused/sibling-focused/cashback-control.so');cases=[]
for token22 in [False,True]:
 base={'v2':True,'token_quote':True,'token22':token22}
 variants=[('both-mint-and-owner',{'quote_mint':{'length':0},'associated_quote_user':{'system_owner':True}},False),('both-mint-and-authority',{'quote_mint':{'length':0},'associated_quote_user':{'bytes':[[32,99]]}},False),('both-empty',{'quote_mint':{'length':0},'associated_quote_user':{'length':0}},False),('owner-only',{'associated_quote_user':{'system_owner':True}},False),('authority-only',{'associated_quote_user':{'bytes':[[32,99]]}},False),('mint-only',{'quote_mint':{'length':0}},False),('genuine',{},False),('zero-bypasses-both',{'quote_mint':{'length':0},'associated_quote_user':{'bytes':[[32,99]]}},True)]
 for name,mut,zero in variants:cases.append({**base,'name':f'{name}-{token22}','mutations':mut,**({'token_balance':0}if zero else{})})
cases += [{'name':f'native-{amount}','v2':True,'lamports':f.Rent.default().minimum_balance(106)+amount}for amount in[0,1]]
rows=[]
for case in cases:
 results={name:f.run(case,binary)for name,binary in [('original',None),('baseline',baseline),('candidate',args.candidate)]}
 for r in results.values():Transaction.from_bytes(base64.b64decode(r['transaction_base64'])).verify()
 diff=[k for k in['error','accounts','events','inner','return_data']if results['original'][k]!=results['candidate'][k]]
 if case['name'].startswith('both-mint-and'):
  code=6010 if 'owner' in case['name'] else 6076
  assert str(code)in results['original']['error']and str(code)in results['candidate']['error']and'InvalidAccountData'in results['baseline']['error']
  anchor=lambda r:[s for s in r['logs']if'AnchorError thrown'in s];assert anchor(results['original'])==anchor(results['candidate'])
 rows.append({'case':case,'signature_verifications':3,'differences':diff,**results})
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();report={'case_count':len(rows),'signature_verifications':len(rows)*3,'original_sha256':sha(f.R/'evidence/original/pump/deployed.so'),'baseline_sha256':sha(baseline),'candidate_sha256':sha(args.candidate),'producer_sha256':sha(Path(__file__)),'fixture_harness_sha256':sha(Path(f.__file__)),'mismatches':[r['case']['name']for r in rows if r['differences']],'cases':rows};args.output.write_bytes(gzip.compress(json.dumps(report,indent=2).encode(),mtime=0));print({k:report[k]for k in['case_count','signature_verifications','mismatches']});assert not report['mismatches']
