import json,subprocess,sys,os
so=sys.argv[1]; SDK=os.path.expanduser('~/.cache/solana/v1.44/platform-tools/llvm/bin/')
d=json.load(open('out/v4s/score.json')); syms=d['windows'][str(0xa868)]['symbols']
tab={}
for l in subprocess.run([SDK+'llvm-readelf','-sW',so],capture_output=True,text=True).stdout.splitlines():
    f=l.split()
    if len(f)>=8 and f[3]=='FUNC': tab.setdefault(f[7],int(f[1],16))
addr2={v:k for k,v in tab.items()}
for s in syms:
    a=tab[s]
    out=subprocess.run([SDK+'llvm-objdump','-d','--no-show-raw-insn',f'--start-address={a}',f'--stop-address={a+24}',so],capture_output=True,text=True).stdout
    cl=[l for l in out.splitlines() if 'call' in l][0]
    off=int(cl.split('call')[1].split()[0],16)
    if off>=1<<31: off-=1<<32
    tgt=a+16+off*8
    print(hex(a), hex(off), hex(tgt), addr2.get(tgt,'?')[:90])
