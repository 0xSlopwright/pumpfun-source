#!/usr/bin/env python3
"""Run unchanged authenticated loader producers on the supplied fresh ELF."""
import argparse
import gzip
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys


def require(ok, message):
    if not ok:
        raise ValueError(message)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(repo, candidate, runtime_root, output):
    require(__debug__, 'Fresh loader producers require normal Python')
    repo, candidate, runtime_root, output = [p.resolve() for p in (repo, candidate, runtime_root, output)]
    parent = repo/'repro/pump_amm/canonical-frontier-20261028'
    require(sha(parent/'MANIFEST.json') == 'd05b92a344e1e095e6f68276eb50ddc64a36a0792ac20cb0e7c31c6f6f384489', 'Parent manifest changed')
    inventory = json.loads((parent/'MANIFEST.json').read_text())
    inventory = inventory.get('files', inventory)
    require(not output.exists(), 'Loader output must be new')
    output.mkdir(parents=True)
    base = output/'results/loader'
    inputs = {}
    names = ['audit_runtime.py', 'loader_recipe.py'] + [p.relative_to(parent).as_posix()
        for directory in ('producers', 'origin', 'capture')
        for p in (parent/'results/loader'/directory).rglob('*') if p.is_file()]
    for name in names:
        source = parent/name
        expected = inventory[name]
        expected = expected['sha256'] if isinstance(expected, dict) else expected
        require(not source.is_symlink() and sha(source) == expected, 'Parent loader input changed: '+name)
        target = output/name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
        inputs[name] = expected
    capture = output/'capture'
    capture.mkdir()
    for name in ('capture.json', 'program-account.bin', 'programdata-account.bin'):
        source = base/'capture'/name
        if source.is_file():
            (capture/name).write_bytes(source.read_bytes())
        else:
            (capture/name).write_bytes(gzip.decompress(source.with_name(name+'.gz').read_bytes()))
    original = runtime_root/'evidence/original/pump_amm/deployed.so'
    require(sha(original) == '6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7', 'Runtime original changed')
    candidate_before = sha(candidate)
    environment = {**os.environ, 'PUMP_AMM_FRESH_VM': '1', 'AMM_RUNTIME_ROOT': str(runtime_root),
        'AMM_CAPTURE_ROOT': str(capture), 'AMM_CANDIDATE': str(candidate),
        'AMM_CACHE_OUTPUT': str(base/'cache-controls.json')}
    producers = base/'producers'
    commands = []
    for mode, length in (('allocation-small', candidate.stat().st_size), ('allocation-large', original.stat().st_size), ('upgradeable', None)):
        kind = 'upgradeable' if length is None else 'allocation'
        env = dict(environment)
        if length is not None:
            env['AMM_CONTROL_ALLOCATION'] = str(length)
        plain = base/(mode+'.json')
        command = [sys.executable, '-B', str(producers/('observe-'+kind+'.py')),
            str(base/(mode+'-transactions.json.gz')), str(producers/(kind+'.py')),
            '--candidate', str(candidate), '--output', str(plain)]
        with (base/(mode+'.log')).open('w') as log:
            subprocess.run(command, env=env, stdout=log, stderr=subprocess.STDOUT, check=True)
        plain.with_name(plain.name+'.gz').write_bytes(gzip.compress(plain.read_bytes(), mtime=0))
        plain.unlink()
        commands.append(command)
    command = [sys.executable, '-B', str(producers/'cache.py')]
    with (base/'cache.log').open('w') as log:
        subprocess.run(command, env=environment, stdout=log, stderr=subprocess.STDOUT, check=True)
    commands.append(command)
    require(candidate_before == sha(candidate), 'Candidate changed during loader replay')
    require(all(sha(output/name) == expected for name, expected in inputs.items()), 'Loader inputs changed during execution')
    spec = importlib.util.spec_from_file_location('frozen_loader_audit', parent/'verify_loader.py')
    verifier = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(verifier)
    report = verifier.verify(output, original, candidate, signatures=True)
    (output/'audit.json').write_text(json.dumps(report, indent=2)+'\n')
    (output/'launch.json').write_text(json.dumps({'commands': commands, 'candidate_sha256': candidate_before,
        'controller_sha256': sha(Path(__file__)), 'unchanged_parent_inputs': inputs,
        'producer_logic_changed': False}, indent=2)+'\n')
    print(json.dumps(report))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ('repo', 'candidate', 'runtime-root', 'output'):
        parser.add_argument('--'+name, type=Path, required=True)
    args = parser.parse_args()
    run(args.repo, args.candidate, args.runtime_root, args.output)
