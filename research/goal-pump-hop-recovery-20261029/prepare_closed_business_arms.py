#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-seed-gates';s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
def put(n,t):lines[n-1]=t+'\n'
assert 'let (p_rate,c_rate,base_amount,quote_amount,pf,cf,raw_output) = if buy' in lines[574]
put(548,lines[547].rstrip()+' let mint_key=h.base_mint.key();')
put(575,'        let (p_rate,c_rate,base_amount,quote_amount,pf,cf,raw_output,output,sell_transfer_fee) = if buy { let (p_rate,c_rate,base_amount,quote_amount,pf,cf,raw_output) = {')
buy='        }; if native { crate::user_quote_payments::transfer_native(a.system_program.as_ref(),&a.user,h.bonding_curve.as_ref(),amount)?; } else { transfer_input(a,previous,&quote_token_program,&h.associated_quote_bonding_curve,h.quote_mint.decimals,AsRef::<AccountInfo>::as_ref(&*h.quote_mint),amount)?; } h.bonding_curve.apply_buy(base_amount,quote_amount)?; if last { transfer_base_out(&base_token_program,&h.associated_base_bonding_curve,&a.destination,&h.bonding_curve,h.base_mint.decimals,AsRef::<AccountInfo>::as_ref(&*h.base_mint),raw_output,&[seeds])?; } (p_rate,c_rate,base_amount,quote_amount,pf,cf,raw_output,raw_output,0)'
assert not lines[670].strip();put(671,buy)
assert lines[671].strip()=='} else {';put(672,'        } else { let (p_rate,c_rate,base_amount,quote_amount,pf,cf,raw_output) = {')
assert lines[687].strip()=='};';put(688,'        };')
put(689,'        let output=crate::transfer_fee_recovered::post_fee_amount(&quote_fee,raw_output)?;');put(690,'');put(691,'')
# The original overflow closure remains on its exact physical source row692.
for n in[693,694,695,696,697,699,702,703,707,712,713]:put(n,'')
# Existing sell transfer and apply remain inside the sell arm at their original rows.
assert 'transfer_input(a,previous,&base_token_program' in lines[697]
assert 'let c = &mut h.bonding_curve;' in lines[700]
assert 'c.apply_sell(base_amount,quote_amount)?;' in lines[707]
put(716,'        if last && !native {')
put(720,'            transfer_quote_out(&quote_token_program,&h.associated_quote_bonding_curve,&a.destination,&h.bonding_curve,h.quote_mint.decimals,AsRef::<AccountInfo>::as_ref(&*h.quote_mint),raw_output,&[seeds])?;')
put(721,'        } (p_rate,c_rate,base_amount,quote_amount,pf,cf,raw_output,output,sell_transfer_fee) };')
assert 'else if paid_buyback != 0' in lines[754];put(755,'            } else {')
source=''.join(lines);base=(R/'src/src/multi_hop_curve_swap.rs').read_text();assert len(source.splitlines())==len(base.splitlines())
out=R/'probes/matched-business-closed-arms';out.mkdir(parents=True,exist_ok=False);files={'src/multi_hop_curve_swap.rs':source,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Real buy/sell business arms each own input, state update and last payout. Exact matched payout helpers handle zero. Error factory rows retained; no dummy state.'};(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
