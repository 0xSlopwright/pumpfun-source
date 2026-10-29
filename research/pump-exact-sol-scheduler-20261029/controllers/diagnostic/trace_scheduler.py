"""Capture actual internal scheduling diagnostics; retain all emitted bytes."""
from pathlib import Path
import hashlib,importlib.util,json,subprocess,time
D=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def main():
 base=D/'extracted01';out=D/'scheduler01';out.mkdir();launch=json.loads((base/'compile-launch.json').read_bytes());command=launch['command'];command[-1]=str(out/'target.o');command+=['-debug-only=isel-dump,pre-RA-sched','-filter-print-funcs=_ZN14pump_recovered14pump_recovered16buy_exact_sol_in17h28eae2e2fdc8f8b2E'];env=launch['environment']
 save(out/'launch.json',{'command':command,'cwd':str(D),'environment':env,'tool_sha256':sha(Path(command[0])),'input_sha256':sha(base/'target.bc'),'controller_sha256':sha(Path(__file__)),'scope':'Diagnostic compiler on an unedited function extraction; no target execution.'});start=time.time()
 with(out/'stdout.log').open('wb') as stdout,(out/'stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=D,env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 result={'returncode':r.returncode,'seconds':time.time()-start,'tool_unchanged':sha(Path(command[0]))==launch['tool_sha256'],'input_sha256':sha(base/'target.bc'),'outputs':{'target.o':sha(out/'target.o')} if (out/'target.o').exists() else {},'logs':{n:{'sha256':sha(out/n),'bytes':(out/n).stat().st_size} for n in ['stdout.log','stderr.log']},'complete_object_equal_to_untraced':r.returncode==0 and (out/'target.o').read_bytes()==(base/'target.o').read_bytes()};save(out/'result.json',result);print(json.dumps(result,indent=2),flush=True);assert r.returncode==0 and result['complete_object_equal_to_untraced'] and result['tool_unchanged']
if __name__=='__main__':main()
