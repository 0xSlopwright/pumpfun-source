#!/usr/bin/env python3
"""Build maintained AMM sources in the recorded isolated Linux v1.44 workspace.

Host SDK/cache locations are explicit inputs. Container paths retain the qualified
recipe's compiler context. No generated binary is patched except llvm-objcopy's
ordinary symbol stripping. The repository workspace is never a Cargo input.
"""
from pathlib import Path
import argparse
import gzip
import hashlib
import io
import importlib.util
import json
import shutil
import subprocess
import sys
import tarfile
import tomllib
_spec = importlib.util.spec_from_file_location('amm_workspace_recipe', Path(__file__).with_name('workspace_recipe.py'))
recipe = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(recipe)

IMAGE = 'solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50'
HISTORICAL = '/Users/shawwalters/Documents/Codex/2026-10-24/pumpfun-source/work/'
SRC = HISTORICAL + 'amm-swap-accounts-final-20261027/source'
SDK = HISTORICAL + 'amm-linux-v144-20261027/sdk'
CARGO = HISTORICAL + 'amm-pubkey-provenance-final-20261027/cargo-home'
TARGET = HISTORICAL + 'amm-workspace-current-20261027/target'
PROGRAM = 'pump_amm_recovered.so'


def require(value, message):
    if not value:
        raise RuntimeError(message)


def sha(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as stream:
        for data in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(data)
    return h.hexdigest()


def write_json(path, value):
    Path(path).write_text(json.dumps(value, indent=2, sort_keys=True) + '\n')


def archive(files):
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode='w') as output:
        for name, data in sorted(files.items()):
            entry = tarfile.TarInfo(name)
            entry.size, entry.mode, entry.mtime = len(data), 0o644, 0
            output.addfile(entry, io.BytesIO(data))
    return gzip.compress(stream.getvalue(), mtime=0)


def dependencies(lock, cargo_home):
    """Check every locked registry archive and active unpacked source byte."""
    packages = tomllib.loads(Path(lock).read_text())['package']
    result = []
    for package in packages:
        if not package.get('source', '').startswith('registry+'):
            continue
        name = package['name'] + '-' + package['version']
        caches = sorted((cargo_home / 'registry/cache').glob('*/' + name + '.crate'))
        sources = sorted((cargo_home / 'registry/src').glob('*/' + name))
        require(caches and sources, ('Missing locked dependency', name))
        require(all(sha(path) == package['checksum'] for path in caches), name)
        expected = {}
        with tarfile.open(caches[0]) as source:
            for item in source:
                if not item.isfile():
                    continue
                require(item.name.startswith(name + '/'), "Input validation failed: item.name.startswith(name + '/')")
                relative = item.name[len(name) + 1:]
                require('..' not in Path(relative).parts and relative not in expected, "Input validation failed: '..' not in Path(relative).parts and relative not in expected")
                data = source.extractfile(item).read()
                expected[relative] = hashlib.sha256(data).hexdigest()
        roots = {}
        for source in sources:
            actual = {str(path.relative_to(source)): sha(path)
                      for path in source.rglob('*') if path.is_file()}
            for relative, digest in expected.items():
                require(actual.get(relative) == digest, ('Dependency source drift', name, relative))
            require(set(actual) - set(expected) <= {'.cargo-ok', '.cargo-checksum.json'}, (name, set(actual)-set(expected)))
            roots[source.parent.name] = actual
        result.append({'name': package['name'], 'version': package['version'],
                       'source': package['source'], 'checksum': package['checksum'],
                       'archive_files': expected, 'active_roots': roots})
    return result


def build(args):
    root, output = args.repo.resolve(), args.output.absolute()
    require(not output.exists(), 'Build output must be a new directory')
    output.mkdir(parents=True)
    harness_paths = [Path(__file__).resolve(), Path(__file__).with_name('workspace_recipe.py').resolve()]
    harness_before = {path.name: sha(path) for path in harness_paths}
    (output/'harness').mkdir()
    for path in harness_paths:
        (output/'harness'/path.name).write_bytes(path.read_bytes())
    workspace = output / 'source'
    binding = recipe.stage(root, workspace)
    inputs = recipe.source_inputs(root)
    (output / 'canonical-source.tar.gz').write_bytes(archive(inputs))
    before = {name: recipe.digest(data) for name, data in recipe.file_inventory(workspace).items()}
    write_json(output / 'source-binding.json', binding)
    dependency_before = dependencies(workspace / 'Cargo.lock', args.cargo_home.resolve())
    (output / 'dependencies.json.gz').write_bytes(gzip.compress(json.dumps(dependency_before, sort_keys=True).encode(), mtime=0))
    sdk_before = {str(path.relative_to(args.sdk)): sha(path)
                  for path in args.sdk.rglob('*') if path.is_file()}
    write_json(output / 'sdk-sha256.json', sdk_before)
    common = ['podman', 'run', '--rm', '--platform', 'linux/amd64', '--network', 'none',
              '--entrypoint=/usr/bin/env', '-v', f'{workspace}:{SRC}:ro',
              '-v', f'{args.sdk.resolve()}:{SDK}:ro',
              '-v', f'{args.cargo_home.resolve()}:{CARGO}:rw',
              '-v', f'{args.target_dir.resolve()}:{TARGET}:rw',
              '-v', f'{output}:/out:rw', '-w', SRC,
              '-e', f'CARGO_HOME={CARGO}', '-e', f'CARGO_TARGET_DIR={TARGET}',
              '-e', f'RUSTC={SDK}/rust/bin/rustc', '-e', f'RUSTDOC={SDK}/rust/bin/rustdoc',
              '-e', f'CC={SDK}/llvm/bin/clang', '-e', f'AR={SDK}/llvm/bin/llvm-ar',
              '-e', f'LD_LIBRARY_PATH={SDK}/rust/lib:{SDK}/llvm/lib',
              '-e', 'CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS= -Zremap-cwd-prefix=',
              '-e', 'CARGO_BUILD_JOBS=3', IMAGE]
    commands = []

    def run(tail, log):
        command = common + tail
        commands.append(command)
        with (output / log).open('wb') as stream:
            subprocess.run(command, stdout=stream, stderr=subprocess.STDOUT, check=True)

    run([f'{SDK}/rust/bin/rustc', '-vV'], 'rustc-version.log')
    run([f'{SDK}/rust/bin/cargo', '-V'], 'cargo-version.log')
    clean = [f'{SDK}/rust/bin/cargo', 'clean', '--manifest-path', f'{SRC}/Cargo.toml',
             '--release', '--target', 'sbpf-solana-solana']
    if not args.clean_all:
        clean += ['-p', 'pump-amm-recovered']
    if args.clean_all:
        target = args.target_dir.resolve()
        protected = [root, output, args.sdk.resolve(), args.cargo_home.resolve()]
        require(args.target_dir.is_dir() and not args.target_dir.is_symlink(), 'Cold target must be an ordinary existing directory')
        require(all(not path.is_relative_to(target) for path in protected), 'Cold target must not contain source, output, SDK or Cargo home')
        removed = sorted(path.name for path in target.iterdir())
        for path in target.iterdir():
            if path.is_dir() and not path.is_symlink():
                shutil.rmtree(path)
            else:
                path.unlink()
        remaining = sorted(path.name for path in target.iterdir())
        require(not remaining, 'Owned target is not empty after cold cleanup')
        write_json(output/'target-clean.json', {'target': str(target), 'removed_entries': removed,
                    'remaining_entries': remaining, 'empty_before_compilation': True,
                    'scope': 'Only contents of the explicitly supplied owned target; mount root retained'})
    run(clean, 'clean.log')
    run(['-u', 'RUSTFLAGS', '-u', 'CARGO_ENCODED_RUSTFLAGS', f'{SDK}/rust/bin/cargo',
         'build', '--release', '--target', 'sbpf-solana-solana', '--manifest-path',
         f'{SRC}/Cargo.toml', '--locked', '--offline', '--verbose'], 'build.log')
    log = (output / 'build.log').read_text()
    require('Running `' in log and '--crate-name pump_amm_recovered' in log, "Input validation failed: 'Running `' in log and '--crate-name pump_amm_recovered' in log")
    if args.clean_all:
        require('Fresh ' not in log, 'Cold build unexpectedly reused a Cargo package')
    run([f'{SDK}/llvm/bin/llvm-objcopy', '--strip-all',
         f'{TARGET}/sbpf-solana-solana/release/{PROGRAM}', '/out/candidate.so'], 'strip.log')
    (output / 'symbols.so').write_bytes((args.target_dir / 'sbpf-solana-solana/release' / PROGRAM).read_bytes())
    after = {name: recipe.digest(data) for name, data in recipe.file_inventory(workspace).items()}
    require(before == after, 'Input validation failed: before == after')
    require(inputs == recipe.source_inputs(root), 'Maintained sources changed during build')
    require(dependency_before == dependencies(workspace / 'Cargo.lock', args.cargo_home.resolve()), "Input validation failed: dependency_before == dependencies(workspace / 'Cargo.lock', args.cargo_home.resolve())")
    require(sdk_before == {str(path.relative_to(args.sdk)): sha(path) for path in args.sdk.rglob('*') if path.is_file()}, "Input validation failed: sdk_before == {str(path.relative_to(args.sdk)): sha(path) for path in args.sdk.rglob('*') if path.is_file()}")
    harness_after = {path.name: sha(path) for path in harness_paths}
    require(harness_before == harness_after, 'Builder or mapper changed during execution')
    record = {'schema': 'pump-amm-maintained-build-v1', 'source_unchanged': True,
              'source_sha256': before, 'source_after_sha256': after,
              'canonical_sha256': binding['input_sha256'], 'workspace_sha256': binding['workspace_sha256'],
              'candidate_sha256': sha(output / 'candidate.so'), 'symbols_sha256': sha(output / 'symbols.so'),
              'image': IMAGE, 'commands': commands, 'clean_all': args.clean_all,
              'registry_packages': len(dependency_before),
              'archive_files': sum(len(package['archive_files']) for package in dependency_before),
              'dependency_inputs_unchanged': True, 'sdk_unchanged': True,
              'harness_sha256': harness_before, 'harness_after_sha256': harness_after,
              'python_executable': sys.executable, 'python_version': sys.version,
              'returncode': 0, 'source_transformations': 'Only manifest workspace/profile placement and Cargo.lock location; Rust bytes unchanged'}
    write_json(output / 'build-record.json', record)
    print(json.dumps({key: record[key] for key in ['candidate_sha256', 'symbols_sha256', 'clean_all', 'registry_packages', 'archive_files']}), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, default=Path(__file__).resolve().parents[3])
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--sdk', type=Path, required=True)
    parser.add_argument('--cargo-home', type=Path, required=True)
    parser.add_argument('--target-dir', type=Path, required=True)
    parser.add_argument('--clean-all', action='store_true')
    build(parser.parse_args())
