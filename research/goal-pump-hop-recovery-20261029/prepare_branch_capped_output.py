#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-nested-post-gate'
s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
assert sum('let capped = base.min(c.real_token_reserves);'in x for x in lines)==1
changed=[]
for i,line in enumerate(lines):
 if 'let capped = base.min(c.real_token_reserves);'in line:lines[i]='\n';changed.append(i+1)
 elif 'capped'in line:lines[i]=line.replace('capped','c.real_token_reserves');changed.append(i+1)
assert len(changed)==3;s=''.join(lines);assert 'capped'not in s and len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-branch-capped-output';out.mkdir(parents=True,exist_ok=False)
files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Use curve reserves directly in base>reserves arm; remove redundant pre-branch min and its extra comparison/selector, absent from original branch census. Existing admission branch and physical error rows preserved.'}
(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
