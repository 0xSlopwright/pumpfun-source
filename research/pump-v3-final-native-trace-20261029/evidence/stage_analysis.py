from pathlib import Path
import hashlib,json,re
P=Path(__file__).resolve().parent
log=(P/'passive/build.log').read_text()
pat=re.compile(r'^(?:; |# )?\*\*\* IR Dump[^\n]*$',re.M)
ms=list(pat.finditer(log));assert len(ms)==392,len(ms)
ss=[log[m.start():(ms[i+1].start()if i+1<len(ms)else len(log))]for i,m in enumerate(ms)]
index=json.loads((P/'passive/snapshot-index.json').read_text())
# Strip cargo diagnostics after the last machine snapshot using its terminal marker.
for i,t in enumerate(ss):
 if '# End machine code for function' in t:
  pos=t.index('# End machine code for function');t=t[:t.index('\n',pos)+1];ss[i]=t
for i in [274,275,276,312,313,320,321,324,325,334,335,336,337,350,351,354,355,358,359,370,371,380,381,390,391]:
 (P/f'analysis/snapshot-{i:03}.txt').write_text(ss[i])
def blocks(t):
 matches=list(re.finditer(r'^(?:\d+B\s*)?bb\.\d+[^\n]*',t,re.M));return[t[m.start():(matches[i+1].start()if i+1<len(matches)else len(t))]for i,m in enumerate(matches)]
rows=[]
for i in range(276,392):
 t=ss[i];bb=blocks(t);calls=[b for b in bb if 'JAL @_ZN14pump_recovered5trade4add3'in b]
 assert len(calls)==2,(i,len(calls))
 retptr_spills=[l.strip()for l in t.splitlines()if 'STD_V1'in l and '%stack.19'in l]
 retptr_loads=[l.strip()for l in t.splitlines()if 'LDD_V1'in l and '%stack.19'in l]
 second=calls[1];c=second.index('JAL @_ZN14pump_recovered5trade4add3')
 rows.append(dict(index=i,header=index[i]['header'],second_add3_aftercall=second[c:].splitlines()[1:],retptr_stack19_stores=retptr_spills,retptr_stack19_loads=retptr_loads,blocks=[b.splitlines()[0]for b in bb]))
(P/'analysis/machine-transitions.json').write_text(json.dumps(rows,indent=2)+'\n')
last=None
for r in rows:
 state=(r['second_add3_aftercall'],r['retptr_stack19_stores'],r['retptr_stack19_loads'])
 if state!=last:
  print(r['index'],r['header']);print('second',r['second_add3_aftercall']);print('retptr load count',len(r['retptr_stack19_loads']));last=state
