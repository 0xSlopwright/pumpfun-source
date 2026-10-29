#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-completion-order';s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
assert 'let completed=buy && h.bonding_curve.real_token_reserves==0;'in lines[744];lines[744]='\n'
assert lines[782].strip()=='if completed {';lines[782]='        if buy && h.bonding_curve.real_token_reserves==0 { h.bonding_curve.complete=true;\n'
s=''.join(lines);assert len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-late-completion';out.mkdir(parents=True,exist_ok=False);files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Original late completion gate both mutates complete and emits completion after the ordinary trade event. No cached earlier completion flag.'};(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
