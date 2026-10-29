from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/buy_v2.rs';base=P.read_text();best=(R/'trials/separate_const_native_none/buy_v2.rs').read_text();idx=best.index("fn buy_exact_quote_in_handler<'info>");prefix=best[:idx];q=best[idx:];key='if a.user.key()==a.global.whitelist_pda{';assert key in q
q=q.replace(key,'if a.global.whitelist_pda==a.user.key(){',1)
cf='if cf>0 {';assert cf in q
system=q.replace(cf,'let system_program=&a.system_program;if cf>0 {',1).replace('native,&a.system_program,','native,system_program,').replace('native_payments::ensure_rent_exempt(0,&a.system_program,','native_payments::ensure_rent_exempt(0,system_program,')
variants={'const_none_global_first':prefix+q,'shared_system_program':prefix+system}

bs=score.score(R.parent/'goal-pump-buyv2-recovery-20261028/separate-crate/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'buy_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x13f630);f=next(f for f in c.funcs if 'buy_exact_quote_in_handler17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results8.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
