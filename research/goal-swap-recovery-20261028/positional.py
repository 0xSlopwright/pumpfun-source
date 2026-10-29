import importlib.util,pathlib,json,itertools
R=pathlib.Path(__file__).resolve().parent;repo=R.parents[1]
s=importlib.util.spec_from_file_location('e',pathlib.Path('/Users/shawwalters/amm100-run/shared/tools/elf_reader_src.py'));m=importlib.util.module_from_spec(s);s.loader.exec_module(m)
o=m.Elf(repo/'evidence/original/pump_amm/deployed.so');ob=o.normalized[0x4c750:0x4c750+9024]
paths=[R/'baseline.so',*R.glob('trials/*/symbols.so'),*R.glob('trylane/trials/*/symbols.so'),*repo.glob('research/goal-swap-analysis-20261028/lane/trials/*/symbols.so')]
results=[]
for p in paths:
 try:
  c=m.Elf(p);f=next(f for f in c.funcs if '4sell8cashback' in f['name'] and f['size']>100);b=c.normalized[f['start']:f['start']+f['size']];pairs=list(zip([ob[i:i+8] for i in range(0,len(ob),8)],[b[i:i+8] for i in range(0,len(b),8)]));prefix=len(list(itertools.takewhile(lambda x:x[0]==x[1],pairs)))*8
  results.append({'path':str(p.relative_to(repo)),'bytes':len(b),'prefix':prefix,'aligned_equal_slots':sum(x==y for x,y in pairs),'branch_d00':b[0xd00:0xd10].hex()})
 except Exception as e: results.append({'path':str(p),'error':str(e)})
results.sort(key=lambda r:(-r.get('aligned_equal_slots',0),r['path']));(R/'position-results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results[:16],indent=2))
