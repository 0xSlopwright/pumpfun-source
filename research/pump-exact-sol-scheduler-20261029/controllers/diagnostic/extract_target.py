"""Qualify an unedited single-function extraction before scheduler diagnosis."""
from pathlib import Path
import hashlib,importlib.util,json,subprocess,time
D=Path(__file__).resolve().parent;W=D.parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def main():
 out=D/'extracted01';out.mkdir();tools=D/'build01/bin';stock=W/'pump-exact-sol-controls/06-bitcode-object';env=json.loads((D/'attempt01/build-launch.json').read_bytes())['environment']
 s=importlib.util.spec_from_file_location('inspect_codegen',D/'inspect_codegen.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
 commands=[('extract',[str(tools/'llvm-extract.exe'),'--func='+m.SYMBOL,'--keep-const-init',str(stock/'root.bc'),'-o',str(out/'target.bc')]),('compile',[str(tools/'llc.exe'),'-O3','-filetype=obj','-mcpu=generic','-mattr=+store-imm,+jmp-ext','-relocation-model=pic','-function-sections','-data-sections',str(out/'target.bc'),'-o',str(out/'target.o')])]
 for label,command in commands:
  save(out/(label+'-launch.json'),{'command':command,'cwd':str(D),'environment':env,'tool_sha256':sha(Path(command[0])),'controller_sha256':sha(Path(__file__))});start=time.time()
  with(out/(label+'.stdout.log')).open('wb') as stdout,(out/(label+'.stderr.log')).open('wb') as stderr:r=subprocess.run(command,cwd=D,env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
  save(out/(label+'-result.json'),{'returncode':r.returncode,'seconds':time.time()-start,'logs':{n:sha(out/(label+'.'+n+'.log')) for n in ['stdout','stderr']}});assert r.returncode==0,label
 a,ab=m.target(stock/'root.o');b,bb=m.target(out/'target.o');result={'stock':a,'extracted':b,'target_raw_equal':ab==bb,'relocations_equal':a['relocations']==b['relocations'],'different_target_bytes':sum(i>=len(ab) or i>=len(bb) or ab[i]!=bb[i] for i in range(max(len(ab),len(bb)))),'bitcode_sha256':sha(out/'target.bc'),'object_sha256':sha(out/'target.o')};save(out/'comparison.json',result);print(json.dumps({k:v for k,v in result.items() if k not in ['stock','extracted']},indent=2))
if __name__=='__main__':main()
