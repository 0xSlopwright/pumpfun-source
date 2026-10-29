from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/sell_v2.rs';base=P.read_text();best=(R/'trials/is_sol_before_clock/sell_v2.rs').read_text();needle='emit_cpi!(ev);';assert best.count(needle)==1
expanded='{let authority_info=ctx.accounts.event_authority.to_account_info();let authority_bump=ctx.bumps.event_authority;let disc=anchor_lang::event::EVENT_IX_TAG_LE;let inner_data=anchor_lang::Event::data(&ev);let ix_data:Vec<u8>=disc.into_iter().map(|b|*b).chain(inner_data.into_iter()).collect();let ix=anchor_lang::solana_program::instruction::Instruction::new_with_bytes(crate::ID,&ix_data,vec![anchor_lang::solana_program::instruction::AccountMeta::new_readonly(*authority_info.key,true)]);anchor_lang::solana_program::program::invoke_signed(&ix,&[authority_info],&[&[b"__event_authority",&[authority_bump]]]).map_err(anchor_lang::error::Error::from)?;}'
prefix='let authority_info=ctx.accounts.event_authority.to_account_info();let authority_bump=ctx.bumps.event_authority;'
seeds='let authority_bump=ctx.bumps.event_authority;let bump=[authority_bump];let seeds:[&[u8];2]=[b"__event_authority",&bump];let authority_info=ctx.accounts.event_authority.to_account_info();'
assert prefix in expanded
prep=expanded.replace(prefix,seeds,1).replace('&[&[b"__event_authority",&[authority_bump]]]','&[&seeds]',1)
variants={'event_expansion_control':best.replace(needle,expanded,1),'event_seeds_before_authority':best.replace(needle,prep,1)}

bs=score.score(R.parent/'goal-pump-v2-callers-recovery-20261028/best-exact-quote/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  assert text.count('\n')==base.count('\n'),n
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'sell_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x144508);f=next(f for f in c.funcs if '7sell_v27execute17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results6.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
