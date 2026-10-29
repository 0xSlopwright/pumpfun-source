from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/create_v2.rs';base=P.read_text();old=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/lanes/fb3-P-build2-w5/BEST-1e7c0-x27/src/create_v2.rs').read_text();s=old.replace('pub fn initialize_mayhem', '#[inline(never)]pub fn initialize_mayhem',1).replace("pub(super) fn control_account(account: &AccountInfo<'_>, mint: Pubkey)","pub(super) fn control_account(account: &AccountInfo<'_>, mint: &Pubkey)").replace('control_entry(&data, &mint)','control_entry(&data, mint)').replace('nested_create::control_account(control,mint_key)?','nested_create::control_account(control,&mint_key)?')
fragment='let virtual_quote_reserves={let (m,r)=(quote_mint,reserves);if m==Pubkey::default() {global.initial_virtual_sol_reserves} else {r.map_or(global.initial_virtual_quote_reserves,|(r,_)|r)}};'
assert fragment in s
variants={'x27_current_roles':s,'x27_option16':s.replace(fragment,'let virtual_quote_reserves={let (m,r)=(quote_mint,reserves.map(|(r,_)|r));if m==Pubkey::default() {global.initial_virtual_sol_reserves} else {r.unwrap_or(global.initial_virtual_quote_reserves)}};'),'x27_option16_ref':s.replace(fragment,'let virtual_quote_reserves={let (m,r)=(quote_mint,reserves.map(|(r,_)|r));if m==Pubkey::default() {global.initial_virtual_sol_reserves} else {r.as_ref().copied().unwrap_or(global.initial_virtual_quote_reserves)}};'),'x27_option16_fn':s.replace(fragment,'let virtual_quote_reserves=quote_reserves_lifetime(quote_mint,reserves.map(|(r,_)|r),global);')+"\n#[inline(always)]fn quote_reserves_lifetime(m:Pubkey,r:Option<u64>,g:&Global)->u64{if m==Pubkey::default(){g.initial_virtual_sol_reserves}else{r.unwrap_or(g.initial_virtual_quote_reserves)}}\n"}
Q=R/'src/src/pump_quote.rs';qbase=Q.read_text();Q.write_text(qbase.replace('fn global_quote(', 'pub(crate) fn global_quote(',1))
bs=score.score(R/'baseline/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'create_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x1e7c0);f=next(f for f in c.funcs if '9create_v27execute' in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results-create.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:
 P.write_text(base);Q.write_text(qbase)
