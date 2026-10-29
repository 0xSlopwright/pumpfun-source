#!/usr/bin/env python3
"""Bounded counterexamples for promoted source, actual builds and runtime."""
import gzip, hashlib, importlib.util, json, shutil, tempfile, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('current_mayhem_verifier', HERE / 'verify.py')
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)
ROOT = HERE.parents[1]

def reject(function, message):
    try:
        function()
    except (ValueError, KeyError, StopIteration):
        return
    raise ValueError('counterexample accepted: ' + message)
def write(path, data):
    path.write_text(json.dumps(data, indent=2) + '\n')
def seal(packet):
    files = v.inventory(packet)
    files.pop('manifest.json', None)
    write(packet / 'manifest.json', {'schema': 'MAYHEM_CURRENT_PROMOTION_PACKET_V1', 'files': files})

with tempfile.TemporaryDirectory(prefix='mayhem-current-counterexamples-') as td:
    work = Path(td)
    source = work / 'source'
    shutil.copytree(HERE / 'source', source)
    result = v.verify(ROOT, source)
    if result['fresh_windows_builds'] != 2:
        raise ValueError('positive control missing')
    (source / 'src/unreviewed.rs').write_text('pub const EXTRA: u8 = 1;\n')
    reject(lambda: v.verify(ROOT, source), 'extra maintained source')
    (source / 'src/unreviewed.rs').unlink()
    path = source / 'src/lib.rs'
    original = path.read_bytes()
    path.write_bytes(original + b'\n// changed maintained input\n')
    reject(lambda: v.verify(ROOT, source), 'changed maintained source')
    path.write_bytes(original)
    packet = work / 'packet'
    shutil.copytree(HERE, packet, ignore=shutil.ignore_patterns('__pycache__'))
    selection = v.read(packet / 'selection.json')
    first = packet / selection['builds'][0]['directory']
    candidate = first / 'candidate.so'
    data = candidate.read_bytes()
    candidate.write_bytes(data[:-1] + bytes([data[-1] ^ 1]))
    seal(packet)
    reject(lambda: v.verify(ROOT, source, packet), 'resealed selected ELF')
    candidate.write_bytes(data)
    archive = first / 'build.zip'
    with zipfile.ZipFile(archive) as z:
        members = {name: z.read(name) for name in z.namelist()}
    key = 'build/build/target/launch.json'
    launch = json.loads(members[key])
    launch['target_directory_initially_absent'] = False
    members[key] = (json.dumps(launch, indent=2) + '\n').encode()
    manifest = json.loads(members['MANIFEST.json'])
    manifest[key] = {'bytes': len(members[key]), 'sha256': v.sha(members[key])}
    members['MANIFEST.json'] = (json.dumps(manifest, indent=2) + '\n').encode()
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as z:
        for name, contents in members.items():
            z.writestr(name, contents)
    digest = v.sha(archive.read_bytes())
    selection['builds'][0]['build']['zip_sha256'] = digest
    write(packet / 'selection.json', selection)
    meta = v.read(first / 'github-artifacts.json')
    for row in meta['artifacts']:
        if row['id'] == selection['builds'][0]['build']['artifact_id']:
            row['digest'] = 'sha256:' + digest
    write(first / 'github-artifacts.json', meta)
    seal(packet)
    reject(lambda: v.verify(ROOT, source, packet), 'resealed false empty-target claim')
    shutil.copy2(HERE / selection['builds'][0]['directory'] / 'build.zip', archive)
    shutil.copy2(HERE / selection['builds'][0]['directory'] / 'github-artifacts.json', first / 'github-artifacts.json')
    shutil.copy2(HERE / 'selection.json', packet / 'selection.json')
    runtime = packet / selection['runtime_directory'] / 'buy.json.gz'
    report = v.read(runtime)
    report['cases'][0]['original']['metadata']['logs'].append('counterexample changed raw log')
    runtime.write_bytes(gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0))
    seal(packet)
    reject(lambda: v.verify(ROOT, source, packet), 'resealed changed runtime log')
print('PASS: positive current source plus five bounded counterexamples')
