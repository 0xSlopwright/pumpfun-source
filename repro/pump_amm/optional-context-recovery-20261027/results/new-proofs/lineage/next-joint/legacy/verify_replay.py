"""Verify fresh legacy replay against a sealed packet, without executing a VM."""
from pathlib import Path
from functools import cache
import base64, gzip, hashlib, json, sys, types
from solders.transaction import Transaction

W = Path(__file__).resolve().parent
binding = json.loads((W / 'inputs.json').read_text())
P = W.parent / 'base-packet' if (W.parent / 'base-packet').is_dir() else Path(binding['packet'])
I = W / 'input-root'


@cache
def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def read(path):
    path = Path(path)
    if not path.exists():
        path = path.with_suffix(path.suffix + '.gz')
    data = path.read_bytes()
    return json.loads(gzip.decompress(data) if data[:2] == b'\x1f\x8b' else data)


assert sha(P / 'manifest.json') == binding['packet_manifest_sha256']
manifest = read(P / 'manifest.json')['files']
assert {str(p.relative_to(P)): sha(p) for p in P.rglob('*') if p.is_file() and p != P / 'manifest.json'} == manifest
actual_inputs = {str(p.relative_to(I)): sha(p) for p in I.rglob('*') if p.is_file()}
assert actual_inputs == binding['input_files']
for relative, digest in actual_inputs.items():
    if relative in binding.get('local_inputs', {}):
        assert digest == binding['local_inputs'][relative]
        continue
    if relative == 'work/probes/probe_reserves.py':
        key = 'probe_reserves.py'
    elif relative in binding.get('additional_sealed_inputs', {}):
        key = binding['additional_sealed_inputs'][relative]['packet_path']
    else:
        key = 'inputs/' + relative
    assert digest == manifest[key], relative
candidate = W.parent / 'build/artifacts/pump_amm_recovered.so' if (W.parent / 'build/artifacts/pump_amm_recovered.so').is_file() else Path(binding['candidate'])
expected = '97bd5553c199cd24fb2d07034c365527bee5b138bf5dd7a0aa3099186aad2643'
assert sha(candidate) == binding['candidate_sha256'] == expected
original = sha(I / 'evidence/original/pump_amm/deployed.so')
AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
dependencies = {
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'evidence/dependencies/spl_token/deployed.so',
    'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb': 'evidence/dependencies/spl_token_2022/deployed.so',
    'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ': 'evidence/original/pump_fees/deployed.so',
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': 'evidence/dependencies/associated_token/deployed.so',
}
suites = []
for suite, count, script in [('legacy-buy', 1011, I / 'scripts/pump_amm_legacy_buy_differential.py'),
                              ('reserves', 184, I / 'work/probes/probe_reserves.py'),
                              ('arithmetic', 54, I / 'work/probes/probe_arithmetic.py'),
                              ('creator-transfer', 48, I / 'work/probes/probe_creator_transfer.py')]:
    report = read(W / 'standard' / (suite + '.json'))
    transactions = read(W / 'standard' / (suite + '-transactions.json.gz'))
    prior = report if suite in ['arithmetic', 'creator-transfer'] else read(P / 'runtime/fixed' / (suite + '.json'))
    assert report['candidate_sha256'] == expected and report['original_sha256'] == original
    assert report['script_sha256'] == transactions['script_sha256'] == sha(script)
    assert transactions['observer_sha256'] == sha(I / 'repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
    assert report['case_count'] == len(report['cases']) == count and not report['mismatches']
    assert len(transactions['transactions']) == transactions['transaction_count'] == 2 * count
    signatures = 0
    for index, row in enumerate(report['cases']):
        keys = [k for k in row['original'] if k != 'logs']
        assert not row['diff']
        assert all(row['original'][key] == row['candidate'][key] == prior['cases'][index]['original'][key] for key in keys)
        assert {k: v for k, v in row.items() if k not in ['original', 'candidate', 'diff']} == {k: v for k, v in prior['cases'][index].items() if k not in ['original', 'candidate', 'diff']}
        pair = []
        for offset, side in [(0, 'original'), (1, 'candidate')]:
            receipt = transactions['transactions'][2 * index + offset]
            raw = base64.b64decode(receipt['transaction_base64'], validate=True)
            tx = Transaction.from_bytes(raw)
            assert tx.signatures and all(tx.verify_with_results())
            assert receipt['sequence'] == 2 * index + offset
            assert receipt['transaction_sha256'] == hashlib.sha256(raw).hexdigest()
            assert receipt['signature_count'] == len(tx.signatures)
            assert row[side]['transaction_base64'] == receipt['transaction_base64']
            assert receipt['error'] == row[side]['error']
            assert receipt['logs_sha256'] == hashlib.sha256(json.dumps(row[side]['logs'], separators=(',', ':')).encode()).hexdigest()
            wanted = original if side == 'original' else expected
            assert set(receipt['loaded_programs']) == {AMM, *dependencies}
            assert receipt['amm_program_sha256'] == receipt['loaded_programs'][AMM]['sha256'] == wanted
            for key, relative in dependencies.items():
                assert receipt['loaded_programs'][key]['sha256'] == sha(I / relative)
            pair.append(raw)
            signatures += len(tx.signatures)
        assert pair[0] == pair[1]
    assert signatures == transactions['signature_count']
    suites.append({'suite': suite, 'cases': count, 'transactions': 2 * count, 'verified_signatures': signatures})

filename = P / 'runtime/exact-kit/verify.py'
exact = types.ModuleType('sealed_exact_verifier')
exact.__file__ = str(filename)
exec(compile(filename.read_bytes(), str(filename), 'exec'), exact.__dict__)
exact.verify_inventory()
current = exact.verify_output(candidate, W / 'exact')
prior = exact.verify_output(P / 'build/artifacts/pump_amm_recovered.so', P / 'runtime/exact-fixed')
assert current['originals'] == prior['originals'] and current['messages'] == prior['messages']
assert sum(suite['cases'] for suite in current['runs']) == 319
assert current['signatures_verified'] == 638
suites.append({'suite': 'exact', 'cases': 319, 'transactions': 638, 'verified_signatures': 638})
assert hashlib.sha256(candidate.read_bytes()).hexdigest() == expected
assert {str(p.relative_to(I)): hashlib.sha256(p.read_bytes()).hexdigest()
        for p in I.rglob('*') if p.is_file()} == binding['input_files']
for receipt in (W / 'attempt-1/standard').glob('*-transactions.json.gz'):
    failed = read(receipt)
    assert failed['transaction_count'] == failed['signature_count'] == 0
result = {'verified': True, 'candidate_sha256': expected,
          'packet_manifest_sha256': binding['packet_manifest_sha256'],
          'cases': sum(s['cases'] for s in suites),
          'transactions': sum(s['transactions'] for s in suites),
          'verified_signatures': sum(s['verified_signatures'] for s in suites),
          'suites': suites, 'vm_executed_by_verifier': False,
          'scope': __doc__, 'staging_note': 'Sealed prior inputs plus hash-bound arithmetic and creator-transfer diagnostic producers.'}
(W / 'verification.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
