#!/usr/bin/env python3
"""Replay all 25 frozen maintained suites on the selected canonical AMM artifact."""
from pathlib import Path
import argparse
import hashlib
import io
import json
import subprocess
import tarfile

P = Path(__file__).resolve().parent


def require(value, message):
    if not value:
        raise RuntimeError(message)


def replay(output, python):
    output = Path(output).absolute()
    require(not output.exists(), 'Replay output must be new')
    output.mkdir(parents=True)
    root = output / 'inputs'
    root.mkdir()
    inventory = json.loads((P / 'results/runtime/input-sha256.json').read_text())
    with tarfile.open(P / 'results/runtime/inputs.tar.gz') as archive:
        actual = {}
        for item in archive:
            require(item.isfile() and not item.name.startswith('/') and '..' not in Path(item.name).parts, "Input validation failed: item.isfile() and not item.name.startswith('/') and '..' not in Path(item.name).parts")
            require(item.name not in actual, 'Input validation failed: item.name not in actual')
            raw = archive.extractfile(item).read()
            actual[item.name] = hashlib.sha256(raw).hexdigest()
            target = root / item.name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(raw)
    require(actual == inventory, 'Input validation failed: actual == inventory')
    candidate = P / 'results/build-a/candidate.so'
    frozen = root / 'work/selected-candidate.so'
    require(frozen.read_bytes() == candidate.read_bytes(), 'Input validation failed: frozen.read_bytes() == candidate.read_bytes()')
    command = [str(python), '-B', str(root / 'research/claude-amm-union12-20261028/runtime/replay_parallel.py'),
               '--candidate', str(candidate), '--output', str(output / 'receipts')]
    subprocess.run(command, cwd=root, check=True)
    print(json.dumps({'runtime': str(output / 'receipts'), 'input_files': len(actual)}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--python', type=Path, required=True, help='Python environment with solders 0.27.1')
    args = parser.parse_args()
    replay(args.output, args.python)
