"""Offline verification of output produced by packet/replay.py; never runs a VM."""
from pathlib import Path
import argparse, base64, gzip, hashlib, json
from solders.transaction import Transaction

AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
EXPECTED = {'admin': 267, 'reserved': 157, 'buyback': 369}

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def inventory(folder, omit=()):
    return {str(p.relative_to(folder)): digest(p) for p in sorted(folder.rglob('*'))
            if p.is_file() and str(p.relative_to(folder)) not in omit
            and '__pycache__' not in p.parts}

def verify(output, candidate, packet):
    output, candidate, packet = map(lambda p: Path(p).resolve(), (output, candidate, packet))
    manifest = json.loads((packet / 'manifest.json').read_text())
    assert inventory(packet, ('manifest.json',)) == manifest['files'], 'Packet inventory differs'
    summary = json.loads((output / 'replay-verification.json').read_text())
    assert inventory(output, ('replay-verification.json',)) == summary['files'], 'Replay output inventory differs'
    expected_files = {f'{suite}{suffix}' for suite in EXPECTED
                      for suffix in ('.json', '.log', '-transactions.json.gz')}
    assert set(summary['files']) == expected_files
    original = packet / 'inputs/evidence/original/pump_amm/deployed.so'
    observer = packet / 'inputs/repro/pump_amm/owner6048-v144/runtime/observe_suite.py'
    original_hash, candidate_hash = digest(original), digest(candidate)
    assert original_hash == digest(packet / 'artifacts/original.so')
    assert summary['original_sha256'] == original_hash
    assert summary['candidate_sha256'] == candidate_hash
    assert summary['observer_sha256'] == digest(observer)
    assert set(summary['suites']) == set(EXPECTED)
    checked = {}
    for suite, count in EXPECTED.items():
        script = packet / 'inputs/scripts' / f'pump_amm_{suite}_differential.py'
        doc = json.loads((output / f'{suite}.json').read_text())
        receipt = json.loads(gzip.decompress((output / f'{suite}-transactions.json.gz').read_bytes()))
        assert doc['original_sha256'] == original_hash and doc['candidate_sha256'] == candidate_hash
        assert not doc['mismatches'] and doc['case_count'] == len(doc['cases']) == count
        assert receipt['script_sha256'] == digest(script) == summary['suites'][suite]['script_sha256']
        assert receipt['observer_sha256'] == digest(observer)
        if 'script_sha256' in doc: assert doc['script_sha256'] == digest(script)
        assert len(receipt['transactions']) == receipt['transaction_count'] == 2*count
        assert {row['sha256'] for row in receipt['program_file_sha256'].values()} == {original_hash, candidate_hash}
        assert all(row['sha256'] in {original_hash, candidate_hash} for row in receipt['program_file_sha256'].values())
        fields = ['error', 'state_hex', 'event_logs', 'rollback'] if suite == 'admin' else ['error', 'state_hex', 'events']
        signatures = 0
        for i, row in enumerate(doc['cases']):
            assert row['match'] and all(row['original'][k] == row['candidate'][k] for k in fields)
            decoded = []
            raw_pair = []
            for offset, side in [(0, 'original'), (1, 'candidate')]:
                record = receipt['transactions'][2*i+offset]
                assert record['sequence'] == 2*i+offset
                raw = base64.b64decode(record['transaction_base64'], validate=True)
                tx = Transaction.from_bytes(raw)
                assert bytes(tx) == raw, 'Transaction does not round-trip canonically'
                assert len(tx.signatures) == tx.message.header.num_required_signatures == 1
                assert all(tx.verify_with_results()), 'Invalid transaction signature'
                assert record['signature_count'] == len(tx.signatures) and record['all_signatures_verified']
                signatures += len(tx.signatures)
                assert record['transaction_sha256'] == hashlib.sha256(raw).hexdigest()
                assert record['error'] == row[side]['error']
                wanted = original_hash if side == 'original' else candidate_hash
                assert record['amm_program_sha256'] == wanted
                assert set(record['loaded_programs']) == {AMM}, 'Unexpected substituted dependency'
                program = record['loaded_programs'][AMM]
                assert program['sha256'] == wanted
                assert receipt['program_file_sha256'][program['path']] == program
                assert len(tx.message.instructions) == 1
                instruction = tx.message.instructions[0]
                assert str(tx.message.account_keys[instruction.program_id_index]) == AMM
                if suite == 'admin':
                    name = row['instruction']
                    prefix = hashlib.sha256(('global:' + name).encode()).digest()[:8] if name else b''
                    payload = prefix + bytes.fromhex(row['args_hex'])
                    assert record['logs_sha256'] == hashlib.sha256(json.dumps(row[side]['logs'], separators=(',', ':')).encode()).hexdigest()
                else:
                    name = 'set_reserved_fee_recipients' if suite == 'reserved' else 'update_buyback_config'
                    payload = hashlib.sha256(('global:' + name).encode()).digest()[:8] + bytes.fromhex(row['payload_hex'])
                    remaining = [str(tx.message.account_keys[k]) for k in instruction.accounts[4:]]
                    assert remaining == row['recipients']
                assert bytes(instruction.data) == payload, 'Case input does not match signed message'
                decoded.append(bytes(tx.message)); raw_pair.append(raw)
            assert decoded[0] == decoded[1] and raw_pair[0] == raw_pair[1], 'Original/candidate messages differ'
        assert signatures == receipt['signature_count'] == summary['suites'][suite]['verified_signatures']
        assert summary['suites'][suite]['cases'] == count and summary['suites'][suite]['transactions'] == 2*count
        checked[suite] = {'comparison_cases': count, 'paired_messages': count,
                          'transactions': 2*count, 'verified_signatures': signatures}
    return {'scope': __doc__, 'candidate_sha256': candidate_hash, 'original_sha256': original_hash,
            'packet_manifest_sha256': digest(packet / 'manifest.json'),
            'replay_summary_sha256': digest(output / 'replay-verification.json'),
            'comparison_cases': sum(EXPECTED.values()), 'verified_signatures': 2*sum(EXPECTED.values()),
            'suites': checked, 'vm_executed': False,
            'limits': ['Saved execution observations are verified; behavior is not independently re-executed.',
                       'Native LiteSVM built-ins are outside the loaded-program file inventory.',
                       'The legacy admin source_sha256 field describes its original root tree and is not candidate binding.']}

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--candidate', type=Path, required=True)
    p.add_argument('--packet', type=Path, required=True)
    a = p.parse_args()
    print(json.dumps(verify(a.output, a.candidate, a.packet), indent=2))
