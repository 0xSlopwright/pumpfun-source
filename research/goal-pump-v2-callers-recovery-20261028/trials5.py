from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();best=(R/'trials/complete_literal_order/buy_v2.rs').read_text();idx=best.index("fn buy_exact_quote_in_handler<'info>");prefix=best[:idx];q=best[idx:]
old='buyback_fee_basis_points:if c.is_mayhem_mode{0}else{a.global.buyback_basis_points},buyback_fee:crate::transfer_fee_recovered::post_fee_amount(&transfer_fee,bf)?,'
new='buyback_fee:crate::transfer_fee_recovered::post_fee_amount(&transfer_fee,bf)?,buyback_fee_basis_points:if c.is_mayhem_mode{0}else{a.global.buyback_basis_points},'
assert old in q
init='let transfer_fee=if !native{';endold='}crate::transfer_fee_recovered::get_transfer_fee(&a.quote_mint.to_account_info())?\n }else{require!(a.quote_mint.key()==WSOL,PumpError::UnsupportedQuoteMint);None};'
endnew='}transfer_fee=crate::transfer_fee_recovered::get_transfer_fee(&a.quote_mint.to_account_info())?;\n }else{require!(a.quote_mint.key()==WSOL,PumpError::UnsupportedQuoteMint);transfer_fee=None;}'
assert init in q and endold in q
assign=q.replace(init,'let transfer_fee;if !native{',1).replace(endold,endnew,1)
variants={'event_buyback_amount_first':prefix+q.replace(old,new,1),'fee_option_branch_assignment':prefix+assign}

bs=score.score(R.parent/'goal-pump-buyv2-recovery-20261028/separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13f630);f=next(f for f in c.funcs if 'buy_exact_quote_in_handler17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results5.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
