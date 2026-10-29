#!/usr/bin/env python3
"""Read-only structural attribution of the maintained AMM sell boundary.

This is NOT an acceptance normalizer or a semantic-equivalence checker.
The official instruction-window test stays byte-strict outside its existing
relocation masks. Canonical CFGs remove empty jump forwarding, join unique
straight-line successors and pair inverted conditional edges. Calls are assumed
to fall through in this *syntactic* graph; no execution reachability is inferred.
"""
import gzip
import hashlib
import importlib
import json
from pathlib import Path
import sys
import tempfile

P = Path(__file__).resolve().parent
ROOT = P.parents[1]
TOOLS = ROOT / 'research/amm-sell-returned-key-20261028/tools'
ORIGINAL = 'evidence/original/pump_amm/deployed.so'
CURRENT = 'repro/pump_amm/canonical-frontier-20261028/results/build-a/symbols.so'
STRIPPED = 'repro/pump_amm/canonical-frontier-20261028/results/build-a/candidate.so'
PR645 = 'research/amm-sell-returned-key-20261028/builds/clean/unstripped.so.gz'
SOURCE = 'repro/pump_amm/canonical-frontier-20261028/results/build-a/canonical-source.tar.gz'
ENTRY = 0x4c750


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def dependencies():
    # Authenticated before importing; historical tools contain assertions.
    require(__debug__, 'Run without Python -O: pinned historical graph tools use assertions')
    pins = json.loads((P / 'inputs.json').read_text())
    for name, digest in pins.items():
        require(sha((ROOT / name).read_bytes()) == digest, 'input drift: ' + name)
    sys.path.insert(0, str(TOOLS))
    return importlib.import_module('cfg_attribution'), importlib.import_module('measure')


def instruction(row):
    return bytes.fromhex(row['official_normalized_value'])


def call_identity(row):
    c = row['actual_direct_callee']
    return c['identity_sha256'] if c else None


def compare_graphs(original, candidate, graph_tools):
    """Keep register bytes; report callee identity separately, never mask it away."""
    topology = graph_tools.bijection(original, candidate, topology_only=True)
    if not topology['verified']:
        return {'topology': topology, 'instruction_and_relocation_equal': False}
    on = {n['offset']: n for n in original['nodes']}
    cn = {n['offset']: n for n in candidate['nodes']}
    blocks, different, calls, inversions = [], [], [], []
    slots = register_slots = 0
    nonregister_equal = True
    for oa, ca in topology['mapping'].items():
        o, c = on[oa], cn[ca]
        same_count = len(o['code']) == len(c['code'])
        equal = same_count and o['term'] == c['term']
        value_rows = []
        for x, y in zip(o['code'], c['code']):
            a, b = instruction(x), instruction(y)
            require(len(a) == len(b) == 8, 'partial instruction slot')
            value_equal = a == b and x['relocation'] == y['relocation']
            nonregister_equal &= a[:1]+a[2:] == b[:1]+b[2:] and x['relocation'] == y['relocation']
            register_slots += a[1] != b[1]
            slots += 1
            equal &= value_equal
            require(bool(x['actual_direct_callee']) == bool(y['actual_direct_callee']), 'call paired with non-call')
            if x['actual_direct_callee']:
                calls.append({'original_offset': x['offset'], 'candidate_offset': y['offset'],
                              'original_target': x['actual_direct_callee']['actual_target'],
                              'candidate_target': y['actual_direct_callee']['actual_target'],
                              'candidate_symbol': y['actual_direct_callee']['symbol'],
                              'depth2_identity_equal': call_identity(x) == call_identity(y)})
            value_rows.append({'original_offset': x['offset'], 'candidate_offset': y['offset'],
                               'original_normalized': a.hex(), 'candidate_normalized': b.hex(),
                               'original_relocation': x['relocation'], 'candidate_relocation': y['relocation']})
        nonregister_equal &= same_count
        if not equal:
            different.append([oa, ca])
        if o['term']['kind'] == 'conditional':
            x, y = o['machine_terminators'][-1], c['machine_terminators'][-1]
            if instruction(x)[0] != instruction(y)[0]:
                inversions.append({'original': x, 'candidate': y,
                                   'canonical_predicate': o['term'],
                                   'original_edges': o['edges'], 'candidate_edges': c['edges']})
        blocks.append({'original_offset': oa, 'candidate_offset': ca,
                       'original_source_blocks': o['source_blocks'], 'candidate_source_blocks': c['source_blocks'],
                       'instructions_and_relocations_equal': bool(equal), 'values': value_rows,
                       'original_terminal': o['term'], 'candidate_terminal': c['term'],
                       'original_edges': o['edges'], 'candidate_edges': c['edges'],
                       'original_machine_terminators': o['machine_terminators'],
                       'candidate_machine_terminators': c['machine_terminators']})
    return {'topology': topology, 'instruction_and_relocation_equal': not different,
            'nonregister_instruction_and_relocation_equal': bool(nonregister_equal),
            'different_blocks': different, 'paired_nonbranch_slots': slots,
            'register_different_slots': register_slots, 'branch_polarity_changes': inversions,
            'calls': calls, 'blocks': blocks}


def incoming_binding(original, candidate, target):
    edges = []
    # The real matched legacy-sell caller must call this exact helper, rather
    # than merely finding a candidate symbol with a convenient body.
    for start in original.functions:
        for call in original.function(start)['calls']:
            if call['target'] != ENTRY:
                continue
            matches = [a for a in candidate.functions if candidate.tag(a, 0) == original.tag(start, 0)]
            require(len(matches) == 1, 'incoming caller is not uniquely matched')
            a = matches[0]
            actual = [x for x in candidate.function(a)['calls'] if x['offset'] == call['offset']]
            require(len(actual) == 1 and actual[0]['target'] == target, 'incoming caller targets another body')
            edges.append({'original_caller': hex(start), 'candidate_caller': hex(a),
                          'call_offset': hex(call['offset']), 'original_target': hex(ENTRY),
                          'candidate_target': hex(target), 'caller_bytes': original.function(start)['bytes'],
                          'caller_normalized_sha256': original.function(start)['normalized_sha256']})
    require(edges, 'no rooted incoming call')
    return edges


def callee_differences(original, candidate, oa, ca, depth):
    rows = []
    def walk(a, b, remaining, path):
        of, cf = original.function(a), candidate.function(b)
        if original.tag(a, 0) != candidate.tag(b, 0):
            rows.append({'call_offset_path': path, 'original_target': hex(a), 'candidate_target': hex(b),
                         'original_bytes': of['bytes'], 'candidate_bytes': cf['bytes'],
                         'original_normalized_sha256': of['normalized_sha256'],
                         'candidate_normalized_sha256': cf['normalized_sha256'],
                         'candidate_symbol': cf['name']})
            return
        if not remaining:
            return
        oc, cc = of['calls'], cf['calls']
        require([x['offset'] for x in oc] == [x['offset'] for x in cc], 'paired callee call sites differ')
        for x, y in zip(oc, cc):
            walk(x['target'], y['target'], remaining-1, path+[hex(x['offset'])])
    walk(oa, ca, depth, [])
    return rows


def analyze(original, candidate, graph_tools):
    selected = [f for f in candidate.functions.values() if '4sell8cashback' in f['name'] and f['size'] > 500]
    require(len(selected) == 1, 'ambiguous cashback symbol')
    target = selected[0]['start']
    binding = incoming_binding(original, candidate, target)
    og, cg = original.graph(ENTRY, True), candidate.graph(target, True)
    comparison = compare_graphs(og, cg, graph_tools)
    require(comparison['topology']['verified'], 'no complete graph bijection')
    disagreements = []
    for row in comparison['calls']:
        if not row['depth2_identity_equal']:
            a, b = int(row['original_target'], 16), int(row['candidate_target'], 16)
            disagreements.append({**row, 'immediate_body_equal': original.tag(a, 0) == candidate.tag(b, 0),
                                  'descendant_differences': callee_differences(original, candidate, a, b, 2)})
    return {'original_start': hex(ENTRY), 'candidate_start': hex(target),
            'original_bytes': og['bytes'], 'candidate_bytes': cg['bytes'],
            'original_machine_blocks': og['machine_blocks'], 'candidate_machine_blocks': cg['machine_blocks'],
            'original_unconditional_jumps': og['unconditional_jump_count'],
            'candidate_unconditional_jumps': cg['unconditional_jump_count'],
            'original_forwarded_empty_blocks': og['forwarded_empty_blocks'],
            'candidate_forwarded_empty_blocks': cg['forwarded_empty_blocks'],
            'incoming_binding': binding, 'comparison': comparison,
            'callee_disagreements': disagreements,
            'whole_function_semantic_equivalence_proved': False}


def run():
    graph_tools, measurement = dependencies()
    original = graph_tools.Inventory(ROOT / ORIGINAL, True)
    current = graph_tools.Inventory(ROOT / CURRENT)
    selected = analyze(original, current, graph_tools)
    with tempfile.TemporaryDirectory(prefix='amm-sell-layout-') as directory:
        path = Path(directory) / 'pr645.so'
        path.write_bytes(gzip.decompress((ROOT / PR645).read_bytes()))
        historical = graph_tools.Inventory(path)
        prior = analyze(original, historical, graph_tools)
    ledger = measurement.measure(ROOT / ORIGINAL, ROOT / CURRENT)
    require(len(ledger) == 785, 'unexpected official census size')
    target = next(r for r in ledger if r['original'] == hex(ENTRY))
    # Same text and relocation representation must describe the selected
    # runtime image, not only its symbol-bearing companion.
    stripped = graph_tools.Inventory(ROOT / STRIPPED, True)
    require(current.elf.b[current.elf.lo:current.elf.hi] == stripped.elf.b[stripped.elf.lo:stripped.elf.hi], 'stripped text differs')
    require(current.elf.relocations == stripped.elf.relocations, 'stripped relocation tables differ')
    import io, tarfile
    with tarfile.open(fileobj=io.BytesIO((ROOT / SOURCE).read_bytes())) as archive:
        path = 'programs/pump-amm/src/instructions/swap/sell.rs'
        source = archive.extractfile(path).read()
    text = source.decode()
    needles = ['let mut accumulator = Account::<UserVolumeAccumulator>::try_from_unchecked(user_volume_accumulator)?;',
               '&accumulator.key(),', 'authority: accumulator.to_account_info(),']
    source_records = []
    for needle in needles:
        lines = [i for i, line in enumerate(text.splitlines(), 1) if needle in line]
        require(len(lines) == 1, 'source expression absent or ambiguous: ' + needle)
        source_records.append({'expression': needle, 'line': lines[0]})
    result = {'scope': __doc__, 'input_sha256': json.loads((P / 'inputs.json').read_text()),
            'official': {'normalized': sum(bool(r['match']) for r in ledger),
                         'raw': sum(r['raw'] for r in ledger), 'windows': len(ledger),
                         'sell': target, 'sell_status': 'UNEQUAL' if not target['match'] else 'MATCHED'},
            'source': {'archive': SOURCE, 'member': path, 'sha256': sha(source), 'observed_expressions': source_records},
            'current': selected, 'historical_pr645': prior,
            'new_compilations': 0, 'new_runtime_executions': 0, 'new_matched_windows': 0}
    # Historical graph tools use tuples for edge records; JSON stores arrays.
    # Canonicalize the representation, preserving every value and edge order.
    return json.loads(json.dumps(result))


def qualify(report):
    require(report['official']['normalized'] == 784 and report['official']['raw'] == 394, 'official counts changed')
    require(report['official']['sell_status'] == 'UNEQUAL', 'unexpected whole-window match')
    c = report['current']; v = c['comparison']; old = report['historical_pr645']['comparison']
    require(c['original_bytes'] == c['candidate_bytes'] == 9024, 'body extent changed')
    require(v['topology']['mapped_blocks'] == 77 and v['instruction_and_relocation_equal'], 'current values do not all pair')
    require(v['register_different_slots'] == 0, 'register difference remains')
    require(len(v['calls']) == 80 and sum(x['depth2_identity_equal'] for x in v['calls']) == 79, 'call boundary changed')
    require(len(c['callee_disagreements']) == 1, 'different callee boundary')
    d = c['callee_disagreements'][0]
    require(d['original_offset'] == '0x17a0' and d['candidate_offset'] == '0x1798' and d['immediate_body_equal'], 'constructor changed')
    require(len(d['descendant_differences']) == 1, 'decoder boundary changed')
    child = d['descendant_differences'][0]
    require(child['call_offset_path'] == ['0x290'] and (child['original_bytes'], child['candidate_bytes']) == (728, 1504), 'decoder selection changed')
    require(len(v['branch_polarity_changes']) == 1 and v['branch_polarity_changes'][0]['original']['offset'] == '0xd00', 'branch polarity changed')
    require(old['topology']['mapped_blocks'] == 77 and old['register_different_slots'] == 120, 'historical control changed')
    require(all(x['depth2_identity_equal'] for x in old['calls']), 'historical checked decoder control changed')
    require(not old['instruction_and_relocation_equal'] and old['nonregister_instruction_and_relocation_equal'], 'historical value shape changed')


def summary(report):
    c = report['current']; v = c['comparison']
    return {'official': report['official'], 'paired_blocks': v['topology']['mapped_blocks'],
            'paired_nonbranch_slots': v['paired_nonbranch_slots'], 'register_different_slots': v['register_different_slots'],
            'depth2_equal_call_sites': sum(x['depth2_identity_equal'] for x in v['calls']),
            'total_call_sites': len(v['calls']), 'branch_polarity_changes': len(v['branch_polarity_changes']),
            'callee_disagreements': c['callee_disagreements'], 'new_matched_windows': 0,
            'whole_function_semantic_equivalence_proved': False}


if __name__ == '__main__':
    result = run()
    qualify(result)
    if '--write' in sys.argv:
        raw = (json.dumps(result, indent=2, sort_keys=True) + '\n').encode()
        (P / 'report.json.gz').write_bytes(gzip.compress(raw, mtime=0))
        (P / 'summary.json').write_text(json.dumps(summary(result), indent=2, sort_keys=True) + '\n')
    else:
        require(result == json.loads(gzip.decompress((P / 'report.json.gz').read_bytes())), 'retained report differs')
    print(json.dumps(summary(result), indent=2))
