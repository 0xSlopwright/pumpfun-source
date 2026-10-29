#!/usr/bin/env python3
"""Fresh unchanged 21-suite corpus on an actual loader-produced Mayhem payload."""
import argparse, gzip, hashlib, json, os, subprocess, sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def require(ok, message):
    if not ok:
        raise ValueError(message)
def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--repo', type=Path, required=True)
    p.add_argument('--candidate', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    a = p.parse_args()
    repo, out, candidate = a.repo.resolve(), a.output.resolve(), a.candidate.resolve()
    out.mkdir(parents=True, exist_ok=False)
    require(sha(candidate) == '9af9e3b1cbc9d89340af4d9d46e4c88d3dc2fc67e0090f9370047d97532ff09d', 'candidate differs')
    loader = [sys.executable, '-B', str(HERE / 'execute_loader.py'), '--repo', str(repo), '--candidate', str(candidate), '--output', str(out / 'loader')]
    with (out / 'loader.log').open('wb') as log:
        require(subprocess.run(loader, cwd=repo, stdout=log, stderr=subprocess.STDOUT).returncode == 0, 'actual loader failed')
    payload = out / 'loader/payload.bin'
    require(payload.read_bytes() == (repo / 'evidence/original/mayhem/deployed.so').read_bytes(), 'allocation differs')
    # These are the retained corpus' cases and actual captured burn fixtures.
    seed = repo / 'repro/mayhem/compiler-v154-main/runtime135db/control/seed'
    burns = seed.parent / 'burn-fixtures'
    tasks = [(s, 'mayhem_validate_' + s + '.py', []) for s in ['admin', 'fee_recipient', 'extend', 'withdraw', 'quote_withdraw', 'sweeps']]
    tasks += [('sell', 'mayhem_sell_differential.py', []), ('buy', 'mayhem_buy_differential.py', ['--cases', str(repo / 'repro/mayhem/twenty/buy-cases.json')])]
    for kind, checkpoint in [('sell', 'twentyone'), ('buy', 'twentytwo')]:
        for family in ['native', 'token', 'token22']:
            tasks.append((kind + '-v2-' + family, 'mayhem_' + kind + '_v2_differential.py', ['--cases', str(repo / f'repro/mayhem/{checkpoint}/{kind}-v2-cases.json'), '--family', family]))
    for kind in ['buy', 'sell']:
        for family in ['native', 'token', 'token22']:
            tasks.append((kind + '-pump-swap-' + family, 'mayhem_pump_swap_differential.py', ['--cases', str(repo / f'repro/mayhem/twentyfour/{kind}-pump-swap-cases.json'), '--instruction', kind + '_pump_swap', '--family', family]))
    tasks.append(('burn', 'mayhem_burn_sequence.py', ['--fixtures', str(burns)]))
    script_paths = sorted((repo / 'scripts').glob('*mayhem*.py')) + [repo / 'scripts/pump_trade_fixture.py']
    scripts = {p.relative_to(repo).as_posix(): sha(p) for p in script_paths}
    plan = {'candidate': str(candidate), 'candidate_sha256': sha(candidate), 'loader_payload_sha256': sha(payload),
        'original_sha256': sha(repo / 'evidence/original/mayhem/deployed.so'), 'controller_sha256': sha(Path(__file__)),
        'script_inputs': scripts, 'jobs': [{'name': n, 'script': s, 'arguments': v} for n, s, v in tasks]}
    (out / 'launch.json').write_text(json.dumps(plan, indent=2) + '\n')
    results = []
    for name, script, arguments in tasks:
        result_path = out / (name if name == 'burn' else name + '.json')
        command = [sys.executable, '-B', str(HERE / 'observe_suite.py'), '--script', str(repo / 'scripts' / script), '--observations', str(out / (name + '-transactions.json.gz')),
            '--', '--candidate', str(payload), '--output', str(result_path), *arguments]
        with (out / (name + '.log')).open('wb') as log:
            rc = subprocess.run(command, cwd=repo, env={**os.environ, 'PYTHONDONTWRITEBYTECODE': '1'}, stdout=log, stderr=subprocess.STDOUT).returncode
        row = {'name': name, 'command': command, 'returncode': rc}
        if name != 'burn' and result_path.exists():
            data = result_path.read_bytes()
            report = json.loads(data)
            row.update(cases=report['case_count'], mismatches=report['mismatches'], successful_original_cases=report.get('successful_original_cases'))
            result_path.with_suffix('.json.gz').write_bytes(gzip.compress(data, mtime=0))
            result_path.unlink()
        results.append(row)
        (out / 'results.json').write_text(json.dumps(results, indent=2) + '\n')
        print(json.dumps(row), flush=True)
        require(rc == 0, 'failed suite retained: ' + name)
    require(scripts == {p.relative_to(repo).as_posix(): sha(p) for p in script_paths}, 'harness changed')
    (out / 'summary.json').write_text(json.dumps({'status': 'SUCCEEDED', 'suites': len(results), 'compiler_image_sha256': sha(candidate),
        'loader_payload_sha256': sha(payload), 'script_inputs_unchanged': True, 'rpc_used': False, 'results': results}, indent=2) + '\n')

if __name__ == '__main__':
    main()
