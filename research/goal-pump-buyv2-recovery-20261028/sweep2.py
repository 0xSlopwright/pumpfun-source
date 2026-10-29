from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();snapshot='let c=&a.bonding_curve;let creator=c.creator;let quote_mint=c.quote_mint;let vb=c.virtual_token_reserves;let vq=c.virtual_quote_reserves;let rb=c.real_token_reserves;let rq=c.real_quote_reserves;';tail='let a=&mut *ctx.accounts;crate::trade_types::prepare_bonding_curve(&a.bonding_curve,&a.system_program,&a.user)?;\nOk(())';add='require_gte!(limit,gross.checked_add(pf)\n// layout-pad\n// layout-pad\n// layout-pad\n  .ok_or_else(||error!(PumpError::Overflow))?\n  .checked_add(cf)\n  .ok_or_else(||error!(PumpError::Overflow))?,PumpError::TooMuchSolRequired);'
assert snapshot in base and tail in base and add in base
pair='creator_fee_basis_points:if c.is_cashback_coin{0}else{creator_fee_bps},creator_fee:if c.is_cashback_coin{0}else{cf},holder_rewards_bps:if c.is_holder_reward{creator_fee_bps}else{0},holder_rewards:if c.is_holder_reward{cf}else{0}'
rev='holder_rewards_bps:if c.is_holder_reward{creator_fee_bps}else{0},holder_rewards:if c.is_holder_reward{cf}else{0},creator_fee_basis_points:if c.is_cashback_coin{0}else{creator_fee_bps},creator_fee:if c.is_cashback_coin{0}else{cf}'
assert pair in base
variants={
 'snapshot_clone_creator':base.replace('let creator=c.creator;','let creator=c.creator.clone();',1),
 'snapshot_clone_both':base.replace('let creator=c.creator;let quote_mint=c.quote_mint;','let creator=c.creator.clone();let quote_mint=c.quote_mint.clone();',1),
 'snapshot_late_assign':base.replace(snapshot,'let c=&a.bonding_curve;let creator;let quote_mint;let vb=c.virtual_token_reserves;let vq=c.virtual_quote_reserves;let rb=c.real_token_reserves;let rq=c.real_quote_reserves;creator=c.creator;quote_mint=c.quote_mint;'),
 'snapshot_decl_first':base.replace(snapshot,'let creator;let quote_mint;let c=&a.bonding_curve;creator=c.creator;quote_mint=c.quote_mint;let vb=c.virtual_token_reserves;let vq=c.virtual_quote_reserves;let rb=c.real_token_reserves;let rq=c.real_quote_reserves;'),
 'event_holderfirst':base.replace(pair,rev,1),
}

bs=score.score(R/'separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  assert text.count('\n')==base.count('\n'),n
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13b9b8);f=next(f for f in c.funcs if '6buy_v211buy_handler17h' in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results2.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
