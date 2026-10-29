#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-direct-events';s=(prev/'src/multi_hop_curve_swap.rs').read_text()
assert s.count('&a.buyback_fee_recipient.to_account_info(),false,')==1;s=s.replace('&a.buyback_fee_recipient.to_account_info(),false,','a.buyback_fee_recipient.as_ref(),false,',1)
assert s.count('h.quote_mint.to_account_info().owner)?;')==1;s=s.replace('h.quote_mint.to_account_info().owner)?;','&quote_token_program.key())?;',1)
old='AsRef::<AccountInfo>::as_ref(a.fee_config.as_ref()).data_len()';assert s.count(old)==1;s=s.replace(old,'a.fee_config.to_account_info().data_len()',1)
old='        let bump = [curve_bump];\n        let seeds: &[&[u8]] = &[b"bonding-curve",mint_key.as_ref(),&bump];';assert s.count(old)==1;s=s.replace(old,'\n',1)
old='        require!(buy || *current_mint == h.base_mint.key(),PumpError::MultiHopDiscontinuousPath);\n\n\n';assert s.count(old)==1
new='        require!(buy || *current_mint == h.base_mint.key(),PumpError::MultiHopDiscontinuousPath);\n\n        let bump=[curve_bump]; let seeds:&[&[u8]]=&[b"bonding-curve",h.base_mint.to_account_info().key.as_ref(),&bump];\n';s=s.replace(old,new,1)
base=(R/'src/src/multi_hop_curve_swap.rs').read_text();assert len(base.splitlines())==len(s.splitlines())
out=R/'probes/matched-business-seed-gates';out.mkdir(parents=True,exist_ok=False);files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Original real validation argument roles, early base-mint-key signer seeds, and fee-info data-length temporary. No dummy values or emitted artifact edits.'};(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
