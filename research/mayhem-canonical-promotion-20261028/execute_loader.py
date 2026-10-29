#!/usr/bin/env python3
"""Observe the unchanged real upgradeable-loader controller for exact Mayhem."""
from pathlib import Path
import argparse, base64, gzip, hashlib, importlib.util, json, struct
from solders.litesvm import LiteSVM

def require(ok, message):
    if not ok:
        raise ValueError(message)

def sha(data):
    return hashlib.sha256(data).hexdigest()

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--repo', type=Path, required=True)
    p.add_argument('--candidate', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    a = p.parse_args()
    repo, out = a.repo.resolve(), a.output.resolve()
    out.mkdir(parents=True, exist_ok=False)
    script = repo / 'repro/donation-relay/offline-loader-allocation/verify.py'
    spec = importlib.util.spec_from_file_location('unchanged_real_loader', script)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    elf = a.candidate.read_bytes()
    original = (repo / 'evidence/original/mayhem/deployed.so').read_bytes()
    require(sha(elf) == '9af9e3b1cbc9d89340af4d9d46e4c88d3dc2fc67e0090f9370047d97532ff09d' and len(elf) == 775416, 'compiler ELF differs')
    require(len(original) == 777408 and original[:len(elf)] == elf and not any(original[len(elf):]), 'original allocation boundary')
    get, send = LiteSVM.get_account, LiteSVM.send_transaction
    payloads, transactions = [], []
    def observed_get(self, key):
        account = get(self, key)
        if account is not None:
            data = bytes(account.data)
            if len(data) == 777453 and struct.unpack_from('<I', data)[0] == 3:
                payloads.append(data[45:])
        return account
    def observed_send(self, tx):
        raw, checks = bytes(tx), tx.verify_with_results()
        require(checks and all(checks), 'loader signature invalid')
        result = send(self, tx)
        require(bytes(tx) == raw, 'loader transaction changed')
        transactions.append({'transaction_base64': base64.b64encode(raw).decode(), 'sha256': sha(raw), 'signatures': len(checks)})
        return result
    LiteSVM.get_account, LiteSVM.send_transaction = observed_get, observed_send
    try:
        receipt = module.execute(elf, 777408, original)
    finally:
        LiteSVM.get_account, LiteSVM.send_transaction = get, send
    require(len(payloads) == 1 and payloads[0] == original, 'VM loader payload differs')
    require(receipt['transactions'] == len(transactions) == 864 and receipt['whole_original_payload_equal'], 'loader result differs')
    (out / 'payload.bin').write_bytes(payloads[0])
    (out / 'receipt.json').write_text(json.dumps(receipt, indent=2) + '\n')
    (out / 'transactions.json.gz').write_bytes(gzip.compress(json.dumps(transactions, separators=(',', ':')).encode(), mtime=0))
    observation = {'existing_controller_sha256': sha(script.read_bytes()), 'observer_sha256': sha(Path(__file__).read_bytes()),
        'compiler_output_unmodified': True, 'loader_generated_payload': True, 'payloads_observed': len(payloads),
        'transactions': len(transactions), 'signature_fields': sum(r['signatures'] for r in transactions), 'rpc_used': False}
    (out / 'observation.json').write_text(json.dumps(observation, indent=2) + '\n')
    print(json.dumps(observation))

if __name__ == '__main__':
    main()
