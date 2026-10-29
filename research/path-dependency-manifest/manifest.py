"""Include in-repository Cargo path dependencies in source manifests.

scripts/build_source_manifest.py hashes the crate tree it is given. A path
dependency that lives elsewhere in the same repository is omitted unless the
caller passes it explicitly. programs/pump-amm depends on
crates/native-transfer-fee, and editing that crate does not change the
archived manifest.
"""
import hashlib
import sys
import tomllib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HELPER = ROOT / 'scripts/build_source_manifest.py'
HELPER_SHA256 = {
    '05eb3446b95c0b7b80517fe05a98a9841fa53053fe39ca56fe2659daf6b58df0',
    '7f08d6cc56ecbee6af624c2ea035bd52573c983d72acda5167e627c5a3a6775f',
}


def require_archived_helper():
    raw = HELPER.read_bytes()
    text = raw.replace(b'\r\n', b'\n')
    forms = {
        hashlib.sha256(text).hexdigest(),
        hashlib.sha256(text.replace(b'\n', b'\r\n')).hexdigest(),
    }
    digest = hashlib.sha256(raw).hexdigest()
    if forms != HELPER_SHA256 or digest not in HELPER_SHA256:
        raise ValueError('The reviewed source-manifest helper has changed')
    if text.decode().count('def source_manifest(') != 1:
        raise ValueError('The archived source_manifest definition is no longer unique')
    return digest


def archived_manifest(*args, **kwargs):
    require_archived_helper()
    sys.path.insert(0, str(ROOT / 'scripts'))
    from build_source_manifest import source_manifest
    return source_manifest(*args, **kwargs)


def _take_paths(table, found):
    if not isinstance(table, dict):
        return
    for name, spec in table.items():
        if isinstance(spec, dict) and isinstance(spec.get('path'), str):
            found.append((name, spec['path']))


def path_dependencies(cargo_toml):
    data = tomllib.loads(Path(cargo_toml).read_text(encoding='utf-8'))
    found = []
    for key in ('dependencies', 'build-dependencies'):
        _take_paths(data.get(key), found)
    target = data.get('target')
    if isinstance(target, dict):
        for body in target.values():
            if isinstance(body, dict):
                _take_paths(body.get('dependencies'), found)
                _take_paths(body.get('build-dependencies'), found)
    return found


def _dependency_crates(start, repository):
    queue = [Path(start).resolve()]
    seen = set()
    crates = []
    while queue:
        crate = queue.pop()
        if crate in seen:
            continue
        seen.add(crate)
        crates.append(crate)
        for _name, raw in path_dependencies(crate / 'Cargo.toml'):
            resolved = (crate / raw).resolve()
            try:
                resolved.relative_to(repository)
            except ValueError as error:
                raise ValueError(f'Path dependency is outside the repository: {raw}') from error
            if not (resolved / 'Cargo.toml').is_file():
                raise ValueError(f'Path dependency does not exist: {raw}')
            queue.append(resolved)
    return crates


def source_manifest(crate, workspace, repository, extra_inputs=(), cwd=None):
    repository = Path(repository).resolve()
    base = archived_manifest(crate, workspace, repository, extra_inputs, cwd=cwd)
    merged = dict(base)
    for dependency in _dependency_crates(crate, repository)[1:]:
        merged.update(archived_manifest(dependency, dependency, repository, cwd=repository))
    return merged
