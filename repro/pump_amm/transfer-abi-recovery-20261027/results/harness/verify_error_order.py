"""Authenticate saved before/after error-order probes, including all diagnostics."""
from pathlib import Path
import hashlib, importlib.util, json

HERE = Path(__file__).resolve().parent
def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result

def audit(directory, candidate):
    route = module('error_order_routes', HERE / 'verify_routes.py')
    extra = module('error_order_extra', HERE / 'verify_supplemental.py')
    direct = module('error_order_direct', HERE / 'compare_direct_cached.py')
    baseline = directory / 'error-order-baselines/candidate.so'
    assert route.sha(baseline) == 'e3ba703309eef943852f7e05f39ff6ac5110184d7cc257f056ef69603bcb28e8'
    specs = [('legacy-edges', 'probe_legacy_edges.py', 365, 10, True), ('legacy-rounding', 'probe_legacy_rounding.py', 720, 0, True), ('legacy-collisions', 'probe_legacy_collisions.py', 36, 22, True), ('withdraw-order', 'probe_withdraw_order.py', 18, 5, False), ('sell-events', 'probe_sell_events.py', 10, 0, False), ('fee-payout', 'probe_fee_payout.py', 336, 30, True)]
    result = {}
    for name, producer, count, bad, routed in specs:
        records = []
        for location, binary, expected in [('error-order-baselines', baseline, bad), ('error-order', candidate, 0)]:
            report = directory / location / (name + '.json.gz')
            sidecar = directory / location / (name + '-signed-observer.json.gz')
            data, observed = route.load(report), route.load(sidecar)
            assert observed['script_sha256'] == route.sha(HERE / producer)
            assert route.sha(directory / 'supplemental' / producer) == route.sha(HERE / producer)
            if routed:
                proof = route.verify(report, sidecar, binary, HERE / producer, count, expected, core=HERE / 'probe_legacy_edges.py')
            else:
                proof = extra.verify(report, sidecar, binary, HERE / producer, count, expected)
                for row in observed['transactions']:
                    from solders.transaction import Transaction
                    import base64
                    assert len(Transaction.from_bytes(base64.b64decode(row['transaction_base64'])).signatures) == row['signature_count']
                proof['signatures'] = sum(row['signature_count'] for row in observed['transactions'])
            records.append((data, observed))
            result.setdefault(name, {})[location] = proof
        before, after = records
        for a, b in zip(before[0]['cases'], after[0]['cases']):
            assert direct.clean(a['original']) == direct.clean(b['original'])
        for a, b in zip(before[1]['transactions'], after[1]['transactions']):
            assert a['transaction_sha256'] == b['transaction_sha256']
        assert len(before[0]['cases']) == len(after[0]['cases']) == count
    return result

def verify(directory, candidate):
    result = audit(directory, candidate)
    route = module('error_order_load', HERE / 'verify_routes.py')
    assert result == route.load(directory / 'error-order-proof.json')
    return {'cases': sum(row['error-order']['cases'] for row in result.values()), 'baseline_mismatches': sum(row['error-order-baselines']['mismatches'] for row in result.values()), 'candidate_mismatches': 0, 'signatures': sum(proof['signatures'] for row in result.values() for proof in row.values())}
