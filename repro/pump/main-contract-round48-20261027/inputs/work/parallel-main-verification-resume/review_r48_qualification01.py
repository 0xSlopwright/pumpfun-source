"""Read-only audit of already executed R48 controls and loader receipts."""
from pathlib import Path
import base64
import gzip
import hashlib
import importlib.util
import json
import sys
from solders.transaction import VersionedTransaction

R = Path(__file__).resolve().parents[2]
W = R / 'work/parallel-main-v3-quote-preflight'
O = Path(__file__).resolve().parent
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read = lambda p: json.loads(p.read_text())
sys.path.insert(0, str(R / 'work/parallel-main-r41-log-oracle'))
spec = importlib.util.spec_from_file_location('r48_log_audit', R / 'work/parallel-main-r41-log-oracle/audit.py')
logs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(logs)
path = W / 'R48-QUALIFICATION01.json.gz'
report = json.loads(gzip.decompress(path.read_bytes()))
baseline = json.loads(gzip.decompress((W / 'BASELINE01.json.gz').read_bytes()))
loader_path = W / 'R48-QUALIFICATION01.loader.json'
loader = read(loader_path)
candidate = R / 'work/parallel-main-integration/build-round48/candidate.so'
original = R / 'evidence/original/pump/deployed.so'
assert report['candidate_sha256'] == sha(candidate) == 'f9094fac43ee4d1c2affda22e677d5924bef147abf35740606abb2b12cb70597'
assert report['original_sha256'] == sha(original)
assert report['case_count'] == 4 and not report['mismatches'] and report['known_filename_only_rows'] == [2]
assert report['plan_sha256'] == sha(W / 'FIXTURE-PLAN01.json')
assert report['definition_sha256'] == sha(W / 'quote_control_inputs.py')
assert report['dedup_sha256'] == sha(W / 'DEDUP-PROVENANCE01.json')
rows = []
for i, row in enumerate(report['cases']):
    o, n = row['original'], row['candidate']
    old = baseline['cases'][i]
    assert row['case'] == old['case'] and not row['different_fields']
    for key in ['full_before', 'transaction_base64']:
        assert o[key] == n[key] == old['original'][key]
    assert o['clock'] == n['clock']
    old_clock = old['original']['clock']
    assert o['clock'] == old_clock | {'slot': 458921441} and old_clock['slot'] == 0
    tx = VersionedTransaction.from_bytes(base64.b64decode(o['transaction_base64']))
    assert all(tx.verify_with_results()) and o['signature_verified'] and n['signature_verified']
    for key in ['error', 'accounts', 'inner_instructions', 'event_payloads', 'return_data']:
        assert o[key] == n[key]
    expected_error = [None, 6023, 6010, 6023][i]
    assert (o['error'] is None) if expected_error is None else f'InstructionErrorCustom({expected_error})' in o['error']
    left, right = logs.scope(logs.norm(o['logs'])), logs.scope(logs.norm(n['logs']))
    assert left is not None and right is not None
    if i == 2:
        assert logs.classify(left, right)[0] == 'source_file_path_only'
        assert right == [x.replace('programs/pump/src/buy_v2.rs:<source>', 'programs/pump/src/trade_v3.rs:<source>') for x in left]
    else:
        assert left == right
    if i:
        for side in [o, n]:
            for key, before in side['full_before'].items():
                after = side['accounts'][key]
                if before == after:
                    continue
                # Runtime transaction fee is the only permitted committed failure delta.
                assert str(tx.message.account_keys[0]) == key and before and after
                assert {k:v for k,v in before.items() if k != 'lamports'} == {k:v for k,v in after.items() if k != 'lamports'}
                assert before['lamports'] >= after['lamports']
    rows.append({'name': row['case']['name'], 'expected_and_actual_error': expected_error, 'outcome_fields_equal': True, 'ordered_logs': 'known_filename_only' if i == 2 else 'equal', 'same_account_prestate_and_signed_transaction': True, 'clock_change_from_unwrapped_baseline': {'slot_before': 0, 'slot_after': 458921441, 'all_other_fields_unchanged': True}, 'paired_clock_exact': True})

for p, digest in loader['input_sha256'].items():
    assert sha(Path(p)) == digest
captured = (R / 'evidence/original/pump/programdata-account.bin').read_bytes()
header = captured[:45]
assert len(loader['loads']) == 9
candidate_loads = 0
for load in loader['loads']:
    raw = Path(load['input_path']).read_bytes()
    assert load['elf_sha256'] == hashlib.sha256(raw).hexdigest()
    assert load['elf_bytes'] == len(raw) and load['elf_prefix_unchanged'] and load['zero_allocation_tail']
    assert load['header_sha256'] == hashlib.sha256(header).hexdigest()
    expected_image = header + raw + bytes(len(captured) - 45 - len(raw))
    assert load['programdata_sha256'] == hashlib.sha256(expected_image).hexdigest()
    assert load['programdata_bytes'] == len(captured)
    candidate_loads += Path(load['input_path']) == candidate
assert candidate_loads == 4

out = O / 'R48-QUALIFICATION-REVIEW01.json'
data = {'status': 'passed_four_control_qualification', 'candidate_sha256': sha(candidate), 'qualification_cases': 4, 'new_admitted_cases': 3, 'duplicate_valid_case_excluded': True, 'cases': rows, 'loader_candidate_loads': candidate_loads, 'input_sha256': {str(p.relative_to(R)):sha(p) for p in [Path(__file__), path, loader_path, W/'BASELINE01.json.gz', O/'R48-ADDITIONS-REVIEW01.json']}, 'limits': ['Read-only audit; no new VM or compiler.', 'Captured-loader policy admits the captured deployment by moving slot from 0 to 458921441 in both sides; all other Clock fields and account prestates are unchanged.', 'The full 18,148-case R48 corpus and repeat/canonical/archive builds remain mandatory.', 'The quote-authority-only control retains the explicit previously recorded source filename mismatch.']}
out.write_text(json.dumps(data, indent=2) + '\n')
print({'status':data['status'], 'sha256':sha(out), 'cases':4, 'new_cases':3})
