#!/usr/bin/env python3
"""Offline Cargo cache preparation that keeps each sparse index with its archive.

The archived helper checksum-checks crate files, then copies whichever index
sorts first. This entry point uses the index stored beside the archive whose
bytes match the lockfile checksum.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import tomllib

NAMESPACES = ['index.crates.io-6f17d22bba15001f', 'index.crates.io-1949cf8c6b5b557f']


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def index_path(name):
    if len(name) == 1:
        return '1/' + name
    if len(name) == 2:
        return '2/' + name
    if len(name) == 3:
        return '3/' + name[0] + '/' + name
    return name[:2] + '/' + name[2:4] + '/' + name


def matching_pairs(source, filename, checksum, relative):
    pairs = []
    for archive in sorted((source / 'cache').glob('*/' + filename)):
        if sha256(archive) != checksum:
            continue
        index = source / 'index' / archive.parent.name / '.cache' / relative
        if index.is_file():
            pairs.append((archive, index))
    return pairs


def choose_pair(pairs):
    # Keep the historical preference for the 1949 namespace when that
    # namespace's own archive matches. Do not borrow its index otherwise.
    return sorted(pairs, key=lambda item: ('1949cf8' not in item[0].parent.name, str(item[0])))[0]


def prepare(lockfile, output, cargo_home):
    source = Path(cargo_home) / 'registry'
    output = Path(output).resolve()
    output.mkdir(parents=True, exist_ok=False)
    raw_lock = Path(lockfile).read_bytes()
    lock = tomllib.loads(raw_lock.decode())
    records = []
    for package in lock['package']:
        if not package.get('source', '').startswith('registry+'):
            continue
        name, version = package['name'], package['version']
        filename = f'{name}-{version}.crate'
        relative = index_path(name)
        pairs = matching_pairs(source, filename, package['checksum'], relative)
        if not pairs:
            verified = [path for path in (source / 'cache').glob('*/' + filename)
                        if sha256(path) == package['checksum']]
            if verified:
                raise RuntimeError(f'Checksum-verified archive has no colocated sparse index: {filename}')
            raise RuntimeError(f'No checksum-verified cached archive: {filename}')
        archive, index = choose_pair(pairs)
        for namespace in NAMESPACES:
            archive_target = output / 'registry/cache' / namespace / filename
            index_target = output / 'registry/index' / namespace / '.cache' / relative
            archive_target.parent.mkdir(parents=True, exist_ok=True)
            index_target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(archive, archive_target)
            shutil.copyfile(index, index_target)
        records.append({'package': name, 'version': version,
                        'archive_sha256': package['checksum'],
                        'index_sha256': sha256(index),
                        'source_namespace': archive.parent.name})
    config = None
    if records:
        configs = [source / 'index' / namespace / 'config.json'
                   for namespace in reversed(NAMESPACES)
                   if (source / 'index' / namespace / 'config.json').is_file()]
        if not configs:
            raise RuntimeError('No local crates.io registry configuration')
        config = configs[0]
        for namespace in NAMESPACES:
            shutil.copyfile(config, output / 'registry/index' / namespace / 'config.json')
    manifest = {'scope': 'Existing local archives verified against a fixed Cargo.lock; no network download.',
                'lockfile_sha256': hashlib.sha256(raw_lock).hexdigest(),
                'registry_config_sha256': sha256(config) if config is not None else None,
                'packages': records}
    (output / 'cache-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lockfile', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    cargo_home = Path(os.environ.get('CARGO_HOME') or Path.home() / '.cargo').expanduser()
    manifest = prepare(args.lockfile, args.output, cargo_home)
    print(f'Prepared {len(manifest["packages"])} checksum-verified packages in {args.output.resolve()}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
