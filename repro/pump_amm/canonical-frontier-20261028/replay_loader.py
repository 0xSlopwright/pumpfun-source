#!/usr/bin/env python3
"""Refresh equal-allocation, captured upgradeable and cache controls for r13."""
from pathlib import Path
import argparse
import gzip
import json
import os
import subprocess

P = Path(__file__).resolve().parent


def require(value, message):
    if not value:
        raise RuntimeError(message)


def run(output, runtime_root, python, candidate=None):
    output = Path(output).absolute()
    require(not output.exists(), 'Loader replay output must be new')
    output.mkdir(parents=True)
    capture = output / 'capture'
    capture.mkdir()
    base = P / 'results/loader'
    for item in (base/'capture').iterdir():
        raw = gzip.decompress(item.read_bytes()) if item.suffix == '.gz' else item.read_bytes()
        (capture/(item.name[:-3] if item.suffix == '.gz' else item.name)).write_bytes(raw)
    candidate = Path(candidate).resolve() if candidate is not None else P/'results/build-a/candidate.so'
    env = dict(os.environ, AMM_RUNTIME_ROOT=str(Path(runtime_root).resolve()), AMM_CAPTURE_ROOT=str(capture),
               AMM_CANDIDATE=str(candidate), AMM_CACHE_OUTPUT=str(output/'cache-controls.json'))
    for name, allocation in [('allocation-small', candidate.stat().st_size), ('allocation-large', 10485715), ('upgradeable', None)]:
        if allocation is not None:
            env['AMM_CONTROL_ALLOCATION'] = str(allocation)
        observer = base/'producers'/('observe-upgradeable.py' if allocation is None else 'observe-allocation.py')
        producer = base/'producers'/('upgradeable.py' if allocation is None else 'allocation.py')
        command = [str(python), '-B', str(observer), str(output/(name+'-transactions.json.gz')),
                   str(producer), '--candidate', str(candidate), '--output', str(output/(name+'.json'))]
        with (output/(name+'.log')).open('wb') as log:
            subprocess.run(command, env=env, stdout=log, stderr=subprocess.STDOUT, check=True)
    subprocess.run([str(python), '-B', str(base/'producers/cache.py')], env=env, check=True)
    print(json.dumps({'loader_output': str(output), 'candidate': str(candidate)}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--runtime-root', type=Path, required=True, help='Extracted frozen full-corpus input root')
    parser.add_argument('--python', type=Path, required=True)
    parser.add_argument('--candidate', type=Path)
    args = parser.parse_args()
    run(args.output, args.runtime_root, args.python, args.candidate)
