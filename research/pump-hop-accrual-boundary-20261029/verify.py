#!/usr/bin/env python3
"""Verify a source overlay and immutable prebuild attribution; do not build or replay."""
import argparse
import base64
import difflib
import gzip
import hashlib
import json
import struct
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]


def sha(data):
    return hashlib.sha256(data).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, default=ROOT)
    parser.add_argument('--original', type=Path)
    parser.add_argument('--selected-symbols', type=Path, required=True)
    args = parser.parse_args()
    root = args.repository.resolve()
    manifest = json.loads((HERE / 'MANIFEST.json').read_bytes())
    for name, digest in manifest['packet_files_sha256'].items():
        assert sha((HERE / name).read_bytes()) == digest, name
    before = (HERE / 'source-before.rs').read_bytes()
    after = (ROOT / 'programs/pump/src/multi_hop_curve_swap.rs').read_bytes()
    proposal = json.loads((HERE / 'PROPOSAL.json').read_bytes())
    assert sha(before) == proposal['base_source_sha256']
    assert sha(after) == proposal['proposed_source_sha256']
    patch = ''.join(difflib.unified_diff(
        before.decode().splitlines(True), after.decode().splitlines(True),
        fromfile='a/programs/pump/src/multi_hop_curve_swap.rs',
        tofile='b/programs/pump/src/multi_hop_curve_swap.rs', n=0))
    assert patch == (HERE / 'proposal.diff').read_text()
    old_lines, new_lines = before.splitlines(), after.splitlines()
    assert len(old_lines) == len(new_lines)
    changed = [i + 1 for i, (a, b) in enumerate(zip(old_lines, new_lines)) if a != b]
    assert changed == [723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734,
                       739, 740, 745, 746, 747, 748, 749, 750]
    for i, line in enumerate(old_lines):
        if b'require' in line or b'error!' in line:
            assert line == new_lines[i], ('existing error position changed', i + 1)
    assert after.count(b'.accrue_fees(&a.global,') == 2

    sys.path.insert(0, str(root / 'scripts'))
    from pump_compare_function_bytes import body, normalize
    from pump_quote_control_function_match import sections
    normalizer = root / 'scripts/pump_compare_function_bytes.py'
    ledger = json.loads((HERE / 'callee-ledger.json').read_bytes())
    assert sha(normalizer.read_bytes()) == ledger['normalizer_sha256']
    original = (args.original or root / 'evidence/original/pump/deployed.so').read_bytes()
    selected = args.selected_symbols.read_bytes()
    assert sha(original) == ledger['original_sha256']
    assert sha(selected) == ledger['selected_symbol_elf_sha256']
    window, = ledger['windows']
    counts = {}
    for label, image in [('original', original), ('candidate', selected)]:
        secs = sections(image)
        start = window[label + '_start']
        raw = body(image, secs, start, window[label + '_bytes'])
        _, operands = normalize(raw, start, secs)
        calls = [o for o in operands if o['kind'] == 'direct-call']
        recorded = window['calls'][label]
        assert len(calls) == len(recorded)
        for call, record in zip(calls, recorded):
            assert (call['offset'], call['target']) == (record['offset'], record['target'])
            callee = body(image, secs, record['target'], record['callee_bytes'])
            normalized, _ = normalize(callee, record['target'], secs)
            assert sha(normalized) == record['callee_normalized_sha256']
        counts[label] = len(calls)
    assert counts == {'original': 107, 'candidate': 109}
    callee = proposal['original_callee']
    for image, key in [(original, 'start'), (selected, 'current_start')]:
        address = int(callee[key], 16)
        secs = sections(image)
        normalized, _ = normalize(body(image, secs, address, callee['bytes']), address, secs)
        assert sha(normalized) == callee['normalized_sha256']
    accrual_calls = [c for c in window['calls']['original'] if c['target'] == 0xa1bd8]
    assert [c['offset'] for c in accrual_calls] == [0x2508, 0x25b8]
    assert not [c for c in window['calls']['candidate'] if c['target'] == 0xb39b0]

    from solders.transaction import Transaction
    witness = json.loads(gzip.decompress((HERE / 'mayhem-existing-image-witness.json.gz').read_bytes()))
    signatures = 0
    messages = set()
    for case in witness['cases']:
        tx_bytes = base64.b64decode(case['transaction_base64'], validate=True)
        tx = Transaction.from_bytes(tx_bytes)
        tx.verify()
        assert all(tx.verify_with_results())
        assert [str(s) for s in tx.signatures] == case['actual_signatures']
        messages.add(tx_bytes)
        signatures += 2 * len(tx.signatures)
        old, new = case['original_fixture_before'], case['mutated_before']
        assert old.keys() == new.keys()
        changes = []
        for address in old:
            if old[address] == new[address]:
                continue
            a, b = old[address], new[address]
            assert a is not None and b is not None
            assert {k: v for k, v in a.items() if k != 'data_hex'} == {k: v for k, v in b.items() if k != 'data_hex'}
            x, y = bytes.fromhex(a['data_hex']), bytes.fromhex(b['data_hex'])
            assert len(x) == len(y)
            assert [i for i, (u, v) in enumerate(zip(x, y)) if u != v] == [81]
            assert (x[81], y[81]) == (0, 1)
            changes.append(address)
        assert len(changes) == 1
        outcomes = case['outcomes']
        for label in ['original', 'selected']:
            assert '6108' in outcomes[label]['error']
            assert any('multi_hop_curve_swap.rs:484.' in line and 'MultiHopMayhemCurveNotSupported' in line for line in outcomes[label]['logs'])
            assert case[label + '_admitted'] is False
        for field in ['error', 'events', 'inner', 'return_data', 'after']:
            assert outcomes['original'][field] == outcomes['selected'][field]
        assert case['different_fields'] == []
    assert witness['inputs_unchanged'] is True
    assert len(witness['cases']) == witness['case_count'] == 2
    assert witness['executed_transactions'] == 4
    assert signatures == witness['signature_occurrences'] == 4
    assert len(messages) == witness['distinct_serialized_transactions'] == 2
    assert len(witness['captured_loader_loads']) == 4
    print(json.dumps({'source_sha256': sha(after), 'prebuild_calls': counts,
                      'original_accrual_calls_verified': 2, 'rejected_witness_cases': 2,
                      'saved_executions': 4, 'signature_occurrences_verified': signatures,
                      'new_builds': 0, 'new_replays': 0,
                      'scope': 'prebuild source/control proof; actual native proof is qualification/verify.py'}, indent=2))


if __name__ == '__main__':
    main()
