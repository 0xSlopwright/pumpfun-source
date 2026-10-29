"""Signed deposit arithmetic, slippage and quote-transfer-fee precedence cases."""
from pathlib import Path
import argparse, hashlib, importlib.util, json, sys

ROOT = next(p for p in Path(__file__).resolve().parents if (p/'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0, str(ROOT/'scripts'))
import pump_amm_liquidity_differential as h
spec = importlib.util.spec_from_file_location('deposit_direct', ROOT/'repro/pump_amm/diagnostic-parity-20261027/compare_direct.py')
direct = importlib.util.module_from_spec(spec); spec.loader.exec_module(direct)
MAX = (1 << 64)-1


def mutate(case):
    def apply(vm, metas):
        for field, key, offset in [('base_reserve', h.vaultbase, 64), ('quote_reserve', h.vaultquote, 64), ('supply', h.pool, 203)]:
            if field in case: h.mutate(key, offset, case[field].to_bytes(8, 'little'))(vm, metas)
        if 'supply' in case: h.mutate(h.lp, 36, case['supply'].to_bytes(8, 'little'))(vm, metas)
        if 'bps' in case: h.transferfee(h.quote, case['bps'], case.get('maximum_fee', MAX))(vm, metas)
        if case.get('frozen_quote'): h.mutate(h.userquote, 108, bytes([2]))(vm, metas)
    return apply


def cases():
    fees = [dict(), dict(bps=123, maximum_fee=1), dict(bps=10001), dict(bps=65535),
            dict(bps=10000), dict(bps=65535, maximum_fee=0), dict(frozen_quote=True),
            dict(base_reserve=0, quote_reserve=MAX, supply=1, amount=2)]
    for i, case in enumerate(fees):
        for limit in [0, MAX]: yield dict(case, label=f'precedence-{i}-base-limit-{limit}', maxbase=limit)
    for supply in [0, 1]:
        for base, quote in [(0, 0), (0, 1), (1, 0), (1, 1)]:
            for amount in [0, 1, 2]:
                yield dict(label=f'reserves-{base}-{quote}-supply-{supply}-amount-{amount}',
                           supply=supply, base_reserve=base, quote_reserve=quote, amount=amount)
    for amount in [0, 1, 2, MAX]:
        yield dict(label=f'normal-supply-amount-{amount}', amount=amount)


def main():
    p=argparse.ArgumentParser(); p.add_argument('--candidate', type=Path, required=True); p.add_argument('--output', type=Path, required=True); a=p.parse_args()
    assert not a.output.exists(); rows=[]
    for case in cases():
        args=dict(name='deposit', amount=case.get('amount',1000), maxbase=case.get('maxbase',MAX), maxquote=MAX, overrides=mutate(case))
        x=h.run(**args); y=h.run(candidate=a.candidate, **args)
        left,right=direct.clean(x),direct.clean(y); diffs=[k for k in left if left[k]!=right.get(k)]
        rows.append(dict(case=case, original=x, candidate=y, mismatched_fields=diffs))
    sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
    report=dict(scope=__doc__, original_sha256=sha(ROOT/'evidence/original/pump_amm/deployed.so'), candidate_sha256=sha(a.candidate), probe_sha256=sha(Path(__file__)), cases=rows, case_count=len(rows), mismatch_count=sum(bool(r['mismatched_fields'])for r in rows))
    a.output.write_text(json.dumps(report,separators=(',',':'))+'\n')
    print(json.dumps({k:report[k] for k in ['case_count','mismatch_count']}))
    for row in rows:
        if row['mismatched_fields']: print(row['case']['label'],row['original']['error'],row['candidate']['error'],row['mismatched_fields'])


if __name__ == '__main__': main()
