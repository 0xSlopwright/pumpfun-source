"""Run unchanged signed route probes against an explicitly supplied candidate."""
from pathlib import Path
import argparse, concurrent.futures, hashlib, importlib.metadata, json, os, shutil, subprocess, sys, tempfile, time, types
sys.dont_write_bytecode = True
_kit = Path(__file__).resolve().parent
_verifier_bytes = (_kit / 'verify.py').read_bytes()
assert hashlib.sha256(_verifier_bytes).hexdigest() == json.loads((_kit / 'manifest.json').read_text())['files']['verify.py']
checks = types.ModuleType('checked_replay_verifier')
checks.__file__ = str(_kit / 'verify.py')
exec(compile(_verifier_bytes, checks.__file__, 'exec'), checks.__dict__)

def write_json(path, value):
    Path(path).write_text(json.dumps(value, indent=2) + '\n')

def repository_root(explicit):
    if explicit:
        candidates = [explicit.resolve()]
    else:
        candidates = [Path.cwd(), *Path.cwd().parents, *Path(__file__).resolve().parents]
    for candidate in candidates:
        if (candidate / 'evidence/original/pump_amm/deployed.so').is_file() and (candidate / 'scripts/pump_amm_admin_differential.py').is_file():
            return candidate
    raise RuntimeError('Pass --repo-root pointing to the original repository containing fixtures and captured programs.')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--candidate', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--repo-root', type=Path)
    parser.add_argument('--expected-sha256')
    parser.add_argument('--jobs', type=int, choices=range(1, 6), default=4)
    parser.add_argument('--allow-mismatches', action='store_true', help='Preserve and verify mismatch evidence without failing the run.')
    args = parser.parse_args()
    kit = Path(__file__).resolve().parent
    checks.check_manifest(kit)
    config = checks.load(kit / 'kit.json')
    root, candidate, output = repository_root(args.repo_root), args.candidate.resolve(), args.output.resolve()
    candidate_hash = checks.sha(candidate)
    if args.expected_sha256:
        assert candidate_hash == args.expected_sha256
    assert not output.exists(), 'Output must be a new directory; saved evidence is never overwritten.'
    source_before = {rel: checks.sha(root / rel) for rel in config['repository_inputs']}
    binaries_before = {rel: checks.sha(root / rel) for rel in config['runtime_binary_inputs']}
    assert source_before == config['repository_inputs'], 'Repository fixture/harness input changed; inspect before rerunning.'
    assert binaries_before == config['runtime_binary_inputs'], 'Captured original/dependency artifact changed.'
    output.mkdir(parents=True)
    shutil.copytree(kit, output / 'kit', ignore=shutil.ignore_patterns('__pycache__'))
    shutil.copy2(kit / 'verify.py', output / 'verify.py')
    (output / 'reports').mkdir()
    started = time.time()
    results = {}
    # Original producer code locates the repository two parents above its file.
    # A temporary direct child of work/ preserves that convention with exact bytes.
    with tempfile.TemporaryDirectory(prefix='amm-helper-replay-', dir=root / 'work') as temporary:
        stage = Path(temporary)
        for path in (kit / 'producers').iterdir():
            shutil.copy2(path, stage / path.name)
        shutil.copy2(kit / 'observer.py', stage / 'observer.py')
        def execute(spec):
            name = spec['name']
            command = [sys.executable, '-B', str(stage / 'observer.py'),
                       str(output / 'reports' / (name + '-transactions.json.gz')),
                       str(stage / spec['producer']), '--candidate', str(candidate),
                       '--output', str(output / 'reports' / (name + '.json.gz'))]
            begin = time.time()
            environment = dict(os.environ, PYTHONDONTWRITEBYTECODE='1',
                               PYTHONPYCACHEPREFIX=str(stage / 'empty-pycache'))
            with (output / 'reports' / (name + '.log')).open('wb') as log:
                process = subprocess.run(command, cwd=root, env=environment, stdout=log, stderr=subprocess.STDOUT)
            return name, {'returncode': process.returncode, 'elapsed_seconds': time.time() - begin,
                          'producer_sha256': checks.sha(stage / spec['producer']),
                          'observer_sha256': checks.sha(stage / 'observer.py')}
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.jobs) as pool:
            for name, result in pool.map(execute, config['suites']):
                results[name] = result
                print(json.dumps({'suite': name, **result}), flush=True)
        assert not (stage / 'empty-pycache').exists()
    record = {'schema': 1, 'runtime_executed': True, 'candidate_sha256': candidate_hash,
              'candidate_after_sha256': checks.sha(candidate), 'candidate_path': str(candidate),
              'repository_root': str(root), 'kit_manifest_sha256': checks.sha(kit / 'manifest.json'),
              'repository_inputs_before': source_before,
              'repository_inputs_after': {rel: checks.sha(root / rel) for rel in source_before},
              'runtime_binary_inputs_before': binaries_before,
              'runtime_binary_inputs_after': {rel: checks.sha(root / rel) for rel in binaries_before},
              'python': sys.version, 'python_executable': sys.executable,
              'solders_version': importlib.metadata.version('solders'), 'parallel_jobs': args.jobs,
              'bytecode_policy': 'Unique empty PYTHONPYCACHEPREFIX and PYTHONDONTWRITEBYTECODE=1; checked verifier/cleaner compiled directly from source bytes.',
              'elapsed_seconds': time.time() - started, 'suites': results}
    write_json(output / 'run.json', record)
    write_json(output / 'manifest.json', {'schema': 1, 'files': checks.inventory(output)})
    result = checks.verify(output, candidate, args.allow_mismatches)
    write_json(output / 'verification.json', result)
    write_json(output / 'manifest.json', {'schema': 1, 'files': checks.inventory(output)})
    assert checks.verify(output, candidate, args.allow_mismatches) == result
    print(json.dumps(result, indent=2))

if __name__ == '__main__':
    main()
