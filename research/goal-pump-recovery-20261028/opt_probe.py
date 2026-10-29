import sys,json,subprocess
from pathlib import Path
sys.path.insert(0,'/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
import fastbuild
root=Path(__file__).resolve().parent
real_run=subprocess.run
level=sys.argv[1]
def run(cmd,*args,**kw):
    if isinstance(cmd,list) and len(cmd)>1 and str(cmd[0]).endswith('/cargo') and cmd[1]=='build':
        cmd=cmd[:];cmd[1]='rustc';cmd+=['--lib','--','-C','opt-level='+level]
    return real_run(cmd,*args,**kw)
subprocess.run=run
result=fastbuild.build(root/'cost-second-if',root.parent.parent/'work/goal-pump-recovery-20261028/opt-build',root/('opt'+level+'-out'))
(root/('opt'+level+'-out')/'result.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
