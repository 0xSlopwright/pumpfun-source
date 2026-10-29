from pathlib import Path
import argparse,collections,hashlib,json,struct,sys,types
sys.dont_write_bytecode=True
W=Path(__file__).resolve().parent
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def module(p):
 m=types.ModuleType(p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def verify(root):
 assert json.loads((W/'manifest.json').read_bytes())['files']=={str(p.relative_to(W)):sha(p)for p in W.rglob('*')if p.is_file()and p!=W/'manifest.json'}
 E=module(W/'elf_reader.py').Elf;original=Path(root)/'evidence/original/pump_amm/deployed.so';assert sha(original)=='6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
 cp=W/'build/artifacts/pump_amm_recovered.so';sp=cp.with_name('unstripped.so');bp=W/'baseline/pump_amm_recovered.so';bsp=bp.with_name('unstripped.so');assert sha(cp)=='e9cdacc2f4cb8eaa22aef2f27bd68e9af61134de7b0b62970de1b9adc58ce4c0'and sha(bp)=='4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12'
 o,c,s,b,bs=map(E,[original,cp,sp,bp,bsp]);fs={f['start']:f for f in s.funcs};f=next(f for f in s.funcs if 'instructions5boost7execute' in f['name']);assert f['size']==3888
 oc=o.callsites(0x1ef90,3912);cc=c.callsites(f['start'],3888);assert len(oc)==len(cc)==19;matched=0
 for i,(x,y)in enumerate(zip(oc,cc)):
  assert y['offset']==x['offset']-(0 if i<4 else 16 if i==18 else 24)
  t=x['target'];n=o.entries[o.entries.index(t)+1]-t;g=fs[y['target']];equal=n==g['size']and o.normalized[t:t+n]==c.normalized[g['start']:g['start']+n]and o.pattern(t,n)==c.pattern(g['start'],n)
  assert equal or i==3;matched+=equal
 assert matched==18
 # Each AccountInfo contains two Rc fields; strong/weak decrement branches
 # appear after the transfer and before the reserve reload in both bodies.
 for e,a,lo,hi in [(o,0x1ef90,oc[4]['offset'],oc[5]['offset']),(c,f['start'],cc[4]['offset'],cc[5]['offset'])]:
  ops=[struct.unpack_from('<BBhi',e.b,a+i)for i in range(lo,hi,8)];assert sum(op==0x07 and imm==-1 for op,rr,off,imm in ops)==8
  before=[struct.unpack_from('<BBhi',e.b,a+i)for i in range(oc[3]['offset'],lo,8)];assert any(op==0x79 and rr>>4==8 and off==72 for op,rr,off,imm in before)
 # Independent whole-window recount against frozen4e6a.
 indexes=[]
 for e,sy in [(c,s),(b,bs)]:
  ix=collections.defaultdict(list)
  for g in sy.funcs:ix[(g['size'],e.normalized[g['start']:g['start']+g['size']],json.dumps(e.pattern(g['start'],g['size']),sort_keys=True))].append(g)
  indexes.append(ix)
 normal=raw=0;loss=[];gain=[]
 for a,z in zip(o.entries,o.entries[1:]+[o.hi]):
  key=(z-a,o.normalized[a:z],json.dumps(o.pattern(a,z-a),sort_keys=True));now,old=[ix[key]for ix in indexes];normal+=bool(now);raw+=any(o.b[a:z]==c.b[g['start']:g['start']+z-a]for g in now)
  if old and not now:loss.append(a)
  if now and not old:gain.append(a)
 assert(normal,raw)==(653,148)and not loss and not gain
 # Bind only the actual local compiled inputs; external archives remain under
 # the independently authenticated nine-root checkpoint gate.
 r=json.loads((W/'build/build-comparison.json').read_bytes());suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in r['source_sha256']if k.endswith(suffix));local={k[len(prefix):]:v for k,v in r['source_sha256'].items()if k.startswith(prefix)};assert local=={str(p.relative_to(W/'source')):sha(p)for p in(W/'source').rglob('*')if p.is_file()}and len(local)==52
 assert r['source_sha256']==r['source_after_sha256']and len(r['source_sha256'])==227 and r['source_unchanged']and r['returncode']==0 and r['dependency_cache_before']==r['dependency_cache_after']and len(r['dependency_cache_before'])==762
 old={str(p.relative_to(W/'baseline-source')):sha(p)for p in(W/'baseline-source').rglob('*')if p.is_file()};assert{k for k in local if old[k]!=local[k]}=={'programs/pump-amm/src/instructions/boost.rs'}
 runtime=module(W/'runtime-kit/verify.py').verify_output(W/'runtime-kit',cp,W/'runtime13');assert runtime['cases']==13 and runtime['signatures']==26
 return{'passed':True,'manifest_sha256':sha(W/'manifest.json'),'candidate_sha256':sha(cp),'patch_sha256':sha(W/'recovery.patch'),'windows':653,'raw':148,'window_gains':0,'window_losses':0,'original_handler_bytes':3912,'baseline_handler_bytes':3224,'candidate_handler_bytes':3888,'actual_direct_calls':19,'complete_matching_callee_occurrences':18,'runtime':runtime,'scope':'Unselected source-structure trial. Two temporary AccountInfos drop before reserve reload; inline signer-seed construction. Remaining24-byte/register layout gap is open. No full handler or whole-program equality claim.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--root',type=Path,required=True);a=p.parse_args();print(json.dumps(verify(a.root),indent=2))
