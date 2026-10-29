#!/usr/bin/env python3
"""Verify the final source65 actual empty-target repeat; no compiler or VM."""
import argparse, hashlib, json
from pathlib import Path
HERE = Path(__file__).resolve().parent
def require(ok, message):
    if not ok:
        raise ValueError(message)
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def read(path):
    return json.loads(path.read_text())
def inventory(root):
    return {p.relative_to(root).as_posix(): sha(p) for p in root.rglob('*') if p.is_file()}
def files(packet):
    excluded = [packet / 'builds/cold-01/target', packet / 'builds/cold-01/profile-sdk']
    return {p.relative_to(packet).as_posix(): sha(p) for p in packet.rglob('*') if p.is_file() and p != packet / 'manifest.json' and not any(p.is_relative_to(x) for x in excluded)}
def verify(repo):
    repo = Path(repo).resolve()
    packet = repo / 'research/pump-final-composition-cold-20261028'
    require(files(packet) == read(packet / 'manifest.json')['files'], 'cold packet membership or bytes differ')
    refs = read(packet / 'warm-references.json')
    expected = read(packet / 'build-inputs.json')
    for name in ['warm_candidate', 'warm_symbols', 'actual_warm_receipt', 'source_parent_manifest']:
        require(sha(repo / refs[name]['path']) == refs[name]['sha256'], 'actual warm/source reference differs')
    parent = repo / expected['qualified_parent']['path']
    require(sha(parent / 'manifest.json') == expected['qualified_parent']['manifest_sha256'], 'qualified cold ancestor changed')
    require(sha(packet / 'build.py') == sha(parent / 'build.py') == refs['cold_controller_sha256'], 'cold controller differs from actually executed qualified ancestor')
    require(refs['old_compiler_receipt_relabelled'] is False and refs['cold_controller_changed'] is False, 'receipt/controller boundary changed')
    require(inventory(packet / 'source') == inventory(repo / refs['source']) == expected['source_inputs'] == refs['source_inputs'] and len(refs['source_inputs']) == 65, 'final frozen compiler source differs')
    warm = read(repo / refs['actual_warm_receipt']['path'])
    require(warm['returncode'] == 0 and warm['source_unchanged'] and warm['comparison']['candidate_sha256'] == refs['warm_candidate']['sha256'] and warm['unstripped_sha256'] == refs['warm_symbols']['sha256'], 'actual successful warm result differs')
    require(warm['primary_source_sha256'] == warm['primary_source_after_sha256'] == {refs['source'] + '/' + name: value for name, value in refs['source_inputs'].items()}, 'warm input source projection differs')
    cold = packet / 'builds/cold-01'
    record = read(cold / 'build-comparison.json')
    require(record == read(cold / 'build-attempt.json') and record['returncode'] == 0 and record['cold_empty_target'] is True and record['target_existed_before'] is False and record['qualified_image_hashes_equal'] is True, 'actual empty-target result missing')
    for name in ['source_unchanged', 'tools_unchanged', 'sdk_rust_libraries_unchanged', 'registry_sources_unchanged', 'target_libraries_unchanged']:
        require(record[name], 'cold input immutability failed: ' + name)
    require(record['tool_sha256'] == expected['tool_sha256'] and record['target_libraries_sha256'] == expected['target_libraries_sha256'] and record['source_wrapper_sha256'] == expected['source_wrapper_sha256'], 'qualified tool/library/registry recipe differs')
    require(record['source_sha256'] == record['source_after_sha256'] and record['primary_source_sha256'] == record['primary_source_after_sha256'], 'compiler input source changed')
    require(all(sha(repo / name) == value for name, value in record['source_sha256'].items()), 'actual staged compiler inputs differ')
    require({str((repo / name).relative_to(packet / 'source')): value for name, value in record['primary_source_sha256'].items()} == expected['source_inputs'], 'actual selected primary source differs')
    require(sha(cold / 'executed-builder.py') == sha(packet / 'build.py') == record['builder_sha256'] and sha(cold / 'build.log') == record['build_log_sha256'], 'executed controller/log binding differs')
    require(sha(cold / 'registry-authentication.json') == record['registry_authentication_sha256'], 'registry authentication receipt differs')
    auth = read(cold / 'registry-authentication.json')
    require(len(auth['locked_registry_archives']) == 254 and auth['files_checked'] == 4176, 'authenticated locked registry inventory differs')
    log = (cold / 'build.log').read_text()
    require('exceeded max offset' not in log and all(sum(('Compiling ' + name + ' ') in row for row in log.splitlines()) == 1 for name in ['pump-recovered', 'pump-token-ext']), 'local cold compilations missing')
    for name, reference in [('candidate.so', refs['warm_candidate']), ('unstripped.so', refs['warm_symbols'])]:
        require(sha(cold / name) == reference['sha256'] and (cold / name).read_bytes() == (repo / reference['path']).read_bytes(), 'literal complete fresh compiler output differs')
    return {'status': 'PASS_FINAL673_ACTUAL_EMPTY_TARGET_REPEAT', 'source_files': 65, 'actual_staged_inputs': len(record['source_sha256']),
        'candidate_sha256': refs['warm_candidate']['sha256'], 'unstripped_sha256': refs['warm_symbols']['sha256'],
        'empty_target': True, 'locked_registry_archives': 254, 'authenticated_registry_files': 4176,
        'compiler_or_vm_executed_by_verifier': False, 'new_window_or_runtime_coverage_claimed_by_cold_packet': False}
if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--repo', type=Path, default=HERE.parents[1])
    a = p.parse_args()
    print(json.dumps(verify(a.repo), indent=2))
