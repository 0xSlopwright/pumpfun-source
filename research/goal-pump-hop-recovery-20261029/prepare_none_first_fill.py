#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-branch-capped-output'
s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
assert lines[599].strip().startswith('if let Some((fees, quote, post)) = complete_fill(')
lines[599]=lines[599].replace('if let Some((fees, quote, post)) = complete_fill(','match complete_fill(')
assert lines[600].strip().endswith('trade_amount)? {')
lines[600]=lines[600].replace('trade_amount)? {','trade_amount)? { None => (p_rate,c_rate,c.real_token_reserves,q,pf,cf,c.real_token_reserves), Some((fees,quote,post)) => {')
assert lines[624].strip()=='}else{(p_rate,c_rate,c.real_token_reserves,q,pf,cf,c.real_token_reserves)}';lines[624]='                } }\n'
s=''.join(lines);assert len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-none-first-fill';out.mkdir(parents=True,exist_ok=False)
files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Original complete_fill Result first rejects tag2, then tests tag0 None. Current source tests tag1 Some. Natural exhaustive None-first match preserves actual cases and source rows; no added unwrap, state or helpers.'}
(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
