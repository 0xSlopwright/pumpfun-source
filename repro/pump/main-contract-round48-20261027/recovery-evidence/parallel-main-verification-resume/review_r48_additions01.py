"""Independent input-identity and CLI audit; reads receipts without running a VM."""
from pathlib import Path
import ast
import base64
import gzip
import hashlib
import json
import sys

R = Path(__file__).resolve().parents[2]
D = R / 'work/parallel-main-v3-quote-preflight'
O = Path(__file__).resolve().parent
sys.path.insert(0, str(R / 'work/parallel-main-r41-log-oracle'))
from paired_receipt_reader import records

sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read = lambda p: json.loads(p.read_text())
txhash = lambda row: hashlib.sha256(base64.b64decode(row['original']['transaction_base64'])).hexdigest()
proof = read(D / 'DEDUP-PROVENANCE01.json')
assert sha(D / 'DEDUP-PROVENANCE01.json') == 'd5835b0a2d20ef988e00a8d8fdeb506bd5609bd4582b61640f9ff3aa9d996884'
assert sha(D / 'CLI-MANIFEST01.json') == '63cfe35e604cb9ad3673dd9e8c531c79fbd9625b56f0ee1fd1594e64b342b838'
assert sha(D / 'INPUT-MANIFEST01.json') == 'b29b0b40d65b4446b6022d5b42155396bf73f6569b1c35539d72c616a31f8fae'
assert proof['existing_r47_inputs'] == 18145 and proof['new_distinct_cases'] == 3
for p, expected in proof['input_sha256'].items():
    assert sha(R / p) == expected, p
for p, expected in read(D / 'INPUT-MANIFEST01.json')['files'].items():
    assert sha(D / p) == expected, p
cli = read(D / 'CLI-MANIFEST01.json')
for p, expected in cli['definition_sha256'].items():
    assert sha(R / p) == expected, p
assert cli['counts'] == {'full': 0, 'additional': 3}
assert cli['suites'] == [{'group': 'additional', 'name': 'v3_quote_preflight', 'script': 'work/parallel-main-v3-quote-preflight/probe_regression.py', 'cases': 3, 'args': []}]

corpus = read(R / 'work/parallel-main-integration/unified-main-corpus-round47.json')
previous = read(R / 'work/parallel-main-integration/unified-main-corpus-round46.json')
assert corpus['counts'] == {'full': 10468, 'additional': 7677}
assert corpus['suites'][:len(previous['suites'])] == previous['suites']
assert all(corpus['definition_sha256'][p] == v for p, v in previous['definition_sha256'].items())
for p, expected in corpus['definition_sha256'].items():
    assert sha(R / p) == expected, p

baseline = json.loads(gzip.decompress((D / 'BASELINE01.json.gz').read_bytes()))
target_rows = {r['case']['name']: r for r in baseline['cases']}
admitted = {t['name'] for t in proof['targets'] if t['admit_as_new']}
assert admitted == {'sell-v3-token-balance-only', 'sell-v3-token-quote-authority-only', 'sell-v3-token-combined'}
new_hashes = {txhash(target_rows[n]) for n in admitted}
assert len(new_hashes) == 3
valid_name = 'sell-v3-token-valid'
valid = target_rows[valid_name]
valid_hash = txhash(valid)
counts = []
duplicates = []
total = 0
for inp in proof['retained_inputs']:
    p = R / inp['path']
    assert sha(p) == inp['sha256']
    if p.parent.name == 'parallel-main-integration':
        selected = ((where, row) for _, where, row in records(p))
    else:
        rows = json.loads(gzip.decompress(p.read_bytes()))['cases']
        if p.parent.name == 'parallel-main-positive-sync-fixtures':
            allowed = set(read(p.parent / 'DEDUP-ADDENDUM02.json')['admitted_names'])
            rows = [r for r in rows if r['case']['name'] in allowed]
        selected = ((f'cases/{i}', row) for i, row in enumerate(rows))
    count = 0
    for where, row in selected:
        count += 1
        digest = txhash(row)
        assert digest not in new_hashes, (p, where, 'new transaction collides')
        if digest == valid_hash:
            a, b = valid['original'], row['original']
            if a.get('full_before') == b.get('full_before') and a.get('clock') == b.get('clock') and a['transaction_base64'] == b['transaction_base64']:
                duplicates.append({'path': inp['path'], 'row': where})
    expected = inp.get('cases', inp.get('admitted_cases'))
    assert count == expected, (p, count, expected)
    total += count
    counts.append({'path': inp['path'], 'sha256': inp['sha256'], 'cases': count})
assert total == 18145
assert duplicates == [{'path': 'work/parallel-main-positive-sync-fixtures/RESULT01.json.gz', 'row': 'cases/3'}], duplicates

plan = read(D / 'FIXTURE-PLAN01.json')
fixture_path = R / plan['base_fixture']
assert sha(fixture_path) == plan['base_fixture_sha256']
fixture = read(fixture_path)
captured = fixture['steps'][plan['base_step']]['before']
for row in baseline['cases']:
    o = row['original']
    for name in ['mint', 'curve_base', 'user_base']:
        account = o['full_before'][fixture['accounts'][name]]
        original = captured[name]
        assert account['owner'] == original['owner'] and account['lamports'] == original['lamports']
        assert bytes(account['data']) == base64.b64decode(original['data_base64']) and not account['executable']
    keys = o['instruction_account_keys']
    assert (keys[7] == keys[10]) == row['case']['replace_quote_user_with_quote_curve']
    for key in [keys[7], keys[10]]:
        a = o['full_before'][key]
        assert a['owner'] == 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' and not a['executable']

driver = (D / 'probe_regression.py').read_text()
inputs = (D / 'quote_control_inputs.py').read_text()
ast.parse(driver)
ast.parse(inputs)
assert 'n=q.run(h,a.candidate,c,plan)' in driver and "'candidate_sha256':sha(a.candidate)" in driver
assert "if not a.all_controls and c['name']not in names:continue" in driver
assert "expected=4 if a.all_controls else proof['new_distinct_cases'];assert len(rows)==expected" in driver
assert "['error','accounts','inner_instructions','event_payloads','return_data']" in driver
assert "known_gap=c['name']=='sell-v3-token-quote-authority-only'and family=='source_file_path_only'and right==expected_right" in driver
assert "line.replace('programs/pump/src/buy_v2.rs:<source>','programs/pump/src/trade_v3.rs:<source>')" in driver
assert "if not known_gap:diff.append('ordered_logs')" in driver
assert "'fcd5889d68c066317fa0c7be9392779aed1f36280abb7df1aca33724812673bc'" in inputs
dependency = R / 'work/parallel-main-positive-sync-fixtures/run_cases.py'
assert sha(dependency) == 'fcd5889d68c066317fa0c7be9392779aed1f36280abb7df1aca33724812673bc'

report = {
    'status': 'additions_review_passed',
    'new_cases': 3, 'new_suites': 1, 'retained_cases_independently_scanned': total,
    'admitted_names': sorted(admitted), 'pairwise_new_transaction_hashes': sorted(new_hashes),
    'excluded_duplicate': {'name': valid_name, 'exact_matches': duplicates},
    'retained_receipts': counts,
    'cli': {'candidate_path_dynamic': True, 'default_cases': 3, 'qualification_only_all_controls': 4,
            'comparison': 'Exact errors, accounts, CPI, events, return; exact scoped ordered logs except one explicitly named pre-existing source-file-only gap.'},
    'provenance': 'Locally constructed normal-account controls from captured account templates; base mint and both base token accounts preserved byte-for-byte with owners and lamports. Quote fault aliases an existing curve ATA; no forged account owner.',
    'input_sha256': {str(p.relative_to(R)): sha(p) for p in [Path(__file__), D/'BASELINE01.json.gz', D/'DEDUP-PROVENANCE01.json', D/'CLI-MANIFEST01.json', D/'INPUT-MANIFEST01.json', D/'FIXTURE-PLAN01.json', D/'quote_control_inputs.py', D/'probe_regression.py', O/'QUOTE-PREFLIGHT-BASELINE-REVIEW01.json', R/'work/parallel-main-integration/unified-main-corpus-round47.json']},
    'limits': ['No VM, compiler, pipeline or input-definition mutation performed.', 'R48 final-candidate qualification and all full-corpus replays remain required.', 'The valid baseline case is excluded from the new count, even though some older partial receipts are ambiguous.']
}
out = O / 'R48-ADDITIONS-REVIEW01.json'
out.write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'status': report['status'], 'new_cases': 3, 'scanned': total, 'sha256': sha(out)}))
