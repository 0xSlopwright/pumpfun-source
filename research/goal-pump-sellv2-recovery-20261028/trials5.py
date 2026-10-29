from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/sell_v2.rs';base=P.read_text();best=(R/'trials/is_sol_before_clock/sell_v2.rs').read_text();needle='emit!(ev);emit_cpi!(ev);Ok(())';assert best.count(needle)==1
helper="\n#[inline(always)]fn emit_sell_trade(ctx:&Context<SellV2>,event:&TradeEvent)->Result<()>{emit!(*event);emit_cpi!(*event);Ok(())}\n"
variants={'borrowed_trade_emitter_independent_context':best.replace(needle,'emit_sell_trade(&ctx,&ev)?;Ok(())',1)+helper,'borrowed_trade_emitter_tail_independent_context':best.replace(needle,'emit_sell_trade(&ctx,&ev)',1)+helper}

bs=score.score(R.parent/'goal-pump-v2-callers-recovery-20261028/best-exact-quote/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  assert text.count('\n')==base.count('\n')+2,n
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'sell_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x144508);f=next(f for f in c.funcs if '7sell_v27execute17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results5.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
