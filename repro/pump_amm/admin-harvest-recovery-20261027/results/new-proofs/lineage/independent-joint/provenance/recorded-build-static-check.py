"""Verify frozen source, strict build and full normalized-window measurement; no VM execution."""
from pathlib import Path
import collections,difflib,hashlib,json,re,sys
W=Path(__file__).resolve().parent;R=W.parents[1]
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
sha_bytes=lambda b:hashlib.sha256(b).hexdigest()
files=lambda p:{str(f.relative_to(p)):sha(f)for f in sorted(p.rglob('*'))if f.is_file()}
c=json.loads((W/'composition.json').read_text());B=Path(c['base'])
assert files(B/'source')==c['base_source'] and files(W/'source')==c['source']
assert sha(W/'recovery.patch')==c['patch_sha256']
changes={k for k in c['source']if c['source'][k]!=c['base_source'][k]}
assert changes=={'programs/pump-amm/src/create.rs','programs/pump-amm/src/instructions/swap/trade_v2.rs','programs/pump-amm/src/transfer_creator.rs'}
expected_patch=''
for name in sorted(changes):expected_patch+=''.join(difflib.unified_diff((B/'source'/name).read_text().splitlines(True),(W/'source'/name).read_text().splitlines(True),fromfile='a/'+name,tofile='b/'+name))
assert expected_patch==(W/'recovery.patch').read_text()
for patch in c['patches']:assert sha(Path(patch['path']))==patch['sha256']
build=json.loads((W/'build/build-comparison.json').read_text())
assert build['returncode']==0 and build['source_unchanged'] and build['source_sha256']==build['source_after_sha256']
for path,digest in build['source_sha256'].items(): assert sha(R/path)==digest,path
assert build['dependency_cache_before']==build['dependency_cache_after']
assert sha(W/'build/artifacts/unstripped.so')==build['unstripped_sha256']==build['archived_unstripped_sha256']
sys.path.insert(0,str(R/'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf
O=Elf(R/'evidence/original/pump_amm/deployed.so');C=Elf(W/'build/artifacts/unstripped.so')
m=json.loads((W/'measurement.json').read_text());previous=json.loads((B/'measurement.json').read_text())
assert sha(W/'build/artifacts/pump_amm_recovered.so')==m['candidate_sha256']
assert m['symbols_sha256']==sha(W/'build/artifacts/unstripped.so')
assert previous['candidate_sha256']==c['base_candidate_sha256']
assert [(r['start'],r['end'])for r in m['rows']]==list(zip(O.entries,O.entries[1:]+[O.hi]))
index=collections.defaultdict(list)
for f in C.funcs:
 a,n=f['start'],f['size'];index[n,C.normalized[a:a+n],json.dumps(C.pattern(a,n),sort_keys=True)].append(f)
text=norm=raw=0
for row in m['rows']:
 a,n=row['start'],row['end']-row['start'];found=index[n,O.normalized[a:a+n],json.dumps(O.pattern(a,n),sort_keys=True)]
 assert {(f['start'],f['name'])for f in found}=={(f['start'],f['name'])for f in row['matches']}
 direct=any(O.b[a:a+n]==C.b[f['start']:f['start']+n]for f in found);assert direct==row['raw_match']
 for f in row['matches']:assert sha_bytes(C.b[f['start']:f['start']+n])==f['raw_sha256']
 norm+=bool(found);raw+=direct;text+=n*bool(found)
base_elf=Elf(B/'build/artifacts/pump_amm_recovered.so')
for r in previous['rows']:
 a,n=r['start'],r['end']-r['start'];r['raw_match']=any(O.b[a:a+n]==base_elf.b[f['start']:f['start']+n]for f in r['matches'])
old={r['start']:r for r in previous['rows']}
gains=[hex(r['start'])for r in m['rows']if r['matches']and not old[r['start']]['matches']]
losses=[hex(r['start'])for r in m['rows']if not r['matches']and old[r['start']]['matches']]
raw_gains=[hex(r['start'])for r in m['rows']if r['raw_match']and not old[r['start']]['raw_match']]
raw_losses=[hex(r['start'])for r in m['rows']if not r['raw_match']and old[r['start']]['raw_match']]
assert norm==m['normalized_matches']and raw==m['raw_matches']
assert not losses
report={'verified':True,'scope':__doc__,'candidate_sha256':m['candidate_sha256'],'normalized_matches':norm,'raw_matches':raw,'normalized_text_bytes':text,'normalized_gains':gains,'normalized_losses':losses,'raw_gains':raw_gains,'raw_losses':raw_losses,'source_inputs':len(build['source_sha256']),'dependency_artifacts':len(build['dependency_cache_before']),'dependencies_unchanged':True,'runtime_verified':False}
(W/'static-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
