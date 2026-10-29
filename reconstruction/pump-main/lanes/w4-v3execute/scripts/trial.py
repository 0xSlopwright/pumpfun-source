#!/usr/bin/env python3
"""trial.py name slot edits.py : copy crate, apply edits (list of (old,new) in EDITS), capture IR build, report."""
import sys,subprocess,os,shutil,runpy,re,json
WT='/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/w4-v3execute'
OUT=os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/w4-v3execute')
CAP=WT+'/reconstruction/pump-main/lanes/exactsol-introspection/scripts/capture.py'
name,slot,ed=sys.argv[1:4]
src=f'{OUT}/trials/{name}'
if os.path.exists(src): shutil.rmtree(src)
shutil.copytree(WT+'/programs/pump',src)
ns=runpy.run_path(ed); f=src+'/src/'+ns.get('FILE','trade_v3.rs'); t=open(f).read()
for o,n in ns['EDITS']:
    if o is None: continue
    assert t.count(o)==1,(o[:80],t.count(o)); t=t.replace(o,n)
open(f,'w').write(t)
o=f'{OUT}/out/{name}'
env=dict(os.environ,PUMP_BUILD_SLOTS='10')
r=subprocess.run(['python3',CAP,src,f'{OUT}/work{slot}',o],capture_output=True,text=True,env=env)
if '"ok": true' not in r.stdout: print(name,'BUILD FAILED'); print(r.stdout[-1500:]); 
    # show compile error
else:
    T=WT+'/reconstruction/harness'
    m=subprocess.run(['python3',T+'/target_metric.py',o+'/unstripped.so','0x83c00','--sym','v3_execute_buy$'],capture_output=True,text=True).stdout.strip()
    print(name,m)
    os.chdir(OUT+'/irx')
    subprocess.run(['python3','../scripts/reduce.py',o+'/pump_recovered.ll',name+'.ll','v3_execute_buy17h'])
    t=open(name+'.ll').read(); i=t.index('define internal fastcc void @_ZN14pump_recovered5trade14v3_execute_buy17h'); j=t.index('\n}\n',i)
    print('blocks:',' '.join(l[:24] for l in re.findall(r'^([\w.$"]+):',t[i:j],re.M)))
    subprocess.run(['python3','../scripts/irc.py',name+'.ll'],env=dict(os.environ,Q='1'))
    subprocess.run(['python3','../scripts/shape.py',name+'.ll'])
