import sys,re,itertools,subprocess,os
from concurrent.futures import ThreadPoolExecutor
src=sys.argv[1]; blocks=sys.argv[2].split(','); outf=sys.argv[3]
t=open(src).read()
i=t.index('define internal fastcc void @_ZN14pump_recovered5trade14v3_execute_buy17h'); j=t.index('\n}\n',i)
parts=re.split(r'\n\n',t[i:j]); hdr=lambda p:p.split(':')[0]
idx=[k for k,p in enumerate(parts) if hdr(p) in blocks]
lo,hi=min(idx),max(idx)
seg=parts[lo:hi+1]; assert all(hdr(p) in blocks for p in seg),[hdr(p) for p in seg]
byname={hdr(p):p for p in seg}
os.makedirs('perm',exist_ok=True)
def run(k_perm):
    k,perm=k_perm
    if hdr(parts[0])!='start' and False: pass
    np=parts[:lo]+[byname[b] for b in perm]+parts[hi+1:]
    fn=f'perm/p{k%16}_{os.getpid()}_{k}.ll'
    open(fn,'w').write(t[:i]+'\n\n'.join(np)+t[j:])
    r=subprocess.run(['python3','../scripts/irc.py',fn],capture_output=True,text=True,env=dict(os.environ,Q='1')).stdout.strip()
    os.remove(fn); 
    try: os.remove(fn[:-3]+'.o')
    except: pass
    return ' '.join(perm)+' :: '+r.split(': ',1)[-1]
perms=[p for p in itertools.permutations(blocks)]
with ThreadPoolExecutor(6) as ex, open(outf,'w') as o:
    for line in ex.map(run,enumerate(perms)):
        o.write(line+'\n'); o.flush()
