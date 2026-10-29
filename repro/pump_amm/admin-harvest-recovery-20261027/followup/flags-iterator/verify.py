"""Verify a diagnostic flags packet; no compilation or Solana VM execution."""
from pathlib import Path
import hashlib,json,sys,types,collections,difflib
P=Path(__file__).resolve().parent;sys.path.insert(0,str(P/'tools'))
from elf_reader import Elf
from compare_direct_cached import audit
from object_reader import sections

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def load(name,path):
 m=types.ModuleType(name);m.__file__=str(path);exec(compile(path.read_bytes(),str(path),'exec'),m.__dict__);return m

def verify():
 manifest=json.loads((P/'manifest.json').read_bytes());assert set(manifest)=={str(p.relative_to(P))for p in P.rglob('*')if p.is_file()and p.name not in ('manifest.json','verification.json')}
 for path,h in manifest.items():assert sha(P/path)==h,path
 b=json.loads((P/'build/build-comparison.json').read_bytes());assert b['returncode']==0 and b['source_unchanged']and not b['priming'];assert b['source_sha256']==b['source_after_sha256'];assert len(b['source_sha256'])==227 and len(b['dependency_cache_before'])==762 and b['dependency_cache_before']==b['dependency_cache_after']
 for path,h in b['source_sha256'].items():assert sha(P/'build-inputs'/path)==h
 suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in b['source_sha256']if k.endswith(suffix));inv=lambda d:{str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()};assert inv(P/'source/trial')=={k[len(prefix):]:h for k,h in b['source_sha256'].items()if k.startswith(prefix)}
 rel='programs/pump-amm/src/instructions/swap/multi_hop_swap.rs';a=(P/'source/base'/rel).read_text();c=(P/'source/trial'/rel).read_text();patch=''.join(difflib.unified_diff(a.splitlines(True),c.splitlines(True),fromfile='a/'+rel,tofile='b/'+rel));assert patch==(P/'flags-recovery.patch').read_text();assert {k for k,v in inv(P/'source/trial').items()if inv(P/'source/base').get(k)!=v}=={rel}
 O=Elf(P/'original.so');C=Elf(P/'build/artifacts/pump_amm_recovered.so');S=Elf(P/'build/artifacts/unstripped.so');B=Elf(P/'base-artifacts/pump_amm_recovered.so');BS=Elf(P/'base-artifacts/unstripped.so');assert sha(P/'build/artifacts/pump_amm_recovered.so')=='705524b309ed4084e4e403c87ab855c66627aadd90bd20d90f2cc60ba5fb8d63'
 indexes=[]
 for e,s in [(C,S),(B,BS)]:
  ix=collections.defaultdict(list)
  for f in s.funcs:ix[(f['size'],e.normalized[f['start']:f['start']+f['size']],json.dumps(e.pattern(f['start'],f['size']),sort_keys=True))].append(f)
  indexes.append(ix)
 count=raw=text=0;gains=[];losses=[]
 for a,z in zip(O.entries,O.entries[1:]+[O.hi]):
  key=(z-a,O.normalized[a:z],json.dumps(O.pattern(a,z-a),sort_keys=True));now,old=[ix[key]for ix in indexes];count+=bool(now);text+=(z-a)*bool(now);raw+=any(O.b[a:z]==C.b[f['start']:f['start']+z-a]for f in now)
  if bool(now)!=bool(old):(gains if now else losses).append(a)
 assert(count,raw,text)==(656,148,826112)and not gains and not losses
 control=next(s for s in sections(P/'flags.o')if 'tuple_buy17' in s['name']);target=O.normalized[0xfb08:0xfdc8];diff=[i for i in range(0,704,8)if target[i:i+8]!=control['code'][i:i+8]];assert diff==[0x148,0x150,0x158,0x160,0x168,0x170]
 micro=load('micro',P/'verify_flags_model.py').verify();assert micro==json.loads((P/'flags-micro-execution.json').read_bytes())
 runtime=audit(P/'routes',sha(P/'build/artifacts/pump_amm_recovered.so'));assert runtime['cases']==478 and not runtime['mismatches']
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':sha(P/'build/artifacts/pump_amm_recovered.so'),'diagnostic_only':True,'normalized':count,'raw':raw,'matched_text_bytes':text,'normalized_gains':gains,'normalized_losses':losses,'micro_cases':micro['cases'],'runtime':runtime,'scope':__doc__}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
