"""Verify the saved final event/quote checkpoint without executing a VM."""
from pathlib import Path
import argparse,collections,contextlib,difflib,gzip,hashlib,io,json,sys,types
sys.dont_write_bytecode=True
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inv(d):return{str(p.relative_to(d)):sha(p)for p in d.rglob('*')if p.is_file()}
def read(p):return json.loads(Path(p).read_bytes())
def module(p):
 p=Path(p);m=types.ModuleType('saved_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def diff(a,b):
 out=''
 for n in sorted(set(inv(a))|set(inv(b))):
  x,y=a/n,b/n;aa=x.read_text()if x.exists()else'';bb=y.read_text()if y.exists()else''
  if aa!=bb:out+=''.join(difflib.unified_diff(aa.splitlines(True),bb.splitlines(True),fromfile='a/'+n if x.exists()else'/dev/null',tofile='b/'+n if y.exists()else'/dev/null'))
 return out
def canonical(text):return sorted('--- '+s for s in text.split('--- ')[1:])
def verify(directory):
 P=Path(directory).resolve();manifest=read(P/'manifest.json');assert manifest['files']=={k:v for k,v in inv(P).items()if k!='manifest.json'}
 C=P/'build/artifacts/pump_amm_recovered.so';S=C.with_name('unstripped.so');expected='4e6a5617a7a8c3474ed7662f0188df4b1824c08253ebfb08212351ca5249da12';assert sha(C)==expected
 comp=read(P/'composition.json');assert inv(P/'source/final')==comp['source_sha256']and inv(P/'source/intermediate')==comp['base_source_sha256']
 assert diff(P/'source/base',P/'source/final')==(P/'aggregate-651.patch').read_text()and sha(P/'aggregate-651.patch')==comp['aggregate_651_patch_sha256']=='cab28b4e71f4389a78fc4e320f8010a1b58c212c8b4ea12bb59b58e04628187f'
 assert diff(P/'source/intermediate',P/'source/final')==(P/'combined.patch').read_text()and sha(P/'combined.patch')==comp['combined_patch_sha256']=='228cc53c9c780e5e3db85db9520222ae99bfde3a51cd0d4996b76059d0d03f74'
 patches=[('v2.patch','eada9167edc7a3cfcd4dc51e4cbbf0e81f6c16cea12c1926004d4012ae28f019'),('sweep.patch','f5664fc646c3637a0894ca836c7f5eea70e114fa39c6ccac7977202d138d6845'),('sweep-event.patch','774d2cf2bbd2a6760f3999cd9ff0683c95b9e410a4c55ab50f0784f076aa4b1a'),('events.patch','e7e1d899af3b6016354fd894268edd1d390890e55182c97aefd7b88677426041'),('quote.patch','72f28f892d9fb5caa1a0b6519c37726b45a5d6f318d41baa7af3a34b28d68dfd')]
 for name,h in patches:assert sha(P/name)==h
 # File-section ordering is irrelevant; every source hunk remains literal.
 assert canonical(diff(P/'source/base',P/'source/intermediate'))==canonical((P/'v2.patch').read_text()+(P/'sweep.patch').read_text())
 for label in['build','build-repeat']:
  r=read(P/label/'build-comparison.json');assert r['returncode']==0 and r['source_unchanged']and not r['priming'];assert r['source_sha256']==r['source_after_sha256']and r['dependency_cache_before']==r['dependency_cache_after'];assert len(r['source_sha256'])==227 and len(r['dependency_cache_before'])==762
  for path,h in r['source_sha256'].items():assert sha(P/'build-inputs'/path)==h
  suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in r['source_sha256']if k.endswith(suffix));assert inv(P/'source/final')=={k[len(prefix):]:h for k,h in r['source_sha256'].items()if k.startswith(prefix)}
  assert sha(P/label/'build.log')==r['build_log_sha256']and'Compiling pump-amm-recovered'in(P/label/'build.log').read_text()
  assert sha(P/label/'artifacts/unstripped.so')==r['unstripped_sha256']==r['archived_unstripped_sha256'];assert sha(P/label/'artifacts/pump_amm_recovered.so')==r['comparison']['candidate_sha256']==expected
  assert sha(P/'build_entrypoint.py')==r['adapter_sha256']and sha(P/'target-provenance.json')==r['target_provenance_sha256']and sha(P/'sbpf-archive-provenance.json')==r['sbpf_archive_provenance_sha256']
 a,b=read(P/'build/build-comparison.json'),read(P/'build-repeat/build-comparison.json');assert a['source_sha256']==b['source_sha256']and a['dependency_cache_before']==b['dependency_cache_before']
 for f in['pump_amm_recovered.so','unstripped.so']:assert(P/'build/artifacts'/f).read_bytes()==(P/'build-repeat/artifacts'/f).read_bytes()
 for original,data in read(P/'compression-map.json').items():
  stored=P/data['stored'];assert not(P/original).exists()and sha(stored)==data['stored_sha256']and hashlib.sha256(gzip.decompress(stored.read_bytes())).hexdigest()==data['original_sha256']
 reader=module(P/'static-tool/elf_reader.py');o=reader.Elf(P/'runtime-inputs/evidence/original/pump_amm/deployed.so');c=reader.Elf(C);s=reader.Elf(S);assert c.b[c.lo:c.hi]==s.b[s.lo:s.hi]
 index=collections.defaultdict(list)
 for f in s.funcs:
  p,n=f['start'],f['size'];index[n,c.normalized[p:p+n],json.dumps(c.pattern(p,n),sort_keys=True)].append(f)
 measurement=read(P/'measurement.json');norm=raw=text=0
 assert [(x['start'],x['end'])for x in measurement['rows']]==list(zip(o.entries,o.entries[1:]+[o.hi]))
 for row in measurement['rows']:
  p,n=row['start'],row['end']-row['start'];found=index[n,o.normalized[p:p+n],json.dumps(o.pattern(p,n),sort_keys=True)];assert{(f['start'],f['name'])for f in found}=={(f['start'],f['name'])for f in row['matches']};matched=any(o.b[p:p+n]==c.b[f['start']:f['start']+n]for f in found);assert matched==row['raw_match'];norm+=bool(found);raw+=matched;text+=n*bool(found)
  for f in row['matches']:assert hashlib.sha256(c.b[f['start']:f['start']+n]).hexdigest()==f['raw_sha256']
 assert(norm,raw,text)==(653,148,818944)and len(measurement['rows'])==785
 old=read(P/'base/measurement.json');assert old['candidate_sha256']==sha(P/'base/pump_amm_recovered.so')==comp['aggregate_base_candidate_sha256'];gains=[]
 for x,y in zip(old['rows'],measurement['rows']):
  assert x['start']==y['start']and(not x['matches']or y['matches'])and(not x['raw_match']or y['raw_match'])
  if y['matches']and not x['matches']:gains.append(hex(y['start']))
 assert gains==['0xe9b90','0xe9fc0']
 # These functions read only packet-local files and the packet-local static root.
 review=module(P/'independent-review/verify.py').verify(P/'static-root')
 with contextlib.redirect_stdout(io.StringIO()):module(P/'verify_runtime.py')
 core=read(P/'runtime-verification.json');assert core['core']['cases']==17462 and not core['core']['mismatches']
 extra=module(P/'verify_extras.py').verify();assert extra==read(P/'extras-verification.json')
 assert manifest['files']=={k:v for k,v in inv(P).items()if k!='manifest.json'}
 return{'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':expected,'normalized_windows':norm,'raw_windows':raw,'matched_text_bytes':text,'normalized_gains':gains,'normalized_losses':[],'raw_losses':[],'repeat_identical':True,'source_inputs':227,'unchanged_dependencies':762,'core_cases':17462,'supplemental_cases':2811,'total_cases':20273,'observed_transactions':40696,'signature_fields':41084,'independent_static':review,'vm_executed_by_verifier':False}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
