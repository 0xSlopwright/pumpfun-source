#!/usr/bin/env python3
from pathlib import Path
import collections,hashlib,json,sys
R=Path(__file__).resolve().parent;P=R.parent;REPO=P.parents[1]
sys.path.insert(0,str(P/'phase3/tools'));import cfg_attribution as cfg
original=cfg.Inventory(REPO/'evidence/original/pump_amm/deployed.so',True);baseline=cfg.Inventory(P/'phase2/ownerwrite-trace/symbols.so')
def tag(inv,target):return json.dumps(inv.tag(target,2),sort_keys=True)
old_calls=original.function(0x4c750)['calls'];old=collections.Counter(tag(original,c['target'])for c in old_calls)
labels=collections.defaultdict(list)
for f in baseline.functions.values():labels[tag(baseline,f['start'])].append(f['name'])
result=[]
for path in sorted(R.glob('*/symbols.so')):
 inv=cfg.Inventory(path);f=next(f for f in inv.functions.values()if '4sell8cashback'in f['name']and f['size']>500);calls=inv.function(f['start'])['calls'];now=collections.Counter(tag(inv,c['target'])for c in calls)
 changes=[]
 for identity in sorted(old.keys()|now.keys()):
  if old[identity]==now[identity]:continue
  changes.append({'depth2_identity_sha256':hashlib.sha256(identity.encode()).hexdigest(),'original_count':old[identity],'candidate_count':now[identity],'baseline_symbols':labels[identity],'original_sites':[hex(c['offset'])for c in old_calls if tag(original,c['target'])==identity],'candidate_sites':[hex(c['offset'])for c in calls if tag(inv,c['target'])==identity]})
 result.append({'name':path.parent.name,'actual_calls':len(calls),'callee_multiset_equal':old==now,'changes':changes})
(R/'callee-multiset-changes.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
