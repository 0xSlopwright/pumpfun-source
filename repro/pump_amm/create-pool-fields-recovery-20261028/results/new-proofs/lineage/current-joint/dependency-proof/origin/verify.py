"""Bind the reviewed local fee crate while preserving nine authenticated archives.

The nested base proof remains immutable. This extension proves only the added
local package and the current compilation; it does not authenticate a historical
crate name, workspace layout, or complete original dependency graph.
"""
from pathlib import Path, PurePosixPath
import hashlib
import importlib.util
import json
import tomllib


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def read(path):
    return json.loads(Path(path).read_bytes())


def module(path):
    spec = importlib.util.spec_from_file_location('immutable_dependency_base', path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def lock(path):
    return tomllib.loads(Path(path).read_text())['package']


def remove_native(packages):
    local = [p for p in packages if p['name'] == 'native-transfer-fee']
    assert local == [{'name': 'native-transfer-fee', 'version': '0.1.0'}]
    result = []
    for item in packages:
        if item['name'] == 'native-transfer-fee':
            continue
        item = dict(item)
        if item['name'] == 'pump-amm-recovered':
            assert item['dependencies'].count('native-transfer-fee') == 1
            item['dependencies'] = [d for d in item['dependencies'] if d != 'native-transfer-fee']
        result.append(item)
    return result


def verify(source, record, proof_root=None, expected_seal=None):
    d = Path(proof_root or Path(__file__).resolve().parent).resolve()
    source = Path(source)
    if expected_seal is not None:
        assert sha(d / 'manifest.json') == expected_seal
    manifest = read(d / 'manifest.json')['files']
    actual = {str(p.relative_to(d)) for p in d.rglob('*') if p.is_file()}
    assert actual == set(manifest) | {'manifest.json'}
    for name, digest in manifest.items():
        relative = PurePosixPath(name)
        assert not relative.is_absolute() and '..' not in relative.parts
        path = d / name
        assert not any(p.is_symlink() for p in (path, *path.parents) if p != d.parent)
        assert sha(path) == digest, name

    assert sha(d / 'base/manifest.json') == 'c5cc9e5ee9757b00ef1ce664d73d93875076e49f4ccb8a672ca01626abd819f5'
    assert sha(d / 'reference/build-comparison.json') == '478fa085c0a6fc2ff1cec42e4b58b314cbf86a4c651ba095d8b31689777a48bb'
    base_record = read(d / 'reference/build-comparison.json')
    base = module(d / 'base/verify.py').verify(
        d / 'reference/canonical-source', d / 'reference/build-comparison.json', d / 'base')
    assert base['packages'] == 9 and base['unchanged_dependency_artifacts'] == 762
    assert remove_native(lock(source / 'programs/pump-amm/Cargo.lock')) == lock(
        d / 'reference/canonical-source/programs/pump-amm/Cargo.lock')
    old_manifest = tomllib.loads((d / 'reference/canonical-source/programs/pump-amm/Cargo.toml').read_text())
    current_manifest = tomllib.loads((source / 'programs/pump-amm/Cargo.toml').read_text())
    native_dep = current_manifest['dependencies'].pop('native-transfer-fee')
    assert native_dep == {'path': '../../crates/native-transfer-fee'}
    assert current_manifest == old_manifest

    r = read(record)
    prime = read(d / 'native-prime.json')
    repeat = read(d / 'build-repeat.json')
    old_cache = base_record['dependency_cache_after']
    assert prime['dependency_cache_before'] == old_cache
    added = prime['native_dependency_additions']
    assert len(added) == 3
    assert all(Path(name).name.startswith('libnative_transfer_fee') for name in added)
    assert prime['dependency_cache_after'] == old_cache | added
    assert prime['priming'] and prime['returncode'] == 0 and prime['source_unchanged']
    assert prime['source_sha256'] == prime['source_after_sha256'] == r['source_sha256']
    assert prime['command'][-3:] == ['--package', 'native-transfer-fee', '--verbose']
    assert '--locked' in prime['command'] and '--offline' in prime['command']
    for current in (r, repeat):
        assert current['returncode'] == 0 and not current['priming'] and current['source_unchanged']
        assert current['source_sha256'] == current['source_after_sha256'] == r['source_sha256']
        assert current['dependency_cache_before'] == current['dependency_cache_after'] == old_cache | added
        assert current['adapter_sha256'] == sha(d / 'builder-executed.py')
        assert current['command'][-2:] == ['--locked', '--offline']
        assert current['environment']['CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS'] == ' -Zremap-cwd-prefix='
        for key in ('tool_sha256', 'target_rlib_sha256', 'strip_tool_sha256',
                    'archive_provenance', 'base_builder_sha256', 'target_provenance_sha256',
                    'sbpf_archive_provenance_sha256'):
            assert current[key] == base_record[key], key
    assert repeat['comparison']['candidate_sha256'] == r['comparison']['candidate_sha256']
    assert repeat['unstripped_sha256'] == r['unstripped_sha256']
    assert sha(d / 'native-prime.log') == prime['build_log_sha256']
    assert sha(d / 'build-repeat.log') == repeat['build_log_sha256']
    assert prime['adapter_sha256'] == sha(d / 'builder-executed.py')

    suffix = 'programs/pump-amm/Cargo.toml'
    roots = [name[:-len(suffix)] for name in r['source_sha256'] if name.endswith(suffix)]
    assert len(roots) == 1 and roots[0]
    prefix = roots[0]
    local = {name[len(prefix):]: digest for name, digest in r['source_sha256'].items() if name.startswith(prefix)}
    assert len(local) == 57 and len(r['source_sha256']) == 232
    registry = {}
    for name, digest in r['source_sha256'].items():
        if name.startswith(prefix):
            continue
        assert name.count('/registry/src/') == 1
        tail = name.split('/registry/src/', 1)[1].split('/', 1)[1]
        assert tail not in registry
        registry[tail] = digest
    old_registry = {name.split('/registry/src/', 1)[1].split('/', 1)[1]: digest
                   for name, digest in base_record['source_sha256'].items() if '/registry/src/' in name}
    assert registry == old_registry and len(registry) == 175
    assert local['crates/native-transfer-fee/src/lib.rs'] == sha(source / 'crates/native-transfer-fee/src/lib.rs')
    assert local['crates/native-transfer-fee/Cargo.toml'] == sha(source / 'crates/native-transfer-fee/Cargo.toml')
    meta = read(d / 'dependency-metadata.json')
    assert sha(d / 'dependency-metadata.json') == r['dependency_metadata_sha256']
    package = [p for p in meta['packages'] if p['name'] == 'native-transfer-fee']
    assert len(package) == 1 and package[0] == r['native_package'] == prime['native_package']
    native = package[0]
    assert native['source'] is None and native['version'] == '0.1.0' and not native['dependencies']
    assert native['manifest_path'] == str(Path(r['command'][r['command'].index('--manifest-path') + 1]).parent / 'crates/native-transfer-fee/Cargo.toml')
    for name, digest in added.items():
        assert sha(d / 'native-artifacts' / name) == digest
    for name, digest in prime['native_generated_proof'].items():
        assert sha(d / 'native-artifact-proof' / name) == digest
    return {'passed': True, 'packages': 9, 'local_path_packages': 1,
            'archive_files_equal_to_active_source': base['archive_files_equal_to_active_source'],
            'canonical_inputs_delegated_to_source_recipe': 56,
            'workspace_inputs_delegated_to_source_recipe': 57,
            'registry_inputs_bound': 175, 'total_build_inputs_bound': 232,
            'unchanged_original_dependency_artifacts': 762,
            'new_native_dependency_artifacts': 3, 'unchanged_dependency_artifacts': 765,
            'candidate_sha256': r['comparison']['candidate_sha256'],
            'historical_local_crate_identity_authenticated': False,
            'executes_build_or_runtime': False}
