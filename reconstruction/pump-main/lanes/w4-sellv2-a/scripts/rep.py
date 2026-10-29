# usage via env: edit file defines R=[(old,new),...]
import os
FN='define hidden { i64, ptr } @_ZN14pump_recovered14pump_recovered7sell_v2'
def apply(t,R):
    i=t.index(FN); j=t.index('\n}\n',i); b=t[i:j]
    for o,n in R:
        assert b.count(o)==1,(b.count(o),o[:80])
        b=b.replace(o,n)
    return t[:i]+b+t[j:]
import re
def named(t):
    i=t.index(FN); j=t.index('\n}\n',i)
    b=t[i:j+1]
    b=re.sub(r'%(\d+)\b',r'%v\1',b); b=re.sub(r'(?m)^(\d+):',r'v\1:',b)
    return t[:i]+b+t[j+1:]
def blocks(t):
    if '%v1 ' not in t: t=named(t)
    i=t.index(FN); j=t.index('\n}\n',i)
    body=t[i:j+1]; parts=body.split('\n\n')
    return t[:i],parts,t[j+1:]
def lab(p):
    m=re.match(r'^("[^"]+"|[^\s:]+):',p); return m.group(1) if m else None
def move_range(t,first,last,before=None,after=None):
    pre,parts,post=blocks(t); L=[lab(p) for p in parts]
    a=L.index(first); b=L.index(last); seg=parts[a:b+1]; del parts[a:b+1]; L=[lab(p) for p in parts]
    k=L.index(before) if before else L.index(after)+1
    parts[k:k]=seg
    return pre+'\n\n'.join(parts)+post
