from pathlib import Path
import argparse,json,os,shutil,subprocess,sys,tempfile
W=Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path);p.add_argument('--symbols',type=Path);a=p.parse_args();root=a.root.resolve()
with tempfile.TemporaryDirectory(prefix='amm-pooled-portability-')as td:
 t=Path(td)/'packet';shutil.copytree(W,t)
 cmd=[sys.executable,'-B',str(t/'verify.py'),'--root',str(root)]
 if a.candidate:cmd+=['--candidate',str(a.candidate.resolve())]
 if a.symbols:cmd+=['--symbols',str(a.symbols.resolve())]
 env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1');r=subprocess.run(cmd,cwd=td,env=env,capture_output=True,text=True);assert r.returncode==0,(r.stdout,r.stderr);positive=json.loads(r.stdout)
 negatives=[]
 for name in ['indexed.json','inputs/core-escape.rs']:
  q=t/name;saved=q.read_bytes();q.write_bytes(saved+b'\n')
  r=subprocess.run(cmd,cwd=td,env=env,capture_output=True,text=True);assert r.returncode!=0 and 'AssertionError' in r.stderr;negatives.append(name);q.write_bytes(saved)
 print(json.dumps({'passed':True,'external_directory_positive':positive,'changed_packet_files_rejected':negatives},indent=2))
