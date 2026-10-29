#!/usr/bin/env python3
"""Restore native macOS artifacts and run their own complete offline corpus."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys
import tarfile

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / 'work/pump-macos-frontier-inputs'
BUILD = ROOT / 'work/pump-macos-qualification/candidate'
OUT = ROOT / 'work/pump-macos-frontier-runtime/evidence'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    manifest = json.loads((INPUT / 'MANIFEST.json').read_text())
    assert all(sha(INPUT / name) == digest for name, digest in manifest.items())
    BUILD.mkdir(parents=True, exist_ok=False)
    OUT.mkdir(parents=True, exist_ok=False)
    for name in ('candidate.so', 'unstripped.so', 'build-comparison.json',
                 'build-attempt.json'):
        (BUILD / name).write_bytes(gzip.decompress(
            (INPUT / 'candidate' / (name + '.gz')).read_bytes()))
    source = BUILD / 'source'
    source.mkdir()
    with tarfile.open(INPUT / 'candidate/compiled-source.tar.gz') as archive:
        archive.extractall(source, filter='data')
    record = json.loads((BUILD / 'build-comparison.json').read_text())
    assert record['returncode'] == 0 and record['source_unchanged']
    assert sha(BUILD / 'candidate.so') == record['comparison']['candidate_sha256']
    assert all(sha(ROOT / name) == digest
               for name, digest in record['source_sha256'].items())
    binding = {'candidate_sha256': sha(BUILD / 'candidate.so'),
               'native_artifact_manifest_sha256': sha(INPUT / 'MANIFEST.json'),
               'native_revision': (INPUT / 'revision.txt').read_text().strip(),
               'native_build_record_sha256': sha(BUILD / 'build-comparison.json'),
               'compiled_source_sha256': record['source_sha256']}
    (OUT / 'native-input-binding.json').write_text(json.dumps(binding, indent=2) + '\n')
    subprocess.run([
        sys.executable, '-B', str(ROOT / 'scripts/pump_validate_parallel.py'),
        '--candidate', str(BUILD / 'candidate.so'),
        '--source-directory', str(source / 'programs/pump'),
        '--build-comparison', str(BUILD / 'build-comparison.json'),
        '--workers', '4', '--captured-loader',
        '--output', str(OUT / 'full.json.gz'),
    ], cwd=ROOT, check=True)
    subprocess.run([
        sys.executable, '-B', str(ROOT / 'scripts/pump_with_captured_loader.py'),
        '--receipt', str(OUT / 'recipients.loader.json'),
        str(ROOT / 'scripts/pump_buyback_recipient_differential.py'),
        '--candidate', str(BUILD / 'candidate.so'),
        '--output', str(OUT / 'recipients.json'),
    ], cwd=ROOT, check=True)
    migration_reports = {}
    for label, script, count in [
        ('legacy_migration_quote', 'pump_migration_quote_differential.py', 20),
        ('v2_migration_quote', 'pump_migration_v2_quote_differential.py', 40),
    ]:
        output = OUT / (label + '.json.gz')
        subprocess.run([
            sys.executable, '-B', str(ROOT / 'scripts/pump_with_captured_loader.py'),
            '--receipt', str(OUT / (label + '.loader.json')),
            str(ROOT / 'scripts' / script), '--candidate', str(BUILD / 'candidate.so'),
            '--output', str(output),
        ], cwd=ROOT, check=True)
        report = json.loads(gzip.decompress(output.read_bytes()))
        assert report['candidate_sha256'] == binding['candidate_sha256']
        assert report['case_count'] == count and not report['mismatches']
        assert not report['diagnostics']['mismatches']
        assert report['diagnostics']['log_bearing_cases'] == count
        migration_reports[label] = count
    full = json.loads(gzip.decompress((OUT / 'full.json.gz').read_bytes()))
    recipients = json.loads((OUT / 'recipients.json').read_text())
    assert len(full['suites']) == 44 and full['case_count'] == 10468
    assert not full['mismatches'] and not full['diagnostics']['mismatches']
    assert full['diagnostics']['log_bearing_cases'] == 10464
    assert recipients['case_count'] == 42 and not recipients['mismatches']
    assert full['candidate_sha256'] == recipients['candidate_sha256'] == binding['candidate_sha256']
    (OUT / 'qualification.json').write_text(json.dumps({
        'status': 'passed', 'candidate_sha256': binding['candidate_sha256'],
        'corpus_suites': 44, 'corpus_cases': 10468,
        'targeted_migration_cases': migration_reports,
        'corpus_diagnostic_mismatches': 0, 'targeted_recipient_cases': 42,
        'scope': 'Separate bounded suites; their control cases can overlap. Whole original ELF equality is not established.',
    }, indent=2) + '\n')
    (OUT / 'MANIFEST.json').write_text(json.dumps({
        path.relative_to(OUT).as_posix(): sha(path)
        for path in sorted(OUT.rglob('*')) if path.is_file()
    }, indent=2) + '\n')


if __name__ == '__main__':
    main()
