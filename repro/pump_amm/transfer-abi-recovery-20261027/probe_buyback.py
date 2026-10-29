"""Focused offline V2 buyback payout observations against the deployed binary."""
import argparse, hashlib, json, re, sys
from pathlib import Path
ROOT = next(p for p in Path(__file__).resolve().parents if (p / 'evidence/original/pump_amm/deployed.so').is_file())
sys.path.insert(0, str(ROOT / 'scripts'))
import pump_amm_trade_v2_differential as h


def scenario(bps, alias=False, zero_protocol=False, token22=False):
    def apply(vm, metas):
        h.mutate(h.CONFIG_KEY, 899, bps.to_bytes(8, 'little'))(vm, metas)
        if zero_protocol:
            h.custom_fee_table([(0, (25, 0, 5))])(vm, metas)
        if token22:
            h.trade_transferfee(h.quote, 100, 100000)(vm, metas)
        if alias:
            program = h.TOKEN22 if token22 else h.TOKEN
            destination = h.Pubkey.find_program_address(
                [bytes(h.PAYER.pubkey()), bytes(program), bytes(h.quote)],
                h.Pubkey.from_string('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
            )[0]
            old = vm.vm.get_account(h.userquote)
            vm.vm.set_account(destination, h.Account(old.lamports, old.data, old.owner))
            metas[6] = h.AccountMeta(destination, False, True)
            metas[14] = h.AccountMeta(destination, False, True)
            h.mutate(h.CONFIG_KEY, 643, bytes(h.PAYER.pubkey()))(vm, metas)
    return apply


def normalized(value):
    value = dict(value)
    value['logs'] = [re.sub(r'(?<=thrown in )[^ ]+:[0-9]+', '<source>', line)
                     for line in value['logs']
                     if not re.fullmatch(r'Program \w+ consumed \d+ of \d+ compute units', line)]
    return value


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--candidate', type=Path, required=True)
    p.add_argument('--output', type=Path, required=True)
    a = p.parse_args()
    rows = []
    for instruction in ['buy_v2', 'buy_exact_quote_in_v2']:
        for label, options in [
            ('buyback-zero', dict(bps=0)),
            ('buyback-positive', dict(bps=10000)),
            ('protocol-zero', dict(bps=10000, zero_protocol=True)),
            ('self-zero', dict(bps=0, alias=True)),
            ('self-positive', dict(bps=10000, alias=True)),
            ('token22-positive', dict(bps=10000, token22=True)),
            ('token22-self-positive', dict(bps=10000, alias=True, token22=True)),
        ]:
            kw = dict(amount=10**10 if instruction == 'buy_v2' else 10**7,
                      limit=10**12 if instruction == 'buy_v2' else 1,
                      overrides=scenario(**options))
            original = h.trade(instruction, **kw)
            candidate = h.trade(instruction, candidate=a.candidate, **kw)
            no, nc = normalized(original), normalized(candidate)
            diff = [key for key in no if no[key] != nc[key]]
            rows.append(dict(instruction=instruction, case=label, options=options,
                             original=original, candidate=candidate, mismatched_fields=diff))
    sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
    report = dict(scope=__doc__, original_sha256=sha(ROOT / 'evidence/original/pump_amm/deployed.so'),
                  candidate_sha256=sha(a.candidate), probe_sha256=sha(Path(__file__)),
                  case_count=len(rows), mismatch_count=sum(bool(row['mismatched_fields']) for row in rows), cases=rows)
    a.output.write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps({key: report[key] for key in ['case_count', 'mismatch_count']}))
    for row in rows:
        print(row['instruction'], row['case'], row['original']['error'], row['candidate']['error'], row['mismatched_fields'])
    if report['mismatch_count']:
        raise SystemExit(1)

if __name__ == '__main__':
    main()
