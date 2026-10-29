#!/usr/bin/env python3
"""Read retained source/native evidence without invoking any build or VM recipe."""
if not __debug__:
    raise SystemExit('Normal Python is required; do not use -O.')
import argparse
import difflib
import gzip
import hashlib
import json
from pathlib import Path
import re
import struct
import sys
import tarfile
import types

sys.dont_write_bytecode = True
P = Path(__file__).resolve().parent
E = P / 'evidence'
INNER_SEAL = '6f689bd6d9c1b6840d72372a21a8e01511e0fdc00da6d3d8286cf4f43957841d'
D037 = 'research/pump-program-creator-notice-qualification-20261028'
GUARD = 'research/pump-exact-sol-guard-20261029'
ORIGINAL = '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
CANDIDATE = '81e15c8bc42714d4ec98ad52d3b52d26b1b599871fbf13ce51082c389ac73c9a'
SYMBOLS = 'baef84858615fef8330e2675f08ff025175db94472bdcbe2cd12937a867634c1'
COUNTS = dict(total=1035, normalized=1019, raw=188, unmatched=16, matched_text_bytes=1611088)
TOOLS = {
    'census.py': '804b88102b69c7bf41f7a3f751454bf9d4d1c89cc36fb7e7f52bdc89f28b9d5c',
    'pump_compare_function_bytes.py': '43fa359dce1e398f820df445d534e0912ac5f181f1ea15e13a5267b53105b075',
    'pump_quote_control_function_match.py': '28ad656012f8fbcd41ed1726e9345ee76f6249992bf28c91c4b9202479d3e94e',
}


def need(value, message):
    if not value:
        raise ValueError(message)


def sha(raw):
    return hashlib.sha256(raw).hexdigest()


def digest(path):
    return sha(path.read_bytes())


def doc(path):
    raw = path.read_bytes()
    return json.loads(gzip.decompress(raw) if raw[:2] == b'\x1f\x8b' else raw)


def safe(name):
    path = Path(name)
    need(not path.is_absolute() and '..' not in path.parts and '\\' not in name, 'unsafe retained path')
    return path


def check_manifest(root, name, pin=None, exact=False):
    path = root / name
    if pin:
        need(digest(path) == pin, 'manifest pin ' + name)
    value = doc(path)
    files = value.get('files', value)
    for rel, expected in files.items():
        item = root / safe(rel)
        need(not item.is_symlink() and digest(item) == expected, 'retained bytes ' + rel)
    if exact:
        present = {f.relative_to(root).as_posix() for f in root.rglob('*') if f.is_file()}
        need(present == set(files) | {name}, 'exact retained file inventory')
    return files


def archive(path):
    files = {}
    with tarfile.open(path, 'r:gz') as stream:
        for item in stream:
            need(item.isfile() and item.name not in files, 'regular unique source archive member')
            safe(item.name)
            files[item.name] = stream.extractfile(item).read()
    return files


def stage(source):
    # Pure data transform used by the authenticated D037 source qualification.
    out = {'programs/pump/' + key: raw for key, raw in source.items() if key not in ('Cargo.toml', 'Cargo.lock')}
    text = source['Cargo.toml'].decode()
    start, end = text.index('[profile.release]'), text.index('[workspace]')
    out['programs/pump/Cargo.toml'] = (text[:start].rstrip() + '\n').encode()
    out['Cargo.toml'] = ('[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n' + text[start:end].strip() + '\n').encode()
    out['Cargo.lock'] = source['Cargo.lock']
    return out


def hashed(files):
    return {key: sha(raw) for key, raw in files.items()}


def logical(pins, suffix):
    prefix = 'work/pump-exact-sol-guard-native-20261028/' + suffix + '/'
    need(all(name.startswith(prefix) for name in pins), 'actual recorded compiler prefix')
    return {name[len(prefix):]: value for name, value in pins.items()}


def load(name, path):
    # Execute only authenticated public analysis source, never a retained recipe.
    module = types.ModuleType(name)
    module.__file__ = str(path)
    sys.modules[name] = module
    exec(compile(path.read_bytes(), str(path), 'exec'), module.__dict__)
    return module


def verify(repo):
    check_manifest(P, 'MANIFEST.json', exact=True)
    inner = check_manifest(E, 'EVIDENCE-MANIFEST.json', INNER_SEAL, exact=True)
    need(len(inner) == 168, 'original 168-member evidence inventory')
    d037, guard = repo / D037, repo / GUARD
    check_manifest(d037, 'MANIFEST.json', 'ef50bb5262f67c59f4d1850f83e2821fa1e9c5f02649589cab356a6e28cffb49')
    check_manifest(guard, 'MANIFEST.json', 'f08d15b7eb03946f9e9114a9995e99565d9cb9b29da805bbdbc29aa40efb5465')
    original = (repo / 'evidence/original/pump/deployed.so').read_bytes()
    need(sha(original) == ORIGINAL, 'authentic original comparison ELF')
    need(digest(repo / 'repro/reconstruction-status-2026-10-26/functions.tsv') == 'fb2c0a47514567d65eb45c1e268dacd5291e4659bb7dceb575a767dc20bcaff8', 'canonical 1035-window inventory')
    source = {f.relative_to(E / 'source65').as_posix(): f.read_bytes() for f in (E / 'source65').rglob('*') if f.is_file()}
    parent = {f.relative_to(d037 / 'source').as_posix(): f.read_bytes() for f in (d037 / 'source').rglob('*') if f.is_file()}
    need(len(source) == len(parent) == 65 and hashed(source) == doc(E / 'SOURCE65.json'), '65 literal primary inputs')
    need(hashed(parent) == doc(d037 / 'SOURCE65.json'), 'authenticated D037 primary inputs')
    need([name for name in parent if source[name] != parent[name]] == ['src/buy.rs'], 'sole buy guard source change; 64 unchanged')
    need(sha(source['src/buy.rs']) == 'd4935c98c281cbd3b01175709b033b8ce4412fb851491aaa1cf9f58a65df8599', 'upstream guard buy source')
    need(source['src/buy.rs'] == (guard / 'source/programs/pump/src/buy.rs').read_bytes(), 'actual upstream proposal binding')
    need(sha(source['src/creator/admin_cto.rs']) == '3545aa72915c541810c3ea9219237f4d1791c7f40b0056b81e8a493e2cefcdb7', 'unchanged D037 creator notice')
    need(sha(source['src/multi_hop_curve_swap.rs']) == '734bdae1189dd4e4f54a27fd215624611228f36b92d3877b63f00df19ccc9e44', 'unchanged accrual; no Clock overlay')
    patch = ''.join(difflib.unified_diff(parent['src/buy.rs'].decode().splitlines(True), source['src/buy.rs'].decode().splitlines(True), fromfile='a/programs/pump/src/buy.rs', tofile='b/programs/pump/src/buy.rs'))
    need(patch == (E / 'source.patch').read_text(), 'exact audited source patch')
    staged = stage(source)
    need(len(staged) == 66 and archive(E / 'warm/compiled-workspace.tar.gz') == staged, 'actual 66-input source archive')
    need(hashed(staged) == doc(E / 'compiled66.json'), 'compiled66 map')
    literal = {f.relative_to(E / 'warm/source').as_posix(): f.read_bytes() for f in (E / 'warm/source').rglob('*') if f.is_file()}
    need(literal == staged, 'retained actual materialized compiler workspace')
    receipt = doc(E / 'warm/build-comparison.json')
    need(receipt == doc(E / 'warm/build-attempt.json') and digest(E / 'warm/build-comparison.json') == 'e519238f81000944b6f16b8d038fd0a38281d824bf2fe0b94627fd8ee1009aab', 'literal actual native build receipt')
    for key in ('primary_source_sha256', 'primary_source_after_sha256'):
        need(logical(receipt[key], 'source65') == hashed(source), 'actual primary source receipt join')
    for key in ('source_sha256', 'source_after_sha256'):
        need(logical(receipt[key], 'warm/source') == hashed(staged), 'actual compiled source receipt join')
    need(receipt['returncode'] == 0 and all(receipt[key] for key in ('source_unchanged', 'tools_unchanged', 'target_libraries_unchanged', 'reused_external_artifacts_unchanged', 'executed_python_sources_unchanged')), 'recorded immutable successful warm build')
    need(receipt['cold_empty_target'] is False and receipt['target_existed_before'] is True and receipt['external_dependency_rebuild'] is False, 'honest warm reused-cache scope')
    need(receipt['fresh_local_compilations'] == {'pump-recovered': True, 'pump-token-ext': True}, 'two actual fresh local crates')
    need(digest(E / 'build.py') == digest(E / 'warm/executed-builder.py') == receipt['builder_sha256'], 'archived executed builder')
    base = doc(d037 / 'builds/primary/build-comparison.json')
    for key in ('tool_sha256', 'target_libraries_sha256', 'source_wrapper_sha256'):
        need(receipt[key] == base[key], 'unchanged D037 compiler cohort ' + key)
    for name, row in receipt['executed_python_sources'].items():
        need(digest(E / 'warm/executed-tools' / safe(name)) == row['sha256'] == base['executed_python_sources'][name]['sha256'], 'archived authenticated executed tool ' + name)
    log = (E / 'warm/build.log').read_bytes()
    need(sha(log) == receipt['build_log_sha256'], 'actual compiler log')
    for name in ('pump_recovered', 'pump_token_ext'):
        need(sum(line.lstrip().startswith('Running ') and '--crate-name ' + name + ' ' in line for line in log.decode().splitlines()) == 1, 'actual local rustc invocation ' + name)
    need(receipt['command'][-6:] == base['command'][-6:] and '--emit' not in ' '.join(receipt['command']), 'unchanged ordinary Cargo flags')
    need(receipt['environment']['CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS'] == base['environment']['CARGO_TARGET_SBPF_SOLANA_SOLANA_RUSTFLAGS'], 'unchanged compiler flags')
    reference = doc(E / 'environment-reference.json')
    need(doc(E / 'environment-before.json')['environment_reference_sha256'] == doc(E / 'environment-after.json')['environment_reference_sha256'] == digest(E / 'environment-reference.json'), 'retained environment pre/post hash joins')
    need(len(reference['sdk_and_tool_files']) == 1855 and len(reference['locked_registry_archives']) == 254 and reference['source_files_checked'] == 4176, 'recorded environment scope')
    symbols, candidate = (E / 'warm/unstripped.so').read_bytes(), (E / 'warm/candidate.so').read_bytes()
    need(sha(symbols) == receipt['unstripped_sha256'] == SYMBOLS and sha(candidate) == receipt['comparison']['candidate_sha256'] == CANDIDATE, 'literal native outputs')
    for name, pin in TOOLS.items():
        need(digest(d037 / 'tools' / name) == pin, 'public analysis tool pin ' + name)
    elf = load('pump_quote_control_function_match', d037 / 'tools/pump_quote_control_function_match.py')
    normalizer = load('pump_compare_function_bytes', d037 / 'tools/pump_compare_function_bytes.py')
    census = load('native_guard_public_census', d037 / 'tools/census.py')
    census.ROOT = repo
    ss, cs = elf.sections(symbols), elf.sections(candidate)
    for name in ('.text', '.rodata', '.data.rel.ro', '.rel.dyn', '.dynsym', '.dynstr'):
        left, right = ss[name], cs[name]
        need((left['addr'], left['size']) == (right['addr'], right['size']) and symbols[left['offset']:left['offset'] + left['size']] == candidate[right['offset']:right['offset'] + right['size']], 'strip preserves executable/loaded section ' + name)
    fresh = census.census(E / 'warm/unstripped.so')
    need(fresh == doc(E / 'warm/inventory.json.gz') and fresh['counts'] == COUNTS, 'full 1035-window canonical census')
    old = census.census(d037 / 'artifacts/unstripped.so')
    membership = lambda report: [(w['start'], bool(w['normalized_matches']), w['raw_match']) for w in report['windows']]
    need(membership(fresh) == membership(old), 'all normalized/raw memberships unchanged')

    def target(blob):
        functions = [(start, size) for start, size, name in census.functions(blob) if '14pump_recovered14pump_recovered16buy_exact_sol_in17h' in name]
        need(len(functions) == 1 and functions[0][1] == 13224, 'actual exact-SOL target')
        start, size = functions[0]
        sections = elf.sections(blob)
        raw = normalizer.body(blob, sections, start, size)
        return raw, normalizer.normalize(raw, start, sections)[0]

    raw, norm = target(symbols)
    original_raw = normalizer.body(original, elf.sections(original), 0x14f4e0, 13224)
    original_norm = normalizer.normalize(original_raw, 0x14f4e0, elf.sections(original))[0]
    different = [i for i, (left, right) in enumerate(zip(original_norm, norm)) if left != right]
    need(len(different) == 4 and sorted({i // 8 for i in different}) == [1003, 1004], 'same exact four-byte two-load difference')
    need([original_raw[i * 8:i * 8 + 8].hex() for i in (1003, 1004)] == ['79a358f900000000', '79a160f900000000'], 'actual original tag/payload loads')
    need([raw[i * 8:i * 8 + 8].hex() for i in (1003, 1004)] == ['79a160f900000000', '79a358f900000000'], 'actual trial reversed loads')
    linux_guard = gzip.decompress((guard / 'candidate/symbols.so.gz').read_bytes())
    need((E / 'linux-guard-symbols.so').read_bytes() == linux_guard, 'literal retained upstream guard image')
    need(norm == target(linux_guard)[1], 'retained upstream guard normalized target equality')
    need(target((d037 / 'artifacts/unstripped.so').read_bytes())[1] == target(gzip.decompress((guard / 'parent/symbols.so.gz').read_bytes()))[1], 'D037 native control equals upstream parent target')
    handoff = doc(E / 'HANDOFF.json')
    need(handoff['ordinary_native_warm_builds'] == 1 and handoff['new_VM_executions'] == 0 and handoff['whole_window_gain'] == 0 and handoff['goal_complete'] is False, 'bounded negative scope')
    return dict(passed=True, inner_evidence_members=168, inner_manifest_sha256=INNER_SEAL, source65_sha256=digest(E / 'SOURCE65.json'), actual_receipt_sha256=digest(E / 'warm/build-comparison.json'), compiled_archive_sha256=digest(E / 'warm/compiled-workspace.tar.gz'), source_inputs=65, compiled_workspace_inputs=66, unchanged_primary_inputs=64, candidate_sha256=CANDIDATE, symbols_sha256=SYMBOLS, actual_warm_builds=1, fresh_local_crates=2, cold_repeat=False, counts=COUNTS, normalized_gains=0, normalized_losses=0, raw_gains=0, raw_losses=0, target_bytes=13224, target_different_bytes=4, target_different_slots=[1003, 1004], new_Cargo_or_VM_executions=0, native_runtime_qualified=False, canonical_promotion=False, whole_target_equal=False, goal_complete=False)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo-root', type=Path, default=P.parents[1])
    args = parser.parse_args()
    print(json.dumps(verify(args.repo_root.resolve()), indent=2))
