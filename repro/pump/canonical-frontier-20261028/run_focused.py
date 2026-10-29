#!/usr/bin/env python3
"""Replay unchanged focused cases; adapt only historical absolute baseline/import paths."""
from pathlib import Path
import argparse,gzip,hashlib,json,subprocess,sys
if not __debug__:raise SystemExit('Optimized Python is unsupported; run without -O.')
P=Path(__file__).resolve().parent;R=P.parents[2];parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--candidate',type=Path,required=True);parser.add_argument('--output',type=Path,required=True);a=parser.parse_args();O=a.output.resolve();O.relative_to(R);assert not O.exists();O.mkdir(parents=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();candidate=a.candidate.resolve();assert sha(candidate)==json.loads((P/'builds/primary/build-comparison.json').read_text())['comparison']['candidate_sha256']
base={}
for label,packet in [('cashback','pump-cashback-validation-order-20261028'),('cto','pump-admin-cto-source-records-20261028'),('shared','pump-admin-shared-holder-guard-20261028')]:
 src=R/'research'/packet/'control/candidate.so.gz';dst=O/(label+'-control.so');dst.write_bytes(gzip.decompress(src.read_bytes()));base[label]=dst
paths=[]
for label,packet,old in [('cashback','pump-cashback-validation-order-20261028','/workspace/pumpfun-source-workers/pump-admin/work/pump-admin/l38/quote-program-fix/candidate.so'),('cto','pump-admin-cto-source-records-20261028','/workspace/pumpfun-source-workers/pump-admin/work/pump-admin/l38/cashback-parse-qualified/candidate.so')]:
 src=R/'research'/packet/'tools/focused.py';text=src.read_text();assert text.count(old)==1;replaced=text.replace(old,str(base[label]));replaced=replaced.replace('/workspace/pumpfun-source-latest/scripts',str(R/'scripts'));dst=O/(label+'-focused-path-adapted.py');dst.write_text(replaced);paths.append({'source':str(src.relative_to(R)),'source_sha256':sha(src),'path_adapted':str(dst.relative_to(R)),'path_adapted_sha256':sha(dst),'allowed_replacements':{old:str(base[label]),'/workspace/pumpfun-source-latest/scripts':str(R/'scripts')}})
(O/'path-adaptations.json').write_text(json.dumps(paths,indent=2)+'\n')
parent=O/'overflow-control.so';parent.write_bytes(gzip.decompress((R/'research/pump-v3-buy-cost-overflow/artifacts/parent-candidate.so.gz').read_bytes()))
programs=[
 ('shared-buyback',R/'research/pump-shared-buyback-panic-20261028/runtime/producer.py',['--repo-root',str(R),'--candidate',str(candidate),'--control',str(R/'research/pump-shared-buyback-panic-20261028/control/unstripped.so')]),
 ('cost-overflow',R/'research/pump-v3-buy-cost-overflow/tools/focused_costs.py',['--parent',str(parent),'--proposal',str(candidate)]),
 ('cashback',O/'cashback-focused-path-adapted.py',['--candidate',str(candidate)]),
 ('cto',O/'cto-focused-path-adapted.py',['--candidate',str(candidate)]),
 ('shared-holder',R/'research/pump-admin-shared-holder-guard-20261028/tools/focused.py',['--candidate',str(candidate),'--baseline',str(base['shared'])])]
pre616=O/'pre616-control.so';pre616.write_bytes(gzip.decompress((P/'pre616-control/candidate.so.gz').read_bytes()))
programs.append(('create-quote-keys',P/'create_quote_keys.py',['--candidate',str(candidate),'--baseline',str(pre616)]))
results=[]
for label,script,args in programs:
 out=O/(label+'.json.gz');command=[sys.executable,'-B',str(R/'scripts/pump_with_captured_loader.py'),'--receipt',str(O/(label+'-loader.json')),str(script),*args,'--output',str(out)]
 with(O/(label+'.log')).open('w')as f:r=subprocess.run(command,cwd=R,stdout=f,stderr=subprocess.STDOUT)
 row={'name':label,'command':command,'returncode':r.returncode,'producer_sha256':sha(script),'candidate_sha256':sha(candidate),'report_sha256':sha(out)if out.exists()else None,'loader_receipt_sha256':sha(O/(label+'-loader.json'))};results.append(row);(O/'runs.json').write_text(json.dumps(results,indent=2)+'\n');print(label,r.returncode,flush=True);r.check_returncode()
