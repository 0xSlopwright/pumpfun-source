"""Independently verify actual fee-counter mutations, signed triples and rollback/diagnostics."""
from pathlib import Path
import base64, gzip, hashlib, json, re, struct, sys
from solders.transaction import Transaction
sys.dont_write_bytecode = True
Q = Path(__file__).resolve().parent
R = Q.parents[4]
sha = lambda b: hashlib.sha256(b).hexdigest()
def need(value, message):
    if not value: raise ValueError(message)
def read(path): return json.loads(gzip.decompress(path.read_bytes()))
reports = [read(Q / f) for f in ('counter-witness.json.gz', 'counter-witness-protocol.json.gz')]
rows = reports[0]['cases'] + reports[1]['cases']
controls = {r['case']['sell']: r for r in rows if r['case']['name'].endswith('-control')}
units = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
logs = lambda x: [s for s in x['logs'] if not units.fullmatch(s)]
fields = signatures = loaders = mutations = raw_fields = 0
different = []
wires = set()
for report in reports:
    need(report['executions'] == 3*len(report['cases']), 'execution count')
    for name, digest in report['input_sha256'].items(): need(sha((R / name).read_bytes()) == digest, 'executed producer/input bytes')
for row in rows:
    case = row['case']; original = row['runs']['original']; control = controls[case['sell']]['runs']['original']
    for label, run in row['runs'].items():
        encoded = base64.b64decode(run['transaction_base64'], validate=True)
        tx = Transaction.from_bytes(encoded); checks = tx.verify_with_results()
        need(bytes(tx) == encoded and len(checks) == 1 and all(checks), 'actual transaction signature')
        need(sha(encoded) == run['transaction_sha256'], 'actual wire digest')
        need(len(tx.message.instructions) == 1, 'one outer instruction')
        payer = str(tx.message.account_keys[0]); ins = tx.message.instructions[0]
        need(str(tx.message.account_keys[ins.program_id_index]) == 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA', 'actual AMM entry')
        need(bytes(ins.data)[:8] == hashlib.sha256(b'global:multi_hop_swap').digest()[:8], 'actual multi-hop instruction')
        need(run['transaction_base64'] == original['transaction_base64'] == control['transaction_base64'], 'same signed fixture input')
        before, after = run['before'], run['after']
        expected = json.loads(json.dumps(control['before']))
        for mutation in row['exact_counter_mutations'][label]:
            need(mutation['field'] in ('protocol_fees', 'creator_fee') and mutation['new'] == 2**64-1, 'actual mutation type')
            need(mutation['offset'] == {'protocol_fees':133, 'creator_fee':125}[mutation['field']], 'actual serialized offset')
            raw = bytearray.fromhex(expected[mutation['address']]['data_hex'])
            need(len(raw) == 166 and struct.unpack_from('<Q', raw, mutation['offset'])[0] == mutation['old'], 'counter before value')
            struct.pack_into('<Q', raw, mutation['offset'], mutation['new'])
            expected[mutation['address']]['data_hex'] = raw.hex(); mutations += 1
        need(expected == before, case['name'] + ': only declared counter bytes changed; admission fixture unchanged')
        need(sum(v['lamports'] for v in before.values() if v) - sum(v['lamports'] for v in after.values() if v) == 5000, 'watched lamport conservation plus fee')
        if run['error'] is not None:
            need(before[payer]['lamports'] - after[payer]['lamports'] == 5000, 'failed transaction payer fee')
            need(all(before[k] == after[k] for k in before if k != payer), 'complete watched-account rollback')
        obs = row['observations'][label]
        need(obs['transaction_base64'] == run['transaction_base64'] and obs['signatures_verified'], 'actual observed wire')
        need(obs['metadata']['logs'] == run['logs'] and obs['metadata']['inner_instructions'] == run['inner'], 'actual raw metadata')
        load, = obs['loads']; loaders += 1
        need(load['elf_sha256'] == reports[0]['images_sha256'][label] and load['elf_prefix_unchanged'] and load['zero_allocation_tail'], 'actual captured-loader image')
        need(run['program_sha256']['6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'] == load['elf_sha256'], 'selected actual program input')
        need(len(obs['program_loads']) == 6 and len({p['program'] for p in obs['program_loads']}) == 6, 'actual six installed programs')
        need({p['program']: p['sha256'] for p in obs['program_loads']} == run['program_sha256'], 'actual program image map')
        for key in ('error','events','inner','return_data','before','after','transaction_base64','pump_calls','token_calls'):
            need(run[key] == original[key], case['name'] + ': triple ' + key)
            raw_fields += 1
        if label == 'proposal': need(logs(run) == logs(original), case['name'] + ': new strict diagnostic')
        if label == 'parent' and logs(run) != logs(original):
            need('lib.rs:2554.' in '\n'.join(logs(original)), 'original error source')
            need('multi_hop_curve_swap.rs:64.' in '\n'.join(logs(run)), 'parent error source')
            need([s.replace('programs/pump/src/multi_hop_curve_swap.rs:64.', 'programs/pump/src/lib.rs:2554.') for s in logs(run)] == logs(original), 'only actual source-site diagnostic differs')
            different.append(case['name'])
        fields += 1; signatures += len(checks); wires.add(encoded)
need(different == ['buy-token-creator-max','sell-token-creator-max','sell-dual-native-protocol-token-creator-max'], 'three bounded parent differences')
need(len(rows) == 12 and fields == signatures == loaders == 36, 'actual totals')
result = dict(passed=True, fixtures=12, executions=fields, verified_signature_fields=signatures,
    distinct_serialized_transactions=len(wires), captured_loader_observations=loaders,
    checked_counter_mutations=mutations, checked_raw_comparison_fields=raw_fields,
    parent_source_differences=different, proposal_differences=[],
    report_sha256={f:sha((Q/f).read_bytes()) for f in ('counter-witness.json.gz','counter-witness-protocol.json.gz')},
    auditor_sha256=sha(Path(__file__).read_bytes()),
    limits=['Synthetic preexisting state; no reachable mainnet-state claim.',
            'Native MAX cases preempt at reserved-fee sum lib.rs2562; token protocol-MAX controls succeed because flag2 disables protocol fees.',
            'Three restored Source diagnostics, no accepted complete-window gain; original rejected Mayhem witnesses are separate.'])
(Q/'counter-independent-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,sort_keys=True))
