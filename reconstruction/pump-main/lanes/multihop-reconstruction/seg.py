# seg.py cand.so|cand.o : segment distance between call anchors (op+regs, and op+regs+masked-off), lower better
import sys,os,re,json,difflib,subprocess
O=os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/multihop-reconstruction'); sys.path.insert(0,O+'/bin')
H='/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/restore/reconstruction/harness'
sys.path.insert(0,H); a=sys.argv[1:]; sys.argv=sys.argv[:1]
import score, relocs
from pathlib import Path
W={x['start']:x for x in score.original_windows()}
def toks(raw):
    i=0;r=[]
    while i<len(raw):
        k=16 if raw[i]==0x18 else 8; r.append((i,raw[i:i+k])); i+=k
    return r
oc=json.load(open(O+'/ir/orig_calls.json'))
ot=toks(W[0x5b3b0]['raw']); osites=set(json.load(open(O+'/ir/orig_sites.json'))); ocs=[i for i,(o,t) in enumerate(ot) if t[0]==0x85 and o in osites]; assert len(ocs)==len(oc)
p=a[0]
if p.endswith('.o'):
    subprocess.run(['python3',O+'/bin/qcmp.py',p],capture_output=True)
    raw=open(p+'.bin','rb').read(); cn=[relocs.last_ident(x) for x in relocs.calls(p)]
    ct=toks(raw); ccs=[i for i,(o,t) in enumerate(ct) if t[0]==0x85]
    # relocs.calls includes syscalls? map by order: assume same count
    assert len(cn)==len(ccs),(len(cn),len(ccs))
    keep=[k for k,n in enumerate(cn) if n!='abort']; cn=[cn[k] for k in keep]; ccs=[ccs[k] for k in keep]
else:
    pp=Path(p); blob=pp.read_bytes(); cs=score.sections(blob)
    st,n,_=next(f for f in score.candidate_functions(pp) if '8swap_hop17h' in f[2])
    ct=toks(score.body(blob,cs,st,n)); ccs=[i for i,(o,t) in enumerate(ct) if t[0]==0x85]
    j=json.load(open(os.path.dirname(p)+'/census.json'))['targets']; j=j['0x5b3b0'] if isinstance(j,dict) else j[0]
    cn=[relocs.cname(x['callee']) for x in j['our_sequence']]
    if len(cn)!=len(ccs):
        # drop extra call insns (e.g. abort/syscalls) not in census: align by site offsets
        sites=[int(x['site'],16) for x in j['our_sequence']]
        ccs=[i for i in ccs if ct[i][0] in sites]
oseq=oc
sm=difflib.SequenceMatcher(None,oseq,cn,autojunk=False)
anch=[(-1,-1)]
for b in sm.get_matching_blocks():
    for k in range(b.size): anch.append((ocs[b.a+k],ccs[b.b+k]))
anch.append((len(ot),len(ct)))
def d(x,y,f):
    s=difflib.SequenceMatcher(None,[f(t) for t in x],[f(t) for t in y],autojunk=False)
    return sum(max(i2-i1,j2-j1) for op,i1,i2,j1,j2 in s.get_opcodes() if op!='equal')
def mask(t):
    if t[0] in (0x18,0x85): return t[:2]
    if t[0]==0x05 or (t[0]&7) in (5,6): return t[:2]   # jumps: mask offsets
    return t
D1=D2=0; rows=[]
for (a0,b0),(a1,b1) in zip(anch,anch[1:]):
    x=[t for _,t in ot[a0+1:a1]]; y=[t for _,t in ct[b0+1:b1]]
    d1=d(x,y,lambda t:t[:2]); d2=d(x,y,mask); D1+=d1; D2+=d2
    rows.append((ot[a0+1][0] if a0+1<len(ot) else 0,len(x),len(y),d1,d2))
print(f'calls {len(anch)-2}/{len(cn)} segdist_opregs {D1} segdist_exact {D2}')
if '-v' in a:
    for r in rows:
        if r[3]>10: print('  orig@%#x  %d vs %d  opregs %d exact %d'%r)
