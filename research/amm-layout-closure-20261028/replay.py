#!/usr/bin/env python3
"""Run the frozen 25-suite harness against an explicitly supplied fresh image."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tarfile


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def replay(repo, candidate, output):
    repo, candidate, output = repo.resolve(), candidate.resolve(), output.resolve()
    parent = repo / 'repro/pump_amm/canonical-frontier-20261028'
    require(sha(parent/'MANIFEST.json') == 'd05b92a344e1e095e6f68276eb50ddc64a36a0792ac20cb0e7c31c6f6f384489', 'Parent proof changed')
    require(not output.exists(), 'Replay output must be new')
    root = output/'inputs'
    root.mkdir(parents=True)
    inventory = json.loads((parent/'results/runtime/input-sha256.json').read_text())
    actual = {}
    with tarfile.open(parent/'results/runtime/inputs.tar.gz') as archive:
        for item in archive:
            name = Path(item.name)
            require(item.isfile() and not name.is_absolute() and '..' not in name.parts and item.name not in actual, 'Unsafe archive member')
            raw = archive.extractfile(item).read()
            actual[item.name] = hashlib.sha256(raw).hexdigest()
            target = root/name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
    require(actual == inventory, 'Frozen runtime inputs changed')
    original_candidate = root/'work/selected-candidate.so'
    require(sha(original_candidate) == '15aadc37c6a4fb2148895eafa22a969f7ad28a363c8972a8fe526a015fa85d21', 'Frozen selection changed')
    before = sha(candidate)
    command = [sys.executable, '-B', str(root/'research/claude-amm-union12-20261028/runtime/replay_parallel.py'),
               '--candidate', str(candidate), '--output', str(output/'receipts')]
    (output/'launch.json').write_text(json.dumps({'command': command, 'candidate_sha256': before,
        'frozen_archive_sha256': sha(parent/'results/runtime/inputs.tar.gz'),
        'input_overlay': None, 'harness_logic_changed': False}, indent=2)+'\n')
    subprocess.run(command, cwd=root, check=True)
    require(before == sha(candidate), 'Candidate changed during replay')
    spec = importlib.util.spec_from_file_location('frozen_amm_runtime_audit', parent/'audit_runtime.py')
    audit = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(audit)
    result = audit.audit(output/'receipts', before, signatures=True)
    result['candidate_sha256'] = before
    (output/'audit.json').write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps(result))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--candidate', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    replay(args.repo, args.candidate, args.output)
