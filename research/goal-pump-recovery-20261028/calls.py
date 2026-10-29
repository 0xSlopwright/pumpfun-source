import sys,struct
from pathlib import Path
sys.path.insert(0,'/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');import score,win
p=Path(sys.argv[1]);st=int(sys.argv[2],0);rx=sys.argv[3]
ss=score.score(p);c=win.Cand(p);ow=next(w for w in score.original_windows() if w['start']==st)
orig_symbols={s:win.demangle(v['symbols'][0]) if v['symbols'] else hex(s) for s,v in ss.items()}
cur_entries={a:(n,win.demangle(nm)) for a,n,nm in c.funcs}
for label,b,addr in [('original',ow['raw'],st)]+[('candidate',c.fn(a,n),a) for a,n,nm in c.funcs if win.re.search(rx,win.demangle(nm))]:
 print(label);i=0
 while i<len(b):
  op,regs,off,imm=struct.unpack_from('<BBhi',b,i)
  if op==0x85:
   target=addr+i+8+imm*8
   print(hex(addr+i), orig_symbols.get(target,hex(target)) if label=='original' else cur_entries.get(target,(0,hex(target)))[1])
  i+=16 if op==0x18 else 8
