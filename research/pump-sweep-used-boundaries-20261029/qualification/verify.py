#!/usr/bin/env python3
"""Recompute this finite Sweep qualification; no new compilation or VM execution."""
import argparse
import base64
from collections import Counter
import gzip
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import sys
import tarfile

sys.dont_write_bytecode = True
if not __debug__:
    raise SystemExit('Run without -O; qualification assertions are required.')
P = Path(__file__).resolve().parent
ROOT = P.parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
import pump_strict_ordered_logs as strict
from solders.transaction import Transaction

ORIGINAL = '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
CANONICAL = '199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473'
PROPOSAL = '21b0de29ebc71c692715a6bb863adb0ed19f06419eb3afbca02027b101bf6049'
SYMBOLS = 'a8d26376c23b30b751ed2a8535bc1117cb129d51293495849f7138fe51f8cd39'
SOURCE = '15dbbd46bdbe7af62c6b7bb436f657c45e290c080c185fc075b7a3c08e3df7e8'
FIXTURES = '049f33948de451a10c915d2e79c04bff8210b33d82a42ed812a1ab1803481c88'
sha = lambda data: hashlib.sha256(data).hexdigest()
canon = lambda value: json.dumps(value, sort_keys=True, separators=(',', ':')).encode()


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read(path):
    raw = path.read_bytes()
    return json.loads(gzip.decompress(raw) if raw.startswith(b'\x1f\x8b') else raw)


def verify_build():
    build = P / 'build'
    attempt = read(build / 'build-attempt.json')
    result = read(build / 'RESULT.json')
    assert attempt['returncode'] == 0 and attempt['cold_empty_target']
    for key in ['source_unchanged', 'tools_unchanged', 'sdk_rust_libraries_unchanged',
                'registry_sources_unchanged', 'target_libraries_unchanged']:
        assert attempt[key], key
    assert result['candidate_sha256'] == sha((build / 'candidate.so').read_bytes()) == PROPOSAL
    assert result['unstripped_sha256'] == sha((build / 'unstripped.so').read_bytes()) == SYMBOLS
    assert result['both_local_crates_compiled']
    source = {name.removeprefix('source/'): digest for name, digest in attempt['primary_source_sha256'].items()}
    before = read(build / 'canonical-source-checkpoint.json')['source_files_sha256']
    assert len(source) == len(before) == 65 and set(source) == set(before)
    assert [name for name in source if source[name] != before[name]] == ['src/sweep_fees.rs']
    assert source['src/sweep_fees.rs'] == SOURCE
    assert sha((build / 'proposed-source.rs').read_bytes()) == SOURCE
    assert sha((P.parent / 'source/programs/pump/src/sweep_fees.rs').read_bytes()) == SOURCE
    assert attempt['primary_source_sha256'] == attempt['primary_source_after_sha256']
    assert attempt['source_sha256'] == attempt['source_after_sha256']
    with tarfile.open(build / 'compiled-source.tar.gz') as archive:
        files = {}
        for member in archive:
            assert member.isfile() and not Path(member.name).is_absolute() and '..' not in Path(member.name).parts
            files[member.name] = sha(archive.extractfile(member).read())
    assert len(files) == 66
    assert files == {name.removeprefix('build/source/'): digest for name, digest in attempt['source_sha256'].items()}
    log = gzip.decompress((build / 'build.log.gz').read_bytes()).decode()
    assert 'Compiling pump-token-ext ' in log and 'Compiling pump-recovered ' in log
    control = read(build / 'control-proof.json')
    assert control['run_id'] == 40791064153 and control['result']['status'] == 'reproduced'
    assert control['result']['candidate_sha256'] == CANONICAL
    assert control['result']['unstripped_sha256'] == '49df399b8a36a0a60de03e8d55f1417261dc451e44845ca9d17a94040968c680'
    return {'standalone_inputs': 65, 'workspace_inputs': 66, 'both_local_compilations': True}


def verify_census(base, selected_path, inventory_path):
    census = load('frozen_census', P / 'runtime/inputs/census-673.py')
    census.ROOT = ROOT
    actual = census.census(P / 'build/unstripped.so')
    saved = read(P / 'runtime/proposal-full1035.json.gz')
    assert actual['candidate_sha256'] == SYMBOLS
    assert actual['windows'] == saved['windows'] and actual['counts'] == saved['counts']
    old = read(inventory_path)
    assert len(actual['windows']) == len(old['windows']) == 1035
    membership = lambda image: {row['start']: (bool(row['normalized_matches']), row['raw_match']) for row in image['windows']}
    assert membership(actual) == membership(old)
    assert actual['counts'] == {'total': 1035, 'normalized': 1019, 'raw': 188, 'unmatched': 16, 'matched_text_bytes': 1611088}
    original = (ROOT / 'evidence/original/pump/deployed.so').read_bytes()
    proposal = (P / 'build/unstripped.so').read_bytes()
    tested = (P / 'build/candidate.so').read_bytes()
    os_, cs, ts = base.sections(original), base.sections(proposal), base.sections(tested)
    # The runtime image is the actual stripped output of the measured object.
    for name in ['.text', '.rodata', '.data.rel.ro']:
        if name in cs:
            assert name in ts and cs[name]['addr'] == ts[name]['addr'] and cs[name]['size'] == ts[name]['size']
            left, right = cs[name], ts[name]
            assert proposal[left['offset']:left['offset'] + left['size']] == tested[right['offset']:right['offset'] + right['size']]
    helper = read(P / 'runtime/ACTUAL-HELPERS-STATE.json')
    original_sizes = {row['start']: row['bytes'] for row in old['windows']}
    candidate_sizes = base.symbols(proposal)
    baseline = selected_path.read_bytes()
    bs = base.sections(baseline)
    baseline_sizes = base.symbols(baseline)
    assert candidate_sizes[0x8d940] == 7888
    _, calls = base.normalize(base.body(proposal, cs, 0x8d940, 7888), 0x8d940, cs)
    direct = [call for call in calls if call['kind'] == 'direct-call']
    assert len(direct) == 36
    def tags(image, image_sections, sizes, address):
        cache = {}
        def tag(target, depth):
            key = target, depth
            if key not in cache:
                normalized, operands = base.normalize(base.body(image, image_sections, target, sizes[target]), target, image_sections)
                calls = [row for row in operands if row['kind'] == 'direct-call']
                cache[key] = sha(canon([sizes[target], sha(normalized),
                    [(row['offset'], tag(row['target'], depth - 1)) for row in calls] if depth else []]))
            return cache[key]
        _, operands = base.normalize(base.body(image, image_sections, address, sizes[address]), address, image_sections)
        return Counter(tag(row['target'], 2) for row in operands if row['kind'] == 'direct-call'), tag
    original_tags, original_tag = tags(original, os_, original_sizes, 0x72810)
    baseline_tags, _ = tags(baseline, bs, baseline_sizes, 0x8db10)
    proposal_tags, _ = tags(proposal, cs, candidate_sizes, 0x8d940)
    assert sum((original_tags & baseline_tags).values()) == 32
    assert sum((original_tags & proposal_tags).values()) == 36
    assert not proposal_tags - original_tags
    assert original_tags - proposal_tags == Counter({original_tag(0x1b3678, 2): 1})
    for record in helper['intended_actual_helpers']:
        original_target = int(record['original'], 0)
        target = int(record['actual_proposal_target'], 0)
        pc = int(record['actual_proposal_pc'], 0)
        assert any(0x8d940 + row['offset'] == pc and row['target'] == target for row in direct)
        assert record['body_depth2_pair'] == base.helper_pair(original, proposal, os_, cs, original_sizes, candidate_sizes, original_target, target, 2)
        for instruction in record['argument_prefix']:
            base.check_instruction(instruction, proposal, cs)
    assert len(helper['intended_actual_helpers']) == 4
    for record in helper['actual_selected_field_clears']:
        for instruction in record['surrounding']:
            base.check_instruction(instruction, proposal, cs)
        clear = base.instruction(proposal, cs, int(record['pc'], 0))
        assert clear['opcode'] == '0x7a' and clear['immediate'] == 0 and clear['displacement'] == int(record['field_offset'], 0)
        field_load = base.instruction(proposal, cs, int(record['pc'], 0) - 8)
        assert field_load['opcode'] == '0x79' and field_load['src'] == clear['dst'] and field_load['displacement'] == clear['displacement']
        after = [base.instruction(proposal, cs, int(record['pc'], 0) + distance) for distance in [8, 16]]
        assert any(row['opcode'] in ['0x15', '0x55'] and row['dst'] == field_load['dst'] and row['immediate'] == 0 for row in after)
    # State/control interpretations are accompanied by exact raw rows and finite replay.
    return actual['counts']


def verify_runtime(directory, group, count, proposal):
    manifest_path = P / 'runtime/FIXTURES-v2.json'
    assert sha(manifest_path.read_bytes()) == FIXTURES
    manifest = read(manifest_path)
    controller = load('qualified_replay', P / 'runtime/replay.py')
    assert sha((P / 'runtime/replay.py').read_bytes()) == manifest['controller_sha256']
    for name, digest in manifest['inputs'].items():
        assert sha((ROOT / name).read_bytes()) == digest, name
    report = read(directory / 'outcomes.json.gz')
    assert report['manifest_sha256'] == FIXTURES and report['original_sha256'] == ORIGINAL
    assert report['candidate_sha256'] == (PROPOSAL if proposal else CANONICAL)
    assert report['control_sha256'] == (CANONICAL if proposal else None)
    rows = report['suites']['fee_sweeps']
    expected = manifest['groups'][group]['fixtures']
    assert len(rows) == report['case_count'] == count == len(expected)
    executions = signatures = 0
    for row, fixture in zip(rows, expected):
        assert row['name'] == fixture['name'] and row['group'] == group
        assert row['case'] == fixture['case'] and sha(canon(row['case'])) == row['case_sha256'] == fixture['case_sha256']
        names = ['original', 'candidate', 'control'] if proposal else ['original', 'candidate']
        receipts = {item['image']: {k: v for k, v in item.items() if k != 'image'} for item in row['signed_executions']}
        for name in names:
            outcome = row[name]
            assert outcome['metadata']['logs'] == outcome['logs']
            signed = controller.signcheck(outcome, Transaction)
            assert receipts[name] == signed
            signatures += signed['signature_fields']
            executions += 1
            assert not controller.compare(row['original'], outcome, strict)
        assert len({row[name]['transaction_base64'] for name in names}) == 1
        assert not any(row['different_fields'].values())
        if group == 'rent-boundaries':
            tx = Transaction.from_bytes(base64.b64decode(row['original']['transaction_base64']))
            transfers = []
            for inner_group in row['original']['metadata']['inner_instructions']:
                for inner in inner_group:
                    instruction = inner['instruction']
                    if str(tx.message.account_keys[instruction['programIdIndex']]) != '11111111111111111111111111111111':
                        continue
                    vector = instruction['data']
                    length = sum((byte & 127) << (7 * i) for i, byte in enumerate(vector[0]))
                    assert length == len(vector) - 1
                    data = bytes(vector[1:])
                    if len(data) == 12 and struct.unpack_from('<I', data)[0] == 2:
                        transfers.append(struct.unpack_from('<Q', data, 4)[0])
            expected_transfers = [890880] if row['name'] in ['creator-rent-0', 'creator-rent-1', 'creator-rent-890879'] else []
            assert transfers == expected_transfers
    assert report['execution_count'] == executions and report['signature_fields'] == signatures
    assert report['runtime_receipt_transfer'] is False
    audit = strict.audit(report, report['candidate_sha256'], count)
    assert not audit['mismatches'] and audit == read(directory / 'strict-logs.json')
    images = {ORIGINAL, CANONICAL, PROPOSAL} if proposal else {ORIGINAL, CANONICAL}
    assert {row['elf_sha256'] for row in report['captured_loads']} == images
    assert len(report['captured_loads']) == count * (5 if proposal else 3)
    capture = read(ROOT / 'evidence/original/pump/capture.json')
    header = (ROOT / 'evidence/original/pump/programdata-account.bin').read_bytes()[:45]
    program = (ROOT / 'evidence/original/pump/program-account.bin').read_bytes()
    for row in report['captured_loads']:
        assert row['elf_prefix_unchanged'] and row['zero_allocation_tail']
        assert row['header_sha256'] == sha(header) and row['program_sha256'] == sha(program)
        assert row['program_owner'] == capture['owner'] and row['slot'] > capture['last_deploy_slot']
    summary = read(directory / 'SUMMARY.json')
    assert summary['report_sha256'] == sha((directory / 'outcomes.json.gz').read_bytes())
    assert summary['execution_count'] == executions and summary['signature_fields'] == signatures
    return {'cases': count, 'executions': executions, 'signature_fields': signatures}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--selected', type=Path, default=ROOT / 'research/pump-final-composition-673-20261028/artifacts/unstripped.so')
    parser.add_argument('--inventory', type=Path, default=ROOT / 'research/pump-final-composition-673-20261028/analysis/inventory.json.gz')
    args = parser.parse_args()
    manifest = read(P / 'MANIFEST.json')
    paths = [path for path in P.rglob('*') if path.is_file() and path != P / 'MANIFEST.json']
    assert not any(path.is_symlink() for path in paths)
    actual = {str(path.relative_to(P)): sha(path.read_bytes()) for path in paths}
    assert actual == manifest['files'], 'Qualification file set/hash differs'
    for name, digest in read(P / 'runtime/CENSUS-INPUTS.json').items():
        assert sha((ROOT / name).read_bytes()) == digest, name
    base = load('sweep_static', P.parent / 'verify.py')
    base.verify(ROOT / 'evidence/original/pump/deployed.so', args.selected, args.inventory)
    build = verify_build()
    census = verify_census(base, args.selected, args.inventory)
    results = {}
    for directory, group, count, proposal in [
        ('baseline-rent-v2', 'rent-boundaries', 7, False),
        ('baseline-maintained504', 'maintained', 504, False),
        ('proposal-rent', 'rent-boundaries', 7, True),
        ('proposal-maintained504', 'maintained', 504, True),
    ]:
        results[directory] = verify_runtime(P / 'runtime' / directory, group, count, proposal)
    result = {'scope': __doc__, 'build': build, 'census': census, 'runtime': results,
              'new_normalized_matches': 0, 'handler_bytes': 7888,
              'original_handler_bytes': 7832, 'canonical_selection_changed': False}
    if (P / 'VERIFIED.json').exists():
        assert result == read(P / 'VERIFIED.json')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
