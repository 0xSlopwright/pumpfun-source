#!/usr/bin/env python3
"""Replay the unchanged eight signed ordinary AMM crossing fixtures on four images."""
from pathlib import Path
import argparse
import base64
import gzip
import hashlib
import json
import re
from native_binding import bind, CONTROL_STRIP

PUMP = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
CONTROLLER = 'ADyA8hdefvWN2dbGGWFotbzWxrAvLW83WG6QCVXvJKqw'
CASE_SHA = 'fa5aa6edbe0bdefaae4b8ed07c9679f29adced620d1d1e8b70d72337a5f6227b'
CU = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
sha = lambda raw: hashlib.sha256(raw).hexdigest()
logs = lambda outcome: [line for line in outcome['logs'] if not CU.fullmatch(line)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--fixtures', type=Path, required=True)
    parser.add_argument('--control-directory', type=Path, required=True)
    parser.add_argument('--perhop-directory', type=Path, required=True)
    parser.add_argument('--clock-directory', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    assert not args.output.exists()
    import pump_captured_loader as loader
    from solders.account import Account
    from solders.clock import Clock
    from solders.pubkey import Pubkey
    from solders.transaction import Transaction
    from solders.transaction_metadata import FailedTransactionMetadata
    from solders.litesvm import LiteSVM
    assert LiteSVM.__name__ == 'CapturedLiteSVM', 'Use the captured-loader wrapper.'
    loader.LOADS.clear()
    bindings = {
        'perhop': bind(args.control_directory, args.perhop_directory, 'perhop'),
        'clock': bind(args.control_directory, args.clock_directory, 'perhop-clock'),
    }
    root, fixture = args.repository.resolve(), args.fixtures.resolve()
    manifest = json.loads((fixture / 'MANIFEST.json').read_bytes())['files']
    for relative in ['runtime/cases.json.gz', 'runtime/images.json', 'runtime/producer.py']:
        assert sha((fixture / relative).read_bytes()) == manifest[relative], relative
    assert sha((fixture / 'runtime/cases.json.gz').read_bytes()) == CASE_SHA
    records = json.loads(gzip.decompress((fixture / 'runtime/cases.json.gz').read_bytes()))
    ids = json.loads((fixture / 'runtime/images.json').read_bytes())
    programs = {row['program_id']: root / row['source'] for row in ids.values()}
    for row in ids.values():
        assert sha((root / row['source']).read_bytes()) == row['sha256']
    amm_idl = root / 'evidence/upstream/pump_amm.json'
    pump_idl = root / 'evidence/upstream/pump.json'
    amm_selector = bytes(next(ix['discriminator'] for ix in json.loads(amm_idl.read_bytes())['instructions'] if ix['name'] == 'multi_hop_swap'))
    pump_selector = bytes(next(ix['discriminator'] for ix in json.loads(pump_idl.read_bytes())['instructions'] if ix['name'] == 'multi_hop_curve_swap'))
    assert pump_selector == bytes([225, 154, 117, 22, 215, 86, 246, 103])
    event_names = {bytes(row['discriminator']): row['name'] for row in json.loads(pump_idl.read_bytes())['events']}
    images = {'original': programs[PUMP], 'control': args.control_directory / 'candidate.so',
              'perhop': args.perhop_directory / 'candidate.so', 'clock': args.clock_directory / 'candidate.so'}
    tracked = [Path(__file__), fixture / 'MANIFEST.json', fixture / 'runtime/cases.json.gz',
               fixture / 'runtime/images.json', fixture / 'runtime/producer.py', amm_idl, pump_idl,
               *programs.values(), *images.values()]
    input_hashes = {str(path): sha(path.read_bytes()) for path in tracked}
    prepared = []
    for case in records['cases']:
        frozen = case['results']['original']
        raw = base64.b64decode(frozen['transaction_base64'], validate=True)
        tx = Transaction.from_bytes(raw)
        tx.verify()
        assert all(tx.verify_with_results()) and len(tx.signatures) == 1
        assert all(row['transaction_base64'] == frozen['transaction_base64'] for row in case['results'].values())
        keys = tx.message.account_keys
        instruction, = tx.message.instructions
        assert str(keys[instruction.program_id_index]) == AMM and bytes(instruction.data).startswith(amm_selector)
        signers = [str(key) for key in keys[:tx.message.header.num_required_signatures]]
        assert len(signers) == 1 and CONTROLLER not in signers
        entry = [row for group in frozen['inner'] for row in group
                 if row['stackHeight'] == 2 and str(keys[row['instruction']['programIdIndex']]) == PUMP]
        assert len(entry) == 1
        encoded = entry[0]['instruction']
        accounts = encoded['accounts']
        data = encoded['data']
        assert accounts[0] == [len(accounts) - 1] and data[0] == [len(data) - 1]
        assert str(keys[accounts[3]]) == CONTROLLER
        assert bytes(data[1:]).startswith(pump_selector)
        curves = [bytes.fromhex(row['data_hex']) for row in frozen['before'].values()
                  if row is not None and bytes.fromhex(row['data_hex']).startswith(bytes([23, 183, 248, 55, 96, 216, 172, 96]))]
        assert curves and all(row[81] == 0 for row in curves)
        prepared.append((case, frozen, tx))
    assert len(prepared) == 8
    # Persist the origin/signature/selector check before any new execution.
    preflight = {'cases': 8, 'case_file_sha256': CASE_SHA, 'outer_program': AMM,
                 'outer_selector': amm_selector.hex(), 'pump_selector': pump_selector.hex(),
                 'one_actual_AMM_to_Pump_CPI_each': True, 'controller_not_outer_signer': CONTROLLER,
                 'prestate_mutations': 0, 'Mayhem_states': False, 'native_bindings': bindings,
                 'input_sha256': input_hashes}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.with_suffix('.preflight.json').write_text(json.dumps(preflight, indent=2) + '\n')
    results = []
    for case, frozen, tx in prepared:
        outcomes = {}
        for label, image in images.items():
            loader.LOADS.clear()
            vm = LiteSVM().with_transaction_history(0)
            vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
            selected = dict(programs)
            selected[PUMP] = image
            for pid, path in selected.items():
                vm.add_program_from_file(Pubkey.from_string(pid), path)
            for address, state in frozen['before'].items():
                if state is not None:
                    vm.set_account(Pubkey.from_string(address), Account(state['lamports'], bytes.fromhex(state['data_hex']), Pubkey.from_string(state['owner'])))
            assert tx.message.recent_blockhash == vm.latest_blockhash()
            sent = vm.send_transaction(tx)
            failed = isinstance(sent, FailedTransactionMetadata)
            meta = sent.meta() if failed else sent
            encoded = json.loads(meta.to_json())
            after = {}
            for address in frozen['after']:
                account = vm.get_account(Pubkey.from_string(address))
                after[address] = None if account is None else {'lamports': account.lamports, 'owner': str(account.owner), 'data_hex': bytes(account.data).hex()}
            captured, = loader.LOADS
            assert captured['elf_sha256'] == sha(image.read_bytes()) and captured['elf_prefix_unchanged'] and captured['zero_allocation_tail']
            outcomes[label] = {'transaction_base64': frozen['transaction_base64'],
                               'signature_fields': len(tx.signatures), 'signatures_verified': all(tx.verify_with_results()),
                               'program_sha256': {pid: sha(path.read_bytes()) for pid, path in selected.items()},
                               'error': str(sent.err()) if failed else None, 'before': frozen['before'], 'after': after,
                               'logs': meta.logs(), 'events': [line for line in meta.logs() if line.startswith('Program data: ')],
                               'inner': encoded['inner_instructions'], 'return_data': encoded.get('return_data'),
                               'captured_loader_load': captured}
        fields = ['before', 'after', 'error', 'events', 'inner', 'return_data']
        assert all(outcomes['original'][field] == frozen[field] for field in fields)
        assert logs(outcomes['original']) == logs(frozen)
        differences = {}
        for label in ['control', 'perhop', 'clock']:
            differences[label] = [field for field in fields if outcomes[label][field] != outcomes['original'][field]]
            if logs(outcomes[label]) != logs(outcomes['original']):
                differences[label].append('ordered_noncompute_logs')
        names = [event_names.get(base64.b64decode(line.removeprefix('Program data: '))[:8], 'other') for line in outcomes['original']['events']]
        results.append({'input': {key: case[key] for key in ['amount', 'real_tokens', 'whitelisted']},
                        'event_names': names, 'outcomes': outcomes, 'differences': differences})
    assert {str(path): sha(path.read_bytes()) for path in tracked} == input_hashes
    report = {'scope': __doc__, 'preflight': preflight, 'cases': results,
              'parameter_cases': 8, 'executed_outcomes': 32,
              'signature_occurrences_verified': sum(row['signature_fields'] for case in results for row in case['outcomes'].values()),
              'distinct_serialized_transactions': len({frozen['transaction_base64'] for _, frozen, _ in prepared}),
              'three_event_success_cases': sum(case['event_names'] == ['TradeEvent', 'CompleteEvent', 'PostCompleteBuyEvent'] for case in results),
              'inputs_unchanged': True, 'prestate_mutations': 0,
              'limits': 'Existing ordinary AMM multi-hop fixtures only; no new Mayhem state, initializer, filtered BuyV3 execution or signer/owner/PDA bypass. Separate from creation14/hop13.'}
    args.output.write_bytes(gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0))
    print(json.dumps({key: report[key] for key in ['parameter_cases', 'executed_outcomes', 'signature_occurrences_verified', 'distinct_serialized_transactions', 'three_event_success_cases']}, indent=2))
    assert all(not fields for case in results for fields in case['differences'].values())


if __name__ == '__main__':
    main()
