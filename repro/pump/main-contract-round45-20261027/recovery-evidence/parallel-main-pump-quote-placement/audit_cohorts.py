from pathlib import Path
from collections import Counter
import hashlib,json,re,sys
R=Path(__file__).resolve().parents[2];W=Path(__file__).resolve().parent
sys.path.insert(0,str(R/'work/parallel-main-r41-log-oracle'))
from paired_receipt_reader import records
h=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
origin=R/'work/parallel-main-anchor-source-placements/R40-ANCHOR-ORIGINS.json'
known=json.loads(origin.read_text())
desired=[row for row in known['rows']if any(p['original']=='programs/pump/src/pump_quote.rs'for p in row['pairs'])]
assert len(desired)==92
want={'nested_create','nested_vault_diagnostics_32','nested_pool_links_10','nested_comparison_matrix','distinct_precedence','nested_chain_tail_boundaries','create_v2'}
rx=re.compile(r'AnchorError thrown in (programs/pump/[^ :]+):.*?Error Code: (\w+)')
counts=Counter();pairs=Counter();protected=[];inputs=[origin]
for group in ['full','additional']:
 path=R/f'work/parallel-main-integration/round40-captured-{group}.json.gz';inputs.append(path)
 for _,where,row in records(path):
  suite=where.split('/')[0]
  if suite not in want:continue
  counts[suite]+=1
  left=[rx.search(line).groups()for line in row['original']['logs']if rx.search(line)]
  right=[rx.search(line).groups()for line in row['candidate']['logs']if rx.search(line)]
  if left or right:pairs[tuple(left),tuple(right)]+=1
  if suite!='create_v2'and left==right and any(file=='programs/pump/src/create_v2.rs'for file,error in left):
   protected.append({'group':group,'row':where,'case':row.get('case'),'anchors':left})
result={'scope':'Retained R40 source-filename evidence for selective physical extraction; no new VM execution.',
        'desired_filename_fixes':desired,'desired_count':92,'protected_already_correct':protected,
        'protected_count':len(protected),'suite_cases':dict(counts),
        'anchor_pairs':[{'original':a,'candidate':b,'count':n}for(a,b),n in pairs.items()],
        'input_sha256':{str(p.relative_to(R)):h(p)for p in inputs+[Path(__file__)]}}
(W/'ORIGIN-COHORTS.json').write_text(json.dumps(result,indent=2)+'\n')
print({'desired':92,'protected':len(protected),'protected_errors':dict(Counter(error for row in protected for file,error in row['anchors'])),'cases':dict(counts)})
