#!/usr/bin/env python3
"""Run unchanged local fixture code and retain every normally signed submission."""
import argparse, base64, gzip, hashlib, json, runpy, sys
from pathlib import Path
from solders.litesvm import LiteSVM
from solders.transaction_metadata import FailedTransactionMetadata

def sha(data):
    return hashlib.sha256(data).hexdigest()

def require(ok, message):
    if not ok:
        raise ValueError(message)

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--script', type=Path, required=True)
    p.add_argument('--observations', type=Path, required=True)
    p.add_argument('arguments', nargs=argparse.REMAINDER)
    a = p.parse_args()
    script = a.script.resolve()
    sys.path.insert(0, str(script.parent))
    arguments = a.arguments[1:] if a.arguments[:1] == ['--'] else a.arguments
    sys.argv = [str(script), *arguments]
    send = LiteSVM.send_transaction
    rows = []
    def observed_send(self, tx):
        raw, checks = bytes(tx), tx.verify_with_results()
        require(checks and all(checks), 'ordinary transaction signature invalid')
        result = send(self, tx)
        require(bytes(tx) == raw and all(tx.verify_with_results()), 'transaction changed during execution')
        failed = isinstance(result, FailedTransactionMetadata)
        metadata = result.meta() if failed else result
        rows.append({'transaction_base64': base64.b64encode(raw).decode(), 'sha256': sha(raw),
            'signatures': len(checks), 'error': str(result.err()) if failed else None,
            'metadata_sha256': sha(metadata.to_json().encode())})
        return result
    LiteSVM.send_transaction = observed_send
    code = 0
    try:
        runpy.run_path(str(script), run_name='__main__')
    except SystemExit as exc:
        code = exc.code or 0
        if not isinstance(code, int):
            code = 1
    finally:
        LiteSVM.send_transaction = send
        a.observations.write_bytes(gzip.compress(json.dumps({'script_sha256': sha(script.read_bytes()),
            'observer_sha256': sha(Path(__file__).read_bytes()), 'returncode': code,
            'transactions': rows, 'signature_fields': sum(r['signatures'] for r in rows)}, separators=(',', ':')).encode(), mtime=0))
    raise SystemExit(code)

if __name__ == '__main__':
    main()
