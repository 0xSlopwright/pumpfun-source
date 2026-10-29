#!/usr/bin/env python3
"""Replay the maintained twelve counter fixtures without mutating their signed inputs/prestates."""
from pathlib import Path
import argparse
import base64
import gzip
import hashlib
import json
import re
import struct
from current_clock_binding import bind

PUMP = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
TOKEN = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
SELECTOR = bytes([225, 154, 117, 22, 215, 86, 246, 103])
CASES = {'counter-witness.json.gz': '5b0d3a54bffb4f22cac4c353e1933eab16ada2c4213db651cc03acfb6665a0ed',
         'counter-witness-protocol.json.gz': 'af70175d3a615f1fc342fd353a781619276dbc5b2a73ebe0f0233aea6e895ede'}
sha = lambda raw: hashlib.sha256(raw).hexdigest()
CU = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
ordered = lambda row: [line for line in row['logs'] if not CU.fullmatch(line)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ['repository', 'fixtures', 'anchor-directory', 'control-directory', 'candidate-directory', 'output']:
        parser.add_argument('--' + name, type=Path, required=True)
    args = parser.parse_args()
    assert not args.output.exists()
    import pump_captured_loader as loader
    from solders.account import Account
    from solders.clock import Clock
    from solders.pubkey import Pubkey
    from solders.transaction import Transaction
    from solders.transaction_metadata import FailedTransactionMetadata
    from solders.litesvm import LiteSVM
    assert LiteSVM.__name__ == 'CapturedLiteSVM'
    binding = bind(args.control_directory, args.candidate_directory, 'perhop-clock', args.anchor_directory)
    root = args.repository.resolve()
    programs = {
        AMM: root / 'evidence/original/pump_amm/deployed.so',
        TOKEN: root / 'evidence/dependencies/spl_token/deployed.so',
        'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb': root / 'evidence/dependencies/spl_token_2022/deployed.so',
        'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': root / 'evidence/dependencies/associated_token/deployed.so',
        'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ': root / 'evidence/original/pump_fees/deployed.so',
    }
    images = {'original': root / 'evidence/original/pump/deployed.so',
              'current': args.control_directory / 'candidate.so',
              'candidate': args.candidate_directory / 'candidate.so'}
    tracked = [Path(__file__), *(args.fixtures / name for name in CASES), *programs.values(), *images.values()]
    input_hashes = {str(path): sha(path.read_bytes()) for path in tracked}
    prepared = []
    for name, digest in CASES.items():
        raw = (args.fixtures / name).read_bytes()
        assert sha(raw) == digest
        report = json.loads(gzip.decompress(raw))
        for row in report['cases']:
            original = row['runs']['original']
            raw_tx = base64.b64decode(original['transaction_base64'], validate=True)
            tx = Transaction.from_bytes(raw_tx)
            tx.verify()
            assert all(tx.verify_with_results()) and len(tx.signatures) == 1
            assert all(run['transaction_base64'] == original['transaction_base64'] and run['before'] == original['before'] for run in row['runs'].values())
            instruction, = tx.message.instructions
            keys = tx.message.account_keys
            assert str(keys[instruction.program_id_index]) == AMM
            assert bytes(instruction.data).startswith(hashlib.sha256(b'global:multi_hop_swap').digest()[:8])
            assert original['program_sha256'] == {**{pid: sha(path.read_bytes()) for pid, path in programs.items()}, PUMP: sha(images['original'].read_bytes())}
            entries = [entry for group in original['inner'] for entry in group
                       if entry['stackHeight'] == 2 and str(keys[entry['instruction']['programIdIndex']]) == PUMP]
            assert entries and all(bytes(entry['instruction']['data'][1:]).startswith(SELECTOR) for entry in entries)
            controller = str(keys[entries[0]['instruction']['accounts'][3]])
            assert controller not in [str(k) for k in keys[:tx.message.header.num_required_signatures]]
            prepared.append((row, original, tx))
    assert len(prepared) == 12
    preflight = {'case_file_sha256': CASES, 'cases': 12, 'new_prestate_mutations': 0,
                 'actual_outer_AMM_selector': hashlib.sha256(b'global:multi_hop_swap').digest()[:8].hex(),
                 'actual_Pump_selector': SELECTOR.hex(), 'default_signatures_PDA_checks': True,
                 'native_binding': binding, 'input_sha256': input_hashes}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.with_suffix('.preflight.json').write_text(json.dumps(preflight, indent=2) + '\n')
    loader.LOADS.clear()
    rows = []
    for row, frozen, tx in prepared:
        outcomes = {}
        for label, image in images.items():
            vm = LiteSVM().with_transaction_history(0)
            vm.set_clock(Clock(100, 1234567890, 0, 0, 1234567890))
            selected = dict(programs)
            selected[PUMP] = image
            load_start = len(loader.LOADS)
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
            pump_calls, token_calls = [], []
            for group in encoded['inner_instructions']:
                for entry in group:
                    ix = entry['instruction']
                    payload = bytes(ix['data'][1:])
                    accounts = [str(tx.message.account_keys[i]) for i in ix['accounts'][1:]]
                    pid = str(tx.message.account_keys[ix['programIdIndex']])
                    if pid == PUMP and payload.startswith(SELECTOR):
                        flags = list(payload[20:])
                        assert flags == ([2, 1] if row['case']['sell'] else [1, 2])
                        pump_calls.append({'amount': struct.unpack_from('<Q', payload, 8)[0], 'flags': flags, 'accounts': accounts})
                    if pid == TOKEN:
                        token_calls.append({'data_hex': payload.hex(), 'accounts': accounts})
            load, = loader.LOADS[load_start:]
            assert load['elf_sha256'] == sha(image.read_bytes()) and load['elf_prefix_unchanged'] and load['zero_allocation_tail']
            outcomes[label] = {'transaction_base64': frozen['transaction_base64'], 'signature_occurrences': len(tx.signatures),
                               'error': str(sent.err()) if failed else None, 'logs': meta.logs(), 'events': [s for s in meta.logs() if s.startswith('Program data: ')],
                               'before': frozen['before'], 'after': after, 'inner': encoded['inner_instructions'], 'return_data': encoded.get('return_data'),
                               'pump_calls': pump_calls, 'token_calls': token_calls, 'captured_loader_load': load,
                               'program_sha256': {pid: sha(path.read_bytes()) for pid, path in selected.items()}}
        fields = ['error', 'events', 'inner', 'return_data', 'before', 'after', 'transaction_base64', 'pump_calls', 'token_calls']
        differences = {label: [field for field in fields if outcomes[label][field] != frozen[field]] + ([] if ordered(outcomes[label]) == ordered(frozen) else ['ordered_noncompute_logs']) for label in outcomes}
        rows.append({'case': row['case'], 'frozen_counter_mutations': row['exact_counter_mutations']['original'], 'outcomes': outcomes, 'differences': differences})
    assert input_hashes == {str(path): sha(path.read_bytes()) for path in tracked}
    report = {'scope': __doc__, 'preflight': preflight, 'cases': rows, 'case_count': 12,
              'executed_outcomes': 36, 'signature_occurrences_verified': 36,
              'distinct_serialized_transactions': len({case['outcomes']['original']['transaction_base64'] for case in rows}),
              'captured_loader_loads': list(loader.LOADS), 'inputs_unchanged': True,
              'limits': 'Unchanged synthetic counter fixtures, no new mutations or mainnet reachability claim; ordinary AMM multi-hop, no initializer, Mayhem change or filtered BuyV3.'}
    args.output.write_bytes(gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0))
    print(json.dumps({key: report[key] for key in ['case_count', 'executed_outcomes', 'signature_occurrences_verified', 'distinct_serialized_transactions']}, indent=2))
    assert all(not diff for row in rows for diff in row['differences'].values())


if __name__ == '__main__':
    main()
