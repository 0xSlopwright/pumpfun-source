"""Run existing bounded source-recovery fixtures against one final union ELF."""
from pathlib import Path
import argparse,concurrent.futures,hashlib,json,shutil,subprocess,time
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('stage');a=p.parse_args()
repo=Path('/workspace/pumpfun-source-latest');base=repo/'work/pump-union';stage=base/a.stage
candidate=stage/'candidate.so';out=stage/'runtime';out.mkdir(exist_ok=True)
inherited=Path('/workspace/pumpfun-source-union/research/pump-semantic-union-20261028/runtime/producers')
old=Path(__file__).parent/'inherited-producers';old.mkdir(exist_ok=True)
for source in inherited.glob('*.py'):
 destination=old/source.name
 shutil.copy2(source,destination)
 assert destination.read_bytes()==source.read_bytes()
wrap=repo/'scripts/pump_with_captured_loader.py';control=repo/'work/pump-l38/native-control/candidate.so'
def wrapped(name,script,args):return(name,['python3','-B',str(wrap),'--receipt',str(out/(name+'.loader.json')),str(script),*map(str,args)])
tasks=[
 ('v2-focused',['python3','-B',str(old/'v2.py'),'--repo',str(repo),'--baseline',str(control),'--candidate',str(candidate),'--output',str(out/'v2-focused.json.gz')]),
 wrapped('sweep',old/'sweep.py',['--candidate',candidate,'--output',out/'sweep.json.gz']),
 wrapped('v3sell',old/'v3sell.py',['--candidate',candidate,'--output',out/'v3sell.json.gz']),
 wrapped('constructor',old/'constructor.py',['--candidate',candidate,'--output',out/'constructor.json']),
 wrapped('quote-program',old/'quote-program.py',['--candidate',candidate,'--output',out/'quote-program.json.gz']),
 ('multihop',['python3','-B',str(base/'replay_multihop.py'),'--repo',str(repo),'--records','/workspace/pumpfun-source-workers/pump-creation/research/pump-multi-hop-crossing-guard-20261028/runtime/cases.json.gz','--images','/workspace/pumpfun-source-workers/pump-creation/research/pump-multi-hop-crossing-guard-20261028/runtime/images.json','--candidate',str(candidate),'--output',str(out/'multihop.json.gz')]),
 wrapped('cashback-order',base/'semantic-04/producers/cashback-order.py',['--candidate',candidate,'--output',out/'cashback-order.json.gz']),
 wrapped('admin-source',base/'semantic-04/producers/admin-source.py',['--candidate',candidate,'--output',out/'admin-source.json.gz']),
 wrapped('admin-shared',Path('/workspace/pumpfun-source-workers/pump-admin/work/pump-admin/l38/admin-shared-guard-focused.py'),['--baseline',base/'semantic-03/candidate.so','--candidate',candidate,'--output',out/'admin-shared.json.gz']),
 wrapped('create-keys',Path(__file__).parent/'create_keys.py',['--harness','/workspace/pumpfun-source-workers/pump-creation/work/pump-creation/create_quote_probe.py','--original',repo/'evidence/original/pump/deployed.so','--baseline',base/'semantic-03/candidate.so','--candidate',candidate,'--output',out/'create-keys.json.gz']),
]
sha=lambda path:hashlib.sha256(Path(path).read_bytes()).hexdigest()
def execute(task):
 name,cmd=task;start=time.monotonic();log=out/(name+'.log')
 with log.open('w')as stream:r=subprocess.run(cmd,cwd=repo,stdout=stream,stderr=subprocess.STDOUT)
 record={'name':name,'command':cmd,'returncode':r.returncode,'seconds':time.monotonic()-start,'log_sha256':sha(log),'producer_sha256':sha(cmd[2]if cmd[2]!=str(wrap)else cmd[5])}
 (out/(name+'.command.json')).write_text(json.dumps(record,indent=2)+'\n')
 print(name,r.returncode,log.read_text()[-600:],flush=True);return record
before=sha(candidate)
with concurrent.futures.ThreadPoolExecutor(max_workers=2)as pool:results=list(pool.map(execute,tasks))
assert before==sha(candidate)
(out/'execution.json').write_text(json.dumps({'candidate_sha256':before,'producer_sha256':sha(__file__),'results':results},indent=2)+'\n')
assert all(r['returncode']==0 for r in results)
