#!/usr/bin/env python3
"""Rebuild either archived source using official native Linux v1.44 tools and offline dependencies."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tarfile

P = Path(__file__).resolve().parent
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()


def inventory(root):
    return {str(p.relative_to(root)): sha(p) for p in sorted(root.rglob('*')) if p.is_file()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sdk', type=Path, required=True)
    parser.add_argument('--cargo-home', type=Path, required=True)
    parser.add_argument('--target-dir', type=Path, required=True, help='Dedicated disposable target; only the two local packages are cleaned.')
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--source', choices=['candidate', 'control'], default='candidate')
    args = parser.parse_args()
    sdk, cargo, target, out = [p.resolve() for p in [args.sdk, args.cargo_home, args.target_dir, args.out]]
    assert target != sdk and target != cargo and sdk not in target.parents and cargo not in target.parents
    out.mkdir(parents=True, exist_ok=False)
    source = out / 'source'
    source.mkdir()
    with tarfile.open(P / ('sources/' + args.source + '.tar.gz')) as archive:
        for member in archive:
            name = Path(member.name)
            assert not name.is_absolute() and '..' not in name.parts and member.isfile()
            path = source / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(archive.extractfile(member).read())
    before = inventory(source)
    expected = json.loads((P / 'source-inventory.json').read_text())[args.source]
    assert before == expected
    tools = {n: sha(sdk / p) for n, p in [('rustc', 'rust/bin/rustc'), ('cargo', 'rust/bin/cargo'), ('objcopy', 'llvm/bin/llvm-objcopy')]}
    libraries = {p.name: sha(p) for p in sorted((sdk / 'rust/lib/rustlib/sbpf-solana-solana/lib').glob('*')) if p.is_file()}
    original_record = json.loads((P / 'builds/clean/attempt.json').read_text())
    assert tools == original_record['tool_sha256'] and libraries == original_record['target_libraries_sha256']
    environment = os.environ.copy()
    environment.pop('RUSTFLAGS', None)
    environment.pop('CARGO_ENCODED_RUSTFLAGS', None)
    environment.update(CARGO_HOME=str(cargo), CARGO_TARGET_DIR=str(target), CARGO_BUILD_JOBS='2',
                       RUSTC=str(sdk / 'rust/bin/rustc'), RUSTC_WRAPPER=str(P / 'tools/physical_source_wrapper.py'),
                       PUMP_LOGICAL_REGISTRY_SRC=str(cargo / 'registry/src'),
                       PUMP_SOURCE_WRAPPER_LOG=str(out / 'physical-source-calls.jsonl'),
                       CC=str(sdk / 'llvm/bin/clang'), AR=str(sdk / 'llvm/bin/llvm-ar'),
                       CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS='-Zremap-cwd-prefix=')
    common = ['--manifest-path', str(source / 'Cargo.toml'), '--release', '--target', 'sbpf-solana-solana']
    clean = [str(sdk / 'rust/bin/cargo'), 'clean', *common, '-p', 'pump-amm-recovered', '-p', 'native-transfer-fee', '--offline']
    build = [str(sdk / 'rust/bin/cargo'), 'build', *common, '--locked', '--offline', '--verbose']
    for command, name in [(clean, 'clean.log'), (build, 'build.log')]:
        with (out / name).open('w') as log:
            subprocess.run(command, cwd=source, env=environment, stdout=log, stderr=subprocess.STDOUT, check=True)
    assert inventory(source) == before
    assert libraries == {p.name: sha(p) for p in sorted((sdk / 'rust/lib/rustlib/sbpf-solana-solana/lib').glob('*')) if p.is_file()}
    shutil.copy2(target / 'sbpf-solana-solana/release/pump_amm_recovered.so', out / 'unstripped.so')
    subprocess.run([str(sdk / 'llvm/bin/llvm-objcopy'), '--strip-all', str(out / 'unstripped.so'), str(out / 'candidate.so')], check=True)
    result = dict(source=args.source, clean_command=clean, build_command=build, source_sha256=before,
                  tool_sha256=tools, target_libraries_sha256=libraries, source_unchanged=True,
                  target_libraries_unchanged=True, unstripped_sha256=sha(out / 'unstripped.so'),
                  candidate_sha256=sha(out / 'candidate.so'), producer_sha256=sha(Path(__file__)))
    (out / 'result.json').write_text(json.dumps(result, indent=2) + '\n')
    expected_symbols = '16ad4ae76fdb5c95694236b5752922524720b54ae0a97f4dc66e5c3ae5837110' if args.source == 'candidate' else '73d952aa51324e0ba17395a30f746e8b933cf739ae86bcb26675b4db69fbe126'
    assert result['unstripped_sha256'] == expected_symbols
    print(json.dumps({k: result[k] for k in ['source', 'source_unchanged', 'target_libraries_unchanged', 'unstripped_sha256', 'candidate_sha256']}))


if __name__ == '__main__':
    main()
