from pathlib import Path
import collections,difflib,hashlib,importlib.util,json,sys
P=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def load(p):return json.loads(p.read_bytes())
def files(p):return{str(f.relative_to(p)):sha(f)for f in p.rglob('*')if f.is_file()}
manifest=load(P/'manifest.json')['files'];assert files(P)=={**manifest,'manifest.json':sha(P/'manifest.json')}
base=files(P/'source/base');fixed=files(P/'source/fixed');changed=[p for p in base.keys()|fixed.keys()if base.get(p)!=fixed.get(p)];assert changed==['programs/pump-amm/src/create.rs']
p=changed[0];before=(P/'source/base'/p).read_text();after=(P/'source/fixed'/p).read_text();assert after==before.replace('_ => Err(std::io::Error::new(\n                    std::io::ErrorKind::InvalidData,\n                    format!("Invalid bool representation: {}", a[0]),','value => Err(std::io::Error::new(\n                    std::io::ErrorKind::InvalidData,\n                    format!("Invalid bool representation: {}", value),')
assert ''.join(difflib.unified_diff(before.splitlines(True),after.splitlines(True),fromfile='a/'+p,tofile='b/'+p))==(P/'recovery.patch').read_text()
records=[]
for stage in ['build-strict','build-repeat']:
 b=load(P/stage/'build-comparison.json');assert b['returncode']==0 and b['source_unchanged'] and b['source_sha256']==b['source_after_sha256'] and b['dependency_cache_before']==b['dependency_cache_after'];assert len(b['source_sha256'])==227 and len(b['dependency_cache_before'])==762
 for rel,digest in b['source_sha256'].items():assert sha(P/'build-inputs'/rel)==digest
 assert sha(P/stage/'build.log')==b['build_log_sha256'];assert sha(P/stage/'artifacts/unstripped.so')==b['unstripped_sha256'];records.append(b)
for name in ['unstripped.so','pump_amm_recovered.so']:assert(P/'build-strict/artifacts'/name).read_bytes()==(P/'build-repeat/artifacts'/name).read_bytes()
first=load(P/'failed-first-strict/build-attempt.json');assert first['returncode']==0 and first['source_unchanged'];assert len(first['dependency_cache_after'])-len(first['dependency_cache_before'])==30;assert all(first['dependency_cache_after'].get(k)==v for k,v in first['dependency_cache_before'].items());assert 'Dependency artifact content changed during strict rebuild'in(P/'failed-first-strict/driver.log').read_text()
sys.path.insert(0,str(P/'reader'));from elf_reader import Elf
original=Elf(P/'input-root/evidence/original/pump_amm/deployed.so');symbols=Elf(P/'build-strict/artifacts/unstripped.so');candidate=P/'build-strict/artifacts/pump_amm_recovered.so';m=load(P/'measurement.json');assert sha(candidate)==m['candidate_sha256'];assert sha(P/'build-strict/artifacts/unstripped.so')==m['symbols_sha256']
index=collections.defaultdict(list)
for f in symbols.funcs:
 a,n=f['start'],f['size'];index[n,symbols.normalized[a:a+n],json.dumps(symbols.pattern(a,n),sort_keys=True)].append(f)
assert[(r['start'],r['end'])for r in m['rows']]==list(zip(original.entries,original.entries[1:]+[original.hi]));norm=raw=0
for row in m['rows']:
 a,n=row['start'],row['end']-row['start'];found=index[n,original.normalized[a:a+n],json.dumps(original.pattern(a,n),sort_keys=True)];assert{(f['start'],f['name'])for f in found}=={(f['start'],f['name'])for f in row['matches']};norm+=bool(found);raw+=any(original.b[a:a+n]==symbols.b[f['start']:f['start']+n]for f in found)
assert(norm,raw)==(646,148)
old=load(P/'baseline/measurement.json');assert old['candidate_sha256']==sha(P/'baseline/candidate.so');gained=[a['start']for a,b in zip(m['rows'],old['rows'])if a['matches']and not b['matches']];assert gained==[0x6f4b0,0xe7648,0xe7d88];assert all(a['matches']or not b['matches']for a,b in zip(m['rows'],old['rows']))
for rel,digest in load(P/'bound-runtime-inputs.json').items():assert sha(P/'input-root'/rel)==digest
spec=importlib.util.spec_from_file_location('optional_saved',P/'verify_optional.py');v=importlib.util.module_from_spec(spec);spec.loader.exec_module(v);runtime=v.verify(P,candidate,P/'input-root');assert runtime==load(P/'optional-verification.json')
print(json.dumps({'passed':True,'normalized':norm,'raw':raw,'gained':[hex(a)for a in gained],'cases':572,'signatures':1144,'source_inputs':227,'unchanged_dependencies':762,'repeat_equal':True,'full_corpus_executed':False}))
