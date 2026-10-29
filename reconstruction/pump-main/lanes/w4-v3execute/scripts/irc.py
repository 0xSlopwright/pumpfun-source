#!/usr/bin/env python3
"""irc.py file.ll [name]: llc reduced IR, diff v3_execute_buy vs original window (normalized)."""
import sys,subprocess,re,os,difflib
SDK=os.path.expanduser('~/.cache/solana/v1.44/platform-tools/llvm/bin/')
OUT=os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/w4-v3execute')
ORIG='/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/w4-v3execute/reconstruction/base/original.so'
SYM='_ZN14pump_recovered5trade14v3_execute_buy17h66a4a2076c16dbefE'
def norm(txt):
    r=[]
    for l in txt.splitlines():
        m=re.match(r'^\s*([0-9a-f]+):\s+(.*)$',l)
        if not m: continue
        s=re.sub(r'\s*<[^>]*>','',m.group(2)).strip()
        s=re.sub(r'call -?0x[0-9a-f]+','call X',s); s=re.sub(r'lddw (r\d+), -?0x[0-9a-f]+',r'lddw \1, X',s)
        r.append(s)
    return r
def dis(path,a,b): return subprocess.run([SDK+'llvm-objdump','-d','--no-show-raw-insn',f'--start-address={a}',f'--stop-address={b}',path],capture_output=True,text=True).stdout
def origlist():
    p=OUT+'/orig.txt'
    if not os.path.exists(p): open(p,'w').write('\n'.join(norm(dis(ORIG,0x83c00,0x84970))))
    return open(p).read().splitlines()
def candlist(obj,sym=SYM):
    for l in subprocess.run([SDK+'llvm-readelf','-sW',obj],capture_output=True,text=True).stdout.splitlines():
        f=l.split()
        if len(f)>=8 and '14v3_execute_buy17h' in f[7] and 'trade' in f[7]: a,n=int(f[1],16),int(f[2]); return norm(dis(obj,hex(a),hex(a+n)))
def main():
    ll=sys.argv[1]; obj=ll[:-3]+'.o'
    r=subprocess.run([SDK+'llc','-O3','-relocation-model=pic','-mattr=+store-imm,+jmp-ext',ll,'-filetype=obj','-o',obj]+sys.argv[2:],capture_output=True,text=True)
    if r.returncode: print(r.stderr[-3000:]); sys.exit(1)
    o=origlist(); c=candlist(obj)
    sm=difflib.SequenceMatcher(None,o,c,autojunk=False)
    diff=list(difflib.unified_diff(o,c,'orig','cand',n=1,lineterm=''))
    nd=sum(1 for l in diff if l[:1] in '+-' and l[:3] not in('+++','---'))
    print(f'{ll}: orig={len(o)*8}B cand={len(c)*8}B difflines={nd} ratio={sm.ratio():.4f}')
    if os.environ.get('Q')!='1': print('\n'.join(diff[:200]))
main()
