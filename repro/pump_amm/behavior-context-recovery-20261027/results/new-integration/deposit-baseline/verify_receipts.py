"""Re-decode deposit receipts and bind the build's current private source."""
from pathlib import Path
import base64, gzip, hashlib, json
from solders.transaction import Transaction

W = Path(__file__).resolve().parent
ROOT = W.parents[1]
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
checks = []
for name in ['baseline', 'candidate', 'liquidity']:
    path = W/('liquidity.json' if name == 'liquidity' else name+'-probe.json')
    result = json.loads(path.read_text())
    observed = json.loads(gzip.decompress((W/(name+'-transactions.json.gz')).read_bytes()))
    rows = observed['transactions']
    assert len(rows) == 2*result['case_count']
    for i in range(0, len(rows), 2):
        txs = [Transaction.from_bytes(base64.b64decode(row['transaction_base64'], validate=True)) for row in rows[i:i+2]]
        assert bytes(txs[0].message) == bytes(txs[1].message)
        for tx, row in zip(txs, rows[i:i+2]):
            assert all(tx.verify_with_results()) and row['all_signatures_verified']
        assert rows[i]['amm_program_sha256'] == result['original_sha256']
        assert rows[i+1]['amm_program_sha256'] == result['candidate_sha256']
    mismatches = len(result['mismatches']) if name == 'liquidity' else result['mismatch_count']
    checks.append(dict(suite=name, cases=result['case_count'], mismatches=mismatches,
                      signed_transactions=len(rows), signed_message_pairs=len(rows)//2,
                      all_signatures_reverified=True))
assert [x['mismatches'] for x in checks] == [4, 0, 0]
record = json.loads((W/'build/build-comparison.json').read_text())
assert record['source_unchanged'] and record['returncode'] == 0
for name, digest in record['source_sha256'].items():
    assert sha(ROOT/name) == digest, name
print(json.dumps(dict(checks=checks,
                     total_signed_transactions=sum(x['signed_transactions'] for x in checks),
                     built_source_rehashed=True, build_source_files=len(record['source_sha256']),
                     candidate_sha256=record['comparison']['candidate_sha256']), indent=2))
