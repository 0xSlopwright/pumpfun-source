"""Versioned native-artifact reuse proof for the H16 root-only change.

The immutable H15 prime is checked against its own source and build record.
Current H16 source/metadata are independently bound; the H15 prime is never
presented as a compilation of H16's changed root program.
"""
from pathlib import Path,PurePosixPath
import hashlib,importlib.util,json,tomllib
def h(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def j(p):return json.loads(Path(p).read_bytes())
def module(p):
 s=importlib.util.spec_from_file_location('native_origin_proof',p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
def local_external(record):
 suffix='programs/pump-amm/Cargo.toml';roots=[n[:-len(suffix)]for n in record['source_sha256']if n.endswith(suffix)];assert len(roots)==1
 prefix=roots[0];local={n[len(prefix):]:v for n,v in record['source_sha256'].items()if n.startswith(prefix)}
 external={n.split('/registry/src/',1)[1].split('/',1)[1]:v for n,v in record['source_sha256'].items()if not n.startswith(prefix)}
 assert len(local)==57 and len(external)==175 and len(record['source_sha256'])==232
 return local,external
def normalized_native(package):
 value=json.loads(json.dumps(package));value.pop('id');value.pop('manifest_path')
 for target in value['targets']:target.pop('src_path')
 return value
def verify(source,record,proof_root=None,expected_seal=None):
 d=Path(proof_root or Path(__file__).resolve().parent).resolve();source=Path(source)
 if expected_seal is not None:assert h(d/'manifest.json')==expected_seal
 manifest=j(d/'manifest.json')['files'];assert set(manifest)|{'manifest.json'}=={str(p.relative_to(d))for p in d.rglob('*')if p.is_file()}
 for name,digest in manifest.items():
  rel=PurePosixPath(name);assert not rel.is_absolute()and'..'not in rel.parts;assert h(d/name)==digest
 assert h(d/'origin/manifest.json')=='3280ffe1a2d13987c669119899b13a4a8a84f9ff2aaf80585eba4fdc6f6add82'
 origin=module(d/'origin/verify.py').verify(d/'origin-source',d/'origin-build.json',d/'origin')
 old=j(d/'origin-build.json');r=j(record);repeat=j(d/'build-repeat.json')
 assert r==j(d/'current-build.json')
 old_local,old_external=local_external(old);current_local,current_external=local_external(r)
 assert current_external==old_external
 assert set(current_local)==set(old_local)
 changes=[n for n in current_local if current_local[n]!=old_local[n]]
 assert set(changes)=={'programs/pump-amm/src/incentives.rs','programs/pump-amm/src/instructions/create_pool.rs'}
 native={n:v for n,v in old_local.items()if n.startswith('crates/native-transfer-fee/')}
 assert len(native)==2
 assert {str(p.relative_to(source)):h(p)for p in(source/'crates/native-transfer-fee').rglob('*')if p.is_file()}==native
 for n,v in native.items():assert current_local[n]==v
 for n in['Cargo.toml','Cargo.lock','programs/pump-amm/Cargo.toml','crates/native-transfer-fee/Cargo.toml']:
  assert current_local[n]==old_local[n]
 # The canonical manifest/lock are copied separately from workspace profiles.
 assert (source/'programs/pump-amm/Cargo.toml').read_bytes()==(d/'origin-source/programs/pump-amm/Cargo.toml').read_bytes()
 assert (source/'programs/pump-amm/Cargo.lock').read_bytes()==(d/'origin-source/programs/pump-amm/Cargo.lock').read_bytes()
 assert old['dependency_cache_after']==r['dependency_cache_before']==r['dependency_cache_after']==repeat['dependency_cache_before']==repeat['dependency_cache_after']
 assert len(r['dependency_cache_after'])==765
 assert repeat['source_sha256']==repeat['source_after_sha256']==r['source_sha256']==r['source_after_sha256']
 assert r['native_package']==repeat['native_package']
 assert normalized_native(r['native_package'])==normalized_native(old['native_package'])
 for current,metadata,log in[(r,'dependency-metadata.json','build.log'),(repeat,'repeat-dependency-metadata.json','build-repeat.log')]:
  assert current['returncode']==0 and current['source_unchanged']and not current['priming']
  assert h(d/log)==current['build_log_sha256']
  assert h(d/metadata)==current['dependency_metadata_sha256']
  m=j(d/metadata);native_packages=[p for p in m['packages']if p['name']=='native-transfer-fee'];assert native_packages==[current['native_package']]
  assert current['command'][-2:]==['--locked','--offline']
  assert current['adapter_sha256']==old['adapter_sha256']==h(d/'builder-executed.py')
  for key in['tool_sha256','target_rlib_sha256','strip_tool_sha256','archive_provenance','base_builder_sha256','target_provenance_sha256','sbpf_archive_provenance_sha256','environment']:
   assert current[key]==old[key],key
 assert r['comparison']['candidate_sha256']==repeat['comparison']['candidate_sha256']
 assert r['unstripped_sha256']==repeat['unstripped_sha256']
 # Source binding still consumes the unmodified H12 archive inventory at /base.
 assert h(d/'base/manifest.json')==h(d/'origin/base/manifest.json')
 for name,digest in j(d/'base/manifest.json')['files'].items():assert h(d/'base'/name)==digest
 return {'passed':True,'packages':9,'local_path_packages':1,'archive_files_equal_to_active_source':origin['archive_files_equal_to_active_source'],
  'canonical_inputs_delegated_to_source_recipe':56,'workspace_inputs_delegated_to_source_recipe':57,
  'registry_inputs_bound':175,'total_build_inputs_bound':232,'unchanged_original_dependency_artifacts':762,
  'new_native_dependency_artifacts':0,'reused_native_dependency_artifacts':3,'unchanged_dependency_artifacts':765,
  'candidate_sha256':r['comparison']['candidate_sha256'],'native_compilation_origin_candidate_sha256':old['comparison']['candidate_sha256'],
  'native_prime_relabelled_as_current':False,'root_only_changed_inputs':sorted(changes),
  'historical_local_crate_identity_authenticated':False,'executes_build_or_runtime':False}
