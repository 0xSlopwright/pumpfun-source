#!/usr/bin/env python3
"""Bounded signed local cost-panic fixtures; no RPC or live transactions."""
from pathlib import Path
import argparse,gzip,hashlib,json,re,sys
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--repo-root',type=Path,required=True)
p.add_argument('--candidate',type=Path,required=True)
p.add_argument('--control',type=Path)
p.add_argument('--output',type=Path,required=True)
a=p.parse_args();a.repo_root=a.repo_root.resolve()
sys.path.insert(0,str(a.repo_root/'scripts'))
import pump_v3_configured_fee_differential as fixture
assert fixture.f.R.resolve()==a.repo_root
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
compute=re.compile(r'^Program .* consumed \d+ of \d+ compute units$')
keys=['error','accounts','inner_instructions','event_payloads','return_data']
rows=[]
for operation in ['buy_v3','buy_exact_quote_in_v3','sell_v3']:
 for bps in [0,5000,10000,10001,2**64-1]:
  # BuyV3 is explicitly noncrossing. Large base reserves/vault holdings are
  # synthetic account state; all account validation and signatures remain on.
  rows.append({'name':f'{operation}-noncrossing-bps-{bps}','operation':operation,'fees':[95,30,bps],'amount':10**11 if operation=='buy_v3' else 10**9 if operation=='buy_exact_quote_in_v3' else 500000000,'max_cost':10**15 if operation=='buy_v3' else 1 if operation=='buy_exact_quote_in_v3' else 0,'real_base':10**14,'base_vault_amount':10**14,'user_lamports':10**16})
for operation in ['buy_v3','buy_exact_quote_in_v3','sell_v3']:
 rows.append({'name':f'{operation}-mayhem-max-bps','operation':operation,'fees':[95,30,2**64-1],'flags':[81],'amount':10**11 if operation=='buy_v3' else 10**9 if operation=='buy_exact_quote_in_v3' else 500000000,'max_cost':10**15 if operation=='buy_v3' else 1 if operation=='buy_exact_quote_in_v3' else 0,'real_base':10**14,'base_vault_amount':10**14,'user_lamports':10**16})
for bps in [0,5000]:
 rows.append({'name':f'exact-quote-post-complete-control-bps-{bps}','operation':'buy_exact_quote_in_v3','fees':[95,30,bps],'amount':10**11,'max_cost':1,'real_base':1000000,'base_vault_amount':10**12,'user_lamports':10**16})
original=a.repo_root/'evidence/original/pump/deployed.so'
results=[]
for i,c in enumerate(rows):
 c={'reserve_in':fixture.base_in,'reserve_out':fixture.base_out,**c}
 x=fixture.run(original,c);y=fixture.run(a.candidate,c);z=fixture.run(a.control,c) if a.control else None
 logs=lambda r:[line for line in r['logs'] if not compute.fullmatch(line)]
 row={'case':c,'original':x,'candidate':y,'candidate_semantic_equal':all(x[k]==y[k] for k in keys),'candidate_ordered_logs_equal_except_compute':logs(x)==logs(y)}
 if z is not None:row.update(control=z,control_semantic_equal=all(x[k]==z[k] for k in keys),control_ordered_logs_equal_except_compute=logs(x)==logs(z))
 results.append(row)
 print(json.dumps({'case':i,'name':c['name'],'semantic':row['candidate_semantic_equal'],'logs':row['candidate_ordered_logs_equal_except_compute'],'error':x['error'],'panic_lines':[line for line in x['logs'] if 'panicked' in line or 'buyback' in line]}),flush=True)
report={'scope':__doc__,'normalization':'Ordered logs omit only anchored compute-unit consumption lines; all errors, state, CPI, events and return data compared exactly.','producer_sha256':sha(Path(__file__)),'fixture_sha256':sha(Path(fixture.__file__)),'fixture_state_sha256':sha(Path(fixture.f.__file__)),'original_sha256':sha(original),'candidate_sha256':sha(a.candidate),'control_sha256':sha(a.control) if a.control else None,'case_count':len(results),'cases':results,'candidate_semantic_mismatches':[i for i,r in enumerate(results) if not r['candidate_semantic_equal']],'candidate_log_mismatches':[i for i,r in enumerate(results) if not r['candidate_ordered_logs_equal_except_compute']]}
raw=(json.dumps(report,separators=(',',':'))+'\n').encode();a.output.parent.mkdir(parents=True,exist_ok=True);a.output.write_bytes(gzip.compress(raw,mtime=0) if a.output.suffix=='.gz' else raw)
print(json.dumps({k:v for k,v in report.items() if k not in ('cases','scope','normalization')},indent=2))
assert not report['candidate_semantic_mismatches']
