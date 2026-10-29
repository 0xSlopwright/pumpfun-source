"""Diagnostic IR counterfactual only: not recovered source or a deployable candidate."""
from pathlib import Path
import hashlib,importlib.util,json,subprocess,time
D=Path(__file__).resolve().parent
OLD=b'  %_208.0.i = extractvalue { i64, ptr } %104, 0\n  %_208.1.i = extractvalue { i64, ptr } %104, 1\n'
NEW=b'  %_208.1.i = extractvalue { i64, ptr } %104, 1\n  %_208.0.i = extractvalue { i64, ptr } %104, 0\n'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,x):p.write_bytes((json.dumps(x,indent=2)+'\n').encode())
def main():
 out=D/'extract-order01';out.mkdir();source=(D/'extracted01/target.ll').read_bytes();assert source.count(OLD)==1
 for kind,data in [('control',source),('swapped',source.replace(OLD,NEW))]:(out/(kind+'.ll')).write_bytes(data)
 launch=json.loads((D/'extracted01/compile-launch.json').read_bytes());env=launch['environment'];s=importlib.util.spec_from_file_location('inspect_codegen',D/'inspect_codegen.py');m=importlib.util.module_from_spec(s);s.loader.exec_module(m);baseline,base=m.target(D/'extracted01/target.o');reports={}
 save(out/'hypothesis.json',{'scope':__doc__,'hypothesis':'The two independent aggregate extracts determine export-copy order. A bottom-up scheduler can reverse that order in final loads. Change only their IR order to test the mechanism, with an unedited IR text control first. No source reconstruction, modified maintained artifact or runtime claim.','old':OLD.decode(),'new':NEW.decode(),'extracted_bitcode_sha256':sha(D/'extracted01/target.bc'),'source_sha256':sha(D/'extracted01/target.ll'),'controller_sha256':sha(Path(__file__))})
 for kind in ['control','swapped']:
  command=launch['command'][:-4]+[str(out/(kind+'.ll')),'-o',str(out/(kind+'.o'))] if False else launch['command'][:]
  command[-3]=str(out/(kind+'.ll'));command[-1]=str(out/(kind+'.o'))
  command+=['-debug-only=isel-dump,pre-RA-sched','-filter-print-funcs='+m.SYMBOL]
  save(out/(kind+'-launch.json'),{'command':command,'cwd':str(D),'environment':env,'tool_sha256':sha(Path(command[0])),'input_sha256':sha(out/(kind+'.ll'))});start=time.time()
  with(out/(kind+'.stdout.log')).open('wb') as stdout,(out/(kind+'.stderr.log')).open('wb') as stderr:r=subprocess.run(command,cwd=D,env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
  result={'returncode':r.returncode,'seconds':time.time()-start,'logs':{n:{'sha256':sha(out/(kind+'.'+n+'.log')),'bytes':(out/(kind+'.'+n+'.log')).stat().st_size} for n in ['stdout','stderr']}};save(out/(kind+'-result.json'),result);assert r.returncode==0
  info,raw=m.target(out/(kind+'.o'));reports[kind]={'object':info,'target_equal_to_extracted':raw==base,'relocations_equal_to_extracted':info['relocations']==baseline['relocations'],'different_slots':[{'slot':i//8,'old':base[i:i+8].hex(),'new':raw[i:i+8].hex()} for i in range(0,max(len(base),len(raw)),8) if base[i:i+8]!=raw[i:i+8]]};save(out/'comparisons.json',reports)
  print(kind,json.dumps({k:v for k,v in reports[kind].items() if k!='object'}),flush=True)
  if kind=='control':assert raw==base and info['relocations']==baseline['relocations'],'Unedited text does not qualify'
if __name__=='__main__':main()
