#!/usr/bin/env python3
"""Run unchanged current673 CTO18 fixtures against explicitly bound actual images."""
import argparse
import hashlib
import importlib.metadata
import json
from pathlib import Path
import subprocess
import sys

from verify_results import read, require, verify

P = Path(__file__).resolve().parent
sha = lambda path: hashlib.sha256(Path(path).read_bytes()).hexdigest()


def check_inputs(repo):
    manifest = read(P / 'INPUTS.json')
    for name, row in manifest['files'].items():
        require(sha(repo / name) == row['sha256'], 'frozen tool/capture changed: ' + name)
    require(sha(P / 'cases.json') == manifest['fixtures']['cases_sha256'], 'case catalog binding')
    require(sha(sys.executable) == manifest['toolchain']['python_executable_sha256'], 'Python executable changed')
    require(importlib.metadata.version('solders') == manifest['toolchain']['solders_version'], 'solders version changed')
    import solders.solders as native
    require(sha(native.__file__) == manifest['toolchain']['solders_native_sha256'], 'actual LiteSVM/native tool changed')
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, default=P.parents[2])
    parser.add_argument('--candidate', type=Path)
    parser.add_argument('--candidate-sha256')
    parser.add_argument('--control', type=Path, default=P.parents[2]/'research/pump-final-composition-673-20261028/artifacts/candidate.so')
    parser.add_argument('--source', type=Path, default=P.parent/'source/admin_cto.rs')
    parser.add_argument('--build-record', type=Path)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--check-inputs', action='store_true')
    args = parser.parse_args()
    require(__debug__, 'run without -O; original producer/loader contain assertions')
    repo = args.repo.resolve()
    manifest = check_inputs(repo)
    if args.check_inputs:
        print(json.dumps({'frozen_inputs': len(manifest['files']), 'cases': 18, 'candidate_executed': False}, indent=2))
        return
    require(args.candidate is not None and args.candidate_sha256 is not None and args.build_record is not None and args.output is not None, 'actual candidate, hash, build record and fresh output required')
    candidate, control, source, record, out = [path.resolve() for path in [args.candidate, args.control, args.source, args.build_record, args.output]]
    require(sha(candidate) == args.candidate_sha256, 'actual candidate hash')
    require(sha(control) == manifest['current_control_sha256'], 'current673 control hash')
    require(sha(source) == manifest['candidate_source_sha256'], 'exact frozen f4a2bb7d source')
    require(not out.exists(), 'retain prior outputs; choose a new directory')
    out.mkdir(parents=True)
    tracked = {str(path): sha(path) for path in [candidate, control, source, record, Path(__file__), P/'verify_results.py', P/'INPUTS.json']}
    producer = repo / 'research/pump-migration-completion-20261028/probe_admin_wallet_coin_guard.py'
    command = [sys.executable, '-B', str(repo/'scripts/pump_with_captured_loader.py'), '--receipt', str(out/'loader.json'), str(producer), '--baseline', str(control), '--candidate', str(candidate), '--output', str(out/'report.json.gz')]
    with (out / 'producer.log').open('w') as log:
        completed = subprocess.run(command, cwd=repo, stdout=log, stderr=subprocess.STDOUT)
    binding = {'command': command, 'returncode': completed.returncode, 'input_sha256': tracked,
               'controller_sha256': sha(Path(__file__)), 'frozen_manifest_sha256': sha(P/'INPUTS.json'),
               'candidate_sha256': args.candidate_sha256, 'source_sha256': manifest['candidate_source_sha256'],
               'build_record_binding': 'exact provided bytes retained by hash; independent official build-receipt verification still required',
               'Source_normalization': None}
    (out / 'execution.json').write_text(json.dumps(binding, indent=2) + '\n')
    check_inputs(repo)
    require(all(sha(path) == digest for path, digest in tracked.items()), 'input changed during replay')
    result = verify(read(out/'report.json.gz'), read(out/'loader.json'), sha(control), sha(candidate), repo=repo)
    require(completed.returncode == 0, 'producer failed; raw outputs retained')
    (out/'VERIFIED.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
