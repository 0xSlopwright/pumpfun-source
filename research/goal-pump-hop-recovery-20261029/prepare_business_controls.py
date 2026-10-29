#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,re
R=Path(__file__).resolve().parent
base=(R/'src/src/multi_hop_curve_swap.rs').read_text();trade=(R/'src/src/trade_v3.rs').read_text()
assert 'fn sub3(a:u64,b:u64,c:u64)'in trade
trade_visible=trade.replace('fn sub3(a:u64,b:u64,c:u64)','pub(crate) fn sub3(a:u64,b:u64,c:u64)',1)
start=base.index("#[inline(never)] fn swap_hop");end=base.index('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n#[inline(never)]',start)
# Source control boundaries are existing, independently matched helper functions.
s=base.replace('let cap = div(h.base_mint.supply as u128 * c.virtual_quote_reserves as u128,\n            c.virtual_token_reserves as u128)?;','let cap = crate::buy_fee_market_cap(c,&h.base_mint)?;\n',1)
s=s.replace('let q = sub(sub(trade_amount,pf)?,cf)?;','let q = crate::trade::sub3(trade_amount,pf,cf)?;',1)
s=s.replace('            require!(q != 0,PumpError::Overflow);\n            let effective = q - 1;','\n',1)
old='let base = u64::try_from(div(effective as u128 * c.virtual_token_reserves as u128, c.virtual_quote_reserves as u128 + effective as u128)?).map_err(|_| error!(PumpError::Truncation))?;'
assert old in s;s=s.replace(old,'let base = u64::try_from(crate::constant_product::tokens_for_quote(c,q)?).map_err(|_| error!(PumpError::Truncation))?;',1)
s=s.replace('let net = sub(sub(gross_sell,pf)?,cf)?;','let net = crate::trade::sub3(gross_sell,pf,cf)?;',1)
math=s
old='post_fill=Some(PostCompleteFill { base:post.base_out,quote:post.quote_in,\n                        protocol:post.fees.protocol_fee,creator:post.fees.creator_fee,pool_base:post.pool_base_before,pool_quote:post.pool_quote_before });'
assert old in s;s=s.replace(old,'post_fill=Some(post);\n',1)
# Keep the original PostComplete value; the exact event helper consumes its full fees record.
a=s.index("#[inline(never)] fn swap_hop");b=s.index('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n#[inline(never)]',a);chunk=s[a:b]
for key,value in {'base':'base_out','quote':'quote_in','protocol':'fees.protocol_fee','creator':'fees.creator_fee','pool_base':'pool_base_before','pool_quote':'pool_quote_before'}.items():chunk=re.sub(r'\bpost\.'+key+r'\b','post.'+value,chunk)
old='move_lamports(&h.bonding_curve.to_account_info(),&a.user.to_account_info(),output)?;';assert old in chunk;chunk=chunk.replace(old,'crate::trade::quote_payments::transfer_native(&h.bonding_curve,a.user.to_account_info(),output)?;',1)
old=chunk[chunk.index('            let post_event=crate::trade::PostCompleteBuyEvent {'):chunk.index('            route_event(a,&post_event,event_bump)?;')]
new='            let post_event=crate::trade::post_complete_buy_event(post,a.user.key(),mint_key,h.bonding_curve.key(),c.quote_mint,Clock::get()?.unix_timestamp,post_buyback)?;'+('\n'*old.count('\n'))
chunk=chunk.replace(old,new,1);s=s[:a]+chunk+s[b:];business=s
inline=business.replace('fn route_event<E: anchor_lang::Event>','#[inline(always)] fn route_event<E: anchor_lang::Event>',1)
variants={'matched-arithmetic':math,'matched-post-payment':business,'matched-business-inline-events':inline}
for name,source in variants.items():
 assert len(source.splitlines())==len(base.splitlines()),(name,len(source.splitlines()),len(base.splitlines()))
 out=R/'probes'/name;out.mkdir(parents=True,exist_ok=False)
 modified={'src/multi_hop_curve_swap.rs':source,'src/trade_v3.rs':trade_visible}
 for n,t in modified.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
 changed={n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in modified.items()}
 (out/'SOURCE-MANIFEST.json').write_text(json.dumps({'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in modified.items()},'changed_rows':changed,'scope':'Existing strictly matched business helpers; same physical source rows. No emitted artifact edits.'},indent=2)+'\n');print(name,changed)
