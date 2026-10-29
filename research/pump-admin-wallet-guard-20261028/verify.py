#!/usr/bin/env python3
"""Verify retained admin correction, actual builds and finite runtime evidence.

Standard library only. No compiler, VM, network or process creation.
"""
import argparse, gzip, hashlib, importlib.util, json, struct, sys, tarfile
from pathlib import Path
sys.dont_write_bytecode = True
HERE = Path(__file__).resolve().parent
DIRECTORY = 'research/pump-admin-wallet-guard-20261028'

def require(ok, message):
    if not ok:
        raise ValueError(message)
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def read(path):
    raw = path.read_bytes()
    return json.loads(gzip.decompress(raw) if path.suffix == '.gz' else raw)
def inventory(root):
    return {path.relative_to(root).as_posix(): sha(path) for path in root.rglob('*') if path.is_file()}
def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result
def scoped_files(repo, scopes):
    result = {}
    for scope in scopes:
        directory = repo / scope['root']
        excluded = [repo / name for name in scope.get('exclude', [])]
        for path in directory.rglob('*'):
            if any(path == item or path.is_relative_to(item) for item in excluded):
                continue
            require(not path.is_symlink(), 'symlink in selected proof scope')
            if path.is_file():
                result[path.relative_to(repo).as_posix()] = sha(path)
    return result
def source_inputs(source, repo, tools):
    scanner = module('admin_selected_source_scanner', tools / 'build_source_manifest.py')
    mapping = scanner.source_manifest(source, source, repo, cwd=source)
    return {(repo / name).relative_to(source).as_posix(): digest for name, digest in mapping.items()}
def archive_inputs(path):
    result = {}
    with tarfile.open(path, 'r:gz') as archive:
        for item in archive:
            require(item.isfile() and item.name not in result and not item.name.startswith('/') and '..' not in Path(item.name).parts, 'unsafe source archive')
            result[item.name] = archive.extractfile(item).read()
    return result
def verify(repo, source=None, check_canonical_admin=False):
    repo = Path(repo).resolve()
    packet = repo / DIRECTORY
    manifest = read(packet / 'manifest.json')
    files = scoped_files(repo, manifest['scopes'])
    files.pop(DIRECTORY + '/manifest.json', None)
    files.update({name: sha(repo / name) for name in manifest['extra_files']})
    require(files == manifest['files'], 'selected packet membership or bytes changed')
    selection = read(packet / 'selection.json')
    for name, digest in selection['dependency_files'].items():
        require(sha(repo / name) == digest, 'immutable reference changed: ' + name)
    expected = read(packet / 'build-inputs.json')
    parent_builder = (repo / 'research/pump-create-used-boundaries-20261028/build.py').read_text()
    needle = "expected=json.loads((P/'builds/primary/build-comparison.json').read_text())"
    derived = parent_builder.replace(needle, "expected=json.loads((P/'build-inputs.json').read_text())")
    needle = 'primary_before=source_manifest(primary,primary,R,cwd=primary)'
    derived = derived.replace(needle, needle + "\nassert {str((R/name).relative_to(primary)):digest for name,digest in primary_before.items()}==expected['source_inputs'], 'Actual maintained compiler inputs differ from selected source'")
    require((packet / 'build.py').read_text() == derived, 'cold compiler recipe changed beyond the two explicit selector/input checks')
    require(inventory(packet / 'source') == expected['source_inputs'] and len(expected['source_inputs']) == 65, 'retained source differs')
    selected_source = Path(source).resolve() if source else packet / 'source'
    require(source_inputs(selected_source, repo, packet / 'tools') == expected['source_inputs'], 'provided compiler source differs')
    before = read(packet / 'source-inputs.json')['before_inputs']
    after = expected['source_inputs']
    changed = [name for name in before if before[name] != after[name]]
    require(before.keys() == after.keys() and changed == ['src/creator/admin_cto.rs'], 'source scope widened')
    baseline_source = repo / selection['baseline_source']
    require(inventory(baseline_source) == before, 'qualified baseline source changed')
    original_text = (baseline_source / changed[0]).read_text()
    corrected_text = (packet / 'source' / changed[0]).read_text()
    require(original_text.count('\n') == corrected_text.count('\n') == 775 and
        original_text[original_text.index('\nfn token_frozen'):] == corrected_text[corrected_text.index('\nfn token_frozen'):], 'exact reader helpers or inherited source coordinates changed')
    if check_canonical_admin:
        require(sha(repo / 'programs/pump/src/creator/admin_cto.rs') == after[changed[0]], 'maintained admin source differs')
    warm = repo / selection['warm_directory']
    cold = repo / selection['cold_directory']
    actual = read(warm / 'build-receipt.json')
    require(actual['ok'] and actual['runtime_valid'] and not actual['stack_warnings'], 'warm compilation failed')
    require(actual['source_before'] == actual['source_after'] == after and actual['tools_before'] == actual['tools_after'], 'actual warm inputs changed')
    require(all(actual[name] for name in ['target_libraries_unchanged', 'registry_unchanged', 'external_dependencies_unchanged']), 'warm external inputs changed')
    require(actual['fresh_local_compilations'] == {'pump-recovered': 1, 'pump-token-ext': 1}, 'warm local compilation missing')
    require(sha(warm / 'executed-controller.py') == actual['controller_sha256'] and
        sha(warm / 'executed-fastbuild.py') == actual['tools_before']['fastbuild'], 'executed warm controllers changed')
    require(inventory(warm / 'executed-tools') == actual['analysis_tools'], 'executed census code changed')
    archived = archive_inputs(warm / 'compiled-workspace.tar.gz')
    require({name: hashlib.sha256(value).hexdigest() for name, value in archived.items()} == actual['compiled_workspace_inputs'], 'actual compiled archive changed')
    require(inventory(repo / selection['warm_snapshot']) == after, 'actual standalone snapshot changed')
    # Prove the actual manifest split, not a current-source restaging fiction.
    text = (packet / 'source/Cargo.toml').read_text()
    profile, workspace = text.index('[profile.release]'), text.index('[workspace]')
    staged = {'programs/pump/' + name: (packet / 'source' / name).read_bytes() for name in after if name not in ['Cargo.toml', 'Cargo.lock']}
    staged['programs/pump/Cargo.toml'] = (text[:profile].rstrip() + '\n').encode()
    staged['Cargo.toml'] = ('[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n' + text[profile:workspace].strip() + '\n').encode()
    staged['Cargo.lock'] = (packet / 'source/Cargo.lock').read_bytes()
    require(archived == staged and inventory(warm / 'compiled') == actual['compiled_workspace_inputs'], 'actual standalone/workspace projection differs')
    for filename in ['build-comparison.json', 'build-attempt.json']:
        envelope = read(warm / filename)
        require(envelope['schema'] == 'ACTUAL_NEW_BUILD_RUNTIME_BINDING_ENVELOPE_V1' and
            envelope['returncode'] == 0 and envelope['source_unchanged'] and
            envelope['old_compiler_receipt_reused_or_relabelled'] is False and 'portable_source_binding' not in envelope, 'runtime envelope was relabeled')
        for name in ['actual_compiler_receipt', 'actual_compiled_workspace_archive', 'runtime_adapter']:
            reference = envelope[name]
            require(sha(repo / reference['path']) == reference['sha256'], 'actual receipt/adapter envelope binding differs')
        require(envelope['source_sha256'] == envelope['source_after_sha256'], 'runtime source map differs')
        require(all(sha(repo / name) == digest for name, digest in envelope['source_sha256'].items()), 'materialized actual compiler inputs changed')
    repeat = read(cold / 'build-comparison.json')
    require(repeat['returncode'] == 0 and repeat['cold_empty_target'] is True and repeat['target_existed_before'] is False and
        repeat['qualified_image_hashes_equal'] is True, 'genuine empty-target repeat missing')
    require(all(repeat[name] for name in ['source_unchanged', 'tools_unchanged', 'sdk_rust_libraries_unchanged', 'registry_sources_unchanged', 'target_libraries_unchanged']), 'cold build input immutability failed')
    require(repeat['tool_sha256'] == expected['tool_sha256'] and repeat['target_libraries_sha256'] == expected['target_libraries_sha256'] and
        repeat['source_wrapper_sha256'] == expected['source_wrapper_sha256'], 'qualified cold recipe inputs differ')
    require(repeat['source_sha256'] == repeat['source_after_sha256'] and repeat['primary_source_sha256'] == repeat['primary_source_after_sha256'], 'cold compiled inputs changed')
    require(all(sha(repo / name) == digest for name, digest in repeat['source_sha256'].items()), 'cold actual compiled source differs')
    require({(repo / name).relative_to(packet / 'source').as_posix(): digest for name, digest in repeat['primary_source_sha256'].items()} == after, 'cold standalone source differs')
    require(sha(cold / 'executed-builder.py') == sha(packet / 'build.py') == repeat['builder_sha256'], 'executed cold controller differs')
    require(sha(cold / 'registry-authentication.json') == repeat['registry_authentication_sha256'] and sha(cold / 'build.log') == repeat['build_log_sha256'], 'cold authentication/log binding differs')
    log = (cold / 'build.log').read_text()
    require('exceeded max offset' not in log and all(sum(('Compiling ' + name + ' ') in line for line in log.splitlines()) == 1 for name in ['pump-recovered', 'pump-token-ext']), 'fresh cold local compilations missing')
    for name, digest in [('candidate.so', selection['candidate_sha256']), ('unstripped.so', selection['unstripped_sha256'])]:
        require((warm / name).read_bytes() == (cold / name).read_bytes() and sha(warm / name) == digest, 'whole fresh compiler outputs differ')
    require(actual['candidate_sha256'] == repeat['comparison']['candidate_sha256'] == expected['comparison']['candidate_sha256'] == selection['candidate_sha256'], 'selected image binding differs')
    require(actual['unstripped_sha256'] == repeat['unstripped_sha256'] == expected['unstripped_sha256'] == selection['unstripped_sha256'], 'compiler symbol ELF binding differs')
    sys.path.insert(0, str(packet / 'tools'))
    census = module('selected_admin_census', packet / 'tools/census.py')
    census.ROOT = repo
    current = census.census(warm / 'unstripped.so')
    baseline = census.census(repo / selection['baseline_symbols'])
    for name in ['normalized', 'raw']:
        require(current['counts'][name] == baseline['counts'][name] == (1019 if name == 'normalized' else 188), 'window count changed')
    for predicate in ['normalized_matches', 'raw_match']:
        require({row['start'] for row in current['windows'] if row[predicate]} == {row['start'] for row in baseline['windows'] if row[predicate]}, 'complete window membership changed')
    require(not next(row for row in current['windows'] if row['start'] == 0x22a10)['normalized_matches'], 'unproved exact admin window claim')
    facts = read(packet / 'analysis/original-cfg-facts.json')
    original = (repo / 'evidence/original/pump/deployed.so').read_bytes()
    require(hashlib.sha256(original).hexdigest() == facts['original_sha256'], 'original CFG reference changed')
    for row in facts['instructions']:
        address = int(row['address'], 16)
        opcode, registers, offset, immediate = struct.unpack_from('<BBhi', original, address)
        require((hex(opcode), hex(registers), offset, immediate) == (row['opcode'], row['registers'], row['offset'], row['immediate']), 'original instruction observation changed')
        if 'branch_target' in row:
            require(hex(address + 8 + offset * 8) == row['branch_target'], 'original branch target differs')
        if 'call_target' in row:
            require(hex(address + 8 + immediate * 8) == row['call_target'], 'original call target differs')
    runtime = read(packet / 'runtime-verification.json')
    require(runtime['status'] == 'PASS_NEW_ADMIN_WALLET_RUNTIME' and runtime['candidate_sha256'] == selection['candidate_sha256'] and
        runtime['broad'] == {'case_pairs': 10468, 'serialized_transaction_fields': 18343, 'signature_fields': 27875} and
        runtime['total_serialized_transaction_fields'] == 19159 and runtime['total_signature_fields'] == 29503, 'runtime/signature qualification differs')
    for name, digest in runtime['input_sha256'].items():
        require(sha(repo / name) == digest, 'runtime verifier input differs')
    ordered = lambda value: [line for line in value['logs'] if line.startswith(('Program log: ', 'Program data: '))]
    for name, expected_count in [('witnesses', 18), ('admin', 363), ('holder', 12)]:
        report = read(repo / selection[name])
        require(report['case_count'] == expected_count, 'strict focused inventory differs')
        for row in report['cases']:
            x, y = row['original'], row['candidate']
            require(all(x[key] == y[key] for key in ['error', 'before', 'after', 'events', 'inner', 'return']) and ordered(x) == ordered(y), 'strict focused runtime observation differs')
    require(len(read(repo / selection['witnesses'])['baseline_mismatches']) == 8, 'counterexample control missing')
    return {'status': 'PASS_ADMIN_WALLET_SOURCE_CORRECTION', 'source_files': 65, 'actual_compiler_workspace_inputs': 66,
        'fresh_builds': 2, 'empty_target_repeat': True, 'candidate_sha256': selection['candidate_sha256'],
        'normalized': 1019, 'raw': 188, 'normalized_window_gain': 0, 'remaining_pump_windows': 16,
        'canonical_admin_checked': check_canonical_admin, 'whole_canonical_source_checked': selected_source == repo / 'programs/pump',
        'full44_cases': 10468, 'new_witness_cases': 18, 'control_witness_mismatches': 8,
        'strict_admin_cases': 363, 'strict_holder_cases': 12, 'retained_signature_fields': 29503,
        'compiler_or_vm_executed_by_verifier': False}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, default=HERE.parents[1])
    parser.add_argument('--source-directory', type=Path)
    parser.add_argument('--check-canonical-admin', action='store_true')
    args = parser.parse_args()
    print(json.dumps(verify(args.repo, args.source_directory, args.check_canonical_admin), indent=2))
