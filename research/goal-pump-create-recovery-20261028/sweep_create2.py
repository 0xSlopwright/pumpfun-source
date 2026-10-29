from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/create_v2.rs';base=P.read_text();old=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/lanes/fb3-P-build2-w5/BEST-1e7c0-x27/src/create_v2.rs').read_text();s=old.replace('pub fn initialize_mayhem', '#[inline(never)]pub fn initialize_mayhem',1).replace("pub(super) fn control_account(account: &AccountInfo<'_>, mint: Pubkey)","pub(super) fn control_account(account: &AccountInfo<'_>, mint: &Pubkey)").replace('control_entry(&data, &mint)','control_entry(&data, mint)').replace('nested_create::control_account(control,mint_key)?','nested_create::control_account(control,&mint_key)?')
fragment='let virtual_quote_reserves={let (m,r)=(quote_mint,reserves);if m==Pubkey::default() {global.initial_virtual_sol_reserves} else {r.map_or(global.initial_virtual_quote_reserves,|(r,_)|r)}};'
assert fragment in s
none_decl="const NO_QUOTE_RESERVES:Option<(u64,u8)>=None;\n"
base_const=s.replace('pub enum QuoteSource { Sol, Whitelisted, Controlled, Nested }', 'pub enum QuoteSource { Sol, Whitelisted, Controlled, Nested } const NO_QUOTE_RESERVES:Option<(u64,u8)>=None;')
variants={
'x27_const_none_sol':base_const.replace('Pubkey::default(),None,QuoteSource::Sol','Pubkey::default(),NO_QUOTE_RESERVES,QuoteSource::Sol'),
'x27_const_none_white':base_const.replace('(QuoteSource::Whitelisted,None)', '(QuoteSource::Whitelisted,NO_QUOTE_RESERVES)'),
'x27_const_none_both':base_const.replace('Pubkey::default(),None,QuoteSource::Sol','Pubkey::default(),NO_QUOTE_RESERVES,QuoteSource::Sol').replace('(QuoteSource::Whitelisted,None)', '(QuoteSource::Whitelisted,NO_QUOTE_RESERVES)'),
'x27_const_native':s.replace('pub enum QuoteSource { Sol, Whitelisted, Controlled, Nested }', 'pub enum QuoteSource { Sol, Whitelisted, Controlled, Nested } const NATIVE_QUOTE:(Pubkey,Option<(u64,u8)>,QuoteSource)=(Pubkey::new_from_array([0;32]),None,QuoteSource::Sol);').replace('Ok((Pubkey::default(),None,QuoteSource::Sol))','Ok(NATIVE_QUOTE)'),
}

Q=R/'src/src/pump_quote.rs';qbase=Q.read_text();Q.write_text(qbase.replace('fn global_quote(', 'pub(crate) fn global_quote(',1))
bs=score.score(R/'baseline/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'create_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x1e7c0);f=next(f for f in c.funcs if '9create_v27execute' in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results-create2.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:
 P.write_text(base);Q.write_text(qbase)
