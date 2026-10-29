"""Signed offline claim_cashback_v2 observations through the captured loader.

Only the listed synthetic cases are established. A malformed case can fail
generated account parsing before reaching the recovered handler.
"""
from pathlib import Path
import argparse, base64, gzip, hashlib, json, re, sys
if not __debug__:
    raise RuntimeError('Run without Python -O: observation checks require assertions')
sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts'))
import pump_captured_loader as loader
loader.install()
import pump_cashback_differential as fixture
from solders.transaction import Transaction
from solders.rent import Rent

sha = lambda value: hashlib.sha256(value).hexdigest()
UNITS = re.compile(r'^Program [1-9A-HJ-NP-Za-km-z]+ consumed [0-9]+ of [0-9]+ compute units$')
SENDS = []
BaseVM = fixture.f.LiteSVM

def snapshot(account):
    if account is None:
        return None
    return dict(lamports=account.lamports, owner=str(account.owner),
                data=None if account.executable else base64.b64encode(account.data).decode(),
                executable=account.executable)

def verify_transaction(encoded):
    tx = Transaction.from_bytes(base64.b64decode(encoded, validate=True))
    tx.verify()
    results = tx.verify_with_results()
    assert results and all(results)
    assert tx.message.header.num_required_signatures == 1
    assert tx.message.account_keys[0] == fixture.PAYER.pubkey()
    return dict(signature_count=len(results), signatures=[str(x) for x in tx.signatures],
                transaction_sha256=sha(bytes(tx)), all_verified=True)

class ObservedVM(BaseVM):
    def add_program_from_file(self, program, path):
        path = Path(path).resolve(); raw = path.read_bytes()
        answer = super().add_program_from_file(program, path)
        assert raw == path.read_bytes(), 'Program changed while loading'
        if not hasattr(self, 'observed_loads'):
            self.observed_loads = []
        self.observed_loads.append(dict(program=str(program), path=str(path), sha256=sha(raw), bytes=len(raw)))
        return answer
    def send_transaction(self, tx):
        encoded = base64.b64encode(bytes(tx)).decode()
        verification = verify_transaction(encoded)
        keys = list(tx.message.account_keys)
        before = {str(key): snapshot(self.get_account(key)) for key in keys}
        result = super().send_transaction(tx)
        failed = isinstance(result, fixture.f.FailedTransactionMetadata)
        metadata = result.meta() if failed else result
        SENDS.append(dict(transaction_base64=encoded, signature_verification=verification,
                          before=before, after={str(key): snapshot(self.get_account(key)) for key in keys},
                          metadata=json.loads(metadata.to_json()), captured_loader_loads=list(loader.LOADS),
                          actual_program_loads=list(self.observed_loads)))
        return result

fixture.f.LiteSVM = ObservedVM

def cases():
    n = dict(v2=True); t = dict(v2=True, token_quote=True); tt = dict(t, token22=True)
    rent = Rent.default().minimum_balance(106); maximum = 2**64-1
    specs = [
        ('native_positive', n, {}),
        ('native_at_rent_zero', n, dict(lamports=rent)),
        ('native_rent_plus_one', n, dict(lamports=rent+1)),
        ('native_below_rent', n, dict(lamports=100)),
        ('native_counter_overflow', n, dict(claimed=maximum)),
        ('native_payment_before_counter', n, dict(claimed=maximum, mutations={'user': {'lamports': maximum}})),
        ('token_positive', t, {}),
        ('token_zero', t, dict(token_balance=0)),
        ('token_empty_data', t, dict(mutations={'associated_user_volume_accumulator': {'length': 0}})),
        ('token_short_data', t, dict(mutations={'associated_user_volume_accumulator': {'length': 164}})),
        ('token_quote_owner_before_empty', t, dict(mutations={'quote_mint': {'system_owner': True}, 'associated_user_volume_accumulator': {'length': 0}})),
        ('token_quote_owner_positive', t, dict(mutations={'quote_mint': {'system_owner': True}})),
        ('token_recipient_owner_positive', t, dict(mutations={'associated_quote_user': {'system_owner': True}})),
        ('token_zero_skips_recipient_owner', t, dict(token_balance=0, mutations={'associated_quote_user': {'system_owner': True}})),
        ('token_recipient_authority', t, dict(mutations={'associated_quote_user': {'bytes': [[32, 99]]}})),
        ('token_counter_overflow', t, dict(stable_claimed=maximum)),
        ('token_payment_before_counter', t, dict(stable_claimed=maximum, mutations={'associated_quote_user': {'u64': [[64, maximum]]}})),
        ('token2022_positive', tt, {}),
        ('token2022_zero', tt, dict(token_balance=0)),
        ('token2022_empty_data', tt, dict(mutations={'associated_user_volume_accumulator': {'length': 0}})),
        ('token2022_short_data', tt, dict(mutations={'associated_user_volume_accumulator': {'length': 164}})),
        ('token2022_fee_100bps', tt, dict(transfer_fee_bps=100)),
        ('token2022_fee_10000bps', tt, dict(transfer_fee_bps=10000)),
        ('token2022_counter_overflow', tt, dict(stable_claimed=maximum)),
    ]
    return [dict(mode, **extra, name=name) for name, mode, extra in specs]

def dependencies():
    result = {}
    for name in ['spl_token', 'spl_token_2022', 'associated_token']:
        capture_path = ROOT / f'evidence/dependencies/{name}/capture.json'
        capture = json.loads(capture_path.read_bytes())
        digest = sha((ROOT/f'evidence/dependencies/{name}/deployed.so').read_bytes())
        assert digest == capture['payload_sha256'], name
        result[capture['program']] = dict(name=name, payload_sha256=digest, capture_sha256=sha(capture_path.read_bytes()))
    return result

def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--parent', type=Path, required=True); p.add_argument('--proposal', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True); a = p.parse_args()
    images = dict(original=ROOT/'evidence/original/pump/deployed.so', parent=a.parent.resolve(), proposal=a.proposal.resolve())
    hashes = {name: sha(path.read_bytes()) for name, path in images.items()}
    assert hashes['original'] == loader.CAPTURE['payload_sha256']
    deps = dependencies(); rows = []
    report = dict(scope=__doc__, images_sha256=hashes, dependency_captures=deps,
                  producer_sha256=sha(Path(__file__).read_bytes()), fixture_sha256=sha(Path(fixture.__file__).read_bytes()),
                  bootstrap_fixture_sha256=sha(Path(fixture.f.__file__).read_bytes()), loader_sha256=sha(Path(loader.__file__).read_bytes()),
                  excluded_log_pattern=UNITS.pattern, cases=rows)
    fields = ['error', 'accounts', 'events', 'inner', 'return_data', 'transaction_base64']
    for case in cases():
        runs = {}; observations = {}
        for name, path in images.items():
            expected = {pid: entry['payload_sha256'] for pid, entry in deps.items()}; expected[str(loader.PROGRAM)] = hashes[name]
            SENDS.clear(); loader.LOADS.clear(); runs[name] = fixture.run(case, path)
            assert len(SENDS) == 1 and len(loader.LOADS) == 1
            obs = SENDS[0]; observations[name] = obs; obs['declared_load_sha256'] = expected
            actual = obs['actual_program_loads']
            assert len(actual) == 4 and len({x['program'] for x in actual}) == 4
            assert {x['program']: x['sha256'] for x in actual} == expected
            assert obs['transaction_base64'] == runs[name]['transaction_base64']
            assert loader.LOADS[0]['elf_sha256'] == hashes[name]
            assert loader.LOADS[0]['elf_prefix_unchanged'] and loader.LOADS[0]['zero_allocation_tail']
        differences = {}
        for name in ['parent', 'proposal']:
            diff = [k for k in fields if runs['original'][k] != runs[name][k]]
            diff += [k for k in ['before', 'after'] if observations['original'][k] != observations[name][k]]
            logs = lambda key: [line for line in runs[key]['logs'] if not UNITS.fullmatch(line)]
            if logs('original') != logs(name): diff.append('ordered_logs')
            differences[name] = diff
        rows.append(dict(case=case, runs=runs, observations=observations,
                         parent_differences=differences['parent'], proposal_differences=differences['proposal']))
        report.update(case_count=len(rows), execution_count=len(rows)*3)
        a.output.parent.mkdir(parents=True, exist_ok=True)
        a.output.write_bytes(gzip.compress(json.dumps(report, separators=(',', ':')).encode(), mtime=0))
        print(json.dumps(dict(case=case['name'], errors={name: run['error'] for name, run in runs.items()}, differences=differences)), flush=True)
    assert all(not row['proposal_differences'] for row in rows), 'Original/proposal mismatch; raw report retained'

if __name__ == '__main__': main()
