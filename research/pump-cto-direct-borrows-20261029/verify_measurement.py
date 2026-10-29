#!/usr/bin/env python3
"""Verify retained native f4 build/census and genuine CTO18 observations offline."""
import argparse
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import tarfile
import tempfile

import verify

P = Path(__file__).resolve().parent
sha = lambda data: hashlib.sha256(data).hexdigest()


def read(path):
    data = Path(path).read_bytes()
    return json.loads(gzip.decompress(data) if data.startswith(b'\x1f\x8b') else data)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, default=P.parents[1], help='complete checkout with unchanged frozen tools/captures')
    args = parser.parse_args()
    root = args.repo.resolve()
    receipt = read(P/'MEASUREMENT.json')
    for name, digest in receipt['files'].items():
        verify.require(sha((P/name).read_bytes()) == digest, 'retained measurement file: ' + name)
    for name, digest in read(P/'native-build/MANIFEST.json').items():
        verify.require(sha((P/'native-build'/name).read_bytes()) == digest, 'complete native artifact manifest: '+name)
    proof = verify.verify_source()
    build = read(P/'native-build/build-comparison.json')
    attempt = read(P/'native-build/build-attempt.json')
    control = read(P/'native-build/canonical-SOURCE-FROZEN.json')
    verify.require(sha((P/'native-build/canonical-SOURCE-FROZEN.json').read_bytes()) == '974468bf7a2756089bf1b8729115cc03c20cc011bb39af4d1deb23b8e62d133a', 'canonical65 source manifest')
    primary = {name.removeprefix('source/'): digest for name, digest in build['primary_source_sha256'].items()}
    verify.require(len(primary) == len(control['source_files']) == 65 and set(primary) == set(control['source_files']), 'same65 source input set')
    changed = [name for name in primary if primary[name] != control['source_files'][name]]
    verify.require(changed == ['src/creator/admin_cto.rs'] and primary[changed[0]] == proof['after_sha256'], 'only exact f4 source changed')
    verify.require(attempt['primary_source_sha256'] == build['primary_source_sha256'] and attempt['source_sha256'] == build['source_sha256'], 'attempt/compiler source binding')
    with tarfile.open(P/'native-build/compiled-source.tar.gz') as archive:
        members = [member for member in archive.getmembers() if member.isfile()]
        archive_hashes = {'build/source/'+member.name: sha(archive.extractfile(member).read()) for member in members}
    verify.require(len(archive_hashes) == 66 and archive_hashes == build['source_sha256'], 'all66 actual compiler input files')
    verify.require(build['cold_empty_target'] and not build['target_existed_before'], 'empty target build receipt')
    log = gzip.decompress((P/'native-build/build.log.gz').read_bytes()).decode()
    for crate in ['pump-token-ext', 'pump-recovered']:
        verify.require('Compiling '+crate+' v0.1.0' in log, 'actual local crate compilation: '+crate)
    image = (P/'native-build/candidate.so').read_bytes()
    symbols = verify.Elf(P/'native-build/unstripped.so')
    verify.require(sha(image) == receipt['candidate_sha256'] == build['comparison']['candidate_sha256'], 'actual new candidate bytes')
    verify.require(sha(symbols.data) == receipt['symbols_sha256'], 'actual new symbols')
    calls, external = symbols.calls(0x2fd30, 0x46b8)
    expected = {0x10f18: 48, 0x1a4b78: 6, 0x343e8: 5, 0x35208: 2, 0x345c0: 1}
    verify.require(len(calls) == 170 and len(external) == 3, 'actual new CTO call counts')
    for target, count in expected.items():
        verify.require(sum(value == target for _, value in calls) == count, 'actual measured callee count '+hex(target))
    audit = read(P/'evidence/f4-native-callee-audit.json')
    verify.require(audit['body']['sha256'] == sha(symbols.body(0x2fd30, 0x46b8)), 'measured CTO body binding')
    delta = read(P/'census/delta.json')
    inventory = read(P/'census/inventory.json.gz')
    verify.require(sha((P/'census/inventory.json.gz').read_bytes()) == delta['inventory_sha256'], 'official census hash')
    verify.require(delta['candidate_symbols_sha256'] == sha(symbols.data) == inventory['candidate_sha256'], 'official census image binding')
    verify.require(delta['baseline_counts'] == delta['candidate_counts'] and not delta['gained'] and not delta['lost'] and not delta['all_match_changes'], 'zero window gains/losses')
    verify.require(len(inventory['windows']) == 1035 and delta['candidate_counts']['normalized'] == 1019 and delta['candidate_counts']['raw'] == 188, 'complete1035 census')
    inputs = read(P/'runtime-tools/INPUTS.json')
    for name, row in inputs['files'].items():
        verify.require(sha((root/name).read_bytes()) == row['sha256'], 'unchanged runtime input: '+name)
    execution = read(P/'runtime/execution.json')
    verify.require(execution['returncode'] == 0 and execution['candidate_sha256'] == sha(image) and execution['source_sha256'] == proof['after_sha256'], 'fresh replay source/image binding')
    verify.require(execution['controller_sha256'] == sha((P/'runtime-tools/replay.py').read_bytes()), 'actual executed replay controller')
    verify.require(execution['frozen_manifest_sha256'] == sha((P/'runtime-tools/INPUTS.json').read_bytes()), 'actual replay manifest')
    spec = importlib.util.spec_from_file_location('cto_runtime_verifier', P/'runtime-tools/verify_results.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    # Path adaptation for offline verification only; exact executed controller and
    # observations are retained unmodified. No fixtures, logs or Source rewritten.
    with tempfile.TemporaryDirectory() as temporary:
        directory = Path(temporary)
        (directory/'repo').symlink_to(root, target_is_directory=True)
        for name in ['INPUTS.json', 'cases.json']:
            (directory/name).write_bytes((P/'runtime-tools'/name).read_bytes())
        module.P = directory
        result = module.verify(read(P/'runtime/report.json.gz'), read(P/'runtime/loader.json'), inputs['current_control_sha256'], sha(image))
    verify.require(result == read(P/'runtime/VERIFIED.json'), 'independent strict replay recomputation')
    print(json.dumps({'native_source_files': 65, 'actual_compiler_input_files': 66, 'only_source_delta': changed,
                      'both_local_crates_compiled': True, 'cold_empty_target': True,
                      'candidate_sha256': sha(image), 'symbols_sha256': sha(symbols.data),
                      'normalized_windows': 1019, 'raw_windows': 188, 'gains': 0, 'losses': 0,
                      'predicted_call_changes_confirmed': True, 'runtime': result,
                      'shared_holder_runtime_for_this_image': 'pending; these18 are common-wallet only',
                      'maintained_canonical_selection_changed': False}, indent=2))


if __name__ == '__main__':
    main()
