"""Verify the saved refined AMM source and signed evidence without executing a VM."""
from pathlib import Path
import argparse,collections,contextlib,difflib,gzip,hashlib,io,json,sys,types
sys.dont_write_bytecode=True
EXPECTED='58478a978292ea6bc4e6a9776a536f91a9384da7f1f82a2e1f9743659a34b58b'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def inv(p):return {str(f.relative_to(p)):sha(f)for f in p.rglob('*')if f.is_file()}
def read(p):return json.loads(Path(p).read_bytes())
def module(p):
 p=Path(p);m=types.ModuleType('saved_'+p.stem);m.__file__=str(p);exec(compile(p.read_bytes(),str(p),'exec'),m.__dict__);return m
def diff(a,b):
 out=''
 for n in sorted(set(inv(a))|set(inv(b))):
  x,y=a/n,b/n;aa=x.read_text()if x.exists()else'';bb=y.read_text()if y.exists()else''
  if aa!=bb:out+=''.join(difflib.unified_diff(aa.splitlines(True),bb.splitlines(True),fromfile='a/'+n if x.exists()else'/dev/null',tofile='b/'+n if y.exists()else'/dev/null'))
 return out
def verify(directory):
 P=Path(directory).resolve();manifest=read(P/'manifest.json');assert manifest['files']=={k:v for k,v in inv(P).items()if k!='manifest.json'}
 C=P/'build/artifacts/pump_amm_recovered.so';S=C.with_name('unstripped.so');assert sha(C)==EXPECTED
 comp=read(P/'composition-final.json');assert inv(P/'source/final')==comp['final_source_sha256']and inv(P/'source/base')==comp['base_source_sha256']
 assert diff(P/'source/base',P/'source/final')==(P/'aggregate-653.patch').read_text() and sha(P/'aggregate-653.patch')==comp['aggregate_patch_sha256']
 for row in comp['components']:assert sha(P/row['packet']/row['patch_file'])==row['patch_sha256']
 for label in ['build','build-repeat']:
  r=read(P/label/'build-comparison.json');assert r['returncode']==0 and r['source_unchanged']and not r['priming'];assert r['source_sha256']==r['source_after_sha256']and r['dependency_cache_before']==r['dependency_cache_after'];assert len(r['source_sha256'])==227 and len(r['dependency_cache_before'])==762
  for path,h in r['source_sha256'].items():assert sha(P/'build-inputs'/path)==h
  suffix='programs/pump-amm/Cargo.toml';prefix=next(k[:-len(suffix)]for k in r['source_sha256']if k.endswith(suffix));assert inv(P/'source/final')=={k[len(prefix):]:h for k,h in r['source_sha256'].items()if k.startswith(prefix)}
  assert sha(P/label/'build.log')==r['build_log_sha256']and 'Compiling pump-amm-recovered'in(P/label/'build.log').read_text()
  assert sha(P/label/'artifacts/unstripped.so')==r['unstripped_sha256']==r['archived_unstripped_sha256'];assert sha(P/label/'artifacts/pump_amm_recovered.so')==r['comparison']['candidate_sha256']==EXPECTED
  assert sha(P/'build_entrypoint.py')==r['adapter_sha256']and sha(P/'target-provenance.json')==r['target_provenance_sha256']and sha(P/'sbpf-archive-provenance.json')==r['sbpf_archive_provenance_sha256']
 a,b=read(P/'build/build-comparison.json'),read(P/'build-repeat/build-comparison.json');assert a['source_sha256']==b['source_sha256']and a['dependency_cache_before']==b['dependency_cache_before']
 for f in ['pump_amm_recovered.so','unstripped.so']:assert(P/'build/artifacts'/f).read_bytes()==(P/'build-repeat/artifacts'/f).read_bytes()
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
 assert(norm,raw,text)==(656,148,826112)and len(measurement['rows'])==785
 old=read(P/'base/measurement.json');assert old['candidate_sha256']==sha(P/'base/pump_amm_recovered.so')==comp['base_candidate_sha256'];gains=[]
 for x,y in zip(old['rows'],measurement['rows']):
  assert x['start']==y['start']and(not x['matches']or y['matches'])and(not x['raw_match']or y['raw_match'])
  if y['matches']and not x['matches']:gains.append(hex(y['start']))
 assert gains==['0x17960','0x74e30','0xf6eb0']
 static=module(P/'verify_static.py').verify(P/'static-root',C,S);assert static==read(P/'static-verification.json')
 with contextlib.redirect_stdout(io.StringIO()):module(P/'verify_core.py')
 core=read(P/'runtime-verification.json');assert core['core']['cases']==17462 and not core['core']['mismatches']
 extra=module(P/'verify_extras.py').verify();assert extra==read(P/'extras-verification.json')
 targeted={};kits=P/'targeted-kits';T=P/'targeted'
 targeted['initboost']=module(kits/'initboost/verify.py').verify_output(kits/'initboost',C,T/'initboost')
 targeted['disable']=module(kits/'disable/verify.py').verify(C,T/'disable')
 targeted['create']=module(kits/'create/verify_minimum.py').verify(T/'create',C,kits/'create-inputs',kits/'create/probe_minimum.py',kits/'create/observer.py')
 targeted['boost-burn']=module(P/'runtime-inputs/repro/pump_amm/transfer-abi-recovery-20261027/compare_direct_cached.py').audit(T/'boost-burn',EXPECTED)
 assert targeted==read(T/'verification.json')
 cashback=module(P/'cashback24/verify.py').verify(P/'cashback24',C)
 components={}
 for row in comp['components']:
  path=P/row['packet'];m=module(path/'verify.py')
  if row['name']=='create-minimum':value=m.verify(path)
  elif row['name']=='disable-flags':value=m.verify(P/'static-root',P/'base/pump_amm_recovered.so',P/'base/unstripped.so')
  else:value=m.verify(P/'static-root')
  components[row['name']]=value
 assert all(x['returncode']==0 for x in read(P/'acceptance-final.json'))
 assert manifest['files']=={k:v for k,v in inv(P).items()if k!='manifest.json'}
 return {'passed':True,'manifest_sha256':sha(P/'manifest.json'),'candidate_sha256':EXPECTED,'normalized_windows':norm,'raw_windows':raw,'matched_text_bytes':text,'normalized_gains':gains,'normalized_losses':[],'raw_losses':[],'repeat_identical':True,'source_inputs':227,'unchanged_dependencies':762,'core_cases':17462,'supplemental_cases':2811,'targeted_cases':687,'cashback_cases':24,'replayed_cases_including_overlapping_suites':20984,'observed_transactions_including_overlaps':42118,'signature_fields_including_overlaps':42512,'component_verifications':components,'vm_executed_by_verifier':False,'scope':'Full core plus focused and retained signed observations. Broad acceptance payloads are omitted and must be bound separately by the root coordinator; original whole ELF and exhaustive behavior remain unequal or unproved.'}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--directory',type=Path,default=Path(__file__).resolve().parent);a=p.parse_args();print(json.dumps(verify(a.directory),indent=2))
