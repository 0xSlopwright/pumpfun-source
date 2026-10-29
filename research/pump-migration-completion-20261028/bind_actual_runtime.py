#!/usr/bin/env python3
"""Bind unchanged runtime harnesses to actual new compiler receipts and archive.

The two JSON envelopes written here are runtime adapters, not compiler receipts.
The actual successful compiler receipt remains unchanged and hash-bound.
"""
import argparse, hashlib, json, sys, tarfile
from pathlib import Path
P = Path(__file__).resolve().parent
ROOT = P.parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_source_manifest import source_manifest
from compare import compare

def require(ok, message):
    if not ok:
        raise ValueError(message)
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def inventory(path):
    return {p.relative_to(path).as_posix(): sha(p) for p in path.rglob('*') if p.is_file() and '__pycache__' not in p.parts}
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('name')
    a = parser.parse_args()
    directory = P / a.name
    receipt_path = directory / 'build-receipt.json'
    receipt = json.loads(receipt_path.read_text())
    require(receipt['ok'] and receipt['runtime_valid'], 'actual compiler did not succeed')
    require(receipt['source_before'] == receipt['source_after'] and receipt['registry_unchanged'] and
        receipt['target_libraries_unchanged'] and receipt['external_dependencies_unchanged'] and
        receipt['tools_before'] == receipt['tools_after'], 'actual build inputs changed')
    require(receipt['fresh_local_compilations'] == {'pump-recovered': 1, 'pump-token-ext': 1}, 'local compilation missing')
    snapshot = P / (a.name + '-source')
    require(inventory(snapshot) == receipt['source_before'], 'retained standalone snapshot differs from actual inputs')
    archive_path = directory / 'compiled-workspace.tar.gz'
    raw = {}
    with tarfile.open(archive_path, 'r:gz') as archive:
        for member in archive:
            require(member.isfile() and member.name not in raw and not member.name.startswith('/') and '..' not in Path(member.name).parts, 'unsafe actual source archive')
            raw[member.name] = archive.extractfile(member).read()
    require({name: hashlib.sha256(data).hexdigest() for name, data in raw.items()} == receipt['compiled_workspace_inputs'], 'actual compiler archive binding differs')
    # Reconstruct only the executed manifest split from the retained source
    # bytes. Runtime source files are materialized from the actual archive.
    manifest = (snapshot / 'Cargo.toml').read_text()
    profile_start, workspace_start = manifest.index('[profile.release]'), manifest.index('[workspace]')
    require(profile_start < workspace_start and not manifest[workspace_start + len('[workspace]'):].strip(), 'unexpected executed staging layout')
    expected = {'programs/pump/' + name: (snapshot / name).read_bytes() for name in receipt['source_before'] if name not in ['Cargo.toml', 'Cargo.lock']}
    expected['programs/pump/Cargo.toml'] = (manifest[:profile_start].rstrip() + '\n').encode()
    expected['Cargo.toml'] = ('[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n' + manifest[profile_start:workspace_start].strip() + '\n').encode()
    expected['Cargo.lock'] = (snapshot / 'Cargo.lock').read_bytes()
    require(raw == expected, 'actual source archive does not equal the executed standalone-to-workspace transform')
    compiled = directory / 'compiled'
    if compiled.exists():
        require(inventory(compiled) == receipt['compiled_workspace_inputs'] and
            not (directory / 'build-comparison.json').exists() and not (directory / 'build-attempt.json').exists(),
            'existing materialization or runtime binding differs')
    else:
        for name, data in raw.items():
            path = compiled / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
    candidate = directory / 'candidate.so'
    require(sha(candidate) == receipt['candidate_sha256'], 'actual compiler image differs')
    mapping = source_manifest(compiled / 'programs/pump', compiled, ROOT, cwd=compiled)
    require(mapping == {str((compiled / name).relative_to(ROOT)): hashlib.sha256(data).hexdigest() for name, data in raw.items()}, 'runtime source scanner differs from actual compiler input set')
    comparison = compare((ROOT / 'evidence/original/pump/deployed.so').read_bytes(), candidate.read_bytes())
    envelope = {'schema': 'ACTUAL_NEW_BUILD_RUNTIME_BINDING_ENVELOPE_V1',
        'scope': __doc__, 'returncode': 0, 'source_unchanged': True,
        'returncode_derivation': 'Actual executed-fastbuild.build reports ok=true only after its Cargo subprocess returned0.',
        'actual_compiler_receipt': {'path': str(receipt_path.relative_to(ROOT)), 'sha256': sha(receipt_path)},
        'actual_compiled_workspace_archive': {'path': str(archive_path.relative_to(ROOT)), 'sha256': sha(archive_path)},
        'runtime_adapter': {'path': str(Path(__file__).relative_to(ROOT)), 'sha256': sha(Path(__file__))},
        'standalone_snapshot': {'path': str(snapshot.relative_to(ROOT)), 'actual_input_hashes': receipt['source_before']},
        'source_sha256': mapping, 'source_after_sha256': mapping, 'comparison': comparison,
        'compiler_or_target_executed_by_adapter': False, 'old_compiler_receipt_reused_or_relabelled': False}
    for name in ['build-comparison.json', 'build-attempt.json']:
        path = directory / name
        require(not path.exists(), 'runtime binding envelope exists')
        path.write_text(json.dumps({**envelope, 'runtime_binding_role': name}, indent=2) + '\n')
    print(json.dumps({'status': 'ACTUAL_COMPILER_INPUTS_BOUND_FOR_UNCHANGED_RUNTIME', 'source_files': len(mapping), 'candidate_sha256': sha(candidate), 'compiler_receipt_sha256': sha(receipt_path)}, indent=2))
if __name__ == '__main__':
    main()
