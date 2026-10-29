"""Qualify diagnostic LLVM against stock compiler object code before inspecting scheduling."""
from pathlib import Path
import hashlib,importlib.util,json,shutil,subprocess,time
D=Path(__file__).resolve().parent;W=D.parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def main():
 out=D/'qualification01';out.mkdir();tools=D/'build01/bin';stock=W/'pump-exact-sol-controls/06-bitcode-object'
 built=json.loads((D/'attempt01/build-result.json').read_bytes());assert built['returncode']==0 and built['source_unchanged'];assert all(sha(tools/n)==h for n,h in built['outputs'].items())
 env=json.loads((D/'attempt01/build-launch.json').read_bytes())['environment'];commands=[]
 def run(label,args,outputs=()):
  command=[str(tools/args[0]),*map(str,args[1:])];r={'label':label,'command':command,'cwd':str(D),'environment':env,'tool_sha256':sha(Path(command[0])),'output_paths':[str(p) for p in outputs]};save(out/(label+'-launch.json'),r);start=time.time()
  with(out/(label+'.stdout.log')).open('wb') as stdout,(out/(label+'.stderr.log')).open('wb') as stderr:p=subprocess.run(command,cwd=D,env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
  r.update(returncode=p.returncode,seconds=time.time()-start,outputs={str(f):sha(f) for f in outputs if f.exists()},logs={n:sha(out/(label+'.'+n+'.log')) for n in ['stdout','stderr']});save(out/(label+'-result.json'),r);commands.append(r);print(label,'exit',p.returncode,flush=True);assert p.returncode==0
 run('version',['llc.exe','--version'])
 run('disassemble-bitcode',['llvm-dis.exe',stock/'root.bc','-o',out/'root.ll'],[out/'root.ll'])
 args=['llc.exe','-O3','-filetype=obj','-mtriple=sbpf-solana-solana','-relocation-model=pic','-function-sections','-data-sections']
 run('whole-module',[*args,stock/'root.bc','-o',out/'root.o'],[out/'root.o'])
 s=importlib.util.spec_from_file_location('inspect_codegen',D/'inspect_codegen.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
 left,lb=m.target(stock/'root.o');right,rb=m.target(out/'root.o');r={'stock':left,'diagnostic':right,'target_raw_equal':lb==rb,'relocations_equal':left['relocations']==right['relocations'],'whole_object_equal':(stock/'root.o').read_bytes()==(out/'root.o').read_bytes(),'different_target_bytes':sum(i>=len(lb) or i>=len(rb) or lb[i]!=rb[i] for i in range(max(len(lb),len(rb))))};save(out/'comparison.json',r);print(json.dumps({k:v for k,v in r.items() if k not in ['stock','diagnostic']},indent=2),flush=True)
if __name__=='__main__':main()
