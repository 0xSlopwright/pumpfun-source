# bdiff.py a.bin b.bin : op-level diff chunks between two candidate bodies
import sys,difflib
def toks(raw):
    i=0;r=[]
    while i<len(raw):
        k=16 if raw[i]==0x18 else 8; r.append((i,raw[i:i+2])); i+=k
    return r
a=toks(open(sys.argv[1],'rb').read()); b=toks(open(sys.argv[2],'rb').read())
sm=difflib.SequenceMatcher(None,[x[1][:1] for x in a],[x[1][:1] for x in b],autojunk=False)
for op,i1,i2,j1,j2 in sm.get_opcodes():
    if op!='equal' and max(i2-i1,j2-j1)>3: print(op, hex(a[i1][0]) if i1<len(a) else '-', i2-i1, hex(b[j1][0]) if j1<len(b) else '-', j2-j1)
