#!/usr/bin/env python3
"""asm.py m.ll -> prints sell_v2 asm with block labels and insn index"""
import sys,subprocess,os,re
SDK=os.path.expanduser('~/.cache/solana/v1.44/platform-tools')
SYM='_ZN14pump_recovered14pump_recovered7sell_v217hfaf9221fd7330570E'
r=subprocess.run([SDK+'/llvm/bin/llc','-O3','-relocation-model=pic','-mattr=+store-imm,+jmp-ext',sys.argv[1],'-o','-'],capture_output=True,text=True).stdout
i=r.index(SYM+':'); j=r.index('.Lfunc_end',i)
n=0
for l in r[i:j].splitlines():
    s=l.strip()
    if not s: continue
    if re.match(r'^[.\w$]+:',s) or s.startswith('#') and 'bb' in s: print('      '+s); continue
    if s.startswith('.') : continue
    if s.startswith('#'): continue
    print(f'{n:5d} {s}'); n+=1 + (1 if re.search(r'= .*ll$',s) or 'lddw' in s else 0)
