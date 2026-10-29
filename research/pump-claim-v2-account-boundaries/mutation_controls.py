"""Exercise deep evidence checks after bypassing the packet's outer hash seal."""
from pathlib import Path
import ast
import base64
import copy
import gzip
import hashlib
import importlib.util
import io
import json
import shutil
import struct
import sys
import tarfile
import tempfile

sys.dont_write_bytecode = True
P = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('claim_verify', P / 'verify.py')
v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(v)


def rejects(name, check):
    try:
        check()
    except ValueError:
        return
    raise AssertionError('accepted changed ' + name)


def focused_mutation(name, change):
    report = copy.deepcopy(v.doc(P / 'runtime/focused.json.gz'))
    change(report)
    rejects(name, lambda: v.check_focused(report, P))


def error(report):
    report['cases'][0]['runs']['proposal']['error'] = 'changed-error'


def source_log(report):
    row = next(c for c in report['cases'] if c['case']['name'] == 'token_quote_owner_before_empty')
    logs = row['runs']['proposal']['logs']
    changed = [s.replace('claim_token_incentives.rs:310.', 'claim_token_incentives.rs:311.') for s in logs]
    assert changed != logs
    row['runs']['proposal']['logs'] = changed
    row['observations']['proposal']['metadata']['logs'] = changed


def account(report):
    row = report['cases'][0]
    accounts = row['runs']['proposal']['accounts']
    key = next(k for k, a in accounts.items() if a is not None and not a['executable'])
    accounts[key]['lamports'] += 1
    row['observations']['proposal']['after'][key]['lamports'] += 1


def loaded_image(report):
    report['cases'][0]['observations']['proposal']['actual_program_loads'][1]['sha256'] = '0' * 64


def declared_dependency(report):
    loads = report['cases'][0]['observations']['proposal']['declared_load_sha256']
    dependency = next(iter(report['dependency_captures']))
    loads[dependency] = '0' * 64


def captured_dependency(report):
    next(iter(report['dependency_captures'].values()))['capture_sha256'] = '0' * 64


def signature(report):
    from solders.transaction import Transaction
    row = report['cases'][0]
    raw = bytearray(base64.b64decode(row['runs']['original']['transaction_base64'], validate=True))
    raw[1] ^= 1  # One-signature compact length precedes the signature bytes.
    encoded = base64.b64encode(raw).decode()
    tx = Transaction.from_bytes(bytes(raw))
    assert bytes(tx) == bytes(raw) and not all(tx.verify_with_results())
    for label, run in row['runs'].items():
        run['transaction_base64'] = encoded
        obs = row['observations'][label]
        obs['transaction_base64'] = encoded
        obs['signature_verification'].update(signatures=[str(s) for s in tx.signatures],
            transaction_sha256=hashlib.sha256(raw).hexdigest())
        obs['metadata']['signature'] = str(tx.signatures[0])


def compiler_pin():
    base = v.authenticated_common(P)
    result = v.doc(P / 'builds/proposal-result.json.gz')
    result['tool_sha256']['rustc'] = '0' * 64
    rejects('compiler pin', lambda: base.check_toolchain(result, P.parent / 'pump-v3-buy-cost-overflow'))


def source_archive():
    with tempfile.TemporaryDirectory(prefix='claim-source-control-') as name:
        packet = Path(name)
        shutil.copytree(P / 'sources', packet / 'sources')
        shutil.copy2(P / 'source.patch', packet / 'source.patch')
        archive_path = packet / 'sources/primary.tar.gz'
        buf = io.BytesIO()
        with tarfile.open(fileobj=io.BytesIO(gzip.decompress(archive_path.read_bytes()))) as old:
            with tarfile.open(fileobj=buf, mode='w') as new:
                for i, member in enumerate(old.getmembers()):
                    data = old.extractfile(member).read()
                    if i == 0:
                        data += b'\n'
                    member.size = len(data)
                    new.addfile(member, io.BytesIO(data))
        archive_path.write_bytes(gzip.compress(buf.getvalue(), mtime=0))
        rejects('compiled source archive', lambda: v.check_sources(packet))


def static_operand():
    def change(value):
        if isinstance(value, dict):
            for key in ('offset', 'target'):
                if type(value.get(key)) is int:
                    value[key] += 8
                    return True
            return any(change(item) for item in value.values())
        return isinstance(value, list) and any(change(item) for item in value)
    with tempfile.TemporaryDirectory(prefix='claim-static-control-') as name:
        packet = Path(name) / 'packet'
        shutil.copytree(P, packet)
        comparison = v.doc(packet / 'comparison.json.gz')
        assert change(comparison), 'static report has no audited instruction operand'
        (packet / 'comparison.json.gz').write_bytes(gzip.compress(json.dumps(comparison).encode(), mtime=0))
        rejects('static instruction operand', lambda: v.check_analysis(packet))


def actual_elf_controls(analyze, packet):
    packet = Path(packet)
    positive = analyze(packet)
    api = {'struct': struct}
    path = packet.parents[1]/'research/pump-v3-buy-cost-overflow/tools/pump_quote_control_function_match.py'
    tree = ast.parse(path.read_bytes())
    nodes = [node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'sections']
    assert len(nodes) == 1
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(path), 'exec'), api)
    names = ['parent-candidate.so.gz', 'parent-unstripped.so.gz', 'proposal-candidate.so.gz', 'proposal-unstripped.so.gz']
    images = {name: gzip.decompress((packet/'artifacts'/name).read_bytes()) for name in names}
    base = positive['bodies']['proposal']['start']
    calls = positive['selected_calls']
    credit = calls['credit_balance']['proposal']['offset']
    borrow = calls['credit_borrow']['proposal']['offset']
    empty = positive['operand_checks']['proposal']['empty_branch']['offset']
    balance = calls['native_balance']['proposal']['offset']
    wrapper = positive['actual_entry_wrappers']['proposal']['wrapper']['start']
    empty_input = calls['token_empty']['proposal']['offset']-8
    borrow_input = positive['operand_checks']['proposal']['empty_branch']['next']

    def register(value, index, source):
        value[index+1] = (source << 4) | (value[index+1] & 15)

    def jump(value, index):
        struct.pack_into('<h', value, index+2, struct.unpack_from('<h', value, index+2)[0]+1)

    def vault_bases(value, index):
        register(value, index, 8)
        register(value, index+borrow_input-empty_input, 8)

    mutations = [
        ('overflow_edge', base+credit+64, jump, True),
        ('checked_add_operand', base+credit+24, lambda b, i: register(b, i, 2), True),
        ('credited_store_value', base+borrow+72, lambda b, i: register(b, i, 7), True),
        ('borrow_error_edge', base+borrow+56, jump, True),
        ('native_getter_field', base+balance-8, lambda b, i: struct.pack_into('<h', b, i+2, 0x40), True),
        ('empty_polarity', base+empty, lambda b, i: b.__setitem__(i, 0x15), True),
        ('actual_entry_edge', wrapper+0x1b8, lambda b, i: struct.pack_into('<i', b, i+4, struct.unpack_from('<i', b, i+4)[0]+1), True),
        ('stripped_section_only', base+credit+24, lambda b, i: register(b, i, 2), False),
        ('native_balance_wrong_base', base+balance-8, lambda b, i: register(b, i, 8), True),
        ('vault_inputs_wrong_base', base+empty_input, vault_bases, True),
        ('borrow_lease_output_field', base+borrow+8,
         lambda b, i: struct.pack_into('<h', b, i+2, struct.unpack_from('<h', b, i+2)[0]+8), True),
    ]
    results = []
    with tempfile.TemporaryDirectory(prefix='claim-v2-elf-controls-') as temporary:
        for name, address, mutate, both in mutations:
            directory = Path(temporary)/name
            (directory/'artifacts').mkdir(parents=True)
            for filename, image in images.items():
                value = bytearray(image)
                if filename == 'proposal-candidate.so.gz' or both and filename == 'proposal-unstripped.so.gz':
                    text = api['sections'](value)['.text']
                    mutate(value, address-text['addr']+text['offset'])
                (directory/'artifacts'/filename).write_bytes(gzip.compress(value, compresslevel=1, mtime=0))
            try:
                analyze(directory)
            except ValueError as error:
                results.append(dict(name=name, rejected=True, reason=str(error), both_proposal_elfs_mutated=both))
            else:
                raise AssertionError('Actual ELF mutation was accepted: '+name)
    return results


def corpus_source_log():
    report = v.doc(P / "runtime/full44.json.gz")
    def change(value):
        if isinstance(value, dict):
            if isinstance(value.get("original"), dict) and isinstance(value.get("candidate"), dict):
                for key, item in value["candidate"].items():
                    if "log" in key.lower() and isinstance(item, list):
                        for index, line in enumerate(item):
                            if isinstance(line, str) and ".rs:" in line:
                                item[index] = line.replace(".rs:", ".rs:1", 1)
                                return True
            return any(change(item) for key, item in value.items() if key not in ("original", "candidate"))
        return isinstance(value, list) and any(change(item) for item in value)
    assert change(report["suites"]), "no actual Source diagnostic found"
    audit = v.paired_log_audit(report["suites"])
    assert audit["log_bearing_cases"] == 10464 and audit["mismatches"], "accepted broad Source-coordinate mutation"


def main():
    v.verify()
    mutations = [('error', error), ('ordered Source log', source_log), ('account state', account),
                 ('actual loaded image', loaded_image), ('declared dependency', declared_dependency),
                 ('captured dependency', captured_dependency), ('signature', signature)]
    for name, change in mutations:
        focused_mutation(name, change)
    compiler_pin()
    source_archive()
    static_operand()
    corpus_source_log()
    results = actual_elf_controls(v.load(P / 'analyze.py').analyze, P)
    assert len(results) == 11 and all(item['rejected'] for item in results)
    print('Positive packet verified; 22 deep evidence controls rejected.')


if __name__ == '__main__':
    main()
