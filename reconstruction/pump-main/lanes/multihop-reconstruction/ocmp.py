# ocmp.py obj [so]  : compare swap_hop section of obj with orig (and with so if given). masks call/lddw imm.
import sys,re,difflib,subprocess
H='/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/restore/reconstruction/harness'
sys.path.insert(0,H); argv=sys.argv[1:]; sys.argv=sys.argv[:1]
import score
from pathlib import Path
B='/Users/shawwalters/Documents/Codex/2026-10-24/amm-sell-swarm/infra/sdk-native/rust/lib/rustlib/aarch64-apple-darwin/bin'
def objbytes(o):
    secs=subprocess.run([B+'/llvm-objdump','-h',o],capture_output=True,text=True).stdout
    name=next(l.split()[1] for l in secs.splitlines() if '.text.' in l and '8swap_hop17h' in l and '.rel' not in l)
    subprocess.run([B+'/llvm-objcopy','-O','binary','--only-section='+name,o,o+'.bin'],check=True)
    return open(o+'.bin','rb').read()
def toks(raw):
    i=0;out=[]
    while i<len(raw):
        k=16 if raw[i]==0x18 else 8; t=raw[i:i+k]
        if t[0]==0x18: t=t[:2]
        elif t[0]==0x85: t=t[:2]
        out.append(t); i+=k
    return out
W={x['start']:x for x in score.original_windows()}
o=toks(W[0x5b3b0]['raw']); c=toks(objbytes(argv[0]))
def r(f,a,b): return difflib.SequenceMatcher(None,[f(x) for x in a],[f(x) for x in b],autojunk=False).ratio()
sm=difflib.SequenceMatcher(None,o,c,autojunk=False)
dist=sum(max(i2-i1,j2-j1) for op,i1,i2,j1,j2 in sm.get_opcodes() if op!='equal')
print(f"bytes {sum(16 if x[0]==0x18 else 8 for x in c)} raw {sm.ratio():.4f} dist {dist} opregs {r(lambda x:x[:2],o,c):.4f} op {r(lambda x:x[:1],o,c):.4f}")
if len(argv)>1:
    p=Path(argv[1]); blob=p.read_bytes(); cs=score.sections(blob)
    s,n,nm=next(f for f in score.candidate_functions(p) if '8swap_hop17h' in f[2])
    cc=toks(score.body(blob,cs,s,n)); print('matches build (masked):', cc==c)
