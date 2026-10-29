#!/usr/bin/env python3
from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parent;prev=R/'probes/matched-business-late-mutable'
s=(prev/'src/multi_hop_curve_swap.rs').read_text();lines=s.splitlines(keepends=True)
assert lines[786].strip()=='}';lines[786]='\n'
assert lines[795].strip().startswith('} Ok(HopOutput {');lines[795]=lines[795].replace('} Ok(HopOutput {','} } Ok(HopOutput {',1)
s=''.join(lines);assert len(s.splitlines())==len((R/'src/src/multi_hop_curve_swap.rs').read_text().splitlines())
out=R/'probes/matched-business-nested-post-gate';out.mkdir(parents=True,exist_ok=False)
files={'src/multi_hop_curve_swap.rs':s,'src/trade_v3.rs':(prev/'src/trade_v3.rs').read_text()}
for n,t in files.items():p=out/n;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t)
manifest={'files':{n:hashlib.sha256(t.encode()).hexdigest()for n,t in files.items()},'changed_rows':{n:[i+1 for i,(x,y)in enumerate(zip((R/'src'/n).read_text().splitlines(),t.splitlines()))if x!=y]for n,t in files.items()},'scope':'Original reserve-zero completion arm encloses the Option<PostComplete> event gate at original0x3e00. Preserve final output expression; only nest the real optional post event inside completion. Physical source rows unchanged.'}
(out/'SOURCE-MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
