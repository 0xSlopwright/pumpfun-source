#!/usr/bin/env python3
"""Verify current Mayhem inputs, two actual Windows builds, and local receipts.

Standard library only; no compiler, VM, network or Git mutation. Use
verify_signatures.py separately for fresh cryptographic signature verification.
"""
import argparse, base64, contextlib, gzip, hashlib, io, json, os, runpy, stat, sys, tempfile, zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
NATIVE = '24e416c49991394bda6374439d05d8f004144a6e5c93492fc5541a78c472a36e'
CANDIDATE = '9af9e3b1cbc9d89340af4d9d46e4c88d3dc2fc67e0090f9370047d97532ff09d'
SYMBOLS = '7b15bb1e5c7c9c53041322fa64d4a420906fffd96ff97a55d70d627bcb854960'

def require(ok, message):
    if not ok:
        raise ValueError(message)
def sha(data):
    return hashlib.sha256(data).hexdigest()
def read(path):
    data = path.read_bytes()
    return json.loads(gzip.decompress(data) if path.suffix == '.gz' else data)
def inventory(root):
    result = {}
    for path in root.rglob('*'):
        rel = path.relative_to(root)
        if {'target', '.git', '__pycache__'}.intersection(rel.parts):
            continue
        require(not path.is_symlink() and (path.is_file() or path.is_dir()), 'special source path: ' + str(rel))
        if path.is_file():
            result[rel.as_posix()] = sha(path.read_bytes())
    return result
def unpack(path, output):
    seen = set()
    with zipfile.ZipFile(path) as archive:
        for member in archive.infolist():
            name = member.filename
            require(name not in seen and not name.startswith(('/', '\\')) and '\\' not in name and ':' not in name and '..' not in Path(name).parts, 'unsafe ZIP member')
            require(not stat.S_ISLNK(member.external_attr >> 16), 'ZIP symlink')
            seen.add(name)
            dest = output / name
            if member.is_dir():
                dest.mkdir(parents=True, exist_ok=True)
            else:
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(archive.read(member))
def inspect(script, arguments, repo):
    previous_args, previous_cwd = sys.argv, Path.cwd()
    stream = io.StringIO()
    try:
        sys.argv = [str(script), *map(str, arguments)]
        os.chdir(repo)
        with contextlib.redirect_stdout(stream):
            runpy.run_path(str(script), run_name='__main__')
    finally:
        sys.argv = previous_args
        os.chdir(previous_cwd)
    return json.loads(stream.getvalue())

def check_runtime(packet, selection, candidate, original):
    runtime = packet / selection['runtime_directory']
    summary = read(runtime / 'summary.json')
    launch = read(runtime / 'launch.json')
    require(launch['controller_sha256'] == sha((packet / 'run_runtime.py').read_bytes()), 'runtime controller binding')
    require(inventory(packet / 'runtime-harness') == launch['script_inputs'], 'retained runtime scripts differ')
    require(summary['status'] == 'SUCCEEDED' and summary['suites'] == 21 and summary['script_inputs_unchanged'] and not summary['rpc_used'], 'runtime incomplete')
    require(summary['compiler_image_sha256'] == CANDIDATE and summary['loader_payload_sha256'] == sha(original), 'runtime image binding')
    loader = read(runtime / 'loader/receipt.json')
    payload = (runtime / 'loader/payload.bin').read_bytes()
    require(payload == original and payload[:len(candidate)] == candidate, 'actual loader payload differs')
    require(loader['elf_sha256'] == CANDIDATE and loader['elf_bytes'] == 775416 and loader['payload_bytes'] == loader['max_data_len'] == 777408 and loader['allocated_zero_tail_bytes'] == 1992 and loader['whole_original_payload_equal'], 'loader allocation receipt differs')
    require(loader['program_executable'] and loader['payload_prefix_equal'] and loader['transactions'] == 864 and loader['write_transactions'] == 862, 'loader execution differs')
    observation = read(runtime / 'loader/observation.json')
    require(observation['existing_controller_sha256'] == selection['loader_controller_sha256'] and observation['observer_sha256'] == sha((packet / 'execute_loader.py').read_bytes()), 'loader controller binding')
    require(observation['compiler_output_unmodified'] and observation['loader_generated_payload'] and observation['transactions'] == 864 and observation['signature_fields'] == 866 and not observation['rpc_used'], 'loader observer differs')
    txs = read(runtime / 'loader/transactions.json.gz')
    require(len(txs) == 864 and sum(r['signatures'] for r in txs) == 866, 'loader transaction inventory differs')
    comparisons, submissions, signature_fields = 0, 0, 0
    for row in summary['results']:
        name = row['name']
        require(row['returncode'] == 0, 'suite failed: ' + name)
        observed = read(runtime / (name + '-transactions.json.gz'))
        require(observed['returncode'] == 0 and observed['observer_sha256'] == sha((packet / 'observe_suite.py').read_bytes()), 'runtime observer binding: ' + name)
        script = Path(row['command'][row['command'].index('--script') + 1]).name
        require(observed['script_sha256'] == launch['script_inputs']['scripts/' + script], 'suite script binding differs')
        require(observed['signature_fields'] == sum(t['signatures'] for t in observed['transactions']), 'runtime signature inventory differs')
        for tx in observed['transactions']:
            require(sha(base64.b64decode(tx['transaction_base64'], validate=True)) == tx['sha256'] and tx['signatures'] > 0, 'transaction raw bytes differ')
        submissions += len(observed['transactions'])
        signature_fields += observed['signature_fields']
        if name == 'burn':
            report = read(runtime / 'burn/comparison.json')
            require(not report['mismatches'], 'burn mismatch')
            require(len(observed['transactions']) == 4 * report['case_count'], 'burn signatures missing')
            require(all(case['original'] == case['candidate'] for case in report['cases']), 'full saved burn observations differ')
            comparisons += len(report['cases'])
        else:
            report = read(runtime / (name + '.json.gz'))
            require(report['case_count'] == row['cases'] == len(report['cases']) and not report['mismatches'], 'corpus receipt differs: ' + name)
            require(report['candidate_sha256'] == sha(original) and report['original_sha256'] == sha(original), 'corpus image differs: ' + name)
            for path, digest in report.get('source_sha256', {}).items():
                if path.startswith('programs/mayhem/'):
                    require(selection['prior_source_inputs'].get(path.removeprefix('programs/mayhem/')) == digest,
                        'legacy incidental source snapshot differs')
            require(len(observed['transactions']) == 2 * report['case_count'], 'not every execution retained: ' + name)
            for case in report['cases']:
                require(case.get('equal', not case.get('different_fields', [])), 'case mismatch: ' + name)
                require(case['original'] == case['candidate'], 'full saved observations differ: ' + name)
            comparisons += report['case_count']
    direct = read(packet / selection['direct_control'])
    require(direct['candidate_sha256'] == CANDIDATE and direct['allocation_difference_expected'] and not direct['comparison_mask_applied'], 'direct allocation control differs')
    require(direct['signed_transactions'] == 2 and direct['signature_fields_verified'] == 4, 'direct signature inventory differs')
    require(direct['account_differences'] == {phase: ['MAyhSmzXzV1pTf7LsNkrNwkWKTo4ougAJ1PPg47MD4e'] for phase in ['before', 'after']}, 'unexpected direct-load account difference')
    expected = selection['runtime_counts']
    require((comparisons, submissions, signature_fields) == (expected['fixture_cases'], expected['transactions'], expected['signature_fields']) and
        submissions == 2 * expected['transaction_comparisons'], 'runtime count binding differs')
    signature_inventory = read(packet / 'signature-inventory.json')
    require(signature_inventory['status'] == 'PASS_ALL_RETAINED_MAYHEM_SIGNATURES' and
        signature_inventory['transactions'] == submissions + 866 and signature_inventory['signature_fields'] == signature_fields + 870,
        'independent signature receipt totals differ')
    for row in signature_inventory['rows']:
        require(sha((packet / row['path']).read_bytes()) == row['sha256'], 'signature receipt input differs')
    return {'suites': 21, 'fixture_cases': comparisons, 'paired_transaction_comparisons': submissions // 2, 'transactions': submissions, 'retained_signature_fields': signature_fields,
        'loader_transactions': 864, 'loader_signature_fields': 866, 'allocation_payload_equal': True}

def verify(repo, source=None, packet=HERE):
    repo, packet = Path(repo).resolve(), Path(packet).resolve()
    source = Path(source or repo / 'programs/mayhem').resolve()
    manifest = read(packet / 'manifest.json')
    actual = inventory(packet)
    actual.pop('manifest.json', None)
    require(actual == manifest['files'], 'packet membership or bytes differ')
    selection = read(packet / 'selection.json')
    require(selection['state'] == 'QUALIFIED_CURRENT_SOURCE_EXACT', 'promotion not qualified')
    require(selection['native_manifest_sha256'] == NATIVE and selection['candidate_sha256'] == CANDIDATE and
        selection['symbols_sha256'] == SYMBOLS, 'selected image or native pin differs')
    require(inventory(packet / 'prior-source') == selection['prior_source_inputs'] and len(selection['prior_source_inputs']) == 15, 'prior source snapshot differs')
    require(inventory(source) == selection['canonical_inputs'] and len(selection['canonical_inputs']) == 69, 'canonical input inventory differs')
    require(inventory(packet / 'source') == selection['canonical_inputs'], 'retained current source differs')
    require(set(selection['compiled_inputs']) == set(selection['canonical_inputs']) - {'README.md', 'build_exact.py'} and len(selection['compiled_inputs']) == 67, 'compiled source projection differs')
    require(all(selection['canonical_inputs'][n] == h for n, h in selection['compiled_inputs'].items()), 'current compiler input differs')
    require(sha((source / 'build_exact.py').read_bytes()) == sha((repo / 'research/mayhem-linker-locators-20261028/build_exact.py').read_bytes()), 'canonical builder differs from actually executed builder')
    require(sha((source / 'build_exact.py').read_bytes()) == selection['builder_sha256'], 'selected builder differs')
    rejected = packet / 'rejected/40766148667'
    require(sha((rejected / 'build.zip').read_bytes()) == '00208169e4a436892f7ebd3e0bc02c868b7b7ea1113ecc1c257538738bf1dd35', 'rejected original artifact changed')
    with zipfile.ZipFile(rejected / 'build.zip') as archive:
        previous = json.loads(archive.read('qualification.json'))
        require(previous['status'] == 'FAILED' and previous['compiler_executed'] is None, 'rejected outer receipt relabeled')
        for kind in ['host', 'target']:
            receipt = json.loads(archive.read('build/build/' + kind + '/result.json'))
            require(receipt['status'] == 'SUCCEEDED' and receipt['returncode'] == 0, 'rejected compiler observation changed')
        require(sha(archive.read('build/build/target/candidate-v154-strip.so')) == '9c9cc5347fa5aee447e6b7256173eae541a78aaad42356cae8f388354514a819', 'rejected image changed')
    require(read(rejected / 'negative-evidence.json')['qualified'] is False, 'rejected predecessor promoted')
    builds, images, run_ids = [], [], set()
    with tempfile.TemporaryDirectory(prefix='mayhem-current-verify-') as temp:
        for run in selection['builds']:
            require(run['run_id'] not in run_ids, 'independent run ID repeated')
            run_ids.add(run['run_id'])
            directory = packet / run['directory']
            github = read(directory / 'github-run.json')
            require(str(github['databaseId']) == run['run_id'] and github['conclusion'] == 'success' and github['status'] == 'completed' and github['headSha'] == run['github_sha'], 'GitHub run observation differs')
            artifacts = read(directory / 'github-artifacts.json')['artifacts']
            unpacked = Path(temp) / run['run_id']
            for kind in ['build', 'install']:
                archive = directory / (kind + '.zip')
                pin = run[kind]
                require(sha(archive.read_bytes()) == pin['zip_sha256'], 'hosted artifact differs: ' + kind)
                meta = next((r for r in artifacts if r['id'] == pin['artifact_id']), None)
                require(meta and meta['digest'] == 'sha256:' + pin['zip_sha256'], 'GitHub artifact digest differs')
                unpack(archive, unpacked / kind)
            builds.append(inspect(packet / 'inspect_build.py', [unpacked / 'build', '--run-id', run['run_id'], '--native-pin', NATIVE, '--repo', repo, '--source-root', source], repo))
            install = inspect(packet / 'inspect_install.py', [unpacked / 'install', '--run-id', run['run_id']], repo)
            require(install['exact_cl_link_verified'] and install['compiler_member_files'] == 53, 'installer receipt differs')
            mapping = read(unpacked / 'build/build/source-mapping.json')
            require(mapping['canonical_inputs'] == selection['compiled_inputs'], 'actual compiled input projection differs')
            candidate = (directory / 'candidate.so').read_bytes()
            symbols = (directory / 'symbols.so').read_bytes()
            require(candidate == (unpacked / 'build/build/build/target/candidate-v154-strip.so').read_bytes() and symbols == (unpacked / 'build/build/build/target/symbols.so').read_bytes(), 'literal selected image differs')
            images.append((candidate, symbols))
    require(len(builds) == 2 and images[0] == images[1], 'two complete fresh Windows outputs must repeat')
    candidate, symbols = images[0]
    original = (repo / 'evidence/original/mayhem/deployed.so').read_bytes()
    require(sha(original) == selection['original_allocation_sha256'], 'captured original selection differs')
    require(len(candidate) == 775416 and sha(candidate) == CANDIDATE and candidate == original[:775416] and len(original) == 777408 and not any(original[775416:]), 'meaningful ELF or separate allocation boundary')
    require(len(symbols) == 907776 and sha(symbols) == SYMBOLS, 'symbol-bearing compiler ELF differs')
    runtime = check_runtime(packet, selection, candidate, original)
    return {'status': 'PASS_CURRENT_MAYHEM441_EXACT', 'current_source_files': 69, 'actual_raw_compiler_inputs': 67,
        'verified_source_is_canonical': source == repo / 'programs/mayhem',
        'fresh_windows_builds': 2, 'run_ids': sorted(run_ids), 'fresh_host_compilations': 84, 'target_cargo_compilations': 326,
        'candidate_sha256': CANDIDATE, 'symbols_sha256': SYMBOLS, 'meaningful_elf_bytes': 775416,
        'allocation_tail_bytes_not_emitted': 1992, 'runtime': runtime, 'compiler_or_target_executed_by_verifier': False,
        'historical_private_source_or_host_provenance_claimed': False}

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--repo', type=Path, default=HERE.parents[1])
    p.add_argument('--source-root', type=Path)
    p.add_argument('--packet', type=Path, default=HERE)
    a = p.parse_args()
    print(json.dumps(verify(a.repo, a.source_root, a.packet), indent=2))
