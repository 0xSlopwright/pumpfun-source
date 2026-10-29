from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();best=(R/'trials/typed_payments_and_curve/buy_v2.rs').read_text();idx=best.index("fn buy_exact_quote_in_handler<'info>");prefix=best[:idx];q=best[idx:]
old='crate::trade_types::CompleteEvent{user:a.user.key(),mint:a.base_mint.key(),bonding_curve:a.bonding_curve.key(),timestamp,quote_mint:a.bonding_curve.quote_mint}'
new='crate::trade_types::CompleteEvent{mint:a.base_mint.key(),user:a.user.key(),bonding_curve:a.bonding_curve.key(),quote_mint:a.bonding_curve.quote_mint,timestamp}'
assert old in q
literal=prefix+q.replace(old,new,1)
needle='emit!(event);emit_cpi!(event);'
assert q.count(needle)==1
helper="\n#[inline(always)]fn emit_exact_complete<'info>(ctx:&Context<'_,'_,'_,'info,BuyV2<'info>>,event:&crate::trade_types::CompleteEvent)->Result<()>{emit!(*event);emit_cpi!(*event);Ok(())}\n"
nullold='}else{require!(a.quote_mint.key()==WSOL,PumpError::UnsupportedQuoteMint);None};'
assert nullold in q
none=q.replace('let native=a.bonding_curve.quote_mint==Pubkey::default();','const NO_EXACT_FEE:Option<crate::trade::native_transfer_fee::Fee>=None;let native=a.bonding_curve.quote_mint==Pubkey::default();',1).replace(nullold,nullold.replace('None','NO_EXACT_FEE'),1)
variants={'complete_literal_order':literal,'complete_borrowed_emitter':prefix+q.replace(needle,'emit_exact_complete(&ctx,&event)?;',1)+helper,'const_native_none':prefix+none}

bs=score.score(R.parent/'goal-pump-buyv2-recovery-20261028/separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13f630);f=next(f for f in c.funcs if 'buy_exact_quote_in_handler17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results4.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
