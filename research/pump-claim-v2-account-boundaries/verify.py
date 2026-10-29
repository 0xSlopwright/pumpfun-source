"""Recompute retained source/build/static/runtime evidence; no build or VM execution."""
from pathlib import Path
import base64, difflib, gzip, hashlib, importlib.util, io, json, re, struct, sys, tarfile, tomllib

sys.dont_write_bytecode = True
P = Path(__file__).resolve().parent
R = P.parents[1]
L = R / 'research/pump-v3-buy-cost-overflow'
ORIGINAL = '7a19affaa2c6187e04a5fe0ea298cee81fa5eb8c24cfcc30d85f615e89f7b02d'
PROGRAM = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'
PARENT = dict(candidate='199fd7379b6881adefd9e54803f75902176c17bded1718bfc1c59b1cf5bc8473', symbols='49df399b8a36a0a60de03e8d55f1417261dc451e44845ca9d17a94040968c680')
CU = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
SOURCE = 'src/token_incentives/claim_token_incentives.rs'
sha = lambda value: hashlib.sha256(value).hexdigest()

def require(condition, message):
    if not condition:
        raise ValueError(message)

def read(path):
    raw = Path(path).read_bytes()
    return gzip.decompress(raw) if raw[:2] == b'\x1f\x8b' else raw

def doc(path):
    return json.loads(read(path))

def load(path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result

def image_hashes(packet=P):
    images = dict(original=ORIGINAL)
    images.update({name: sha(read(packet / f'artifacts/{name}-candidate.so.gz')) for name in ('parent', 'proposal')})
    selection = doc(packet / 'selection.json')
    symbols = {name: sha(read(packet / f'artifacts/{name}-unstripped.so.gz')) for name in ('parent', 'proposal')}
    require(selection['images_sha256'] == images and selection['symbols_sha256'] == symbols, 'selected image bindings differ')
    require(selection['source_changed'] == [SOURCE] and selection['whole_function_equal'] is False and selection['whole_elf_equal'] is False and re.fullmatch('[0-9a-f]{40}', selection['upstream_commit']), 'partial selection scope differs')
    return images

def authenticated_common(packet=P):
    for name, digest in doc(packet / 'shared-tools-sha256.json').items():
        require(not Path(name).is_absolute() and '..' not in Path(name).parts, 'unsafe shared tool path')
        path = R / name
        require(not path.is_symlink() and sha(path.read_bytes()) == digest, 'shared tool differs: ' + name)
    for name, digest in doc(packet / 'fixtures-sha256.json').items():
        require(not Path(name).is_absolute() and '..' not in Path(name).parts, 'unsafe fixture path')
        path = R / name
        require(not path.is_symlink() and sha(path.read_bytes()) == digest, 'fixture differs: ' + name)
    return load(L / 'verify.py')

def check_sources(packet=P):
    primary = doc(packet / 'sources/primary-sha256.json')
    with tarfile.open(fileobj=io.BytesIO(read(packet / 'sources/primary.tar.gz'))) as archive:
        members = archive.getmembers()
        require(len(members) == len(primary) == 65 and {m.name for m in members} == set(primary), '65 unique source inputs required')
        require(all(m.isfile() and not Path(m.name).is_absolute() and '..' not in Path(m.name).parts for m in members), 'unsafe source archive member')
        source = {m.name: archive.extractfile(m).read() for m in members}
    require({name: sha(value) for name, value in source.items()} == primary, 'source archive hash differs')
    old = read(packet / 'sources/parent-claim_token_incentives.rs.gz')
    require(len(old.splitlines()) == len(source[SOURCE].splitlines()) == 350, 'physical Source line layout differs')
    patch = ''.join(difflib.unified_diff(old.decode().splitlines(True), source[SOURCE].decode().splitlines(True), fromfile='a/' + SOURCE, tofile='b/' + SOURCE))
    require(patch == (packet / 'source.patch').read_text(), 'patch is not the compiled source delta')
    def stage(values):
        cargo = values['Cargo.toml'].decode(); a, b = cargo.index('[profile.release]'), cargo.index('[workspace]')
        result = {'programs/pump/' + name: value for name, value in values.items()}
        result['programs/pump/Cargo.toml'] = (cargo[:a].rstrip() + '\n').encode()
        result['Cargo.toml'] = ('[workspace]\nmembers = ["programs/pump"]\nresolver = "2"\n\n' + cargo[a:b].strip() + '\n').encode()
        result['Cargo.lock'] = result.pop('programs/pump/Cargo.lock')
        require(tomllib.loads(result['Cargo.toml'].decode())['profile']['release'] == {'panic': 'abort', 'overflow-checks': True, 'lto': False, 'codegen-units': 1}, 'release profile differs')
        return {name: sha(value) for name, value in result.items()}
    parent = dict(source); parent[SOURCE] = old
    archives = {f"{value['name']}-{value['version']}.crate": value['checksum'] for value in tomllib.loads(source['Cargo.lock'].decode())['package'] if value.get('source', '').startswith('registry+')}
    require(len(archives) == 254, 'locked registry archive set differs')
    return primary, stage(source), {name: sha(value) for name, value in parent.items()}, stage(parent), archives

def check_builds(packet=P):
    base = authenticated_common(packet)
    primary, staged, parent_primary, parent_staged, archives = check_sources(packet)
    images = image_hashes(packet)
    symbols = {name: sha(read(packet / f'artifacts/{name}-unstripped.so.gz')) for name in ('parent', 'proposal')}
    require(images['parent'] == PARENT['candidate'] and symbols['parent'] == PARENT['symbols'], 'current qualified parent outputs differ')
    for label in ('parent', 'proposal', 'repeat'):
        result = doc(packet / f'builds/{label}-result.json.gz'); launch = doc(packet / f'builds/{label}-launch.json.gz')
        base.check_toolchain(result, L)
        require(all(result.get(k) == value for k, value in launch.items()), 'launch/result disagreement')
        require(result['exit_code'] == 0 and result['source_unchanged'] is True and result['root_invocations'] == 1 and result['original_binary_build_input'] is False, 'successful immutable fresh root build required')
        command = result['command']
        require(command[1] == 'build' and all(flag in command for flag in ('--release', '--locked', '--offline', '--verbose')) and not any('evidence/original/' in arg for arg in command), 'source build command differs')
        log = read(packet / f'builds/{label}-build.log.gz')
        require(sha(log) == result['log_sha256'] and log.count(b'--crate-name pump_recovered ') == 1, 'root compiler log differs')
        require(b'-C opt-level=3 -C panic=abort -C embed-bitcode=no -C codegen-units=1 -C overflow-checks=on' in log, 'actual compiler release flags differ')
        base.logical(result['primary_source_sha256'], parent_primary if label == 'parent' else primary)
        base.logical(result['source_sha256'], parent_staged if label == 'parent' else staged)
        locks = doc(packet / f'builds/{label}-locked-archives.json.gz')
        require(locks == dict(count=254, sha256=archives), 'recorded locked archives differ')
        image = 'parent' if label == 'parent' else 'proposal'
        require(result['candidate_sha256'] == images[image] and result['unstripped_sha256'] == symbols[image], 'build output hashes differ')
        for filename, digest in [('candidate.so', images[image]), ('unstripped.so', symbols[image])]:
            require(sha(read(packet / f'artifacts/{image}-{filename}.gz')) == digest, 'retained ELF output differs')
    rebuilt = doc(packet / 'builds/rebuild-build-comparison.json.gz'); base.check_toolchain(rebuilt, L, repository_builder=True)
    require(rebuilt['returncode'] == 0 and rebuilt['source_unchanged'] is True and rebuilt['comparison']['candidate_sha256'] == images['proposal'] and rebuilt['unstripped_sha256'] == symbols['proposal'], 'archived-source rebuild differs')
    for field, expected in [('primary_source_sha256', primary), ('source_sha256', staged), ('source_after_sha256', staged)]:
        base.logical(rebuilt[field], expected)
    log = read(packet / 'builds/rebuild-build.log.gz')
    require(sha(log) == rebuilt['build_log_sha256'] and log.count(b'Compiling pump-recovered v0.1.0 ') == 1, 'archived-source fresh root compiler status differs')
    return base, staged

def check_analysis(packet=P):
    actual = load(P / 'analyze.py').analyze(packet)
    require(json.loads(json.dumps(actual)) == doc(packet / 'comparison.json.gz'), 'regenerated static comparison differs')
    return actual

def loader_expectations(packet=P):
    hashes = image_hashes(packet)
    capture = doc(R / 'evidence/original/pump/capture.json')
    program = (R / 'evidence/original/pump/program-account.bin').read_bytes()
    pd = (R / 'evidence/original/pump/programdata-account.bin').read_bytes()
    require(sha(program) == capture['program_sha256'] and sha(pd) == capture['programdata_sha256'] and sha(pd[45:]) == ORIGINAL, 'captured loader account differs')
    images = {'original': (R / 'evidence/original/pump/deployed.so').read_bytes()}
    images.update({name: read(packet / f'artifacts/{name}-candidate.so.gz') for name in ('parent', 'proposal')})
    require({name: sha(value) for name, value in images.items()} == hashes, 'runtime image bytes differ')
    return {hashes[name]: dict(elf_sha256=hashes[name], elf_bytes=len(value), program_owner=capture['owner'], program_bytes=36, program_sha256=sha(program), programdata_bytes=capture['programdata_bytes'], programdata_sha256=sha(pd[:45] + value + bytes(capture['payload_bytes'] - len(value))), header_sha256=sha(pd[:45]), elf_prefix_unchanged=True, zero_allocation_tail=True) for name, value in images.items()}

def check_loads(loads, expected, wanted):
    require(loads and {value['elf_sha256'] for value in loads} == set(wanted), 'actual loader images differ')
    for value in loads:
        require(all(value.get(k) == v for k, v in expected[value['elf_sha256']].items()) and value['slot'] > 458921440, 'actual captured loader layout differs')

def verify_transaction(encoded):
    from solders.transaction import Transaction, VersionedTransaction
    raw = base64.b64decode(encoded, validate=True)
    try: value = Transaction.from_bytes(raw)
    except ValueError: value = VersionedTransaction.from_bytes(raw)
    checks = value.verify_with_results()
    require(bytes(value) == raw and checks and all(checks), 'invalid serialized transaction signature')
    return value, raw

def check_focused(report, packet=P):
    images = image_hashes(packet)
    expected = dict.fromkeys(('native_positive', 'native_at_rent_zero', 'native_rent_plus_one', 'native_below_rent', 'token_positive', 'token_zero', 'token_empty_data', 'token_zero_skips_recipient_owner', 'token2022_positive', 'token2022_zero', 'token2022_empty_data', 'token2022_fee_100bps', 'token2022_fee_10000bps'))
    expected.update(native_counter_overflow='ProgramFailedToComplete', native_payment_before_counter='ArithmeticOverflow', token_short_data='InvalidAccountData', token_quote_owner_before_empty='InstructionErrorCustom(6010)', token_quote_owner_positive='InstructionErrorCustom(6010)', token_recipient_owner_positive='InstructionErrorCustom(6010)', token_recipient_authority='InstructionErrorCustom(6076)', token_counter_overflow='ProgramFailedToComplete', token_payment_before_counter='ProgramFailedToComplete', token2022_short_data='InvalidAccountData', token2022_counter_overflow='ProgramFailedToComplete')
    require(report['images_sha256'] == images and report['case_count'] == len(report['cases']) == 24 and report['execution_count'] == 72 and {row['case']['name'] for row in report['cases']} == set(expected), 'focused corpus/images differ')
    require(report['excluded_log_pattern'] == CU.pattern, 'diagnostic exclusion changed')
    fixtures = doc(packet / 'fixtures-sha256.json')
    for field, name in [('producer_sha256', None), ('fixture_sha256', 'scripts/pump_cashback_differential.py'), ('bootstrap_fixture_sha256', 'scripts/pump_trade_fixture.py'), ('loader_sha256', 'scripts/pump_captured_loader.py')]:
        require(report[field] == (sha((packet / 'tools/focused.py').read_bytes()) if name is None else fixtures[name]), 'focused producer/fixture binding differs')
    dependencies = {}
    for name in ('spl_token', 'spl_token_2022', 'associated_token'):
        cp = R / f'evidence/dependencies/{name}/capture.json'; capture = doc(cp); data = (cp.parent / 'deployed.so').read_bytes()
        require(sha(data) == capture['payload_sha256'], 'captured dependency image differs')
        dependencies[capture['program']] = dict(name=name, payload_sha256=sha(data), capture_sha256=sha(cp.read_bytes()))
    require(report['dependency_captures'] == dependencies, 'dependency capture binding differs')
    loads = loader_expectations(packet)
    for row in report['cases']:
        name = row['case']['name']; runs = row['runs']; obs = row['observations']
        require(row['case'].get('v2') is True and set(runs) == set(obs) == {'original', 'parent', 'proposal'}, 'claim-v2 triple missing')
        require(len({value['transaction_base64'] for value in runs.values()}) == 1 and not row['parent_differences'] and not row['proposal_differences'], 'focused inputs or saved differences changed')
        for label, run in runs.items():
            observation = obs[label]; tx, raw = verify_transaction(run['transaction_base64'])
            require(len(tx.signatures) == tx.message.header.num_required_signatures == 1 and len(tx.message.instructions) == 1 and str(tx.message.account_keys[tx.message.instructions[0].program_id_index]) == PROGRAM and bytes(tx.message.instructions[0].data) == hashlib.sha256(b'global:claim_cashback_v2').digest()[:8], 'focused signed instruction differs')
            require(observation['transaction_base64'] == run['transaction_base64'] and run['signatures_verified'] is True, 'transaction observation differs')
            require(observation['signature_verification'] == dict(signature_count=1, signatures=[str(value) for value in tx.signatures], transaction_sha256=sha(raw), all_verified=True), 'signature observation differs')
            programs = {pid: value['payload_sha256'] for pid, value in dependencies.items()}; programs[PROGRAM] = images[label]
            actual = observation['actual_program_loads']
            require(observation['declared_load_sha256'] == programs and len(actual) == len({value['program'] for value in actual}) == 4 and {value['program']: value['sha256'] for value in actual} == programs, 'actual/declared program load differs')
            check_loads(observation['captured_loader_loads'], loads, [images[label]])
            require(len(observation['captured_loader_loads']) == 1, 'focused loader count differs')
            metadata = observation['metadata']
            require(metadata['logs'] == run['logs'] and metadata['inner_instructions'] == run['inner'] and metadata.get('return_data') == run['return_data'], 'raw metadata observation differs')
            require(run['events'] == [line[14:] for line in run['logs'] if line.startswith('Program data: ')] and run['accounts'] == {key: value for key, value in observation['after'].items() if key != PROGRAM}, 'post-state/event observation differs')
            require(set(observation['before']) == set(observation['after']) == {str(value) for value in tx.message.account_keys}, 'transaction account observations incomplete')
        for label in ('parent', 'proposal'):
            require(all(runs['original'][key] == runs[label][key] for key in ('error', 'accounts', 'events', 'inner', 'return_data', 'transaction_base64')), name + ': semantic difference')
            require(all(obs['original'][key] == obs[label][key] for key in ('before', 'after')), name + ': account observation differs')
            require([line for line in runs['original']['logs'] if not CU.fullmatch(line)] == [line for line in runs[label]['logs'] if not CU.fullmatch(line)], name + ': ordered diagnostic differs')
        error = runs['original']['error']; want = expected[name]
        require(error is None if want is None else error is not None and want in error, name + ': original outcome differs')
        for fragment in ({'token_quote_owner_before_empty': ':310.', 'token_quote_owner_positive': ':310.', 'token_recipient_owner_positive': ':333.', 'token_recipient_authority': ':342.', 'native_counter_overflow': 'volume_accumulator.rs:186:22', 'token_counter_overflow': 'volume_accumulator.rs:192:22', 'token_payment_before_counter': 'volume_accumulator.rs:192:22', 'token2022_counter_overflow': 'volume_accumulator.rs:192:22'}.get(name),):
            if fragment: require(any(fragment in line for line in runs['original']['logs']), name + ': expected original diagnostic missing')
        if name.startswith('token2022_fee_'):
            amount = 50 if name.endswith('100bps') else 5000
            accounts = [base64.b64decode(value['data']) for value in obs['original']['after'].values() if value and value['owner'] == 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb' and value['data'] and len(base64.b64decode(value['data'])) == 178]
            require(sorted(struct.unpack_from('<Q', value, 170)[0] for value in accounts) == [0, amount], 'actual withheld amount differs')
    return 72

def signature_audit(values):
    cache = {}; fields = signatures = 0
    def walk(value):
        nonlocal fields, signatures
        if isinstance(value, dict):
            for key, item in value.items():
                if key == 'transaction_base64' and isinstance(item, str):
                    if item not in cache: cache[item] = len(verify_transaction(item)[0].signatures)
                    fields += 1; signatures += cache[item]
                else: walk(item)
        elif isinstance(value, list):
            for item in value: walk(item)
    for value in values: walk(value)
    require((fields, signatures) == (18595, 28127), 'serialized corpus signature-field totals differ')
    return dict(transaction_fields=fields, signature_fields=signatures)

def paired_log_audit(suites):
    coverage = {}; mismatches = []
    def logs(value):
        return [line for key, item in value.items() if 'log' in key.lower() and isinstance(item, list) for line in item if isinstance(line, str)]
    def walk(value, path):
        if isinstance(value, dict):
            if isinstance(value.get('original'), dict) and isinstance(value.get('candidate'), dict):
                left, right = logs(value['original']), logs(value['candidate'])
                if left or right:
                    suite = path.split('/')[0]; coverage[suite] = coverage.get(suite, 0) + 1
                    a, b = [line for line in left if not CU.fullmatch(line)], [line for line in right if not CU.fullmatch(line)]
                    if a != b: mismatches.append(dict(path=path, original_logs=left, candidate_logs=right))
            for key, item in value.items():
                if key not in ('original', 'candidate'): walk(item, path + '/' + key)
        elif isinstance(value, list):
            for index, item in enumerate(value): walk(item, path + '/' + str(index))
    for name, suite in suites.items(): walk(suite, name)
    return dict(coverage=coverage, log_bearing_cases=sum(coverage.values()), mismatches=mismatches, excluded_log_pattern=CU.pattern)

def check_corpus(packet, base, staged):
    images = image_hashes(packet)
    full = doc(packet / 'runtime/full44.json.gz'); ext = doc(packet / 'runtime/extensions.json.gz')
    require(full['candidate_sha256'] == ext['candidate_sha256'] == images['proposal'] and full['original_sha256'] == ext['original_sha256'] == ORIGINAL, 'corpus images differ')
    require(full['case_count'] == 10468 and len(full['suites']) == 44 and not full['mismatches'] and full['loader_profile'] == 'captured-upgradeable', 'full corpus incomplete')
    base.logical(full['compiled_source_sha256'], staged)
    binding = doc(packet / 'builds/runtime-build-comparison.json.gz')
    require(binding['returncode'] == 0 and binding['source_unchanged'] is True and binding['comparison']['candidate_sha256'] == images['proposal'], 'runtime build compatibility view differs')
    for key in ('source_sha256', 'source_after_sha256'): base.logical(binding[key], staged)
    semantic = ('error', 'accounts', 'account', 'before', 'after', 'before_accounts', 'after_accounts', 'data_hex', 'lamports', 'payer_lamports', 'authority_lamports', 'user_lamports', 'creator', 'events', 'event_payloads', 'inner', 'inner_instructions', 'return', 'returns', 'return_data')
    count = 0; loads = loader_expectations(packet)
    for name, suite in full['suites'].items():
        cases = suite.get('cases'); cases = cases if isinstance(cases, list) else suite['results']
        require(len(cases) == suite['case_count'], 'suite length differs'); count += len(cases)
        for case in cases:
            require(not any(case.get(key) for key in ('different_fields', 'differences', 'diff', 'mismatches', 'mismatched_fields')) and case.get('match', case.get('matches', True)) is True, 'saved corpus case mismatch')
            for key in semantic:
                if key in case['original'] or key in case['candidate']: require(case['original'].get(key) == case['candidate'].get(key), name + ': ' + key + ' differs')
        check_loads(doc(packet / f'runtime/loaders/{name}.loader.json.gz')['loads'], loads, [ORIGINAL, images['proposal']])
    audit = load(L / 'tools/pump_diagnostic_audit.py').audit(full['suites'])
    require(count == 10468 and audit == full['diagnostics'] and audit['log_bearing_cases'] == 10464 and not audit['mismatches'], 'broad diagnostics differ')
    strict = paired_log_audit(full['suites'])
    require(strict['log_bearing_cases'] == 10464 and not strict['mismatches'], 'strict ordered corpus logs differ')
    saved = doc(packet / 'runtime/strict-log-audit.json')
    require(all(saved[key] == value for key, value in strict.items()) and saved['source_report_sha256'] == sha((packet / 'runtime/full44.json.gz').read_bytes()) and saved['script_sha256'] == sha((packet / 'tools/strict_log_audit.py').read_bytes()), 'strict log producer/report binding differs')
    require(ext['case_count'] == len(ext['cases']) == 126 and not ext['mismatches'], 'extension corpus incomplete')
    require(all(case['match'] and all(case['original'][key] == case['candidate'][key] for key in ('error', 'accounts', 'inner_instructions', 'event_payloads', 'return_data')) for case in ext['cases']), 'extension semantic mismatch')
    check_loads(doc(packet / 'runtime/loaders/extensions.loader.json.gz')['loads'], loads, [ORIGINAL, images['proposal']])
    return dict(strict_ordered_log_cases=strict['log_bearing_cases'], **signature_audit([full, ext]))

def verify(packet=P):
    require(__debug__, 'Run without Python -O')
    seal = doc(packet / 'MANIFEST.json'); files = {path.relative_to(packet).as_posix(): path for path in packet.rglob('*') if path.is_file()}
    require(set(files) == set(seal) | {'MANIFEST.json'} and all(not files[name].is_symlink() and sha(files[name].read_bytes()) == digest for name, digest in seal.items()), 'packet file inventory/hash differs')
    base, staged = check_builds(packet); check_analysis(packet)
    check_focused(doc(packet / 'runtime/focused.json.gz'), packet)
    signatures = check_corpus(packet, base, staged)
    return dict(verified=True, partial_recovery=True, whole_function_equal=False, normalized=1019, raw=188, focused_triples=24, focused_executions=72, corpus_pairs=10468, extension_pairs=126, **signatures)

if __name__ == '__main__':
    print(json.dumps(verify(), sort_keys=True))
