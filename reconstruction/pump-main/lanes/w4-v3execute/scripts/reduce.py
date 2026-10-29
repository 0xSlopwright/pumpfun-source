#!/usr/bin/env python3
"""reduce.py in.ll out.ll symsubstr: keep only the define matching symsubstr; turn other defines into declares."""
import sys,re
src,dst,keep=sys.argv[1:4]
out=[];i=0;L=open(src).read().split('\n')
while i<len(L):
    l=L[i]
    if l.startswith('define '):
        j=i
        while L[j]!='}': j+=1
        if keep in l.split('(')[0]:
            out+=L[i:j+1]
        else:
            h=l
            h=re.sub(r'^define (internal |private |linkonce_odr |weak |weak_odr |hidden |dso_local |unnamed_addr )*','declare ',h)
            h=re.sub(r'\s*(personality [^{]*)?\{\s*$','',h)
            h=re.sub(r' (unnamed_addr|local_unnamed_addr) ',' ',h)
            h=re.sub(r' comdat(\([^)]*\))?','',h)
            h=re.sub(r' section "[^"]*"','',h)
            h=re.sub(r' align \d+(?=\s*(#|$))','',h)
            out.append(h)
        i=j+1; continue
    if re.match(r'^@\S+ = .*\balias\b',l): i+=1; continue
    out.append(l); i+=1
open(dst,'w').write('\n'.join(out))
