#!/usr/bin/env python3
"""Independently compare complete saved outcomes and observed signed messages.

Only compute-meter log lines are excluded. Error source coordinates, panic
positions, account data, errors and all other stored observations remain exact.
Signature cryptography is optional for stdlib-only saved gates and mandatory in
the fresh observer; --signatures rechecks every unique signed transaction.
"""
from pathlib import Path
import base64
import gzip
import hashlib
import json
import re

ORIGINAL = '6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'


def require(value, message):
    if not value:
        raise RuntimeError(message)


def read(path):
    path = Path(path)
    if not path.exists() and path.suffix == '.json':
        path = path.with_suffix('.json.gz')
    raw = path.read_bytes()
    return gzip.decompress(raw) if path.suffix == '.gz' else raw


def load(path):
    return json.loads(read(path))


def clean(value):
    if isinstance(value, dict):
        return {key: clean(item) for key, item in value.items()}
    if isinstance(value, list):
        return [clean(item) for item in value if not isinstance(item, str)
                or not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units', item)]
    return value


def compact(raw, at):
    value = shift = 0
    for _ in range(3):
        require(at < len(raw), 'truncated compact integer')
        byte = raw[at]
        at += 1
        value |= (byte & 127) << shift
        if not byte & 128:
            return value, at
        shift += 7
    raise RuntimeError('invalid compact integer')


def first_instruction_data(message):
    at = 1 if message[0] & 128 else 0
    at += 3  # Message header.
    accounts, at = compact(message, at)
    at += 32 * accounts + 32  # Account keys and recent blockhash.
    count, at = compact(message, at)
    require(count > 0 and at < len(message), 'missing instruction')
    at += 1  # First instruction's program account index.
    accounts, at = compact(message, at)
    at += accounts
    length, at = compact(message, at)
    require(at + length <= len(message), 'truncated instruction data')
    return message[at:at+length]


def audit(runtime, candidate_sha, signatures=False):
    runtime = Path(runtime)
    inputs = load(runtime / 'inputs.json')
    require(inputs['candidate_sha256'] == candidate_sha and inputs['original_sha256'] == ORIGINAL, 'runtime program identity')
    rows = load(runtime / 'progress.json')
    require(len(rows) == len({row['suite'] for row in rows}) == 25, 'suite membership')
    cases = transactions = signature_fields = message_pairs = unique_verified = 0
    decoded, checked = {}, set()

    def transaction(record):
        nonlocal unique_verified
        encoded = record['transaction_base64']
        if encoded not in decoded:
            raw = base64.b64decode(encoded, validate=True)
            count, at = compact(raw, 0)
            require(0 < count < 128 and at + 64 * count < len(raw), 'invalid signature vector')
            decoded[encoded] = (count, raw[at + 64 * count:], hashlib.sha256(raw).hexdigest())
        count, message, digest = decoded[encoded]
        require(count == record['signature_count'] and digest == record['transaction_sha256'], 'transaction binding')
        require(record['all_signatures_verified'] is True, 'observer did not verify signatures')
        if signatures and encoded not in checked:
            from solders.transaction import Transaction
            verified = Transaction.from_bytes(base64.b64decode(encoded)).verify_with_results()
            require(len(verified) == count and all(verified), 'invalid transaction signature')
            checked.add(encoded)
            unique_verified += count
        return count, message

    for row in rows:
        suite = row['suite']
        raw = read(runtime / (suite + '.json'))
        receipt = json.loads(raw)
        require(hashlib.sha256(raw).hexdigest() == row['receipt_sha256'], suite + ' receipt hash')
        require(row['returncode'] == 0 and not row['mismatches'] and not receipt['mismatches'], suite + ' producer failure')
        require(receipt['candidate_sha256'] == candidate_sha and receipt['original_sha256'] == ORIGINAL, suite + ' program binding')
        require(receipt['case_count'] == len(receipt['cases']) == row['case_count'], suite + ' case count')
        for index, case in enumerate(receipt['cases']):
            require(clean(case['original']) == clean(case['candidate']), f'{suite} case {index}: complete observations differ')
            cases += 1
        sidecar_path = runtime / (suite + '-transactions.json.gz')
        require(hashlib.sha256(sidecar_path.read_bytes()).hexdigest() == row['sidecar_sha256'], suite + ' sidecar hash')
        observed = load(sidecar_path)
        require(observed['observer_sha256'] == inputs['observer_sha256'], suite + ' observer binding')
        require(observed['script_sha256'] in inputs['harness_sha256'].values(), suite + ' producer binding')
        sequence = observed['transactions']
        require(len(sequence) == observed['transaction_count'] == row['transactions'], suite + ' observed count')
        total_signatures = 0
        for index, item in enumerate(sequence):
            require(item['sequence'] == index, suite + ' observer order')
            require(item['loaded_programs'][AMM]['sha256'] == item['amm_program_sha256'], suite + ' loaded AMM binding')
            total_signatures += transaction(item)[0]
        require(total_signatures == observed['signature_count'] == row['signatures'], suite + ' signature count')
        transactions += len(sequence)
        signature_fields += total_signatures
        if suite == 'boost':
            # Historical boost setup creates the same original-program pool for
            # both sides before alternating original/candidate actions.
            setup, actions = [], []
            for item in sequence:
                target = setup if first_instruction_data(transaction(item)[1])[:8] == bytes.fromhex('e992d18ecf6840bc') else actions
                target.append(item)
            require(len(setup) == 150, 'boost setup transaction count')
            for left, right in zip(setup[::2], setup[1::2]):
                require(left['amm_program_sha256'] == right['amm_program_sha256'] == ORIGINAL, 'boost setup program identity')
                require(transaction(left)[1] == transaction(right)[1], 'different boost setup messages')
                message_pairs += 1
            sequence = actions
        cursor = 0
        while cursor < len(sequence):
            end = cursor + 1
            while end < len(sequence) and sequence[end]['amm_program_sha256'] == sequence[cursor]['amm_program_sha256']:
                end += 1
            require(end < len(sequence), suite + ' missing candidate transaction block')
            stop = end + 1
            while stop < len(sequence) and sequence[stop]['amm_program_sha256'] == sequence[end]['amm_program_sha256']:
                stop += 1
            require(sequence[cursor]['amm_program_sha256'] == ORIGINAL and sequence[end]['amm_program_sha256'] == candidate_sha, suite + ' program pair order')
            require(end - cursor == stop - end, suite + ' unequal paired transaction counts')
            for left, right in zip(sequence[cursor:end], sequence[end:stop]):
                require(transaction(left)[1] == transaction(right)[1], suite + ' different signed messages')
                message_pairs += 1
            cursor = stop
    require((cases, transactions, signature_fields, message_pairs) == (17462, 35074, 35418, 17537), 'full corpus totals')
    return {'suites': 25, 'cases': cases, 'transactions': transactions, 'signature_fields': signature_fields,
            'identical_signed_message_pairs': message_pairs, 'strict_observation_mismatches': 0,
            'cryptographically_reverified_signature_fields': signature_fields if signatures else None,
            'cryptographically_reverified_unique_signature_fields': unique_verified if signatures else None,
            'log_exclusion': 'Only compute-meter lines; source coordinates retained'}
