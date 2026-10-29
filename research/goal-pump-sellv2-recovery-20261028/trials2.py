from pathlib import Path
import sys,json,difflib
R=Path(__file__).resolve().parent;H=Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness');sys.path.insert(0,str(H));import fastbuild,score,win
P=R/'src/src/sell_v2.rs';base=P.read_text();best=(R/'trials/is_sol_before_clock/sell_v2.rs').read_text()
helpers=[]
for suffix,dest,adapt in [('owned',"AccountInfo<'info>",'destination'),('user',"&Signer<'info>",'destination.as_ref()'),('recipient',"&&UncheckedAccount<'info>",'destination')]:
 helpers.append("\nfn pay_quote_"+suffix+"<'info>(native:bool,base_mint:&InterfaceAccount<'info,Mint>,curve:&Account<'info,BondingCurve>,destination:"+dest+",amount:u64,token_program:&Interface<'info,TokenInterface>,quote_mint:&InterfaceAccount<'info,Mint>,from:Option<&AccountInfo<'info>>,to:Option<&AccountInfo<'info>>,bump:u8)->Result<()>{crate::trade::quote_payments::transfer_to_"+suffix+"(native,AsRef::<AccountInfo<'info>>::as_ref(base_mint),curve,"+adapt+",amount,token_program,quote_mint.decimals,AsRef::<AccountInfo<'info>>::as_ref(quote_mint),from,to,bump)}\n")
pay=best
for kind in ['owned','user','recipient']:
 old='crate::trade::quote_payments::transfer_to_'+kind+'(native,a.base_mint.as_ref().as_ref(),a.bonding_curve.as_ref(),'
 new='pay_quote_'+kind+'(native,&a.base_mint,a.bonding_curve.as_ref(),'
 assert old in pay
 pay=pay.replace(old,new)
pay=pay.replace('pay_quote_user(native,&a.base_mint,a.bonding_curve.as_ref(),a.user.as_ref(),','pay_quote_user(native,&a.base_mint,a.bonding_curve.as_ref(),&a.user,')
pay=pay.replace(',&a.quote_token_program,a.quote_mint.decimals,a.quote_mint.as_ref().as_ref(),',',&a.quote_token_program,&a.quote_mint,')
move_old='user_token_transfers::transfer_user_tokens(&a.base_token_program,&a.associated_base_user,&a.associated_base_bonding_curve,a.user.as_ref(),a.base_mint.decimals,a.base_mint.as_ref().as_ref(),amount)'
move_new='move_sell_tokens(&a.base_token_program,&a.associated_base_user,&a.associated_base_bonding_curve,&a.user,&a.base_mint,amount)'
assert move_old in best
movehelper="\nfn move_sell_tokens<'info>(program:&Interface<'info,TokenInterface>,source:&InterfaceAccount<'info,TokenAccount>,destination:&InterfaceAccount<'info,TokenAccount>,user:&Signer<'info>,mint:&InterfaceAccount<'info,Mint>,amount:u64)->Result<()>{user_token_transfers::transfer_user_tokens(program,source,destination,user.as_ref(),mint.decimals,AsRef::<AccountInfo<'info>>::as_ref(mint),amount)}\n"
variants={'typed_quote_payouts':pay+''.join(helpers),'typed_user_token_transfer':best.replace(move_old,move_new,1)+movehelper}

bs=score.score(R.parent/'goal-pump-v2-callers-recovery-20261028/best-exact-quote/unstripped.so');rows=[]
try:
 for n,text in variants.items():
  assert text.count('\n') in [base.count('\n')+2,base.count('\n')+6],n
  P.write_text(text);out=R/'trials'/n;out.mkdir(parents=True,exist_ok=True);(out/'sell_v2.rs').write_text(text);b=fastbuild.build(R/'src',R/'build',out,quiet=True);v={'name':n,**b}
  if b['ok']:
   sc=score.score(out/'unstripped.so');(out/'score.json').write_text(json.dumps({'windows':sc},indent=2));v.update(normalized=sum(x['normalized']for x in sc.values()),raw=sum(x['raw']for x in sc.values()),gains=[hex(k)for k,x in sc.items()if x['normalized']and not bs[k]['normalized']],losses=[hex(k)for k,x in sc.items()if bs[k]['normalized']and not x['normalized']]);c=win.Cand(out/'unstripped.so');w=next(x for x in score.original_windows()if x['start']==0x144508);f=next(f for f in c.funcs if '7sell_v27execute17h'in f[2]);ct=[x[2]for x in win.insns(c.fn(f[0],f[1]),f[0],c.secs)];ot=[x[2]for x in win.insns(w['raw'],w['start'],win.ORIG_SECS)];v.update(target_bytes=f[1],target_ratio=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio())
  rows.append(v);(R/'results2.json').write_text(json.dumps(rows,indent=2));print(json.dumps(v),flush=True)
finally:P.write_text(base)
