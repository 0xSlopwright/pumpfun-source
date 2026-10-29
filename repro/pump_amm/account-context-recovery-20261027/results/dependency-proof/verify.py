#!/usr/bin/env python3
"""Offline archive/source/lock/build binding for the eight authentic Solana revisions."""
from pathlib import Path,PurePosixPath
import argparse,hashlib,json,tarfile,tomllib
D=Path(__file__).resolve().parent
H=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
J=lambda p:json.loads(Path(p).read_text())
def verify(source,record,proof_root=None,expected_seal=None):
 D=Path(proof_root).resolve() if proof_root is not None else Path(__file__).resolve().parent
 source=Path(source);record=Path(record)
 if expected_seal is not None:assert H(D/'manifest.json')==expected_seal
 seal=J(D/'manifest.json');assert isinstance(seal['files'],dict)
 actual={str(p.relative_to(D))for p in D.rglob('*')if p.is_file()}
 assert actual==set(seal['files'])|{'manifest.json'},('dependency-proof inventory mismatch',actual-set(seal['files'])-{'manifest.json'},set(seal['files'])-actual)
 for name,digest in seal['files'].items():
  rel=PurePosixPath(name);assert not rel.is_absolute() and '..'not in rel.parts and str(rel)==name
  target=D/name;assert not any(p.is_symlink()for p in(target,*target.parents)if p!=D.parent)
  assert H(target)==digest,name
 packages=J(D/'packages.json');assert len(packages)==8
 locked=tomllib.loads((source/'programs/pump-amm/Cargo.lock').read_text())['package'];selected=tomllib.loads((D/'selected.Cargo.lock').read_text())['package'];assert locked==selected
 old=tomllib.loads((D/'baseline.Cargo.lock').read_text())['package'];names={p['name']for p in packages};assert[p for p in old if p['name']not in names]==[p for p in selected if p['name']not in names]
 before=tomllib.loads((D/'baseline.Cargo.toml').read_text());after=tomllib.loads((source/'programs/pump-amm/Cargo.toml').read_text());patch=before.pop('patch');assert patch=={'crates-io':{'solana-pubkey':{'path':'vendor/solana-pubkey'}}}and before==after==tomllib.loads((D/'selected.Cargo.toml').read_text())
 archived=metadata=0;expected={}
 for p in packages:
  nv=p['name']+'-'+p['version'];assert H(D/p['archive'])==p['archive_sha256']==p['index_record']['cksum'];assert(p['index_record']['name'],p['index_record']['vers'])==(p['name'],p['version'])
  entry=next(q for q in selected if q['name']==p['name']);assert(entry['version'],entry['checksum'],entry['source'])==(p['version'],p['archive_sha256'],'registry+https://github.com/rust-lang/crates.io-index')
  found={}
  with tarfile.open(D/p['archive'],'r:gz')as tf:
   for member in tf.getmembers():
    if not member.isfile():continue
    path=PurePosixPath(member.name);assert not path.is_absolute()and '..'not in path.parts;rel=str(path.relative_to(nv));data=tf.extractfile(member).read();digest=hashlib.sha256(data).hexdigest();assert H(D/p['active_root']/rel)==digest;found[rel]=digest
  assert found==p['archived_files'];archived+=len(found)
  manifest=tomllib.loads((D/p['active_root']/'Cargo.toml').read_text());assert(manifest['package']['name'],manifest['package']['version'])==(p['name'],p['version'])
  actual={str(f.relative_to(D/p['active_root'])):H(f)for f in(D/p['active_root']).rglob('*')if f.is_file()};assert actual==found|p['cargo_generated_cache_files']
  for rel,digest in p['cargo_generated_cache_files'].items():assert rel=='.cargo-ok'and json.loads((D/p['active_root']/rel).read_text())=={'v':1};metadata+=1
  for rel,digest in actual.items():expected[nv+'/'+rel]=digest
 assert archived==161 and metadata==8
 r=J(record);assert r['returncode']==0 and not r['priming']and r['source_unchanged']and r['source_sha256']==r['source_after_sha256'];assert r['dependency_cache_before']==r['dependency_cache_after']and len(r['dependency_cache_before'])==732
 suffix='programs/pump-amm/Cargo.toml';roots=[name[:-len(suffix)]for name in r['source_sha256']if name.endswith(suffix)];assert len(roots)==1 and roots[0]
 prefix=roots[0];app={};registry={}
 for name,digest in r['source_sha256'].items():
  if name.startswith(prefix):app[name[len(prefix):]]=digest
  else:
   assert name.count('/registry/src/')==1,name
   tail=name.split('/registry/src/',1)[1].split('/',1)[1];assert tail not in registry;registry[tail]=digest
 assert registry==expected and len(registry)==169;assert len(app)==48 and len(r['source_sha256'])==217
 assert 'Cargo.toml'in app and 'Cargo.lock'in app and 'programs/pump-amm/Cargo.toml'in app
 # Exact local bytes, including relocated profile/lock, are bound by the
 # canonical standalone -> workspace recipe in verify_source_binding.py.
 assert H(D/'builder-executed.py')==r['adapter_sha256'];assert H(D/'base-build-cached.py')==r['base_builder_sha256'];assert H(D/'target-provenance.json')==r['target_provenance_sha256'];assert H(D/'sbpf-archive-provenance.json')==r['sbpf_archive_provenance_sha256']
 assert not J(D/'target-provenance.json')['target_spec_differences']
 sdk=J(D/'sdk-archive.json');assert sdk['sha256']==r['archive_provenance']['sha256']=='6719b889d60677a8a2fcf4c82f68441a1afe0ab093edd2efe9f84a67a808b3e9'
 for m in J(D/'sbpf-archive-provenance.json')['members']:assert r['target_rlib_sha256'][m['member'].removeprefix('./')]==m['sha256']
 tools=J(D/'builder-inputs.json');assert tools['source_scanner_sha256']==H(D/'builder-imports/build_source_manifest.py')and tools['byte_comparator_sha256']==H(D/'builder-imports/compare.py')and tools['elf_analyzer_sha256']==H(D/'builder-imports/analyze.py')
 return{'passed':True,'packages':8,'archive_files_equal_to_active_source':archived,'cargo_metadata_files':metadata,'workspace_inputs_delegated_to_source_recipe':len(app),'canonical_inputs_delegated_to_source_recipe':47,'registry_inputs_bound':len(registry),'total_build_inputs_bound':len(app)+len(registry),'unchanged_dependency_artifacts':len(r['dependency_cache_before']),'candidate_sha256':r['comparison']['candidate_sha256'],'executes_build_or_runtime':False,'sdk_archive_physically_reopened':False}
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--source',type=Path,default=D.parent/'canonical-source');p.add_argument('--build-record',type=Path,default=D.parent/'build/build-comparison.json');p.add_argument('--expected-seal');a=p.parse_args()
 if a.expected_seal:assert H(D/'manifest.json')==a.expected_seal
 manifest=J(D/'manifest.json')
 for name,digest in manifest['files'].items():assert H(D/name)==digest,name
 print(json.dumps(verify(a.source,a.build_record,expected_seal=a.expected_seal),indent=2))
if __name__=='__main__':main()
