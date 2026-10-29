"""Verify receipt integrity and independently recompute the route completion roster."""
from pathlib import Path
import argparse,gzip,hashlib,json,types,sys
sys.dont_write_bytecode=True
SCOPE='Completed means the original AMM transaction returned success, with full result/state parity. The budgeted suites include actual signed ComputeBudget instructions. The corrected three-hop sell also uses a quote-matched buyback ATA; its completion is not attributed solely to increased compute.'
def verify(directory,candidate):
 d=Path(directory);p=d/'verify.py';m=types.ModuleType('receipts');m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);receipts=m.verify(d,Path(candidate));summary=[];valid=[]
 for suite in ['default','budget','vault']:
  report=json.loads(gzip.decompress((d/'reports'/(suite+'.json.gz')).read_bytes()));rows=report['cases']
  def exhausted(row):return any('exceeded CUs meter'in s or 'ComputationalBudgetExceeded'in s for s in row['original']['logs'])
  success=sum(row['original']['error']is None for row in rows);budgets=sum(exhausted(row)for row in rows);summary.append({'suite':suite,'cases':len(rows),'original_successes':success,'original_budget_failures':budgets,'original_other_errors':len(rows)-success-budgets,'mismatches':report['mismatch_count']})
  for row in rows:
   if row['case']['mutation']!='valid':continue
   valid.append({'suite':suite,'case':row['case'],'original_error':row['original']['error'],'status':'completed'if row['original']['error']is None else'budget-failure'if exhausted(row)else'program-error','pump_invocations':sum('Program 6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P invoke'in line for line in row['original']['logs']),'changed_accounts':sum(row['original']['before'][key]!=value for key,value in row['original']['after'].items())})
 value={'candidate_sha256':hashlib.sha256(Path(candidate).read_bytes()).hexdigest(),'case_count':328,'verified_signatures':656,'original_successes':sum(x['original_successes']for x in summary),'original_budget_failures':sum(x['original_budget_failures']for x in summary),'suite_counts':summary,'unmutated_route_outcomes':valid,'scope':SCOPE};assert value==json.loads((d/'completion-roster.json').read_text());assert receipts['cases']==328 and receipts['verified_signatures']==656 and receipts['mismatch_count']==0
 return {'verified':True,'candidate_sha256':value['candidate_sha256'],'cases':328,'signatures':656,'original_successes':value['original_successes'],'original_budget_failures':value['original_budget_failures'],'three_hop_unmutated':[x for x in valid if x['case'].get('depth')==3],'executes_runtime':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);p.add_argument('--candidate',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.directory,a.candidate),indent=2))
