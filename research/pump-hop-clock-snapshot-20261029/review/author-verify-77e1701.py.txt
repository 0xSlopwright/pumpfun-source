#!/usr/bin/env python3
"""Verify exact source/main65/native binding, full census, CFG, and stored strict replays."""
from pathlib import Path
import argparse
import collections
import difflib
import gzip
import hashlib
import json
import runpy
import subprocess
import sys
import tarfile

HERE = Path(__file__).resolve().parent
sha = lambda raw: hashlib.sha256(raw).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repository', type=Path, required=True)
    parser.add_argument('--parent-packet', type=Path, required=True)
    parser.add_argument('--runtime-root', type=Path, required=True)
    args = parser.parse_args()
    root = args.repository.resolve()
    manifest = json.loads((HERE / 'MANIFEST.json').read_bytes())
    for name, digest in manifest['files'].items():
        assert sha((HERE / name).read_bytes()) == digest, name
    before = (HERE / 'source-before.rs').read_bytes()
    after = (HERE.parents[1] / 'programs/pump/src/multi_hop_curve_swap.rs').read_bytes()
    assert sha(before) == '734bdae1189dd4e4f54a27fd215624611228f36b92d3877b63f00df19ccc9e44'
    assert sha(after) == '5871a2cf35ebe0db502eb242db0f1652ef93e51e4971e56483016d900349ac2b'
    a, b = before.splitlines(), after.splitlines()
    assert len(a) == len(b)
    assert [i + 1 for i, pair in enumerate(zip(a, b)) if pair[0] != pair[1]] == [765, 785, 790]
    assert before.count(b'Clock::get()?.unix_timestamp') == 3
    assert after.count(b'Clock::get()?.unix_timestamp') == 1
    for i, line in enumerate(a):
        if b'require' in line or b'error!' in line:
            assert line == b[i]
    patch = ''.join(difflib.unified_diff(before.decode().splitlines(True), after.decode().splitlines(True),
        fromfile='a/programs/pump/src/multi_hop_curve_swap.rs', tofile='b/programs/pump/src/multi_hop_curve_swap.rs', n=0))
    assert patch == (HERE / 'parent-734-to-clock.diff').read_text()
    sys.path.insert(0, str(HERE / 'qualification/executed-tools'))
    from current_clock_binding import bind
    from native_binding import authenticate
    parent = args.parent_packet.resolve()
    anchor = parent / 'native-builds/control-40791064153'
    current = parent / 'native-builds/perhop-40792780769'
    native = HERE / 'native-build'
    binding = bind(current, native, 'perhop-clock', anchor)
    record, _, _ = authenticate(native)
    main_binding = json.loads((HERE / 'MAIN-65-BOUND.json').read_bytes())
    revision = main_binding['main']
    command = ['git', '-C', str(root)]
    environment = {'GIT_NO_LAZY_FETCH': '1'}
    tree = subprocess.check_output([*command, 'ls-tree', '-r', '-z', revision, 'programs/pump'], env=environment)
    oids = {}
    for row in tree.split(b'\0'):
        if row:
            meta, path = row.split(b'\t', 1)
            oids[path.decode()] = meta.decode().split()[2]
    with tarfile.open(native / 'compiled-source.tar.gz') as archive:
        compiled = {m.name: archive.extractfile(m).read() for m in archive.getmembers() if m.isfile()}
    for row in main_binding['files']:
        path = row['path']
        assert oids[path] == row['main_git_oid']
        raw = before if row['changed'] else subprocess.check_output([*command, 'cat-file', 'blob', oids[path]], env=environment) if path == 'programs/pump/Cargo.toml' else compiled['Cargo.lock'] if path == 'programs/pump/Cargo.lock' else compiled[path]
        assert sha(raw) == row['main_sha256']
        assert hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest() == oids[path]
    assert len(main_binding['files']) == 65 and sum(r['changed'] for r in main_binding['files']) == 1
    for name, digest in json.loads((HERE / 'qualification/CENSUS-INPUTS.json').read_bytes()).items():
        assert sha((root / name).read_bytes()) == digest
    sys.path.insert(0, str(root / 'scripts'))
    from pump_compare_function_bytes import body, normalize
    from pump_quote_control_function_match import sections
    namespace = runpy.run_path(str(HERE / 'qualification/tools/census.py'))
    census = namespace['census']
    census.__globals__['ROOT'] = root
    actual = census(native / 'unstripped.so')
    assert actual == json.loads(gzip.decompress((HERE / 'qualification/inventory.json.gz').read_bytes()))
    assert (actual['counts']['total'], actual['counts']['normalized'], actual['counts']['raw']) == (1035, 1019, 188)
    image = (native / 'unstripped.so').read_bytes()
    old_image = (current / 'unstripped.so').read_bytes()
    functions = namespace['functions']

    def calls(blob):
        secs = sections(blob)
        entries = list(functions(blob))
        by_address = {a: (n, s) for a, n, s in entries}
        start, size, symbol = next(row for row in entries if row[2].startswith('_ZN14pump_recovered15multi_hop_curve8swap_hop17h'))
        raw = body(blob, secs, start, size)
        _, operands = normalize(raw, start, secs)
        counts = collections.Counter()
        clock = []
        for op in operands:
            if op['kind'] != 'direct-call':
                continue
            n, name = by_address[op['target']]
            normalized, _ = normalize(body(blob, secs, op['target'], n), op['target'], secs)
            counts[(n, sha(normalized))] += 1
            if 'solana_sysvar5clock' in name:
                clock.append(op['offset'])
        return raw, counts, clock

    raw, counts, clocks = calls(image)
    _, prior_counts, prior_clocks = calls(old_image)
    assert len(raw) == 18056 and sum(counts.values()) == 94 and clocks == [0x3760]
    assert sum(prior_counts.values()) == 98 and len(prior_clocks) == 3
    differences = [(key, prior_counts[key], counts[key]) for key in prior_counts.keys() | counts.keys() if prior_counts[key] != counts[key]]
    assert len(differences) == 2 and {(key[0], a, b) for key, a, b in differences} == {(232, 3, 1), (160, 3, 1)}
    sys.path.insert(0, str(HERE / 'qualification'))
    from clock_cfg import prove
    candidate_cfg = prove(raw, 7, 0x3958, [0x3b00, 0x3cb8, 0x4008], 0x3760)
    original = (root / 'evidence/original/pump/deployed.so').read_bytes()
    original_cfg = prove(body(original, sections(original), 0x5b3b0, 18584), 9, 0x30e8, [0x32b0, 0x3a18, 0x3fd8], 0x3018)
    reports = HERE / 'qualification/reports'
    subprocess.run([sys.executable, '-B', str(args.runtime_root / 'verify_current_clock_replays.py'),
        '--anchor-directory', str(anchor), '--control-directory', str(current), '--candidate-directory', str(native),
        '--kind', 'perhop-clock', '--creation', str(reports / 'current-clock-create14.json.gz'),
        '--hop', str(reports / 'current-clock-hop13.json.gz')], check=True)
    from verify_additional import verify_additional
    extra = verify_additional(HERE, binding)
    print(json.dumps({'source_and_main65': True, 'native_binding': binding,
        'full1035_census': actual['counts'], 'original_timestamp_cfg': original_cfg,
        'candidate_timestamp_cfg': candidate_cfg, 'only_callee_count_changes': differences,
        'additional_saved_replays': extra, 'gains': [], 'losses': [], 'whole_ELF_equal': False}, indent=2))


if __name__ == '__main__':
    main()
