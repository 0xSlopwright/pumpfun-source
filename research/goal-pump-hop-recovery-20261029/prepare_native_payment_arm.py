#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-nested-post-gate'
s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
first=next(i for i,x in enumerate(lines)if x.strip()=='// One quote transfer pays both buybacks; the receipt is assigned to the first fill before the post fill.')+1
last=next(i for i,x in enumerate(lines[first:],first)if x.strip()=='let c = &mut h.bonding_curve;')
assert 'if native && !buy && last' in ''.join(lines[first:last])
replacement='''        if native {
            if flag & 1 != 0 { native_buyback(a,event_bump,&h.bonding_curve,paid_buyback)?; }
            if !buy && last { crate::trade::quote_payments::transfer_native(&h.bonding_curve,a.user.to_account_info(),output)?; }
        } else if flag & 1 != 0 {
            transfer_buyback_out(&quote_token_program,&h.associated_quote_bonding_curve,&a.buyback_fee_recipient,
                &h.bonding_curve,h.quote_mint.decimals,AsRef::<AccountInfo>::as_ref(&*h.quote_mint),
                paid_buyback,&[seeds])?;
        }
'''.splitlines(keepends=True)
assert len(replacement)<=last-first
lines[first:last]=replacement+['\n']*(last-first-len(replacement));s=''.join(lines)
assert len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-native-payment-arm';out.mkdir(parents=True,exist_ok=False)
files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Consolidate real native payment effects into one native branch, preserving native buyback-before-sell-output order. Reuse proven native condition after native buyback, matching original gate sharing; token buyback remains else arm. No extra state and physical rows unchanged.'}
(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
