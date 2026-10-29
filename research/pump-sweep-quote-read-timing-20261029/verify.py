#!/usr/bin/env python3
"""Verify the distinct late quote-read recovery in historical1285/673 only."""
import argparse
import base64
from collections import Counter
import difflib
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import struct
import sys
import tarfile

if not __debug__:
    raise SystemExit('Run without -O; qualification assertions are required.')
sys.dont_write_bytecode = True
P = Path(__file__).resolve().parent
ROOT = P.parents[1]
PRIOR = ROOT / 'research/pump-sweep-used-boundaries-20261029'
sys.path.insert(0, str(ROOT / 'scripts'))
import pump_strict_ordered_logs as strict
from solders.transaction import Transaction
sha = lambda b: hashlib.sha256(b).hexdigest()
canon = lambda x: json.dumps(x, sort_keys=True, separators=(',', ':')).encode()
SOURCE = '3d3363ddd7713999363bf950fb404fa4e35e42731d43806cb6ceeccda94985e9'
BEFORE = '15dbbd46bdbe7af62c6b7bb436f657c45e290c080c185fc075b7a3c08e3df7e8'
IMAGE = '4e0e96a2b32b175cf576655063499f2d53974bcaa3a6280e6b9886f1805fa151'
SYMBOLS = '6680ce7a8834c233bb0d6dc6aa084560c462c561c6d46ec2aa608cc8c5f3826e'
CONTROL = '199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473'
ORIGINAL = '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
INVENTORY = 'c66bb5ece1676933838403fa99c120b636eba9c3db4e543bb32d614bcac6451d'


def read(path):
    raw = path.read_bytes()
    return json.loads(gzip.decompress(raw) if raw.startswith(b'\x1f\x8b') else raw)


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


# Read-only primitives from merged713. No previous checker globals/hashes change.
base = load('prior_static_primitives', PRIOR / 'verify.py')
producer = load('unchanged_replay_producer', PRIOR / 'qualification/runtime/replay.py')
elf_parser = load('unchanged_function_parser', PRIOR / 'qualification/runtime/inputs/census-673.py')


def graph(image, start, size):
    sections = base.sections(image)
    rows = {}; leaders = {start, start + size}; pc = start
    while pc < start + size:
        row = base.instruction(image, sections, pc); rows[pc] = row
        op = int(row['opcode'], 0)
        if op & 7 in [5, 6] and op & 0xf0 not in [0x80, 0x90]:
            target = pc + 8 + row['displacement'] * 8
            assert start <= target < start + size
            leaders.update([target, pc + 8])
        elif op == 0x95:
            leaders.add(pc + 8)
        pc += 16 if op == 0x18 else 8
    boundaries = sorted(leaders); nodes = {}; block_for = {}
    for a, z in zip(boundaries, boundaries[1:]):
        instructions = [pc for pc in rows if a <= pc < z]
        pc = instructions[-1]; last = rows[pc]; op = int(last['opcode'], 0)
        branch = op & 7 in [5, 6] and op & 0xf0 not in [0x80, 0x90]
        edges = [] if op == 0x95 else ([pc + 8 + last['displacement'] * 8] if op == 5 else [pc + 8, pc + 8 + last['displacement'] * 8] if branch else [z])
        assert all(start <= target < start + size for target in edges)
        nodes[a] = edges
        block_for.update({pc: a for pc in instructions})
    def reachable(begin, removed=frozenset()):
        seen = set(); todo = [begin]
        while todo:
            a = todo.pop()
            if a in seen or a in removed:
                continue
            seen.add(a); todo.extend(nodes[a])
        return seen
    live = reachable(start); pred = {a: set() for a in live}
    for a in live:
        for target in nodes[a]: pred[target].add(a)
    dom = {a: ({start} if a == start else set(live)) for a in live}
    changed = True
    while changed:
        changed = False
        for a in live - {start}:
            value = {a} | set.intersection(*(dom[x] for x in pred[a]))
            if value != dom[a]: dom[a] = value; changed = True
    return rows, block_for, dom, reachable


def check_source():
    before = (P / 'source-before.rs').read_bytes()
    after = (P / 'source/programs/pump/src/sweep_fees.rs').read_bytes()
    assert sha(before) == BEFORE and sha(after) == SOURCE
    assert before == (PRIOR / 'source/programs/pump/src/sweep_fees.rs').read_bytes()
    patch = ''.join(difflib.unified_diff(before.decode().splitlines(True), after.decode().splitlines(True), fromfile='a/programs/pump/src/sweep_fees.rs', tofile='b/programs/pump/src/sweep_fees.rs')).encode()
    assert patch == (P / 'source.patch').read_bytes()
    def sites(raw):
        return [(n, m.start() + 1, line) for n, line in enumerate(raw.decode().splitlines(), 1) for m in re.finditer(r'\b\w+!\s*\(', line)]
    assert sites(before) == sites(after) and len(sites(after)) == 5
    assert len(before.splitlines()) == len(after.splitlines()) == 180
    text = after.decode()
    assert text.count('let native=') == 1
    assert text.index('if amount==0') < text.index('let native=') < text.index(' if native{')
    for line in [123, 145, 167, 168, 178]:
        assert before.decode().splitlines()[line - 1] == after.decode().splitlines()[line - 1]


def check_build():
    p = P / 'build'; record = read(p / 'build-attempt.json')
    assert record['returncode'] == 0 and record['cold_empty_target']
    for key in ['source_unchanged', 'tools_unchanged', 'sdk_rust_libraries_unchanged', 'registry_sources_unchanged', 'target_libraries_unchanged']:
        assert record[key], key
    assert sha((p / 'candidate.so').read_bytes()) == IMAGE
    assert sha((p / 'unstripped.so').read_bytes()) == SYMBOLS
    assert sha((p / 'proposed-source.rs').read_bytes()) == SOURCE
    before = read(PRIOR / 'qualification/build/canonical-source-checkpoint.json')['source_files_sha256']
    after = {k.removeprefix('source/'): v for k, v in record['primary_source_sha256'].items()}
    assert len(before) == len(after) == 65 and set(before) == set(after)
    assert [k for k in after if before[k] != after[k]] == ['src/sweep_fees.rs']
    assert after['src/sweep_fees.rs'] == SOURCE
    assert record['primary_source_sha256'] == record['primary_source_after_sha256']
    assert record['source_sha256'] == record['source_after_sha256']
    with tarfile.open(p / 'compiled-source.tar.gz') as archive:
        contents = {}
        for member in archive:
            assert member.isfile() and not Path(member.name).is_absolute() and '..' not in Path(member.name).parts
            contents[member.name] = sha(archive.extractfile(member).read())
    assert len(contents) == 66 and contents == {k.removeprefix('build/source/'): v for k, v in record['source_sha256'].items()}
    log = gzip.decompress((p / 'build.log.gz').read_bytes()).decode()
    assert 'Compiling pump-recovered ' in log and 'Compiling pump-token-ext ' in log
    control = read(p / 'control-proof.json')['result']
    assert control['status'] == 'reproduced' and control['candidate_sha256'] == CONTROL


def check_census_and_calls(inventory_path):
    assert sha(inventory_path.read_bytes()) == INVENTORY
    old = read(inventory_path)
    original = (ROOT / 'evidence/original/pump/deployed.so').read_bytes()
    assert sha(original) == ORIGINAL
    proposed = (P / 'build/unstripped.so').read_bytes()
    tested = (P / 'build/candidate.so').read_bytes()
    os_, cs, ts = base.sections(original), base.sections(proposed), base.sections(tested)
    functions = list(elf_parser.functions(proposed)); sizes = {a: l for a, l, n in functions}
    original_sizes = {r['start']: r['bytes'] for r in old['windows']}
    index = {}
    for start, length, name in functions:
        raw = base.body(proposed, cs, start, length); normalized, _ = base.normalize(raw, start, cs)
        index.setdefault((length, sha(normalized)), []).append({'start': start, 'symbol': name, 'raw_sha256': sha(raw)})
    windows = []
    for row in old['windows']:
        a, length = row['start'], row['bytes']; raw = base.body(original, os_, a, length)
        matches = index.get((length, sha(base.normalize(raw, a, os_)[0])), [])
        windows.append({'start': a, 'end': a + length, 'bytes': length, 'raw_sha256': sha(raw), 'normalized_matches': matches, 'raw_match': any(x['raw_sha256'] == sha(raw) for x in matches)})
    saved = read(P / 'inventory.json.gz')
    assert len(windows) == 1035 and windows == saved['windows'] and saved['candidate_sha256'] == SYMBOLS
    membership = lambda rows: {r['start']: (bool(r['normalized_matches']), r['raw_match']) for r in rows}
    assert membership(windows) == membership(old['windows'])
    assert saved['counts']['normalized'] == 1019 and saved['counts']['raw'] == 188
    assert sizes[0x8d940] == original_sizes[0x72810] == 7832
    assert base.normalize(base.body(proposed, cs, 0x8d940, 7832), 0x8d940, cs)[0] != base.normalize(base.body(original, os_, 0x72810, 7832), 0x72810, os_)[0]
    for name in ['.text', '.rodata', '.data.rel.ro']:
        if name in cs:
            assert name in ts and cs[name]['addr'] == ts[name]['addr'] and cs[name]['size'] == ts[name]['size']
            a, b = cs[name], ts[name]
            assert proposed[a['offset']:a['offset'] + a['size']] == tested[b['offset']:b['offset'] + b['size']]
    def call_tags(image, sections, lengths, address):
        cache = {}
        def tag(a, depth):
            if (a, depth) not in cache:
                normalized, operands = base.normalize(base.body(image, sections, a, lengths[a]), a, sections)
                calls = [r for r in operands if r['kind'] == 'direct-call']
                cache[a, depth] = sha(canon([lengths[a], sha(normalized), [(r['offset'], tag(r['target'], depth - 1)) for r in calls] if depth else []]))
            return cache[a, depth]
        _, operands = base.normalize(base.body(image, sections, address, lengths[address]), address, sections)
        return Counter(tag(r['target'], 2) for r in operands if r['kind'] == 'direct-call'), tag
    ot, original_tag = call_tags(original, os_, original_sizes, 0x72810)
    nt, _ = call_tags(proposed, cs, sizes, 0x8d940)
    assert sum(ot.values()) == 37 and sum(nt.values()) == sum((ot & nt).values()) == 36
    assert not nt - ot and ot - nt == Counter({original_tag(0x1b3678, 2): 1})
    actual = read(P / 'ACTUAL-READ-ORDER.json')
    for helper in actual['actual_helpers']:
        pair = base.helper_pair(original, proposed, os_, cs, original_sizes, sizes, int(helper['original_target'], 0), int(helper['actual_target'], 0), 2)
        assert pair == helper['normalized_body_depth2_pair']
        for row in helper['argument_prefix']: base.check_instruction(row, proposed, cs)
    return original, proposed


def check_read_order(original, proposed):
    before = (PRIOR / 'qualification/build/unstripped.so').read_bytes()
    assert sha(before) == 'a8d26376c23b30b751ed2a8535bc1117cb129d51293495849f7138fe51f8cd39'
    for image, start, length, cases in [
        (original, 0x72810, 7832, [(0x72e88, 0x72e90, 0x72ef0), (0x731d0, 0x731d8, 0x73a60)]),
        (proposed, 0x8d940, 7832, [(0x8dfb0, 0x8dfb8, 0x8e208), (0x8e198, 0x8e1a0, 0x8e208)]),
    ]:
        rows, blocks, dom, reachable = graph(image, start, length)
        for index, (clear, test, quote) in enumerate(cases):
            load, zero = rows[clear - 8], rows[test]
            assert load['opcode'] == '0x79' and rows[clear]['opcode'] == '0x7a'
            assert load['displacement'] == rows[clear]['displacement'] == [0x80, 0x78][index] and rows[clear]['immediate'] == 0
            assert zero['opcode'] in ['0x15', '0x55']
            assert zero['dst'] == load['dst'] and zero['immediate'] == 0
            target, fall = test + 8 + zero['displacement'] * 8, test + 8
            zero_edge, nonzero = (target, fall) if zero['opcode'] == '0x15' else (fall, target)
            assert blocks[quote] not in reachable(zero_edge) and blocks[quote] in reachable(nonzero)
            if start == 0x72810:
                assert blocks[clear] in dom[blocks[quote]] and blocks[test] in dom[blocks[quote]]
        assert blocks[cases[0][2]] not in reachable(start, {blocks[x[0]] for x in cases})
    rows, blocks, dom, reachable = graph(before, 0x8d940, 7888)
    assert all(blocks[0x8da08] in dom[blocks[pc]] for pc in [0x8dab0, 0x8dc28, 0x8e010, 0x8e1f8])
    new_rows, new_blocks, new_dom, _ = graph(proposed, 0x8d940, 7832)
    assert new_rows[0x8e1b8]['displacement'] == 0x38 and new_rows[0x8e1e8]['immediate'] == 0x28 and new_rows[0x8e200]['immediate'] == 32
    report = read(P / 'ACTUAL-READ-ORDER.json')
    for helper in report['actual_helpers']:
        assert new_blocks[0x8e208] in new_dom[new_blocks[int(helper['actual_pc'], 0)]]
    transfer = next(int(h['actual_pc'], 0) for h in report['actual_helpers'] if h['label'] == 'transfer_to_owned')
    clock = next(int(h['actual_pc'], 0) for h in report['actual_helpers'] if h['label'] == 'Clock::get')
    assert new_blocks[transfer] in new_dom[new_blocks[clock]]
    assert all(new_blocks[clock] in new_dom[new_blocks[int(pc, 0)]] for pc in report['event_data_pcs'])
    for row in report['raw_state_and_quote_rows']: base.check_instruction(row, proposed, base.sections(proposed))


def check_runtime(directory, group, count):
    manifest_path = PRIOR / 'qualification/runtime/FIXTURES-v2.json'
    assert sha(manifest_path.read_bytes()) == '049f33948de451a10c915d2e79c04bff8210b33d82a42ed812a1ab1803481c88'
    manifest = read(manifest_path)
    assert sha((PRIOR / 'qualification/runtime/replay.py').read_bytes()) == manifest['controller_sha256']
    for name, digest in manifest['inputs'].items(): assert sha((ROOT / name).read_bytes()) == digest
    report = read(directory / 'outcomes.json.gz')
    assert report['original_sha256'] == ORIGINAL and report['candidate_sha256'] == IMAGE and report['control_sha256'] == CONTROL
    assert report['manifest_sha256'] == sha(manifest_path.read_bytes())
    rows = report['suites']['fee_sweeps']; fixtures = manifest['groups'][group]['fixtures']
    assert len(rows) == report['case_count'] == len(fixtures) == count
    signatures = 0
    for row, fixture in zip(rows, fixtures):
        assert row['name'] == fixture['name'] and row['group'] == group and row['case'] == fixture['case']
        assert sha(canon(row['case'])) == row['case_sha256'] == fixture['case_sha256']
        signed = {r['image']: {k: v for k, v in r.items() if k != 'image'} for r in row['signed_executions']}
        for name in ['original', 'control', 'candidate']:
            value = row[name]
            assert value['metadata']['logs'] == value['logs']
            proof = producer.signcheck(value, Transaction); assert proof == signed[name]
            signatures += proof['signature_fields']
            assert not producer.compare(row['original'], value, strict)
        assert len({row[name]['transaction_base64'] for name in ['original', 'control', 'candidate']}) == 1
        assert not any(row['different_fields'].values())
    audit = strict.audit(report, IMAGE, count)
    assert not audit['mismatches'] and audit == read(directory / 'strict-logs.json')
    assert report['execution_count'] == count * 3 and report['signature_fields'] == signatures
    assert report['runtime_receipt_transfer'] is False
    assert len(report['captured_loads']) == count * 5
    assert {r['elf_sha256'] for r in report['captured_loads']} == {ORIGINAL, CONTROL, IMAGE}
    capture = read(ROOT / 'evidence/original/pump/capture.json')
    header = (ROOT / 'evidence/original/pump/programdata-account.bin').read_bytes()[:45]
    program = (ROOT / 'evidence/original/pump/program-account.bin').read_bytes()
    for row in report['captured_loads']:
        assert row['header_sha256'] == sha(header) and row['program_sha256'] == sha(program)
        assert row['elf_prefix_unchanged'] and row['zero_allocation_tail'] and row['program_owner'] == capture['owner']
    summary = read(directory / 'SUMMARY.json')
    assert summary['report_sha256'] == sha((directory / 'outcomes.json.gz').read_bytes())
    assert summary['execution_count'] == count * 3 and summary['signature_fields'] == signatures
    return {'cases': count, 'executions': count * 3, 'signature_fields': signatures}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inventory', type=Path, default=ROOT / 'research/pump-final-composition-673-20261028/analysis/inventory.json.gz')
    args = parser.parse_args()
    manifest = read(P / 'MANIFEST.json')
    paths = [f for f in P.rglob('*') if f.is_file() and f != P / 'MANIFEST.json']
    assert not any(f.is_symlink() for f in paths)
    assert {str(f.relative_to(P)): sha(f.read_bytes()) for f in paths} == manifest['files']
    for path, digest in read(P / 'PREREQUISITES.json').items(): assert sha((ROOT / path).read_bytes()) == digest
    check_source(); check_build()
    original, proposed = check_census_and_calls(args.inventory)
    check_read_order(original, proposed)
    runtime = {name: check_runtime(P / 'runtime' / name, group, count) for name, group, count in [('runtime-rent', 'rent-boundaries', 7), ('runtime-maintained504', 'maintained', 504)]}
    result = {'scope': __doc__, 'source_sha256': SOURCE, 'standalone_inputs': 65, 'workspace_inputs': 66,
              'handler_bytes': 7832, 'original_handler_bytes': 7832, 'normalized_equal': False,
              'historical673_counts': {'normalized': 1019, 'raw': 188}, 'gains': [], 'losses': [],
              'actual_quote_read_after_selected_clear_and_nonzero_gate': True, 'runtime': runtime,
              'current734_composition_qualified': False}
    if (P / 'VERIFIED.json').exists(): assert result == read(P / 'VERIFIED.json')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
