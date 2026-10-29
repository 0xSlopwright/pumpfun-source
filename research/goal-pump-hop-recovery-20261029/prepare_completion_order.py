#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-closed-arms';s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
assert 'let completed=buy && h.bonding_curve.real_token_reserves==0;'in lines[740]
assert 'if completed {'in lines[741]and'h.bonding_curve.complete=true;'in lines[742]
assert '} let buyback=received_buyback.checked_sub(post_buyback)'in lines[743]
for n in[741,742,743]:lines[n-1]='\n'
lines[743]=lines[743].replace('} let buyback=','let buyback=',1)
assert not lines[744].strip();lines[744]='        let completed=buy && h.bonding_curve.real_token_reserves==0; if completed { h.bonding_curve.complete=true; }\n'
s=''.join(lines);assert len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-completion-order';out.mkdir(parents=True,exist_ok=False);files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Original checked buyback difference precedes completion-state branch/mutation. Overflow closure remains on physical row744. No artifact or scorer edits.'};(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
