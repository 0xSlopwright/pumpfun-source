# offuse.py rel.txt lo hi : for r10 offsets in [lo,hi], list code offsets that touch them
import sys,re,collections
f,lo,hi=sys.argv[1],int(sys.argv[2],16),int(sys.argv[3],16)
u=collections.defaultdict(list); last=None
for l in open(f):
    p=l.split(None,1)
    if len(p)<2 or l.lstrip().startswith(';'): continue
    try: a=int(p[0],16)
    except: continue
    m=re.search(r'\[r10 - (0x[0-9a-f]+)\]',p[1])
    if m: u[int(m.group(1),16)].append(a)
    m=re.match(r'add64 r\d, -(0x[0-9a-f]+)',p[1])
    if m and last and re.match(r'mov64 r\d, r10',last): u[int(m.group(1),16)].append(a)
    last=p[1]
for o in sorted(u):
    if lo<=o<=hi: print(hex(o), ' '.join(hex(x) for x in u[o][:12]))
