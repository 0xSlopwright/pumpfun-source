"""One bounded source control for aggregate promotion; no target execution."""
from pathlib import Path
import hashlib,importlib.util,json,shutil,subprocess,time
D=Path(__file__).resolve().parent
OLD=b'  require_gte!(spendable_sol_in,total,PumpError::TooMuchSolRequired);'
NEW=b'  if spendable_sol_in<total{let mut pending=Some(error!(PumpError::TooMuchSolRequired).with_values((spendable_sol_in,total)));return Err(pending.take().unwrap());}'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def inv(p):return {f.relative_to(p).as_posix():sha(f) for f in sorted(p.rglob('*')) if f.is_file()}
def main():
 base=D/'02-guard';out=D/'07-addressable-return';out.mkdir();shutil.copytree(base/'source',out/'source');shutil.copytree(base/'target',out/'target');(out/'temp').mkdir()
 old=json.loads((base/'launch.json').read_bytes());require_source=old['source_inputs'];assert inv(out/'source')==require_source
 name='programs/pump/src/buy.rs';p=out/'source'/name;b=p.read_bytes();assert b.count(OLD)==1;assert b.splitlines()[132]==OLD;p.write_bytes(b.replace(OLD,NEW));inputs=inv(out/'source');assert [n for n in inputs if inputs[n]!=require_source[n]]==[name]
 command=[x.replace(str(base),str(out)) for x in json.loads((base/'root-command.json').read_bytes())];env={k:v.replace(str(base),str(out)) for k,v in old['environment'].items()};env.update(CARGO_MANIFEST_DIR=str(out/'source/programs/pump'),CARGO_PKG_NAME='pump-recovered',CARGO_PKG_VERSION='0.1.0',CARGO_CRATE_NAME='pump_recovered')
 tools=old['tools'];assert all(sha(Path(n))==h for n,h in tools.items())
 save(out/'launch.json',{'command':command,'cwd':str(out/'source'),'environment':env,'source_inputs':inputs,'source_change':{'path':name,'line':133,'old':OLD.decode(),'new':NEW.decode()},'tools':tools,'controller_sha256':sha(Path(__file__)),'compiler_commands':1,'target_executions':0,'hypothesis':'Pinned Rust DirectOperand and Store paths both initially extract field0 before field1. Taking a known Some(Error) through an addressable temporary exercises later aggregate promotion rather than changing the scheduler or emitted IR. The success/error condition and error arguments are identical; unwrap has a statically known Some input. This is a compiler control, not a claim about original source.'})
 start=time.time()
 with(out/'stdout.log').open('wb') as stdout,(out/'stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=out/'source',env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 result={'returncode':r.returncode,'seconds':time.time()-start,'source_unchanged':inputs==inv(out/'source'),'tools_unchanged':all(sha(Path(n))==h for n,h in tools.items()),'target_executions':0,'logs':{n:sha(out/n) for n in ['stdout.log','stderr.log']}}
 if r.returncode==0:
  shutil.copyfile(out/'target/sbpf-solana-solana/release/deps/pump_recovered.so',out/'symbols.so');result.update(symbols_sha256=sha(out/'symbols.so'),whole_output_equal=(out/'symbols.so').read_bytes()==(base/'symbols.so').read_bytes())
 save(out/'result.json',result);print(json.dumps(result,indent=2),flush=True)
 if r.returncode:print((out/'stderr.log').read_text(errors='replace')[-4000:]);return
 assert result['source_unchanged'] and result['tools_unchanged'];s=importlib.util.spec_from_file_location('measure',D/'measure.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);m.main(out.name)
if __name__=='__main__':main()
