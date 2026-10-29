#!/usr/bin/env python3
"""np.py trial slot: capture unoptimized IR + PreCodegen MIR for trials/<trial> (already edited), print rustc block creation order"""
import sys,subprocess,os,re,glob
OUT=os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/w4-v3execute')
name,slot=sys.argv[1:3]
o=f'{OUT}/out/{name}_np'; os.makedirs(o+'/mir',exist_ok=True)
for f in glob.glob(o+'/mir/*'): os.remove(f)
r=subprocess.run(['python3',OUT+'/scripts/capture2.py',f'{OUT}/trials/{name}',f'{OUT}/work{slot}',o,'-C','no-prepopulate-passes','-Zdump-mir=v3_execute_buy','-Zdump-mir-dir='+o+'/mir'],capture_output=True,text=True,env=dict(os.environ,PUMP_BUILD_SLOTS='10'))
t=open(o+'/pump_recovered.ll').read(); k=t.index('14v3_execute_buy17h'); k=t.index('v3_execute_buy17h',t.index('\ndefine',k-400) if False else k)
# find define line for function (not closure)
m=re.search(r'\ndefine [^\n]*@_ZN14pump_recovered5trade14v3_execute_buy17h[0-9a-f]+E\(',t)
i=m.start(); j=t.index('\n}\n',i)
print('unopt:',' '.join(re.findall(r'^([\w.$"]+):',t[i:j],re.M)))
