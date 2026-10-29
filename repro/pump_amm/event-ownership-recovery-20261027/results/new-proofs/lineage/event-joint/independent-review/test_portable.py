from pathlib import Path
import argparse,json,os,shutil,subprocess,sys,tempfile
W=Path(__file__).resolve().parent
p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args()
with tempfile.TemporaryDirectory(prefix='amm-optional-context-portable-')as td:
 t=Path(td)/'proof';shutil.copytree(W,t)
 r=subprocess.run([sys.executable,'-B',str(t/'verify.py'),'--root',str(a.root.resolve())],cwd=td,env=dict(os.environ,PYTHONDONTWRITEBYTECODE='1'),capture_output=True,text=True)
 assert r.returncode==0,(r.stdout,r.stderr)
 print(json.dumps({'passed':True,'outside_repository':True,'verification':json.loads(r.stdout)},indent=2))
