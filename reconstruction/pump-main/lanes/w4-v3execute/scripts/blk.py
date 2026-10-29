import sys,re
t=open(sys.argv[1]).read(); i=t.index('define internal fastcc void @_ZN14pump_recovered5trade14v3_execute_buy17h'); j=t.index('\n}\n',i)
f=t[i:j]; parts=re.split(r'\n\n',f)
want=sys.argv[2:]
for p in parts:
    n=p.split(':')[0]
    if n in want: print(p,'\n')
