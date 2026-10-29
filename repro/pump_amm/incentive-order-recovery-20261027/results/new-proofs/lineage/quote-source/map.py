import sys,json,collections,subprocess,difflib
from pathlib import Path
sys.dont_write_bytecode=True
R=Path.cwd();W=R/'work/amm-math-dependency-review-20261027'
sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf
O=Elf(R/'evidence/original/pump_amm/deployed.so'); C=Elf(R/'work/amm-u64-v2-creator-final-20261027/build/artifacts/unstripped.so')
M=json.loads((R/'work/amm-optional-context-final-20261027/measurement.json').read_text()); P=json.loads((W/'partition.json').read_text())
cf={f['start']:f for f in C.funcs}; om={r['start']:r for r in M['rows']}; entries=sorted(O.entries); out=[]
names=[f['name'] for f in C.funcs]; dem=subprocess.run(['/opt/homebrew/opt/llvm/bin/llvm-cxxfilt'],input='\n'.join(names),text=True,capture_output=True,check=True).stdout.splitlines(); dn=dict(zip(names,dem))
for r in P['rows']:
 a=int(r['original_start'],16); n=r['bytes']; calls=[]; owners=[]; mapped=collections.Counter()
 for pc,t in O.calls.items():
  if t!=a:continue
  par=max(e for e in entries if e<=pc); row=om[par]
  callers=[]
  for m in row['matches']:
   q=m['start']+(pc-par); target=C.calls.get(q)
   f=cf.get(target,{})
   nm=dn.get(f.get('name',''),'')
   callers.append({'candidate_parent':dn.get(m['name'],m['name']), 'target':hex(target or 0),'target_name':nm,'target_bytes':f.get('size')})
   if target:mapped[target]+=1
  owners.append({'original_parent':hex(par),'offset':hex(pc-par),'maps':callers})
 for pc,t in O.calls.items():
  if a<=pc<a+n:calls.append({'offset':hex(pc-a),'target':hex(t),'size':om.get(t,{}).get('end',t)-t})
 # nearest whole symbol by same-length instruction tuple similarity, retain candidate tuple
 ot=[O.normalized[x:x+8] for x in range(a,a+n,8)]
 scores=[]
 for f in C.funcs:
  if abs(f['size']-n)>max(80,n*.3):continue
  s=f['start'];ct=[C.normalized[x:x+8] for x in range(s,s+f['size'],8)]
  score=difflib.SequenceMatcher(None,ot,ct,autojunk=False).ratio()
  scores.append((score,f))
 scores.sort(key=lambda x:x[0],reverse=True)
 nearest=[{'score':round(score,4),'start':hex(f['start']),'bytes':f['size'],'name':dn[f['name']]} for score,f in scores[:3]]
 out.append({**r,'caller_evidence':owners,'direct_calls':calls,'nearest':nearest})
(W/'mapped.json').write_text(json.dumps(out,indent=2)+'\n')
for r in out:
 print(r['original_start'],r['bytes'])
 print(' NEAR',[(x['start'],x['bytes'],x['score'],x['name']) for x in r['nearest']])
 print(' MAPS',[p for p in r['caller_evidence'] if p['maps']][:4])
 print(' CALLS',r['direct_calls'])
