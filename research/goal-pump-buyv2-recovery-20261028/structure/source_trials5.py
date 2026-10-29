from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();snapshot='let c=&a.bonding_curve;let creator=c.creator;let quote_mint=c.quote_mint;let vb=c.virtual_token_reserves;let vq=c.virtual_quote_reserves;let rb=c.real_token_reserves;let rq=c.real_quote_reserves;';tail='let a=&mut *ctx.accounts;crate::trade_types::prepare_bonding_curve(&a.bonding_curve,&a.system_program,&a.user)?;\nOk(())';add='require_gte!(limit,gross.checked_add(pf)\n// layout-pad\n// layout-pad\n// layout-pad\n  .ok_or_else(||error!(PumpError::Overflow))?\n  .checked_add(cf)\n  .ok_or_else(||error!(PumpError::Overflow))?,PumpError::TooMuchSolRequired);'
assert snapshot in base and tail in base and add in base
completion='let a=&mut *ctx.accounts;if a.bonding_curve.real_token_reserves==0{a.bonding_curve.complete=true;let event=crate::trade_types::CompleteEvent{mint:a.base_mint.key(),user:a.user.key(),bonding_curve:a.bonding_curve.key(),quote_mint:a.bonding_curve.quote_mint,timestamp};emit!(event);emit_cpi!(event);}'
assert completion in base
header="fn emit_buy_complete<'info>(ctx:&Context<'_,'_,'_,'info,BuyV2<'info>>,event:"
def helper_source(kind,attr):
 typ='&crate::trade_types::CompleteEvent'if kind=='borrowed'else'crate::trade_types::CompleteEvent'
 body='emit!(*event);emit_cpi!(*event);Ok(())' if kind=='borrowed' else 'emit!(event);emit_cpi!(event);Ok(())'
 suffix='\n'+attr+header+typ+")->Result<()>{"+body+"}\n"
 return base.replace(completion,completion.replace('emit!(event);emit_cpi!(event);','emit_buy_complete(&ctx,'+('&event'if kind=='borrowed'else'event')+')?;'))+suffix
expanded='{let authority_info=ctx.accounts.event_authority.to_account_info();let authority_bump=ctx.bumps.event_authority;let disc=anchor_lang::event::EVENT_IX_TAG_LE;let inner_data=anchor_lang::Event::data(&*event);let ix_data:Vec<u8>=disc.into_iter().map(|b|*b).chain(inner_data.into_iter()).collect();let ix=anchor_lang::solana_program::instruction::Instruction::new_with_bytes(crate::ID,&ix_data,vec![anchor_lang::solana_program::instruction::AccountMeta::new_readonly(*authority_info.key,true)]);anchor_lang::solana_program::program::invoke_signed(&ix,&[authority_info],&[&[b"__event_authority",&[authority_bump]]]).map_err(anchor_lang::error::Error::from)}'
borrowed_header=header+'&crate::trade_types::CompleteEvent)->Result<()>'
callsite=base.replace(completion,completion.replace('emit!(event);emit_cpi!(event);','emit_buy_complete(&ctx,&event)?;'))
tail_source=callsite+'\n#[inline(always)]'+borrowed_header+'{emit!(*event);'+expanded+'}\n'
terminal_callsite=base.replace(completion,completion.replace('emit!(event);emit_cpi!(event);','return emit_buy_complete(&ctx,&event);'))
terminal_source=terminal_callsite+'\n#[inline(always)]'+borrowed_header+'{emit!(*event);emit_cpi!(*event);let a=&ctx.accounts;crate::trade_types::prepare_bonding_curve(&a.bonding_curve,&a.system_program,&a.user)}\n'
ending=completion+'\n '+tail
assert ending in base
finish_tail=base.replace(ending,'finish_buy(ctx.accounts,&ctx.bumps,timestamp)\n \n')
finish_body=completion.replace('let a=&mut *ctx.accounts;','')+tail.replace('let a=&mut *ctx.accounts;','')
finish_expanded=expanded.replace('&*event','&event').replace('ctx.accounts.event_authority','a.event_authority').replace('ctx.bumps.event_authority','bumps.event_authority').replace('.map_err(anchor_lang::error::Error::from)}','.map_err(anchor_lang::error::Error::from)?;}')
finish_body=finish_body.replace('emit_cpi!(event);',finish_expanded)
finish_source=finish_tail+"\n#[inline(always)]fn finish_buy<'info>(a:&mut BuyV2<'info>,bumps:&BuyV2Bumps,timestamp:i64)->Result<()>{"+finish_body+"}\n"
mutable_tail=base.replace(ending,'finish_buy(&mut ctx,timestamp)\n \n').replace("fn buy_handler<'info>(ctx:","fn buy_handler<'info>(mut ctx:",1)
mutable_source=mutable_tail+"\n#[inline(always)]fn finish_buy<'info>(ctx:&mut Context<'_,'_,'_,'info,BuyV2<'info>>,timestamp:i64)->Result<()>{"+completion+tail+"}\n"
variants={'complete_and_prepare_accounts_boundary':finish_source,'complete_and_prepare_context_boundary':mutable_source}

bs=score.score(R/'separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  assert text.count('\n')==base.count('\n')+3,n
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13b9b8);f=next(f for f in c.funcs if '6buy_v211buy_handler17h' in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results-structure5.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
