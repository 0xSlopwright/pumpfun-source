from pathlib import Path
from collections import Counter
import hashlib,json,re,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'))
from paired_receipt_reader import records
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
rx=re.compile(r'AnchorError thrown in (programs/pump/[^ :]+):.*?Error Code: (\w+)')
target=[];protected=[];families=Counter();inputs=[];total=0
for group in ['full','additional']:
 path=R/f'work/parallel-main-integration/round41-captured-{group}.json.gz';inputs.append(path)
 for _,where,row in records(path):
  total+=1
  left=[rx.search(line).groups()for line in row['original']['logs']if rx.search(line)]
  right=[rx.search(line).groups()for line in row['candidate']['logs']if rx.search(line)]
  relevant=[x for x in left if x[0]=='programs/pump/src/util/fee.rs']
  item={'group':group,'row':where,'case':row.get('case'),'original':left,'candidate':right}
  if relevant and left!=right:
   target.append(item)
   for file,code in relevant:families[code]+=1
  if left==right and any(file in ['programs/pump/src/trade_v3.rs','programs/pump/src/multi_hop_curve_swap.rs']and code in ['Truncation','FeeTiersEmpty','FeeConfigTooShort']for file,code in left):
   protected.append(item)
assert total==18110 and len(target)==96
result={'scope':'Actual full R41 retained pairs; no new execution or new case definition.',
        'paired_cases':total,'target_cases':len(target),'target_families':dict(families),
        'target':target,'protected_count':len(protected),'protected':protected,
        'input_sha256':{str(p.relative_to(R)):h(p)for p in inputs+[Path(__file__)]}}
(W/'ORIGIN-COHORTS.json').write_text(json.dumps(result,indent=2)+'\n')
print({'target_cases':len(target),'target_families':dict(families),'protected_nonfee_origins':len(protected),'examples':target[:2]})
