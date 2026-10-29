"""A meaningful quote-admission record, preserving source rows and all fields."""
from pathlib import Path
import sys,json,difflib,hashlib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness')
sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'source/src/create_v2.rs';base=P.read_text()
s=base
old='pub enum QuoteSource { Sol, Whitelisted, Controlled, Nested }'
assert s.count(old)==1;s=s.replace(old,old+' struct QuoteAdmission {quote_mint:Pubkey,reserves:Option<(u64,u8)>,source:QuoteSource}')
old='Result<(Pubkey,Option<(u64,u8)>,QuoteSource)>'
assert s.count(old)==1;s=s.replace(old,'Result<QuoteAdmission>')
old='Ok((Pubkey::default(),None,QuoteSource::Sol))'
assert s.count(old)==2;s=s.replace(old,'Ok(QuoteAdmission{quote_mint:Pubkey::default(),reserves:None,source:QuoteSource::Sol})')
old='Ok((mint_key,reserves,source))'
assert s.count(old)==1;s=s.replace(old,'Ok(QuoteAdmission{quote_mint:mint_key,reserves,source})')
start=s.index('pub fn execute<');prefix,h=s[:start],s[start:]
old='let (quote_mint,reserves,source)=validate_quote_mint(&ctx,ctx.remaining_accounts)?;'
assert h.count(old)==1;h=h.replace(old,'let admission=validate_quote_mint(&ctx,ctx.remaining_accounts)?;')
for old,new in [
 ('global_quote(quote_mint,','global_quote(admission.quote_mint,'),
 ('matches!(source,','matches!(admission.source,'),
 ('=reserves {depth}','=admission.reserves {depth}'),
 ('(quote_mint,reserves)','(admission.quote_mint,admission.reserves)'),
 ('bonding_curve.quote_mint=quote_mint;','bonding_curve.quote_mint=admission.quote_mint;'),
]:
 assert h.count(old)==1,old;h=h.replace(old,new)
s=prefix+h;assert s.count('\n')==base.count('\n')
out=R/'record-admission';assert not out.exists();out.mkdir()
bs=score.score(R/'baseline/unstripped.so')
try:
 P.write_text(s);(out/'source.patch').write_text(''.join(difflib.unified_diff(base.splitlines(True),s.splitlines(True),fromfile='parent/src/create_v2.rs',tofile='candidate/src/create_v2.rs')))
 result=fastbuild.build(R/'source',R.parents[2]/'work/goal-pump-swap-final-20261028-build',out,quiet=True)
 result.update(runtime_executed=False,source_sha256=hashlib.sha256(s.encode()).hexdigest(),source_rows_preserved=True)
 if result['ok']:
  sc=score.score(out/'unstripped.so');(out/'inventory.json').write_text(json.dumps(sc,indent=2)+'\n')
  result['census']={'normalized':sum(v['normalized']for v in sc.values()),'raw':sum(v['raw']for v in sc.values()),'gains':[hex(k)for k,v in sc.items()if v['normalized']and not bs[k]['normalized']],'losses':[hex(k)for k,v in sc.items()if not v['normalized']and bs[k]['normalized']]}
  c=win.Cand(out/'unstripped.so');f=next(f for f in c.funcs if win.demangle(f[2])=='pump_recovered::create_v2::execute');w=next(w for w in score.original_windows()if w['start']==0x1e7c0)
  a=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];b=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)]
  result['target']={'original_bytes':w['bytes'],'bytes':f[1],'equal':a==b,'similarity':difflib.SequenceMatcher(None,a,b,autojunk=False).ratio()}
 (out/'result.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
finally:P.write_text(base)
