"""Signed synthetic cross-product of legacy reserve/error boundaries."""
from pathlib import Path
import argparse, hashlib, json, sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
from pump_amm_legacy_buy_differential import *


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--candidate', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    candidate = args.candidate.resolve()
    maximum = 2**64 - 1
    rows = []
    cases = set()
    quote_values = [0, 1, int.from_bytes(base64.b64decode(f['accounts']['pool_quote_token_account']['data_base64'])[64:72], 'little'), maximum]
    for quote in quote_values:
        fee_pairs = [(0, 0), (quote, 0), (quote, 1), (maximum, 1)]
        virtual_values = [-2**127, -quote - 1, -quote, 0, maximum - quote,
                          maximum - quote + 1, 2**127 - 1]
        for protocol, creator in fee_pairs:
            for virtual in virtual_values:
                cases.add((quote, protocol, creator, virtual))
    for name in ['buy', 'buy_exact_quote_in']:
        for quote, protocol, creator, virtual in sorted(cases):
            def mutate_reserves(harness, metas):
                account = harness.vm.get_account(pool)
                data = bytearray(account.data)
                data[245:261] = virtual.to_bytes(16, 'little', signed=True)
                data[271:279] = protocol.to_bytes(8, 'little')
                data[279:287] = creator.to_bytes(8, 'little')
                harness.vm.set_account(pool, Account(account.lamports, bytes(data), account.owner))
                vault = harness.vm.get_account(vaultquote)
                data = bytearray(vault.data)
                data[64:72] = quote.to_bytes(8, 'little')
                # Synthetic near-maximum native cases primarily qualify guards.
                lamports = min(maximum, quote + 2039280)
                harness.vm.set_account(vaultquote, Account(lamports, bytes(data), vault.owner))
            params = dict(name=name, amount=1000 if name == 'buy' else 10**7,
                          limit=maximum if name == 'buy' else 1,
                          overrides=mutate_reserves)
            original = legacy_buy(**params)
            rebuilt = legacy_buy(candidate=candidate, **params)
            differences = [key for key in original if key != 'logs' and original[key] != rebuilt[key]]
            rows.append({'case': {'instruction': name, 'quote': quote,
                                  'protocol': protocol, 'creator': creator, 'virtual': virtual},
                         'original': original, 'candidate': rebuilt, 'diff': differences})
    sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
    report = {'scope': __doc__, 'candidate_sha256': sha(candidate),
              'original_sha256': sha(ROOT / 'evidence/original/pump_amm/deployed.so'),
              'script_sha256': sha(__file__), 'case_count': len(rows),
              'mismatches': [i for i, row in enumerate(rows) if row['diff']], 'cases': rows,
              'limits': ['Synthetic fixture guard boundaries; not a live economic balance qualification.',
                         'Raw logs are retained but source-coordinate strings are not compared.']}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, separators=(',', ':')) + '\n')
    print(json.dumps({'cases': len(rows), 'mismatches': report['mismatches']}))
    if report['mismatches']:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
