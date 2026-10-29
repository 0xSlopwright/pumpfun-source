#!/usr/bin/env python3
"""Resealed source, freshness, runtime and maintained-file counterexamples."""
import gzip, importlib.util, json, shutil, tempfile
from pathlib import Path
HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
spec = importlib.util.spec_from_file_location('admin_wallet_verifier', HERE / 'verify.py')
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)

def require(ok, message):
    if not ok:
        raise ValueError(message)
def reject(function, message):
    try:
        function()
    except ValueError:
        return
    raise ValueError('counterexample accepted: ' + message)
def write(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n')
def reseal(repo):
    packet = repo / v.DIRECTORY
    manifest = v.read(packet / 'manifest.json')
    files = v.scoped_files(repo, manifest['scopes'])
    files.pop(v.DIRECTORY + '/manifest.json', None)
    files.update({name: v.sha(repo / name) for name in manifest['extra_files']})
    manifest['files'] = files
    write(packet / 'manifest.json', manifest)

with tempfile.TemporaryDirectory(prefix='admin-wallet-controls-') as td:
    repo = Path(td)
    manifest = v.read(HERE / 'manifest.json')
    selection = v.read(HERE / 'selection.json')
    paths = set(manifest['files']) | set(selection['dependency_files']) | {v.DIRECTORY + '/manifest.json'}
    for name in paths:
        destination = repo / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / name, destination)
    packet = repo / v.DIRECTORY
    require(v.verify(repo)['fresh_builds'] == 2, 'positive proof did not pass')
    extra = packet / 'source/src/extra.rs'
    extra.write_text('pub const EXTRA: u8 = 1;\n')
    reseal(repo)
    reject(lambda: v.verify(repo), 'extra resealed compiler source')
    extra.unlink()
    source = packet / 'source/src/creator/admin_cto.rs'
    original_source = source.read_bytes()
    source.write_bytes(original_source + b'\n// changed source\n')
    reseal(repo)
    reject(lambda: v.verify(repo), 'changed resealed compiler source')
    source.write_bytes(original_source)
    cold_path = repo / selection['cold_directory'] / 'build-comparison.json'
    cold_bytes = cold_path.read_bytes()
    cold = v.read(cold_path)
    cold['target_existed_before'] = True
    write(cold_path, cold)
    reseal(repo)
    reject(lambda: v.verify(repo), 'false empty-target provenance')
    cold_path.write_bytes(cold_bytes)
    witnesses_path = repo / selection['witnesses']
    witness_bytes = witnesses_path.read_bytes()
    witnesses = v.read(witnesses_path)
    witnesses['cases'][0]['candidate']['logs'].append('Program log: counterexample changed Source record')
    witnesses_path.write_bytes(gzip.compress(json.dumps(witnesses, separators=(',', ':')).encode(), mtime=0))
    runtime_path = packet / 'runtime-verification.json'
    runtime_bytes = runtime_path.read_bytes()
    runtime = v.read(runtime_path)
    runtime['input_sha256'][selection['witnesses']] = v.sha(witnesses_path)
    write(runtime_path, runtime)
    reseal(repo)
    reject(lambda: v.verify(repo), 'resealed false strict-program-message parity')
    witnesses_path.write_bytes(witness_bytes)
    runtime_path.write_bytes(runtime_bytes)
    reseal(repo)
    canonical = repo / 'programs/pump/src/creator/admin_cto.rs'
    canonical.parent.mkdir(parents=True, exist_ok=True)
    canonical.write_bytes(original_source)
    require(v.verify(repo, check_canonical_admin=True)['canonical_admin_checked'], 'positive maintained admin binding missing')
    canonical.write_bytes(original_source + b'\n// drift\n')
    reject(lambda: v.verify(repo, check_canonical_admin=True), 'maintained admin-file drift')
print('PASS: positive relocated proof and five resealed/drift counterexamples')
