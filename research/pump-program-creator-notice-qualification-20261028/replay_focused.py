#!/usr/bin/env python3
"""Execute unchanged focused producers against the explicitly selected final composed image."""
from pathlib import Path
import argparse,hashlib,json,subprocess,sys
if not __debug__:raise SystemExit('Optimized Python is unsupported; run without -O.')
sys.dont_write_bytecode=True
P=Path(__file__).resolve().parent;R=P.parents[1];sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);a=p.parse_args();candidate=a.candidate.resolve();out=a.output.resolve();assert not out.exists();out.mkdir(parents=True)
record=P/'builds/primary/build-comparison.json';expected=json.loads(record.read_text())['comparison']['candidate_sha256'];assert sha(candidate)==expected
wrapper=R/'scripts/pump_with_captured_loader.py';admin=R/'research/pump-migration-completion-20261028/probe_admin_wallet_coin_guard.py';multi=R/'research/pump-multi-hop-quote-admission/tools/focused.py';baseline=R/'research/pump-create-used-boundaries-20261028/artifacts/candidate.so'
commands=[
 ('sibling',P/'replay_sibling.py',['--candidate',str(candidate),'--output',str(out/'sibling-focused')],False),
 ('create',P/'replay_create.py',['--candidate',str(candidate),'--output',str(out/'create-runtime.json.gz')],False),
 ('admin-wallet',admin,['--baseline',str(baseline),'--candidate',str(candidate),'--output',str(out/'admin-wallet.json.gz')],True),
 ('legacy284',R/'scripts/pump_legacy_buy_differential.py',['--candidate',str(candidate),'--output',str(out/'legacy284.json.gz')],True),
 ('multihop',multi,['--parent',str(baseline),'--proposal',str(candidate),'--output',str(out/'multihop.json.gz')],False),
 ('extensions',R/'scripts/pump_v3_token_extensions_differential.py',['--candidate',str(candidate),'--output',str(out/'extensions.json.gz')],True),
]
rows=[]
for label,script,arguments,capture in commands:
 before=sha(script);command=[sys.executable,'-B']+([str(wrapper),'--receipt',str(out/(label+'-loader.json'))]if capture else[])+[str(script),*arguments]
 with(out/(label+'.log')).open('w')as f:r=subprocess.run(command,cwd=R,stdout=f,stderr=subprocess.STDOUT)
 assert sha(script)==before and sha(candidate)==expected
 rows.append({'name':label,'producer':str(script.relative_to(R)),'producer_sha256':before,'command':command,'returncode':r.returncode,'candidate_sha256':expected});(out/'execution.json').write_text(json.dumps({'scope':__doc__,'controller_sha256':sha(Path(__file__)),'build_receipt_sha256':sha(record),'runs':rows},indent=2)+'\n');print(label,r.returncode,flush=True);r.check_returncode()
