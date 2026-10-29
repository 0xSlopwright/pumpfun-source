"""Verify saved source-organization, matched-call graph and signed observations; no VM/build."""
from pathlib import Path
import hashlib,json,sys,types,collections,difflib,gzip
P=Path(__file__).resolve().parent;sys.path.insert(0,str(P/'tools'))
from elf_reader import Elf
from source_fields import source_fields
from compare_direct_cached import audit
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def module(name,path):
 m=types.ModuleType(name);m.__file__=str(path);exec(compile(path.read_bytes(),str(path),'exec'),m.__dict__);return m

def verify():
 manifest=json.loads((P/'manifest.json').read_bytes());assert set(manifest)=={str(p.relative_to(P))for p in P.rglob('*')if p.is_file()and p.name not in('manifest.json','verification.json')}
 for path,h in manifest.items():assert sha(P/path)==h,path
 for path,row in json.loads((P/'compression-map.json').read_bytes()).items():assert hashlib.sha256(gzip.decompress((P/row['stored']).read_bytes())).hexdigest()==row['uncompressed_sha256']
 b=json.loads((P/'build/build-comparison.json').read_bytes());assert b['returncode']==0 and b['source_unchanged']and not b['priming'];assert b['source_sha256']==b['source_after_sha256'];assert len(b['source_sha256'])==227 and len(b['dependency_cache_before'])==762 and b['dependency_cache_before']==b['dependency_cache_after']
 for path,h in b['source_sha256'].items():assert sha(P/'build-inputs'/path)==h
 inv=lambda d:{str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()};suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in b['source_sha256']if k.endswith(suffix));assert inv(P/'source/merged')=={k[len(prefix):]:h for k,h in b['source_sha256'].items()if k.startswith(prefix)}
 paths=['programs/pump-amm/src/instructions/swap/buy.rs','programs/pump-amm/src/legacy_buy.rs'];patch=''
 for rel in paths:patch+=''.join(difflib.unified_diff((P/'source/base'/rel).read_text().splitlines(True),(P/'source/merged'/rel).read_text().splitlines(True),fromfile='a/'+rel,tofile='b/'+rel))
 assert patch==(P/'buy-module-merge.patch').read_text();assert {k for k,v in inv(P/'source/merged').items()if inv(P/'source/base').get(k)!=v}==set(paths)
 old=(P/'source/base'/paths[1]).read_text();new=(P/'source/merged'/paths[0]).read_text();assert old[old.index('#[derive(Accounts)]'):]==new[new.index('#[derive(Accounts)]'):];assert new[:new.index('#[derive(Accounts)]')].count('\n')+1==49
 O=Elf(P/'original.so');B=Elf(P/'base-artifacts/unstripped.so');C=Elf(P/'build/artifacts/unstripped.so');cs=Elf(P/'build/artifacts/pump_amm_recovered.so');bs=Elf(P/'base-artifacts/pump_amm_recovered.so');assert sha(P/'build/artifacts/pump_amm_recovered.so')=='8285399ba055ffa964704e1f9919ecbc3f48b7264e12ee7cf46a41e7073a0940'
 def index(E,masked=False):
  ix=collections.defaultdict(list);fm={};keys={}
  for f in E.funcs:
   k=(f['start'],f['size'])
   if k in keys:continue
   code=bytearray(E.normalized[f['start']:f['start']+f['size']])
   if masked:
    for x in source_fields(E,f['start'],f['size']):
     for z in [x['line_store'],x['length_store']]:code[z-f['start']+4:z-f['start']+8]=bytes(4)
   key=(bytes(code),json.dumps(E.pattern(f['start'],f['size']),sort_keys=True));ix[key].append(f);keys[k]=key;fm[f['start']]=f
  return ix,fm,keys
 bi,bf,bk=index(B,True);ci,cf,ck=index(C,True);pairs=[];edges=0
 for f in bf.values():
  options=ci[bk[(f['start'],f['size'])]];assert options
  good=[]
  for g in options:
   bcs=B.callsites(f['start'],f['size']);ccs=C.callsites(g['start'],g['size']);assert len(bcs)==len(ccs)
   ok=True
   for a,z in zip(bcs,ccs):
    x,y=bf.get(a['target']),cf.get(z['target'])
    if a['offset']!=z['offset']or x is None or y is None or bk[(x['start'],x['size'])]!=ck[(y['start'],y['size'])]:ok=False;break
   if ok:good.append(g);edges+=len(bcs)
  assert good;pairs.append({'base':f,'matches':good})
 saved=json.loads((P/'graph-delta.json').read_bytes());assert pairs==saved['pairs']and len(bf)==len(cf)==798 and edges==saved['matching_edge_observations_including_aliases']==12215
 indexes=[]
 for E,S in [(cs,C),(bs,B)]:
  ix=collections.defaultdict(list)
  for f in S.funcs:ix[(f['size'],E.normalized[f['start']:f['start']+f['size']],json.dumps(E.pattern(f['start'],f['size']),sort_keys=True))].append(f)
  indexes.append(ix)
 matched=raw=text=0;gains=[];losses=[];rawloss=[]
 for a,z in zip(O.entries,O.entries[1:]+[O.hi]):
  key=(z-a,O.normalized[a:z],json.dumps(O.pattern(a,z-a),sort_keys=True));now,old=[ix[key]for ix in indexes];matched+=bool(now);text+=(z-a)*bool(now);r=any(O.b[a:z]==cs.b[f['start']:f['start']+z-a]for f in now);raw+=r
  if bool(now)!=bool(old):(gains if now else losses).append(a)
  if any(O.b[a:z]==bs.b[f['start']:f['start']+z-a]for f in old)and not r:rawloss.append(a)
 assert(matched,raw,text)==(656,148,826112)and not gains and not losses and not rawloss
 direct=audit(P/'runtime/standard',sha(P/'build/artifacts/pump_amm_recovered.so'));assert direct['cases']==1297 and not direct['mismatches']
 exact=module('exact',P/'runtime-inputs/exact/verify.py').verify_output(P/'build/artifacts/pump_amm_recovered.so',P/'runtime/exact');assert sum(x['cases']for x in exact['runs'])==319 and exact['signatures_verified']==638
 for row in json.loads((P/'official-upstream-blobs.json').read_bytes()):
  f=P/row['path'];data=f.read_bytes();assert sha(f)==row['sha256']and hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()==row['git_blob_sha1']
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':sha(P/'build/artifacts/pump_amm_recovered.so'),'proposed_source_only':True,'normalized':matched,'raw':raw,'matched_text_bytes':text,'normalized_gains':gains,'normalized_losses':losses,'raw_losses':rawloss,'source_coordinate_equivalent_functions':798,'matching_call_observations_including_aliases':edges,'cases':1616,'verified_signatures':direct['signature_fields']+exact['signatures_verified'],'scope':__doc__}
if __name__=='__main__':print(json.dumps(verify(),indent=2))
