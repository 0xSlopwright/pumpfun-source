from pathlib import Path
import hashlib,json,subprocess,sys,time,os
R=Path('/mnt/c/Users/ahi20/Documents/ChatGPT/pumpfun-source')
L=Path('/home/ahi200/pumpfun-work/20261029-pump-legacy-exact-sol')
I=Path('/mnt/c/Users/ahi20/Documents/ChatGPT/pumpfun-contribution-review/pump-v3-costs-20261029/runtime-inputs')
P=L/'costs-parent/candidate.so'; C=L/'execute-key-slice/candidate.so'; O=R/'evidence/original/pump/deployed.so'
out=L/'execute-key-slice/runtime-verified'
assert not out.exists(), 'Fresh output required; refusing overwrite'
out.mkdir()
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
inputs=[Path(__file__),P,C,O,I/'focused_costs_portable.py',I/'research/pump-shared-buyback-panic-20261028/runtime/producer.py',R/'scripts/pump_v3_configured_fee_differential.py',R/'scripts/pump_trade_fixture.py',R/'scripts/pump_captured_loader.py',R/'scripts/pump_with_captured_loader.py',R/'research/imported-lab/analysis/pump_fun/curve-fresh-trades-v3-signed-surfpool.json',I/'UPSTREAM-INPUTS.json',I/'PATH-ADAPTER.json',I/'PREPARATION.json']
for family,names in [('original',['pump','pump_fees']),('dependencies',['spl_token','spl_token_2022','associated_token'])]:
    for name in names:
        for fname in ['capture.json','deployed.so']:
            inputs.append(R/'evidence'/family/name/fname)
inputs += [R/'evidence/original/pump/program-account.bin',R/'evidence/original/pump/programdata-account.bin']
inputs += [Path(__file__).parent/'focused_execute_key.py']
inputs=list(dict.fromkeys(inputs))
initial={str(p):dict(sha256=sha(p),bytes=p.stat().st_size) for p in inputs}
commands=[('six',[sys.executable,str(I/'focused_costs_portable.py'),'--repo-root',str(R),'--parent',str(P),'--proposal',str(C),'--output',str(out/'costs-six.json.gz')]),('twenty',[sys.executable,str(R/'scripts/pump_with_captured_loader.py'),'--receipt',str(out/'costs20-loader.json'),str(I/'research/pump-shared-buyback-panic-20261028/runtime/producer.py'),'--repo-root',str(R),'--candidate',str(C),'--control',str(P),'--output',str(out/'costs20.json.gz')])]
commands.insert(0,('copy',[sys.executable,str(Path(__file__).parent/'focused_execute_key.py'),'--repo-root',str(R),'--parent',str(P),'--proposal',str(C),'--output',str(out/'copy-two.json.gz')]))
record=dict(scope='28 fresh signed original/current-parent/candidate runtime triples, including two explicit accumulator states, no compilation',pinned_input_commit='49d07973846893ac42df69ef9008a54b17f5b5bd',python=sys.version,python_executable=sys.executable,environment={k:os.environ.get(k) for k in ['PYTHONSAFEPATH','PYTHONPATH']},inputs=initial,commands=[dict(name=n,argv=c,cwd=str(R)) for n,c in commands],results=[])
def save(): (out/'execution.json').write_text(json.dumps(record,indent=2)+'\n')
save()
for name,cmd in commands:
    start=time.time()
    with (out/(name+'.stdout.log')).open('wb') as stdout,(out/(name+'.stderr.log')).open('wb') as stderr:
        r=subprocess.run(cmd,cwd=R,stdout=stdout,stderr=stderr)
    record['results'].append(dict(name=name,returncode=r.returncode,elapsed_seconds=round(time.time()-start,3),stdout_sha256=sha(out/(name+'.stdout.log')),stderr_sha256=sha(out/(name+'.stderr.log'))))
    save()
    print(json.dumps(record['results'][-1]),flush=True)
    if r.returncode: sys.exit(r.returncode)
record['inputs_unchanged']={str(p):sha(p)==initial[str(p)]['sha256'] for p in inputs}
record['output_files']={p.name:dict(sha256=sha(p),bytes=p.stat().st_size) for p in out.iterdir() if p.is_file() and p.name!='execution.json'}
save()
assert all(record['inputs_unchanged'].values())
print(json.dumps(dict(output=str(out),inputs_unchanged=True,compiler_invocations=0)),flush=True)
