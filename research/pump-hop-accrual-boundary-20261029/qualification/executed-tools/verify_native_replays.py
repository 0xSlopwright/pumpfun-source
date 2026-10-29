"""Check the existing creation14/hop13 replay scope with full ordered Source logs."""
from pathlib import Path
import argparse
import base64
import gzip
import hashlib
import json
import re
from solders.transaction import VersionedTransaction
from native_binding import bind

ROOT = Path(__file__).resolve().parent
CU = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
messages = lambda row: [line for line in row['logs'] if not CU.fullmatch(line)]
sha = lambda raw: hashlib.sha256(raw).hexdigest()


def read(path):
    raw = path.read_bytes()
    return json.loads(gzip.decompress(raw) if raw.startswith(b'\x1f\x8b') else raw)


def verify_signature(outcome):
    raw = base64.b64decode(outcome['transaction_base64'], validate=True)
    tx = VersionedTransaction.from_bytes(raw)
    assert all(tx.verify_with_results())
    return raw, len(tx.signatures)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--control-directory', type=Path, required=True)
    parser.add_argument('--candidate-directory', type=Path, required=True)
    parser.add_argument('--kind', choices=['control', 'perhop', 'constructor'], required=True)
    parser.add_argument('--creation', type=Path, required=True)
    parser.add_argument('--hop', type=Path, required=True)
    args = parser.parse_args()
    binding = bind(args.control_directory, args.candidate_directory, args.kind)
    created = read(args.creation)
    # Absolute execution paths are retained provenance, not an image identity.
    for key in binding.keys() - {'candidate_directory', 'control_directory'}:
        assert created['native_cold_binding'][key] == binding[key], key
    assert created['source_coordinate_normalization'] is None
    assert len(created['cases']) == 14
    transactions = signatures = 0
    unique = set()
    for case in created['cases']:
        outcomes = case['results']
        assert set(outcomes) == {'original', 'control', 'candidate'}
        assert len({r['transaction_base64'] for r in outcomes.values()}) == 1
        for label in ['control', 'candidate']:
            assert messages(outcomes['original']) == messages(outcomes[label])
            for key in ['before', 'after', 'error', 'events', 'inner', 'return']:
                assert outcomes['original'][key] == outcomes[label][key]
        for outcome in outcomes.values():
            raw, count = verify_signature(outcome)
            unique.add(raw)
            transactions += 1
            signatures += count
    assert transactions == 42 and signatures == 84
    loads = created['captured_loader_loads']
    assert len(loads) == 42
    assert {r['elf_sha256'] for r in loads} == {binding['candidate_sha256'], '199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473', '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'}
    assert all(r['elf_prefix_unchanged'] and r['zero_allocation_tail'] and r['program_bytes'] == 36 and r['programdata_bytes'] == 10485760 for r in loads)
    creation_counts = {'parameter_cases': 14, 'executions': transactions,
                       'signature_occurrences_verified': signatures,
                       'distinct_serialized_transactions': len(unique),
                       'captured_pump_loads': len(loads)}

    hop = read(args.hop)
    frozen = read(ROOT / 'research/pump-final-composition-673-20261028/runtime/focused/multihop.json.gz')
    assert len(hop['cases']) == len(frozen['cases']) == 13
    assert hop['images_sha256']['proposal'] == binding['candidate_sha256']
    assert hop['images_sha256']['parent'] == '199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473'
    dependencies = read(ROOT / 'research/pump-final-composition-673-20261028/historical/multi-hop-dependencies.json')
    for dependency in dependencies.values():
        assert sha((ROOT / dependency['path']).read_bytes()) == dependency['sha256']
    transactions = signatures = loads = 0
    unique = set()
    fields = ['error', 'events', 'inner', 'return_data', 'before', 'after',
              'transaction_base64', 'pump_calls', 'token_calls']
    for case, old in zip(hop['cases'], frozen['cases']):
        assert case['case'] == old['case']
        outcomes = case['runs']
        assert set(outcomes) == {'original', 'parent', 'proposal'}
        assert len({r['transaction_base64'] for r in outcomes.values()}) == 1
        for key in fields:
            assert outcomes['original'][key] == old['runs']['original'][key], ('frozen original', key)
        assert messages(outcomes['original']) == messages(old['runs']['original'])
        for label in ['parent', 'proposal']:
            assert messages(outcomes['original']) == messages(outcomes[label])
            for key in fields:
                assert outcomes['original'][key] == outcomes[label][key]
        for label, outcome in outcomes.items():
            raw, count = verify_signature(outcome)
            assert count == 1
            unique.add(raw)
            transactions += 1
            signatures += count
            observation = case['observations'][label]
            assert observation['transaction_base64'] == outcome['transaction_base64']
            assert observation['signatures_verified'] is True
            programs = {pid: row['sha256'] for pid, row in dependencies.items()}
            programs['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'] = hop['images_sha256'][label]
            assert outcome['program_sha256'] == programs
            assert {p['program']: p['sha256'] for p in observation['program_loads']} == programs
            assert len(observation['program_loads']) == 6
            captured, = observation['loads']
            assert captured['elf_sha256'] == hop['images_sha256'][label]
            assert captured['elf_prefix_unchanged'] and captured['zero_allocation_tail']
            loads += 1
    assert transactions == signatures == loads == 39
    print(json.dumps({'binding': binding, 'creation': creation_counts,
                      'hop': {'parameter_cases': 13, 'executions': transactions,
                              'signature_occurrences_verified': signatures,
                              'distinct_serialized_transactions': len(unique),
                              'captured_pump_loads': loads},
                      'ordered_logs': 'all lines except complete compute meter; Source retained',
                      'all_observation_differences': 0,
                      'limits': 'Existing finite corpora only; no new domain or complete behavior claim.'}, indent=2))


if __name__ == '__main__':
    main()
