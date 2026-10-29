#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-branch-capped-output'
s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
i=next(i for i,x in enumerate(lines)if x.strip()=='if native && !buy && last {')
assert lines[i+2].strip()=='}';lines[i]='        if native { if !buy && last {\n';lines[i+2]='        } }\n'
s=''.join(lines);assert len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-native-payout-guard';out.mkdir(parents=True,exist_ok=False)
files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'One precise payout-guard grouping control motivated by passive IR: native&&last fuses before buy and lowers buy->native->last, whereas original has native->buy->last. Explicit native outer guard encloses actual !buy&&last payout only. No added values/calls and physical rows unchanged.'}
(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
