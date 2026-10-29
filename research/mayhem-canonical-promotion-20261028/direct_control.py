#!/usr/bin/env python3
"""Record the shorter compiler ELF's own-account allocation difference explicitly."""
import argparse, base64, gzip, hashlib, json, sys
from pathlib import Path
from solders.transaction import Transaction

def require(ok, message):
    if not ok:
        raise ValueError(message)
def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--repo', type=Path, required=True)
    p.add_argument('--candidate', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    a = p.parse_args()
    root = a.repo.resolve()
    sys.path.insert(0, str(root / 'scripts'))
    import mayhem_buy_fixture as fixture
    cases = root / 'repro/mayhem/twenty/buy-cases.json'
    case = json.loads(cases.read_text())['cases'][0]
    original, candidate = fixture.run(case), fixture.run(case, a.candidate.resolve())
    differences = {}
    for phase in ['before', 'after']:
        require(set(original[phase]) == set(candidate[phase]), 'watched account set differs')
        differences[phase] = [key for key in original[phase] if original[phase][key] != candidate[phase][key]]
        require(differences[phase] == [str(fixture.MAY)], 'unexpected direct-load difference')
    require(original['error'] == candidate['error'] and original['transaction_base64'] == candidate['transaction_base64'], 'signed transaction or error differs')
    signatures = 0
    for row in [original, candidate]:
        tx = Transaction.from_bytes(base64.b64decode(row['transaction_base64']))
        checks = tx.verify_with_results()
        require(checks and all(checks), 'signature invalid')
        signatures += len(checks)
    result = {'scope': __doc__, 'candidate_sha256': hashlib.sha256(a.candidate.read_bytes()).hexdigest(),
        'case': case, 'original': original, 'candidate': candidate, 'account_differences': differences,
        'signed_transactions': 2, 'signature_fields_verified': signatures,
        'allocation_difference_expected': True, 'comparison_mask_applied': False}
    a.output.write_bytes(gzip.compress(json.dumps(result, separators=(',', ':')).encode(), mtime=0))
    print(json.dumps({'account_differences': differences, 'signature_fields_verified': signatures}))

if __name__ == '__main__':
    main()
