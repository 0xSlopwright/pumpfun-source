"""Verify saved helper receipts; this module does not execute a runtime."""
from pathlib import Path
import argparse, base64, gzip, hashlib, json, sys, types
from solders.transaction import Transaction
sys.dont_write_bytecode = True

AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
ORIGINAL = '6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
DEPENDENCIES = {
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': '8190d3f7ceb6cb7a7a8d8924bff89f9f611e15ce1f806f2b6237f3311a98f697',
    'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb': '15a2e615a42e20f31714bbaaee43002ae6f1cda2e8d7118243117ab3c1342e2d',
    'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ': '4f2955d0f6b40cc9ff7daa18ccad7d19119ba1249759f4e7e3bb691beee6b35e',
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': '6804554e69fd3a58caa191dc4a58f4c67223d30ca28ab8987f39fc18d2f7374d',
    '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P': '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d',
}

def digest(value):
    return hashlib.sha256(value).hexdigest()

def sha(path):
    return digest(Path(path).read_bytes())

def load(path):
    data = Path(path).read_bytes()
    return json.loads(gzip.decompress(data) if data[:2] == b'\x1f\x8b' else data)

def inventory(directory):
    directory = Path(directory)
    return {str(p.relative_to(directory)): sha(p) for p in sorted(directory.rglob('*'))
            if p.is_file() and '__pycache__' not in p.parts and p != directory / 'manifest.json'}

def check_manifest(directory):
    expected = load(Path(directory) / 'manifest.json')['files']
    actual = inventory(directory)
    assert actual == expected, {'inventory_added': sorted(set(actual) - set(expected)),
                                'inventory_removed': sorted(set(expected) - set(actual)),
                                'modified': sorted(k for k in set(actual) & set(expected) if actual[k] != expected[k])}

def module(path, name):
    path = Path(path)
    result = types.ModuleType(name)
    result.__file__ = str(path)
    # Execute the checked source bytes, never an untracked pre-existing pyc.
    exec(compile(path.read_bytes(), str(path), 'exec'), result.__dict__)
    return result

def verify(directory, candidate, allow_mismatches=False):
    directory, candidate = Path(directory), Path(candidate)
    check_manifest(directory)
    kit = directory / 'kit'
    check_manifest(kit)
    config, run = load(kit / 'kit.json'), load(directory / 'run.json')
    candidate_hash = sha(candidate)
    assert run['candidate_sha256'] == run['candidate_after_sha256'] == candidate_hash
    assert run['kit_manifest_sha256'] == sha(kit / 'manifest.json')
    assert run['repository_inputs_before'] == run['repository_inputs_after'] == config['repository_inputs']
    assert run['runtime_binary_inputs_before'] == run['runtime_binary_inputs_after'] == config['runtime_binary_inputs']
    assert run['runtime_executed'] is True
    assert sha(directory / 'verify.py') == sha(kit / 'verify.py')
    assert config['observer_sha256'] == sha(kit / 'observer.py')
    assert config['cleaner_sha256'] == sha(kit / 'cleaner.py')
    for relative, expected in config['repository_inputs'].items():
        assert sha(kit / 'inputs' / relative) == expected, relative
    cleaner = module(kit / 'cleaner.py', 'saved_helper_cleaner')
    total_cases = signatures = successes = 0
    mismatches, summaries = [], []
    assert set(run['suites']) == {s['name'] for s in config['suites']}
    for spec in config['suites']:
        name, count = spec['name'], spec['cases']
        assert run['suites'][name]['returncode'] == 0, name
        report = load(directory / 'reports' / (name + '.json.gz'))
        observed = load(directory / 'reports' / (name + '-transactions.json.gz'))
        producer_hash = sha(kit / 'producers' / spec['producer'])
        assert producer_hash == spec['producer_sha256'] == report['producer_sha256'] == observed['script_sha256']
        assert observed['observer_sha256'] == config['observer_sha256']
        assert run['suites'][name]['producer_sha256'] == producer_hash
        assert run['suites'][name]['observer_sha256'] == config['observer_sha256']
        assert report['original_sha256'] == ORIGINAL and report['candidate_sha256'] == candidate_hash
        if name == 'cashback':
            assert report['base_producer_sha256'] == sha(kit / 'producers' / 'probe.py')
        assert len(report['cases']) == report['case_count'] == count
        roster = [row['case'] for row in report['cases']]
        assert digest(json.dumps(roster, sort_keys=True, separators=(',', ':')).encode()) == spec['case_roster_sha256']
        assert len(observed['transactions']) == observed['transaction_count'] == 2 * count
        suite_signatures = suite_successes = 0
        suite_differences = []
        for index, row in enumerate(report['cases']):
            original, rebuilt = row['original'], row['candidate']
            assert original['transaction_base64'] == rebuilt['transaction_base64']
            assert original['before'] == rebuilt['before']
            left, right = cleaner.clean(original), cleaner.clean(rebuilt)
            differences = sorted(k for k in set(left) | set(right)
                                 if k not in left or k not in right or left[k] != right[k])
            assert differences == sorted(row['mismatched_fields']), (name, index, 'reported differences')
            if differences:
                suite_differences.append(index)
                mismatches.append({'suite': name, 'index': index, 'case': row['case'], 'fields': differences})
            suite_successes += original['error'] is None
            for side_index, side in enumerate(('original', 'candidate')):
                result = row[side]
                receipt = observed['transactions'][2 * index + side_index]
                raw = base64.b64decode(receipt['transaction_base64'], validate=True)
                tx = Transaction.from_bytes(raw)
                checks = tx.verify_with_results()
                assert checks and all(checks) and receipt['all_signatures_verified'] is True
                assert len(checks) == len(tx.signatures) == receipt['signature_count'] == 1
                suite_signatures += len(checks)
                assert receipt['sequence'] == 2 * index + side_index
                assert digest(raw) == receipt['transaction_sha256']
                assert receipt['transaction_base64'] == result['transaction_base64']
                program_hash = ORIGINAL if side == 'original' else candidate_hash
                assert receipt['amm_program_sha256'] == program_hash
                assert receipt['loaded_programs'][AMM]['sha256'] == program_hash
                assert receipt['error'] == result['error']
                assert receipt['logs_sha256'] == digest(json.dumps(result['logs'], separators=(',', ':')).encode())
                budget_id = 'ComputeBudget111111111111111111111111111111'
                instructions = tx.message.instructions
                if spec['compute_unit_limit'] is not None:
                    assert spec['compute_unit_limit'] == 1400000 and len(instructions) == 2
                    assert str(tx.message.account_keys[instructions[0].program_id_index]) == budget_id
                    assert bytes(instructions[0].data) == bytes.fromhex('02c05c1500')
                    assert str(tx.message.account_keys[instructions[1].program_id_index]) == AMM
                else:
                    assert len(instructions) == 1 and str(tx.message.account_keys[instructions[0].program_id_index]) == AMM
                keys = set(map(str, tx.message.account_keys))
                assert set(result['before']) == set(result['after'])
                assert not set(result['before']) - keys
                assert keys - set(result['before']) <= set(receipt['loaded_programs']) | {'11111111111111111111111111111111'} | ({budget_id} if spec['compute_unit_limit'] is not None else set())
                programs = receipt['loaded_programs']
                assert set(list(DEPENDENCIES)[:3]) <= set(programs)
                assert set(programs) <= set(DEPENDENCIES) | {AMM}
                for program, record in programs.items():
                    expected_hash = program_hash if program == AMM else DEPENDENCIES[program]
                    assert record['sha256'] == expected_hash
                    assert observed['program_file_sha256'][record['path']] == record
        assert len(suite_differences) == report['mismatch_count']
        assert suite_signatures == observed['signature_count'] == 2 * count
        summaries.append({'suite': name, 'cases': count, 'signatures': suite_signatures,
                          'original_successes': suite_successes, 'mismatch_indices': suite_differences})
        total_cases += count
        signatures += suite_signatures
        successes += suite_successes
    assert total_cases == config['case_count'] == sum(item['cases'] for item in config['suites'])
    assert signatures == config['expected_signatures'] == 2 * total_cases
    if not allow_mismatches:
        assert not mismatches, mismatches
    return {'verified': True, 'candidate_sha256': candidate_hash, 'cases': total_cases,
            'verified_signatures': signatures, 'identical_input_pairs': total_cases,
            'full_result_pairs': total_cases, 'original_successes': successes,
            'mismatch_count': len(mismatches), 'mismatches': mismatches, 'suites': summaries,
            'executes_runtime': False,
            'scope': 'Rechecks saved full results, raw-log hashes, account snapshots, signed inputs, program hashes, producer and observer identity. Only the recorded cleaner normalizes compute logs and source coordinates.'}

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, default=Path(__file__).resolve().parent)
    parser.add_argument('--candidate', type=Path, required=True)
    parser.add_argument('--allow-mismatches', action='store_true')
    args = parser.parse_args()
    print(json.dumps(verify(args.directory, args.candidate, args.allow_mismatches), indent=2))
