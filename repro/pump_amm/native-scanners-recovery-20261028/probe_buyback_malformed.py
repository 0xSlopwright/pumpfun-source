"""Offline malformed V2 buyback destination and self-transfer ordering observations."""
import argparse, hashlib, json, re, sys
from pathlib import Path
ROOT = next(p for p in Path(__file__).resolve().parents if (p / 'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0, str(ROOT / 'scripts'))
import pump_amm_trade_v2_differential as h


def modify(case):
    def apply(vm, metas):
        h.mutate(h.CONFIG_KEY, 899, (10000).to_bytes(8, 'little'))(vm, metas)
        if case == 'destination-empty':
            vm.vm.set_account(h.buyback, h.Account(2039280, b'', h.TOKEN))
        elif case == 'destination-wrong-program':
            h.mutate(h.buyback, 0, b'', owner=h.PROGRAM)(vm, metas)
        elif case == 'destination-wrong-mint':
            h.mutate(h.buyback, 0, bytes(h.base))(vm, metas)
        elif case == 'destination-zero-owner':
            h.mutate(h.buyback, 32, bytes(32))(vm, metas)
        elif case == 'destination-unlisted-owner':
            h.mutate(h.buyback, 32, bytes(h.OUTSIDER.pubkey()))(vm, metas)
        elif case == 'destination-wrong-ata':
            old = vm.vm.get_account(h.buyback)
            vm.vm.set_account(h.userquote, h.Account(old.lamports, old.data, old.owner))
            metas[14] = h.AccountMeta(h.userquote, False, True)
        elif case in ['self-wrong-owner', 'self-wrong-owner-and-mint']:
            outsider = h.OUTSIDER.pubkey()
            dest = h.Pubkey.find_program_address(
                [bytes(outsider), bytes(h.TOKEN), bytes(h.quote)],
                h.Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'))[0]
            old = vm.vm.get_account(h.userquote)
            raw = bytearray(old.data)
            raw[32:64] = bytes(outsider)
            if case == 'self-wrong-owner-and-mint':
                raw[:32] = bytes(h.base)
            vm.vm.set_account(dest, h.Account(old.lamports, bytes(raw), old.owner))
            metas[6] = h.AccountMeta(dest, False, True)
            metas[14] = h.AccountMeta(dest, False, True)
            h.mutate(h.CONFIG_KEY, 643, bytes(outsider))(vm, metas)
    return apply


def normalized(v):
    d = dict(v)
    d['logs'] = [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+', '<source>', line)
                 for line in d['logs'] if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units', line)]
    return d


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--candidate', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    a = p.parse_args()
    cases = ['destination-empty', 'destination-wrong-program', 'destination-wrong-mint',
             'destination-zero-owner', 'destination-unlisted-owner', 'destination-wrong-ata',
             'self-wrong-owner', 'self-wrong-owner-and-mint']
    rows = []
    for name in ['buy_v2', 'buy_exact_quote_in_v2']:
        for case in cases:
            kw = dict(amount=10**10 if name == 'buy_v2' else 10**7,
                      limit=10**12 if name == 'buy_v2' else 1, overrides=modify(case))
            x = h.trade(name, **kw)
            y = h.trade(name, candidate=a.candidate, **kw)
            nx, ny = normalized(x), normalized(y)
            diff = [key for key in nx if nx[key] != ny[key]]
            rows.append(dict(instruction=name, case=case, original=x, candidate=y, mismatched_fields=diff))
    sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
    report = dict(scope=__doc__, original_sha256=sha(ROOT / 'evidence/original/pump_amm/deployed.so'),
                  candidate_sha256=sha(a.candidate), probe_sha256=sha(Path(__file__)),
                  case_count=len(rows), mismatch_count=sum(bool(r['mismatched_fields']) for r in rows), cases=rows)
    a.output.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({key: report[key] for key in ['case_count', 'mismatch_count']}))
    for row in rows:
        print(row['instruction'], row['case'], row['original']['error'], row['candidate']['error'], row['mismatched_fields'])
    if report['mismatch_count']:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
