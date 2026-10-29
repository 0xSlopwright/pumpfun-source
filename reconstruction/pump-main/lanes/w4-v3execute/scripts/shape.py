import re,sys
t=open(sys.argv[1]).read(); i=t.index('define internal fastcc void @_ZN14pump_recovered5trade14v3_execute_buy17h'); j=t.index('\n}\n',i)
f=t[i:j]; blocks=re.split(r'\n\n',f)
names=[b.split(':')[0] if k else 'start' for k,b in enumerate(blocks)]
for k,b in enumerate(blocks):
    if 'transfer_from_user' in b and 'call' in b:
        m=re.search(r'(%\S+) = call \{ i64, ptr \} @_ZN14pump_recovered13user_payments18transfer_from_user',b)
        ev=re.findall(re.escape(m.group(1))+r', (\d)',b)
        br=re.findall(r'br i1 \S+, label %(\S+), label %(\S+)',b)
        nxt=names[k+1] if k+1<len(names) else None
        print(f'shape: callblock={names[k]} extracts_in_block={ev} br={br} next={nxt}')
