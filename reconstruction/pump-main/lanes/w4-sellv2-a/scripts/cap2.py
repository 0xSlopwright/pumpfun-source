#!/usr/bin/env python3
"""cap2.py src work out [sym]: build copy, dump MIR of sell_v2::execute + pre-inline IR of execute (scratch only)."""
import sys, subprocess, json, re
from pathlib import Path
T=Path('/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/w4-sellv2-a/reconstruction/harness')
sys.path.insert(0,str(T)); import fastbuild
src,work,out=map(Path,sys.argv[1:4]); out.mkdir(parents=True,exist_ok=True)
sym=sys.argv[4] if len(sys.argv)>4 else '_ZN14pump_recovered7sell_v27execute17hdee0c05d3d287fefE'
mir=out/'mir'; mir.mkdir(exist_ok=True)
extra=['--emit=link,llvm-ir',
 '-C','llvm-args=-filter-print-funcs='+sym,'-C','llvm-args=-print-before=annotation2metadata']
real=subprocess.run
def run(cmd,*a,**k):
    if isinstance(cmd,list) and len(cmd)>1 and str(cmd[0]).endswith('/cargo') and cmd[1]=='build':
        cmd=cmd[:]; cmd[1]='rustc'; cmd+=['--lib','--']+extra
    return real(cmd,*a,**k)
subprocess.run=run
try: r=fastbuild.build(src,work,out,recipe='identity')
finally: subprocess.run=real
import shutil
d=work/'target-identity/sbpf-solana-solana/release/deps'
p=d/'pump_recovered.ll'
if p.exists(): shutil.copy2(p,out/'pump_recovered.ll')
print(json.dumps(r,indent=1))
