#!/usr/bin/env python3
"""Prepare/repeat the sealed native transport; stop if either control ELF differs.

This input-path adapter delegates compilation to the EXACT recorded controller.
The only optional experiment is the frozen, rejected one-line borrow match.
No alternate flags, source spellings, section ordering or byte transformations.
"""
import argparse
import gzip
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys

sys.dont_write_bytecode = True
PACKET = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('native_proof_verifier', PACKET/'verify.py')
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)


def prepare(args):
    v.authenticate()
    output = args.output.resolve()
    v.require(not output.exists(), 'Output must be a NEW owned directory')
    protected = [args.repo.resolve(), args.sdk.resolve(), args.cargo_home.resolve(), args.seed.resolve(), PACKET]
    v.require(all(not p.is_relative_to(output) and not output.is_relative_to(p) for p in protected),
              'Output must not contain or be contained by an input directory')
    v.require(args.seed.is_dir() and not args.seed.is_symlink(), 'Seed must be an ordinary existing directory')
    m = v.module(PACKET/'recorded/controller.py', 'exact_recorded_native_controller')
    m.N, m.R, m.D = output, args.repo.resolve(), PACKET
    m.REF, m.SOURCE, m.TARGET = output/'reference', output/'source', output/'target'
    m.SDK, m.CARGO, m.SEED = args.sdk.resolve(), args.cargo_home.resolve(), args.seed.resolve()
    output.mkdir(parents=True)
    shutil.copytree(PACKET/'reference', m.REF)
    control = v.source_files(PACKET/'recorded/control/source.tar.gz')
    m.SOURCE.mkdir()
    for name, raw in control.items():
        path = m.SOURCE/name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(raw)
    expected = v.load(PACKET/'recorded/plan.json')['workspace_sha256']
    v.require(m.files(m.SOURCE) == expected, 'Workspace input mismatch')
    sdk = m.sdk_check()  # All 2,775 bytestring hashes, including the actual host rust-lld.
    deps = m.dependency_check()  # Locked archives AND active unpacked source bytes.
    seed = m.files(m.SEED)
    m.TARGET.mkdir()
    command = ['cp', '-a', '--reflink=auto', str(m.SEED)+'/.', str(m.TARGET)]
    subprocess.run(command, check=True)
    v.require(m.files(m.TARGET) == seed and m.files(m.SEED) == seed, 'Seed copy drift')
    for path in m.TARGET.rglob('*'):
        if path.is_file():
            original = m.SEED/path.relative_to(m.TARGET)
            v.require((path.stat().st_dev, path.stat().st_ino) != (original.stat().st_dev, original.stat().st_ino),
                      'Private target must not hardlink protected seed files')
    adapted = {}
    for mode in ['control', 'candidate']:
        folder = output/mode
        folder.mkdir()
        adapted[mode] = {}
        for name, count in [('rustc_wrapper.py', 2), ('linker_wrapper.py', 5)]:
            reference = (m.REF/name).read_text()
            value = reference.replace('/out/', str(folder)+'/')
            v.verify_wrapper(reference, value, str(folder), count)
            (folder/name).write_text(value)
            (folder/name).chmod(0o755)
            adapted[mode][name] = {'reference_sha256': m.digest(m.REF/name), 'adapted_sha256': m.digest(folder/name),
                                   'literal_substitutions': count, 'from': '/out/', 'to': str(folder)+'/', 'other_logic_changes': False}
        shutil.copy2(m.REF/'ordered.ld', folder/'ordered.ld')
    shutil.copy2(PACKET/'recorded/dispatcher.py', output/'dispatcher.py')
    (output/'dispatcher.py').chmod(0o755)
    (output/'dependency-inputs.json.gz').write_bytes(gzip.compress(json.dumps(deps, sort_keys=True).encode(), mtime=0))
    m.dump(output/'seed-before.json', seed)
    recorded = v.load(PACKET/'recorded/plan.json')
    plan = {**recorded, 'controller_sha256': m.digest(m.__file__), 'reference_sha256': m.files(m.REF),
            'workspace_sha256': expected, 'protected_seed': str(m.SEED), 'owned_target': str(m.TARGET),
            'seed_copy_command': command, 'seed_snapshot_sha256': m.digest(output/'seed-before.json'),
            'sdk_files': len(sdk), 'registry_packages': len(deps), 'archive_files': sum(len(p['archive_files']) for p in deps),
            'dependencies_sha256': m.digest(output/'dependency-inputs.json.gz'), 'adapted_wrappers': adapted,
            'dispatcher_sha256': m.digest(output/'dispatcher.py'), 'portable_preparer_sha256': m.digest(__file__),
            'portable_preparer_limit': 'This path adapter is statically tested; the published actual compiler run used the unchanged recorded controller at its recorded host paths.'}
    m.dump(output/'plan.json', plan)
    return m


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    for key in ['repo', 'sdk', 'cargo-home', 'seed', 'output']:
        parser.add_argument('--'+key, type=Path, required=True)
    parser.add_argument('--prepare-only', action='store_true', help='Authenticate and copy inputs without invoking Cargo')
    parser.add_argument('--reproduce-rejected-match', action='store_true',
                        help='After BOTH exact control hashes only, reproduce the sealed negative hypothesis once')
    args = parser.parse_args()
    m = prepare(args)
    print(json.dumps({'prepared': str(m.N), 'controller_sha256': m.digest(m.__file__),
                      'plan_sha256': m.digest(m.N/'plan.json'), 'compiler_started': False}), flush=True)
    if not args.prepare_only:
        m.run('control')  # Raises before candidate on any source/hash/compiler/input gate failure.
        if args.reproduce_rejected_match:
            m.run('candidate')
