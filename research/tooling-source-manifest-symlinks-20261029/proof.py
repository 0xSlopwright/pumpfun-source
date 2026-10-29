"""Reject symlinked compiler inputs from the local source manifest.

`scripts/build_source_manifest.py` walks a crate with `Path.rglob`, accepts
`p.is_file()` (which follows symlinks), and returns only `path -> sha256`. A
symlinked `.rs` file inside the crate is therefore reported under its in-repo
path while its bytes come from outside the repository. The resulting record
cannot distinguish a local source from an external file, and a later copy step
would compile the external bytes under the local name.

`build_supported_sbpf_candidate.py` already rejects such entries explicitly.
This packet makes the same contract available for the archived helper without
editing it: the reviewed helper is loaded, its real-repository output is
compared unchanged, and a strict wrapper refuses symlinked inputs or symlinked
ancestors inside the repository.
"""
from pathlib import Path
import gzip
import hashlib
import json
import sys
import types

P = Path(__file__).resolve().parent
REPO = next(
    parent for parent in P.parents
    if (parent / 'evidence/original/pump/deployed.so').is_file()
)
SOURCE = 'scripts/build_source_manifest.py'
LF_SHA256 = '05eb3446b95c0b7b80517fe05a98a9841fa53053fe39ca56fe2659daf6b58df0'
sha = lambda data: hashlib.sha256(data).hexdigest()


def _reviewed(root=REPO):
    path = Path(root) / SOURCE
    raw = path.read_bytes()
    lf = raw.replace(b'\r\n', b'\n')
    forms = {sha(raw), sha(lf), sha(lf.replace(b'\n', b'\r\n'))}
    if LF_SHA256 not in forms:
        raise ValueError('the reviewed source-manifest helper has changed')
    module = types.ModuleType('reviewed_build_source_manifest')
    module.__file__ = str(path)
    exec(compile(lf, str(path), 'exec'), module.__dict__)
    return module


def _plain(path, root):
    """Reject a symlink at `path` or in its ancestry below `root`."""
    path = Path(path)
    root = Path(root).resolve()
    current = path
    while True:
        if current.is_symlink():
            raise ValueError('symlinked compiler input: ' + str(path))
        if current == root:
            break
        current = current.parent
    resolved = path.resolve()
    if not resolved.is_relative_to(root):
        raise ValueError('compiler input resolves outside repository: ' + str(path))
    return resolved


def strict_manifest(module, crate, workspace, repository, extra_inputs=(), cwd=None):
    """The archived inventory, with every reported path checked for symlinks."""
    manifest = module.source_manifest(crate, workspace, repository, extra_inputs, cwd=cwd)
    root = Path(repository).resolve()
    for name in manifest:
        _plain(root / name, root)
    # Extra-input directories are walked by the archived helper; check the
    # supplied roots and every file they add before trusting the key set.
    for extra in extra_inputs:
        extra = Path(extra).resolve()
        _plain(extra, root)
        if extra.is_dir():
            for path in extra.rglob('*'):
                if path.is_file():
                    _plain(path, root)
    return manifest


def check(root=REPO):
    root = Path(root).resolve()
    module = _reviewed(root)
    crate = root / 'programs/pump'
    archived = module.source_manifest(crate, crate, root)
    strict = strict_manifest(module, crate, crate, root)
    assert archived == strict
    assert len(strict) == 65
    symlinks = [name for name in strict if (root / name).is_symlink()]
    assert symlinks == []
    return {
        'scope': 'Review and strict check of the local Pump source manifest; no build.',
        'script': SOURCE,
        'script_sha256': sha((root / SOURCE).read_bytes()),
        'program': 'pump',
        'files': len(strict),
        'symlinks': symlinks,
        'manifest_sha256': hashlib.sha256(
            json.dumps(strict, sort_keys=True, separators=(',', ':')).encode()
        ).hexdigest(),
    }


def seal(packet=P):
    packet = Path(packet)
    report = check(REPO)
    (packet / 'observations.json.gz').write_bytes(
        gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0)
    )
    (packet / 'coverage-delta.json').write_text(
        json.dumps({
            'kind': 'tooling',
            'scope': 'Source-manifest symlink admission; no payload-byte claim.',
            'totals': {'files': report['files'], 'symlinks': len(report['symlinks'])},
        }, indent=2) + '\n'
    )
    inventory = {
        str(path.relative_to(packet)): sha(path.read_bytes())
        for path in sorted(packet.rglob('*'))
        if path.is_file() and path.name != 'manifest.json'
        and '__pycache__' not in path.parts and path.suffix != '.pyc'
    }
    (packet / 'manifest.json').write_text(json.dumps(inventory, indent=2) + '\n')
    return report


if __name__ == '__main__':
    print(json.dumps(seal(), indent=2))
