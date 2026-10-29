#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-branch-capped-output'
s=(prev/'src/multi_hop_curve_swap.rs').read_text();assert s.count('post_fill.as_ref()')==2
s=s.replace('post_fill.as_ref()','post_fill');assert s.count('post_complete_buy_event(post,')==1
s=s.replace('post_complete_buy_event(post,','post_complete_buy_event(&post,')
assert len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-post-value';out.mkdir(parents=True,exist_ok=False)
files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Read Copy PostComplete option by value for fees and final event; borrow the actual moved local only at the final factory call. Original scalar-spills fields then rematerializes8field record before factory, unlike prior persistent borrowed Option aggregate. Calls/state/event order and physical rows unchanged.'}
(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
