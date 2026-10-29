from pathlib import Path
import hashlib,json,subprocess,threading
ROOT=Path(__file__).resolve().parent
CANDIDATE=ROOT/'build/artifacts/pump_amm_recovered.so'
EXPECTED='dbb5dcfd1a1487e22d61ae68d22a9b74087b78a868a08ab974c7bdbb127f1500'
LOCK=threading.Lock()
def check(cmd):
 args=[str(x)for x in cmd];checks=[]
 for i,arg in enumerate(args[:-1]):
  if arg in ['--candidate','--output','--reports']:
   p=Path(args[i+1]).resolve();assert p.is_relative_to(ROOT),(arg,str(p))
   if arg=='--candidate':assert p==CANDIDATE and hashlib.sha256(p.read_bytes()).hexdigest()==EXPECTED
   checks.append(arg)
 with LOCK:
  with(ROOT/'command-preflight.jsonl').open('a')as f:f.write(json.dumps({'command':args,'checked_options':checks,'candidate_sha256':EXPECTED})+'\n')
 return args
def guarded_run(cmd,*a,**kw):return subprocess.run(check(cmd),*a,**kw)
