from pathlib import Path
import sys,json,hashlib,difflib,collections
W=Path(__file__).resolve().parent;R=W.parents[1];sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'));from elf_reader import Elf
base=R/'repro/pump_amm/structural-tlv-recovery-20261027/results';old=json.loads(__import__('gzip').decompress((base/'measurement.json.gz').read_bytes()));o=Elf(R/'evidence/original/pump_amm/deployed.so');c=Elf(W/'build/artifacts/pump_amm_recovered.so');s=Elf(W/'build/artifacts/unstripped.so');index=collections.defaultdict(list)
for f in s.funcs:index[(f['size'],c.normalized[f['start']:f['start']+f['size']],json.dumps(c.pattern(f['start'],f['size']),sort_keys=True))].append(f)
rows=[];raw=0
for r in old['rows']:
 a,z=r['start'],r['end'];n=z-a;matches=index[(n,o.normalized[a:z],json.dumps(o.pattern(a,n),sort_keys=True))];raw+=any(o.b[a:z]==c.b[f['start']:f['start']+n]for f in matches);rows.append({'start':a,'end':z,'matches':matches})
oldset={r['start']for r in old['rows']if r['matches']};newset={r['start']for r in rows if r['matches']};measurement={'candidate_sha256':hashlib.sha256(c.b).hexdigest(),'normalized_matches':len(newset),'raw_matches':raw,'unmatched':len(rows)-len(newset),'gained_original_windows':sorted(newset-oldset),'lost_original_windows':sorted(oldset-newset),'rows':rows};parent=json.loads((W/'parent-measurement.json').read_bytes());parentset={r['start']for r in parent['rows']if r['matches']};measurement['parent_candidate_sha256']=parent['candidate_sha256'];measurement['gains_vs_parent']=sorted(newset-parentset);measurement['losses_vs_parent']=sorted(parentset-newset);(W/'measurement.json').write_text(json.dumps(measurement,indent=2)+'\n')
print(json.dumps({k:v for k,v in measurement.items()if k!='rows'},indent=2))
