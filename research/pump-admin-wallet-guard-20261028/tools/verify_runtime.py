#!/usr/bin/env python3
"""Independent saved-record signature/structured audit; no VM or compiler."""
import argparse, base64, gzip, hashlib, json, sys
from pathlib import Path
if not __debug__:
    raise SystemExit('Run without -O; underlying retained audit uses assertions.')
P = Path(__file__).resolve().parents[1]
ROOT = P.parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from pump_diagnostic_audit import audit, messages
from solders.transaction import VersionedTransaction

def require(ok, message):
    if not ok:
        raise ValueError(message)
def read(path):
    data = path.read_bytes()
    return json.loads(gzip.decompress(data) if path.suffix == '.gz' else data)
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--directory', type=Path, required=True)
    parser.add_argument('--witnesses', type=Path, required=True)
    parser.add_argument('--admin', type=Path, required=True)
    parser.add_argument('--holder', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    a = parser.parse_args()
    directory = a.directory.resolve()
    full_path = directory / 'full44.json.gz'
    full = read(full_path)
    record = read(directory / 'build-comparison.json')
    candidate = sha(directory / 'candidate.so')
    original = sha(ROOT / 'evidence/original/pump/deployed.so')
    require(full['candidate_sha256'] == candidate and full['original_sha256'] == original and
        full['compiled_source_sha256'] == record['source_sha256'], 'runtime image/source binding differs')
    require(full['case_count'] == 10468 and len(full['suites']) == 44 and not full['mismatches'], 'broad corpus incomplete')
    require(audit(full['suites']) == full['diagnostics'] and full['diagnostics']['log_bearing_cases'] == 10464 and
        not full['diagnostics']['mismatches'], 'standard broad diagnostic audit differs')
    pairs = txs = sigs = 0
    def walk(value, compare_pairs=True):
        nonlocal pairs, txs, sigs
        if isinstance(value, dict):
            if compare_pairs and isinstance(value.get('original'), dict) and isinstance(value.get('candidate'), dict):
                x, y = value['original'], value['candidate']
                pairs += 1
                require(x.keys() == y.keys(), 'observation field set differs')
                for key in x:
                    if key == 'logs':
                        require(messages(x[key]) == messages(y[key]), 'broad program diagnostic differs')
                    elif key == 'program_sha256':
                        require(x[key].keys() == y[key].keys(), 'program set differs')
                        changed = [name for name in x[key] if x[key][name] != y[key][name]]
                        require(changed == ['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'] and x[key][changed[0]] == original and y[key][changed[0]] == candidate, 'subject program binding differs')
                    elif key == 'metadata':
                        require(x[key].keys() == y[key].keys(), 'metadata field set differs')
                        for field in x[key]:
                            if field == 'logs':
                                require(messages(x[key][field]) == messages(y[key][field]), 'metadata diagnostics differ')
                            elif field == 'compute_units_consumed':
                                require(isinstance(x[key][field], int) and isinstance(y[key][field], int), 'compute observation absent')
                            else:
                                require(x[key][field] == y[key][field], 'metadata differs: ' + field)
                    else:
                        require(x[key] == y[key], 'structured field differs: ' + key)
            if 'transaction_base64' in value:
                raw = base64.b64decode(value['transaction_base64'], validate=True)
                tx = VersionedTransaction.from_bytes(raw)
                checks = tx.verify_with_results()
                require(checks and all(checks), 'transaction signature invalid')
                txs += 1
                sigs += len(tx.signatures)
            for item in value.values():
                walk(item, compare_pairs)
        elif isinstance(value, list):
            for item in value:
                walk(item, compare_pairs)
    walk(full['suites'])
    require((pairs, txs, sigs) == (10468, 18343, 27875), 'broad signature/observation inventory differs')
    broad = {'case_pairs': pairs, 'serialized_transaction_fields': txs, 'signature_fields': sigs}
    loads = 0
    for row in full['loader_receipts'].values():
        path = ROOT / row['path']
        require(sha(path) == row['sha256'], 'loader receipt changed')
        records = read(path)['loads']
        require(len(records) == row['load_count'] and {item['elf_sha256'] for item in records} == {original, candidate}, 'loader image binding differs')
        require(all(item['elf_prefix_unchanged'] and item['zero_allocation_tail'] and item['program_bytes'] == 36 and item['programdata_bytes'] == 10485760 for item in records), 'captured loader profile differs')
        loads += len(records)
    strict = {}
    fields = ['error', 'before', 'after', 'events', 'inner', 'return']
    ordered = lambda result: [line for line in result['logs'] if line.startswith(('Program log: ', 'Program data: '))]
    for name, path, expected in [('witnesses', a.witnesses, 18), ('admin', a.admin, 363), ('holder', a.holder, 12)]:
        report = read(path)
        require(report['case_count'] == expected, 'focused case inventory differs')
        for row in report['cases']:
            x, y = row['original'], row['candidate']
            require(all(x[field] == y[field] for field in fields) and ordered(x) == ordered(y), 'strict focused observation differs: ' + name)
        before = (txs, sigs)
        walk(report['cases'], False)
        strict[name] = {'cases': expected, 'serialized_transaction_fields': txs - before[0], 'signature_fields': sigs - before[1], 'strict_program_message_mismatches': 0, 'source_coordinate_normalization': None}
    witnesses = read(a.witnesses)
    require(len(witnesses['baseline_mismatches']) == 8 and not witnesses['candidate_mismatches'], 'new regression/control evidence differs')
    inputs = [Path(__file__), ROOT / 'scripts/pump_diagnostic_audit.py', full_path, directory / 'build-comparison.json', a.witnesses, a.admin, a.holder]
    result = {'status': 'PASS_NEW_ADMIN_WALLET_RUNTIME', 'candidate_sha256': candidate, 'original_sha256': original,
        'input_sha256': {str(path.resolve().relative_to(ROOT)): sha(path) for path in inputs}, 'broad': broad,
        'broad_standard_diagnostic_cases': 10464, 'broad_source_coordinate_exclusion': 'Inherited unchanged standard diagnostic audit; strict focused checks use no Source normalization.',
        'captured_loader_suites': len(full['loader_receipts']), 'captured_loader_loads': loads, 'strict': strict,
        'total_serialized_transaction_fields': txs, 'total_signature_fields': sigs, 'unique_transaction_claimed': False,
        'compiler_or_vm_executed_by_verifier': False, 'normalized_window_gain': 0, 'remaining_pump_windows': 16}
    a.output.write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps(result, indent=2))
if __name__ == '__main__':
    main()
