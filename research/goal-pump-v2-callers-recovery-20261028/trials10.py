from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();best=(R/'trials/curve_payment_gross_quote/buy_v2.rs').read_text();idx=best.index("fn buy_exact_quote_in_handler<'info>");prefix=best[:idx];q=best[idx:]
head='let (protocol_fee_bps,creator_fee_bps,quote,pf,cf,computed)=if'
normal='(protocol_fee_bps,creator_fee_bps,quote,pf,cf,computed)};'
white='(0,0,available,0,0,computed)'
assert all(a in q for a in [head,normal,white])
quote=q.replace(head,'let (quote,pf,cf,computed,protocol_fee_bps,creator_fee_bps)=if',1).replace(normal,'(quote,pf,cf,computed,protocol_fee_bps,creator_fee_bps)};',1).replace(white,'(available,0,0,computed,0,0)',1)
fees=q.replace(head,'let (pf,cf,quote,computed,protocol_fee_bps,creator_fee_bps)=if',1).replace(normal,'(pf,cf,quote,computed,protocol_fee_bps,creator_fee_bps)};',1).replace(white,'(0,0,available,computed,0,0)',1)
fields='holder_rewards_bps:if c.is_holder_reward{creator_fee_bps}else{0},holder_rewards:if c.is_holder_reward{cf}else{0},creator_fee_basis_points:if c.is_cashback_coin{0}else{creator_fee_bps},creator_fee:if c.is_cashback_coin{0}else{cf},'
reorder='creator_fee_basis_points:if c.is_cashback_coin{0}else{creator_fee_bps},creator_fee:if c.is_cashback_coin{0}else{cf},holder_rewards_bps:if c.is_holder_reward{creator_fee_bps}else{0},holder_rewards:if c.is_holder_reward{cf}else{0},'
assert fields in q
snap='let c=&a.bonding_curve;let virtual_token_reserves=c.virtual_token_reserves;let virtual_quote_reserves=c.virtual_quote_reserves;let real_token_reserves=c.real_token_reserves;let real_quote_reserves=c.real_quote_reserves;let creator=c.creator;let quote_mint=c.quote_mint;'
snapnew='let c=&a.bonding_curve;let creator=c.creator;let quote_mint=c.quote_mint;let virtual_token_reserves=c.virtual_token_reserves;let virtual_quote_reserves=c.virtual_quote_reserves;let real_token_reserves=c.real_token_reserves;let real_quote_reserves=c.real_quote_reserves;'
assert snap in q
variants={'tuple_quote_first':prefix+quote,'tuple_fees_first':prefix+fees,'event_creator_before_holder':prefix+q.replace(fields,reorder,1),'snapshot_creator_quote_first':prefix+q.replace(snap,snapnew,1)}

bs=score.score(R.parent/'goal-pump-buyv2-recovery-20261028/separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13f630);f=next(f for f in c.funcs if 'buy_exact_quote_in_handler17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results10.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
