#!/usr/bin/env python3
"""evalv.py <worker 0-2> <name> <buy_v2.rs>  -> builds variant, prints JSON metrics, writes out/<name>/metrics.json"""
import sys, json, subprocess, shutil, hashlib, os
from pathlib import Path
OUT=Path.home()/'.cache/pumpfun-reconstruction/lanes/buyv2-hillclimb'
TOOLS=Path('/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/restore/reconstruction')
WT=Path('/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/buyv2-hillclimb')
BASE=Path.home()/'.cache/pumpfun-reconstruction/baseline-main-d2cb88d'
TARGETS={'0x13f630':r'buy_exact_quote_in_handler$','0x13b9b8':r'buy_v2::buy_handler$'}
def run(worker,name,src_file):
    srcdir=OUT/f'src{worker}'
    subprocess.run(['rsync','-a','--delete','--exclude','target',str(WT/'programs/pump')+'/',str(srcdir)+'/'],check=True)
    shutil.copy(src_file,srcdir/'src/buy_v2.rs')
    o=OUT/'out'/name; o.mkdir(parents=True,exist_ok=True)
    shutil.copy(src_file,o/'buy_v2.rs')
    env=dict(os.environ,PUMP_BUILD_SLOTS='10')
    for attempt in range(3):
        if (o/'unstripped.so').exists(): (o/'unstripped.so').unlink()
        r=subprocess.run(['python3',str(TOOLS/'harness/fastbuild.py'),'--src',str(srcdir),'--work',str(OUT/f'work{worker}'),'--out',str(o)],capture_output=True,text=True,env=env)
        if 'could not parse/generate dep info' not in r.stdout+r.stderr: break
    m={'name':name}
    if r.returncode!=0 or not (o/'unstripped.so').exists():
        m['status']='compile-failed'; s_=r.stdout+r.stderr; import re as _re
        m['err']='\n'.join(_re.findall(r'^error.*\n(?:.*\n){0,8}',s_,_re.M))[-3000:] or s_[-3000:]
    else:
        so=o/'unstripped.so'
        subprocess.run(['python3',str(TOOLS/'harness/score.py'),str(so),'--baseline',str(BASE/'score.json'),'--json',str(o/'score.json'),'--quiet'],capture_output=True,text=True)
        s=json.load(open(o/'score.json'))
        m['score']={k:s['summary'].get(k) for k in ('normalized','raw','gains','losses','raw_gains','raw_losses')}
        m['sha']=hashlib.sha256(so.read_bytes()).hexdigest()
        m['t']={}
        for w,sym in TARGETS.items():
            t=subprocess.run(['python3',str(TOOLS/'harness/target_metric.py'),str(so),w,'--sym',sym],capture_output=True,text=True).stdout.strip().splitlines()
            m["t"][w]=json.loads(t[0]) if t else None
        m['status']='built'
    json.dump(m,open(o/'metrics.json','w'),indent=1)
    return m
if __name__=='__main__':
    m=run(sys.argv[1],sys.argv[2],sys.argv[3])
    print(json.dumps({k:v for k,v in m.items() if k!='t'}|{'t':{w:(x and {k:x[k] for k in ('cand_bytes','ratio','normalized_equal','calls_candidate')}) for w,x in m.get('t',{}).items()}}))
