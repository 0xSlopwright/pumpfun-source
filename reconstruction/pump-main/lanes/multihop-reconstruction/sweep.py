# sweep.py BASE.ll pairsfile tag [fixed ops...]  (3 parallel)
import sys,subprocess,os,concurrent.futures as cf
base,pf,tag=sys.argv[1:4]; fix=sys.argv[4:]
R=os.path.dirname(os.path.abspath(__file__))+'/reorder.py'
D=os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/multihop-reconstruction/ir/or')
ops=[l.strip() for l in open(pf) if l.strip()]
def run(op):
    n=os.path.join(D,tag+'_'+op.replace('>','_'))
    r=subprocess.run(['python3',R,base,n]+fix+[op],capture_output=True,text=True).stdout.strip().split('\n')[-1]
    for ext in ('.o','.o.bin'):
        try: os.remove(n+ext)
        except: pass
    return op+' '+r
with open(os.path.join(D,'res_'+tag+'.txt'),'w') as f, cf.ThreadPoolExecutor(3) as ex:
    for line in ex.map(run,ops): f.write(line+'\n'); f.flush()
