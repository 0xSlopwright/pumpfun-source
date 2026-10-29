import sys,json,subprocess
from pathlib import Path
sys.path.insert(0,'/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
import fastbuild
root=Path(__file__).resolve().parent
real_run=subprocess.run
name=sys.argv[1]
flags={'notaildup':['-C','llvm-args=-disable-tail-duplicate'],'tailmerge1':['-C','llvm-args=-tail-merge-size=1'],'nomisched':['-C','llvm-args=-enable-misched=false'],'schedsource':['-C','llvm-args=-pre-RA-sched=source'],'schedburr':['-C','llvm-args=-pre-RA-sched=list-burr'],'nosinkcommon':['-C','llvm-args=-simplifycfg-sink-common=false'],'emitir':['--emit=link,llvm-ir'],'debug2':['-C','debuginfo=2','-C','strip=none'],'mir3':['-Z','mir-opt-level=3']}[name]
def run(cmd,*args,**kw):
    if isinstance(cmd,list) and len(cmd)>1 and str(cmd[0]).endswith('/cargo') and cmd[1]=='build':
        cmd=cmd[:];cmd[1]='rustc';cmd+=['--lib','--']+flags
    return real_run(cmd,*args,**kw)
subprocess.run=run
out=root/('codegen-'+name+'-out')
result=fastbuild.build(root/'cost-second-if',root.parent.parent/('work/goal-pump-recovery-20261028/codegen-'+name+'-build'),out)
result['root_only_additional_flags']=flags
result['source']='cost-second-if'
(out/'result.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
