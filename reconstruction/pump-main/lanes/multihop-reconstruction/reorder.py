#!/usr/bin/env python3
"""usage: reorder.py BASE.ll OUTPREFIX op... ; op 'X>Y' moves IR block X right after Y. Runs llc + ocmp."""
import sys,re,subprocess,os
B='/Users/shawwalters/Documents/Codex/2026-10-24/amm-sell-swarm/infra/sdk-native/rust/lib/rustlib/aarch64-apple-darwin/bin'
HERE=os.path.dirname(os.path.abspath(__file__))
src,name=sys.argv[1],sys.argv[2]; ops=sys.argv[3:]
lines=open(src).read().split('\n')
s=next(i for i,l in enumerate(lines) if l.startswith('define') and '8swap_hop17h' in l)
h=s
while not lines[h].rstrip().endswith('{'): h+=1
e=next(i for i in range(h,len(lines)) if lines[i]=='}')
blocks=[];cur=['entry',[]]
for l in lines[h+1:e]:
    m=re.match(r'^([0-9]+):',l)
    if m: blocks.append(cur); cur=[m.group(1),[l]]
    else: cur[1].append(l)
blocks.append(cur)
for op in ops:
    if op.startswith('inv:') or op.startswith('prof:'):
        k,b=op.split(':')[:2]; bl=next(z for z in blocks if z[0]==b)
        for i,l in enumerate(bl[1]):
            m=re.match(r'^(\s*)br i1 (%\w+), label (%\w+), label (%\w+)(.*)$',l)
            if m:
                ind,c,t,f,rest=m.groups()
                if k=='inv': bl[1][i:i+1]=[ind+'%%inv%s = xor i1 %s, true'%(b,c), ind+'br i1 %%inv%s, label %s, label %s%s'%(b,f,t,rest)]
                else:
                    w=op.split(':')[2].split(','); bl[1][i]=ind+'br i1 %s, label %s, label %s, !prof !{!"branch_weights", i32 %s, i32 %s}'%(c,t,f,w[0],w[1])
                break
        continue
    x,y=op.split('>')
    bx=next(b for b in blocks if b[0]==x); blocks.remove(bx)
    iy=next(i for i,b in enumerate(blocks) if b[0]==y); blocks.insert(iy+1,bx)
ren=lambda t: re.sub(r'^([0-9]+):', r'v\1:', re.sub(r'%([0-9]+)\b', r'%v\1', t))
out=lines[:s]+[ren(x) for x in lines[s:h+1]]
for n,bl in blocks: out+=[ren(x) for x in bl]
out+=lines[e:]
p=name+'.ll'; open(p,'w').write('\n'.join(out))
o=name+'.o'
r=subprocess.run([B+'/llc','-O3','-mtriple=sbf','-mattr=+store-imm,+jmp-ext','-relocation-model=pic','-function-sections','-data-sections','-filetype=obj',p,'-o',o],capture_output=True,text=True)
if r.returncode: print(r.stderr[-2000:]); sys.exit(1)
if not os.environ.get('KEEP'): os.remove(p)
subprocess.run(['python3',os.path.join(HERE,os.environ.get('CMP','qcmp.py')),o]+([os.environ['BH']] if os.environ.get('BH') else []))
