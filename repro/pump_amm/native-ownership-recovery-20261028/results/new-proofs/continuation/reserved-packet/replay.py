"""Replay 793 focused signed cases against a supplied candidate and captured original."""
from pathlib import Path
import argparse, base64, gzip, hashlib, json, os, subprocess, sys
from solders.transaction import Transaction
P = Path(__file__).resolve().parent
p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--candidate', type=Path, required=True)
p.add_argument('--output', type=Path, required=True)
a = p.parse_args(); candidate = a.candidate.resolve(); output = a.output.resolve()
assert output != P and P not in output.parents, 'Replay output must be outside the sealed packet'
output.mkdir(parents=True, exist_ok=False)
sha = lambda f: hashlib.sha256(Path(f).read_bytes()).hexdigest()
candidate_hash = sha(candidate)
observer = P / 'inputs/repro/pump_amm/owner6048-v144/runtime/observe_suite.py'
original = P / 'inputs/evidence/original/pump_amm/deployed.so'
env = dict(os.environ, PYTHONDONTWRITEBYTECODE='1')
summary = {'scope': __doc__, 'candidate_sha256': candidate_hash, 'original_sha256': sha(original),
           'observer_sha256': sha(observer), 'suites': {}, 'vm_executed': True}
for suite, expected in [('admin', 267), ('reserved', 157), ('buyback', 369)]:
    script = P / 'inputs/scripts' / ('pump_amm_' + suite + '_differential.py')
    cmd = [sys.executable, '-B', str(observer), str(output / (suite + '-transactions.json.gz')),
           str(script), '--candidate', str(candidate), '--output', str(output / (suite + '.json'))]
    if suite == 'admin': cmd.append('--quick')
    with (output / (suite + '.log')).open('w') as f:
        result = subprocess.run(cmd, env=env, cwd=P / 'inputs', stdout=f, stderr=subprocess.STDOUT)
    result.check_returncode()
    doc = json.loads((output / (suite + '.json')).read_text())
    receipt = json.loads(gzip.decompress((output / (suite + '-transactions.json.gz')).read_bytes()))
    assert doc['candidate_sha256'] == candidate_hash and doc['original_sha256'] == sha(original)
    assert len(doc['cases']) == doc['case_count'] == expected and not doc['mismatches']
    assert receipt['script_sha256'] == sha(script) and receipt['observer_sha256'] == sha(observer)
    count = 0
    fields = ['error', 'state_hex', 'event_logs', 'rollback'] if suite == 'admin' else ['error', 'state_hex', 'events']
    for i, case in enumerate(doc['cases']):
        assert case['match'] and all(case['original'][k] == case['candidate'][k] for k in fields)
        for offset, side in [(0, 'original'), (1, 'candidate')]:
            record = receipt['transactions'][2*i+offset]
            raw = base64.b64decode(record['transaction_base64']); tx = Transaction.from_bytes(raw)
            assert tx.signatures and all(tx.verify_with_results())
            assert hashlib.sha256(raw).hexdigest() == record['transaction_sha256']
            assert record['error'] == case[side]['error']
            wanted = sha(original) if side == 'original' else candidate_hash
            assert record['amm_program_sha256'] == wanted
            count += len(tx.signatures)
    assert len(receipt['transactions']) == receipt['transaction_count'] == 2*expected
    assert receipt['signature_count'] == count
    summary['suites'][suite] = {'cases': expected, 'transactions': 2*expected,
                                'verified_signatures': count, 'script_sha256': sha(script)}
assert sha(candidate) == candidate_hash
summary['files'] = {str(f.relative_to(output)): sha(f) for f in sorted(output.rglob('*')) if f.is_file()}
(output / 'replay-verification.json').write_text(json.dumps(summary, indent=2) + '\n')
print(json.dumps(summary, indent=2))
