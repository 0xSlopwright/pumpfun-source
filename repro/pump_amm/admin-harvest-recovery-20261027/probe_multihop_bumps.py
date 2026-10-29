#!/usr/bin/env python3
"""Signed synthetic fee-bump context probes, preserving all diagnostics.

MultiHop varies existing versus init_if_needed volume state. Legacy buy/sell
controls establish that their canonical bump policy must remain unchanged.
Only source coordinates and runtime compute lines are normalized for comparison.
"""
from pathlib import Path
import argparse, hashlib, importlib.util, json, sys
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts'))
import pump_amm_multi_hop_differential as multi
import pump_amm_legacy_buy_differential as buy
import pump_amm_legacy_sell_differential as sell
from solders.litesvm import LiteSVM
spec = importlib.util.spec_from_file_location('direct', ROOT / 'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py')
direct = importlib.util.module_from_spec(spec)
spec.loader.exec_module(direct)
receipts = []
underlying_send = LiteSVM.send_transaction

def snapshot(vm, keys):
    out = {}
    for k in sorted(set(keys), key=str):
        account = vm.get_account(k)
        if account is not None and account.executable:
            continue
        out[str(k)] = None if account is None else {
            'lamports': account.lamports, 'owner': str(account.owner),
            'data_hex': bytes(account.data).hex(),
        }
    return out

def capture(vm, tx):
    assert all(tx.verify_with_results())
    raw = bytes(tx)
    before = snapshot(vm, tx.message.account_keys)
    result = underlying_send(vm, tx)
    assert bytes(tx) == raw
    receipts.append({'transaction_sha256': hashlib.sha256(raw).hexdigest(),
                     'before': before, 'after': snapshot(vm, tx.message.account_keys)})
    return result

LiteSVM.send_transaction = capture

def mutate(bump, existing=False):
    def override(h, metas):
        if existing:
            multi.volume_state()(h, metas)
        account = h.vm.get_account(multi.feeconfig)
        data = bytearray(account.data)
        data[8] = bump
        h.vm.set_account(multi.feeconfig, multi.Account(account.lamports, bytes(data), account.owner))
    return override

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--candidate', required=True, type=Path)
    p.add_argument('--output', required=True, type=Path)
    args = p.parse_args()
    assert not args.output.exists()
    canonical, bump = multi.Pubkey.find_program_address([b'fee_config', bytes(multi.PROGRAM)], multi.FEES)
    assert canonical == multi.feeconfig
    valid = invalid = None
    for value in range(256):
        if value == bump:
            continue
        try:
            multi.Pubkey.create_program_address([b'fee_config', bytes(multi.PROGRAM), bytes([value])], multi.FEES)
        except Exception:
            if invalid is None:
                invalid = value
        else:
            if valid is None:
                valid = value
        if valid is not None and invalid is not None:
            break
    rows = []
    def run(label, call, params):
        values, state = [], []
        for binary in [ROOT / 'evidence/original/pump_amm/deployed.so', args.candidate]:
            old_count = len(receipts)
            values.append(call(candidate=binary, **params))
            assert len(receipts) == old_count + 1
            state.append(receipts[-1])
        a, b = map(direct.clean, values)
        difference = [key for key in a if a[key] != b.get(key)]
        assert state[0]['transaction_sha256'] == state[1]['transaction_sha256']
        assert state[0]['before'] == state[1]['before']
        if state[0]['after'] != state[1]['after']:
            difference.append('full_account_snapshot')
        rows.append({'case': label, 'original': values[0], 'candidate': values[1],
                     'original_state_receipt': state[0], 'candidate_state_receipt': state[1],
                     'mismatched_fields': difference})
    for label, value in [('canonical', bump), ('wrong-valid-PDA', valid), ('invalid-PDA-seeds', invalid)]:
        for zero in [False, True]:
            for existing in [False, True]:
                run({'context': 'MultiHop', 'bump_kind': label, 'bump': value,
                     'zero_amount': zero, 'volume': 'existing' if existing else 'init_if_needed'},
                    multi.run, {'amount': 0 if zero else 10**9, 'overrides': mutate(value, existing)})
            for context, call, normal in [('LegacyBuy', buy.legacy_buy, 10**10), ('LegacySell', sell.legacy, 10**10)]:
                run({'context': context, 'bump_kind': label, 'bump': value, 'zero_amount': zero},
                    call, {'amount': 0 if zero else normal, 'overrides': mutate(value)})
    report = {
        'scope': __doc__, 'producer_sha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        'original_sha256': hashlib.sha256((ROOT / 'evidence/original/pump_amm/deployed.so').read_bytes()).hexdigest(),
        'candidate_sha256': hashlib.sha256(args.candidate.read_bytes()).hexdigest(),
        'case_count': len(rows), 'mismatch_count': sum(bool(row['mismatched_fields']) for row in rows),
        'cases': rows,
    }
    args.output.write_text(json.dumps(report, separators=(',', ':')) + '\n')
    print(json.dumps({'cases': len(rows), 'mismatches': report['mismatch_count'], 'results': [
        {'case': row['case'], 'original_error': row['original']['error'],
         'candidate_error': row['candidate']['error'], 'fields': row['mismatched_fields']}
        for row in rows]}, indent=2))

if __name__ == '__main__':
    main()
