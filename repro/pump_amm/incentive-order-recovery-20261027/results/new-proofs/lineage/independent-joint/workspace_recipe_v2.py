#!/usr/bin/env python3
"""Materialize standalone AMM inputs as a real workspace without changing Rust.

Only AMM's empty [workspace], profile-table placement and Cargo.lock location
change. The repository's existing workspace and other programs are never read
as Cargo inputs or modified. Build/toolchain/runtime authenticity is a separate
checkpoint responsibility; verify-build binds the recorded inputs and outputs.
"""
from pathlib import Path, PurePosixPath
import argparse
import hashlib
import json
import re
import shutil
import tomllib

CRATE = 'programs/pump-amm'
CONFIGS = ('.cargo/config', '.cargo/config.toml', 'rust-toolchain', 'rust-toolchain.toml')
SCHEMA = 'amm-standalone-to-workspace-v2'


def digest(data):
    return hashlib.sha256(data).hexdigest()


def checked_file(root, relative):
    name = PurePosixPath(relative)
    assert not name.is_absolute() and '..' not in name.parts and str(name) == relative
    path = root / relative
    for part in (path, *path.parents):
        if part == root.parent:
            break
        assert not part.is_symlink(), relative
    assert path.is_file(), relative
    return path


def source_inputs(source_root):
    root = Path(source_root).resolve()
    crate = root / CRATE
    assert crate.is_dir() and not crate.is_symlink()
    paths = set()
    for path in crate.rglob('*'):
        rel = path.relative_to(crate)
        if {'target', '.git'}.intersection(rel.parts):
            continue
        assert not path.is_symlink(), str(path)
        if path.is_file() and (path.suffix == '.rs' or path.name in ('Cargo.toml', 'Cargo.lock')):
            paths.add(path)
    paths.update((crate / 'idls').glob('**/*.json'))
    # This is the same explicitly retained extra-input tree used by the AMM
    # source manifest, even when Cargo resolves the registry Pubkey crate.
    vendor = crate / 'vendor/solana-pubkey'
    if vendor.exists():
        paths.update(path for path in vendor.rglob('*') if path.is_file()
                     and not {'target', '.git'}.intersection(path.relative_to(vendor).parts))
    selectors = set()
    for start in (root, crate):
        for directory in (start, *start.parents):
            selectors.update(directory / name for name in CONFIGS if (directory / name).exists())
            if directory == root:
                break
    # Moving Cargo's invocation directory changes config discovery. The current
    # recipe has no ambient selectors; new ones require an explicitly reviewed
    # extension rather than being silently copied or applied twice.
    assert not selectors, ('Ambient Cargo/toolchain configuration requires a reviewed recipe',
                           sorted(str(path) for path in selectors))
    result = {str(path.relative_to(root)): checked_file(root, str(path.relative_to(root))).read_bytes()
              for path in sorted(paths)}
    assert CRATE + '/Cargo.toml' in result and CRATE + '/Cargo.lock' in result
    return result


def transform_manifest(raw):
    text = raw.decode('utf-8')
    before = tomllib.loads(text)
    assert before.get('workspace') == {}, 'AMM must be a standalone, empty workspace'
    assert 'release' in before.get('profile', {}), 'Release profile is required'
    headings = list(re.finditer(r'(?m)^\[([^\[\]\n]+)\][ \t]*(?:#[^\n]*)?\r?\n', text))
    assert headings
    kept = [text[:headings[0].start()]]
    profiles = []
    workspace_sections = 0
    for i, heading in enumerate(headings):
        block = text[heading.start():headings[i+1].start() if i+1 < len(headings) else len(text)]
        name = heading.group(1).strip()
        if name == 'workspace':
            workspace_sections += 1
        elif name.startswith('profile.'):
            profiles.append(block.rstrip() + '\n')
        else:
            kept.append(block)
    assert workspace_sections == 1 and profiles
    crate = (''.join(kept).rstrip() + '\n').encode()
    workspace = ('[workspace]\nmembers = ["programs/pump-amm"]\nresolver = "2"\n\n'
                 + '\n'.join(profiles)).encode()
    remaining = dict(before)
    remaining.pop('workspace')
    profile = remaining.pop('profile')
    assert tomllib.loads(crate.decode()) == remaining
    document = tomllib.loads(workspace.decode())
    assert document['profile'] == profile
    assert document['workspace'] == {'members': [CRATE], 'resolver': '2'}
    return crate, workspace


def expected_workspace(source_root):
    inputs = source_inputs(source_root)
    crate, workspace = transform_manifest(inputs[CRATE + '/Cargo.toml'])
    files = dict(inputs)
    files[CRATE + '/Cargo.toml'] = crate
    files['Cargo.toml'] = workspace
    files['Cargo.lock'] = files.pop(CRATE + '/Cargo.lock')
    return inputs, files


def file_inventory(workspace):
    root = Path(workspace).resolve()
    paths = []
    for path in root.rglob('*'):
        relative = path.relative_to(root)
        if {'target', '.git'}.intersection(relative.parts):
            continue
        assert not path.is_symlink(), str(relative)
        if path.is_file():
            paths.append(str(relative))
    return {name: checked_file(root, name).read_bytes() for name in sorted(paths)}


def verify_workspace(source_root, workspace):
    inputs, expected = expected_workspace(source_root)
    actual = file_inventory(workspace)
    assert set(actual) == set(expected), ('workspace inventory', sorted(set(actual)-set(expected)),
                                         sorted(set(expected)-set(actual)))
    for name, data in expected.items():
        assert actual[name] == data, ('workspace input changed', name)
    rust = [name for name in inputs if name.endswith('.rs')]
    assert all(actual[name] == inputs[name] for name in rust)
    return {'schema': SCHEMA, 'verified': True, 'standalone_inputs': len(inputs),
            'workspace_inputs': len(expected), 'unchanged_rust_files': len(rust),
            'input_sha256': {name: digest(data) for name, data in sorted(inputs.items())},
            'workspace_sha256': {name: digest(data) for name, data in sorted(expected.items())},
            'rust_transformations': 0}


def stage(source_root, output):
    source_root, output = Path(source_root).resolve(), Path(output).absolute()
    assert not output.exists() and not output.is_symlink(), 'Output must be a new directory'
    assert not output.is_relative_to(source_root / CRATE)
    inputs, files = expected_workspace(source_root)
    output.mkdir(parents=True)
    for name, data in sorted(files.items()):
        target = output / name
        target.parent.mkdir(parents=True, exist_ok=True)
        original = source_root / name
        if name in inputs and data == inputs[name]:
            shutil.copy2(original, target)
        elif name == 'Cargo.lock':
            shutil.copy2(source_root / CRATE / 'Cargo.lock', target)
        else:
            target.write_bytes(data)
    return verify_workspace(source_root, output)


def verify_build(source_root, workspace, build_record, candidate, symbols, repository_root=None,
                 external_inputs=None):
    report = verify_workspace(source_root, workspace)
    record = json.loads(Path(build_record).read_bytes())
    assert record['returncode'] == 0 and record['source_unchanged'] is True
    recorded = record['source_sha256']
    assert recorded == record['source_after_sha256']
    suffix = CRATE + '/Cargo.toml'
    matches = [name for name in recorded if name.endswith(suffix)]
    assert len(matches) == 1
    prefix = matches[0][:-len(suffix)]
    assert prefix, 'Expected an explicitly materialized workspace prefix'
    local = {name[len(prefix):]: value for name, value in recorded.items() if name.startswith(prefix)}
    assert local == report['workspace_sha256'], 'Compiled local inputs differ from current canonical recipe'
    external = {name: value for name, value in recorded.items() if not name.startswith(prefix)}
    repository = Path(repository_root or source_root).resolve()
    if external_inputs is None:
        mode = 'recorded_repository_paths'
        mapped = {name: checked_file(repository, name) for name in external}
    else:
        mode = 'explicit_archived_mapping'
        assert isinstance(external_inputs, dict), 'External mapping must be a dictionary'
        assert set(external_inputs) == set(external), (
            'External mapping keys differ from recorded inputs',
            sorted(set(external_inputs) - set(external)),
            sorted(set(external) - set(external_inputs)))
        mapped = {}
        for name, value in external_inputs.items():
            path = Path(value)
            assert '..' not in path.parts, ('Noncanonical archive path', name)
            assert not path.is_symlink(), ('Archived input must be an ordinary file', name)
            # Resolve the explicit archive path once. System directory aliases
            # (for example macOS /var) do not weaken the required content hash.
            path = path.resolve(strict=True)
            assert path.is_file(), ('Missing archived input', name)
            mapped[name] = path
    for name, expected in external.items():
        assert digest(mapped[name].read_bytes()) == expected, ('External input changed', name)
    assert digest(Path(candidate).read_bytes()) == record['comparison']['candidate_sha256']
    assert digest(Path(symbols).read_bytes()) == record['unstripped_sha256']
    report.update(compiled_inputs_verified=True, external_inputs_verified=len(external),
                  external_input_mode=mode,
                  candidate_sha256=record['comparison']['candidate_sha256'],
                  symbols_sha256=record['unstripped_sha256'],
                  new_compiler_executions=0, new_target_executions=0,
                  toolchain_and_runtime_scope='Checked separately by the sealed checkpoint verifiers')
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    create = commands.add_parser('stage')
    create.add_argument('--source-root', type=Path, required=True)
    create.add_argument('--output', type=Path, required=True)
    check = commands.add_parser('verify')
    check.add_argument('--source-root', type=Path, required=True)
    check.add_argument('--workspace', type=Path, required=True)
    check.add_argument('--build-record', type=Path)
    check.add_argument('--candidate', type=Path)
    check.add_argument('--symbols', type=Path)
    check.add_argument('--repository-root', type=Path)
    args = parser.parse_args()
    if args.command == 'stage':
        result = stage(args.source_root, args.output)
    elif args.build_record:
        assert args.candidate and args.symbols, 'Build verification requires both artifacts'
        result = verify_build(args.source_root, args.workspace, args.build_record,
                              args.candidate, args.symbols, args.repository_root)
    else:
        assert not args.candidate and not args.symbols and not args.repository_root
        result = verify_workspace(args.source_root, args.workspace)
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
