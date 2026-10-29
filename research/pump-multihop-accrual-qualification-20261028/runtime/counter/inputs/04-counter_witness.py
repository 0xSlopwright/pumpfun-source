"""Fresh signed synthetic fee-counter boundary triples using unchanged admitted two-curve fixtures."""
from pathlib import Path
import base64, gzip, hashlib, importlib.util, json, re, struct, sys
sys.dont_write_bytecode = True
Q = Path(__file__).resolve().parent
R = Q.parents[4]
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
H = R / 'research/pump-multi-hop-quote-admission/tools/focused.py'
spec = importlib.util.spec_from_file_location('qualified_hop_fixture', H)
fixture = importlib.util.module_from_spec(spec); spec.loader.exec_module(fixture)
f, loader = fixture.f, fixture.loader
SPEC = {}
MAX = 2**64 - 1
MUTATIONS = []
Base = fixture.ObservedVM
class CounterVM(Base):
    def set_account(self, key, account):
        field = SPEC.get('native_counter') if key == f.C_A else SPEC.get('token_counter') if key == f.C_B else None
        if field and account.owner == f.PUMP and len(account.data) == 166:
            offset = {'protocol_fees': 133, 'creator_fee': 125}[field]
            raw = bytearray(account.data); old = struct.unpack_from('<Q', raw, offset)[0]
            struct.pack_into('<Q', raw, offset, MAX)
            account = f.Account(account.lamports, bytes(raw), account.owner, account.executable)
            MUTATIONS.append(dict(address=str(key), field=field, offset=offset, old=old, new=MAX))
        return super().set_account(key, account)
f.LiteSVM = CounterVM

images = {'original': R / 'evidence/original/pump/deployed.so',
          'parent': Q.parents[1] / 'images/pump708-parent.so',
          'proposal': Q / 'root-primary/candidate.so'}
expected = {'original': '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d',
            'parent': '199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473',
            'proposal': 'c0e29e2d41c30e854f3548b37e87798d516e4e0e7769f40b7d8d16e31429795f'}
if {k: sha(p) for k, p in images.items()} != expected:
    raise ValueError('Actual input image differs')
build = Q / 'root-primary/build-comparison.json'
record = json.loads(build.read_bytes())
if not (record['returncode'] == 0 and record['source_unchanged'] and record['comparison']['candidate_sha256'] == expected['proposal']):
    raise ValueError('Actual new compiler receipt missing')
inputs = {str(p.relative_to(R)): sha(p) for p in [Path(__file__), H,
    R / 'research/pump-multi-hop-quote-admission/runtime/inputs/pump_tokenkeg_two_curve_differential.py',
    R / 'research/pump-multi-hop-quote-admission/runtime/inputs/base-fixture.json',
    R / 'scripts/pump_captured_loader.py', build]}
units = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
specs = []
for sell in (False, True):
    direction = 'sell' if sell else 'buy'
    for name, changes in [('control', {}), ('native-protocol-max', {'native_counter': 'protocol_fees'}),
        ('native-creator-max-disabled-flag', {'native_counter': 'creator_fee'}),
        ('token-creator-max', {'token_counter': 'creator_fee'}),
        ('dual-native-protocol-token-creator-max', {'native_counter': 'protocol_fees', 'token_counter': 'creator_fee'})]:
        specs.append(dict(name=direction+'-'+name, sell=sell, **changes))
out = Q / 'counter-witness.json.gz'
if out.exists(): raise ValueError('Preserve previous receipt')
rows = []
for case in specs:
    SPEC.clear(); SPEC.update(case)
    runs, observations, mutations = {}, {}, {}
    for label, path in images.items():
        fixture.SENDS.clear(); loader.LOADS.clear(); MUTATIONS.clear()
        runs[label] = f.invoke(case['sell'], 10**6, 'exotic', 1, path)
        if len(fixture.SENDS) != 1 or len(loader.LOADS) != 1: raise ValueError('Execution/load count')
        observations[label] = fixture.SENDS[0]; mutations[label] = list(MUTATIONS)
        if loader.LOADS[0]['elf_sha256'] != expected[label]: raise ValueError('Actual captured image')
    differences = {}
    for label in ('parent', 'proposal'):
        fields = ['error', 'events', 'inner', 'return_data', 'before', 'after', 'transaction_base64', 'pump_calls', 'token_calls']
        differences[label] = [key for key in fields if runs['original'][key] != runs[label][key]]
        if [x for x in runs['original']['logs'] if not units.fullmatch(x)] != [x for x in runs[label]['logs'] if not units.fullmatch(x)]:
            differences[label].append('strict_ordered_logs')
    rows.append(dict(case=case, runs=runs, observations=observations, exact_counter_mutations=mutations, differences=differences))
    report = dict(scope=__doc__, images_sha256=expected, input_sha256=inputs, build_receipt_sha256=sha(build),
                  cases=rows, case_count=len(rows), executions=3*len(rows), excluded_log_pattern=units.pattern)
    out.write_bytes(gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0))
    print(json.dumps(dict(case=case['name'], errors={k: v['error'] for k, v in runs.items()}, differences=differences,
        diagnostics={k: [x for x in v['logs'] if '.rs:' in x or 'Error Code:' in x] for k, v in runs.items()})), flush=True)
if any(sha(R / name) != digest for name, digest in inputs.items()): raise ValueError('Inputs changed during execution')
