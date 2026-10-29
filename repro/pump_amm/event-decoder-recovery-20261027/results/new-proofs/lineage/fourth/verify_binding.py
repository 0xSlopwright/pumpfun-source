"""Offline binding of all226 source inputs and nine registry archives."""
from pathlib import Path,PurePosixPath
import hashlib,json,tarfile,tomllib

def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def verify_inputs(directory,expected,mapping):
 d=Path(directory).resolve();assert set(mapping)==set(expected),'input keyset mismatch'
 for name,h in expected.items():
  row=mapping[name];rel=PurePosixPath(row['archive_path']);assert not rel.is_absolute()and '..'not in rel.parts
  p=d/str(rel);assert not p.is_symlink();assert row['sha256']==h==sha(p),name

def verify(directory):
 d=Path(directory).resolve();a=json.loads((d/'build/build-comparison.json').read_bytes());b=json.loads((d/'build-repeat/build-comparison.json').read_bytes());inputs=json.loads((d/'build-input-binding.json').read_bytes())['inputs']
 assert a['returncode']==b['returncode']==0 and not a['priming']and not b['priming']
 assert a['source_sha256']==a['source_after_sha256']==b['source_sha256']==b['source_after_sha256']
 assert a['dependency_cache_before']==a['dependency_cache_after']==b['dependency_cache_before']==b['dependency_cache_after']and len(a['dependency_cache_after'])==762
 verify_inputs(d,a['source_sha256'],inputs)
 local={r['archive_path'][7:]:h for n,h in a['source_sha256'].items()if (r:=inputs[n])['archive_path'].startswith('source/')}
 external={r['archive_path'][18:]:h for n,h in a['source_sha256'].items()if (r:=inputs[n])['archive_path'].startswith('dependency-inputs/')}
 assert len(local)==51 and len(external)==175 and len(inputs)==226
 assert local=={str(p.relative_to(d/'source')):sha(p)for p in(d/'source').rglob('*')if p.is_file()}
 packages=json.loads((d/'dependency-proof/packages.json').read_bytes());assert len(packages)==9
 locked=tomllib.loads((d/'source/Cargo.lock').read_text())['package'];expected={};archive_count=metadata_count=0
 for package in packages:
  nv=package['name']+'-'+package['version'];archive=d/'dependency-proof'/package['archive'];assert sha(archive)==package['archive_sha256']==package['index_record']['cksum']
  p=next(p for p in locked if p['name']==package['name']);assert(p['version'],p['checksum'],p['source'])==(package['version'],package['archive_sha256'],'registry+https://github.com/rust-lang/crates.io-index')
  actual={}
  with tarfile.open(archive,'r:gz')as tf:
   for m in tf.getmembers():
    if not m.isfile():continue
    rel=PurePosixPath(m.name);assert not rel.is_absolute()and '..'not in rel.parts;rel=str(rel.relative_to(nv));actual[rel]=hashlib.sha256(tf.extractfile(m).read()).hexdigest()
  assert actual==package['archived_files'];archive_count+=len(actual)
  for rel,h in actual.items():expected[nv+'/'+rel]=h
  for rel,h in package['cargo_generated_cache_files'].items():
   assert rel=='.cargo-ok'and json.loads((d/'dependency-inputs'/nv/rel).read_bytes())=={'v':1};expected[nv+'/'+rel]=h;metadata_count+=1
 assert external==expected and archive_count==166 and metadata_count==9
 for r,build_dir in [(a,'build'),(b,'build-repeat')]:
  p=d/build_dir
  for name,key in [('build_entrypoint.py','adapter_sha256'),('dependency-proof/base-build-cached.py','base_builder_sha256'),('target-provenance.json','target_provenance_sha256'),('dependency-proof/sbpf-archive-provenance.json','sbpf_archive_provenance_sha256'),('archive-source-proof.json','entrypoint_archive_proof_sha256')]:assert sha(d/name)==r[key]
  for name,key in [('dependency-metadata.json','dependency_metadata_sha256'),('dependency-roots.json','dependency_roots_sha256'),('build.log','build_log_sha256')]:assert sha(p/name)==r[key]
  sdk=json.loads((d/'dependency-proof/sdk-archive.json').read_bytes());assert sdk['sha256']==r['archive_provenance']['sha256']=='6719b889d60677a8a2fcf4c82f68441a1afe0ab093edd2efe9f84a67a808b3e9'
  provenance=json.loads((d/'dependency-proof/sbpf-archive-provenance.json').read_bytes())
  for member in provenance['members']:assert r['target_rlib_sha256'][member['member'].removeprefix('./')]==member['sha256']
  meta=json.loads((p/'dependency-metadata.json').read_bytes());names={q['name']:q['version']for q in packages};assert{q['name']:q['version']for q in meta['packages']if q['name']in names}==names
  roots=json.loads((p/'dependency-roots.json').read_bytes());assert len(roots['roots'])==9 and {Path(x).name for x in roots['roots']}=={q['name']+'-'+q['version']for q in packages}
  assert r['environment']['CARGO_HOME']==roots['logical_cargo_home']==r['logical_cargo_home']and roots['private_cargo_home']==r['private_cargo_home']
  assert r['private_cargo_home']+':'+r['logical_cargo_home']+':rw'in r['command']
  assert sha(p/'artifacts/pump_amm_recovered.so')==r['comparison']['candidate_sha256']and sha(p/'artifacts/unstripped.so')==r['unstripped_sha256']
 tools=json.loads((d/'dependency-proof/builder-inputs.json').read_bytes())
 for name,key in [('build_source_manifest.py','source_scanner_sha256'),('compare.py','byte_comparator_sha256'),('analyze.py','elf_analyzer_sha256')]:assert sha(d/'dependency-proof/builder-imports'/name)==tools[key]
 return {'passed':True,'source_inputs':226,'local_inputs':51,'external_inputs':175,'registry_archives':9,'archived_files':166,'cargo_metadata_files':9,'dependencies_unchanged':762,'strict_builds':2,'sdk_archive_physically_reopened':False}
