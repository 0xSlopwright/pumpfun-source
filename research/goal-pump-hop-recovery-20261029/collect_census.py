#!/usr/bin/env python3
from pathlib import Path
import collections,gzip,json
R=Path(__file__).resolve().parent
base=json.loads(gzip.decompress((R/'canonical/graph.json.gz').read_bytes()));labels={x['identity_sha256']:x['symbol']for x in base['physical_order_callees']['candidate']};out=[]
for d in sorted((R/'probes').iterdir()):
 if not(d/'RESULT.json').exists()or not json.loads((d/'RESULT.json').read_text())['ok']:continue
 g=json.loads(gzip.decompress((d/'graph.json.gz').read_bytes()));oc=collections.Counter(x['identity_sha256']for x in g['physical_order_callees']['original']);cc=collections.Counter(x['identity_sha256']for x in g['physical_order_callees']['candidate']);lc={**labels,**{x['identity_sha256']:x['symbol']for x in g['physical_order_callees']['candidate']}}
 delta=[{'name':lc.get(k),'original_count':oc[k],'candidate_count':cc[k],'identity':k}for k in sorted(oc.keys()|cc.keys())if oc[k]!=cc[k]]
 out.append({'name':d.name,'original_calls':sum(oc.values()),'candidate_calls':sum(cc.values()),'exact_depth2_callee_multiset_equal':oc==cc,'differences':delta})
(R/'CALLEE-CENSUS.json').write_text(json.dumps(out,indent=2)+'\n')
