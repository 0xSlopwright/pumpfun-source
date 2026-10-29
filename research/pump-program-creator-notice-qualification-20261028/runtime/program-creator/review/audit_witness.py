"""Read-only independent account/wire/loader audit; never construct a VM."""
import base64
import copy
import gzip
import hashlib
import json
from pathlib import Path
import re
import struct
from solders.pubkey import Pubkey
from solders.transaction import Transaction

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).resolve().parent
GAP = ROOT / 'work/pump-cto21-call-followup-20261028/program-creator-witness.json.gz'
FIX = ROOT / 'work/pump-cto-program-notice-fix-20261028/program-creator-witness.json.gz'
GAP_SHA = '871398063adb495f40b494f5fc14d1ab6fc2e4f6ddb94566d3e2262b84762203'
FIX_SHA = '40633f1873fbba5cb89e0630ab973207690755031aceeec064e94a0936ee2992'
NOTICE = 'Program log: Creator is a program; fees left in the vaults'
CU = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
sha = lambda b: hashlib.sha256(b).hexdigest()

def need(value, message):
    if not value:
        raise ValueError(message)

def read(path):
    return json.loads(gzip.decompress(path.read_bytes()))

def clean(logs):
    return [line for line in logs if not CU.fullmatch(line)]

def account_bytes(row):
    data = base64.b64decode(row['data_base64'], validate=True)
    need(len(data) == row['data_bytes'] and sha(data) == row['data_sha256'], 'raw account bytes/hash')
    return data

def verify(report, reference, fixed):
    labels = ['original', 'current_C0', 'notice_fix' if fixed else 'trial21']
    need(set(report['runs']) == set(report['observations']) == set(report['images']) == set(labels), 'exact three image labels')
    need(report['case'] == reference['case'] and report['reachable_mainnet_claim'] is False, 'same bounded synthetic case')
    for name, digest in report['input_sha256'].items():
        need(sha(Path(name).read_bytes()) == digest, 'actual retained producer/input bytes')
    capture = json.loads((ROOT / 'evidence/original/pump/capture.json').read_text())
    program = capture['program']
    program_bytes = (ROOT / 'evidence/original/pump/program-account.bin').read_bytes()
    pd_capture = (ROOT / 'evidence/original/pump/programdata-account.bin').read_bytes()
    header = pd_capture[:45]
    need(sha(program_bytes) == capture['program_sha256'] and sha(pd_capture) == capture['programdata_sha256'], 'authentic captured main accounts')
    need(program_bytes[4:] == bytes(Pubkey.from_string(capture['programdata'])), 'captured ProgramData address')
    idl = json.loads((ROOT / 'evidence/upstream/pump.json').read_text())
    definition = next(x for x in idl['instructions'] if x['name'] == 'admin_cto')
    fees = (ROOT / 'evidence/original/pump_fees/deployed.so').read_bytes()
    need(len(fees) == 948944 and fees[:4] == b'\x7fELF', 'authentic Fees executable ELF')
    creator = report['case']['current']
    wires = set()
    signatures = metadata_fields = 0
    original = report['runs']['original']
    for label in labels:
        run, obs = report['runs'][label], report['observations'][label]
        raw = base64.b64decode(run['transaction_base64'], validate=True)
        tx = Transaction.from_bytes(raw)
        checks = tx.verify_with_results()
        need(bytes(tx) == raw and len(checks) == 2 and all(checks), 'cryptographic signed wire')
        need(obs['wire'] == run['transaction_base64'] and obs['wire_sha256'] == sha(raw), 'raw signed wire association')
        need(obs['signature_fields'] == len(checks) and obs['signatures_verified'] == checks, 'raw signature fields')
        signatures += len(checks)
        wires.add(raw)
        signer_keys = [str(k) for k in tx.message.account_keys[:tx.message.header.num_required_signatures]]
        need(creator not in signer_keys and signer_keys[0] != creator, 'creator distinct from transaction signers/payer')
        main_ix, = [x for x in tx.message.instructions if str(tx.message.account_keys[x.program_id_index]) == program]
        need(bytes(main_ix.data[:8]) == bytes(definition['discriminator']), 'actual AdminCto instruction')
        names = {a['name']: str(tx.message.account_keys[i]) for a, i in zip(definition['accounts'], main_ix.accounts)}
        need(len(main_ix.accounts) == len(definition['accounts']) and names['current_creator'] == creator, 'actual creator account association')
        need(names['admin_set_creator_authority'] in signer_keys and names['pool_authority'] not in signer_keys, 'ordinary admin and pool PDA signer roles')
        need(set(obs['before']) == set(str(k) for k in tx.message.account_keys) == set(obs['after']), 'complete message-account snapshots')
        for snapshots in (obs['before'], obs['after']):
            for value in snapshots.values():
                if value is not None:
                    account_bytes(value)
                    metadata_fields += 6
        creator_row = obs['before'][creator]
        need(creator_row == obs['current_creator_before'] and creator_row['executable'] is True and creator_row['owner'] == 'BPFLoader2111111111111111111111111111111111' and account_bytes(creator_row) == fees, 'authentic existing Fees program creator')
        payer = str(tx.message.account_keys[0])
        need(obs['payer_before'] == obs['before'][payer] and obs['payer_before']['executable'] is False, 'ordinary nonexecutable payer')
        for phase in ('before', 'after'):
            values = obs[phase]
            snapshot = {}
            for name, key in {**names, 'transaction_payer': payer}.items():
                value = values[key]
                if value is not None and value['executable']:
                    continue
                snapshot[name] = None if value is None else {'lamports': value['lamports'], 'owner': value['owner'], 'data': account_bytes(value).hex()}
            need(snapshot == run[phase], 'derived structured account snapshot')
            main = values[program]
            need(main['executable'] is True and main['owner'] == capture['owner'] and account_bytes(main) == program_bytes, 'actual captured main program account')
        need(obs['before'] == reference['observations']['original']['before'], 'frozen witness prestate')
        curve = account_bytes(obs['before'][names['bonding_curve']])
        mint = Pubkey.from_string(names['mint'])
        expected_curve, _ = Pubkey.find_program_address([b'bonding-curve', bytes(mint)], Pubkey.from_string(program))
        need(str(expected_curve) == names['bonding_curve'] and curve[49:81] == bytes(Pubkey.from_string(creator)), 'curve creator and PDA fixture')
        global_bytes = account_bytes(obs['before'][names['global']])
        need(global_bytes[418:450] == bytes(Pubkey.from_string(names['admin_set_creator_authority'])), 'ordinary global admin authority')
        calls = obs['actual_add_program_calls']
        need(len(calls) == 6 and len({x['program'] for x in calls}) == 6, 'six actual program installation records')
        for call in calls:
            need(sha(Path(call['input_path']).read_bytes()) == call['input_sha256'], 'actual installed dependency bytes')
        main_call, = [x for x in calls if x['program'] == program]
        need(main_call['input_sha256'] == report['images'][label], 'selected actual main installation')
        image = Path(main_call['input_path']).read_bytes()
        load, = obs['loader']
        need(load['elf_sha256'] == report['images'][label] == sha(image), 'captured main selected-image association')
        derived_pd = header + image + bytes(capture['payload_bytes'] - len(image))
        expected = {'elf_bytes': len(image), 'program_owner': capture['owner'], 'program_bytes': len(program_bytes), 'program_sha256': sha(program_bytes), 'programdata_bytes': len(derived_pd), 'programdata_sha256': sha(derived_pd), 'header_sha256': sha(header), 'elf_prefix_unchanged': True, 'zero_allocation_tail': True}
        need(all(load[k] == value for k, value in expected.items()) and load['slot'] > struct.unpack_from('<Q', header, 4)[0], 'literal captured ProgramData derivation')
        need(run['error'] is None and all(run[k] == original[k] for k in ('error', 'before', 'after', 'events', 'inner', 'return')), 'success and structured state/event/return parity')
        need(run['events'] == [x for x in run['logs'] if x.startswith('Program data:')], 'actual event log records')
        need(obs['after'] == report['observations']['original']['after'], 'raw poststate parity')
        need(report['program_messages'][label] == [x for x in run['logs'] if x.startswith('Program log: ')], 'actual ordered program messages')
    need(original['logs'].count(NOTICE) == 1 and original['logs'].index(NOTICE) < original['logs'].index('Program log: Instruction: AdminCtoPool'), 'known original notice and order')
    missing = [x for x in clean(original['logs']) if x != NOTICE]
    need(clean(report['runs']['current_C0']['logs']) == missing, 'C0 exact single missing notice')
    third = report['runs'][labels[-1]]
    need(clean(third['logs']) == (clean(original['logs']) if fixed else missing), 'fixed exact ordered notice parity' if fixed else 'trial same single missing notice')
    need(clean(original['logs']) == clean(reference['runs']['original']['logs']), 'frozen original ordered logs')
    need(clean(report['runs']['current_C0']['logs']) == clean(reference['runs']['current_C0']['logs']), 'frozen C0 ordered logs')
    need(len(wires) == 1 and signatures == 6 and len(labels) == 3, 'actual finite execution/signature scope')
    return {'status': 'PASS', 'fixed_image': fixed, 'cases': 1, 'signed_executions': 3, 'signature_fields': signatures, 'distinct_signed_wires': len(wires), 'actual_captured_main_loads': 3, 'creator_data_bytes': len(fees), 'creator_owner': 'BPFLoader2111111111111111111111111111111111', 'notice_utf8_bytes_without_runtime_prefix': len(NOTICE.removeprefix('Program log: ').encode()), 'metadata_fields_checked': metadata_fields, 'full_ordered_log_exclusion': CU.pattern, 'observed_change': 'Restores exactly one original program notice before AdminCtoPool' if fixed else 'C0 and trial omit exactly one original program notice', 'all_other_structured_and_raw_account_fields_equal': True, 'mainnet_reachability_claim': False, 'new_compiler_or_VM_execution_by_auditor': False}

if __name__ == '__main__':
    need(sha(GAP.read_bytes()) == GAP_SHA and sha(FIX.read_bytes()) == FIX_SHA, 'actual immutable witness files')
    gap, fixed = read(GAP), read(FIX)
    reports = {'gap': verify(gap, gap, False), 'fixed': verify(fixed, gap, True)}
    (OUT / 'witness-audit-results.json').write_text(json.dumps(reports, indent=2) + '\n')
    print(json.dumps(reports, indent=2))
