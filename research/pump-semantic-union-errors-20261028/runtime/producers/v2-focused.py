"""Signed synthetic v2 regression cases using captured dependencies and loader accounts."""
from pathlib import Path
import argparse,base64,gzip,hashlib,json,struct,sys

PARSER=argparse.ArgumentParser(description=__doc__)
PARSER.add_argument('--repo',type=Path,required=True)
PARSER.add_argument('--baseline',type=Path,required=True)
PARSER.add_argument('--candidate',type=Path,required=True)
PARSER.add_argument('--output',type=Path,required=True)
ARGS=PARSER.parse_args()
ROOT=ARGS.repo.resolve()
HERE=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'scripts'))
import pump_captured_loader as loader
loader.install()
import pump_buy_v2_differential as buy
import pump_sell_v2_differential as sell

FIELDS=['error','accounts','events','inner','return_data']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def cases():
 for route,module in [('buy',buy),('sell',sell)]:
  for token,token22 in [(False,False),(True,False),(True,True)]:
   for whitelist,mayhem in [(False,False),(True,False),(True,True)]:
    curve_bytes=[]
    for offset,value in [(32,10**10 if not token else 10**7),(40,10**15)]:
     curve_bytes += [(offset+i,x) for i,x in enumerate(struct.pack('<Q',value))]
    curve_bytes += [(81,int(mayhem))]
    mutations={}
    if whitelist:mutations['global']={'bytes':[(451+i,x) for i,x in enumerate(bytes(module.USER.pubkey()))]}
    yield route,module,{'name':f'{route}-quote-{token}-{token22}-whitelist-{whitelist}-mayhem-{mayhem}',
     'kind':'buy_v2' if route=='buy' else 'sell_v2','token_quote':token,'token22':token22,
     'reserved':mayhem,'curve_bytes':curve_bytes,'account_mutations':mutations,
     'amount':500000000,'minimum':10**12 if route=='buy' else 0}

def main():
 args=ARGS
 rows=[]
 for route,module,case in cases():
  paths={'original':ROOT/'evidence/original/pump/deployed.so','baseline':args.baseline,
   'candidate':args.candidate}
  results={name:module.run(case,path) for name,path in paths.items()}
  assert all(r['signatures_verified'] for r in results.values())
  assert len({r['transaction_base64'] for r in results.values()})==1
  for result in results.values():
   transaction=module.f.Transaction.from_bytes(base64.b64decode(result['transaction_base64']))
   transaction.verify()
  differences={name:[k for k in FIELDS if results[name][k]!=results['original'][k]] for name in ['baseline','candidate']}
  decoded={}
  for name,result in results.items():
   curve=base64.b64decode(result['accounts'][str(module.CURVE)]['data'])
   decoded[name]=dict(zip(['virtual_token_reserves','virtual_quote_reserves','real_token_reserves','real_quote_reserves'],struct.unpack_from('<QQQQ',curve,8)))
  row={'case':case,'route':route,'results':results,'differences':differences,'decoded_curve':decoded}
  rows.append(row)
  print(json.dumps({'case':case['name'],'errors':{name:r['error'] for name,r in results.items()},'differences':differences}),flush=True)
 report={'scope':__doc__,'cases':rows,'case_count':len(rows),
  'baseline_mismatches':[r['case']['name'] for r in rows if r['differences']['baseline']],
  'candidate_mismatches':[r['case']['name'] for r in rows if r['differences']['candidate']],
  'original_successes':sum(r['results']['original']['error'] is None for r in rows),
  'verified_outer_signatures':sum(len(r['results']) for r in rows),
  'inputs_sha256':{str(p):sha(p) for p in [Path(__file__),Path(buy.__file__),Path(sell.__file__),Path(buy.f.__file__),Path(loader.__file__),ROOT/'evidence/original/pump/deployed.so',ROOT/'research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json',ROOT/'evidence/upstream/pump.json',args.baseline,args.candidate,*(ROOT/f'evidence/dependencies/{name}/deployed.so' for name in ['spl_token','spl_token_2022','associated_token']),ROOT/'evidence/original/pump_fees/deployed.so']},
  'loader_loads':loader.LOADS}
 args.output.write_bytes(gzip.compress(json.dumps(report,separators=(',',':')).encode(),mtime=0))
 print(json.dumps({k:report[k] for k in ['case_count','baseline_mismatches','candidate_mismatches','original_successes']}))
 assert report['case_count']==18 and report['original_successes']==18
 assert report['verified_outer_signatures']==54
 assert len(report['baseline_mismatches'])==6 and not report['candidate_mismatches']

if __name__=='__main__':main()
