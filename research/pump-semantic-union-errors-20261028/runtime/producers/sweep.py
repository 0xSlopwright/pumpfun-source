from pathlib import Path
import sys,inspect,json,base64,argparse,gzip,hashlib
sys.path.insert(0,'/workspace/pumpfun-source-latest/scripts')
import pump_fee_sweep_differential as f
from solders.transaction import Transaction

ap=argparse.ArgumentParser();ap.add_argument('--candidate',type=Path,required=True);ap.add_argument('--output',type=Path,required=True);args=ap.parse_args()
baseline=Path('/workspace/pumpfun-source-latest/work/pump-l38/native-control/candidate.so')
# The recipient may alias the genuine executable System Program. Preserve it.
src=inspect.getsource(f.run);needle=" vm.set_account(recipient,Account(10**9,b'',Pubkey.default()))";assert src.count(needle)==1
src=src.replace(needle," if recipient!=Pubkey.default():vm.set_account(recipient,Account(10**9,b'',Pubkey.default()))")
ns=f.__dict__.copy();exec(compile(src,__file__+':adapter','exec'),ns);run=ns['run']
cases=[]
for mode in ['native','token','wsol']:
 base={'curve_quote':str(f.Pubkey.default())if mode=='native'else str(f.STABLE if mode=='token'else f.WSOL),'quote':str(f.STABLE if mode=='token'else f.WSOL)}
 for fees in [0,12345]:
  for op in ['sweep_creator_fee','sweep_protocol_fee']:cases.append(dict(base,name=f'zero-recipient-{mode}-{fees}-{op}',op=op,recipient=str(f.Pubkey.default()),creator_fee=fees,protocol_fee=fees))
 for op in ['sweep_creator_fee','sweep_protocol_fee']:cases.append(dict(base,name=f'genuine-{mode}-{op}',op=op))
rows=[]
for case in cases:
 results={name:run(case,binary)for name,binary in [('original',None),('baseline',baseline),('candidate',args.candidate)]}
 for r in results.values():Transaction.from_bytes(base64.b64decode(r['transaction_base64'])).verify()
 o=results['original'];n=results['candidate'];diff=[k for k in ['error','before','after']if o[k]!=n[k]]
 for k in ['return_data','inner_instructions']:
  if o['metadata'][k]!=n['metadata'][k]:diff.append(k)
 events=lambda r:[l for l in r['logs']if l.startswith('Program data: ')]
 if events(o)!=events(n):diff.append('events')
 if case['name'].startswith('zero-recipient'):
  assert '6000'in o['error']and'6000'in n['error']
  if case['op']=='sweep_creator_fee':assert'2006'in results['baseline']['error']
  anchor=lambda r:[s for s in r['logs']if'AnchorError thrown'in s]
  assert anchor(o)==anchor(n)and any('sweep_fees.rs:123'in s for s in anchor(n))
 rows.append({'case':case,'signature_verifications':3,'differences':diff,**results})
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
report={'note':'Preserve the genuine executable System Program when its default key also appears as recipient; all transactions are normally signed and sent through the captured upgradeable-loader fixture.','adapter_source':src,'case_count':len(rows),'signature_verifications':3*len(rows),'original_sha256':sha(f.ROOT/'evidence/original/pump/deployed.so'),'baseline_sha256':sha(baseline),'candidate_sha256':sha(args.candidate),'producer_sha256':sha(Path(__file__)),'fixture_harness_sha256':sha(Path(f.__file__)),'mismatches':[x['case']['name']for x in rows if x['differences']],'cases':rows}
args.output.write_bytes(gzip.compress(json.dumps(report,indent=2).encode(),mtime=0));print({k:report[k]for k in['case_count','signature_verifications','mismatches']});assert not report['mismatches']
