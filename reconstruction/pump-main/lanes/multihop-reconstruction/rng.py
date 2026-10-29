import sys
f,lo,hi=sys.argv[1],int(sys.argv[2],16),int(sys.argv[3],16); pr=False
for l in open(f):
    p=l.split(None,1)
    if l.lstrip().startswith(';'):
        if pr: print(l.rstrip())
        continue
    try: o=int(p[0],16)
    except: continue
    pr=lo<=o<=hi
    if pr: print(l.rstrip())
