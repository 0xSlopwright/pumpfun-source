#!/usr/bin/env python3
"""bf.py MODE: brute force single-block moves; MODE=after:<label> or before:<label>. Prints best masked diff."""
import sys,os,subprocess,re,difflib
sys.path.insert(0,os.path.dirname(__file__)); import rep, irx
from concurrent.futures import ThreadPoolExecutor
SDK=irx.SDK
base=open(os.environ.get('IRBASE',os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/w4-sellv2-a/out/ir-base/pump_recovered.ll'))).read()
pre_ed=os.environ.get('PRE')
if pre_ed:
    import runpy; base=runpy.run_path(pre_ed)['edit'](base)
base=rep.named(base) if '%v1 ' not in base else base
pre,parts,post=rep.blocks(base); L=[rep.lab(p) for p in parts]
mode,anchor=sys.argv[1].split(':',1)
o=[re.sub(r'^(j\w+ .*?)[+-]0x[0-9a-f]+$',r'\1J',l) for l in open(os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/w4-sellv2-a/orig.txt')).read().splitlines()]
D=os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/w4-sellv2-a/bf'); os.makedirs(D,exist_ok=True)
def score(c):
    c=[re.sub(r'^(j\w+ .*?)[+-]0x[0-9a-f]+$',r'\1J',l) for l in c]
    sm=difflib.SequenceMatcher(None,o,c,autojunk=False); n=0
    for tag,i1,i2,j1,j2 in sm.get_opcodes():
        if tag!='equal': n+=max(i2-i1,j2-j1)
    return n
def run(k):
    b=L[k]
    if b==anchor or k==0: return None
    try: t=rep.move_range(base,b,b,**{mode:anchor})
    except Exception as e: return None
    f=f'{D}/{os.getpid()}_{k}.ll'; ob=f[:-3]+'.o'
    open(f,'w').write(t)
    r=subprocess.run([SDK+'/llvm/bin/llc','-O3','-relocation-model=pic','-mattr=+store-imm,+jmp-ext',f,'-filetype=obj','-o',ob],capture_output=True)
    os.remove(f)
    if r.returncode: return None
    a,sz=irx.symfn(ob,irx.SYM); c=irx.objfn(ob,a,sz); os.remove(ob)
    return (score(c),b)
with ThreadPoolExecutor(int(os.environ.get('J','6'))) as ex:
    res=[r for r in ex.map(run,range(len(L))) if r]
res.sort()
for s,b in res[:int(os.environ.get('TOP','12'))]: print(s,b)
