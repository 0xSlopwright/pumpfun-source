"""Recorded repeat binding the extracted bitcode to the unchanged text control."""
from pathlib import Path
import hashlib,json,subprocess,time
D=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 out=D/'text-binding02';out.mkdir();exe=D/'build01/bin/llvm-dis.exe';source=D/'extracted01/target.bc';dest=out/'target.ll';command=[str(exe),'work/l18/extracted01/target.bc','-o',str(dest)];env=json.loads((D/'attempt01/build-launch.json').read_bytes())['environment'];record={'command':command,'environment':env,'cwd':str(D.parent.parent),'input_sha256':sha(source),'tool_sha256':sha(exe),'controller_sha256':sha(Path(__file__))};(out/'launch.json').write_text(json.dumps(record,indent=2)+'\n');start=time.time()
 with(out/'stdout.log').open('wb') as stdout,(out/'stderr.log').open('wb') as stderr:r=subprocess.run(command,cwd=D.parent.parent,env=env,stdout=stdout,stderr=stderr,creationflags=subprocess.CREATE_NO_WINDOW)
 result={'returncode':r.returncode,'seconds':time.time()-start,'input_unchanged':sha(source)==record['input_sha256'],'tool_unchanged':sha(exe)==record['tool_sha256'],'output_sha256':sha(dest),'complete_text_equal_to_control':dest.read_bytes()==(D/'extract-order02/control.ll').read_bytes(),'logs':{n:sha(out/n) for n in ['stdout.log','stderr.log']}};(out/'result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2));assert r.returncode==0 and result['complete_text_equal_to_control']
if __name__=='__main__':main()
