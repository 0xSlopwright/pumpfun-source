#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-late-mutable'
s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
assert lines[786].strip()=='}'
lines[786]='        } let (output_mint,output_vault)=if buy { (h.base_mint.key(),h.associated_base_bonding_curve.to_account_info()) } else { (h.quote_mint.key(),h.associated_quote_bonding_curve.to_account_info()) }; let result=HopOutput { mint:output_mint,amount:output,buyback_fee:received_buyback,vault:output_vault };\n'
assert lines[795].strip().startswith('} Ok(HopOutput {')
lines[795]='        } Ok(result) }\n'
s=''.join(lines);assert len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-output-record';out.mkdir(parents=True,exist_ok=False)
files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Construct the actual returned output record before optional post-completion event construction, with one mint/vault buy-side selection. Original call/gate trace clones the output vault first. All fields used, no dummy state or changed physical source rows.'}
(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
