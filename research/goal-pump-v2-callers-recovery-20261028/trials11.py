from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();best=(R/'trials/tuple_quote_first/buy_v2.rs').read_text();idx=best.index("fn buy_exact_quote_in_handler<'info>");prefix=best[:idx];q=best[idx:]
fields='holder_rewards_bps:if c.is_holder_reward{creator_fee_bps}else{0},holder_rewards:if c.is_holder_reward{cf}else{0},creator_fee_basis_points:if c.is_cashback_coin{0}else{creator_fee_bps},creator_fee:if c.is_cashback_coin{0}else{cf},'
reorder='creator_fee_basis_points:if c.is_cashback_coin{0}else{creator_fee_bps},creator_fee:if c.is_cashback_coin{0}else{cf},holder_rewards_bps:if c.is_holder_reward{creator_fee_bps}else{0},holder_rewards:if c.is_holder_reward{cf}else{0},'
assert fields in q;q=q.replace(fields,reorder,1)
combined=prefix+q
head='let (quote,pf,cf,computed,protocol_fee_bps,creator_fee_bps)=if'
white='(available,0,0,computed,0,0)'
normal='(quote,pf,cf,computed,protocol_fee_bps,creator_fee_bps)};'
assert all(a in q for a in [head,white,normal])
named=q.replace(head,'let terms=if',1).replace(white,'ExactQuoteTerms{quote:available,protocol_fee:0,creator_fee:0,computed_tokens:computed,protocol_fee_bps:0,creator_fee_bps:0}',1).replace(normal,'ExactQuoteTerms{quote,protocol_fee:pf,creator_fee:cf,computed_tokens:computed,protocol_fee_bps,creator_fee_bps}};',1)
cut=named.index('let gross_total=');a,b=named[:cut],named[cut:]
b=b.replace('if computed>c.real_token_reserves && partial{','if terms.computed_tokens>c.real_token_reserves && partial{',1)
for old,new in [('let (mut gross,total)=gross_total(quote,pf,cf)?;let mut quote=quote;let mut amount=computed;','let (mut gross,total)=gross_total(terms.quote,terms.protocol_fee,terms.creator_fee)?;let mut quote=terms.quote;let mut amount=terms.computed_tokens;'),('gross=gross_total(quote,pf,cf)?.0;','gross=gross_total(quote,terms.protocol_fee,terms.creator_fee)?.0;'),('(amount,quote,pf,cf,gross)};','(amount,quote,terms.protocol_fee,terms.creator_fee,gross)};')]:
 assert old in b,old;b=b.replace(old,new,1)
import re
b=re.sub(r'\bprotocol_fee_bps\b','terms.protocol_fee_bps',b);b=re.sub(r'\bcreator_fee_bps\b','terms.creator_fee_bps',b)
record='\nstruct ExactQuoteTerms{quote:u64,protocol_fee:u64,creator_fee:u64,computed_tokens:u64,protocol_fee_bps:u64,creator_fee_bps:u64}\n'
variants={'tuple_and_event_order':combined,'named_quote_terms':prefix+a+b+record}

bs=score.score(R.parent/'goal-pump-buyv2-recovery-20261028/separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13f630);f=next(f for f in c.funcs if 'buy_exact_quote_in_handler17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results11.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
