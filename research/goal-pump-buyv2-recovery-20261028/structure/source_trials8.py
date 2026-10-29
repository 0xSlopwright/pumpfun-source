from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parents[1];H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();completion='let a=&mut *ctx.accounts;if a.bonding_curve.real_token_reserves==0{a.bonding_curve.complete=true;let event=crate::trade_types::CompleteEvent{mint:a.base_mint.key(),user:a.user.key(),bonding_curve:a.bonding_curve.key(),quote_mint:a.bonding_curve.quote_mint,timestamp};emit!(event);emit_cpi!(event);}'
assert completion in base
expanded='''{let authority_info=ctx.accounts.event_authority.to_account_info();let authority_bump=ctx.bumps.event_authority;let disc=anchor_lang::event::EVENT_IX_TAG_LE;let inner_data=anchor_lang::Event::data(&event);let ix_data:Vec<u8>=disc.into_iter().map(|b|*b).chain(inner_data.into_iter()).collect();let ix=anchor_lang::solana_program::instruction::Instruction::new_with_bytes(crate::ID,&ix_data,vec![anchor_lang::solana_program::instruction::AccountMeta::new_readonly(*authority_info.key,true)]);anchor_lang::solana_program::program::invoke_signed(&ix,&[authority_info],&[&[b"__event_authority",&[authority_bump]]]).map_err(anchor_lang::error::Error::from)?;}'''
def repl(body):return base.replace(completion,completion.replace('emit_cpi!(event);',body))
control=repl(expanded)
seedhelper=expanded.replace('&[&[b"__event_authority",&[authority_bump]]]', '&[&complete_event_seeds(&[authority_bump])]')
seedbound=expanded.replace('anchor_lang::solana_program::program::invoke_signed(&ix,', 'let bump=[authority_bump];let seeds:[&[u8];2]=[b"__event_authority",&bump];anchor_lang::solana_program::program::invoke_signed(&ix,').replace('&[&[b"__event_authority",&[authority_bump]]]', '&[&seeds]')
thin=(R/'trials/complete_seed_invoker_boundary/buy_v2.rs').read_text()
variants={'complete_seed_invoker_llvm_inline':thin.replace('#[inline(always)]fn invoke_complete_cpi','#[inline]fn invoke_complete_cpi'),'complete_seed_invoker_default_inline':thin.replace('#[inline(always)]fn invoke_complete_cpi','fn invoke_complete_cpi')}

bs=score.score(R/'separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  assert text.count('\n')in [base.count('\n'),base.count('\n')+2],n
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13b9b8);f=next(f for f in c.funcs if '6buy_v211buy_handler17h' in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio(),full_equal_baseline=(out/'unstripped.so').read_bytes()==(R/'separate-crate/unstripped.so').read_bytes())
  rows.append(v);(R/'results-structure8.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
