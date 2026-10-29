import subprocess,re
B='/Users/shawwalters/Documents/Codex/2026-10-24/amm-sell-swarm/infra/sdk-native/rust/lib/rustlib/aarch64-apple-darwin/bin'
def calls(o):
    t=subprocess.run([B+'/llvm-objdump','-dr','--no-show-raw-insn',o],capture_output=True,text=True).stdout
    out=[];insec=False;last=None
    for l in t.splitlines():
        if l.startswith('Disassembly of section'): insec=('8swap_hop17h' in l)
        if not insec: continue
        m=re.match(r'^ +(\d+):\s*(.*)',l)
        if m: last=m.group(2); continue
        m=re.match(r'^\s+[0-9a-f]+:\s+R_\w+\s+(\S+)',l)
        if m and last and last.startswith('call'): out.append(m.group(1))
    return out
def last_ident(sym):
    if not sym.startswith('_ZN'): return sym
    i=3; parts=[]
    while i<len(sym) and sym[i]!='E':
        j=i
        while sym[j].isdigit(): j+=1
        n=int(sym[i:j]); parts.append(sym[j:j+n]); i=j+n
    p=[x for x in parts if not re.match(r'h[0-9a-f]{16}$',x)]
    s=p[-1]
    return 'closure' if 'closure' in s else s
def cname(c):
    s=c.split('::')[-1]
    return 'closure' if 'closure' in s else s
