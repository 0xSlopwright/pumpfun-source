"""Verify saved source, instruction windows and signed diagnostics; no VM execution."""
from pathlib import Path
import base64, collections, gzip, hashlib, json, sys
from solders.transaction import Transaction

W = Path(__file__).resolve().parent
R = W / 'inputs'
sys.path.insert(0, str(R / 'repro/pump_amm/claim-self-transfer-v144/static-tool'))
from elf_reader import Elf

from functools import cache

@cache
def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

manifest=json.loads((W/'manifest.json').read_text())
files={str(p.relative_to(W)):sha(p) for p in W.rglob('*') if p.is_file() and p.name!='manifest.json' and '__pycache__' not in p.parts}
assert files==manifest['files'], 'File inventory or digest mismatch'
composition = json.loads((W / 'composition.json').read_text())
base = W / 'source/base'
actual = {str(p.relative_to(W / 'source/fixed')): sha(p)
          for p in (W / 'source/fixed').rglob('*') if p.is_file()}
assert actual == composition['patched_files']
assert {str(p.relative_to(base)): sha(p) for p in base.rglob('*') if p.is_file()} == composition['base_files']
assert sha(W / 'recovery.patch') == composition['patch_sha256']
changed = [p for p in sorted(set(actual) | set(composition['base_files'])) if actual.get(p) != composition['base_files'].get(p)]
assert set(changed) == {
    'programs/pump-amm/src/trade.rs',
    'programs/pump-amm/src/instructions/swap/trade_v2.rs',
}
import difflib
expected_patch = ''
for name in changed:
    left, right = base / name, W / 'source/fixed' / name
    expected_patch += ''.join(difflib.unified_diff(
        left.read_text().splitlines(True) if left.exists() else [], right.read_text().splitlines(True) if right.exists() else [],
        fromfile='a/' + name if left.exists() else '/dev/null', tofile='b/' + name if right.exists() else '/dev/null'))
assert (W / 'recovery.patch').read_text() == expected_patch


build = json.loads((W / 'build/build-comparison.json').read_text())
assert build['returncode'] == 0 and build['source_unchanged']
assert build['source_sha256'] == build['source_after_sha256']
for p, digest in build['source_sha256'].items():
    assert sha(R / p) == digest, p
assert build['dependency_cache_before'] == build['dependency_cache_after']
candidate = W / 'build/artifacts/pump_amm_recovered.so'
symbols = W / 'build/artifacts/unstripped.so'
assert sha(symbols) == build['unstripped_sha256'] == build['archived_unstripped_sha256']
m = json.loads((W / 'measurement.json').read_text())
previous = json.loads((W / 'base-measurement.json').read_text())
assert m['candidate_sha256'] == sha(candidate)
assert m['symbols_sha256'] == sha(symbols)
assert m['reader_sha256'] == sha(R / 'repro/pump_amm/claim-self-transfer-v144/static-tool/elf_reader.py')
assert previous['candidate_sha256'] == composition['base_candidate_sha256']
o, c = Elf(R / 'evidence/original/pump_amm/deployed.so'), Elf(symbols)
assert [(r['start'], r['end']) for r in m['rows']] == list(zip(o.entries, o.entries[1:] + [o.hi]))
index = collections.defaultdict(list)
for f in c.funcs:
    a, n = f['start'], f['size']
    index[n, c.normalized[a:a+n], json.dumps(c.pattern(a, n), sort_keys=True)].append(f)
counts = dict(windows=len(m['rows']), normalized_matches=0, raw_matches=0, unmatched=0)
text_bytes = 0
for r in m['rows']:
    a, n = r['start'], r['end'] - r['start']
    found = index[n, o.normalized[a:a+n], json.dumps(o.pattern(a, n), sort_keys=True)]
    assert {(f['start'], f['name']) for f in found} == {(f['start'], f['name']) for f in r['matches']}
    raw = any(o.b[a:a+n] == c.b[f['start']:f['start']+n] for f in found)
    assert raw == r['raw_match']
    for f in r['matches']:
        assert hashlib.sha256(c.b[f['start']:f['start']+n]).hexdigest() == f['raw_sha256']
    counts['normalized_matches'] += bool(found)
    counts['raw_matches'] += raw
    counts['unmatched'] += not found
    text_bytes += n * bool(found)
assert all(counts[k] == m[k] for k in counts)
old_rows = {r['start']: r for r in previous['rows']}
gains, losses, raw_gains, raw_losses = [], [], [], []
for r in m['rows']:
    p = old_rows[r['start']]
    if r['matches'] and not p['matches']: gains.append(hex(r['start']))
    if p['matches'] and not r['matches']: losses.append(hex(r['start']))
    if r['raw_match'] and not p['raw_match']: raw_gains.append(hex(r['start']))
    if p['raw_match'] and not r['raw_match']: raw_losses.append(hex(r['start']))
assert not losses and not raw_losses


AMM='pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA'
DEP_PATHS={
 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA':'evidence/dependencies/spl_token/deployed.so',
 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb':'evidence/dependencies/spl_token_2022/deployed.so',
 'pfeeUxB6jkeY1Hxd7CsFCAjcbHA9rWtchMGdZ6VojVZ':'evidence/original/pump_fees/deployed.so',
 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL':'evidence/dependencies/associated_token/deployed.so',
 '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P':'evidence/original/pump/deployed.so',
}
origin_hash=sha(R/'evidence/original/pump_amm/deployed.so')
runtime={}
for suite in ['trade_v2','multi_hop']:
    prior_rows=prior_messages=None;arms={}
    deps={k:v for k,v in DEP_PATHS.items() if suite=='multi_hop' or k not in ['ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL','6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P']}
    for variant,expected in [('baseline',composition['base_candidate_sha256']),('fixed',sha(candidate))]:
        folder=W/'runtime'/variant;doc=json.loads((folder/(suite+'.json')).read_text());txs=json.loads(gzip.decompress((folder/(suite+'-transactions.json.gz')).read_bytes()))
        assert doc['original_sha256']==origin_hash and doc['candidate_sha256']==expected
        assert not doc['mismatches'] and len(doc['cases'])==doc['case_count']
        script_sha=sha(R/'scripts'/('pump_amm_'+suite+'_differential.py'))
        assert txs['script_sha256']==script_sha and doc.get('script_sha256',script_sha)==script_sha
        assert txs['observer_sha256']==sha(R/'repro/pump_amm/owner6048-v144/runtime/observe_suite.py')
        assert len(txs['transactions'])==txs['transaction_count']==2*doc['case_count']
        sigs=0;messages=[]
        for i,row in enumerate(doc['cases']):
            fields=[k for k in row['original'] if k!='logs']
            assert all(row['original'][k]==row['candidate'][k] for k in fields)
            assert (not row['mismatches']) if suite=='multi_hop' else (row['match'] and not row['mismatched_fields'])
            if prior_rows is not None:
                omit={'original','candidate','match','diff','mismatches','mismatched_fields'}
                assert {k:v for k,v in row.items() if k not in omit} == {k:v for k,v in prior_rows[i].items() if k not in omit}
                assert all(row[side][k]==prior_rows[i][side][k] for side in ['original','candidate'] for k in fields)
            pair=[]
            for offset,side in [(0,'original'),(1,'candidate')]:
                record=txs['transactions'][2*i+offset];raw=base64.b64decode(record['transaction_base64']);tx=Transaction.from_bytes(raw)
                assert tx.signatures and all(tx.verify_with_results())
                assert record['sequence']==2*i+offset and record['transaction_sha256']==hashlib.sha256(raw).hexdigest()
                assert record['signature_count']==len(tx.signatures);sigs+=len(tx.signatures)
                assert record['error']==row[side]['error']
                wanted=origin_hash if side=='original' else expected
                assert set(record['loaded_programs'])=={AMM,*deps}
                assert record['amm_program_sha256']==record['loaded_programs'][AMM]['sha256']==wanted
                for key,path in deps.items():assert record['loaded_programs'][key]['sha256']==sha(R/path)
                assert record['logs_sha256']==hashlib.sha256(json.dumps(row[side]['logs'],separators=(',',':')).encode()).hexdigest()
                pair.append(bytes(tx.message))
            assert pair[0]==pair[1];messages.append(pair[0])
        if prior_messages is not None:assert prior_messages==messages
        assert sigs==txs['signature_count']
        assert {v['sha256'] for v in txs['program_file_sha256'].values()}=={origin_hash,expected,*(sha(R/path) for path in deps.values())}
        arms[variant]={'cases':doc['case_count'],'transactions':txs['transaction_count'],'signatures':sigs};prior_rows,prior_messages=doc['cases'],messages
    runtime[suite]=arms
report={'scope':__doc__,'candidate_sha256':sha(candidate),'base_candidate_sha256':composition['base_candidate_sha256'],'counts':counts,'normalized_text_bytes':text_bytes,'normalized_gains':gains,'normalized_losses':losses,'raw_gains':raw_gains,'raw_losses':raw_losses,'runtime':runtime,'recorded_source_inputs':len(build['source_sha256']),'dependency_artifacts':len(build['dependency_cache_before']),'limits':['Candidate module organization, not proof of historical source text.','Focused signed synthetic fixtures, not whole-program runtime equivalence.']}
print(json.dumps(report,indent=2))
