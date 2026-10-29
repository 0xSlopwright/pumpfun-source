# sodis.py so > rel listing; also writes so.swap.bin for offmap
import sys,re
H='/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/restore/reconstruction/harness'
sys.path.insert(0,H); a=sys.argv[1:]; sys.argv=sys.argv[:1]
import win, coords, score
from pathlib import Path
p=Path(a[0]); st,n,_=next(f for f in coords.candidate_functions(p) if '8swap_hop17h' in f[2])
blob=p.read_bytes(); cs=score.sections(blob); open(a[0]+'.bin','wb').write(score.body(blob,cs,st,n))
d=win.objdump_text(p,st,st+n)
for k,v in sorted(d.items()): print('%5x  %s'%(k-st,v))
