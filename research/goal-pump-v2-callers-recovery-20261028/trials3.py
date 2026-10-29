from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();idx=base.index("fn buy_exact_quote_in_handler<'info>");prefix=base[:idx];q=base[idx:];needle='emit!(ev);emit_cpi!(ev);let a=&mut *ctx.accounts;';assert needle in q
helper="\n#[inline(always)]fn emit_exact_quote_trade<'info>(ctx:&Context<'_,'_,'_,'info,BuyV2<'info>>,event:&TradeEvent)->Result<()>{emit!(*event);emit_cpi!(*event);Ok(())}\n"
typed_pay=q.replace('crate::user_quote_payments::transfer_from_user_owned(native,a.system_program.as_ref(),','pay_from_user_owned(native,&a.system_program,').replace('crate::user_quote_payments::transfer_from_user_recipient(native,a.system_program.as_ref(),','pay_from_user_recipient(native,&a.system_program,').replace(',&a.quote_token_program,a.quote_mint.decimals,a.quote_mint.as_ref().as_ref(),',',&a.quote_token_program,&a.quote_mint,')
main_old="""crate::trade::user_quote_payments::transfer_from_user(
   native,a.system_program.as_ref(),&a.user,a.bonding_curve.as_ref(),
   if native{quote}else{gross_quote},&a.quote_token_program,a.quote_mint.decimals,
   a.quote_mint.as_ref().as_ref(),"""
main_new="""pay_from_user(
   native,&a.system_program,&a.user,a.bonding_curve.as_ref(),
   if native{quote}else{gross_quote},&a.quote_token_program,&a.quote_mint,
   """
assert main_old in typed_pay;typed_pay=typed_pay.replace(main_old,main_new)
old='token_transfers::transfer_curve_tokens(&a.base_token_program,&a.associated_base_bonding_curve,&a.associated_base_user,&a.bonding_curve,a.base_mint.decimals,a.base_mint.as_ref().as_ref(),amount,'
new='move_curve_tokens(&a.base_token_program,&a.associated_base_bonding_curve,&a.associated_base_user,&a.bonding_curve,&a.base_mint,amount,'
assert old in q
variants={'typed_payments_and_curve':prefix+typed_pay.replace(old,new)}

bs=score.score(R.parent/'goal-pump-buyv2-recovery-20261028/separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13f630);f=next(f for f in c.funcs if 'buy_exact_quote_in_handler17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results3.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
