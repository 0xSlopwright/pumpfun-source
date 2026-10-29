from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();best=(R/'trials/entry_base_program_mint_refs/buy_v2.rs').read_text();idx=best.index("fn buy_exact_quote_in_handler<'info>");prefix=best[:idx];q=best[idx:];quote='quote_mint,quote_amount:quote';assert q.count(quote)==1;q=q.replace(quote,'quote_mint:c.quote_mint,quote_amount:quote',1)
call='crate::trade_types::prepare_bonding_curve(&a.bonding_curve,&a.system_program,&a.user)'
tail=call+'?;\nOk(())';assert q.count(tail)==1
match=call+';'
matched=q.replace(tail,'match '+call+'{Err(e)=>Err(e),Ok(())=>Ok(())}\n',1)
checked=q.replace(tail,'let prepared='+call+';\nif prepared.is_ok(){Ok(())}else{prepared}',1)
variants={'base_refs_fresh_event_quote':prefix+q,'prepare_consumed_match':prefix+matched,'prepare_checked_result':prefix+checked}

bs=score.score(R.parent/'goal-pump-buyv2-recovery-20261028/separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13f630);f=next(f for f in c.funcs if 'buy_exact_quote_in_handler17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results14.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
