"""Read-only verification of this saved packet; never executes SBPF or a VM."""
from pathlib import Path
import base64, collections, gzip, hashlib, json, sys
from solders.transaction import Transaction
P = Path(__file__).resolve().parent
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
manifest = json.loads((P / 'manifest.json').read_text())
files = {str(p.relative_to(P)): sha(p) for p in P.rglob('*') if p.is_file() and p.name != 'manifest.json' and '__pycache__' not in p.parts}
assert files == manifest['files'], 'Packet file inventory or digest mismatch'
composition = json.loads((P / 'composition.json').read_text())
for kind, name in [('base', 'base_files'), ('fixed', 'patched_files')]:
    root = P / 'source' / kind
    assert {str(p.relative_to(root)): sha(p) for p in root.rglob('*') if p.is_file()} == composition[name]
assert sha(P / 'recovery.patch') == composition['patch_sha256']
assert sha(P / 'artifacts/base.so') == composition['base_candidate_sha256']
sys.path.insert(0, str(P / 'tools'))
from elf_reader import Elf
o, c = Elf(P / 'artifacts/original.so'), Elf(P / 'artifacts/unstripped.so')
m = json.loads((P / 'measurement.json').read_text())
assert m['candidate_sha256'] == sha(P / 'artifacts/candidate.so')
assert m['symbols_sha256'] == sha(P / 'artifacts/unstripped.so')
assert m['reader_sha256'] == sha(P / 'tools/elf_reader.py')
assert [(r['start'], r['end']) for r in m['rows']] == list(zip(o.entries, o.entries[1:] + [o.hi]))
index = collections.defaultdict(list)
for f in c.funcs:
    a, n = f['start'], f['size']
    index[n, c.normalized[a:a+n], json.dumps(c.pattern(a, n), sort_keys=True)].append(f)
matched = raw_count = matched_bytes = 0
for r in m['rows']:
    a, n = r['start'], r['end'] - r['start']
    found = index[n, o.normalized[a:a+n], json.dumps(o.pattern(a, n), sort_keys=True)]
    assert {(f['start'], f['name']) for f in found} == {(f['start'], f['name']) for f in r['matches']}
    raw = any(o.b[a:a+n] == c.b[f['start']:f['start']+n] for f in found)
    assert raw == r['raw_match']
    matched += bool(found); raw_count += raw; matched_bytes += n * bool(found)
assert matched == m['normalized_matches'] and raw_count == m['raw_matches']
assert len(m['rows']) - matched == m['unmatched']
signatures = cases = 0
AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
for suite in ['admin', 'reserved', 'buyback']:
    prior = None
    for variant, candidate in [('baseline', P / 'artifacts/base.so'), ('fixed', P / 'artifacts/candidate.so')]:
        root = P / 'runtime' / variant
        doc = json.loads((root / (suite + '.json')).read_text())
        receipt = json.loads(gzip.decompress((root / (suite + '-transactions.json.gz')).read_bytes()))
        assert doc['original_sha256'] == sha(P / 'artifacts/original.so')
        assert doc['candidate_sha256'] == sha(candidate)
        assert receipt['script_sha256'] == sha(P / 'inputs/scripts' / ('pump_amm_' + suite + '_differential.py'))
        assert receipt['observer_sha256'] == sha(P / 'inputs/repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
        assert len(doc['cases']) == doc['case_count'] and not doc['mismatches']
        assert len(receipt['transactions']) == receipt['transaction_count'] == 2 * doc['case_count']
        fields = ['error', 'state_hex', 'event_logs', 'rollback'] if suite == 'admin' else ['error', 'state_hex', 'events']
        if prior is not None: assert len(prior) == len(doc['cases'])
        sig_count = 0
        for i, row in enumerate(doc['cases']):
            assert row['match'] and all(row['original'][k] == row['candidate'][k] for k in fields)
            if prior is not None:
                assert all(row[side][k] == prior[i][side][k] for side in ['original', 'candidate'] for k in fields)
            for offset, side in [(0, 'original'), (1, 'candidate')]:
                record = receipt['transactions'][2*i+offset]
                raw = base64.b64decode(record['transaction_base64']); tx = Transaction.from_bytes(raw)
                assert tx.signatures and all(tx.verify_with_results())
                assert record['transaction_sha256'] == hashlib.sha256(raw).hexdigest()
                assert record['signature_count'] == len(tx.signatures)
                sig_count += len(tx.signatures)
                assert record['error'] == row[side]['error']
                wanted = sha(P / 'artifacts/original.so') if side == 'original' else sha(candidate)
                assert record['amm_program_sha256'] == record['loaded_programs'][AMM]['sha256'] == wanted
                if suite == 'admin':
                    assert record['logs_sha256'] == hashlib.sha256(json.dumps(row[side]['logs'], separators=(',', ':')).encode()).hexdigest()
        assert receipt['signature_count'] == sig_count
        signatures += sig_count; cases += doc['case_count']; prior = doc['cases']
print(json.dumps({'packet_files': len(files), 'normalized_matches': matched, 'raw_matches': raw_count,
                  'matched_text_bytes': matched_bytes, 'comparison_cases': cases,
                  'verified_signatures': signatures, 'vm_executed': False}, indent=2))
