import sys,re
L=open(sys.argv[1]).read().split('\n'); sym=sys.argv[2]
s=next(i for i,l in enumerate(L) if l.startswith('define') and sym in l)
while not L[s].rstrip().endswith('{'): s+=1
e=next(i for i in range(s,len(L)) if L[i]=='}')
blocks=[];cur=['entry',[]]
for l in L[s+1:e]:
    m=re.match(r'^([0-9]+):',l)
    if m: blocks.append(cur); cur=[m.group(1),[l]]
    else: cur[1].append(l)
blocks.append(cur)
for n,bl in blocks:
    calls=[]
    for x in bl:
        m=re.search(r'\b(?:call|invoke)\b[^@]*@("[^"]+"|[\w.$]+)',x)
        if m and 'llvm.lifetime' not in m.group(1): calls.append(re.sub(r'17h[0-9a-f]{16}E"?$','',m.group(1)).replace('llvm.','')[-34:])
    term=[x.strip()[:80] for x in bl if x.strip().startswith(('br ','switch','ret','unreachable'))]
    print(n, len(bl), calls, term)
