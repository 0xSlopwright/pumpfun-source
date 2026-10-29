#!/usr/bin/env python3
"""Fresh private Pump root compilation with full input/dependency observations."""
import argparse, hashlib, importlib.util, io, json, shutil, sys, tarfile, tomllib
from pathlib import Path

P = Path(__file__).resolve().parent
ROOT = P.parents[1]
W = Path('/tmp/pump-migration-completion-20261028-native')
H = Path('/Users/shawwalters/Documents/Codex/2026-10-24/claude-pump-work/harness/fastbuild.py')
SDK = Path.home() / '.cache/solana/v1.44/platform-tools'
HYBRID = H.parents[1] / 'toolchains/hybrid144/rust'
REG = Path.home() / '.cargo/registry/src'
sys.path.insert(0, str(ROOT / 'scripts'))
sys.path.insert(0, str(P / 'tools'))

def require(ok, message):
    if not ok:
        raise ValueError(message)
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def inventory(root):
    return {p.relative_to(root).as_posix(): sha(p) for p in sorted(root.rglob('*'))
        if p.is_file() and not {'target', '__pycache__', '.git'}.intersection(p.relative_to(root).parts)}
def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module
def registry(source):
    result = {}
    lock = tomllib.loads((source / 'Cargo.lock').read_text())
    for row in lock['package']:
        if not row.get('source', '').startswith('registry+'):
            continue
        matches = [p / (row['name'] + '-' + row['version']) for p in REG.iterdir() if p.is_dir()]
        found = [p for p in matches if p.is_dir()]
        require(found, 'registry source absent: ' + row['name'] + '-' + row['version'])
        for directory in found:
            for name, digest in inventory(directory).items():
                result[directory.relative_to(REG).as_posix() + '/' + name] = digest
    return result
def dependencies(target):
    result = {}
    for root in [target / 'release/deps', target / 'sbpf-solana-solana/release/deps']:
        for path in sorted(root.glob('*')):
            if path.is_file() and path.suffix in {'.rlib', '.rmeta', '.dylib', '.so', '.a'} and not path.name.startswith(('libpump_recovered', 'pump_recovered')):
                result[path.relative_to(target).as_posix()] = sha(path)
    return result

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('name')
    args = parser.parse_args()
    source = P / 'latest-source'
    out = P / args.name
    require(not out.exists(), 'output exists')
    out.mkdir(parents=True)
    before = inventory(source)
    registry_before = registry(source)
    target = W / 'target-identity'
    dependencies_before = dependencies(target)
    tools = {'fastbuild': H, 'wrapper': H.parent / 'pump_physical_source_wrapper.py',
        'rustc': HYBRID / 'bin/rustc', 'cargo': SDK / 'rust/bin/cargo', 'objcopy': SDK / 'llvm/bin/llvm-objcopy'}
    tools_before = {name: sha(path) for name, path in tools.items()}
    library_dir = HYBRID / 'lib/rustlib/sbpf-solana-solana/lib'
    libraries_before = inventory(library_dir)
    parent = json.loads((ROOT / 'research/pump-create-used-boundaries-20261028/builds/primary/build-attempt.json').read_text())
    require(libraries_before == {name: value['sha256'] for name, value in parent['target_libraries_sha256'].items()}, 'target library profile differs from qualified parent')
    for key in ['rustc', 'cargo', 'objcopy']:
        require(tools_before[key] == parent['tool_sha256'][key], 'tool differs from qualified parent: ' + key)
    for key, value in [('source-before.json', before), ('registry-before.json', registry_before),
        ('dependencies-before.json', dependencies_before), ('target-libraries.json', libraries_before)]:
        (out / key).write_text(json.dumps(value, indent=2) + '\n')
    shutil.copy2(H, out / 'executed-fastbuild.py')
    shutil.copy2(Path(__file__), out / 'executed-controller.py')
    shutil.copytree(P / 'tools', out / 'executed-tools', ignore=shutil.ignore_patterns('__pycache__'))
    # Recompile both maintained local crates. Cached external dependencies are
    # observed before/after and must retain identical bytes.
    for fingerprint in target.glob('sbpf-solana-solana/release/.fingerprint/pump-token-ext-*'):
        shutil.rmtree(fingerprint)
    result = load('current_migration_fastbuild', H).build(source, W, out, recipe='identity')
    result.update(source_before=before, source_after=inventory(source), tools_before=tools_before,
        tools_after={name: sha(path) for name, path in tools.items()}, target_libraries_unchanged=inventory(library_dir) == libraries_before,
        registry_unchanged=registry(source) == registry_before, external_dependencies_unchanged=dependencies(target) == dependencies_before,
        controller_sha256=sha(Path(__file__)), dependency_reuse='Explicit existing private target, hashes retained; root freshly recompiled')
    (out / 'build-receipt.json').write_text(json.dumps(result, indent=2) + '\n')
    require(result['ok'] and result['runtime_valid'], 'compile failed or stack diagnostic')
    require(result['source_before'] == result['source_after'] and result['tools_before'] == result['tools_after'] and
        result['target_libraries_unchanged'] and result['registry_unchanged'] and result['external_dependencies_unchanged'], 'input/dependency bytes changed')
    result['analysis_tools'] = inventory(P / 'tools')
    workspace = W / 'ws'
    result['compiled_workspace_inputs'] = inventory(workspace)
    with tarfile.open(out / 'compiled-workspace.tar.gz', 'w:gz') as archive:
        for name in sorted(result['compiled_workspace_inputs']):
            data = (workspace / name).read_bytes()
            info = tarfile.TarInfo(name)
            info.size, info.mode, info.mtime = len(data), 0o644, 0
            archive.addfile(info, io.BytesIO(data))
    result['fresh_local_compilations'] = {name: sum(('Compiling ' + name + ' ') in line for line in (out / 'build.log').read_text().splitlines()) for name in ['pump-recovered', 'pump-token-ext']}
    require(result['fresh_local_compilations'] == {'pump-recovered': 1, 'pump-token-ext': 1}, 'both local crates must be freshly compiled')
    (out / 'build-receipt.json').write_text(json.dumps(result, indent=2) + '\n')
    census = load('migration_full_census', P / 'tools/census.py')
    census.ROOT = ROOT
    measured = census.census(out / 'unstripped.so')
    (out / 'measurement-full.json').write_text(json.dumps(measured, indent=2) + '\n')
    print(json.dumps({'name': args.name, 'build': {k: result[k] for k in ['ok', 'runtime_valid', 'seconds', 'unstripped_sha256', 'candidate_sha256']},
        'source_files': len(before), 'registry_files': len(registry_before), 'external_dependency_files': len(dependencies_before),
        'census': measured['counts']}, indent=2))

if __name__ == '__main__':
    main()
