from pathlib import Path
import importlib.util,json,hashlib
r=Path(__file__).resolve().parent;p=Path.home()/'amm100-run/shared/tools/measure.py';s=importlib.util.spec_from_file_location('m',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
b=m.Elf(r/'baseline.so');f=next(x for x in b.funcs if '4sell8cashback' in x['name']);bb=b.normalized[f['start']:f['start']+f['size']];o=m.orig();ob=o.normalized[0x4c750:0x4ea90];rows=[]
for root in ['flag-trials','flag-trials2','flag-trials3']:
 for d in sorted((r/root).glob('*')):
  if not d.is_dir() or not (d/'symbols.so').exists():continue
  c=m.Elf(d/'symbols.so');cf=next(x for x in c.funcs if '4sell8cashback' in x['name']);cb=c.normalized[cf['start']:cf['start']+cf['size']];rows.append({'trial':d.name,'bytes':cf['size'],'normalized_equal_baseline':cb==bb,'normalized_equal_original':cb==ob,'diff_slots_vs_base':sum(cb[i:i+8]!=bb[i:i+8]for i in range(0,min(len(cb),len(bb)),8)),'prefix_branch_at_d00':c.b[cf['start']+0xd00:cf['start']+0xd10].hex(),'body_hash':hashlib.sha256(cb).hexdigest()})
(r/'sell-body-results.json').write_text(json.dumps({'baseline_bytes':f['size'],'baseline_body_hash':hashlib.sha256(bb).hexdigest(),'runs':rows},indent=2)+'\n');print(json.dumps(rows,indent=2))
