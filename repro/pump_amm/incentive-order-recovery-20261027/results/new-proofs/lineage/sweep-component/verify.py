from pathlib import Path
import argparse,collections,difflib,hashlib,json,sys,types
sys.dont_write_bytecode=True
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def read(p):return json.loads(Path(p).read_bytes())
def inventory(p):return{str(f.relative_to(p)):sha(f)for f in p.rglob('*')if f.is_file()}
def module(path):
 m=types.ModuleType(path.stem);m.__file__=str(path);exec(compile(path.read_bytes(),str(path),'exec'),m.__dict__);return m
def patch(a,b):
 out=''
 for n in sorted(set(inventory(a))|set(inventory(b))):
  aa=(a/n).read_text()if(a/n).exists()else'';bb=(b/n).read_text()if(b/n).exists()else''
  if aa!=bb:out+=''.join(difflib.unified_diff(aa.splitlines(True),bb.splitlines(True),fromfile='a/'+n if(a/n).exists()else'/dev/null',tofile='b/'+n if(b/n).exists()else'/dev/null'))
 return out
def canonical_patch(text):return sorted('--- '+s for s in text.split('--- ')[1:])
def verify(directory):
 P=Path(directory).resolve();manifest=read(P/'manifest.json');assert manifest['files']=={k:v for k,v in inventory(P).items()if k!='manifest.json'}
 assert sha(P/'v2.patch')=='eada9167edc7a3cfcd4dc51e4cbbf0e81f6c16cea12c1926004d4012ae28f019'
 assert sha(P/'sweep.patch')=='f5664fc646c3637a0894ca836c7f5eea70e114fa39c6ccac7977202d138d6845'
 assert sha(P/'combined.patch')=='320b867a3b5053b594824ec02b33c21128fa0449df242eccada3cba56b8404ea'
 assert canonical_patch(patch(P/'base/source',P/'v2/source'))==canonical_patch((P/'v2.patch').read_text())
 assert canonical_patch(patch(P/'v2/source',P/'combined/source'))==canonical_patch((P/'sweep.patch').read_text())
 assert patch(P/'base/source',P/'combined/source')==(P/'combined.patch').read_text()
 expected={'base':'97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643','v2':'7e8e24f0eae087a68b7ff4324aa8dc3903f46a95a7eb041ff01f1b6cadc71ea5','combined':'3f6190cae0e52a583dacddef9f55bc8f1b512489744242e05e0ea3ed8b5d26e4'}
 maps=read(P/'input-maps.json');builds=[]
 for name,digest in expected.items():
  d=P/name;r=read(d/'build-comparison.json');assert sha(d/'candidate.so')==digest==r['comparison']['candidate_sha256']
  assert sha(d/'unstripped.so')==r['archived_unstripped_sha256']==r['unstripped_sha256']
  assert r['returncode']==0 and r['source_unchanged'] and not r['priming']
  assert r['source_sha256']==r['source_after_sha256'] and r['dependency_cache_before']==r['dependency_cache_after']
  assert len(r['source_sha256'])==227 and len(r['dependency_cache_before'])==762
  assert sha(d/'build.log')==r['build_log_sha256'] and 'Compiling pump-amm-recovered'in(d/'build.log').read_text()
  assert sha(d/'dependency-metadata.json')==r['dependency_metadata_sha256'] and sha(d/'dependency-roots.json')==r['dependency_roots_sha256']
  assert set(maps[name])==set(r['source_sha256'])
  for key,h in r['source_sha256'].items():assert sha(P/maps[name][key])==h
  suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in r['source_sha256']if k.endswith(suffix))
  assert inventory(d/'source')=={k[len(prefix):]:h for k,h in r['source_sha256'].items()if k.startswith(prefix)}
  builds.append({'layer':name,'source_inputs':227,'unchanged_dependency_artifacts':762,'seconds':r['seconds']})
 reader=module(P/'elf_reader.py');o=reader.Elf(P/'inputs-sweep/evidence/original/pump_amm/deployed.so');entries=sorted(set(o.entries)|{o.lo});measurements={}
 for name in expected:
  d=P/name;c=reader.Elf(d/'candidate.so');s=reader.Elf(d/'unstripped.so');m=read(d/'measurement.json');assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
  index=collections.defaultdict(list)
  for f in s.funcs:
   start,size=f['start'],f['size'];key=(size,hashlib.sha256(c.normalized[start:start+size]).hexdigest(),json.dumps(c.pattern(start,size),sort_keys=True));index[key].append({'start':start,'name':f['name'],'raw_sha256':hashlib.sha256(c.b[start:start+size]).hexdigest()})
  rows=[]
  for start,end in zip(entries,entries[1:]+[o.hi]):
   matches=index[(end-start,hashlib.sha256(o.normalized[start:end]).hexdigest(),json.dumps(o.pattern(start,end-start),sort_keys=True))]
   rows.append({'start':start,'end':end,'matches':matches,'raw_match':any(x['raw_sha256']==hashlib.sha256(o.b[start:end]).hexdigest()for x in matches)})
  assert rows==m['rows'] and m['candidate_sha256']==sha(d/'candidate.so') and m['symbols_sha256']==sha(d/'unstripped.so')
  assert len(rows)==785 and sum(bool(r['matches'])for r in rows)==m['normalized_matches'] and sum(r['raw_match']for r in rows)==148
  measurements[name]=m
 old={r['start']:r for r in measurements['base']['rows']};new=measurements['combined']['rows']
 gains=[hex(r['start'])for r in new if r['matches']and not old[r['start']]['matches']];losses=[hex(r['start'])for r in new if old[r['start']]['matches']and not r['matches']]
 assert gains==['0xe9b90','0xe9fc0'] and not losses
 assert measurements['base']['normalized_matches']==measurements['v2']['normalized_matches']==651 and measurements['combined']['normalized_matches']==653
 v2=module(P/'verify65.py').verify(P/'inputs-v2',P/'combined/candidate.so',P/'focused65')
 sweep=module(P/'verify_sweep.py').verify(P/'inputs-sweep',P/'combined/candidate.so',P/'sweep254',P/'observe_sweep.py')
 assert v2==read(P/'focused65-verification.json') and sweep==read(P/'sweep254-verification.json')
 sys.path.insert(0,str(P/'independent-review'));independent=module(P/'independent-review/verify.py').verify(P/'inputs-sweep')
 return{'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':expected['combined'],'normalized_matches':653,'raw_matches':148,'gains':gains,'losses':losses,'cases':v2['cases']+sweep['cases'],'signatures':v2['signatures']+sweep['signatures'],'builds':builds,'independent_review':independent,'scope':'Recomputed offline saved evidence. No new runtime execution or identical-source repeat claimed by this verifier.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
