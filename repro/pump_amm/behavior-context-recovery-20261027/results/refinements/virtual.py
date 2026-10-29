"""Synthetic signed Pool fee/virtual-reserve ordering collisions."""
from pathlib import Path
import argparse, gzip, hashlib, importlib.util, json, struct, sys
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
import pump_amm_liquidity_differential as h
from solders.litesvm import LiteSVM
spec = importlib.util.spec_from_file_location('direct', ROOT / 'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py')
direct = importlib.util.module_from_spec(spec); spec.loader.exec_module(direct)
U64 = 2**64 - 1
MAX = 2**127 - 1
actual_send = LiteSVM.send_transaction
receipts = []

def snapshot(vm, keys):
    result = {}
    for key in sorted(set(keys), key=str):
        account = vm.get_account(key)
        if account is not None and account.executable: continue
        result[str(key)] = None if account is None else {'owner': str(account.owner), 'lamports': account.lamports, 'data': bytes(account.data).hex()}
    return result

def send(vm, tx):
    assert all(tx.verify_with_results())
    raw = bytes(tx); before = snapshot(vm, tx.message.account_keys)
    result = actual_send(vm, tx)
    assert raw == bytes(tx)
    receipts.append({'tx_sha256': hashlib.sha256(raw).hexdigest(), 'before': before, 'after': snapshot(vm, tx.message.account_keys)})
    return result
LiteSVM.send_transaction = send

def mutate(protocol, creator, name, risk):
    def apply(vm, metas):
        h.mutate(h.pool, 271, struct.pack('<QQ', protocol, creator))(vm, metas)
        if risk == 'frozen-quote': h.mutate(h.userquote if name == 'deposit' else h.vaultquote, 108, b'\x02')(vm, metas)
    return apply

def main():
    p = argparse.ArgumentParser(); p.add_argument('--candidate', type=Path, required=True); p.add_argument('--output', type=Path, required=True)
    args = p.parse_args(); assert not args.output.exists(); rows = []
    configs = [(0, 0, 0), (-1, 0, 0), (MAX, 0, 0), (MAX, 1, 0), (MAX, 0, 1), (MAX-1, 1, 0), (-2**127, U64, 0), (0, U64, 1), (1, U64, 0), (0, 1, U64)]
    for name in ['deposit', 'withdraw']:
        for virtual, protocol, creator in configs:
            for risk in ['ordinary', 'frozen-quote', 'impossible-base']:
                limit = (0 if name == 'deposit' else U64) if risk == 'impossible-base' else (U64 if name == 'deposit' else 0)
                values = []; recorded = []
                for binary in [ROOT / 'evidence/original/pump_amm/deployed.so', args.candidate]:
                    values.append(h.run(name, 1000, maxbase=limit, maxquote=U64 if name == 'deposit' else 0, virtual=virtual, overrides=mutate(protocol, creator, name, risk), candidate=binary))
                    recorded.append(receipts[-1])
                assert recorded[0]['tx_sha256'] == recorded[1]['tx_sha256'] and recorded[0]['before'] == recorded[1]['before']
                left, right = map(direct.clean, values); diff = [k for k in left if left[k] != right.get(k)]
                if recorded[0]['after'] != recorded[1]['after']: diff.append('full_account_snapshot')
                rows.append({'case': {'instruction': name, 'virtual': virtual, 'protocol': protocol, 'creator': creator, 'risk': risk, 'synthetic': True}, 'original': values[0], 'candidate': values[1], 'original_receipt': recorded[0], 'candidate_receipt': recorded[1], 'mismatched_fields': diff})
    sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
    report = {'scope': __doc__, 'producer_sha256': sha(Path(__file__)), 'original_sha256': sha(ROOT / 'evidence/original/pump_amm/deployed.so'), 'candidate_sha256': sha(args.candidate), 'case_count': len(rows), 'mismatch_count': sum(bool(x['mismatched_fields']) for x in rows), 'cases': rows}
    args.output.write_bytes(gzip.compress((json.dumps(report,separators=(',',':'))+'\n').encode(),mtime=0))
    print(json.dumps({'cases':len(rows),'mismatches':report['mismatch_count'],'differences':[{'case':r['case'],'fields':r['mismatched_fields']}for r in rows if r['mismatched_fields']]},indent=2))
if __name__ == '__main__': main()
