#!/usr/bin/env python3
"""mv.py in.ll out.ll blk after_blk : move basic block blk to right after after_blk (in v3_execute_buy)"""
import sys,re
src,dst,b,after=sys.argv[1:5]
t=open(src).read()
i=t.index('define internal fastcc void @_ZN14pump_recovered5trade14v3_execute_buy17h'); j=t.index('\n}\n',i)
f=t[i:j]
parts=re.split(r'\n\n',f)
hdr=lambda p:p.split(':')[0]
idx={hdr(p):k for k,p in enumerate(parts)}
blk=parts.pop(idx[b]); k=[hdr(p) for p in parts].index(after); parts.insert(k+1,blk)
open(dst,'w').write(t[:i]+'\n\n'.join(parts)+t[j:])
