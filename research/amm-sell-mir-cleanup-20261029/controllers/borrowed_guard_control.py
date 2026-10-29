"""One new source-order hypothesis, copied dependencies, no target execution."""
from pathlib import Path
import hashlib,importlib.util,json,shutil,subprocess,time
D=Path(__file__).resolve().parent;W=D.parent
NAME='10-borrowed-guard';SELL='programs/pump-amm/src/instructions/swap/sell.rs'
OLD=b'        let data = user_volume_accumulator.try_borrow_data()?;'
NEW=b'        let data = &user_volume_accumulator.try_borrow_data()?;'

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,v):p.write_bytes((json.dumps(v,indent=2)+'\n').encode())
def inventory(p):return {f.relative_to(p).as_posix():sha(f) for f in p.rglob('*') if f.is_file()}
def main():
    base=D/'01-baseline';prior=D/'02-machine-trace';out=D/NAME
    binding=json.loads((D/'source-binding.json').read_bytes())
    assert inventory(base/'source')==binding['workspace_sha256']
    out.mkdir(exist_ok=False);shutil.copytree(base/'source',out/'source');shutil.copytree(base/'target',out/'target');(out/'temp').mkdir()
    p=out/'source'/SELL;b=p.read_bytes();assert b.count(OLD)==1;p.write_bytes(b.replace(OLD,NEW));before=inventory(out/'source')
    launch=json.loads((prior/'launch.json').read_bytes());command=[x.replace(str(prior),str(out)) for x in launch['before']]
    env={k:v.replace(str(prior),str(out)) for k,v in launch['environment'].items()}
    controller=sha(Path(__file__))
    save(out/'launch.json',dict(command=command,cwd=str(out/'source'),environment=env,source_inputs=before,source_change=dict(path=SELL,old=OLD.decode(),new=NEW.decode()),controller_sha256=controller,copied_dependencies_from=str(base/'target'),compiler_commands=1,target_executions=0))
    start=time.time()
    with (out/'stdout.log').open('wb') as stdout,(out/'stderr.log').open('wb') as stderr:
        r=subprocess.run(command,cwd=out/'source',env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
    result=dict(returncode=r.returncode,seconds=time.time()-start,target_executions=0,source_unchanged=before==inventory(out/'source'),controller_unchanged=controller==sha(Path(__file__)),logs={n:dict(sha256=sha(out/n),bytes=(out/n).stat().st_size) for n in ['stdout.log','stderr.log']})
    if r.returncode==0:
        shutil.copyfile(out/'target/sbpf-solana-solana/release/deps/pump_amm_recovered.so',out/'symbols.so');result['sha256']=sha(out/'symbols.so')
    save(out/'result.json',result);print(json.dumps(result,indent=2),flush=True)
    if r.returncode:return
    s=importlib.util.spec_from_file_location('measure',W/'amm-fresh-v144/measure.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
    measured=m.measure(out/'symbols.so');save(out/'measurement.json',measured);print({k:v for k,v in measured.items() if k!='rows'},flush=True)
if __name__=='__main__':main()
