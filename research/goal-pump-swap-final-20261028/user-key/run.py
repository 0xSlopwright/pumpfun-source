"""Genuine user key lifetime controls; no source padding or diagnostic IR edits."""
from pathlib import Path
import sys,json,difflib,hashlib
R=Path(__file__).resolve().parent
H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'source/src/buy_v2.rs';base=P.read_text()
start=base.index('fn buy_handler<');end=base.index('fn buy_exact_quote_in_handler<',start)
prefix,handler,suffix=base[:start],base[start:end],base[end:]
assert handler.count('a.user.key()')==5
comparison='let (pf,cf,protocol_fee_bps,creator_fee_bps)=if a.global.whitelist_pda==a.user.key()'
assert comparison in handler
def change(kind):
 h=handler
 if kind=='whitelist-only':
  h=h.replace(comparison,'let user_key=a.user.key();'+comparison.replace('a.user.key()','user_key'))
  h=h.replace('if a.user.key()==a.global.whitelist_pda','if user_key==a.global.whitelist_pda')
 else:
  h=h.replace('a.user.key()','user_key')
  if kind=='entry-all':
   marker='let (base_token_program,base_mint)=(&a.base_token_program,&a.base_mint);'
   assert marker in h;h=h.replace(marker,marker+'let user_key=a.user.key();')
  else:
   marker=comparison.replace('a.user.key()','user_key')
   assert marker in h;h=h.replace(marker,'let user_key=a.user.key();'+marker)
 assert h.count('\n')==handler.count('\n')
 return prefix+h+suffix
bs=score.score(R/'baseline/unstripped.so');rows=[]
try:
 for name in ['whitelist-only','whitelist-all','entry-all']:
  out=R/name;assert not out.exists();out.mkdir()
  text=change(name);P.write_text(text)
  (out/'source.patch').write_text(''.join(difflib.unified_diff(base.splitlines(True),text.splitlines(True),fromfile='parent/src/buy_v2.rs',tofile='candidate/src/buy_v2.rs')))
  b=fastbuild.build(R/'source',R.parents[2]/'work/goal-pump-swap-final-20261028-build',out,quiet=True)
  row={'name':name,**b,'runtime_executed':False,'source_sha256':hashlib.sha256(text.encode()).hexdigest()}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps(sc,indent=2)+'\n')
   row['census']={'normalized':sum(x['normalized']for x in sc.values()),'raw':sum(x['raw']for x in sc.values()),'gains':[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],'losses':[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]}
   c=win.Cand(out/'unstripped.so');w=next(w for w in score.original_windows()if w['start']==0x13b9b8)
   f=next(f for f in c.funcs if '6buy_v211buy_handler17h' in f[2])
   oi=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)]
   ci=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)]
   row['target']={'bytes':f[1],'original_bytes':w['bytes'],'equal':oi==ci,'diagnostic_similarity':difflib.SequenceMatcher(None,oi,ci,autojunk=False).ratio()}
  rows.append(row);(R/'results.json').write_text(json.dumps(rows,indent=2)+'\n');print(json.dumps(row),flush=True)
finally:
 P.write_text(base)
 assert P.read_text()==base
