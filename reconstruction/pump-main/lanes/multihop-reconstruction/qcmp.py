# qcmp.py obj [basehash] : fast: masked hash; if differs, opregs ratio
import sys,difflib,subprocess,hashlib,pickle,os
B='/Users/shawwalters/Documents/Codex/2026-10-24/amm-sell-swarm/infra/sdk-native/rust/lib/rustlib/aarch64-apple-darwin/bin'
o=sys.argv[1]
secs=subprocess.run([B+'/llvm-objdump','-h',o],capture_output=True,text=True).stdout
name=next(l.split()[1] for l in secs.splitlines() if '.text.' in l and '8swap_hop17h' in l and '.rel' not in l)
subprocess.run([B+'/llvm-objcopy','-O','binary','--only-section='+name,o,o+'.bin'],check=True)
raw=open(o+'.bin','rb').read()
def toks(raw):
    i=0;out=[]
    while i<len(raw):
        k=16 if raw[i]==0x18 else 8; t=raw[i:i+k]
        out.append(t[:2] if t[0] in (0x18,0x85) else t); i+=k
    return out
c=toks(raw); h=hashlib.sha1(b''.join(c)).hexdigest()[:10]
if len(sys.argv)>2 and h==sys.argv[2]: print('same',h); sys.exit()
P=os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/multihop-reconstruction/ir/orig_toks.pkl')
if not os.path.exists(P):
    sys.path.insert(0,'/Users/shawwalters/Documents/Codex/2026-10-24/pump-main-swarm/worktrees/restore/reconstruction/harness'); argv=sys.argv; sys.argv=sys.argv[:1]
    import score; W={x['start']:x for x in score.original_windows()}; pickle.dump(toks(W[0x5b3b0]['raw']),open(P,'wb')); sys.argv=argv
ot=pickle.load(open(P,'rb'))
r=difflib.SequenceMatcher(None,[x[:2] for x in ot],[x[:2] for x in c],autojunk=False).ratio()
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); import relocs,json
cl=[relocs.last_ident(x) for x in relocs.calls(o)]; cl=[x for x in cl if x!='abort']
oc=json.load(open(os.path.expanduser('~/.cache/pumpfun-reconstruction/lanes/multihop-reconstruction/ir/orig_calls.json')))
lcs=sum(b.size for b in difflib.SequenceMatcher(None,oc,cl,autojunk=False).get_matching_blocks())
print(f'bytes {len(raw)} opregs {r:.4f} calls {lcs}/{len(cl)} {h}')
