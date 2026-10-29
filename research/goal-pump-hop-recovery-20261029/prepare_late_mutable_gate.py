#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-late-completion';s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
assert lines[763].strip()=='let c = &h.bonding_curve;';lines[763]='        let c = &mut h.bonding_curve;\n'
assert 'if buy && h.bonding_curve.real_token_reserves==0' in lines[782];lines[782]='        if c.real_token_reserves==0 { c.complete=true;\n'
for index in range(783,len(lines)):
 if index>795:break
 lines[index]=lines[index].replace('h.bonding_curve.key()','c.key()')
s=''.join(lines);assert len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-late-mutable';out.mkdir(parents=True,exist_ok=False);files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Original late reserve-only completion gate uses a mutable curve view for state update and completion/post event keys. E0502 repair, no artificial state.'};(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
