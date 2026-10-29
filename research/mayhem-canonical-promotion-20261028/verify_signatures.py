#!/usr/bin/env python3
"""Cryptographically recheck all retained local Mayhem transaction signatures."""
import argparse, base64, gzip, hashlib, json
from pathlib import Path
from solders.transaction import Transaction

HERE = Path(__file__).resolve().parent
def require(ok, message):
    if not ok:
        raise ValueError(message)
def read(path):
    data = path.read_bytes()
    return json.loads(gzip.decompress(data) if path.suffix == '.gz' else data)
def verify(packet):
    selection = read(packet / 'selection.json')
    runtime = packet / selection['runtime_directory']
    paths = sorted(runtime.glob('*-transactions.json.gz')) + [runtime / 'loader/transactions.json.gz']
    reports = []
    total_transactions, total_signatures = 0, 0
    for path in paths:
        data = read(path)
        rows = data['transactions'] if isinstance(data, dict) else data
        signatures = 0
        for row in rows:
            raw = base64.b64decode(row['transaction_base64'], validate=True)
            require(hashlib.sha256(raw).hexdigest() == row['sha256'], 'raw transaction digest differs')
            tx = Transaction.from_bytes(raw)
            checks = tx.verify_with_results()
            require(bytes(tx) == raw and checks and all(checks) and len(checks) == row['signatures'], 'signature invalid')
            signatures += len(checks)
        reports.append({'path': path.relative_to(packet).as_posix(), 'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'transactions': len(rows), 'signature_fields': signatures})
        total_transactions += len(rows)
        total_signatures += signatures
    direct = read(packet / selection['direct_control'])
    signatures = 0
    for side in ['original', 'candidate']:
        raw = base64.b64decode(direct[side]['transaction_base64'], validate=True)
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        require(bytes(tx) == raw and checks and all(checks), 'direct control signature invalid')
        signatures += len(checks)
    require(signatures == direct['signature_fields_verified'] == 4, 'direct signature fields differ')
    total_transactions += 2
    total_signatures += signatures
    reports.append({'path': selection['direct_control'], 'sha256': hashlib.sha256((packet / selection['direct_control']).read_bytes()).hexdigest(),
        'transactions': 2, 'signature_fields': signatures})
    require(total_transactions == selection['runtime_counts']['transactions'] + 866 and
        total_signatures == selection['runtime_counts']['signature_fields'] + 870, 'signature totals differ')
    return {'status': 'PASS_ALL_RETAINED_MAYHEM_SIGNATURES', 'transactions': total_transactions,
        'signature_fields': total_signatures, 'rows': reports, 'target_executions': 0, 'rpc_used': False}

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--packet', type=Path, default=HERE)
    a = p.parse_args()
    print(json.dumps(verify(a.packet.resolve()), indent=2))
