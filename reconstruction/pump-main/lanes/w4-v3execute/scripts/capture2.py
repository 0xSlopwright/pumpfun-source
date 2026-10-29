#!/usr/bin/env python3
"""capture2.py src work out [rustc args...]: like capture.py but extra raw rustc args (analysis only)."""
import sys, subprocess, json, shutil, os
from pathlib import Path
T=Path('/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/restore/reconstruction/harness')
sys.path.insert(0,str(T)); import fastbuild
src,work,out=map(Path,sys.argv[1:4]); extra=sys.argv[4:]
real=subprocess.run
def hook(cmd,*a,**k):
    if isinstance(cmd,list) and len(cmd)>1 and str(cmd[0]).endswith('/cargo') and cmd[1]=='build':
        cmd=cmd[:]; cmd[1]='rustc'; cmd+=['--lib','--','--emit=link,llvm-ir']+extra
        env=dict(k.get('env') or os.environ); env['RUSTC_BOOTSTRAP']='1'; k['env']=env
    return real(cmd,*a,**k)
subprocess.run=hook
try: r=fastbuild.build(src,work,out,recipe='identity')
finally: subprocess.run=real
d=work/'target-identity/sbpf-solana-solana/release/deps'
p=d/'pump_recovered.ll'
if p.exists(): shutil.copy2(p,out/'pump_recovered.ll')
print(json.dumps({k:v for k,v in r.items() if k in('ok','error')},indent=1)[:3000])
