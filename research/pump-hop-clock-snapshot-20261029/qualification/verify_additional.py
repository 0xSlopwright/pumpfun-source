"""Independently verify saved crossing8/counter12 input, signature, image and log bindings."""
import base64
import gzip
import hashlib
import json
import re
from solders.transaction import Transaction

CU = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
PUMP = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
ordered = lambda row: [s for s in row['logs'] if not CU.fullmatch(s)]
read = lambda p: json.loads(gzip.decompress(p.read_bytes()))


def verify_additional(packet, binding):
    reports = packet / 'qualification/reports'
    crossing = read(reports / 'guard8-four-images.json.gz')
    assert crossing['preflight']['case_file_sha256'] == 'fa5aa6edbe0bdefaae4b8ed07c9679f29adced620d1d1e8b70d72337a5f6227b'
    assert crossing['preflight']['outer_selector'] == '2b644913e9f66f94'
    assert crossing['preflight']['pump_selector'] == 'e19a7516d756f667'
    expected = {'original': '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d',
        'control': binding['historical_anchor_sha256'], 'perhop': binding['current_control_sha256'],
        'clock': binding['candidate_sha256']}
    sigs = 0
    wires = set()
    for row in crossing['cases']:
        outcomes = row['outcomes']
        assert set(outcomes) == set(expected)
        original = outcomes['original']
        for label, run in outcomes.items():
            raw = base64.b64decode(run['transaction_base64'], validate=True)
            tx = Transaction.from_bytes(raw)
            tx.verify()
            assert all(tx.verify_with_results()) and len(tx.signatures) == 1
            instruction, = tx.message.instructions
            assert str(tx.message.account_keys[instruction.program_id_index]) == AMM
            assert bytes(instruction.data).startswith(bytes.fromhex('2b644913e9f66f94'))
            assert run['program_sha256'][PUMP] == expected[label]
            load = run['captured_loader_load']
            assert load['elf_sha256'] == expected[label] and load['elf_prefix_unchanged'] and load['zero_allocation_tail']
            assert run['transaction_base64'] == original['transaction_base64']
            for key in ['before', 'after', 'error', 'events', 'inner', 'return_data']:
                assert run[key] == original[key]
            assert ordered(run) == ordered(original)
            sigs += 1
            wires.add(raw)
        assert all(not value for value in row['differences'].values())
    assert len(crossing['cases']) == 8 and sigs == 32 and len(wires) == 2
    assert sum(row['event_names'] == ['TradeEvent', 'CompleteEvent', 'PostCompleteBuyEvent'] for row in crossing['cases']) == 2
    counter = read(reports / 'clock-counter12.json.gz')
    assert counter['preflight']['new_prestate_mutations'] == 0
    assert len(counter['cases']) == 12 and len(counter['captured_loader_loads']) == 36
    assert counter['preflight']['case_file_sha256'] == {
        'counter-witness.json.gz': '5b0d3a54bffb4f22cac4c353e1933eab16ada2c4213db651cc03acfb6665a0ed',
        'counter-witness-protocol.json.gz': 'af70175d3a615f1fc342fd353a781619276dbc5b2a73ebe0f0233aea6e895ede'}
    frozen = {}
    for filename, digest in counter['preflight']['case_file_sha256'].items():
        p = packet / 'qualification/counter-inputs' / filename
        assert hashlib.sha256(p.read_bytes()).hexdigest() == digest
        for row in read(p)['cases']:
            frozen[row['case']['name']] = row['runs']['original']
    expected = {'original': expected['original'], 'current': expected['perhop'], 'candidate': expected['clock']}
    counter_sigs = 0
    wires = set()
    for row in counter['cases']:
        saved = frozen[row['case']['name']]
        assert set(row['outcomes']) == set(expected)
        for label, run in row['outcomes'].items():
            raw = base64.b64decode(run['transaction_base64'], validate=True)
            tx = Transaction.from_bytes(raw)
            tx.verify()
            assert all(tx.verify_with_results()) and len(tx.signatures) == 1
            assert run['program_sha256'][PUMP] == expected[label]
            assert run['captured_loader_load']['elf_sha256'] == expected[label]
            assert run['captured_loader_load']['elf_prefix_unchanged'] and run['captured_loader_load']['zero_allocation_tail']
            for key in ['error', 'events', 'inner', 'return_data', 'before', 'after', 'transaction_base64', 'pump_calls', 'token_calls']:
                assert run[key] == saved[key]
            assert ordered(run) == ordered(saved)
            counter_sigs += 1
            wires.add(raw)
        assert all(not value for value in row['differences'].values())
    assert counter_sigs == 36 and len(wires) == 2
    return {'crossing_parameter_cases': 8, 'crossing_executions_signatures': 32,
            'three_event_success_cases': 2, 'counter_parameter_cases': 12,
            'counter_executions_signatures': 36, 'all_observation_differences': 0}
