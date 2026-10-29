"""Bounded in-memory proof negatives; no VM/compiler/network execution."""
if not __debug__: raise SystemExit('Optimized Python is unsupported; run without -O.')
import argparse
import base64
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
from solders.transaction import Transaction

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('notice_account_audit', HERE / 'verify_notice.py')
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

# Isolated proof-copy controls also exercise source/build bindings; no compiler,
# target program, canonical input or retained receipt is modified.
import io
import shutil
import tarfile
import tempfile
spec = importlib.util.spec_from_file_location('notice_source_build_audit', HERE / 'verify.py')
V = importlib.util.module_from_spec(spec)
spec.loader.exec_module(V)
V.source_and_builds()
work = V.R / 'work/pump-program-creator-notice-integrity-controls-20261028'
work.mkdir(parents=True, exist_ok=True)
for case in ('source65 drift', 'actual compiled archive graft with repinned map', 'literal ELF drift', 'false cold-empty claim'):
    with tempfile.TemporaryDirectory(prefix='proof-', dir=work) as folder:
        trial=Path(folder)
        for name in ('source','tools','artifacts','builds'):
            shutil.copytree(HERE/name,trial/name,ignore=lambda directory,names: {'source','profile-sdk'} if Path(directory)==HERE/'builds/cold-01' else set())
        for name in ('SOURCE65.json','build-inputs.json','source.patch','build.py'):
            shutil.copy2(HERE/name,trial/name)
        if case=='source65 drift':
            path=trial/'source/src/creator/admin_cto.rs';path.write_bytes(path.read_bytes()+b'\n');expected='frozen source65'
        elif case=='literal ELF drift':
            path=trial/'artifacts/candidate.so';data=bytearray(path.read_bytes());data[24]^=1;path.write_bytes(data);expected='public artifact equality'
        elif case=='actual compiled archive graft with repinned map':
            path=trial/'builds/primary/compiled-workspace.tar.gz'
            with tarfile.open(path) as archive:files={m.name:archive.extractfile(m).read() for m in archive if m.isfile()}
            files['programs/pump/src/creator/admin_cto.rs']+=b'\n'
            with tarfile.open(path,'w:gz') as archive:
                for name,data in sorted(files.items()):
                    info=tarfile.TarInfo(name);info.size=len(data);archive.addfile(info,io.BytesIO(data))
            path.with_name('compiled-workspace-sha256.json').write_text(json.dumps({n:A.sha(b) for n,b in files.items()}))
            expected='retained actual compiled archive/source transform'
        else:
            for name in ('build-attempt.json','build-comparison.json'):
                path=trial/'builds/cold-01'/name;record=json.loads(path.read_text());record['cold_empty_target']=False;path.write_text(json.dumps(record))
            expected='genuine cold build'
        V.P=trial
        try:
            V.source_and_builds()
        except ValueError as error:
            A.need(expected in str(error),'wrong source/build rejection boundary '+case+': '+str(error))
            results.append(dict(case=case,rejected=True,reason=str(error)))
        else:
            raise RuntimeError('Accepted altered source/build proof '+case)
        finally:
            V.P=HERE

if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--report',type=Path)
    args=parser.parse_args()
    report=dict(status='PASS',python_optimized=False,controls=results,
        clean_notice_and_source_build_baselines='PASS',new_VM_or_compiler_execution=False,
        scope='Seven in-memory witness negatives plus four isolated source/build proof-copy negatives. Actual producers/raw/source/ELF/receipts remain unchanged.',
        source_sha256=A.sha(Path(__file__).read_bytes()),verifier_sha256=A.sha((HERE/'verify_notice.py').read_bytes()))
    if args.report:
        A.need(not args.report.resolve().is_relative_to(HERE),'write control report outside packet')
        args.report.parent.mkdir(parents=True,exist_ok=True)
        args.report.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(dict(status='PASS',controls=len(results),python_optimized=False)))
