"""Authenticate actual native cold-build evidence; no ordinary-build relabeling."""
from pathlib import Path
import gzip
import hashlib
import json
import tarfile

sha = lambda b: hashlib.sha256(b).hexdigest()
CONTROL_STRIP = '199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473'
CONTROL_SYMBOLS = '49df399b8a36a0a60de03e8d55f1417261dc451e44845ca9d17a94040968c680'
CONTROL_RECEIPT = '0a095b85caf5d3726c393b6a7a77890121ad52eebe45a8da4c725af6818efa61'
CHANGES = {
    'control': None,
    'perhop': ('programs/pump/src/multi_hop_curve_swap.rs', '734bdae1189dd4e4f54a27fd215624611228f36b92d3877b63f00df19ccc9e44'),
    'constructor': ('programs/pump/src/create_v2.rs', '8cf97e31c958609aa5bbc07e2d4fb092fc980f724d4054d24af2163241e7a931'),
    'perhop-clock': ('programs/pump/src/multi_hop_curve_swap.rs', '5871a2cf35ebe0db502eb242db0f1652ef93e51e4971e56483016d900349ac2b'),
}


def read(p):
    return json.loads(p.read_bytes())


def source_map(record):
    result = {}
    for path, digest in record['source_sha256'].items():
        assert '/source/' in path, path
        relative = path.split('/source/', 1)[1]
        assert relative not in result and not relative.startswith('/') and '..' not in Path(relative).parts
        result[relative] = digest
    assert len(result) == 66
    return result


def primary_map(record):
    values = record['primary_source_sha256']
    lock, = [name for name in values if name.endswith('/Cargo.lock')]
    prefix = lock[:-len('Cargo.lock')]
    result = {}
    for name, digest in values.items():
        assert name.startswith(prefix)
        relative = name[len(prefix):]
        assert relative and '..' not in Path(relative).parts and relative not in result
        result[relative] = digest
    assert len(result) == 65
    return result


def registry_shape(record):
    return {
        'archives': {name: value['sha256'] for name, value in record['locked_registry_archives'].items()},
        'sources': {Path(name).name: value for name, value in record['actual_registry_source_files'].items()},
        'files_checked': record['files_checked'],
    }


def authenticate(directory):
    directory = Path(directory).resolve()
    manifest = read(directory / 'MANIFEST.json')
    for name, digest in manifest.items():
        relative = Path(name)
        assert not relative.is_absolute() and '..' not in relative.parts
        path = directory / relative
        assert path.resolve().is_relative_to(directory) and not path.is_symlink()
        assert sha(path.read_bytes()) == digest, name
    record = read(directory / 'build-attempt.json')
    assert record == read(directory / 'build-comparison.json')
    assert record['cold_empty_target'] is True and record['target_existed_before'] is False
    assert record['returncode'] == 0
    for field in ['source_unchanged', 'tools_unchanged', 'sdk_rust_libraries_unchanged',
                  'registry_sources_unchanged', 'target_libraries_unchanged', 'workspace_layout']:
        assert record[field] is True, field
    assert record['source_sha256'] == record['source_after_sha256']
    assert record['primary_source_sha256'] == record['primary_source_after_sha256']
    assert len(record['primary_source_sha256']) == 65
    sources = source_map(record)
    with tarfile.open(directory / 'compiled-source.tar.gz') as archive:
        members = archive.getmembers()
        assert len(members) == 66 and all(m.isfile() for m in members)
        actual = {m.name: sha(archive.extractfile(m).read()) for m in members}
        assert actual == sources
    log = gzip.decompress((directory / 'build.log.gz').read_bytes())
    assert sha(log) == record['build_log_sha256']
    assert b'Compiling pump-token-ext ' in log and b'Compiling pump-recovered ' in log
    assert sha((directory / 'executed-builder.py').read_bytes()) == record['builder_sha256']
    assert sha((directory / 'registry-authentication.json').read_bytes()) == record['registry_authentication_sha256']
    assert record['target_library_profile']['native_host_files_unchanged'] is True
    assert len(record['tool_sha256']) == 5 and len(record['target_libraries_sha256']) == 25
    for flag in ['--locked', '--offline', '--release', '--target', 'sbpf-solana-solana']:
        assert flag in record['command'], flag
    image = (directory / 'candidate.so').read_bytes()
    symbols = (directory / 'unstripped.so').read_bytes()
    result = read(directory / 'RESULT.json')
    assert sha(image) == result['candidate_sha256'] == record['comparison']['candidate_sha256']
    assert sha(symbols) == result['unstripped_sha256'] == record['unstripped_sha256']
    return record, sources, result


def bind(control_dir, candidate_dir, kind):
    assert kind in CHANGES
    control_dir, candidate_dir = Path(control_dir).resolve(), Path(candidate_dir).resolve()
    assert sha((control_dir / 'build-attempt.json').read_bytes()) == CONTROL_RECEIPT
    control, sources, control_result = authenticate(control_dir)
    assert control_result['candidate_sha256'] == CONTROL_STRIP
    assert control_result['unstripped_sha256'] == CONTROL_SYMBOLS
    candidate, compiled, result = authenticate(candidate_dir)
    expected = dict(sources)
    primary = primary_map(control)
    change = CHANGES[kind]
    if change:
        path, digest = change
        standalone_path = path.removeprefix('programs/pump/')
        assert path in expected and standalone_path in primary
        expected[path] = primary[standalone_path] = digest
    assert compiled == expected
    assert primary_map(candidate) == primary
    for key in ['tool_sha256', 'sdk_rust_libraries_sha256', 'target_libraries_sha256',
                'source_wrapper_sha256']:
        assert candidate[key] == control[key], key
    assert registry_shape(read(candidate_dir / 'registry-authentication.json')) == registry_shape(read(control_dir / 'registry-authentication.json'))
    return {'kind': kind, 'candidate_sha256': result['candidate_sha256'],
            'unstripped_sha256': result['unstripped_sha256'],
            'candidate_build_receipt_sha256': sha((candidate_dir / 'build-attempt.json').read_bytes()),
            'control_build_receipt_sha256': CONTROL_RECEIPT,
            'source_files_verified': 66, 'standalone_source_files_verified': 65,
            'both_local_compilations_in_cold_log': True,
            'tool_library_registry_receipts_equal_control': True,
            'candidate_directory': str(candidate_dir), 'control_directory': str(control_dir)}
