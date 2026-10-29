#!/usr/bin/env python3
"""Meaningful saved-gate tamper checks, also executable with Python -O."""
from pathlib import Path
import gzip
import hashlib
import importlib.util
import json
import os
import shutil
import tempfile

P = Path(__file__).resolve().parent
ROOT = P.parents[2]


def write(path, raw):
    temporary = path.with_name(path.name + '.replacement')
    temporary.write_bytes(raw)
    temporary.replace(path)


def document(path, value):
    write(path, (json.dumps(value, indent=2) + '\n').encode())


def reseal(path):
    document(path / 'MANIFEST.json', {str(item.relative_to(path)): hashlib.sha256(item.read_bytes()).hexdigest()
             for item in path.rglob('*') if item.is_file() and item.name != 'MANIFEST.json'
             and '__pycache__' not in item.parts})


def check(name, mutate, selector=False):
    with tempfile.TemporaryDirectory() as directory:
        packet = Path(directory) / 'packet'
        shutil.copytree(P, packet, copy_function=os.link, ignore=shutil.ignore_patterns('work', '__pycache__'))
        mutate(packet)
        reseal(packet)
        spec = importlib.util.spec_from_file_location('tampered_amm', packet / 'verify.py')
        verifier = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(verifier)
        source_root = ROOT
        if selector:
            source_root = Path(directory)/'current-source'
            for relative, raw in verifier.archive(packet/'results/build-a/canonical-source.tar.gz').items():
                target = source_root/relative
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(raw)
            original = source_root/'evidence/original/pump_amm/deployed.so'
            original.parent.mkdir(parents=True)
            os.link(ROOT/'evidence/original/pump_amm/deployed.so', original)
            (source_root/'.cargo').mkdir()
            (source_root/'.cargo/config.toml').write_text('[build]\nrustflags = ["-C", "overflow-checks=no"]\n')
            recipe = verifier.module('tampered_mapper', packet/'workspace_recipe.py')
            try:
                recipe.expected_workspace(source_root)
            except RuntimeError:
                pass
            else:
                raise RuntimeError('Ambient compiler config escaped the mapper under -O')
        try:
            verifier.verify(source_root, current_source=True)
        except (RuntimeError, AssertionError, KeyError, ValueError) as error:
            return {'test': name, 'rejected': True, 'reason': str(error)}
        raise RuntimeError('Tamper escaped saved verifier: ' + name)


def mutate_record(packet):
    path = packet / 'results/build-a/build-record.json'
    value = json.loads(path.read_bytes())
    value['source_sha256']['programs/pump-amm/src/lib.rs'] = '0' * 64
    document(path, value)


def mutate_window(packet):
    path = packet / 'results/windows.json'
    value = json.loads(path.read_bytes())
    next(row for row in value if row['original'] == '0x4c750')['match'] = 'invented_exact_match'
    document(path, value)


def mutate_executed_harness(packet):
    path = packet/'results/build-a/harness/build.py'
    write(path, path.read_bytes()+b'\n# changed executed entry point\n')


def mutate_physical_assignment(packet):
    path = packet/'results/r31-physical-closure-audit.json'
    value = json.loads(path.read_bytes())
    keys = list(value['assignment'])
    value['assignment'][keys[0]] = value['assignment'][keys[1]]
    document(path, value)


def mutate_dependency(packet):
    path = packet / 'results/build-a/dependencies.json.gz'
    value = json.loads(gzip.decompress(path.read_bytes()))
    package = value[0]
    source = next(iter(package['active_roots'].values()))
    source[next(iter(package['archive_files']))] = '0' * 64
    write(path, gzip.compress(json.dumps(value).encode(), mtime=0))


def mutate_observation(packet):
    base = packet / 'results/runtime/corpus'
    path = base / 'liquidity.json.gz'
    value = json.loads(gzip.decompress(path.read_bytes()))
    value['cases'][0]['candidate']['__fabricated_field'] = True
    raw = (json.dumps(value) + '\n').encode()
    write(path, gzip.compress(raw, mtime=0))
    progress = json.loads((base/'progress.json').read_bytes())
    next(row for row in progress if row['suite'] == 'liquidity')['receipt_sha256'] = hashlib.sha256(raw).hexdigest()
    document(base/'progress.json', progress)


def mutate_transaction(packet):
    base = packet / 'results/runtime/corpus'
    path = base / 'liquidity-transactions.json.gz'
    value = json.loads(gzip.decompress(path.read_bytes()))
    value['transactions'][0]['all_signatures_verified'] = False
    raw = gzip.compress(json.dumps(value).encode(), mtime=0)
    write(path, raw)
    progress = json.loads((base/'progress.json').read_bytes())
    next(row for row in progress if row['suite'] == 'liquidity')['sidecar_sha256'] = hashlib.sha256(raw).hexdigest()
    document(base/'progress.json', progress)


if __name__ == '__main__':
    results = [check(name, mutate) for name, mutate in [
        ('compiled-source-drift', mutate_record), ('invented-sell-window', mutate_window),
        ('locked-dependency-source-drift', mutate_dependency), ('resealed-runtime-observation', mutate_observation),
        ('resealed-unverified-transaction', mutate_transaction), ('executed-builder-byte-drift', mutate_executed_harness),
        ('noninjective-physical-body-assignment', mutate_physical_assignment)]]
    results.append(check('ambient-compiler-config-injection', lambda packet: None, selector=True))
    print(json.dumps(results, indent=2))
