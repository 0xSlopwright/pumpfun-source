from pathlib import Path
import argparse,hashlib,json,shutil,subprocess,sys,tempfile
W=Path(__file__).resolve().parent
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);p.add_argument('--candidate',type=Path,required=True);p.add_argument('--symbols',type=Path,required=True);a=p.parse_args();root=a.root.resolve()
assert H(a.candidate)=='be10ca1a530ef9c62be5c94a5183f339e5d7661dce588a9458767e20a5e488f6'and H(a.symbols)=='39420099acbe3f90c1e62d449e8892775b751f8c84aa61ac78c8425fdf9c2af3'
with tempfile.TemporaryDirectory(prefix='amm-sixth-portable-proof-')as td:
 d=Path(td)/'packet';shutil.copytree(W,d);assert not d.is_relative_to(root)
 for src,name in [(a.candidate,'pump_amm_recovered.so'),(a.symbols,'unstripped.so')]:
  dst=d/'results/build/artifacts'/name;assert H(src)==H(dst);shutil.copy2(src,dst)
 run=subprocess.run([sys.executable,'-B',str(d/'verify.py'),'--root',str(root)],cwd=Path(td),capture_output=True,text=True);assert run.returncode==0,run.stderr
 result=json.loads(run.stdout);assert result['passed']and result['raw_gains']==19
 print(json.dumps({'passed':True,'outside_repository':True,'candidate_sha256':H(a.candidate),'symbols_sha256':H(a.symbols),'uses_local_fifth_baseline':True,'verification':result},indent=2))
