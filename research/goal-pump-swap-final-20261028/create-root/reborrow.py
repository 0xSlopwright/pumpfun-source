"""Scope actual account borrows at the observed Context/global register divergence."""
from pathlib import Path
import sys,json,difflib,hashlib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'source/src/create_v2.rs';base=P.read_text();bs=score.score(R/'baseline/unstripped.so');rows=[]
def transform(kind):
 if kind=='handler':
  start=base.index('pub fn execute<');a,b=base[:start],base[start:];assert b.count('let a=&ctx.accounts;')==2
  b=b.replace('let a=&ctx.accounts;','let a=&*ctx.accounts;')
  return a+b
 start=base.index('fn validate_quote_mint<');end=base.index('pub(crate) mod nested_create',start)
 a,b,c=base[:start],base[start:end],base[end:];assert b.count('let a=&ctx.accounts;')==1
 return a+b.replace('let a=&ctx.accounts;','let a=&*ctx.accounts;')+c
try:
 for kind in ['handler','quote-validation']:
  s=transform(kind);assert s.count('\n')==base.count('\n');out=R/('reborrow-'+kind);assert not out.exists();out.mkdir();P.write_text(s)
  (out/'source.patch').write_text(''.join(difflib.unified_diff(base.splitlines(True),s.splitlines(True),fromfile='parent/src/create_v2.rs',tofile='candidate/src/create_v2.rs')))
  b=fastbuild.build(R/'source',R.parents[2]/'work/goal-pump-swap-final-20261028-build',out,quiet=True);result={'kind':kind,**b,'runtime_executed':False,'source_sha256':hashlib.sha256(s.encode()).hexdigest()}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'inventory.json').write_text(json.dumps(sc,indent=2)+'\n');result['census']={'normalized':sum(v['normalized']for v in sc.values()),'raw':sum(v['raw']for v in sc.values()),'gains':[hex(k)for k,v in sc.items()if v['normalized']and not bs[k]['normalized']],'losses':[hex(k)for k,v in sc.items()if not v['normalized']and bs[k]['normalized']]}
   c=win.Cand(out/'unstripped.so');f=next(f for f in c.funcs if win.demangle(f[2])=='pump_recovered::create_v2::execute');w=next(w for w in score.original_windows()if w['start']==0x1e7c0);a=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];z=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];result['target']={'original_bytes':w['bytes'],'bytes':f[1],'equal':a==z,'similarity':difflib.SequenceMatcher(None,a,z,autojunk=False).ratio()}
  rows.append(result);(out/'result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)
finally:P.write_text(base)
