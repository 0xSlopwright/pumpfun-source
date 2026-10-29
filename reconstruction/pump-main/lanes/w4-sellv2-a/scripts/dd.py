#!/usr/bin/env python3
"""dd.py fn.txt [lo hi]: diff vs orig with jump offsets masked; print hunks."""
import sys,re,difflib
def m(l): return re.sub(r'([+-]0x[0-9a-f]+)$',lambda x:'J' if re.match(r'(ja|j\w+ r\d+, (r\d+|-?0x[0-9a-f]+),)',l) else x.group(1),l)
def mk(L): return [re.sub(r'^(j\w+ .*?)[+-]0x[0-9a-f]+$',r'\1J',l) for l in L]
o=mk(open('/Users/shawwalters/.cache/pumpfun-reconstruction/lanes/w4-sellv2-a/orig.txt').read().splitlines())
c=mk(open(sys.argv[1]).read().splitlines())
sm=difflib.SequenceMatcher(None,o,c,autojunk=False)
n=0;out=[]
for tag,i1,i2,j1,j2 in sm.get_opcodes():
    if tag=='equal': continue
    n+=max(i2-i1,j2-j1)
    out.append(f'@{i1}-{i2} / {j1}-{j2} {tag}')
    for l in o[i1:i2]: out.append('  < '+l)
    for l in c[j1:j2]: out.append('  > '+l)
print('masked-diff',n,'hunks',len([x for x in out if x[0]=='@']))
if len(sys.argv)>2: print('\n'.join(out))
