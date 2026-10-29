"""Bounded in-memory proof negatives; no VM/compiler/network execution."""
import argparse
import base64
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
from solders.transaction import Transaction

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('notice_account_audit', HERE / 'audit_witness.py')
A = importlib.util.module_from_spec(spec)
spec.loader.exec_module(A)
A.need(A.sha(A.GAP.read_bytes()) == A.GAP_SHA and A.sha(A.FIX.read_bytes()) == A.FIX_SHA, 'frozen input report hashes')
gap, fixed = A.read(A.GAP), A.read(A.FIX)
A.verify(gap, gap, False)
A.verify(fixed, gap, True)

def signature(report):
    for label, run in report['runs'].items():
        raw = bytearray(base64.b64decode(run['transaction_base64']))
        raw[1] ^= 1
        wire = base64.b64encode(raw).decode()
        run['transaction_base64'] = wire
        report['observations'][label]['wire'] = wire
        report['observations'][label]['wire_sha256'] = A.sha(raw)

def wrong_image(report):
    report['observations']['notice_fix']['loader'][0] = copy.deepcopy(report['observations']['original']['loader'][0])

def owner(report):
    key = report['case']['current']
    for obs in report['observations'].values():
        obs['before'][key]['owner'] = '11111111111111111111111111111111'
        obs['current_creator_before']['owner'] = '11111111111111111111111111111111'

def program_bytes(report):
    key = report['case']['current']
    for obs in report['observations'].values():
        raw = bytearray(base64.b64decode(obs['before'][key]['data_base64']))
        raw[16] ^= 1
        for target in (obs['before'][key], obs['current_creator_before']):
            target['data_base64'] = base64.b64encode(raw).decode()
            target['data_sha256'] = A.sha(raw)

def programdata(report):
    report['observations']['notice_fix']['loader'][0]['programdata_sha256'] = '0' * 64

def order(report):
    logs = report['runs']['notice_fix']['logs']
    logs.remove(A.NOTICE)
    logs.insert(logs.index('Program log: Instruction: AdminCtoPool') + 1, A.NOTICE)
    report['program_messages']['notice_fix'] = [x for x in logs if x.startswith('Program log: ')]

def prestate(report):
    for label, run in report['runs'].items():
        tx = Transaction.from_bytes(base64.b64decode(run['transaction_base64']))
        payer = str(tx.message.account_keys[0])
        obs = report['observations'][label]
        obs['before'][payer]['lamports'] += 1
        obs['payer_before']['lamports'] += 1
        run['before']['transaction_payer']['lamports'] += 1

controls = [
    ('all-image invalid signatures with coherent wire hashes', signature, 'cryptographic signed wire'),
    ('valid original loader substituted for fixed image', wrong_image, 'captured main selected-image association'),
    ('creator owner changed coherently in all image records', owner, 'authentic existing Fees program creator'),
    ('creator ELF changed with recomputed account hashes', program_bytes, 'authentic existing Fees program creator'),
    ('literal captured ProgramData hash corrupted', programdata, 'literal captured ProgramData derivation'),
    ('fixed notice moved after AdminCtoPool', order, 'fixed exact ordered notice parity'),
    ('coherent all-image payer prestate alteration', prestate, 'frozen witness prestate'),
]
results = []
for name, mutate, expected in controls:
    changed = copy.deepcopy(fixed)
    mutate(changed)
    try:
        A.verify(changed, gap, True)
    except ValueError as error:
        A.need(expected in str(error), 'wrong rejection boundary for ' + name + ': ' + str(error))
        results.append({'case': name, 'rejected': True, 'reason': str(error)})
    else:
        raise RuntimeError('Accepted altered proof: ' + name)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', type=Path, default=HERE / 'integrity-controls.json')
    args = parser.parse_args()
    A.need(args.report.resolve().is_relative_to(HERE.resolve()), 'owned scratch output only')
    report = {'status': 'PASS', 'python_optimized': not __debug__,
              'source_sha256': A.sha(Path(__file__).read_bytes()),
              'verifier_sha256': A.sha((HERE / 'audit_witness.py').read_bytes()),
              'clean_gap_and_fixed_baselines': 'PASS', 'controls': results,
              'scope': 'Seven deep-copy proof mutations exercise data checks beyond checksums; original report/producer/account files remain unchanged',
              'new_VM_or_compiler_execution': False}
    args.report.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({'status': 'PASS', 'controls': len(results), 'python_optimized': not __debug__}))
