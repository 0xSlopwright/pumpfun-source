from pathlib import Path
import argparse,hashlib,json,subprocess,sys
W=Path(__file__).resolve().parent
def main():
 p=argparse.ArgumentParser();p.add_argument('--candidate',type=Path,required=True);p.add_argument('--output',type=Path,required=True);p.add_argument('--inputs',type=Path,required=True);a=p.parse_args();C,I,O=a.candidate.resolve(),a.inputs.resolve(),a.output.resolve();O.mkdir(exist_ok=False)
 sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest();
 if(W/'expected-inputs.json').exists():assert {str(p.relative_to(I)):sha(p)for p in I.rglob('*')if p.is_file()}==json.loads((W/'expected-inputs.json').read_bytes())
 (O/'inputs.json').write_text(json.dumps({str(p.relative_to(I)):sha(p)for p in I.rglob('*')if p.is_file()},indent=2)+'\n')
 cmd=[sys.executable,'-B',str(W/'observer.py'),str(O/'transactions.json.gz'),str(W/'probe_minimum.py'),'--candidate',str(C),'--output',str(O/'report.json')]
 with(O/'run.log').open('w')as log:subprocess.run(cmd,cwd=I,stdout=log,stderr=subprocess.STDOUT,check=True)
 subprocess.run([sys.executable,'-B',str(W/'verify_minimum.py'),'--directory',str(O),'--candidate',str(C),'--inputs',str(I),'--producer',str(W/'probe_minimum.py'),'--observer',str(W/'observer.py')],check=True)
if __name__=='__main__':main()
