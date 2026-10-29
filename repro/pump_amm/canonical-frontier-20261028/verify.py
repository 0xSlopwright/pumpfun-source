#!/usr/bin/env python3
"""Bind maintained AMM inputs, isolated compiler records and complete runtime proof."""
from pathlib import Path
import argparse
import difflib
import gzip
import hashlib
import importlib.util
import io
import json
import tarfile
import tempfile
import tomllib

P = Path(__file__).resolve().parent
ROOT = P.parents[2]
CANDIDATE = '15aadc37c6a4fb2148895eafa22a969f7ad28a363c8972a8fe526a015fa85d21'
SYMBOLS = '281a72ea4b5bccc02b91699472639d91c81f3af15a3ae284b0ad3a346f4620f7'
ORIGINAL = '6a7ad34596d83b4c435b32f458a56e718e9f82eb4ad38e4316616d15d24d8ff7'
IMAGE = 'solanafoundation/solana-verifiable-build@sha256:6c73adc767ee7ff212f2532d4695472b12f3d4ac20aea3db22b89d8c614dac50'


def require(value, message):
    if not value:
        raise RuntimeError(message)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def read(path):
    data = Path(path).read_bytes()
    return gzip.decompress(data) if str(path).endswith('.gz') else data


def load(path):
    return json.loads(read(path))


def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


def archive(path):
    result = {}
    with tarfile.open(fileobj=io.BytesIO(read(path))) as source:
        for item in source:
            require(item.isfile() and not item.name.startswith('/') and '..' not in Path(item.name).parts, 'unsafe archive member')
            require(item.name not in result, 'duplicate archive member')
            result[item.name] = source.extractfile(item).read()
    return result


def dependencies(lock, inventory, crates):
    expected = {(package['name'], package['version']): package
                for package in tomllib.loads(lock.decode())['package']
                if package.get('source', '').startswith('registry+')}
    require(len(expected) == len(inventory) == len(crates) == 257, 'dependency package count')
    seen, count = set(), 0
    for package in inventory:
        key = package['name'], package['version']
        require(key in expected and key not in seen, 'unexpected dependency package')
        seen.add(key)
        selected = expected[key]
        require(package['checksum'] == selected['checksum'] and package['source'] == selected['source'], 'dependency lock binding')
        name = '-'.join(key)
        raw = crates[name + '.crate']
        require(sha(raw) == selected['checksum'], name + ' archive checksum')
        members = {}
        with tarfile.open(fileobj=io.BytesIO(raw)) as source:
            for item in source:
                if not item.isfile():
                    continue
                require(item.name.startswith(name + '/') and '..' not in Path(item.name).parts, name + ' unsafe archive')
                relative = item.name[len(name)+1:]
                require(relative not in members, name + ' duplicate archive member')
                members[relative] = sha(source.extractfile(item).read())
        require(members == package['archive_files'], name + ' archive source inventory')
        require(bool(package['active_roots']), name + ' missing active source root')
        for root in package['active_roots'].values():
            require({relative: root.get(relative) for relative in members} == members, name + ' active source drift')
            require(set(root)-set(members) <= {'.cargo-ok', '.cargo-checksum.json'}, name + ' unreviewed generated source')
        count += len(members)
    require(seen == set(expected) and count == 8180, 'dependency inventory completeness')
    return count


def verify(repo=ROOT, runtime=None, signatures=False, current_source=True):
    repo = Path(repo).resolve()
    manifest = load(P / 'MANIFEST.json')
    actual = {str(path.relative_to(P)) for path in P.rglob('*') if path.is_file()
              and path.relative_to(P).parts[0] not in ['work', '__pycache__']
              and '__pycache__' not in path.parts and path.name != 'MANIFEST.json'}
    require(actual == set(manifest), 'packet membership differs')
    for name, digest in manifest.items():
        require(not (P/name).is_symlink() and sha((P/name).read_bytes()) == digest, 'packet hash differs: ' + name)
    recipe = module('canonical_amm_recipe', P / 'workspace_recipe.py')
    canonical = archive(P / 'results/build-a/canonical-source.tar.gz')
    canonical_hashes = {name: sha(data) for name, data in canonical.items()}
    require(len(canonical) == 68, 'canonical source input count')
    if current_source:
        for directory in [repo, repo/'programs', repo/'programs/pump-amm']:
            for selector in recipe.CONFIGS:
                path = directory / selector
                require(not path.exists() and not path.is_symlink(), 'ambient Cargo/toolchain selector: ' + str(path))
        for name in canonical:
            path = repo/name
            require(path.is_file(), 'missing maintained source input: ' + name)
            for part in [path, *path.parents]:
                if part == repo.parent:
                    break
                require(not part.is_symlink(), 'symlinked maintained source input: ' + name)
        require(recipe.source_inputs(repo) == canonical, 'maintained AMM source differs from selected compiler inputs')
    with tempfile.TemporaryDirectory() as directory:
        source = Path(directory)
        for name, data in canonical.items():
            target = source / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(data)
        _, staged = recipe.expected_workspace(source)
    staged_hashes = {name: sha(data) for name, data in staged.items()}
    require(len(staged) == 69, 'staged workspace input count')
    promotion = load(P/'source-promotion.json')
    require(promotion['canonical_inputs'] == 68 and promotion['staged_inputs'] == 69 and promotion['rust_transformations'] == 0, 'promotion input counts differ')
    require(promotion['source_sha256'] == canonical_hashes and promotion['workspace_sha256'] == staged_hashes, 'promotion source inventory differs')
    selection = load(P/'selection.json')
    require(selection['candidate_sha256'] == CANDIDATE and selection['symbols_sha256'] == SYMBOLS and selection['normalized_windows'] == 784 and selection['raw_windows'] == 394, 'packet selection differs')
    crates = archive(P / 'results/registry-archives.tar.gz')
    records = []
    for build in ['build-a', 'build-b']:
        base = P / 'results' / build
        record = load(base / 'build-record.json')
        records.append(record)
        require(record['returncode'] == 0 and record['source_unchanged'] is True, build + ' compiler failure or source drift')
        require(record['source_sha256'] == record['source_after_sha256'] == record['workspace_sha256'] == staged_hashes, build + ' compiled workspace binding')
        require(record['canonical_sha256'] == canonical_hashes, build + ' canonical source binding')
        require(record['image'] == IMAGE and record['registry_packages'] == 257 and record['archive_files'] == 8180, build + ' recipe identity')
        require(record['dependency_inputs_unchanged'] is True and record['sdk_unchanged'] is True, build + ' external input drift')
        require(sha((base/'candidate.so').read_bytes()) == record['candidate_sha256'] == CANDIDATE, build + ' candidate identity')
        require(sha((base/'symbols.so').read_bytes()) == record['symbols_sha256'] == SYMBOLS, build + ' symbols identity')
        require(archive(base/'canonical-source.tar.gz') == canonical, build + ' source archive')
        binding = load(base / 'source-binding.json')
        require(binding['input_sha256'] == canonical_hashes and binding['workspace_sha256'] == staged_hashes and binding['rust_transformations'] == 0, build + ' staging binding')
        log = read(base/'build.log.gz').decode()
        require('Running `' in log and '--crate-name pump_amm_recovered' in log, build + ' missing actual main compiler execution')
        if build == 'build-a':
            require(record['clean_all'] is True and 'Fresh ' not in log, 'cold build reused a dependency package')
            empty = load(base/'target-clean.json')
            require(empty['empty_before_compilation'] is True and empty['remaining_entries'] == [], 'cold target was not empty')
        expected_harness = {name: sha((P/name).read_bytes()) for name in ['build.py', 'workspace_recipe.py']}
        require(record['harness_sha256'] == record['harness_after_sha256'] == expected_harness, 'executed published builder inputs differ')
        require({name: sha((base/'harness'/name).read_bytes()) for name in expected_harness} == expected_harness, 'retained executed builder bytes differ')
        inventory = load(base/'dependencies.json.gz')
        dependencies(staged['Cargo.lock'], inventory, crates)
    require((P/'results/build-a/candidate.so').read_bytes() == (P/'results/build-b/candidate.so').read_bytes(), 'repeat candidate differs')
    require((P/'results/build-a/symbols.so').read_bytes() == (P/'results/build-b/symbols.so').read_bytes(), 'repeat symbols differ')
    require(read(P/'results/build-a/dependencies.json.gz') == read(P/'results/build-b/dependencies.json.gz'), 'repeat dependency inputs differ')
    require(load(P/'results/build-a/sdk-sha256.json') == load(P/'results/build-b/sdk-sha256.json'), 'repeat compiler SDK inputs differ')
    original = repo / 'evidence/original/pump_amm/deployed.so'
    require(sha(original.read_bytes()) == ORIGINAL, 'original program identity')
    measurement = module('canonical_amm_measure', P/'tools/measure.py')
    rows = measurement.measure(original, P/'results/build-a/symbols.so')
    metrics = {'normalized': sum(bool(row['match']) for row in rows), 'raw': sum(row['raw'] for row in rows),
               'matched_text_bytes': sum(row['bytes'] for row in rows if row['match']),
               'remaining': [row['original'] for row in rows if not row['match']]}
    require(metrics == {'normalized': 784, 'raw': 394, 'matched_text_bytes': 1153016, 'remaining': ['0x4c750']}, 'window census differs')
    require(rows == load(P/'results/windows.json'), 'saved window rows differ')
    prior = P/'results/prior-r13'
    previous = archive(prior/'build-a/canonical-source.tar.gz')
    require(set(previous) == set(canonical), 'r13 source membership differs')
    patch = ''.join(''.join(difflib.unified_diff(previous[name].decode().splitlines(keepends=True), canonical[name].decode().splitlines(keepends=True),
                     fromfile='a/'+name,tofile='b/'+name)) for name in sorted(canonical) if previous[name] != canonical[name])
    require(patch == (P/'r13-to-r31.patch').read_text(), 'r13-to-r31 source patch differs')
    for name in ['build-a','build-b']:
        require(sha((prior/name/'candidate.so').read_bytes()) == '6eac0c527e11c0acd368043adf7457eab3df696ce4a2bc97d63fe867d748f93f', 'historical r13 candidate changed')
        require(sha((prior/name/'symbols.so').read_bytes()) == '54d879b24e3de896d50aaf9d480c77cf303f1b81bfb63673e87c3bf0fe1d1819', 'historical r13 symbols changed')
    prior_rows = measurement.measure(original, prior/'build-a/symbols.so')
    matched = lambda values,key: {row['original'] for row in values if row[key]}
    require(matched(rows,'match') == matched(prior_rows,'match') and matched(prior_rows,'raw') <= matched(rows,'raw'), 'r31 loses a prior match')
    gains = load(P/'results/r13-to-r31-window-sets.json')
    require(gains['candidate_sha256'] == CANDIDATE and gains['symbols_sha256'] == SYMBOLS, 'r31 delta identity')
    require(set(gains['raw_gains']) == matched(rows,'raw')-matched(prior_rows,'raw') and len(gains['raw_gains']) == 127 and gains['raw_losses'] == [] and gains['normalized_losses'] == gains['normalized_gains'] == [], 'r31 delta sets differ')
    require(load(P/'results/r31-physical-closure-audit.json')['candidate_sha256'] == CANDIDATE, 'physical witness candidate identity')
    physical = module('canonical_amm_physical_closure', P/'verify_physical.py').verify(original,P/'results/build-a/symbols.so',P/'results/r31-physical-closure-audit.json',P/'results/r31-rodata-closure-audit.json')
    closure = module('canonical_amm_elf_closure', P/'elf_closure.py')
    residual = closure.inspect(original, P/'results/build-a/candidate.so')
    require(residual == load(P/'results/elf-closure.json'), 'raw ELF residual ledger differs')
    require(residual['whole_file_equal'] is False and residual['meaningful_elf_equal'] is False, 'unqualified ELF equality claim')
    runtime_inputs = archive(P/'results/runtime/inputs.tar.gz')
    require({name: sha(data) for name, data in runtime_inputs.items()} == load(P/'results/runtime/input-sha256.json'), 'frozen runtime input inventory')
    require(sha(runtime_inputs['work/selected-candidate.so']) == CANDIDATE, 'frozen runtime candidate identity')
    require(sha(runtime_inputs['evidence/original/pump_amm/deployed.so']) == ORIGINAL, 'frozen runtime original identity')
    audit = module('canonical_amm_runtime_audit', P/'audit_runtime.py')
    runtime = Path(runtime) if runtime is not None else P/'results/runtime/corpus'
    inputs = load(runtime/'inputs.json')
    require(sha(runtime_inputs['repro/pump_amm/owner6048-v144/runtime/observe_suite.py']) == inputs['observer_sha256'], 'frozen observer binding')
    require(all(sha(runtime_inputs[name]) == digest for name, digest in inputs['harness_sha256'].items()), 'frozen harness binding')
    result = audit.audit(runtime, CANDIDATE, signatures)
    loader = module('canonical_amm_loader_controls', P/'verify_loader.py')
    loader_result = loader.verify(P, original, P/'results/build-a/candidate.so', signatures)
    saved_loader = load(P/'results/loader/audit.json')
    require(all(saved_loader[key] == value for key, value in loader_result.items() if not key.startswith('cryptographically_')), 'saved loader audit totals differ')
    require(saved_loader['cryptographically_reverified_signature_fields'] == 148, 'saved loader signature proof')
    saved_audit = load(P/'results/runtime/audit.json')
    require(all(saved_audit[key] == value for key, value in result.items() if not key.startswith('cryptographically_')), 'saved runtime audit totals differ')
    require(saved_audit['cryptographically_reverified_signature_fields'] == 35418, 'saved runtime signature proof')
    return {'status': 'PASS', 'program': 'pump_amm', 'candidate_sha256': CANDIDATE, 'symbols_sha256': SYMBOLS,
            'canonical_inputs': 68, 'workspace_inputs': 69, 'registry_packages': 257, 'registry_archive_files': 8180,
            'current_source_verified': current_source, 'cold_build_and_repeat_identical': True,
            'hardened_published_builder_execution_bound': True,
            'physical_closure': physical,
            'whole_elf_identical': False, 'meaningful_elf_identical': False, 'loader_controls': loader_result, **metrics, **result}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, default=ROOT)
    parser.add_argument('--runtime', type=Path)
    parser.add_argument('--signatures', action='store_true')
    parser.add_argument('--saved-only', action='store_true')
    args = parser.parse_args()
    print(json.dumps(verify(args.repo, args.runtime, args.signatures, not args.saved_only), indent=2))
