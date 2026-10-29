from pathlib import Path
import sys,importlib.util,json,hashlib,shutil
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/migrate_v2.rs';base=P.read_text();prefix="pub fn create_token_account_v2<'info>(a:&MigrateV2<'info>,bump:u8,account:&AccountInfo<'info>,wallet:&AccountInfo<'info>,mint:&InterfaceAccount<'info,Mint>,native:bool,token_program:&AccountInfo<'info>)->Result<()>{\n let token_program=token_program.clone();"
h3="pub fn create_token_account_v2<'info>(a:&MigrateV2<'info>,bump:u8,account:&AccountInfo<'info>,wallet:&AccountInfo<'info>,mint:&InterfaceAccount<'info,Mint>,native:bool,token_program:&AccountInfo<'info>)->Result<()>{create_token_account(a,bump,account,wallet,mint,native,token_program.clone())}\n#[inline(always)]fn create_token_account<'info>(a:&MigrateV2<'info>,bump:u8,account:&AccountInfo<'info>,wallet:&AccountInfo<'info>,mint:&InterfaceAccount<'info,Mint>,native:bool,token_program:AccountInfo<'info>)->Result<()>{"
assert prefix in base
S=base.replace(prefix,h3)
variants={'h3':S,'h3_result':S.replace('{create_token_account(a,bump,account,wallet,mint,native,token_program.clone())}','{let result = create_token_account(a,bump,account,wallet,mint,native,token_program.clone());result}'),'h3_question':S.replace('{create_token_account(a,bump,account,wallet,mint,native,token_program.clone())}','{create_token_account(a,bump,account,wallet,mint,native,token_program.clone())?;Ok(())}'),'h3_tpfirst':S.replace('create_token_account(a,bump,account,wallet,mint,native,token_program.clone())','create_token_account(token_program.clone(),a,bump,account,wallet,mint,native)').replace("fn create_token_account<'info>(a:&MigrateV2<'info>,bump:u8,account:&AccountInfo<'info>,wallet:&AccountInfo<'info>,mint:&InterfaceAccount<'info,Mint>,native:bool,token_program:AccountInfo<'info>)","fn create_token_account<'info>(token_program:AccountInfo<'info>,a:&MigrateV2<'info>,bump:u8,account:&AccountInfo<'info>,wallet:&AccountInfo<'info>,mint:&InterfaceAccount<'info,Mint>,native:bool)")}
bs=score.score(R/'baseline/unstripped.so');rows=[]
try:
 for n,s in variants.items():
  assert s.count('\n')==base.count('\n'),n
  P.write_text(s);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'migrate_v2.rs').write_text(s);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x4c158);f=next(f for f in c.funcs if 'create_token_account_v2' in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];import difflib;v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results-cta.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
